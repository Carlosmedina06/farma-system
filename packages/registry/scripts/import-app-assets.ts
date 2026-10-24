/**
 * Importa al registry SOLO los assets que app-mobile usa de verdad:
 * ilustraciones e íconos SVG (como componentes TSX con react-native-svg) y animaciones Lottie.
 *
 *   pnpm assets:import --app ../../../app-mobile
 *
 * Es reejecutable: borra lo generado y lo vuelve a crear a partir del uso actual de la app.
 * No modifica la app. Escribe `docs/assets-map.json` (ruta vieja → item e import nuevos) para la migración.
 */
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { transform, type Config } from '@svgr/core'

import type { RegistryItem } from '../schema'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'src')
const assetsDir = path.join(root, 'assets')

const { values } = parseArgs({ options: { app: { type: 'string' } } })
if (!values.app) throw new Error('Uso: pnpm assets:import --app <ruta a app-mobile>')
const app = path.resolve(process.cwd(), values.app)

/** Propiedades CSS que react-native-svg ignora; se quitan para que el TSX tipe sin cambiar el render. */
const UNSUPPORTED_STYLE = /^(mix-blend-mode|display)$/

/** Quita `xmlns:xlink`, `overflow` del <svg> raíz y las propiedades de `style` que react-native-svg no soporta. */
const stripUnsupportedForNative = {
  name: 'stripUnsupportedForNative',
  fn: () => ({
    element: {
      enter: (node: { name: string; attributes: Record<string, string> }) => {
        delete node.attributes['xmlns:xlink']
        if (node.name === 'svg') delete node.attributes.overflow
        const style = node.attributes.style
        if (style === undefined) return
        const kept = style
          .split(';')
          .map((rule) => rule.trim())
          .filter((rule) => rule && !UNSUPPORTED_STYLE.test(rule.split(':')[0]!.trim()))
        if (kept.length > 0) node.attributes.style = kept.join(';')
        else delete node.attributes.style
      },
    },
  }),
}

/**
 * Misma configuración que react-native-svg-transformer + .svgrrc.js de la app: el TSX queda idéntico a lo que hoy
 * genera Metro. Única diferencia: se quitan atributos que react-native-svg ignora (`xmlns`, `xmlns:xlink`,
 * `overflow`, `mix-blend-mode`, `display`) para que el código tipe; no cambia el render.
 */
const SVGR_CONFIG: Config = {
  native: true,
  typescript: true,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  replaceAttrValues: { currentColor: '{props.color}' },
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
          },
        },
      },
      'removeXMLNS',
      stripUnsupportedForNative,
    ],
  },
}

/** Assets que ya existen como componentes del DS: no se duplican. */
const ALREADY_IN_DS: Record<string, { item: string; import: string }> = {
  'svg/icons/check': { item: 'check-icon', import: "import { CheckIcon } from 'src/ds/ui/check-icon'" },
  'svg/icons/pdf-icon': { item: 'selected-files-panel', import: "import { PdfIcon } from 'src/ds/ui/selected-files-panel'" },
  'svg/icons/vector': { item: 'vector', import: "import { Vector } from 'src/ds/ui/vector'" },
}

const MISC_MAP = 'src/design/_core/generated/misc-icons.ts'

const kebab = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
const pascal = (value: string) =>
  kebab(value)
    .split('-')
    .map((part) => (/^\d/.test(part) ? part : part[0]!.toUpperCase() + part.slice(1)))
    .join('')
    .replace(/^(\d)/, 'Svg$1')
const stripExt = (value: string) => value.replace(/\.(svg|json|png|lottie|tsx)$/, '')
const isTest = (file: string) => /\/__tests__\/|\.test\.|__mocks__/.test(file)

// 1. Código de la app (sin tests) ---------------------------------------------------------------
const sources = new Map<string, string>()
for (const pattern of ['src/**/*.{ts,tsx,js}', 'modules/**/*.{ts,tsx,js}', 'App.tsx', 'app.config.js']) {
  for await (const file of glob(pattern, { cwd: app })) {
    if (isTest(file) || file.includes('node_modules')) continue
    sources.set(file, await readFile(path.join(app, file), 'utf8'))
  }
}

