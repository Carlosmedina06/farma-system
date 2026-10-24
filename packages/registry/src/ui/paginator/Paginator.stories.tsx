import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import { Button } from '../button'
import { Paginator } from './Paginator'

interface DemoProps {
  pagesAmount: number
  visibleDots: number
  dotSize?: number
  spacing?: number
}

const PaginatorDemo = ({ pagesAmount, visibleDots, dotSize, spacing }: DemoProps) => {
  const currentPageIndex = useSharedValue(0)
  const [page, setPage] = useState(0)

  const go = (delta: number) => {
    const next = Math.min(Math.max(page + delta, 0), pagesAmount - 1)
    setPage(next)
    currentPageIndex.value = next
  }

  return (
    <View className="gap-4">
      <Paginator
        currentPageIndex={currentPageIndex}
        dotSize={dotSize}
        pagesAmount={pagesAmount}
        spacing={spacing}
        visibleDots={visibleDots}
      />
      <View className="flex-row gap-2">
        <Button full={false} size="sm" type="secondary" onPress={() => go(-1)}>
          Anterior
        </Button>
        <Button full={false} size="sm" onPress={() => go(1)}>
          Siguiente
        </Button>
      </View>
    </View>
  )
}

const meta = {
  title: 'Átomos/Paginator',
  component: PaginatorDemo,
  args: { pagesAmount: 8, visibleDots: 5, dotSize: 12, spacing: 8 },
} satisfies Meta<typeof PaginatorDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const PocasPaginas: Story = {
  args: { pagesAmount: 3, visibleDots: 5 },
}
