import { z } from 'zod'

/**
 * Formato del registry. Lo comparten el script de build (que lo valida)
 * y el CLI (que lo consume), sin importar si el registry viene de una ruta
 * local o de un paquete npm.
 */
export const registryItemTypeSchema = z.enum(['ui', 'lib', 'hook', 'theme'])

export const registryFileSchema = z.object({
  /** Ruta relativa a `src/` del registry y a `baseDir` del proyecto destino. */
  path: z.string().min(1),
})

export const registryItemSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, 'usa kebab-case'),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  files: z.array(registryFileSchema).min(1),
  /** Paquetes npm que necesita el item (se instalan con `expo install`). */
  dependencies: z.array(z.string()).default([]),
  /** Otros items del registry de los que depende. */
  registryDependencies: z.array(z.string()).default([]),
})

export const registrySchema = z.object({
  items: z.array(registryItemSchema),
})

export const builtFileSchema = registryFileSchema.extend({
  content: z.string(),
})

export const builtItemSchema = registryItemSchema.extend({
  files: z.array(builtFileSchema).min(1),
})

export const registryIndexSchema = z.array(
  registryItemSchema.pick({
    name: true,
    type: true,
    description: true,
    registryDependencies: true,
  }),
)

export type RegistryItem = z.infer<typeof registryItemSchema>
export type BuiltRegistryItem = z.infer<typeof builtItemSchema>
export type RegistryIndex = z.infer<typeof registryIndexSchema>

/** Prefijo con el que los items del registry se importan entre sí. */
export const REGISTRY_IMPORT_PREFIX = '@farma/registry/'
