import { describe, expect, it } from 'vitest'

import { resolveItems } from '../src/registry/resolve'
import { LocalSource } from '../src/registry/sources/local'
import { createRegistryFixture } from './helpers'

describe('resolveItems', () => {
  it('incluye dependencias transitivas antes que quien las usa, sin duplicados', async () => {
    const dir = await createRegistryFixture([
      { name: 'utils', type: 'lib' },
      { name: 'text', registryDependencies: ['utils'] },
      { name: 'spinner', registryDependencies: ['utils'] },
      { name: 'button', registryDependencies: ['text', 'spinner', 'utils'] },
    ])
    const items = await resolveItems(new LocalSource(dir), ['button', 'text'])
    expect(items.map((item) => item.name)).toEqual(['utils', 'text', 'spinner', 'button'])
  })

  it('no entra en bucle con dependencias circulares', async () => {
    const dir = await createRegistryFixture([
      { name: 'a', registryDependencies: ['b'] },
      { name: 'b', registryDependencies: ['a'] },
    ])
    const items = await resolveItems(new LocalSource(dir), ['a'])
    expect(items.map((item) => item.name).sort()).toEqual(['a', 'b'])
  })

  it('falla con un mensaje claro si el item no existe', async () => {
    const dir = await createRegistryFixture([])
    await expect(resolveItems(new LocalSource(dir), ['nope'])).rejects.toThrow('"nope" no existe')
  })
})
