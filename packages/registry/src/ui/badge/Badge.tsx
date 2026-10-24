import { Platform, View, ViewProps } from 'react-native'
import { tv } from 'tailwind-variants'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import {
  BadgeProps,
  backgroundMapper,
  iconColorMapper,
  iconSizeMapper,
  sizeMapper,
  textColorMapper,
  textSizeMapper,
} from './Badge.types'

const badgeVariants = tv({
  base: 'z-[1] self-center flex-row items-center gap-1',
  variants: {
    radius: {
      s: 'rounded-s',
      lg: 'rounded-lg',
    },
    color: {
      gray: backgroundMapper.gray,
      primary: backgroundMapper.primary,
      error: backgroundMapper.error,
      warning: backgroundMapper.warning,
      success: backgroundMapper.success,
      'blue-gray': backgroundMapper['blue-gray'],
      'blue-light': backgroundMapper['blue-light'],
      blue: backgroundMapper.blue,
      indigo: backgroundMapper.indigo,
      purple: backgroundMapper.purple,
      pink: backgroundMapper.pink,
      rose: backgroundMapper.rose,
      orange: backgroundMapper.orange,
      info: backgroundMapper.info,
      tertiary: backgroundMapper.tertiary,
    },
    size: {
      xs: 'py-xxxs px-xs',
      xsIconLeft: 'py-xxxs px-xs',
      xsIconRight: 'py-xxxs px-xs',
      sm: 'py-xxxs px-sm',
      smIconLeft: 'py-xxxs px-xs',
      smIconRight: 'py-xxxs px-xs',
      md: 'py-xxxs px-sm',
      mdIconLeft: 'py-xxxs px-xs',
      mdIconRight: 'py-xxxs px-xs',
      lg: 'py-xxs px-sm',
      lgIconLeft: 'py-xxs px-sm',
      lgIconRight: 'py-xxs px-sm',
      wide: 'py-xxxs px-md',
      wideIconLeft: 'py-xxxs px-md',
      wideIconRight: 'py-xxxs px-md',
    },
  },
  defaultVariants: {
    radius: 'lg',
  },
})

const extractTextColorClasses = (classNames?: string): string => {
  if (!classNames) return ''

  return classNames
    .split(/\s+/)
    .filter((cls) => cls.startsWith('text-'))
    .join(' ')
}

export const Badge = ({
  children,
  className,
  color,
  icon,
  iconRightSide,
  iconSize: iconSizeProp,
  iconClassName,
  radius,
  size,
  testID,
  textType: textTypeProp,
  semibold = false,
  ...viewProps
}: BadgeProps & ViewProps) => {
  const computedSize = sizeMapper(size, icon, iconRightSide)
  const textColor = textColorMapper[color]
  const iconColor = iconColorMapper[color]
  const iconSize = iconSizeProp ?? iconSizeMapper[size]
  const textType = textTypeProp ?? textSizeMapper[size]
  const textColorClasses = extractTextColorClasses(className)
  const containerClasses = className
    ? className
        .split(/\s+/)
        .filter((cls) => !cls.startsWith('text-'))
        .join(' ')
    : ''
  const resolvedTextColor = textColorClasses || textColor

  const renderIcon = (sideTestID: string) => (
    <View testID={sideTestID}>
      <Icon
        className={iconClassName || undefined}
        color={iconClassName ? undefined : iconColor}
        name={icon!}
        size={iconSize}
      />
    </View>
  )

  return (
    <View
      {...viewProps}
      className={badgeVariants({ className: containerClasses, color, radius, size: computedSize })}
      testID={testID}
    >
      {!iconRightSide && icon && renderIcon('badge-left-icon')}

      <Text
        className={cn(resolvedTextColor)}
        maxFontSizeMultiplier={Platform.OS === 'android' ? 1.1 : 1.2}
        semibold={semibold}
        type={textType}
      >
        {children}
      </Text>

      {iconRightSide && icon && renderIcon('badge-right-icon')}
    </View>
  )
}
