import { useEffect, useState } from 'react'
import { LayoutChangeEvent, Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { tv } from 'tailwind-variants'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { TabsProps } from './Tabs.types'

const tabLabelVariants = tv({
  base: 'pt-2 pb-3 px-4',
  variants: {
    selected: {
      true: 'text-primary-600',
      false: 'text-gray-800',
    },
    disabled: {
      true: 'text-gray-400',
      false: '',
    },
  },
  compoundVariants: [
    {
      selected: true,
      disabled: true,
      className: 'text-gray-400',
    },
  ],
})

const AnimatedView = Animated.createAnimatedComponent(View)

export const Tabs = ({ tabs, selected, onChange, className, testID, ...props }: TabsProps) => {
  const [containerWidth, setContainerWidth] = useState(0)

  const tabsLength = tabs.length
  const tabWidth = containerWidth / tabsLength
  const selectedTabIndex = tabs.findIndex((tab) => tab.key === selected)

  const translateX = useSharedValue(0)

  useEffect(() => {
    if (containerWidth > 0 && selectedTabIndex >= 0) {
      translateX.value = withTiming(selectedTabIndex * tabWidth, { duration: 200 })
    }
  }, [selectedTabIndex, tabWidth, containerWidth, translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: tabWidth,
  }))

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width)
  }

  return (
    <View {...props} className={cn('flex-row', className)} testID={testID} onLayout={handleLayout}>
      {tabs.map(({ title, key, isDisabled }) => {
        const isSelected = key === selected

        return (
          <Pressable
            key={key}
            className="flex-1 flex-row justify-center border-b-2 border-b-gray-200"
            disabled={isDisabled}
            testID={testID ? `${testID}-tab-${key}` : `tabs-tab-${key}`}
            onPress={() => onChange(key)}
          >
            <Text
              semibold
              className={tabLabelVariants({ selected: isSelected, disabled: isDisabled })}
              numberOfLines={1}
              type="body2"
            >
              {title}
            </Text>
          </Pressable>
        )
      })}

      <AnimatedView className="bg-primary-600 absolute bottom-0 left-0 h-1" style={animatedStyle} />
    </View>
  )
}
