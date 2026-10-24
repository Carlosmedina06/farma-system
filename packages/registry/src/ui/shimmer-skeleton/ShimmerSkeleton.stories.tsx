import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import ShimmerSkeleton from './ShimmerSkeleton'
import ShimmerSkeletonProvider from './ShimmerSkeletonProvider'

const meta = {
  title: 'Átomos/ShimmerSkeleton',
  component: ShimmerSkeleton,
  args: { width: '100%', height: 48, radius: 8, colorMode: 'light' },
} satisfies Meta<typeof ShimmerSkeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Sin provider: cada skeleton se anima solo. */
export const SinProvider: Story = {}

/** Con provider: todos los skeletons comparten la misma animación. */
export const ConProvider: Story = {
  render: () => (
    <ShimmerSkeletonProvider>
      <View className="gap-3">
        <ShimmerSkeleton height={160} radius={12} width="100%" />
        <ShimmerSkeleton height={20} width="70%" />
        <ShimmerSkeleton height={20} width="40%" />
      </View>
    </ShimmerSkeletonProvider>
  ),
}
