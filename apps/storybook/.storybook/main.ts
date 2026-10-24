import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-native-web-vite'
import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'
import { mergeConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const registrySrc = path.resolve(dirname, '../../../packages/registry/src')

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
    // Las historias viven junto a cada componente del registry
    '../../../packages/registry/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [
        tailwindcss(),
        uniwind({ cssEntryFile: './global.css', dtsFile: './uniwind-types.d.ts' }),
      ],
      resolve: {
        alias: [{ find: /^@farma\/registry\//, replacement: `${registrySrc}/` }],
      },
    }),
}

export default config
