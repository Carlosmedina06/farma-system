import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { LoadingView } from './LoadingView'

const meta = {
  title: 'Moléculas/LoadingView',
  component: LoadingView,
  args: { title: 'Cargando', description: 'Esperá unos instantes...', background: '#ffffff' },
  argTypes: { background: { control: 'color' } },
  decorators: [
    (Story) => (
      <View style={{ height: 600 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoadingView>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const FondoPersonalizado: Story = { args: { background: '#F5F8FF' } }
