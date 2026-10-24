import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { DotsDropdown } from './DotsDropdown'
import type { DotsDropdownProps } from './DotsDropdown.types'

function DotsDropdownDemo(props: Omit<DotsDropdownProps, 'options'>) {
  const [last, setLast] = useState<string>('—')

  return (
    <View className="gap-4 p-4">
      <View className="flex-row items-center justify-between rounded-md bg-gray-50 p-4">
        <Text type="body1">Elemento de lista</Text>
        <DotsDropdown
          {...props}
          options={[
            { label: 'Editar', icon: 'edit-01', onPress: () => setLast('Editar') },
            { label: 'Duplicar', icon: 'copy-01', onPress: () => setLast('Duplicar') },
            { label: 'Eliminar', icon: 'trash-01', onPress: () => setLast('Eliminar') },
          ]}
        />
      </View>
      <Text type="body2">Última acción: {last}</Text>
    </View>
  )
}

const meta = {
  title: 'Moléculas/DotsDropdown',
  component: DotsDropdownDemo,
  args: { position: 'center', iconColor: '#1D2939', accessibilityLabel: 'Más opciones' },
  argTypes: {
    position: { control: 'select', options: ['left', 'center', 'right'] },
    iconColor: { control: 'color' },
  },
} satisfies Meta<typeof DotsDropdownDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const IconoPersonalizado: Story = { args: { iconColor: '#4955EC' } }
