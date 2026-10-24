import { existsSync } from 'node:fs'
import path from 'node:path'

import kleur from 'kleur'
import prompts from 'prompts'

import { writeConfig } from '../config/load'
import { CONFIG_FILE, farmaConfigSchema } from '../config/schema'
import { createSource } from '../registry/sources'
import { readPackageJson } from '../utils/package-manager'
import { add } from './add'

export interface InitOptions {
  cwd: string
  registry?: string
  yes?: boolean
  skipInstall?: boolean
}

export async function init(options: InitOptions) {
  const cwd = path.resolve(options.cwd)
  const deps = await readPackageJson(cwd)
  for (const required of ['expo', 'uniwind']) {
    if (!(required in deps)) {
      console.warn(kleur.yellow(`⚠ ${required} no está en package.json; farma-system está pensado para Expo + Uniwind.`))
    }
  }

  if (existsSync(path.join(cwd, CONFIG_FILE)) && !options.yes) {
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: `${CONFIG_FILE} ya existe. ¿Reemplazarlo?`,
      initial: false,
    })
    if (!confirm) return
  }

  const defaults = {
    registry: options.registry ?? 'local:../farma-system/packages/registry/dist/r',
    baseDir: 'src/ds',
    importAlias: 'src/ds',
    assetsDir: 'assets/farma',
    assetsAlias: 'assets/farma',
  }

  const answers = options.yes
    ? defaults
    : await prompts(
        [
          { type: 'text', name: 'registry', message: 'Registry (local:<ruta> o npm:<paquete>)', initial: defaults.registry },
          { type: 'text', name: 'baseDir', message: 'Carpeta donde copiar los componentes', initial: defaults.baseDir },
          { type: 'text', name: 'importAlias', message: 'Alias de import para esa carpeta', initial: defaults.importAlias },
          { type: 'text', name: 'assetsDir', message: 'Carpeta para assets (fuentes, animaciones)', initial: defaults.assetsDir },
          { type: 'text', name: 'assetsAlias', message: 'Alias de import para esos assets', initial: defaults.assetsAlias },
        ],
        { onCancel: () => process.exit(1) },
      )

  const config = farmaConfigSchema.parse(answers)
  await writeConfig(cwd, config)
  console.log(`${kleur.green('✔')} ${CONFIG_FILE} creado`)

  const index = await createSource(config.registry, cwd).getIndex()
  let selected: string[] = []
  if (!options.yes && index.length > 0) {
    const picked = await prompts(
      {
        type: 'multiselect',
        name: 'components',
        message: 'Componentes a instalar',
        hint: 'espacio marca, enter confirma',
        instructions: false,
        choices: index
          .filter((item) => item.name !== 'utils')
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => ({
            title: `${item.name}  ${item.description ?? ''}`.trim(),
            value: item.name,
          })),
      },
      { onCancel: () => process.exit(1) },
    )
    selected = picked.components ?? []
  }

  await add(['utils', ...selected], { cwd, yes: options.yes, skipInstall: options.skipInstall })
  console.log(`${kleur.green('✔')} Listo. Cualquier otro: ${kleur.cyan('farma-system add <nombre>')}`)
}
