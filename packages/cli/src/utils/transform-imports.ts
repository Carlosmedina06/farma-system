import { ASSETS_IMPORT_PREFIX, REGISTRY_IMPORT_PREFIX } from '@farma/registry/schema'

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

/** Reescribe `@farma/registry/...` y `@farma/assets/...` a los alias del proyecto destino. */
export function transformImports(content: string, aliases: { importAlias: string; assetsAlias: string }) {
  return content
    .replace(new RegExp(`(['"])${escape(REGISTRY_IMPORT_PREFIX)}`, 'g'), `$1${aliases.importAlias.replace(/\/$/, '')}/`)
    .replace(new RegExp(`(['"])${escape(ASSETS_IMPORT_PREFIX)}`, 'g'), `$1${aliases.assetsAlias.replace(/\/$/, '')}/`)
}
