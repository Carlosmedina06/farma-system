import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { TextWithBold } from './TextWithBold'

const meta = {
  title: 'Moléculas/TextWithBold',
  component: TextWithBold,
  args: {
    text: 'Tenés #**3 días**# para completar el proceso y #**sin costo**# adicional.',
    textType: 'body1',
    textAlign: 'left',
    textColor: 'text-gray-800',
  },
  argTypes: {
    textAlign: { control: 'select', options: ['left', 'center', 'right'] },
    textType: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'body1', 'body2', 'caption'] },
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TextWithBold>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Centrado: Story = { args: { textAlign: 'center', textType: 'body2' } }

export const SinNegrita: Story = { args: { text: 'Un texto sin ningún segmento resaltado.' } }

export const Color: Story = { args: { textColor: 'text-primary-600' } }
