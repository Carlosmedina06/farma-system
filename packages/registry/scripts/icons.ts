/**
 * Genera la fuente farmaIcons SOLO con los glifos que se usan:
 *  - los que usan los componentes del registry (escaneo de src/),
 *  - los que usa la app (`--app <ruta>`; se guardan en icons-src/used-app.json para no depender de la app),
 *  - los que manda el backend (icons-src/keep-backend.json, a mano).
 *
 *   pnpm icons:build --app ../../../app-mobile   # re-escanea la app
 *   pnpm icons:build                             # usa el último used-app.json
 *
 * Recorta icons-src/farmaIcons.full.ttf (mismos glifos y codepoints) y escribe
 * assets/fonts/farmaIcons.ttf + src/ui/icon/glyph-map.json (de donde sale el tipo IconName).
 */
import { glob, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import subsetFont from 'subset-font'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const iconsSrc = path.join(root, 'icons-src')
const fullMap: Record<string, number> = JSON.parse(await readFile(path.join(iconsSrc, 'glyph-map.full.json'), 'utf8'))

const { values } = parseArgs({ options: { app: { type: 'string' } } })

const SKIP = /\/__tests__\/|\.test\.|\.stories\.|__mocks__|node_modules/
const LITERAL = /['"`]([^'"`\n]{1,60})['"`]/g

/** Nombres de glifo que aparecen como string literal en el código de `dir`. */
async function scanGlyphs(dir: string, pattern: string) {
  const found = new Set<string>()
  for await (const file of glob(pattern, { cwd: dir })) {
    if (SKIP.test(file)) continue
    const text = await readFile(path.join(dir, file), 'utf8')
    for (const [, literal] of text.matchAll(LITERAL)) {
      if (literal! in fullMap) found.add(literal!)
    }
  }
  return found
}

const usedAppFile = path.join(iconsSrc, 'used-app.json')
let appIcons: string[]
if (values.app) {
  appIcons = [...(await scanGlyphs(path.resolve(process.cwd(), values.app), 'src/**/*.{ts,tsx}'))].sort()
  await writeFile(usedAppFile, JSON.stringify(appIcons, null, 1) + '\n')
} else {
  appIcons = JSON.parse(await readFile(usedAppFile, 'utf8').catch(() => '[]'))
}

const registryIcons = await scanGlyphs(path.join(root, 'src'), '**/*.{ts,tsx}')
const backend: { icons: string[] } = JSON.parse(await readFile(path.join(iconsSrc, 'keep-backend.json'), 'utf8'))
const unknown = backend.icons.filter((name) => !(name in fullMap))
if (unknown.length > 0) throw new Error(`keep-backend.json tiene íconos que no existen en la fuente: ${unknown.join(', ')}`)

const keep = [...new Set([...registryIcons, ...appIcons, ...backend.icons])].sort()
const subsetMap = Object.fromEntries(keep.map((name) => [name, fullMap[name]!]))
const text = String.fromCodePoint(...Object.values(subsetMap))

const full = await readFile(path.join(iconsSrc, 'farmaIcons.full.ttf'))
const subset = await subsetFont(full, text, { targetFormat: 'truetype' })
await writeFile(path.join(root, 'assets/fonts/farmaIcons.ttf'), subset)
await writeFile(path.join(root, 'src/ui/icon/glyph-map.json'), JSON.stringify(subsetMap, null, 2) + '\n')

// Stories que usan íconos fuera de la fuente se verían vacías en Storybook.
const keepSet = new Set(keep)
for await (const file of glob('**/*.stories.tsx', { cwd: path.join(root, 'src') })) {
  const text = await readFile(path.join(root, 'src', file), 'utf8')
  const missing = [...text.matchAll(LITERAL)].map((m) => m[1]!).filter((v) => v in fullMap && !keepSet.has(v))
  if (missing.length > 0) console.warn(`⚠ ${file} usa íconos que no están en la fuente: ${[...new Set(missing)].join(', ')}`)
}

console.log(
  `icons: ${keep.length}/${Object.keys(fullMap).length} glifos ` +
    `(registry ${registryIcons.size}, app ${appIcons.length}, backend ${backend.icons.length}) · ` +
    `${Math.round(full.length / 1024)} KB → ${Math.round(subset.length / 1024)} KB`,
)
