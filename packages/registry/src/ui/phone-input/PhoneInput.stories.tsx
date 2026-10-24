import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { PhoneInput } from './PhoneInput'
import type { PhoneInputProps } from './PhoneInput.types'

function ControlledPhoneInput({ value: initial, ...props }: PhoneInputProps) {
  const [value, setValue] = useState(initial ?? '')

  return (
    <PhoneInput
      {...props}
      isValid={props.isValid ?? value.length === 10}
      value={value}
      onChangeText={setValue}
    />
  )
}

const meta = {
  title: 'Átomos/PhoneInput',
  component: PhoneInput,
  args: { error: false, countryCode: '+54 9' },
  render: (args) => (
    <View className="w-80">
      <ControlledPhoneInput {...args} />
    </View>
  ),
} satisfies Meta<typeof PhoneInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Valido: Story = { args: { value: '1112345678', isValid: true } }

export const ConError: Story = {
  args: { value: '11', error: true, errorMessage: 'Ingresá un número válido' },
}

export const TextosPersonalizados: Story = {
  args: { label: 'Celular', helperText: 'Sin el 0 ni el 15.', placeholder: '351 123 4567' },
}
