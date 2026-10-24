import type { RegistryIndex } from '@farma/registry/schema'

const toRegExp = (pattern: string) =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)

/**
 * Expande comodines (`illustration-kyc-*`) contra el índice del registry.
 * Los nombres sin `*` pasan tal cual; un patrón sin coincidencias es un error.
 */
export function expandNames(names: string[], index: RegistryIndex) {
  const expanded: string[] = []
  for (const name of names) {
    if (!name.includes('*')) {
      expanded.push(name)
      continue
    }
    const regex = toRegExp(name)
    const matches = index.map((item) => item.name).filter((item) => regex.test(item))
    if (matches.length === 0) throw new Error(`Ningún item coincide con "${name}"`)
    expanded.push(...matches)
  }
  return [...new Set(expanded)]
}
