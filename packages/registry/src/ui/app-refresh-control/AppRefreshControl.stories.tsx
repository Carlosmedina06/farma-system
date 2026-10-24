import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { Text } from '../text'
import AppRefreshControl from './AppRefreshControl'

function AppRefreshControlDemo({ refreshMs = 1500 }: { refreshMs?: number }) {
  const [refreshing, setRefreshing] = useState(false)
  const [count, setCount] = useState(0)

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setCount((c) => c + 1)
      setRefreshing(false)
    }, refreshMs)
  }

  return (
    <ScrollView
      contentContainerClassName="gap-3 p-4"
      refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      style={{ height: 400 }}
    >
      <Text type="body2">Deslizá hacia abajo para refrescar (en nativo). Refrescos: {count}</Text>
      {Array.from({ length: 8 }, (_, i) => (
        <View key={i} className="rounded-md bg-gray-100 p-4">
          <Text>Elemento {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const meta = {
  title: 'Moléculas/AppRefreshControl',
  component: AppRefreshControlDemo,
  args: { refreshMs: 1500 },
} satisfies Meta<typeof AppRefreshControlDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
