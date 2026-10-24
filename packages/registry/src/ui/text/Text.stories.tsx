import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import Text from './Text'

const TYPES = ['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption', 'blue', 'gray', 'semiGray', 'price', 'mono-lg', 'mono-sm', 'navbar'] as const

const meta = {
  title: 'Fundamentos/Text',
  component: Text,
  args: { children: 'El veloz murciélago hindú', type: 'body1', semibold: false },
  argTypes: { type: { control: 'select', options: TYPES } },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Escala: Story = {
  render: () => (
    <View className="gap-3">
      {TYPES.map((type) => (
        <Text key={type} type={type}>
          {type} · Hola mundo 1234
        </Text>
      ))}
    </View>
  ),
}
