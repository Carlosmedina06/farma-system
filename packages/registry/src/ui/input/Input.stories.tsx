import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Input } from './Input'
import type { InputProps } from './Input.types'

function ControlledInput(props: InputProps) {
  const [value, setValue] = useState(props.value ?? '')

  return <Input {...props} value={value} onChangeText={(text) => setValue(text)} />
}

const meta = {
  title: 'Átomos/Input',
  component: Input,
  args: {
    label: 'Nombre',
    placeholder: 'Escribí tu nombre',
    helperText: 'Como figura en tu documento.',
    disabled: false,
    error: false,
    filled: false,
    rounded: false,
  },
  render: (args) => (
    <View className="w-80">
      <ControlledInput {...args} />
    </View>
  ),
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConError: Story = {
  args: { error: true, errorMessage: 'El campo es obligatorio' },
}

export const Lleno: Story = {
  args: { filled: true, value: 'María' },
}

export const Deshabilitado: Story = {
  args: { disabled: true, value: 'No editable' },
}

export const ConIcono: Story = {
  args: { label: 'Buscar', icon: { name: 'search-sm', position: 'left' }, helperText: undefined },
}

export const Redondeado: Story = {
  args: { rounded: true },
}

export const ConMascara: Story = {
  args: {
    label: 'Fecha de nacimiento',
    placeholder: 'DD/MM/AAAA',
    maskPattern: '99/99/9999',
    keyboardType: 'number-pad',
    helperText: undefined,
  },
}

export const Estados: Story = {
  render: () => (
    <View className="w-80 gap-4">
      <Input label="Default" placeholder="Placeholder" />
      <Input filled label="Lleno" value="Texto ingresado" />
      <Input error errorMessage="Dato inválido" label="Error" value="xx" />
      <Input disabled label="Deshabilitado" value="No editable" />
    </View>
  ),
}
