import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { AssetGallery, svgEntries } from './AssetGallery'

const modules = import.meta.glob('../../../packages/registry/src/icons/**/*.tsx', { eager: true })
const manifests = import.meta.glob('../../../packages/registry/src/icons/**/registry-items.json', { eager: true })

function Gallery() {
  return <AssetGallery entries={svgEntries(modules, manifests, { width: 40, height: 40 })} />
}

const meta = {
  title: 'Assets/Íconos SVG',
  component: Gallery,
  parameters: {
    docs: { description: { component: 'Íconos SVG (marcas, logos, misc). Se usan con <SvgIcon icon={X} /> o directo.' } },
  },
} satisfies Meta<typeof Gallery>

export default meta

export const Todos: StoryObj<typeof meta> = {}
