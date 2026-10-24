import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { Toggle } from './Toggle'
import type { ToggleProps } from './Toggle.types'

function ControlledToggle(props: ToggleProps) {
  const [value, setValue] = useState(props.value ?? false)

  return <Toggle {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'Átomos/Toggle',
  component: Toggle,
  args: { value: true, size: 'sm', disabled: false },
  argTypes: { size: { control: 'select', options: ['xs', 'sm', 'md'] } },
  render: (args) => <ControlledToggle key={String(args.value)} {...args} />,
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tamaños: Story = {
  render: () => (
    <View className="gap-3">
      {(['xs', 'sm', 'md'] as const).map((size) => (
        <View key={size} className="flex-row items-center gap-3">
          <ControlledToggle size={size} value />
          <Text type="body2">{size}</Text>
        </View>
      ))}
    </View>
  ),
}

export const Deshabilitado: Story = {
  render: () => (
    <View className="flex-row items-center gap-3">
      <Toggle disabled />
      <Toggle disabled value />
    </View>
  ),
}
