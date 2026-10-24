import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import type { BuiltRegistryItem } from '@farma/registry/schema'

type FixtureItem = Pick<BuiltRegistryItem, 'name'> & Partial<BuiltRegistryItem>

/** Crea un registry construido (`dist/r`) falso en un directorio temporal. */
export async function createRegistryFixture(items: FixtureItem[]) {
  const dir = await mkdtemp(path.join(tmpdir(), 'farma-registry-'))
  const full = items.map((item) => ({
    type: 'ui' as const,
    dependencies: [],
    registryDependencies: [],
    files: [{ path: `ui/${item.name}.tsx`, content: `export const ${item.name} = 1\n` }],
    ...item,
  }))
  for (const item of full) {
    await writeFile(path.join(dir, `${item.name}.json`), JSON.stringify(item))
  }
  await writeFile(
    path.join(dir, 'index.json'),
    JSON.stringify(full.map(({ name, type, registryDependencies }) => ({ name, type, registryDependencies }))),
  )
  return dir
}

export async function createProjectFixture(registryDir: string) {
  const dir = await mkdtemp(path.join(tmpdir(), 'farma-app-'))
  await writeFile(
    path.join(dir, 'package.json'),
    JSON.stringify({ name: 'app', dependencies: { expo: '~58.0.0', uniwind: '^1.13.0' } }),
  )
  await writeFile(
    path.join(dir, 'farma.json'),
    JSON.stringify({ registry: `local:${registryDir}`, baseDir: 'src/ds', importAlias: '@ds' }),
  )
  await mkdir(path.join(dir, 'src'), { recursive: true })
  return dir
}
