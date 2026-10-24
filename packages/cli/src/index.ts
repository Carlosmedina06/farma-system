import { Command } from 'commander'
import kleur from 'kleur'

import { add, type AddOptions } from './commands/add'
import { init } from './commands/init'
import { list } from './commands/list'

const program = new Command()
  .name('farma-system')
  .description('Agrega componentes del design system de Farma a tu app Expo + Uniwind')

program
  .command('init')
  .description('Crea farma.json e instala las utilidades base')
  .option('-c, --cwd <path>', 'directorio del proyecto', process.cwd())
  .option('-r, --registry <spec>', 'registry (local:<ruta> o npm:<paquete>)')
  .option('-y, --yes', 'usar valores por defecto sin preguntar')
  .option('--skip-install', 'no instalar dependencias npm')
  .action(init)

program
  .command('add')
  .description('Copia uno o más componentes (y sus dependencias) al proyecto')
  .argument('<names...>', 'nombres de los componentes')
  .option('-c, --cwd <path>', 'directorio del proyecto', process.cwd())
  .option('-o, --overwrite', 'sobrescribir archivos existentes sin preguntar')
  .option('-y, --yes', 'no preguntar; omite archivos que ya existen salvo con --overwrite')
  .option('--skip-install', 'no instalar dependencias npm')
  .action(async (names: string[], options: AddOptions) => {
    await add(names, options)
  })

program
  .command('list')
  .description('Lista los componentes disponibles en el registry')
  .option('-c, --cwd <path>', 'directorio del proyecto', process.cwd())
  .action(list)

program.parseAsync().catch((error: unknown) => {
  console.error(kleur.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
