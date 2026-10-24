import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import Text from '../text/Text'
import AnimatedLayout from './AnimatedLayout'

function Demo({ effect }: { effect: 'linear' | 'fade' | 'fadeUp' | 'fadeDown' }) {
  const [items, setItems] = useState([1, 2])

  return (
    <View className="gap-3">
      <Pressable className="rounded-md bg-primary-600 p-3" onPress={() => setItems((prev) => [...prev, prev.length + 1])}>
        <Text className="text-center text-white">Agregar</Text>
      </Pressable>
      {items.map((item) => (
        <AnimatedLayout key={item} animateLayout className="rounded-md bg-gray-100 p-4" effect={effect}>
          <Text>Elemento {item}</Text>
        </AnimatedLayout>
      ))}
    </View>
  )
}

const meta = {
  title: 'Átomos/AnimatedLayout',
  component: Demo,
  args: { effect: 'fade' },
  argTypes: { effect: { control: 'select', options: ['linear', 'fade', 'fadeUp', 'fadeDown'] } },
} satisfies Meta<typeof Demo>

export default meta

export const Default: StoryObj<typeof meta> = {
  args: {
    effect: "linear"
  }
}
