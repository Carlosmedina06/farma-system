import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { Stepper } from './Stepper'

const meta = {
  title: 'Átomos/Stepper',
  component: Stepper,
  args: { steps: 4, currentStep: 2 },
  argTypes: {
    steps: { control: { type: 'number', min: 1, max: 10 } },
    currentStep: { control: { type: 'number', min: 0, max: 10 } },
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Completo: Story = {
  args: { steps: 3, currentStep: 3 },
}
