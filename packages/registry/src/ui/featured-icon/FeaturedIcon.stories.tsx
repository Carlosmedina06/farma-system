import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { FeaturedIcon } from './FeaturedIcon'
import type { FeaturedIconType } from './FeaturedIcon.types'

const TYPES: FeaturedIconType[] = ['success', 'success-green', 'info', 'gray', 'error', 'warning']

const meta = {
  title: 'Átomos/FeaturedIcon',
  component: FeaturedIcon,
  args: { icon: 'check', type: 'success', outline: true },
  argTypes: { type: { control: 'select', options: TYPES } },
} satisfies Meta<typeof FeaturedIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tipos: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-4">
      {TYPES.map((type) => (
        <FeaturedIcon key={type} icon="info-circle" type={type} />
      ))}
    </View>
  ),
}

export const SinOutline: Story = {
  args: { outline: false },
}
