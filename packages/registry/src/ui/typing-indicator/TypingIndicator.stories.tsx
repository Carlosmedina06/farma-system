import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { TypingIndicator } from './TypingIndicator'

const meta = {
  title: 'Moléculas/TypingIndicator',
  component: TypingIndicator,
  args: { label: 'Escribiendo...' },
} satisfies Meta<typeof TypingIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConEmisor: Story = { args: { senderName: 'Operador' } }

export const TextoPersonalizado: Story = { args: { label: 'Typing...', senderName: 'Soporte' } }
