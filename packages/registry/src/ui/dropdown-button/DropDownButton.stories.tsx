import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { DropDownButton } from './DropDownButton'
import type { DropDownButtonProps } from './DropDownButton.types'

const OPTIONS = ['buenos aires', 'córdoba', 'santa fe', 'mendoza']

const capitalize = (value: string) => value.replace(/(^|\s)\S/g, (char) => char.toUpperCase())

/** Simula abrir un selector: cada toque elige la siguiente opción. */
function CyclingDropDown(props: DropDownButtonProps) {
  const [index, setIndex] = useState(-1)

  return (
    <DropDownButton
      {...props}
      value={index >= 0 ? OPTIONS[index] : props.value}
      onPress={() => setIndex((prev) => (prev + 1) % OPTIONS.length)}
    />
  )
}

const meta = {
  title: 'Átomos/DropDownButton',
  component: DropDownButton,
  args: {
    label: 'Provincia',
    text: 'Elegí una provincia',
    small: false,
    disabled: false,
    error: false,
  },
  render: (args) => (
    <View className="w-80">
      <CyclingDropDown {...args} />
    </View>
  ),
} satisfies Meta<typeof DropDownButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConFormato: Story = { args: { value: 'buenos aires', formatValue: capitalize } }

export const Chico: Story = { args: { small: true, label: undefined } }

export const ConError: Story = { args: { error: true, errorMessage: 'Elegí una opción' } }

export const Deshabilitado: Story = { args: { disabled: true, value: 'córdoba' } }
