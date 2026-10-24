/**
 * Arma el paquete npm @farma/ui a partir del registry (la fuente de verdad):
 *
 *  1. copia el código de cada item a src/ (sin tests ni stories), reescribiendo
 *     `@farma/registry/x` y `@farma/assets/x` a rutas relativas dentro del paquete;
 *  2. copia assets (fuentes, animaciones) a assets/ y el theme a theme.css;
 *  3. compila src/ → lib/ (JS + .d.ts) con tsc;
 *  4. genera package.json con un `exports` por componente y las dependencias como peerDependencies.
 *
 * Así la app hace `import { Button } from '@farma/ui/button'` y Metro solo empaqueta lo que importa.
 */
import { execFileSync } from 'node:child_process'
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadItems, registryAssets, registryRoot, registrySrc } from '@farma/registry/items'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcOut = path.join(root, 'src')
const assetsOut = path.join(root, 'assets')
const libOut = path.join(root, 'lib')

/** Paquetes que toda app del DS ya tiene: peers obligatorios. El resto son opcionales (dependen de qué importes). */
const REQUIRED_PEERS = ['react', 'react-native', 'uniwind']
/** Items que no se exponen como entry propio (se usan internamente). */
const INTERNAL = new Set(['asset-types', 'theme'])

const toPosix = (p: string) => p.split(path.sep).join('/')
const relativeImport = (fromFile: string, target: string) => {
  const rel = toPosix(path.relative(path.dirname(fromFile), target))
  return rel.startsWith('.') ? rel : `./${rel}`
}

const items = await loadItems()

await Promise.all([srcOut, assetsOut, libOut, path.join(root, 'theme.css')].map((p) => rm(p, { recursive: true, force: true })))

// 1-2. código, assets y theme ---------------------------------------------------------------------------
for (const item of items) {
  for (const file of item.files) {
    if (file.type === 'asset') {
      await mkdir(path.dirname(path.join(assetsOut, file.path)), { recursive: true })
      await copyFile(path.join(registryAssets, file.path), path.join(assetsOut, file.path))
      continue
    }
    if (item.type === 'theme') {
      await copyFile(path.join(registrySrc, file.path), path.join(root, 'theme.css'))
      continue
    }
    const target = path.join(srcOut, file.path)
    let content = await readFile(path.join(registrySrc, file.path), 'utf8')
    if (/\.(tsx?)$/.test(file.path)) {
      content = content
        .replace(/(['"])@farma\/registry\/([^'"]+)\1/g, (_, q: string, p: string) => `${q}${relativeImport(target, path.join(srcOut, p))}${q}`)
        .replace(/(['"])@farma\/assets\/([^'"]+)\1/g, (_, q: string, p: string) => `${q}${relativeImport(target, path.join(assetsOut, p))}${q}`)
    }
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content)
  }
}

// 3. compilación ------------------------------------------------------------------------------------------
await writeFile(
  path.join(root, 'tsconfig.build.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        resolveJsonModule: true,
        declaration: true,
        rootDir: 'src',
        outDir: 'lib',
        types: [],
      },
      include: ['src', path.relative(root, path.join(registryRoot, 'uniwind-types.d.ts'))],
    },
    null,
    2,
  ) + '\n',
)
execFileSync('npx', ['tsc', '-p', 'tsconfig.build.json'], { cwd: root, stdio: 'inherit' })

// 4. package.json -----------------------------------------------------------------------------------------
const registryPkg = JSON.parse(await readFile(path.join(registryRoot, 'package.json'), 'utf8'))
const versions: Record<string, string> = { ...registryPkg.devDependencies, ...registryPkg.dependencies }
const peers = new Set(REQUIRED_PEERS)
for (const item of items) item.dependencies.forEach((dep) => peers.add(dep))

const entry = (dir: string) => ({ types: `./lib/${dir}/index.d.ts`, default: `./lib/${dir}/index.js` })
const exports: Record<string, unknown> = {}
for (const item of items) {
  if (INTERNAL.has(item.name) || ['illustration', 'icon', 'animation'].includes(item.type)) continue
  const dir = path.posix.dirname(item.files.find((f) => f.type === 'code' && f.path.endsWith('index.ts'))!.path)
  exports[`./${item.name}`] = entry(dir)
}
Object.assign(exports, {
  './illustrations/*': { types: './lib/illustrations/*.d.ts', default: './lib/illustrations/*.js' },
  './icons/*': { types: './lib/icons/*.d.ts', default: './lib/icons/*.js' },
  './animations/*': './assets/animations/*',
  './fonts/*': './assets/fonts/*',
  './theme.css': './theme.css',
  './package.json': './package.json',
})

const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
const sortedPeers = [...peers].sort()
await writeFile(
  pkgPath,
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      license: pkg.license,
      sideEffects: false,
      files: ['lib', 'assets', 'theme.css'],
      exports,
      // Versiones exactas del registry → rango con ^ (la app elige el patch).
      peerDependencies: Object.fromEntries(
        sortedPeers.map((dep) => [dep, (versions[dep] ?? '*').replace(/^(\d)/, '^$1')]),
      ),
      peerDependenciesMeta: Object.fromEntries(
        sortedPeers.filter((dep) => !REQUIRED_PEERS.includes(dep)).map((dep) => [dep, { optional: true }]),
      ),
      scripts: { build: 'tsx scripts/build.mts', pack: 'pnpm build && rm -rf dist && pnpm pack --pack-destination dist && mv dist/farma-ui-*.tgz dist/farma-ui.tgz' },
      devDependencies: pkg.devDependencies,
    },
    null,
    2,
  ) + '\n',
)

console.log(`@farma/ui: ${Object.keys(exports).length} entries, ${sortedPeers.length} peerDependencies → lib/`)
