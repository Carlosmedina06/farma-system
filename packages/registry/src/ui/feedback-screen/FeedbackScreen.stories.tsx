import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Button } from '../button/Button'
import { FeedbackScreen } from './FeedbackScreen'
import { useFeedback } from './FeedbackScreenHost'
import type { FeedbackType } from './types/FeedbackScreen.types'

const COPY: Record<FeedbackType, { title: string; subtitle: string }> = {
  success: { title: '¡Listo!', subtitle: 'La operación se completó correctamente.' },
  error: { title: 'Algo salió mal', subtitle: 'No pudimos completar la operación.' },
  warning: { title: 'Revisá los datos', subtitle: 'Hay información que necesitamos confirmar.' },
  info: { title: 'Estamos procesando', subtitle: 'Te avisamos cuando esté listo.' },
}

/** Sin Host: la pantalla controla `visible` con useState. */
function Controlled({ type }: { type: FeedbackType }) {
  const [visible, setVisible] = useState(false)

  return (
    <View>
      <Button onPress={() => setVisible(true)}>Mostrar ({type})</Button>
      <FeedbackScreen
        {...COPY[type]}
        primaryAction={{ label: 'Continuar' }}
        secondaryAction={{ label: 'Volver' }}
        type={type}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </View>
  )
}

function WithHost() {
  const { showFeedback } = useFeedback()

  return (
    <Button
      onPress={() =>
        showFeedback({ ...COPY.success, type: 'success', autoAction: { delayMs: 2500 } })
      }
    >
      showFeedback() (se cierra solo)
    </Button>
  )
}

const meta = {
  title: 'Globales/FeedbackScreen',
  component: Controlled,
  args: { type: 'success' },
  argTypes: { type: { control: 'select', options: Object.keys(COPY) } },
} satisfies Meta<typeof Controlled>

export default meta
type Story = StoryObj<typeof meta>

export const SinHost: Story = {}

export const ConError: Story = { args: { type: 'error' } }

export const ConHost: Story = { render: () => <WithHost /> }
