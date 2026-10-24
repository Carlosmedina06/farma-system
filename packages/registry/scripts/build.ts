import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  builtItemSchema,
  registryIndexSchema,
  registrySchema,
  type BuiltRegistryItem,
} from '../schema'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')
const outDir = path.join(root, 'dist', 'r')

const manifest = registrySchema.parse(
  JSON.parse(await readFile(path.join(root, 'registry.json'), 'utf8')),
)

const names = new Set(manifest.items.map((item) => item.name))
if (names.size !== manifest.items.length) {
  throw new Error('registry.json tiene items con nombres duplicados')
}
for (const item of manifest.items) {
  for (const dep of item.registryDependencies) {
    if (!names.has(dep)) {
      throw new Error(`"${item.name}" depende de "${dep}", que no existe en registry.json`)
    }
  }
}

await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

for (const item of manifest.items) {
  const built: BuiltRegistryItem = builtItemSchema.parse({
    ...item,
    files: await Promise.all(
      item.files.map(async (file) => ({
        ...file,
        content: await readFile(path.join(srcDir, file.path), 'utf8'),
      })),
    ),
  })
  await writeFile(path.join(outDir, `${item.name}.json`), JSON.stringify(built, null, 2) + '\n')
}

const index = registryIndexSchema.parse(manifest.items)
await writeFile(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2) + '\n')

console.log(`registry: ${manifest.items.length} item(s) → ${path.relative(process.cwd(), outDir)}`)
