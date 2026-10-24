import { View, ViewProps } from 'react-native'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { ListIconProps } from './List.types'

export const ListIcon = ({
  label,
  description,
  icon,
  className,
  testID,
  ...props
}: ListIconProps & ViewProps) => {
  return (
    <View {...props} className={cn('flex-1 flex-row', className)} testID={testID}>
      <View className="gap-sm flex-1 flex-row items-center">
        <Icon name={icon} size={20} />
        <View className="gap-gap-xxs flex-1">
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
    </View>
  )
}
