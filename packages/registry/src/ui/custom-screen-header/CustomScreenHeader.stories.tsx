import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { StepHeader } from '../step-header'
import { Text } from '../text'
import { CustomScreenHeader } from './CustomScreenHeader'
import type { HeaderProps } from './CustomScreenHeader.types'

function Demo(props: HeaderProps) {
  const [log, setLog] = useState<string[]>([])
  const push = (entry: string) => setLog((prev) => [entry, ...prev].slice(0, 4))

  return (
    <View className="w-96 gap-3">
      <CustomScreenHeader
        {...props}
        actions={props.actions?.map((a, i) => ({ ...a, onPress: () => push(`acción ${i}`) }))}
        onBack={props.onBack ? () => push('onBack') : undefined}
      />
      {log.map((entry, index) => (
        <Text key={`${entry}-${index}`} className="px-4 text-gray-600" type="caption">
          {entry}
        </Text>
      ))}
    </View>
  )
}

const Logo = () => (
  <View className="bg-primary-600 h-6 w-28 items-center justify-center rounded-md">
    <Text className="text-white" type="caption">
      LOGO
    </Text>
  </View>
)

const meta = {
  title: 'Moléculas/CustomScreenHeader',
  component: CustomScreenHeader,
  args: { title: 'Mi pantalla', onBack: () => {} },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof CustomScreenHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConAcciones: Story = {
  args: {
    actions: [
      { name: 'search-sm', onPress: () => {} },
      { name: 'shopping-bag-01', amount: 3, onPress: () => {} },
    ],
  },
}

export const ConLogo: Story = { args: { title: undefined, onBack: undefined, logo: <Logo /> } }

export const ConRightAction: Story = {
  args: {
    rightAction: (
      <View className="bg-error-500 h-3 w-3 rounded-full" />
    ),
  },
}

export const ConSubHeader: Story = {
  args: { subHeader: <StepHeader activeStep={1} steps={['Datos', 'Confirmación']} /> },
}

export const SoloSubHeader: Story = {
  args: {
    hideTopBar: true,
    subHeader: <StepHeader activeStep={0} steps={['Datos', 'Confirmación']} onBack={() => {}} />,
  },
}
