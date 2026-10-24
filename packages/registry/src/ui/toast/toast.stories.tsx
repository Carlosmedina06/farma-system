import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useEffect } from 'react'
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
      <Pressable
        className="rounded-md bg-primary-600 p-3"
        onPress={() =>
          toast.show({
            text: 'Margen 16px e ícono de 18px',
            type: ToastType.Default,
            withIcon: true,
            withCloseIcon: true,
            iconSize: 18,
            className: 'mx-padding-xl',
          })
        }
      >
        <Text className="text-center text-white">toast.show(className + iconSize)</Text>
      </Pressable>
    </View>
  )
}

/** Dispara 4 toasts seguidos: se ven los 3 más nuevos (el último abajo) y el primero se descarta. */
function Stack() {
  useEffect(() => {
    const steps = [
      { text: 'Agregaste un producto', type: ToastType.Success },
      { text: 'Guardamos tu dirección', type: ToastType.DefaultSuccess },
      { text: 'No pudimos actualizar el carrito', type: ToastType.Error },
      { text: 'Eliminaste un producto', type: ToastType.Default },
    ]
    const timers = steps.map((step, index) =>
      setTimeout(() => toast.show({ ...step, withIcon: true, withCloseIcon: true, duration: 60000 }), index * 400),
    )
    return () => {
      timers.forEach(clearTimeout)
      toast.hide()
    }
  }, [])

  return (
    <View className="gap-3 pt-[320px]">
      <Pressable className="rounded-md bg-primary-600 p-3" onPress={() => toast.show({ text: `Toast ${Date.now() % 1000}`, withIcon: true })}>
        <Text className="text-center text-white">Agregar otro</Text>
      </Pressable>
    </View>
  )
}

const meta = { title: 'Globales/Toast (con Host)', component: Demo } satisfies Meta<typeof Demo>

export default meta

export const ConHost: StoryObj<typeof meta> = {}

export const Pila: StoryObj<typeof meta> = { render: () => <Stack /> }
