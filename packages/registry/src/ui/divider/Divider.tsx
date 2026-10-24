import { View, ViewProps } from 'react-native'
import { tv } from 'tailwind-variants'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { DividerProps, DividerType, dividerSizes } from './Divider.types'

const baseDividerVariants = tv({
  base: 'w-full bg-gray-200 h-[1px]',
  variants: {
    size: {
      none: 'my-0',
      xs: 'my-1',
      sm: 'my-2',
      md: 'my-3',
      lg: 'my-4',
      xl: 'my-6',
    },
  },
})

const getMarginVertical = (size: DividerProps['size']) => {
  return { marginVertical: dividerSizes[size] }
}

export const Divider = ({
  type = DividerType.Line,
  size,
  label,
  color,
  className,
  testID,
  ...props
}: DividerProps & ViewProps) => {
  if (type === DividerType.Text) {
    return (
      <View
        {...props}
        className={cn('w-full flex-row items-center justify-center gap-2', className)}
        testID={testID}
      >
        <View className="h-[1px] w-full bg-gray-200" style={getMarginVertical(size)} />
        <Text semibold className={color || 'text-gray-600'} type="body2">
          {label}
        </Text>
        <View className="h-[1px] w-full bg-gray-200" style={getMarginVertical(size)} />
      </View>
    )
  }

  return (
    <View {...props} className={cn(baseDividerVariants({ size, className }))} testID={testID} />
  )
}
