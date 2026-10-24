import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { Checkbox } from './CheckBox'
import type { CheckboxProps } from './Checkbox.types'

function ControlledCheckbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked)

  return <Checkbox {...props} checked={checked} onChange={setChecked} />
}

const meta = {
  title: 'Átomos/Checkbox',
  component: Checkbox,
  args: {
    checked: true,
    disabled: false,
    minus: false,
    appearance: 'primary',
    size: 'sm',
    shape: 'square',
    useSvgIcon: false,
  },
  argTypes: {
    appearance: { control: 'select', options: ['primary', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['square', 'circle'] },
  },
  render: (args) => <ControlledCheckbox key={String(args.checked)} {...args} />,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Estados: Story = {
  render: () => (
    <View className="gap-3">
      {(
        [
          ['Sin marcar', { checked: false }],
          ['Marcado (primary)', { checked: true }],
          ['Marcado (neutral)', { checked: true, appearance: 'neutral' }],
          ['Indeterminado', { checked: false, minus: true }],
          ['Deshabilitado', { checked: true, disabled: true }],
          ['Circular', { checked: true, shape: 'circle', size: 'md' }],
          ['Ícono SVG', { checked: true, useSvgIcon: true }],
        ] as const
      ).map(([label, props]) => (
        <View key={label} className="flex-row items-center gap-3">
          <ControlledCheckbox {...props} />
          <Text type="body2">{label}</Text>
        </View>
      ))}
    </View>
  ),
}
