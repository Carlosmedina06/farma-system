import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { StepHeader } from './StepHeader'
import type { StepHeaderProps } from './StepHeader.types'

function ControlledStepHeader(props: StepHeaderProps) {
  const [active, setActive] = useState(props.activeStep)
  const last = props.steps.length - 1

  return (
    <View className="w-96 gap-3">
      <StepHeader
        {...props}
        activeStep={active}
        onBack={props.onBack ? () => setActive((s) => Math.max(0, s - 1)) : undefined}
      />
      <View className="flex-row gap-2 px-4">
        <Pressable
          className="rounded-md bg-gray-100 px-3 py-2"
          onPress={() => setActive((s) => Math.max(0, s - 1))}
        >
          <Text type="body2">Anterior</Text>
        </Pressable>
        <Pressable
          className="rounded-md bg-gray-100 px-3 py-2"
          onPress={() => setActive((s) => Math.min(last + 1, s + 1))}
        >
          <Text type="body2">Siguiente</Text>
        </Pressable>
      </View>
    </View>
  )
}

const meta = {
  title: 'Moléculas/StepHeader',
  component: StepHeader,
  args: { steps: ['Datos', 'Confirmación'], activeStep: 0 },
  render: (args) => <ControlledStepHeader {...args} />,
} satisfies Meta<typeof StepHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConVolver: Story = { args: { onBack: () => {} } }

export const TresPasos: Story = { args: { steps: ['Carrito', 'Envío', 'Resumen'], activeStep: 1 } }

export const Completado: Story = { args: { steps: ['Uno', 'Dos'], activeStep: 2 } }
