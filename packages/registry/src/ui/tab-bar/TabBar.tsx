import { useEffect } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { getHP } from '@farma/registry/lib/dimensions'
import { shadowTop } from '@farma/registry/lib/tokens'
import { cn } from '@farma/registry/lib/utils'

import TabItem from './components/TabItem'
import type { TabBarProps, TabBarRoute } from './TabBar.types'

export const TabBar = ({
  state,
  descriptors,
  navigation,
  icons,
  badges,
  className,
  testID = 'tab-bar',
}: TabBarProps) => {
  const { width } = useWindowDimensions()
  const tabWidth = width / Math.max(state.routes.length, 1)
  const indicatorTargetX = state.index * tabWidth + tabWidth * 0.15
  const translateX = useSharedValue(indicatorTargetX)

  useEffect(() => {
    translateX.value = withSpring(indicatorTargetX)
  }, [indicatorTargetX, translateX])

  const handleTabPress = (route: TabBarRoute, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })

    if (!isFocused && !event.defaultPrevented) {
      // Equivalente a `TabActions.jumpTo(route.name, route.params)`.
      navigation.dispatch({ type: 'JUMP_TO', payload: { name: route.name, params: route.params } })
    }
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View
      className={cn('bg-base-white pb-safe relative flex-row', className)}
      style={{ ...shadowTop }}
      testID={testID}
    >
      <View className="absolute top-0 z-1 w-full border-t border-gray-200" />
      <Animated.View
        className="bg-primary-700 absolute top-0 z-2"
        style={[{ width: tabWidth * 0.7, height: getHP(0.3) }, indicatorStyle]}
        testID={`${testID}-indicator`}
      />
      {state.routes.map((route, index) => {
        const options = descriptors[route.key]?.options ?? {}
        const label = options.tabBarLabel ?? options.title ?? route.name
        const isFocused = state.index === index

        return (
          <TabItem
            key={route.key}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            badge={badges?.[route.name]}
            icons={icons[route.name]}
            isFocused={isFocused}
            label={label}
            route={route}
            testID={options.tabBarButtonTestID}
            onPress={() => handleTabPress(route, isFocused)}
          />
        )
      })}
    </View>
  )
}
