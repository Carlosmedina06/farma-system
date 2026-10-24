import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { EmailInput } from './EmailInput'
import type { EmailInputProps } from './EmailInput.types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ControlledEmailInput({ value: initial, ...props }: EmailInputProps) {
  const [value, setValue] = useState(initial ?? '')

  return (
    <EmailInput
      {...props}
      isValid={props.isValid ?? EMAIL_REGEX.test(value)}
      keyboardType="email-address"
      value={value}
      onChangeText={(text) => setValue(text)}
    />
  )
}

const meta = {
  title: 'Átomos/EmailInput',
  component: EmailInput,
  args: {
    label: 'Email',
    placeholder: 'nombre@email.com',
    helperText: 'Escribí @ para ver sugerencias.',
    disabled: false,
    error: false,
  },
  render: (args) => (
    <View className="w-80">
      <ControlledEmailInput {...args} />
    </View>
  ),
} satisfies Meta<typeof EmailInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const DominiosPersonalizados: Story = {
  args: { domains: ['@farma.com', '@farma.com.ar', '@empresa.org'] },
}

export const Valido: Story = {
  args: { value: 'maria@gmail.com', isValid: true },
}

export const ConError: Story = {
  args: { value: 'maria@', error: true, errorMessage: 'Ingresá un email válido' },
}

export const Deshabilitado: Story = {
  args: { value: 'maria@gmail.com', disabled: true },
}
