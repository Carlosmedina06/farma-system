import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { add } from '../src/commands/add'
import { createProjectFixture, createRegistryFixture } from './helpers'

const registry = () =>
  createRegistryFixture([
    {
      name: 'utils',
      type: 'lib',
      files: [{ path: 'lib/utils.ts', content: 'export const cn = () => ""\n' }],
    },
    {
      name: 'button',
      registryDependencies: ['utils'],
      files: [{ path: 'ui/button.tsx', content: "import { cn } from '@farma/registry/lib/utils'\n" }],
    },
  ])

describe('add', () => {
  it('copia solo el componente pedido y sus dependencias, con imports reescritos', async () => {
    const cwd = await createProjectFixture(await registry())
    const { items } = await add(['button'], { cwd, skipInstall: true })

    expect(items).toEqual(['utils', 'button'])
    expect(await readFile(path.join(cwd, 'src/ds/ui/button.tsx'), 'utf8')).toBe(
      "import { cn } from '@ds/lib/utils'\n",
    )
    expect(await readFile(path.join(cwd, 'src/ds/lib/utils.ts'), 'utf8')).toContain('cn')
  })

  it('no pisa archivos modificados salvo con --overwrite', async () => {
    const cwd = await createProjectFixture(await registry())
    const file = path.join(cwd, 'src/ds/lib/utils.ts')
    await add(['utils'], { cwd, skipInstall: true })
    await writeFile(file, '// cambio local\n')

    const second = await add(['utils'], { cwd, yes: true, skipInstall: true })
    expect(second.results[0]?.result).toBe('skipped')
    expect(await readFile(file, 'utf8')).toBe('// cambio local\n')

    const third = await add(['utils'], { cwd, overwrite: true, skipInstall: true })
    expect(third.results[0]?.result).toBe('updated')
  })
})
