import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import CodeInput from './CodeInput'
import type { CodeInputProps } from './CodeInput.types'

function ControlledCodeInput(props: CodeInputProps) {
  const [value, setValue] = useState(props.value ?? '')
  const [log, setLog] = useState<string[]>([])
  const push = (entry: string) => setLog((prev) => [entry, ...prev].slice(0, 5))

  return (
    <View className="w-80 gap-3">
      <CodeInput
        {...props}
        value={value}
        onAutofill={({ elapsedMs }) => push(`onAutofill · ${elapsedMs}ms`)}
        onChange={setValue}
        onComplete={({ code, autofill, elapsedMs }) =>
          push(`onComplete · ${code} · autofill=${autofill} · ${elapsedMs}ms`)
        }
        onError={({ rawValue }) => push(`onError · "${rawValue}"`)}
        onMounted={({ maxLength }) => push(`onMounted · maxLength=${maxLength}`)}
      />
      <Pressable className="self-start rounded-md bg-gray-100 px-3 py-2" onPress={() => setValue('')}>
        <Text type="body2">Limpiar</Text>
      </Pressable>
      {log.map((entry, index) => (
        <Text key={`${entry}-${index}`} className="text-gray-600" type="caption">
          {entry}
        </Text>
      ))}
    </View>
  )
}

const meta = {
  title: 'Átomos/CodeInput',
  component: CodeInput,
  args: { value: '', length: 6, hasError: false, onChange: () => {} },
  argTypes: { length: { control: { type: 'number', min: 4, max: 8 } } },
  render: (args) => <ControlledCodeInput {...args} />,
} satisfies Meta<typeof CodeInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const CuatroDigitos: Story = { args: { length: 4 } }

export const Completo: Story = { args: { value: '936736' } }

export const ConError: Story = {
  args: { value: '123456', hasError: true, errorText: 'El código es incorrecto' },
}
