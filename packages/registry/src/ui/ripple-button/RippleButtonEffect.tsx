import { ReactElement } from 'react'
import {
  AccessibilityProps,
  Platform,
  Pressable,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { cn } from '@farma/registry/lib/utils'

export interface RippleButtonEffectProps extends AccessibilityProps {
  onPress?: () => void
  onLongPress?: () => void
  children: ReactElement<ViewProps>
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  className?: string
  testID?: string
  /** Color del ripple en Android. */
  rippleColor?: string
  /** Color de fondo mientras está presionado en iOS. */
  pressedColor?: string
}

export const RippleButtonEffect = ({
  onPress,
  onLongPress,
  children,
  style,
  disabled = false,
  className,
  testID,
  rippleColor = '#eaecf0',
  pressedColor = '#ffffff',
  ...accessibilityProps
}: RippleButtonEffectProps) => {
  if (Platform.OS === 'ios') {
    return (
      <Pressable
        {...accessibilityProps}
        className={cn(className)}
        disabled={disabled}
        style={({ pressed }) => [
          {
            backgroundColor: pressed && !disabled ? pressedColor : 'transparent',
          },
          style,
        ]}
        testID={testID}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <Pressable
      {...accessibilityProps}
      android_ripple={!disabled ? { color: rippleColor, foreground: true } : undefined}
      className={cn(className)}
      disabled={disabled}
      style={[{ backgroundColor: 'transparent' }, style]}
      testID={testID}
      onLongPress={onLongPress}
      onPress={() => {
        if (!disabled && typeof onPress === 'function') {
          onPress()
        }
      }}
    >
      {children}
    </Pressable>
  )
}
