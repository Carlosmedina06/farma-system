import { useState } from 'react'
import { Platform, Pressable, View, ViewProps } from 'react-native'
import { tv } from 'tailwind-variants'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'
import { Spinner } from '@farma/registry/ui/spinner'

import {
  ButtonProps,
  getType,
  iconSizeMapper,
  iconColorMapper,
  textAlignMapper,
  textColorMapper,
  textSizeMapper,
  backgroundColorMapper,
  borderColorMapper,
  borderWidthMapper,
} from './Button.types'

const buttonVariants = tv({
  base: 'flex-row items-center justify-center gap-1.5 rounded-md',
  variants: {
    full: {
      true: 'self-stretch',
      false: 'self-start max-w-full',
    },
    size: {
      xs: 'min-h-[32px] px-padding-lg py-padding-xs',
      sm: 'min-h-[36px] px-padding-lg py-padding-sm',
      md: 'min-h-[40px] px-padding-xl py-padding-md',
      lg: 'min-h-[44px] px-padding-xl py-padding-lg',
      xl: 'min-h-[52px] px-padding-xl py-padding-xl',
      '2xl': 'min-h-[56px] px-padding-2xl py-padding-xl',
    },
  },
  defaultVariants: {
    size: 'xl',
    full: true,
  },
})

export const Button = ({
  color,
  size = 'xl',
  disabled,
  type = 'primary',
  textAlign = 'center',
  icon,
  full = true,
  iconRightSide,
  children,
  onPress,
  loading,
  className,
  testID,
  style,
  ...props
}: ButtonProps & ViewProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  const onPressIn = () => setIsPressed(true)
  const onPressOut = () => setIsPressed(false)

  const buttonType = getType(type, disabled, isPressed)
  const bgColor = backgroundColorMapper[buttonType] || ''
  const borderColor = borderColorMapper[buttonType] || ''
  const borderWidth = borderWidthMapper[buttonType] || ''
  const justifyContent = textAlignMapper[textAlign]

  const extractTextColorClasses = (classNames?: string): string => {
    if (!classNames) return ''

    return classNames
      .split(/\s+/)
      .filter((cls) => cls.startsWith('text-'))
      .join(' ')
  }

  const textColorClasses = extractTextColorClasses(className)
  const containerClasses = className
    ? className
        .split(/\s+/)
        .filter((cls) => !cls.startsWith('text-'))
        .join(' ')
    : ''

  return (
    <Pressable
      {...props}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      className={cn(
        buttonVariants({ full, size }),
        bgColor,
        borderColor,
        borderWidth,
        disabled && 'opacity-50',
        containerClasses,
      )}
      disabled={disabled}
      style={[style, { justifyContent }]}
      testID={testID}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {loading && <Spinner position="absolute" size={size} testID="button-spinner" />}
      <View
        className={cn('flex-row items-center gap-1.5', !full && 'shrink-0', loading && 'opacity-0')}
        pointerEvents={loading ? 'none' : 'auto'}
      >
        {!iconRightSide && icon && (
          <View testID="button-icon-left">
            <Icon color={iconColorMapper[buttonType]} name={icon} size={iconSizeMapper[size]} />
          </View>
        )}

        <Text
          accessible={false}
          semibold
          className={cn(
            color || textColorMapper[buttonType],
            textAlign === 'center' ? '' : 'pl-padding-xl',
            textColorClasses,
          )}
          maxFontSizeMultiplier={Platform.OS === 'android' ? 1.4 : 1.5}
          numberOfLines={full ? 2 : 1}
          style={{ textAlign, flexShrink: full ? 1 : 0 }}
          type={textSizeMapper[size]}
        >
          {children}
        </Text>

        {iconRightSide && icon && (
          <View testID="button-icon-right">
            <Icon color={iconColorMapper[buttonType]} name={icon} size={iconSizeMapper[size]} />
          </View>
        )}
      </View>
    </Pressable>
  )
}
