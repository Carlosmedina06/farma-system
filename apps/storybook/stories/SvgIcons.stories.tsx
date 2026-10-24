import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { miscIcons } from '@farma/registry/ui/icon'

import { AssetGallery, svgEntries, type GalleryEntry } from './AssetGallery'

const modules = import.meta.glob('../../../packages/registry/src/icons/**/*.tsx', { eager: true })
const manifests = import.meta.glob('../../../packages/registry/src/icons/**/registry-items.json', { eager: true })

/** Íconos `misc-*`: vienen con el item `icon` y se usan como `<Icon name="misc-…" />`. */
const miscEntries: GalleryEntry[] = Object.entries(miscIcons).map(([name, Svg]) => ({
  item: name,
  label: name,
  render: () => <Svg color="#344054" height={40} width={40} />,
}))

function Gallery() {
  return (
    <AssetGallery
      entries={[...miscEntries, ...svgEntries(modules, manifests, { width: 40, height: 40 })]}
    />
  )
}

const meta = {
  title: 'Assets/Íconos SVG',
  component: Gallery,
  parameters: {
    docs: {
      description: {
        component:
          '`misc-*` (61): incluidos en `icon`, se usan con `<Icon name="misc-…" />`. `icon-*`: SVG sueltos, `farma-system add icon-…`.',
      },
    },
  },
} satisfies Meta<typeof Gallery>

export default meta

export const Todos: StoryObj<typeof meta> = {}
