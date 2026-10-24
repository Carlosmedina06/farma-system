import { useState } from 'react'
import { Pressable, ViewProps } from 'react-native'
import { tv } from 'tailwind-variants'
import { Icon } from '@farma/registry/ui/icon'
import { cn } from '@farma/registry/lib/utils'
import { Spinner } from '@farma/registry/ui/spinner'

import {
  ButtonOnlyProps,
  getType,
  iconSizeMapper,
  iconColorMapper,
  backgroundColorMapper,
  borderColorMapper,
  borderWidthMapper,
} from './Button.types'

const ROUNDED_TYPES = ['primary', 'tertiary', 'tertiaryGraySquare', 'tertiaryGraySquarePressed']

const buttonOnlyVariants = tv({
  base: 'justify-center items-center',
  variants: {
    size: {
      xs: 'h-[26px] w-[26px]',
      sm: 'h-[36px] w-[36px]',
      md: 'h-[40px] w-[40px]',
      lg: 'h-[44px] w-[44px]',
      xl: 'h-[48px] w-[48px]',
      '2xl': 'h-[56px] w-[56px]',
    },
  },
})

export const ButtonOnly = ({
  size = 'md',
  disabled,
  type = 'primary',
  icon = 'plus',
  loading,
  onPress,
  className,
  testID,
  ...props
}: ButtonOnlyProps & ViewProps) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  const onPressIn = () => setIsPressed(true)
  const onPressOut = () => setIsPressed(false)

  const buttonType = getType(type, disabled, isPressed)
  const bgColor = backgroundColorMapper[buttonType] || ''
  const borderColor = borderColorMapper[buttonType] || ''
  const borderWidth = borderWidthMapper[buttonType] || ''
  const isRounded = ROUNDED_TYPES.includes(buttonType)

  return (
    <Pressable
      {...props}
      className={cn(
        buttonOnlyVariants({ size, className }),
        bgColor,
        borderColor,
        borderWidth,
        isRounded ? 'rounded-md' : 'rounded-full',
        disabled && 'opacity-50',
      )}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      {loading ? (
        <Spinner size={iconSizeMapper[size]} />
      ) : (
        <Icon color={iconColorMapper[buttonType]} name={icon} size={iconSizeMapper[size]} />
      )}
    </Pressable>
  )
}
