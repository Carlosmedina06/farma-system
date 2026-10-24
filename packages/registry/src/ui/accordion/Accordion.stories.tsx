import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Text } from '../text'
import { Accordion } from './Accordion'

const meta = {
  title: 'Átomos/Accordion',
  component: Accordion,
  args: {
    viewKey: 'faq-1',
    title: '¿Cómo funciona?',
    children: (
      <Text type="body2">
        Contenido del acordeón. La altura se anima al abrir y cerrar según el tamaño del contenido.
      </Text>
    ),
  },
  argTypes: { onOpenChange: { action: 'openChange' } },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Lista: Story = {
  render: () => (
    <View>
      {['Primera pregunta', 'Segunda pregunta', 'Tercera pregunta'].map((title) => (
        <Accordion key={title} title={title} viewKey={title}>
          <Text type="body2">Respuesta para «{title}».</Text>
        </Accordion>
      ))}
    </View>
  ),
}
