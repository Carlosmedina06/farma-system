import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import Text from '../text/Text'
import { Snackbar } from './Snackbar'

const meta = {
  title: 'Globales/Snackbar',
  component: Snackbar,
  args: { open: true, text: 'No tenés internet. Revisá tu conexión', variant: 'neutral', entrance: 'fade' },
  argTypes: { variant: { control: 'select', options: ['neutral', 'success', 'error'] } },
} satisfies Meta<typeof Snackbar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConAccion: Story = {
  args: { variant: 'error', text: 'No pudimos validar los datos', actionText: 'Reintentar', onDismiss: () => {} },
}

function Toggle() {
  const [open, setOpen] = useState(false)

  return (
    <View className="pt-[120px]">
      <Snackbar open={open} text="Conexión restablecida" variant="success" />
      <Pressable className="rounded-md bg-primary-600 p-3" onPress={() => setOpen((value) => !value)}>
        <Text className="text-center text-white">{open ? 'Ocultar' : 'Mostrar'}</Text>
      </Pressable>
    </View>
  )
}

export const Animado: Story = { render: () => <Toggle /> }
