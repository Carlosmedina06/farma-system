import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Chip } from './Chip'
import type { ChipType } from './Chip.types'

const TYPES: ChipType[] = ['success', 'error', 'warning', 'info', 'tag', 'primary', 'gray', 'selected']

const meta = {
  title: 'Átomos/Chip',
  component: Chip,
  args: { children: 'Chip', type: 'info' },
  argTypes: {
    type: { control: 'select', options: TYPES },
    onPress: { action: 'press' },
  },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tipos: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      {TYPES.map((type) => (
        <Chip key={type} type={type}>
          {type}
        </Chip>
      ))}
    </View>
  ),
}

export const Estados: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Chip checked>Checked</Chip>
      <Chip selected close>
        Selected
      </Chip>
      <Chip disabled>Disabled</Chip>
      <Chip close type="tag">
        Con cierre
      </Chip>
    </View>
  ),
}
