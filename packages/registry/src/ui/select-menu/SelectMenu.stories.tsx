import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import SelectMenu from './SelectMenu'
import type { SelectMenuOption, SelectMenuProps } from './SelectMenu.types'

const OPTIONS: SelectMenuOption[] = [
  { value: 'F', label: 'Femenino' },
  { value: 'M', label: 'Masculino' },
  { value: 'X', label: 'No binario' },
]

function SelectMenuDemo({
  initialValue,
  ...props
}: Omit<SelectMenuProps, 'value' | 'onChange'> & { initialValue?: SelectMenuOption }) {
  const [value, setValue] = useState<SelectMenuOption | undefined>(initialValue)

  return (
    <View className="p-4" style={{ height: 320 }}>
      <SelectMenu {...props} value={value} onChange={setValue} />
    </View>
  )
}

const meta = {
  title: 'Moléculas/SelectMenu',
  component: SelectMenuDemo,
  args: { options: OPTIONS, placeholder: 'Seleccioná una opción' },
} satisfies Meta<typeof SelectMenuDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConValor: Story = { args: { initialValue: OPTIONS[1] } }

export const MuchasOpciones: Story = {
  args: { options: Array.from({ length: 8 }, (_, i) => ({ value: String(i), label: `Opción ${i + 1}` })) },
}
