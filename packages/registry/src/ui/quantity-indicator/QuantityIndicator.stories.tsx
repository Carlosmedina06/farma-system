import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Icon } from '../icon'
import { QuantityIndicator } from './QuantityIndicator'

const meta = {
  title: 'Átomos/QuantityIndicator',
  component: QuantityIndicator,
  args: { quantity: 3 },
  decorators: [
    (Story) => (
      <View className="h-8 w-8 items-center justify-center">
        <Icon name="bell-01" size={24} />
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof QuantityIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Presionable: Story = {
  args: { quantity: 9, onPress: () => {} },
}
