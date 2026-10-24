import path from 'node:path'

import kleur from 'kleur'

import { loadConfig } from '../config/load'
import { createSource } from '../registry/sources'

export async function list({ cwd }: { cwd: string }) {
  const root = path.resolve(cwd)
  const config = await loadConfig(root)
  const index = await createSource(config.registry, root).getIndex()

  if (index.length === 0) {
    console.log(kleur.dim('El registry no tiene items todavía.'))
    return
  }
  for (const item of index) {
    const deps = item.registryDependencies.length ? kleur.dim(` → ${item.registryDependencies.join(', ')}`) : ''
    console.log(`${kleur.cyan(item.name)} ${kleur.dim(`[${item.type}]`)} ${item.description ?? ''}${deps}`)
  }
}
