import path from 'node:path'

import kleur from 'kleur'

import { loadConfig } from '../config/load'
import { expandNames } from '../registry/expand'
import { createSource } from '../registry/sources'

export async function list(pattern: string | undefined, { cwd, type }: { cwd: string; type?: string }) {
  const root = path.resolve(cwd)
  const config = await loadConfig(root)
  const all = await createSource(config.registry, root).getIndex()
  let names: Set<string> | undefined
  if (pattern) {
    try {
      names = new Set(expandNames([pattern.includes('*') ? pattern : `*${pattern}*`], all))
    } catch {
      names = new Set()
    }
  }
  const index = all.filter((item) => (!type || item.type === type) && (!names || names.has(item.name)))

  if (index.length === 0) {
    console.log(kleur.dim('No hay items que coincidan.'))
    return
  }
  for (const item of index) {
    const deps = item.registryDependencies.length ? kleur.dim(` → ${item.registryDependencies.join(', ')}`) : ''
    console.log(`${kleur.cyan(item.name)} ${kleur.dim(`[${item.type}]`)} ${item.description ?? ''}${deps}`)
  }
}
