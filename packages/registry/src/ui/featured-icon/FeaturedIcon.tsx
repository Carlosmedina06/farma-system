import { View, ViewProps } from 'react-native'
import { Icon } from '@farma/registry/ui/icon'
import { cn } from '@farma/registry/lib/utils'

import {
  FeaturedIconProps,
  size,
  outlineBorder,
  circleBackgroundMapper,
  circleBorderMapper,
  iconColorMapper,
} from './FeaturedIcon.types'

export const FeaturedIcon = ({
  icon,
  type = 'success',
  outline = true,
  className,
  testID,
  ...props
}: FeaturedIconProps & ViewProps) => {
  return (
    <View
      {...props}
      className={cn('items-center justify-center', className)}
      style={{ width: size, height: size }}
      testID={testID}
    >
      <View
        className={cn(
          'absolute items-center justify-center rounded-full',
          circleBackgroundMapper[type],
          outline && circleBorderMapper[type],
        )}
        style={{
          width: size,
          height: size,
          borderWidth: outline ? outlineBorder : 0,
        }}
      />
      <View style={{ marginLeft: 1 }}>
        <Icon color={iconColorMapper[type]} name={icon} size={28} />
      </View>
    </View>
  )
}
