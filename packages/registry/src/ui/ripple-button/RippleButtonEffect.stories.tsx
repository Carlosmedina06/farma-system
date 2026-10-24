import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { RippleButtonEffect } from './RippleButtonEffect'

function Demo(props: React.ComponentProps<typeof RippleButtonEffect>) {
  const [count, setCount] = useState(0)

  return (
    <View className="w-80 gap-3">
      <RippleButtonEffect {...props} onPress={() => setCount((c) => c + 1)}>
        <View className="rounded-md border border-gray-200 px-4 py-3">
          <Text type="body1">Presióname</Text>
        </View>
      </RippleButtonEffect>
      <Text className="text-gray-600" type="caption">
        Presionado {count} veces
      </Text>
    </View>
  )
}

const meta = {
  title: 'Moléculas/RippleButtonEffect',
  component: RippleButtonEffect,
  args: { disabled: false, children: <View /> },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof RippleButtonEffect>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Deshabilitado: Story = { args: { disabled: true } }

export const ColorPersonalizado: Story = { args: { rippleColor: '#d4d8fd', pressedColor: '#eef0ff' } }
