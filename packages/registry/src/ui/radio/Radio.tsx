import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated'
import { tv } from 'tailwind-variants'

import { cn } from '@farma/registry/lib/utils'

import { RadioProps } from './Radio.types'

const radioContainerVariants = tv({
  base: 'rounded-full items-center justify-center self-center',
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
    disabled: {
      true: 'border-0 bg-gray-100',
      false: 'bg-gray-50 border border-gray-300',
    },
  },
})

const dotVariants = tv({
  base: 'rounded-full',
  variants: {
    size: {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
    },
    disabled: {
      true: 'bg-gray-300',
      false: 'bg-gray-600',
    },
  },
})

export const Radio = ({
  size = 'sm',
  selected,
  onPress,
  disabled,
  className,
  testID,
  ...props
}: RadioProps) => {
  const animatedValue = useSharedValue(selected ? 1 : 0)

  useEffect(() => {
    animatedValue.value = withSpring(selected ? 1 : 0)
  }, [selected, animatedValue])

  const animatedDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0, 1])
    const scale = interpolate(animatedValue.value, [0, 1], [0.3, 1])

    return {
      opacity,
      transform: [{ scale }],
    }
  })

  return (
    <Pressable
      {...props}
      className={cn(radioContainerVariants({ size, disabled, className }))}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
    >
      {selected && (
        <Animated.View style={animatedDotStyle}>
          <View className={dotVariants({ size, disabled })} />
        </Animated.View>
      )}
    </Pressable>
  )
}
