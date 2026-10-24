import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Tag } from './Tag'

const meta = {
  title: 'Átomos/Tag',
  component: Tag,
  args: { text: 'Etiqueta', size: 'lg' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tamaños: Story = {
  render: () => (
    <View className="gap-2">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Tag key={size} counter={3} size={size} text={`size ${size}`} onClose={() => {}} />
      ))}
    </View>
  ),
}

export const Variantes: Story = {
  render: () => (
    <View className="gap-2">
      <Tag checked text="Checkbox marcado" />
      <Tag checked={false} text="Checkbox vacío" />
      <Tag icon={{ name: 'stars-selected', color: '#f79009' }} text="Con icono" />
      <Tag counter={12} text="Con contador" />
      <Tag text="Con cierre" onClose={() => {}} />
    </View>
  ),
}
