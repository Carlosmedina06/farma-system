import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { AssetGallery, svgEntries } from './AssetGallery'

const modules = import.meta.glob('../../../packages/registry/src/illustrations/**/*.tsx', { eager: true })
const manifests = import.meta.glob('../../../packages/registry/src/illustrations/**/registry-items.json', { eager: true })

function Gallery() {
  return <AssetGallery entries={svgEntries(modules, manifests, { width: '100%', height: 80 })} tileClassName="w-[170px]" />
}

const meta = {
  title: 'Assets/Ilustraciones',
  component: Gallery,
  parameters: { docs: { description: { component: 'Solo las ilustraciones que usa la app. Tocá una para copiar el comando.' } } },
} satisfies Meta<typeof Gallery>

export default meta

export const Todas: StoryObj<typeof meta> = {}
