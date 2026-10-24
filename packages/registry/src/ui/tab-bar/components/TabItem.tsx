import { Pressable, View } from 'react-native'

import type { TabBarBadge, TabBarIconSet, TabBarLabel, TabBarRoute } from '../TabBar.types'
import TabIcon from './TabIcon'
import TabLabel from './TabLabel'

type TabItemProps = {
  route: TabBarRoute
  isFocused: boolean
  label: TabBarLabel
  icons?: TabBarIconSet
  badge?: TabBarBadge
  accessibilityLabel?: string
  testID?: string
  onPress: () => void
}

const TabItem = ({
  route,
  isFocused,
  label,
  icons,
  badge,
  accessibilityLabel,
  testID = 'tab-item-pressable',
  onPress,
}: TabItemProps) => (
  <View className="flex-1">
    <View className="bg-base-white items-center justify-center gap-0.5 pt-4">
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tab"
        accessibilityState={{ selected: isFocused }}
        className="items-center justify-center gap-0.5"
        testID={testID}
        onPress={onPress}
      >
        <TabIcon badge={badge} icons={icons} isFocused={isFocused} />
        <TabLabel isFocused={isFocused} label={label} routeName={route.name} />
      </Pressable>
    </View>
  </View>
)

export default TabItem
