import { REGISTRY_IMPORT_PREFIX } from '@farma/registry/schema'

/** Reescribe `@farma/registry/...` al alias que usa el proyecto destino. */
export function transformImports(content: string, importAlias: string) {
  const prefix = REGISTRY_IMPORT_PREFIX.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
  const alias = importAlias.replace(/\/$/, '')
  return content.replace(new RegExp(`(['"])${prefix}`, 'g'), `$1${alias}/`)
}
