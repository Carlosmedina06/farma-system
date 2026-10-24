import { createRequire } from 'node:module'
import path from 'node:path'

import type { BuiltRegistryItem, RegistryIndex } from '@farma/registry/schema'

import { LocalSource } from './local'

export interface RegistrySource {
  getIndex(): Promise<RegistryIndex>
  getItem(name: string): Promise<BuiltRegistryItem>
}

export function createSource(spec: string, cwd: string): RegistrySource {
  const [kind, ...rest] = spec.split(':')
  const target = rest.join(':')

  switch (kind) {
    case 'local':
      return new LocalSource(path.resolve(cwd, target))
    case 'npm': {
      // El paquete npm publica el mismo `dist/r` que se usa en local.
      const require = createRequire(path.join(cwd, 'package.json'))
      const pkgDir = path.dirname(require.resolve(`${target}/package.json`))
      return new LocalSource(path.join(pkgDir, 'dist', 'r'))
    }
    default:
      throw new Error(`Registry no soportado: "${spec}"`)
  }
}
