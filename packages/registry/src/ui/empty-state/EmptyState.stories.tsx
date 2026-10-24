import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Icon } from '../icon'
import { EmptyState } from './EmptyState'

const SampleIllustration = () => (
  <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-100">
    <Icon color="#98A2B3" name="search-sm" size={56} />
  </View>
)

const meta = {
  title: 'Moléculas/EmptyState',
  component: EmptyState,
  args: {
    content: { title: 'No encontramos resultados', label: 'Probá con otra búsqueda o revisá los filtros.' },
    illustration: <SampleIllustration />,
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SinIlustracion: Story = { args: { illustration: undefined } }

export const SoloTitulo: Story = { args: { content: { title: 'Todavía no hay nada acá' } } }
