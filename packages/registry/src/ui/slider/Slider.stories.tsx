import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { UniwindGestureHandlerRootView } from '../gesture-root'
import { Text } from '../text'
import { Slider } from './Slider'
import { RangeSlider } from './SliderRange'
import type { Range, SliderProps } from './Slider.types'

function ControlledSlider(props: SliderProps) {
  const [value, setValue] = useState(props.value)

  return (
    <View className="w-80 gap-3">
      <Slider {...props} value={value} onChange={setValue} />
      <Text type="body2">Valor: {Math.round(value)}</Text>
    </View>
  )
}

function ControlledRangeSlider() {
  const [value, setValue] = useState<Range>({ v1: 20, v2: 70 })

  return (
    <View className="w-80 gap-3">
      <RangeSlider max={100} min={0} value={value} onChange={setValue} />
      <Text type="body2">
        Rango: {Math.round(Math.min(value.v1, value.v2))} – {Math.round(Math.max(value.v1, value.v2))}
      </Text>
    </View>
  )
}

const meta = {
  title: 'Átomos/Slider',
  component: Slider,
  args: { value: 40, min: 0, max: 100, onChange: () => {} },
  decorators: [
    (Story) => (
      <UniwindGestureHandlerRootView>
        <Story />
      </UniwindGestureHandlerRootView>
    ),
  ],
  render: (args) => <ControlledSlider key={args.value} {...args} />,
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Rango: Story = { render: () => <ControlledRangeSlider /> }
