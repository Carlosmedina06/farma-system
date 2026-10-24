import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Button } from './Button'
import { ButtonOnly } from './ButtonOnly'
import type { ButtonSize, ButtonType } from './Button.types'

const TYPES: ButtonType[] = [
  'primary',
  'secondary',
  'tertiary',
  'textLink',
  'textLinkWhite',
  'tertiaryGray',
  'tertiaryGraySquare',
  'secondaryGray',
  'socialButton',
]
const SIZES: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']

const meta = {
  title: 'Átomos/Button',
  component: Button,
  args: { children: 'Continuar', type: 'primary', size: 'xl', full: true },
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: 'select', options: SIZES },
    textAlign: { control: 'select', options: ['left', 'center', 'right'] },
    onPress: { action: 'press' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tipos: Story = {
  render: () => (
    <View className="gap-3">
      {TYPES.map((type) => (
        <View key={type} className={type === 'textLinkWhite' ? 'bg-primary-600 p-2' : undefined}>
          <Button type={type}>{type}</Button>
        </View>
      ))}
    </View>
  ),
}

export const Deshabilitados: Story = {
  render: () => (
    <View className="gap-3">
      {TYPES.map((type) => (
        <Button key={type} disabled type={type}>
          {`${type} (disabled)`}
        </Button>
      ))}
    </View>
  ),
}

export const Tamaños: Story = {
  render: () => (
    <View className="gap-3">
      {SIZES.map((size) => (
        <Button key={size} full={false} size={size}>
          {`size ${size}`}
        </Button>
      ))}
    </View>
  ),
}

export const ConIcono: Story = {
  render: () => (
    <View className="gap-3">
      <Button icon="plus">Icono a la izquierda</Button>
      <Button iconRightSide icon="arrow-right" type="secondary">
        Icono a la derecha
      </Button>
      <Button icon="arrow-left" textAlign="left" type="tertiaryGray">
        Alineado a la izquierda
      </Button>
    </View>
  ),
}

export const Cargando: Story = {
  args: { loading: true },
}

export const SoloIcono: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-3">
      {(['primary', 'secondary', 'tertiary', 'tertiaryGraySquare', 'secondaryGray'] as const).map(
        (type) => (
          <ButtonOnly key={type} icon="plus" type={type} />
        ),
      )}
      {SIZES.map((size) => (
        <ButtonOnly key={size} icon="check" size={size} />
      ))}
      <ButtonOnly loading />
      <ButtonOnly disabled />
    </View>
  ),
}
