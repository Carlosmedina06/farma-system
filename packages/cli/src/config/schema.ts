import { z } from 'zod'

export const CONFIG_FILE = 'farma.json'

export const farmaConfigSchema = z.object({
  $schema: z.string().optional(),
  /**
   * De dónde se leen los componentes:
   * - `local:<ruta a dist/r>` (relativa al proyecto)
   * - `npm:<paquete>` (lee `<paquete>/dist/r` desde node_modules)
   */
  registry: z.string().regex(/^(local|npm):.+/, 'debe empezar con "local:" o "npm:"'),
  /** Carpeta del proyecto donde se copian los items (respeta la estructura ui/lib/hooks/theme). */
  baseDir: z.string().default('src/ds'),
  /** Alias con el que el proyecto importa `baseDir` (debe existir en tsconfig/babel). */
  importAlias: z.string().default('src/ds'),
  /** Carpeta del proyecto donde se copian los assets (fuentes, lotties). */
  assetsDir: z.string().default('assets/farma'),
  /** Alias con el que el proyecto importa `assetsDir`. */
  assetsAlias: z.string().default('assets/farma'),
})

export type FarmaConfig = z.infer<typeof farmaConfigSchema>