// 2. Referencias directas a assets/… (alias o relativas) ------------------------------------------
const usedBy = new Map<string, Set<string>>()
const use = (asset: string, file: string) => {
  if (!usedBy.has(asset)) usedBy.set(asset, new Set())
  usedBy.get(asset)!.add(file)
}
for (const [file, text] of sources) {
  if (file === MISC_MAP) continue
  for (const match of text.matchAll(/['"]((?:\.\.?\/)*assets\/[^'"]+)['"]/g)) {
    const raw = match[1]!
    use(stripExt(raw.slice(raw.indexOf('assets/') + 'assets/'.length)), file)
  }
}

// 3. misc-icons: se usan por clave ('misc-visa'), no por ruta ----------------------------------------
const miscText = sources.get(MISC_MAP) ?? ''
const miscImports = new Map([...miscText.matchAll(/import (\w+) from 'assets\/([^']+?)(?:\.svg)?'/g)].map((m) => [m[1]!, m[2]!]))
const miscEntries: { key: string; asset: string; usedBy: string[] }[] = []
for (const [, key, variable] of miscText.matchAll(/'(misc-[\w-]+)':\s*(\w+)/g)) {
  const asset = miscImports.get(variable!)
  if (!asset) continue
  const keyRegex = new RegExp(`['"\`]${key!.replace(/[-]/g, '\\-')}['"\`]`)
  const users = [...sources].filter(([file, text]) => file !== MISC_MAP && keyRegex.test(text)).map(([file]) => file)
  miscEntries.push({ key: key!, asset: asset.replace(/\.svg$/, ''), usedBy: users.sort() })
}

// 4. Generación --------------------------------------------------------------------------------------
type Entry = { item: RegistryItem; dir: string }
const manifests = new Map<string, RegistryItem[]>()
const assetsMap: Record<string, { item: string; import: string; usedBy: string[] }> = {}
const add = ({ item, dir }: Entry) => {
  if (!manifests.has(dir)) manifests.set(dir, [])
  manifests.get(dir)!.push(item)
}

await rm(path.join(srcDir, 'illustrations'), { recursive: true, force: true })
await rm(path.join(srcDir, 'icons'), { recursive: true, force: true })
await rm(path.join(srcDir, 'animations'), { recursive: true, force: true })
await rm(path.join(assetsDir, 'animations'), { recursive: true, force: true })

const svgFiles: string[] = []
for await (const file of glob('assets/svg/**/*.{svg,tsx}', { cwd: app })) svgFiles.push(file)

let generated = 0
for (const file of svgFiles.sort()) {
  const asset = stripExt(file.slice('assets/'.length)) // svg/illustrations/kyc/ok
  const users = [...(usedBy.get(asset) ?? [])].sort()
  if (users.length === 0) continue
  if (ALREADY_IN_DS[asset]) {
    assetsMap[asset] = { ...ALREADY_IN_DS[asset]!, usedBy: users }
    continue
  }

  if (asset.startsWith('svg/misc-icons/')) continue // van dentro del item `icon` (ver abajo)

  const parts = asset.split('/').slice(1) // illustrations/kyc/ok | icons/faceid | pharmacy-profile/logo
  const base = parts.at(-1)!
  let kind: 'illustration' | 'icon'
  let dir: string
  let itemName: string
  if (parts[0] === 'illustrations' || parts[0] === 'pharmacy-profile') {
    kind = 'illustration'
    const group = parts[0] === 'pharmacy-profile' ? ['pharmacy-profile'] : parts.slice(1, -1)
    dir = path.posix.join('illustrations', ...(group.length ? group : ['general']))
    itemName = ['illustration', ...group, base.replace(/^ilus-/, '')].map(kebab).join('-')
  } else {
    kind = 'icon'
    dir = path.posix.join('icons', 'svg')
    itemName = `icon-${kebab(base)}`
  }

  const component = pascal(kind === 'illustration' ? base.replace(/^ilus-/, '') : base)
  const fileName = `${component}.tsx`
  const outDir = path.join(srcDir, dir)
  await mkdir(outDir, { recursive: true })
  const content = await readFile(path.join(app, file), 'utf8')
  const code = file.endsWith('.tsx')
    ? content
    : await transform(content, SVGR_CONFIG, { componentName: component, filePath: file })
  await writeFile(path.join(outDir, fileName), `// Generado desde app-mobile/${file} por scripts/import-app-assets.ts\n${code}`)

  add({
    dir,
    item: {
      name: itemName,
      type: kind,
      description: component,
      files: [{ path: fileName, type: 'code' }],
      dependencies: ['react-native-svg'],
      registryDependencies: [],
    },
  })
  assetsMap[asset] = {
    item: itemName,
    import: `import ${component} from 'src/ds/${dir}/${component}'`,
    usedBy: users,
  }
  generated++
}

// misc-*: todos, con las mismas claves que app-mobile, dentro del item `icon` (<Icon name="misc-visa" />)
const iconDir = path.join(srcDir, 'ui/icon')
await rm(path.join(iconDir, 'misc'), { recursive: true, force: true })
await mkdir(path.join(iconDir, 'misc'), { recursive: true })
const miscLines: string[] = []
for (const { key, asset, usedBy: users } of miscEntries.sort((a, b) => a.key.localeCompare(b.key))) {
  const component = pascal(key.replace(/^misc-/, ''))
  const file = `assets/${asset}.svg`
  const code = await transform(await readFile(path.join(app, file), 'utf8'), SVGR_CONFIG, { componentName: component, filePath: file })
  await writeFile(path.join(iconDir, 'misc', `${component}.tsx`), `// Generado desde app-mobile/${file} por scripts/import-app-assets.ts\n${code}`)
  miscLines.push(`  '${key}': ${component},`)
  assetsMap[key] = { item: 'icon', import: `<Icon name="${key}" />`, usedBy: users }
}
const miscComponents = miscEntries.map(({ key }) => pascal(key.replace(/^misc-/, ''))).sort()
await writeFile(
  path.join(iconDir, 'misc-icons.ts'),
  [
    '// Generado por scripts/import-app-assets.ts: íconos SVG `misc-*` con las mismas claves que app-mobile.',
    ...miscComponents.map((c) => `import ${c} from './misc/${c}'`),
    '',
    'export const miscIcons = {',
    ...miscLines,
    '} as const',
    '',
    'export type MiscIconName = keyof typeof miscIcons',
    '',
  ].join('\n'),
)
const iconManifestPath = path.join(iconDir, 'registry-item.json')
const iconManifest = JSON.parse(await readFile(iconManifestPath, 'utf8')) as RegistryItem
iconManifest.files = [
  ...iconManifest.files.filter((f) => f.type === 'asset' || !(f.path.startsWith('misc/') || f.path === 'misc-icons.ts')),
  { path: 'misc-icons.ts', type: 'code' },
  ...miscComponents.map((c) => ({ path: `misc/${c}.tsx`, type: 'code' as const })),
]
await writeFile(iconManifestPath, JSON.stringify(iconManifest, null, 2) + '\n')

// Lottie: items solo-asset; la app los usa con require('assets/farma/animations/<archivo>')
let animations = 0
for await (const file of glob('assets/lottie-animations/*.{json,lottie}', { cwd: app })) {
  const asset = stripExt(file.slice('assets/'.length))
  const users = [...(usedBy.get(asset) ?? [])].sort()
  if (users.length === 0) continue
  const fileName = path.basename(file)
  await mkdir(path.join(assetsDir, 'animations'), { recursive: true })
  await copyFile(path.join(app, file), path.join(assetsDir, 'animations', fileName))
  const itemName = `animation-${kebab(stripExt(fileName))}`
  add({
    dir: 'animations',
    item: {
      name: itemName,
      type: 'animation',
      description: `Animación Lottie ${fileName}`,
      files: [{ path: `animations/${fileName}`, type: 'asset' }],
      dependencies: ['lottie-react-native'],
      registryDependencies: [],
    },
  })
  assetsMap[asset] = { item: itemName, import: `require('assets/farma/animations/${fileName}')`, usedBy: users }
  animations++
}

for (const [dir, items] of manifests) {
  await mkdir(path.join(srcDir, dir), { recursive: true })
  await writeFile(
    path.join(srcDir, dir, 'registry-items.json'),
    JSON.stringify(items.sort((a, b) => a.name.localeCompare(b.name)), null, 2) + '\n',
  )
}

const mapFile = path.resolve(root, '../../docs/assets-map.json')
await mkdir(path.dirname(mapFile), { recursive: true })
await writeFile(mapFile, JSON.stringify(Object.fromEntries(Object.entries(assetsMap).sort()), null, 2) + '\n')

console.log(`assets: ${generated} SVG → TSX, ${miscEntries.length} íconos misc en \`icon\`, ${animations} animaciones, mapa en ${path.relative(process.cwd(), mapFile)}`)
