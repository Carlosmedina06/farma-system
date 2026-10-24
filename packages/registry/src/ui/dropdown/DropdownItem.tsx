import { FC } from 'react'
import { Pressable, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Icon, type IconName } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

export interface DropdownItemProps {
  icon?: IconName
  label: string
  description?: string
  selected: boolean
  onPress: () => void
  /** Transforma label y description antes de mostrarlos (por defecto, identidad). */
  formatLabel?: (label: string) => string
  className?: string
  testID?: string
}

const identity = (label: string) => label

export const DropdownItem: FC<DropdownItemProps> = ({
  icon,
  label,
  description,
  selected,
  onPress,
  formatLabel = identity,
  className,
  testID = 'dropdown-item',
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'bg-base-white min-h-[56px] flex-1 flex-row items-center justify-between gap-3 px-6',
        selected && 'bg-gray-50',
        className,
      )}
      testID={testID}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-4">
        {icon && <Icon color="#1d2939" name={icon} size={24} />}
        <Text semibold className="text-gray-800" type="body1">
          {formatLabel(label)}
        </Text>
        {description && (
          <Text className="text-gray-800" type="body1">
            {formatLabel(description)}
          </Text>
        )}
      </View>
      {selected && <Icon color="#1d2939" name="check" size={24} />}
    </Pressable>
  )
}
