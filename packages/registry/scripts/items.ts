import { glob, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { registryItemSourceSchema, registryItemsSourceSchema, type RegistryItem } from '../schema'

export const registryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const registrySrc = path.join(registryRoot, 'src')
export const registryAssets = path.join(registryRoot, 'assets')

const toPosix = (p: string) => p.split(path.sep).join('/')

/** Carga cada `registry-item.json` / `registry-items.json` y deja las rutas de código relativas a `src/`. */
export async function loadItems(): Promise<RegistryItem[]> {
  const items: RegistryItem[] = []
  for await (const manifest of glob('**/registry-item{,s}.json', { cwd: registrySrc })) {
    const itemDir = toPosix(path.dirname(manifest))
    const raw = JSON.parse(await readFile(path.join(registrySrc, manifest), 'utf8'))
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
