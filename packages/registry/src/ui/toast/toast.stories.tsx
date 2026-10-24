import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Pressable, View } from 'react-native'

import { SnackbarType } from '../snackbar/Snackbar.types'
import Text from '../text/Text'
import { toast } from './toast'

/** El `<ToastHost />` está montado una vez en el decorator global de Storybook (como en el root de la app). */
function Demo() {
  const buttons = [
    { label: 'Default', type: SnackbarType.Default },
    { label: 'Éxito', type: SnackbarType.Success },
    { label: 'Error', type: SnackbarType.Error },
    { label: 'Neutro con check', type: SnackbarType.DefaultSuccess },
  ]

  return (
    <View className="gap-3 pt-[120px]">
      {buttons.map(({ label, type }) => (
        <Pressable
          key={type}
          className="rounded-md bg-primary-600 p-3"
          onPress={() => toast.show({ text: `Toast ${label.toLowerCase()}`, type, withIcon: true, withCloseIcon: true })}
        >
          <Text className="text-center text-white">toast.show({label})</Text>
        </Pressable>
      ))}
    </View>
  )
}

const meta = { title: 'Globales/Toast (con Host)', component: Demo } satisfies Meta<typeof Demo>

export default meta

export const ConHost: StoryObj<typeof meta> = {}
