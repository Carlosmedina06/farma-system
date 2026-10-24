import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import LottieView, { type AnimationObject } from 'lottie-react-native'

import { AssetGallery } from './AssetGallery'

const animations = import.meta.glob('../../../packages/registry/assets/animations/*.json', { eager: true, import: 'default' })

const entries = Object.entries(animations)
  .map(([file, source]) => {
    const name = file.slice(file.lastIndexOf('/') + 1).replace(/\.json$/, '')
    return {
      item: `animation-${name}`,
      label: `animation-${name}`,
      render: () => <LottieView autoPlay loop source={source as AnimationObject} style={{ width: 80, height: 80 }} />,
    }
  })
  .sort((a, b) => a.item.localeCompare(b.item))

function Gallery() {
  return <AssetGallery entries={entries} />
}

const meta = {
  title: 'Assets/Animaciones',
  component: Gallery,
  parameters: {
    docs: { description: { component: 'Animaciones Lottie que usa la app (los .lottie binarios no se previsualizan acá).' } },
  },
} satisfies Meta<typeof Gallery>

export default meta

export const Todas: StoryObj<typeof meta> = {}
