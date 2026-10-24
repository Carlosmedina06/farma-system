import { Pressable, View, type ViewProps } from 'react-native'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { ChipProps, backgroundColorMapper, textColorMapper, iconColorMapper } from './Chip.types'

const getContainerClasses = (
  type: ChipProps['type'],
  checked?: boolean,
  selected?: boolean,
  disabled?: boolean,
) => {
  const base =
    'rounded-sm gap-gap-xxs px-padding-sm py-padding-xxs flex-row self-start items-center border'

  if (disabled) {
    return `${base} bg-gray-100 border-gray-300 opacity-60`
  }

  if (checked) {
    return `${base} bg-primary-50 border-transparent`
  }

  if (selected) {
    return `${base} ${backgroundColorMapper[type || 'info']} border-transparent`
  }

  const bgColor = backgroundColorMapper[type || 'info']
  const borderClass = type === 'tag' ? 'border-gray-300' : 'border-transparent'

  return `${base} ${bgColor} ${borderClass}`
}

export const Chip = ({
  onPress,
  selected,
  checked,
  children,
  close,
  type = 'info',
  fontWeight,
  disabled = false,
  className,
  testID,
  ...props
}: ChipProps & ViewProps) => {
  const getTextType = () => {
    if (close) {
      return 'body2'
    }
    if (type === 'gray' || type === 'selected') {
      return 'body2'
    }

    return 'body1'
  }

  const getTextColor = () => {
    if (disabled) {
      return 'text-gray-600'
    }
    if (selected || checked) {
      return 'text-primary-600'
    }

    return textColorMapper[type]
  }

  const getIconColor = () => {
    if (selected) {
      return iconColorMapper.selected
    }

    return iconColorMapper.default
  }

  return (
    <Pressable
      {...props}
      className={cn(getContainerClasses(type, checked, selected, disabled), className)}
      disabled={disabled}
      testID={testID}
      onPress={disabled ? undefined : onPress}
    >
      <Text
        accessible={false}
        className={cn(getTextColor())}
        ellipsizeMode="tail"
        numberOfLines={1}
        semibold={checked || selected}
        style={fontWeight ? { fontWeight } : undefined}
        type={getTextType()}
      >
        {children}
      </Text>
      {close && (
        <View accessible={false} importantForAccessibility="no-hide-descendants">
          <Icon color={getIconColor()} name="x-close" size={16} />
        </View>
      )}
    </Pressable>
  )
}
