import type { BuiltRegistryItem } from '@farma/registry/schema'

import type { RegistrySource } from './sources'

/**
 * Devuelve los items pedidos junto con todas sus `registryDependencies`,
 * sin duplicados y ordenados de forma que cada dependencia va antes que quien la usa.
 */
export async function resolveItems(source: RegistrySource, names: string[]) {
  const resolved = new Map<string, BuiltRegistryItem>()
  const visiting = new Set<string>()

  async function visit(name: string) {
    if (resolved.has(name) || visiting.has(name)) return
    visiting.add(name)
    const item = await source.getItem(name)
    for (const dep of item.registryDependencies) {
      await visit(dep)
    }
    visiting.delete(name)
    resolved.set(name, item)
  }

  for (const name of names) {
    await visit(name)
  }
  return [...resolved.values()]
}
