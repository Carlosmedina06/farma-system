import { Pressable, View } from 'react-native'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import type { HeaderWithSeeMoreProps } from './HeaderWithSeeMore.types'

/** Título de sección con link "ver más" opcional a la derecha. */
const HeaderWithSeeMore = ({
  title,
  seeMoreText,
  onPress,
  icon = 'chevron-right',
  className,
  testID,
  seeMoreTestID,
  style,
  ...restProps
}: HeaderWithSeeMoreProps) => (
  <View className={cn('flex-row justify-between', className)} style={style} testID={testID} {...restProps}>
    <Text semibold className="mb-3 text-gray-600" type="body1">
      {title}
    </Text>
    {onPress && (
      <Pressable accessibilityRole="button" testID={seeMoreTestID} onPress={onPress}>
        <View className="flex-row items-center gap-2">
          {seeMoreText && (
            <Text semibold className="text-primary-600" type="body1">
              {seeMoreText}
            </Text>
          )}
          {icon && seeMoreText && <Icon color="#4955EC" name={icon} size={20} />}
        </View>
      </Pressable>
    )}
  </View>
)

export default HeaderWithSeeMore
