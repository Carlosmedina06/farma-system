import { Pressable, View, ViewProps } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { DropDownButtonProps } from './DropDownButton.types'

const GLOW_COLOR_ERROR = '#fbd2d5'
const GLOW_DISTANCE = 2

const identity = (value: string) => value

export const DropDownButton = ({
  label,
  text,
  value,
  formatValue = identity,
  disabled,
  onPress,
  small = false,
  error = false,
  errorMessage,
  className,
  testID,
  ...props
}: DropDownButtonProps & ViewProps) => {
  const borderRadius = small ? 8 : 12

  return (
    <View {...props} className={cn('w-full', className)} testID={testID}>
      {label && (
        <Text semibold className="mb-1.5" type="body2">
          {label}
        </Text>
      )}
      <Pressable
        className="w-full"
        disabled={disabled}
        testID={testID ? `${testID}-button` : 'dropdown-button'}
        onPress={onPress}
      >
        <View style={{ width: '100%' }}>
          {error && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -GLOW_DISTANCE,
                right: -GLOW_DISTANCE,
                bottom: -GLOW_DISTANCE,
                left: -GLOW_DISTANCE,
                borderRadius: borderRadius + GLOW_DISTANCE,
                backgroundColor: GLOW_COLOR_ERROR,
              }}
            />
          )}
          <View
            className={cn(
              'w-full border',
              disabled ? 'bg-gray-50' : 'bg-base-white',
              error ? 'border-error-300' : 'border-gray-300',
              small ? 'py-padding-xxs rounded-sm' : 'h-11 rounded-md',
              'px-padding-md',
            )}
          >
            <View className="flex-1 flex-row items-center justify-between">
              <Text
                className={value && !disabled ? 'text-gray-800' : 'text-gray-400'}
                type={small ? 'caption' : 'body1'}
              >
                {value ? formatValue(value) : text}
              </Text>
              <Icon
                color={disabled ? '#98a2b3' : '#475467'}
                name="chevron-down"
                size={small ? 20 : 24}
              />
            </View>
          </View>
        </View>
      </Pressable>
      {error && errorMessage && (
        <Text className="text-error-600 mt-1.5" type="body2">
          {errorMessage}
        </Text>
      )}
    </View>
  )
}
