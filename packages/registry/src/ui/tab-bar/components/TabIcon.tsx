import { View } from 'react-native'

import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import type { TabBarBadge, TabBarIconSet } from '../TabBar.types'

const ACTIVE_COLOR = '#3b4aca'
const INACTIVE_COLOR = '#475467'

type TabIconProps = {
  icons?: TabBarIconSet
  isFocused: boolean
  badge?: TabBarBadge
}

const hasBadge = (badge: TabBarBadge) => (typeof badge === 'number' ? badge > 0 : !!badge)

const TabIcon = ({ icons, isFocused, badge }: TabIconProps) => {
  if (!icons) return null

  const showBadge = hasBadge(badge)
  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR

  if (isFocused) {
    return <Icon color={color} name={icons.active} size={24} />
  }

  // Si la ruta define un icono "con badge" (p. ej. campana con punto), se usa en lugar del punto.
  if (showBadge && icons.badge) {
    return <Icon color={color} name={icons.badge} size={24} />
  }

  return (
    <View>
      <Icon color={color} name={icons.inactive} size={24} />
      {showBadge &&
        (typeof badge === 'number' ? (
          <View
            className="bg-error-500 absolute -top-1 -right-2 min-w-4 items-center justify-center rounded-full px-1"
            testID="tab-icon-badge"
          >
            <Text className="text-base-white" type="navbar">
              {badge > 99 ? '99+' : String(badge)}
            </Text>
          </View>
        ) : (
          <View
            className="bg-error-500 absolute top-0 right-0 h-2 w-2 rounded-full"
            testID="tab-icon-badge"
          />
        ))}
    </View>
  )
}

export default TabIcon
