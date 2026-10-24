import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Search } from './Search'
import type { SearchProps } from './Search.types'

function ControlledSearch({ value: initial, ...props }: SearchProps) {
  const [value, setValue] = useState(initial ?? '')

  return (
    <Search
      {...props}
      value={value}
      onChangeText={setValue}
      onClear={() => setValue('')}
    />
  )
}

const meta = {
  title: 'Átomos/Search',
  component: Search,
  args: { disabled: false, keepPlaceholderOnFocus: false },
  render: (args) => (
    <View className="w-80">
      <ControlledSearch {...args} />
    </View>
  ),
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConValor: Story = { args: { value: 'Ibuprofeno' } }

export const PlaceholderPersonalizado: Story = {
  args: { placeholder: 'Buscar productos', keepPlaceholderOnFocus: true },
}

export const Deshabilitado: Story = { args: { disabled: true } }
