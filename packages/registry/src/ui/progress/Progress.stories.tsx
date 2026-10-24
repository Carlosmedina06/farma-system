import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Text } from '../text'
import { Progress } from './Progress'
import { AnimatedProgressBar } from './ProgressBarAnimated'
import SteppedProgressBar from './SteppedProgressBar'

const meta = {
  title: 'Átomos/Progress',
  component: Progress,
  args: { progress: 40, direction: 'right', withLabel: true },
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    direction: { control: 'inline-radio', options: ['right', 'bottom'] },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const LabelAbajo: Story = {
  args: { direction: 'bottom', progress: 75 },
}

export const Animadas: Story = {
  render: (args) => (
    <View className="gap-4">
      <Text type="caption">AnimatedProgressBar (indeterminada)</Text>
      <AnimatedProgressBar />
      <Text type="caption">SteppedProgressBar (progress = {args.progress})</Text>
      <SteppedProgressBar progress={args.progress} />
    </View>
  ),
}
