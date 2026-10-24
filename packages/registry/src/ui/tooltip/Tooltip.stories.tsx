import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Icon } from '../icon'
import Tooltip from './Tooltip'

const meta = {
  title: 'Átomos/Tooltip',
  component: Tooltip,
  args: {
    text: 'Título del tooltip',
    supportingText: 'Texto de soporte con más detalle.',
    close: true,
    children: <Icon color="#475467" name="info-circle" size={20} />,
  },
  decorators: [
    (Story) => (
      <View className="items-start p-6">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SinCierre: Story = {
  args: { close: false, supportingText: undefined },
}
