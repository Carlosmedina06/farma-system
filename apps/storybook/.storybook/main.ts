import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-native-web-vite'
import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'
import { mergeConfig, type Plugin } from 'vite'

const EXPO_TS_DECLARATIONS_GLOBAL = '\0expo-ts-declarations-global'

const stubExpoTsDeclarations = (): Plugin => ({
  name: 'stub-expo-ts-declarations',
  resolveId(source, importer) {
    if (!importer?.includes('expo-modules-core')) return
    if (/(?:^|\/)ts-declarations\/global(?:\.js)?$/.test(source.replaceAll('\\', '/'))) {
      return EXPO_TS_DECLARATIONS_GLOBAL
    }
  },
  load(id) {
    if (
      id === EXPO_TS_DECLARATIONS_GLOBAL ||
      id.replaceAll('\\', '/').includes('/expo-modules-core/build/ts-declarations/global.js')
    ) {
      return 'export {}'
    }
  },
})

const stubTurboModuleRegistry = (): Plugin => ({
  name: 'stub-turbo-module-registry',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').includes('uniwind/dist/module/components/web/index.js')) return
    if (code.includes('TurboModuleRegistry')) return
    return `${code}
export const TurboModuleRegistry = {
  get() { return null },
  getEnforcing() { return new Proxy({}, { get: () => () => undefined }) },
}
`
  },
})

const dirname = path.dirname(fileURLToPath(import.meta.url))
const registrySrc = path.resolve(dirname, '../../../packages/registry/src')
const registryAssets = path.resolve(dirname, '../../../packages/registry/assets')
const repoNodeModules = path.resolve(dirname, '../../../node_modules')

const config: StorybookConfig = {
  staticDirs: [{ from: '../../../packages/registry/assets/fonts', to: '/fonts' }],
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    // Las historias viven junto a cada componente del registry
    '../../../packages/registry/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      },
    },
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [
        stubExpoTsDeclarations(),
        stubTurboModuleRegistry(),
        tailwindcss(),
        uniwind({ cssEntryFile: './global.css', dtsFile: './uniwind-types.d.ts' }),
      ],
      optimizeDeps: {
        include: ['react-native-svg'],
        rolldownOptions: {
          plugins: [stubExpoTsDeclarations()],
        },
      },
      resolve: {
        alias: [
          { find: /^@farma\/registry\//, replacement: `${registrySrc}/` },
          { find: /^@farma\/assets\//, replacement: `${registryAssets}/` },
          { find: /^react-native-svg$/, replacement: `${repoNodeModules}/react-native-svg/src/index.ts` },
          {
            find: '@react-native/assets-registry/registry',
            replacement: `${repoNodeModules}/react-native-web/dist/modules/AssetRegistry/index.js`,
          },
        ],
      },
    }),
}

export default config
