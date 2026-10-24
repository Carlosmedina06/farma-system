import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { ListBold } from '../list'
import { Text } from '../text'
import { DetailCard } from './DetailCard'
import type { DetailCardProps } from './DetailCard.types'

const ITEMS: DetailCardProps['itemsList'] = [
  { label: 'retiro en sucursal', icon: 'building-07', noCost: true },
  { label: 'tarjeta de crédito', description: 'Visa terminada en 4242', icon: 'credit-card-02' },
  { label: 'total', caption: '$ 12.500', icon: 'receipt' },
]

function Demo(props: DetailCardProps) {
  const [count, setCount] = useState(0)

  return (
    <View className="w-96 gap-3">
      <DetailCard {...props} onPress={() => setCount((c) => c + 1)} />
      <Text className="text-gray-600" type="caption">
        onPress × {count}
      </Text>
    </View>
  )
}

const meta = {
  title: 'Moléculas/DetailCard',
  component: DetailCard,
  args: { title: 'Resumen', itemsList: ITEMS, buttonText: 'Modificar' },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof DetailCard>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConEditar: Story = { args: { showEdit: true, buttonText: undefined } }

export const ConDivisor: Story = { args: { divider: true } }

export const Cargando: Story = { args: { isLoading: true, footer: <View /> } }

export const ConFooter: Story = {
  args: {
    footer: (
      <ListBold
        isListLight
        className="py-2"
        description="Av. Siempre Viva 742"
        icon="marker-pin-01"
        label="Sucursal Centro"
      />
    ),
  },
}

export const SinCostoPersonalizado: Story = { args: { noCostLabel: 'Gratis' } }
