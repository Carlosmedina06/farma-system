import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Badge } from './Badge'
import type { ColorName, SizeProp } from './Badge.types'

const COLORS: ColorName[] = [
  'gray',
  'primary',
  'error',
  'warning',
  'success',
  'blue',
  'blue-gray',
  'blue-light',
  'indigo',
  'purple',
  'pink',
  'rose',
  'orange',
  'info',
  'tertiary',
]
const SIZES: SizeProp[] = ['xs', 'sm', 'md', 'lg', 'wide']

const meta = {
  title: 'Átomos/Badge',
  component: Badge,
  args: { children: 'Badge', color: 'primary', size: 'md', radius: 'lg' },
  argTypes: {
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: SIZES },
    radius: { control: 'inline-radio', options: ['s', 'lg'] },
    textType: { control: 'select', options: [undefined, 'body1', 'body2', 'caption'] },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Colores: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      {COLORS.map((color) => (
        <Badge key={color} color={color} size="sm">
          {color}
        </Badge>
      ))}
    </View>
  ),
}

export const Tamaños: Story = {
  render: () => (
    <View className="items-start gap-2">
      {SIZES.map((size) => (
        <Badge key={size} color="gray" size={size}>
          {size}
        </Badge>
      ))}
    </View>
  ),
}

export const ConIcono: Story = {
  render: () => (
    <View className="items-start gap-2">
      <Badge color="success" icon="check" size="md">
        Icono izquierda
      </Badge>
      <Badge iconRightSide color="warning" icon="info-circle" size="md">
        Icono derecha
      </Badge>
      <Badge
        iconRightSide
        className="text-warning-800"
        color="warning"
        icon="info-circle"
        iconClassName="text-warning-600"
        iconSize={16}
        size="xs"
      >
        Color de icono por clase
      </Badge>
    </View>
  ),
}

export const Semibold: Story = {
  args: { semibold: true, size: 'wide', children: 'Activa' },
}
