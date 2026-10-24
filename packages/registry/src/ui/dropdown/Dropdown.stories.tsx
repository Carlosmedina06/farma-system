import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { Dropdown, type DropdownOption, type DropdownProps } from './Dropdown'

const OPTIONS: DropdownOption[] = [
  { value: 'dni', label: 'DNI' },
  { value: 'le', label: 'Libreta de enrolamiento' },
  { value: 'lc', label: 'Libreta cívica' },
  { value: 'pas', label: 'Pasaporte', description: '(extranjeros)' },
]

const PROVINCES: DropdownOption[] = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
].map((label) => ({ value: label, label, icon: 'marker-pin-01' as DropdownOption['icon'] }))

function ControlledDropdown(props: DropdownProps<DropdownOption>) {
  const [value, setValue] = useState<DropdownOption | undefined>(props.value)

  return (
    <View className="w-80 gap-3">
      <Dropdown {...props} value={value} onChange={setValue} />
      <Text className="text-gray-600" type="caption">
        Seleccionado: {value?.value ?? '—'}
      </Text>
    </View>
  )
}

const meta = {
  title: 'Moléculas/Dropdown',
  component: Dropdown,
  args: { options: OPTIONS, placeholder: 'Tipo de documento', title: 'Tipo de documento' },
  render: (args) => <ControlledDropdown {...(args as DropdownProps<DropdownOption>)} />,
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConValor: Story = { args: { value: OPTIONS[1] } }

export const ConBusqueda: Story = {
  args: { options: PROVINCES, search: true, placeholder: 'Provincia', title: 'Provincia' },
}

export const FormatLabel: Story = {
  args: {
    options: [
      { value: '1', label: 'opción en minúsculas' },
      { value: '2', label: 'otra opción' },
    ],
    formatLabel: (label: string) => label.charAt(0).toUpperCase() + label.slice(1),
  },
}
