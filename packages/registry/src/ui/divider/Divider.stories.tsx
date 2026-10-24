import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Divider } from './Divider'

const SIZES = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const

const meta = {
  title: 'Átomos/Divider',
  component: Divider,
  args: { size: 'md', type: 'line' },
  argTypes: {
    size: { control: 'select', options: SIZES },
    type: { control: 'inline-radio', options: ['line', 'text'] },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConTexto: Story = {
  args: { type: 'text', label: 'o', size: 'md' },
}

export const Tamaños: Story = {
  render: () => (
    <View>
      {SIZES.map((size) => (
        <Divider key={size} size={size} />
      ))}
    </View>
  ),
}
