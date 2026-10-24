import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import glyphMap from '@farma/registry/ui/icon/glyph-map.json'
import { Icon, miscIcons, type IconName } from '@farma/registry/ui/icon'

import { AssetGallery, svgEntries, type GalleryEntry } from './AssetGallery'

const modules = import.meta.glob('../../../packages/registry/src/icons/**/*.tsx', { eager: true })
const manifests = import.meta.glob('../../../packages/registry/src/icons/**/registry-items.json', { eager: true })

/** Glifos de la fuente farmaIcons: `<Icon name="…" />` (vienen con el item `icon`). */
const glyphs: GalleryEntry[] = Object.keys(glyphMap).map((name) => ({
  item: name,
  label: name,
  render: () => <Icon className="text-gray-700" name={name as IconName} size={32} />,
}))

/** SVG `misc-*`: `<Icon name="misc-…" />` (vienen con el item `icon`). */
const misc: GalleryEntry[] = Object.keys(miscIcons).map((name) => ({
  item: name,
  label: name,
  render: () => <Icon color="#344054" name={name as IconName} size={40} />,
}))

/** SVG sueltos: `farma-system add icon-…`. */
const svg = svgEntries(modules, manifests, { width: 40, height: 40 })

const ALL = [...glyphs, ...misc, ...svg]

function Gallery({ entries, copyPrefix = '' }: { entries: GalleryEntry[]; copyPrefix?: string }) {
  return <AssetGallery copyPrefix={copyPrefix} entries={entries} tileClassName="w-[90px]" />
}

const meta = {
  title: 'Assets/Íconos',
  component: Gallery,
  args: { entries: ALL },
  argTypes: { entries: { table: { disable: true } }, copyPrefix: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        component: `${ALL.length} íconos: ${glyphs.length} glifos y ${misc.length} misc-* (\`<Icon name="…" />\`) + ${svg.length} SVG sueltos (\`farma-system add icon-…\`).`,
      },
    },
  },
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const Todos: Story = {}

export const Fuente: Story = { args: { entries: glyphs } }

export const Misc: Story = { args: { entries: misc } }

export const SvgSueltos: Story = { args: { entries: svg, copyPrefix: 'farma-system add ' } }
