import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { builtItemSchema, registryIndexSchema } from '@farma/registry/schema'

import type { RegistrySource } from './index'

/** Lee el registry ya construido (`dist/r`) desde una carpeta del disco. */
export class LocalSource implements RegistrySource {
  constructor(private readonly dir: string) {}

  async getIndex() {
    return registryIndexSchema.parse(await this.readJson('index.json'))
  }

  async getItem(name: string) {
    return builtItemSchema.parse(await this.readJson(`${name}.json`))
  }

  private async readJson(file: string): Promise<unknown> {
    const full = path.join(this.dir, file)
    try {
      return JSON.parse(await readFile(full, 'utf8'))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          file === 'index.json'
            ? `No se encontró el registry en ${this.dir}. ¿Corriste \`pnpm registry:build\`?`
            : `El componente "${path.basename(file, '.json')}" no existe en el registry.`,
        )
      }
      throw error
    }
  }
}
