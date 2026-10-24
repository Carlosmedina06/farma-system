import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import Text from '../text/Text'
import { Snackbar } from './Snackbar'
import { SnackbarType } from './Snackbar.types'

const meta = {
  title: 'Globales/Snackbar',
  component: Snackbar,
  args: { text: 'Se guardaron los cambios', type: SnackbarType.Default, withIcon: true, withCloseIcon: false },
  argTypes: { type: { control: 'select', options: Object.values(SnackbarType) } },
  decorators: [(Story) => <View className="h-[80px]"><Story /></View>],
} satisfies Meta<typeof Snackbar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConAccion: Story = { args: { actionText: 'Deshacer', withCloseIcon: true } }

/** Sin Host ni estado global: la pantalla controla la visibilidad con su propio useState. */
function Controlled() {
  const [visible, setVisible] = useState(false)

  return (
    <View className="h-[200px] gap-4">
      <Pressable className="rounded-md bg-primary-600 p-3" onPress={() => setVisible(true)}>
        <Text className="text-center text-white">Mostrar (sin Host)</Text>
      </Pressable>
      {visible && (
        <View className="h-[80px]">
          <Snackbar withCloseIcon withIcon text="Controlado con useState" type={SnackbarType.Success} onClose={() => setVisible(false)} />
        </View>
      )}
    </View>
  )
}

export const SinHost: Story = { render: () => <Controlled /> }
