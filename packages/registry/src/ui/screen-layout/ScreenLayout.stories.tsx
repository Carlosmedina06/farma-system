import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Text } from '../text'
import ScreenLayout from './ScreenLayout'
import { FULL_SCREEN_EDGES } from './ScreenLayout.types'

const Content = () => (
  <>
    <Text type="h2">Título de pantalla</Text>
    <Text type="body2">El contenido respeta el safe area y usa el padding/gap estándar del DS.</Text>
    <View className="h-24 rounded-md bg-gray-100" />
  </>
)

const meta = {
  title: 'Moléculas/ScreenLayout',
  component: ScreenLayout,
  args: { children: <Content />, backgroundClassName: 'bg-base-white' },
  decorators: [
    (Story) => (
      <View style={{ height: 480 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ScreenLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const PantallaCompleta: Story = {
  args: { edges: FULL_SCREEN_EDGES },
}

export const FondoGris: Story = {
  args: { backgroundClassName: 'bg-gray-50' },
}
