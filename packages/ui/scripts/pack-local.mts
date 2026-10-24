/**
 * Empaqueta el paquete para instalarlo desde local (sin publicar):
 *   pnpm --filter @carlosmedina/farma-ui pack:local  →  dist/farma-ui.tgz
 *
 * Trabaja sobre una copia: la versión del tarball es `<versión>-local.<fecha>` (única por empaquetado,
 * así yarn no reutiliza su caché), sin tocar el package.json versionado.
 */
import { execFileSync } from 'node:child_process'
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const staging = path.join(dist, 'package')

await rm(dist, { recursive: true, force: true })
await mkdir(staging, { recursive: true })

const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
for (const entry of pkg.files as string[]) {
  await cp(path.join(root, entry), path.join(staging, entry), { recursive: true })
}

const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
const { scripts: _scripts, devDependencies: _devDependencies, ...publishable } = pkg
await writeFile(
  path.join(staging, 'package.json'),
  JSON.stringify({ ...publishable, version: `${pkg.version}-local.${stamp}` }, null, 2) + '\n',
)

const tarball = execFileSync('npm', ['pack', '--silent', '--pack-destination', dist], { cwd: staging, encoding: 'utf8' }).trim()
await rename(path.join(dist, tarball), path.join(dist, 'farma-ui.tgz'))
await rm(staging, { recursive: true, force: true })
console.log(`${pkg.name}@${pkg.version}-local.${stamp} → ${path.relative(process.cwd(), path.join(dist, 'farma-ui.tgz'))}`)
