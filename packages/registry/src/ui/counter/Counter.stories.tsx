import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Counter } from './Counter'

const meta = {
  title: 'Átomos/Counter',
  component: Counter,
  args: { value: 1, max: 5 },
} satisfies Meta<typeof Counter>

export default meta
type Story = StoryObj<typeof meta>

const Controlled = (props: Parameters<typeof Counter>[0]) => {
  const [value, setValue] = useState(props.value ?? 0)

  return <Counter {...props} value={value} onChange={setValue} />
}

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
}

export const Estados: Story = {
  render: () => (
    <View className="gap-3">
      <Counter value={0} />
      <Counter value={1} />
      <Counter max={3} value={3} />
      <Counter disabled value={2} />
      <Counter loading value={2} />
    </View>
  ),
}
