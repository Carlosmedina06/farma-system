import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'

/** Historia de verificación: confirma que Uniwind y `cn` funcionan en react-native-web. */
function UniwindCheck({ highlighted }: { highlighted: boolean }) {
  return (
    <View className={cn('rounded-xl border border-gray-200 p-4', highlighted && 'border-blue-500 bg-blue-50')}>
      <Text className="text-lg font-semibold text-gray-900">Uniwind funcionando</Text>
      <Text className="mt-1 text-gray-500">Componentes de React Native renderizados en web.</Text>
    </View>
  )
}

const meta = {
  title: 'Setup/Uniwind',
  component: UniwindCheck,
  args: { highlighted: false },
} satisfies Meta<typeof UniwindCheck>

export default meta

export const Default: StoryObj<typeof meta> = {}

export const Highlighted: StoryObj<typeof meta> = { args: { highlighted: true } }
