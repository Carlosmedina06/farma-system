import { PropsWithChildren, useState } from 'react'
import { View, Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

const duration = 500

export interface AccordionProps {
  viewKey: string
  title: string
  children?: React.ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

export const Accordion = ({
  viewKey,
  title,
  children,
  onOpenChange,
}: PropsWithChildren<AccordionProps>) => {
  const height = useSharedValue(0)
  const open = useSharedValue(false)
  const [isOpen, setIsOpen] = useState(false)

  const onPress = () => {
    const nextOpen = !open.value

    open.value = nextOpen
    onOpenChange?.(nextOpen)
  }

  useDerivedValue(() => {
    runOnJS(setIsOpen)(open.value)
  }, [open])

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(open.value), { duration }),
  )

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }))

  return (
    <View className="border-b border-gray-100">
      <Pressable testID="accordion-header" onPress={onPress}>
        <View className="flex-row items-center justify-between self-stretch rounded-lg px-6 py-6">
          <View className="flex-1">
            <Text>{title}</Text>
          </View>
          <View className="ml-4">
            <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} />
          </View>
        </View>
      </Pressable>

      <Animated.View
        key={`accordionItem_${viewKey}`}
        style={[{ overflow: 'hidden', alignSelf: 'stretch' }, bodyStyle]}
      >
        <View
          className="absolute self-stretch rounded-lg px-6"
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height
          }}
        >
          {children}
          <View className="h-4" />
        </View>
      </Animated.View>
    </View>
  )
}
