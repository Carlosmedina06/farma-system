import { statSync } from 'node:fs'
import path from 'node:path'

import { ASSETS_IMPORT_PREFIX, REGISTRY_IMPORT_PREFIX, type RegistryItem } from '../schema'

/** Paquetes que toda app Expo + Uniwind ya tiene; no hace falta declararlos. */
export const BASE_PACKAGES = new Set(['react', 'react-native', 'uniwind'])

/** Prefijos que delatan código de la app. Ningún item puede importarlos. */
const APP_PREFIXES = ['src/', 'assets/', '@utils/', '@hooks/', '@screens/', '@navigation/', '@core/', '@env', 'types/']

const CODE_EXTENSIONS = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

const IMPORT_PATTERNS = [
  /\bimport\s+(?:type\s+)?(?:[\w*{}\s,]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bexport\s+(?:type\s+)?(?:\*|\{[^}]*\})\s*(?:as\s+\w+\s+)?from\s+['"]([^'"]+)['"]/g,
  /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
]

export function findImports(content: string) {
  const specifiers = new Set<string>()
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of content.matchAll(pattern)) {
      specifiers.add(match[1]!)
    }
  }
  return [...specifiers]
}

function packageName(specifier: string) {
  const parts = specifier.split('/')
  return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!
}

interface BoundaryContext {
  srcDir: string
  /** item → archivos de código (relativos a src/) */
  codeOwners: Map<string, string>
  /** item → assets (relativos a assets/) */
  assetOwners: Map<string, string>
  /** cierre transitivo de registryDependencies de cada item */
  closure: (name: string) => Set<string>
}

function resolveCodeFile(srcDir: string, relative: string) {
  for (const ext of CODE_EXTENSIONS) {
    const candidate = relative + ext
    if (statSync(path.join(srcDir, candidate), { throwIfNoEntry: false })?.isFile()) return candidate
  }
  return undefined
}

/**
 * Valida que un item solo importe:
 * - archivos relativos que pertenecen al propio item,
 * - otros items vía `@farma/registry/*` declarados en `registryDependencies`,
 * - assets vía `@farma/assets/*` del propio item o de sus dependencias,
 * - paquetes declarados en `dependencies` (o los base: react, react-native, uniwind).
 */
export function checkBoundary(item: RegistryItem, file: string, content: string, ctx: BoundaryContext) {
  const errors: string[] = []
  const allowed = ctx.closure(item.name)
  const where = `${item.name} (${file})`

  for (const specifier of findImports(content)) {
    const appPrefix = APP_PREFIXES.find((prefix) => specifier === prefix.replace(/\/$/, '') || specifier.startsWith(prefix))
    if (appPrefix) {
      errors.push(`${where}: importa código de la app "${specifier}"`)
      continue
    }

    if (specifier.startsWith('.')) {
      const target = resolveCodeFile(ctx.srcDir, path.posix.join(path.posix.dirname(file), specifier))
      const owner = target && ctx.codeOwners.get(target)
      if (owner !== item.name) {
        errors.push(
          `${where}: el import relativo "${specifier}" sale del item; usa "${REGISTRY_IMPORT_PREFIX}..." y declara la dependencia`,
        )
      }
      continue
    }

    if (specifier.startsWith(REGISTRY_IMPORT_PREFIX)) {
      const target = resolveCodeFile(ctx.srcDir, specifier.slice(REGISTRY_IMPORT_PREFIX.length))
      const owner = target && ctx.codeOwners.get(target)
      if (!owner) {
        errors.push(`${where}: "${specifier}" no pertenece a ningún item`)
      } else if (owner !== item.name && !allowed.has(owner)) {
        errors.push(`${where}: usa "${owner}" pero no está en registryDependencies`)
      }
      continue
    }

    if (specifier.startsWith(ASSETS_IMPORT_PREFIX)) {
      const owner = ctx.assetOwners.get(specifier.slice(ASSETS_IMPORT_PREFIX.length))
      if (!owner) {
        errors.push(`${where}: el asset "${specifier}" no está declarado en ningún item`)
      } else if (owner !== item.name && !allowed.has(owner)) {
        errors.push(`${where}: el asset "${specifier}" es de "${owner}", que no está en registryDependencies`)
      }
      continue
    }

    const pkg = packageName(specifier)
    if (!BASE_PACKAGES.has(pkg) && !item.dependencies.includes(pkg)) {
      errors.push(`${where}: importa "${pkg}" pero no está en dependencies`)
    }
  }
  return errors
}
