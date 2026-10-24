import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { Radio } from './Radio'
import type { RadioProps } from './Radio.types'

function ControlledRadio(props: RadioProps) {
  const [selected, setSelected] = useState(props.selected ?? false)

  return <Radio {...props} selected={selected} onPress={() => setSelected((prev) => !prev)} />
}

const OPTIONS = ['Retiro en sucursal', 'Envío a domicilio', 'Envío express']

function RadioGroupDemo() {
  const [value, setValue] = useState(OPTIONS[0])

  return (
    <View className="gap-3">
      {OPTIONS.map((option) => (
        <Pressable key={option} className="flex-row items-center gap-2" onPress={() => setValue(option)}>
          <Radio selected={value === option} size="md" onPress={() => setValue(option)} />
          <Text type="body1">{option}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const meta = {
  title: 'Átomos/Radio',
  component: Radio,
  args: { size: 'md', selected: true, disabled: false },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
  render: (args) => <ControlledRadio key={String(args.selected)} {...args} />,
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Grupo: Story = { render: () => <RadioGroupDemo /> }

export const Tamaños: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Radio selected size="sm" />
      <Radio selected size="md" />
      <Radio selected size="lg" />
    </View>
  ),
}

export const Deshabilitado: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Radio disabled size="md" />
      <Radio disabled selected size="md" />
    </View>
  ),
}
