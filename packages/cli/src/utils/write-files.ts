import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import prompts from 'prompts'

export type WriteResult = 'created' | 'updated' | 'unchanged' | 'skipped'

export async function writeProjectFile(
  target: string,
  content: string,
  { overwrite, yes }: { overwrite?: boolean; yes?: boolean },
): Promise<WriteResult> {
  if (existsSync(target)) {
    if ((await readFile(target, 'utf8')) === content) return 'unchanged'
    if (!overwrite) {
      if (yes) return 'skipped'
      const { confirm } = await prompts({
        type: 'confirm',
        name: 'confirm',
        message: `${path.relative(process.cwd(), target)} ya existe y es distinto. ¿Sobrescribir?`,
        initial: false,
      })
      if (!confirm) return 'skipped'
    }
    await writeFile(target, content)
    return 'updated'
  }
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content)
  return 'created'
}
