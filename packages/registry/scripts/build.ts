import { glob, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  builtItemSchema,
  registryIndexSchema,
  registryItemSourceSchema,
  registryItemsSourceSchema,
  type BuiltRegistryItem,
  type RegistryItem,
} from '../schema'
import { checkBoundary } from './boundary'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')
const assetsDir = path.join(root, 'assets')
const outDir = path.join(root, 'dist', 'r')

const toPosix = (p: string) => p.split(path.sep).join('/')

/** Carga cada `registry-item.json` / `registry-items.json` y deja las rutas de código relativas a `src/`. */
async function loadItems(): Promise<RegistryItem[]> {
  const items: RegistryItem[] = []
  for await (const manifest of glob('**/registry-item{,s}.json', { cwd: srcDir })) {
    const itemDir = toPosix(path.dirname(manifest))
    const raw = JSON.parse(await readFile(path.join(srcDir, manifest), 'utf8'))
    const parsed = manifest.endsWith('registry-items.json')
      ? registryItemsSourceSchema.parse(raw)
      : [registryItemSourceSchema.parse(raw)]
    for (const item of parsed) {
      items.push({
        ...item,
        files: item.files.map((file) =>
          file.type === 'asset' ? file : { ...file, path: path.posix.join(itemDir, file.path) },
        ),
      })
    }
  }
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

const items = await loadItems()
const byName = new Map(items.map((item) => [item.name, item]))
const errors: string[] = []

if (byName.size !== items.length) {
  errors.push('Hay items con nombres duplicados')
}
for (const item of items) {
  for (const dep of item.registryDependencies) {
    if (!byName.has(dep)) errors.push(`"${item.name}" depende de "${dep}", que no existe`)
  }
}

const codeOwners = new Map<string, string>()
const assetOwners = new Map<string, string>()
for (const item of items) {
  for (const file of item.files) {
    const owners = file.type === 'asset' ? assetOwners : codeOwners
    const previous = owners.get(file.path)
    if (previous) errors.push(`"${file.path}" está en "${previous}" y en "${item.name}"`)
    owners.set(file.path, item.name)
  }
}

const closureCache = new Map<string, Set<string>>()
function closure(name: string, seen = new Set<string>()): Set<string> {
  const cached = closureCache.get(name)
  if (cached) return cached
  const result = new Set<string>()
  seen.add(name)
  for (const dep of byName.get(name)?.registryDependencies ?? []) {
    result.add(dep)
    if (!seen.has(dep)) for (const nested of closure(dep, seen)) result.add(nested)
  }
  closureCache.set(name, result)
  return result
}

const built: BuiltRegistryItem[] = []
for (const item of items) {
  const files = await Promise.all(
    item.files.map(async (file) => {
      if (file.type === 'asset') {
        const content = await readFile(path.join(assetsDir, file.path))
        return { ...file, content: content.toString('base64'), encoding: 'base64' as const }
      }
      const content = await readFile(path.join(srcDir, file.path), 'utf8')
      if (/\.(tsx?|jsx?)$/.test(file.path)) {
        errors.push(...checkBoundary(item, file.path, content, { srcDir, codeOwners, assetOwners, closure }))
      }
      return { ...file, content, encoding: 'utf8' as const }
    }),
  )
  built.push(builtItemSchema.parse({ ...item, files }))
}

if (errors.length > 0) {
  console.error(`registry: ${errors.length} error(es)\n` + errors.map((error) => `  ✖ ${error}`).join('\n'))
  process.exit(1)
}

if (process.argv.includes('--check')) {
  console.log(`registry: ${items.length} item(s) OK (sin escribir dist)`)
  process.exit(0)
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })
for (const item of built) {
  await writeFile(path.join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2) + '\n')
}
await writeFile(path.join(outDir, 'index.json'), JSON.stringify(registryIndexSchema.parse(items), null, 2) + '\n')

console.log(`registry: ${items.length} item(s) → ${path.relative(process.cwd(), outDir)}`)
