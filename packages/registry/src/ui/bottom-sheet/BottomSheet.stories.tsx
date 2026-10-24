import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { BottomSheet } from './BottomSheet'
import type { BottomSheetProps } from './BottomSheet.types'

function BottomSheetDemo({ items = 3, ...props }: Omit<BottomSheetProps, 'open' | 'close'> & { items?: number }) {
  const [open, setOpen] = useState(false)

  return (
    <View className="flex-1">
      <Pressable className="bg-primary-600 self-start rounded-md px-4 py-3" onPress={() => setOpen(true)}>
        <Text className="text-white" semibold type="body1">
          Abrir bottom sheet
        </Text>
      </Pressable>
      <BottomSheet {...props} close={() => setOpen(false)} open={open}>
        <View className="gap-3 px-6 py-4">
          {Array.from({ length: items }, (_, index) => (
            <View key={index} className="rounded-md bg-gray-100 p-4">
              <Text type="body1">Opción {index + 1}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  )
}

const meta = {
  title: 'Átomos/BottomSheet',
  component: BottomSheetDemo,
  args: {
    title: 'Elegí una opción',
    closeControl: 'both',
    divider: false,
    full: false,
    items: 3,
  },
  argTypes: {
    closeControl: { control: 'select', options: ['pill', 'x', 'both'] },
    heightPercent: { control: { type: 'range', min: 0.2, max: 1, step: 0.05 } },
  },
} satisfies Meta<typeof BottomSheetDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    full: true
  }
}

export const SinTitulo: Story = { args: { title: undefined, divider: true, closeControl: 'pill' } }

export const PantallaCompleta: Story = { args: { full: true } }

export const AlturaFija: Story = { args: { heightPercent: 0.5 } }

export const ContenidoLargo: Story = { args: { items: 20 } }
