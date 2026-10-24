import path from 'node:path'

import kleur from 'kleur'

import { loadConfig } from '../config/load'
import { resolveItems } from '../registry/resolve'
import { createSource } from '../registry/sources'
import { installDependencies } from '../utils/package-manager'
import { transformImports } from '../utils/transform-imports'
import { writeProjectFile, type WriteResult } from '../utils/write-files'

export interface AddOptions {
  cwd: string
  overwrite?: boolean
  yes?: boolean
  skipInstall?: boolean
}

const LABELS: Record<WriteResult, string> = {
  created: kleur.green('creado'),
  updated: kleur.yellow('actualizado'),
  unchanged: kleur.dim('sin cambios'),
  skipped: kleur.dim('omitido'),
}

export async function add(names: string[], options: AddOptions) {
  const cwd = path.resolve(options.cwd)
  const config = await loadConfig(cwd)
  const source = createSource(config.registry, cwd)
  const items = await resolveItems(source, names)

  const extra = items.map((item) => item.name).filter((name) => !names.includes(name))
  if (extra.length > 0) {
    console.log(kleur.dim(`Dependencias del registry: ${extra.join(', ')}`))
  }

  const results: { file: string; result: WriteResult }[] = []
  for (const item of items) {
    for (const file of item.files) {
      const isAsset = file.type === 'asset'
      const target = path.join(cwd, isAsset ? config.assetsDir : config.baseDir, file.path)
      const content =
        file.encoding === 'base64' ? Buffer.from(file.content, 'base64') : transformImports(file.content, config)
      const result = await writeProjectFile(target, content, options)
      results.push({ file: path.relative(cwd, target), result })
      console.log(`  ${LABELS[result]} ${path.relative(cwd, target)}`)
    }
  }

  const deps = items.flatMap((item) => item.dependencies)
  const installed = options.skipInstall ? [] : await installDependencies(cwd, deps)
  if (installed.length > 0) {
    console.log(kleur.dim(`Dependencias instaladas: ${installed.join(', ')}`))
  }

  return { items: items.map((item) => item.name), results, installed }
}
