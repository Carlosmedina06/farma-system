import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated'
import { tv } from 'tailwind-variants'

import { cn } from '@farma/registry/lib/utils'
import { CheckboxCheckIcon } from '@farma/registry/ui/check-icon'
import { Icon } from '@farma/registry/ui/icon'
import { Radio, type RadioSize } from '@farma/registry/ui/radio'

import { CheckboxProps, containersWidths, iconSize, getBorderRadius } from './Checkbox.types'

type CheckboxBoxState = 'unchecked' | 'checkedPrimary' | 'checkedNeutral' | 'disabled' | 'minus'

const getCheckboxBoxState = ({
  checked,
  disabled,
  minus,
  appearance,
}: {
  checked: boolean
  disabled: boolean
  minus: boolean
  appearance: 'primary' | 'neutral'
}): CheckboxBoxState => {
  if (disabled) {
    return 'disabled'
  }

  if (minus) {
    return 'minus'
  }

  if (!checked) {
    return 'unchecked'
  }

  return appearance === 'neutral' ? 'checkedNeutral' : 'checkedPrimary'
}

const containerVariants = tv({
  base: 'absolute items-center justify-center border',
  variants: {
    size: {
      sm: 'w-5 h-5 p-[3px]',
      md: 'w-6 h-6 p-0.5',
      lg: 'w-6 h-6 p-8',
    },
    boxState: {
      unchecked: 'bg-gray-50 border-gray-300',
      checkedPrimary: 'bg-primary-600 border-primary-600',
      checkedNeutral: 'bg-gray-50 border-gray-300',
      disabled: 'bg-gray-100 border-gray-100',
      minus: 'border-gray-600 bg-gray-600',
    },
  },
})

const hoverVariants = tv({
  base: 'bg-gray-300',
  variants: {
    size: {
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-6 h-6',
    },
    disabled: {
      true: 'bg-transparent',
      false: '',
    },
  },
})

const getIconColor = ({
  checked,
  disabled,
  minus,
  appearance,
}: {
  checked: boolean
  disabled: boolean
  minus: boolean
  appearance: 'primary' | 'neutral'
}): string => {
  if (disabled) {
    return '#D0D5DD'
  }
  if (minus) {
    return '#ffffff'
  }
  if (checked && appearance === 'neutral') {
    return '#475467'
  }
  if (checked) {
    return '#ffffff'
  }

  return '#475467'
}

const CheckboxComponent = ({
  checked = false,
  disabled = false,
  minus = false,
  appearance = 'primary',
  onChange,
  size = 'sm',
  className,
  shape = 'square',
  useSvgIcon = false,
  testID,
  ...props
}: CheckboxProps) => {
  const animatedValue = useSharedValue(checked ? 1 : 0)
  const scaleValue = useSharedValue(1)
  const isAccessibilityEnabled = props.accessible !== false

  useEffect(() => {
    animatedValue.value = withSpring(checked ? 1 : 0)
  }, [checked, animatedValue])

  const handlePressIn = () => {
    scaleValue.value = withSpring(1.1)
  }

  const handlePressOut = () => {
    scaleValue.value = withSpring(1)
  }

  const baseScale = shape === 'circle' && (size === 'md' || size === 'lg') ? 1.2 : 1

  const animatedContainerStyle = useAnimatedStyle(() => {
    if (shape === 'circle') {
      const scale = interpolate(scaleValue.value, [1, 1.1], [baseScale, baseScale * 1.1])

      return {
        transform: [{ scale }],
      }
    }

    return {}
  })

  const animatedSquareStyle = useAnimatedStyle(() => {
    if (shape === 'square') {
      const scale = scaleValue.value

      return {
        transform: [{ scale }],
      }
    }

    return {}
  })

  const animatedIconStyle = useAnimatedStyle(() => {
    const scale = interpolate(animatedValue.value, [0, 1], [0.3, 1])
    const opacity = interpolate(animatedValue.value, [0, 0.5, 1], [0, 0.8, 1])

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  if (shape === 'circle') {
    const hoverSizeForRadio = 'sm'
    const radioSizeForRadio: RadioSize = 'md'

    return (
      <Animated.View
        className="items-center justify-center"
        style={[
          {
            height: containersWidths[size],
            width: containersWidths[size],
          },
          animatedContainerStyle,
        ]}
      >
        <View
          className={hoverVariants({ size: hoverSizeForRadio, disabled })}
          style={{ borderRadius: 9999 }}
        />
        <Pressable
          {...props}
          accessibilityRole={
            isAccessibilityEnabled ? (props.accessibilityRole ?? 'checkbox') : undefined
          }
          accessibilityState={
            isAccessibilityEnabled
              ? {
                  checked,
                  disabled,
                  ...props.accessibilityState,
                }
              : undefined
          }
          className="absolute"
          disabled={disabled}
          testID={testID}
          onPress={() => !disabled && onChange?.(!checked)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Radio
            disabled={disabled}
            selected={checked}
            size={radioSizeForRadio}
            testID={testID ? `${testID}-radio` : 'checkbox-radio'}
          />
        </Pressable>
      </Animated.View>
    )
  }

  const borderRadius = getBorderRadius(shape, size)

  const boxState = getCheckboxBoxState({
    checked,
    disabled,
    minus,
    appearance,
  })

  const showIcon = checked || minus
  const iconColor = getIconColor({
    checked,
    disabled,
    minus,
    appearance,
  })

  return (
    <Animated.View style={[animatedSquareStyle]}>
      <View className={hoverVariants({ size, disabled })} style={{ borderRadius }} />
      <Pressable
        {...props}
        accessibilityRole={
          isAccessibilityEnabled ? (props.accessibilityRole ?? 'checkbox') : undefined
        }
        accessibilityState={
          isAccessibilityEnabled
            ? {
                checked: minus ? 'mixed' : checked,
                disabled,
                ...props.accessibilityState,
              }
            : undefined
        }
        className={cn(
          containerVariants({
            boxState,
            size,
          }),
          className,
        )}
        disabled={disabled}
        style={{ borderRadius }}
        testID={testID}
        onPress={() => !disabled && onChange?.(!checked)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {showIcon && (
          <Animated.View className="items-center justify-center" style={animatedIconStyle}>
            {useSvgIcon && !minus ? (
              <CheckboxCheckIcon size={iconSize[size]} strokeColor={iconColor} strokeWidth={2} />
            ) : (
              <Icon color={iconColor} name={minus ? 'minus' : 'check'} size={iconSize[size]} />
            )}
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  )
}

export const Checkbox = React.memo(CheckboxComponent)
