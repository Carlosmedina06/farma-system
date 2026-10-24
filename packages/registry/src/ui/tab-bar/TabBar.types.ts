import type { ReactNode } from 'react'
import type { IconName } from '@farma/registry/ui/icon'

/**
 * Tipos estructurales mínimos, compatibles con `BottomTabBarProps` de
 * `@react-navigation/bottom-tabs` sin depender de él.
 */
export type TabBarRoute = {
  key: string
  name: string
  params?: object
}

export type TabBarLabelPosition = 'beside-icon' | 'below-icon'

export type TabBarLabelRenderer = (props: {
  focused: boolean
  color: string
  position: TabBarLabelPosition
  children: string
}) => ReactNode

export type TabBarLabel = string | TabBarLabelRenderer

export type TabBarDescriptor = {
  options: {
    tabBarLabel?: TabBarLabel
    title?: string
    tabBarAccessibilityLabel?: string
    tabBarButtonTestID?: string
  }
}

export type TabBarState = {
  index: number
  routes: readonly TabBarRoute[]
}

export type TabBarJumpToAction = {
  type: 'JUMP_TO'
  payload: { name: string; params?: object }
}

export type TabBarNavigation = {
  emit: (event: { type: 'tabPress'; target?: string; canPreventDefault: true }) => {
    defaultPrevented: boolean
  }
  dispatch: (action: TabBarJumpToAction) => void
}

/** Iconos de una pestaña. `badge` (opcional) reemplaza a `inactive` cuando la pestaña tiene badge. */
export type TabBarIconSet = {
  active: IconName
  inactive: IconName
  badge?: IconName
}

/** `true` = punto; número > 0 = contador; `false`/`0`/`undefined` = sin badge. */
export type TabBarBadge = boolean | number | undefined

export type TabBarProps = {
  state: TabBarState
  descriptors: Record<string, TabBarDescriptor>
  navigation: TabBarNavigation
  /** Iconos por nombre de ruta. Una ruta sin entrada se muestra sin icono. */
  icons: Record<string, TabBarIconSet>
  /** Badges por nombre de ruta. */
  badges?: Record<string, TabBarBadge>
  className?: string
  testID?: string
}
