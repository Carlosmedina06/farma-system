import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { TextInput, View } from 'react-native'

import Text from '../text/Text'
import Icon, { type IconName } from './Icon'
import glyphMap from './glyph-map.json'

const NAMES = Object.keys(glyphMap) as IconName[]

const meta = {
  title: 'Fundamentos/Icon',
  component: Icon,
  args: { name: 'check', size: 32, className: 'text-primary-600' },
  argTypes: { name: { control: 'select', options: NAMES } },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

function Catalog() {
  const [query, setQuery] = useState('')
  const filtered = NAMES.filter((name) => name.includes(query.toLowerCase())).slice(0, 120)

  return (
    <View className="gap-3">
      <TextInput
        className="rounded-sm border border-gray-300 px-3 py-2"
        placeholder={`Buscar entre ${NAMES.length} íconos…`}
        value={query}
        onChangeText={setQuery}
      />
      <View className="flex-row flex-wrap gap-2">
        {filtered.map((name) => (
          <View key={name} className="w-[80px] items-center gap-1 py-2">
            <Icon className="text-gray-700" name={name} size={24} />
            <Text numberOfLines={1} type="caption">
              {name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export const Catalogo: Story = { render: () => <Catalog /> }
