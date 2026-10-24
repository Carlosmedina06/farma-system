import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import GradientCard from './GradientCard'
import type { GradientCardProps } from './GradientCard.types'

function GradientCardDemo({ pressable = false, ...props }: Omit<GradientCardProps, 'children'> & { pressable?: boolean }) {
  const [presses, setPresses] = useState(0)

  return (
    <View className="p-4">
      <GradientCard {...props} onPress={pressable ? () => setPresses((p) => p + 1) : undefined}>
        <View className="gap-1 p-4">
          <Text type="h4">Beneficio destacado</Text>
          <Text type="body2">{pressable ? `Presionado ${presses} veces` : 'Contenido de la tarjeta'}</Text>
        </View>
      </GradientCard>
    </View>
  )
}

const meta = {
  title: 'Moléculas/GradientCard',
  component: GradientCardDemo,
  args: { minHeight: 100, pressable: false },
} satisfies Meta<typeof GradientCardDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Presionable: Story = { args: { pressable: true } }

export const ColoresPersonalizados: Story = { args: { gradientColors: ['#FEF0C7', '#FEC84B'] } }

export const AnchoFijo: Story = { args: { width: 240 } }
