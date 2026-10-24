import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'

import { Tabs } from './Tabs'
import type { ITab, TabsProps } from './Tabs.types'

const TABS: ITab[] = [
  { key: 'all', title: 'Todos' },
  { key: 'active', title: 'Activos' },
  { key: 'archived', title: 'Archivados' },
]

const Controlled = (props: TabsProps) => {
  const [selected, setSelected] = useState(props.selected)

  return <Tabs {...props} selected={selected} onChange={setSelected} />
}

const meta = {
  title: 'Átomos/Tabs',
  component: Tabs,
  args: { tabs: TABS, selected: 'all', onChange: () => {} },
  render: (args) => <Controlled {...args} />,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConDeshabilitado: Story = {
  args: { tabs: [...TABS.slice(0, 2), { key: 'archived', title: 'Archivados', isDisabled: true }] },
}
