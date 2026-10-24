import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Text } from '../text'
import { TabBar } from './TabBar'
import type { TabBarBadge, TabBarIconSet, TabBarNavigation, TabBarProps } from './TabBar.types'

const ROUTES = [
  { key: 'home-key', name: 'HomeTab', label: 'Inicio' },
  { key: 'notifications-key', name: 'Notifications', label: 'Avisos' },
  { key: 'credentials-key', name: 'Credentials', label: 'Credencial' },
  { key: 'profile-key', name: 'Profile', label: 'Perfil' },
]

const ICONS: Record<string, TabBarIconSet> = {
  HomeTab: { active: 'home-05-filled', inactive: 'home-05' },
  Notifications: { active: 'bell-03-filled', inactive: 'bell-03', badge: 'bell-notification' },
  Credentials: { active: 'credit-card-shield-filled', inactive: 'credit-card-shield' },
  Profile: { active: 'user-02-filled', inactive: 'user-02' },
}

type DemoProps = {
  initialIndex?: number
  badges?: Record<string, TabBarBadge>
}

/** Simula el `state`/`descriptors`/`navigation` que entrega @react-navigation/bottom-tabs. */
function FakeNavigatorTabBar({ initialIndex = 0, badges }: DemoProps) {
  const [index, setIndex] = useState(initialIndex)
  const [log, setLog] = useState<string[]>([])

  const state: TabBarProps['state'] = {
    index,
    routes: ROUTES.map(({ key, name }) => ({ key, name })),
  }
  const descriptors = Object.fromEntries(
    ROUTES.map(({ key, label }) => [key, { options: { tabBarLabel: label } }]),
  )
  const navigation: TabBarNavigation = {
    emit: ({ target }) => {
      setLog((prev) => [`emit tabPress · ${target}`, ...prev].slice(0, 4))

      return { defaultPrevented: false }
    },
    dispatch: (action) => {
      setLog((prev) => [`dispatch ${action.type} · ${action.payload.name}`, ...prev].slice(0, 4))
      setIndex(ROUTES.findIndex((route) => route.name === action.payload.name))
    },
  }

  return (
    <View className="w-full max-w-[420px] gap-4">
      <View className="h-40 items-center justify-center rounded-md bg-gray-50">
        <Text type="h4">{ROUTES[index]?.label}</Text>
        {log.map((entry, i) => (
          <Text key={`${entry}-${i}`} className="text-gray-600" type="caption">
            {entry}
          </Text>
        ))}
      </View>
      <TabBar
        badges={badges}
        descriptors={descriptors}
        icons={ICONS}
        navigation={navigation}
        state={state}
      />
    </View>
  )
}

const meta = {
  title: 'Moléculas/TabBar',
  component: FakeNavigatorTabBar,
  args: { initialIndex: 0 },
  argTypes: { initialIndex: { control: { type: 'number', min: 0, max: 3 } } },
} satisfies Meta<typeof FakeNavigatorTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ConNotificaciones: Story = { args: { badges: { Notifications: true } } }

export const ConContador: Story = { args: { badges: { Profile: 3, Credentials: 120 } } }

export const PerfilActivo: Story = { args: { initialIndex: 3 } }
