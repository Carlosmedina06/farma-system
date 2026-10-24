import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { AttemptLimitModal } from './AttemptLimitModal'
import type { AttemptLimitModalProps } from './AttemptLimitModal.types'

function AttemptLimitModalDemo(props: Omit<AttemptLimitModalProps, 'visible' | 'onButtonPress'>) {
  const [visible, setVisible] = useState(true)

  return (
    <View className="relative" style={{ height: 600 }}>
      <Pressable className="bg-primary-600 m-4 self-start rounded-md px-4 py-3" onPress={() => setVisible(true)}>
        <Text semibold className="text-white">
          Mostrar modal
        </Text>
      </Pressable>
      <AttemptLimitModal {...props} visible={visible} onButtonPress={() => setVisible(false)} />
    </View>
  )
}

const meta = {
  title: 'Moléculas/AttemptLimitModal',
  component: AttemptLimitModalDemo,
  args: {
    title: 'Superaste la cantidad de intentos',
    description: 'Volvé a probar en 10:00.',
    buttonText: 'Volver al inicio',
    icon: 'alert-circle',
    iconType: 'warning',
  },
  argTypes: {
    iconType: { control: 'select', options: ['warning', 'error', 'info', 'gray', 'success', 'success-green'] },
  },
} satisfies Meta<typeof AttemptLimitModalDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SinDescripcion: Story = { args: { description: undefined } }

export const Error: Story = { args: { iconType: 'error', icon: 'x-circle', title: 'Algo salió mal' } }
