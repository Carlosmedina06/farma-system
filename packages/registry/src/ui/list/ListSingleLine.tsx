import { View, ViewProps } from 'react-native'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { ListSingleLineProps } from './List.types'

export const ListSingleLine = ({
  label,
  description,
  className,
  testID,
  ...props
}: ListSingleLineProps & ViewProps) => {
  return (
    <View {...props} className={cn('flex-1 flex-row', className)} testID={testID}>
      <View className="flex-1 flex-row items-center justify-between">
        <Text semibold className="text-gray-800">
          {label}
        </Text>
        {description && (
          <Text className="text-gray-700" numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>
    </View>
  )
}
