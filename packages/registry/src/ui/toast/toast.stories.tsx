import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Pressable, View } from 'react-native'

import Text from '../text/Text'
import { ToastType, toast } from './toast'

function Demo() {
  const buttons = [
    { label: 'Default', type: ToastType.Default },
    { label: 'Éxito', type: ToastType.Success },
    { label: 'Error', type: ToastType.Error },
    { label: 'Neutro con check', type: ToastType.DefaultSuccess },
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
