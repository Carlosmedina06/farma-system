import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun'

const LOCKFILES: [string, PackageManager][] = [
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lock', 'bun'],
  ['bun.lockb', 'bun'],
  ['package-lock.json', 'npm'],
]

export function detectPackageManager(cwd: string): PackageManager {
  let dir = cwd
  while (true) {
    for (const [file, pm] of LOCKFILES) {
      if (existsSync(path.join(dir, file))) return pm
    }
    const parent = path.dirname(dir)
    if (parent === dir) return 'npm'
    dir = parent
  }
}

export async function readPackageJson(cwd: string) {
  const raw = await readFile(path.join(cwd, 'package.json'), 'utf8')
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  return { ...pkg.dependencies, ...pkg.devDependencies }
}

/** Instala las dependencias que falten; en apps Expo usa `expo install` para elegir versiones compatibles con el SDK. */
export async function installDependencies(cwd: string, deps: string[]) {
  const installed = await readPackageJson(cwd)
  const missing = [...new Set(deps)].filter((dep) => !(dep in installed))
  if (missing.length === 0) return []

  const [cmd, args] =
    'expo' in installed
      ? ['npx', ['expo', 'install', ...missing]]
      : [detectPackageManager(cwd), ['add', ...missing]]

  await new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`\`${cmd} ${args.join(' ')}\` terminó con código ${code}`)),
    )
  })
  return missing
}
