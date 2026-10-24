import { Pressable, View } from 'react-native'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { QuantityIndicatorProps } from './QuantityIndicator.types'

export const QuantityIndicator = ({
  quantity,
  onPress,
  className,
  testID,
  ...props
}: QuantityIndicatorProps) => {
  const badgeContent = (
    <View
      {...props}
      className={cn(
        'bg-primary-600 absolute h-[18px] w-[18px] items-center justify-center rounded-full',
        className,
      )}
      style={{
        right: -4,
        bottom: 1,
      }}
      testID={onPress ? undefined : testID}
    >
      <Text className="text-center text-xs leading-[18px] font-bold text-white">{quantity}</Text>
    </View>
  )

  if (onPress) {
    return (
      <Pressable testID={testID ?? 'quantity-indicator'} onPress={onPress}>
        {badgeContent}
      </Pressable>
    )
  }

  return badgeContent
}
