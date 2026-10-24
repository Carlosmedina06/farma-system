import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Button } from '../button/Button'
import { Modal } from './Modal'
import type { ModalProps } from './Modal.types'
import { modal } from './ModalHost'

type Variant = 'normal' | 'compact' | 'fullScreen' | 'feedback' | 'success'

const VARIANT_PROPS: Record<Variant, Partial<ModalProps>> = {
  normal: {},
  compact: { isCompactModal: true },
  fullScreen: { fullScreen: true },
  feedback: { feedback: true, fullScreen: true },
  success: { isSuccess: true },
}

const BASE: ModalProps = {
  title: '¿Querés continuar?',
  description: 'Esta acción no se puede deshacer.',
  icon: { icon: 'alert-circle', type: 'warning' },
}

/** Sin Host ni estado global: la pantalla controla `visible` con useState. */
function Controlled({ variant }: { variant: Variant }) {
  const [visible, setVisible] = useState(false)
  const close = () => setVisible(false)

  return (
    <View>
      <Button onPress={() => setVisible(true)}>Abrir modal ({variant})</Button>
      <Modal
        {...BASE}
        {...VARIANT_PROPS[variant]}
        close={close}
        primaryAction={{ children: 'Confirmar', onPress: close }}
        secondaryAction={{ children: 'Cancelar', type: 'secondary', onPress: close }}
        visible={visible}
      />
    </View>
  )
}

const meta = {
  title: 'Globales/Modal',
  component: Controlled,
  args: { variant: 'normal' },
  argTypes: { variant: { control: 'select', options: Object.keys(VARIANT_PROPS) } },
} satisfies Meta<typeof Controlled>

export default meta
type Story = StoryObj<typeof meta>

export const SinHost: Story = {}

export const Compacto: Story = { args: { variant: 'compact' } }

export const PantallaCompleta: Story = { args: { variant: 'fullScreen' } }

export const Exito: Story = { args: { variant: 'success' } }

/** Con `<ModalHost />` montado en el root (acá, en el decorator de Storybook). */
export const ConHost: Story = {
  render: () => (
    <Button
      onPress={() =>
        modal.show({
          ...BASE,
          primaryAction: { children: 'Entendido', onPress: modal.hide },
        })
      }
    >
      modal.show()
    </Button>
  ),
}
