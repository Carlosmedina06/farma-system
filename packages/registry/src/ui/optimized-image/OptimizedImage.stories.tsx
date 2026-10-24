import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import OptimizedImage from './OptimizedImage'
import type { FailedImageCache } from './OptimizedImage.types'

const FALLBACK = { uri: 'https://placehold.co/200x200/png?text=Sin+imagen' }

const memoryCache = (): FailedImageCache => {
  const failed = new Set<string>()

  return { has: (uri) => failed.has(uri), add: (uri) => void failed.add(uri) }
}

const meta = {
  title: 'Átomos/OptimizedImage',
  component: OptimizedImage,
  args: {
    url: 'https://picsum.photos/id/237/400/400',
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  argTypes: {
    resizeMode: { control: 'select', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
  },
} satisfies Meta<typeof OptimizedImage>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const UrlInvalidaConFallback: Story = {
  args: { url: 'no-es-una-url', fallbackSource: FALLBACK },
}

export const UrlRotaConCache: Story = {
  args: {
    url: 'https://example.invalid/imagen-rota.png',
    fallbackSource: FALLBACK,
    failedCache: memoryCache(),
  },
}

export const SinFallback: Story = {
  args: { url: null, className: 'bg-gray-100' },
}
