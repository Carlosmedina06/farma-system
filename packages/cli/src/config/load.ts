import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { CONFIG_FILE, farmaConfigSchema, type FarmaConfig } from './schema'

export async function loadConfig(cwd: string): Promise<FarmaConfig> {
  const file = path.join(cwd, CONFIG_FILE)
  let raw: string
  try {
    raw = await readFile(file, 'utf8')
  } catch {
    throw new Error(`No se encontró ${CONFIG_FILE} en ${cwd}. Ejecuta primero \`farma-system init\`.`)
  }
  return farmaConfigSchema.parse(JSON.parse(raw))
}

export async function writeConfig(cwd: string, config: FarmaConfig) {
  await writeFile(path.join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + '\n')
}
