import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { CheckboxCheckIcon, CheckIcon } from './CheckIcon'

const meta = {
  title: 'Átomos/CheckIcon',
  component: CheckIcon,
  args: { size: 24, color: '#475467', strokeWidth: 2 },
  argTypes: { color: { control: 'color' } },
} satisfies Meta<typeof CheckIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variantes: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <CheckIcon />
      <View className="bg-primary-600 rounded-md p-1">
        <CheckboxCheckIcon size={17} />
      </View>
    </View>
  ),
}
