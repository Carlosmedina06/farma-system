import { Pressable, View, ViewProps } from 'react-native'
import { ShimmerSkeleton } from '@farma/registry/ui/shimmer-skeleton'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { CounterProps } from './Counter.types'

export const Counter = ({
  max = Number.MAX_SAFE_INTEGER,
  value = 0,
  onChange,
  onIncrement,
  onDecrement,
  onRemove,
  disabled,
  loading,
  className,
  testID,
  ...props
}: CounterProps & ViewProps) => {
  const increment = () => {
    onIncrement?.()
    onChange?.(value + 1)
  }

  const decrement = () => {
    onDecrement?.()
    onChange?.(value - 1)
  }

  const remove = () => {
    onRemove?.()
    onChange?.(0)
  }

  const canAdd = !disabled && !loading && value + 1 <= max
  const canRemove = !disabled && !loading && value - 1 >= 0
  const canDelete = !disabled && !loading && value > 0

  const getIconColor = (canInteract: boolean) => {
    if (disabled || !canInteract) {
      return '#d0d5dd'
    }

    return '#475467'
  }

  const handleDecrementPress = () => {
    if (value === 1) {
      if (canDelete) {
        remove()
      }
    } else if (canRemove) {
      decrement()
    }
  }

  const getDecrementIconName = () => {
    if (value === 1) {
      return 'trash-01'
    }

    return 'minus'
  }

  const getDecrementIconColor = () => {
    if (value === 1) {
      return getIconColor(canDelete)
    }

    return getIconColor(canRemove)
  }

  return (
    <View
      {...props}
      className={cn(
        'bg-background gap-gap-md p-padding-sm h-12 flex-row items-center self-start rounded-md border border-gray-300',
        disabled && 'bg-gray-100',
        className,
      )}
      testID={testID}
    >
      <Pressable
        disabled={!canDelete || loading}
        testID={testID ? `${testID}-decrement` : 'counter-decrement'}
        onPress={handleDecrementPress}
      >
        <Icon color={getDecrementIconColor()} name={getDecrementIconName()} size={20} />
      </Pressable>
      {loading ? (
        <ShimmerSkeleton colorMode="light" height={20} radius={4} width={24} />
      ) : (
        <Text semibold className="min-w-[24px] text-center text-gray-800" type="body2">
          {value + ''}
        </Text>
      )}
      <Pressable
        disabled={!canAdd || loading}
        testID={testID ? `${testID}-increment` : 'counter-increment'}
        onPress={canAdd ? increment : undefined}
      >
        <Icon color={getIconColor(canAdd)} name="plus" size={20} />
      </Pressable>
    </View>
  )
}
