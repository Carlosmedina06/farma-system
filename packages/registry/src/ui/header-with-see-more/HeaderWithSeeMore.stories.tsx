import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import HeaderWithSeeMore from './HeaderWithSeeMore'
import type { HeaderWithSeeMoreProps } from './HeaderWithSeeMore.types'

function HeaderWithSeeMoreDemo({ withAction = true, ...props }: Omit<HeaderWithSeeMoreProps, 'onPress'> & { withAction?: boolean }) {
  const [presses, setPresses] = useState(0)

  return (
    <View className="gap-2 p-4">
      <HeaderWithSeeMore {...props} onPress={withAction ? () => setPresses((p) => p + 1) : undefined} />
      <Text type="caption">"Ver más" presionado {presses} veces</Text>
    </View>
  )
}

const meta = {
  title: 'Moléculas/HeaderWithSeeMore',
  component: HeaderWithSeeMoreDemo,
  args: { title: 'Destacados', seeMoreText: 'Ver todos', icon: 'chevron-right', withAction: true },
} satisfies Meta<typeof HeaderWithSeeMoreDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const SoloTitulo: Story = { args: { withAction: false } }

export const OtroIcono: Story = { args: { icon: 'chevron-right' } }
