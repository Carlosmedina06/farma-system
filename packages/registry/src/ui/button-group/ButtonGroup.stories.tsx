import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { ButtonGroup } from './ButtonGroup'

const noop = () => {}

const meta = {
  title: 'Átomos/ButtonGroup',
  component: ButtonGroup,
  args: {
    buttons: [
      { id: 'day', text: 'Día', onPress: noop },
      { id: 'week', text: 'Semana', onPress: noop },
      { id: 'month', text: 'Mes', onPress: noop },
    ],
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConIconos: Story = {
  args: {
    buttons: [
      { id: 'list', text: 'Lista', icon: 'check', onPress: noop },
      { id: 'map', text: 'Mapa', icon: 'marker-pin-02', onPress: noop },
    ],
  },
}

export const DosBotones: Story = {
  args: {
    buttons: [
      { id: 'a', text: 'Opción A', onPress: noop },
      { id: 'b', text: 'Opción B', onPress: noop },
    ],
  },
}
