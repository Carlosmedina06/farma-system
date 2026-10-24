import { Pressable, View } from 'react-native'
import { tv } from 'tailwind-variants'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { TagProps, iconSize } from './Tag.types'

const containerVariants = tv({
  base: 'flex-row rounded-sm bg-base-white border border-gray-300 self-start px-1 items-center',
  variants: {
    size: {
      sm: 'py-[3px]',
      md: 'py-0.5',
      lg: 'py-1',
    },
  },
})

const tagTextVariants = tv({
  base: 'text-gray-600',
  variants: {
    size: {
      sm: 'px-1',
      md: 'px-[5px]',
      lg: 'px-1.5',
    },
  },
})

const counterContainerVariants = tv({
  base: 'bg-gray-100 rounded',
  variants: {
    size: {
      sm: 'px-1',
      md: 'px-[5px]',
      lg: 'px-1.5',
    },
  },
})

const checkboxContainerVariants = tv({
  base: 'rounded border border-gray-300 items-center justify-center',
  variants: {
    size: {
      sm: 'w-[14px] h-[14px]',
      md: 'w-4 h-4',
      lg: 'w-[18px] h-[18px]',
    },
  },
})

const closeIconVariants = tv({
  base: 'text-gray-400',
  variants: {
    size: {
      sm: 'm-0.5',
      md: 'm-0.5',
      lg: 'm-[3px]',
    },
  },
})

export const Tag = ({
  icon,
  onClose,
  checked,
  counter,
  text,
  size = 'lg',
  className,
  testID,
  ...props
}: TagProps) => {
  const textType = size === 'sm' ? 'caption' : 'body2'

  return (
    <View {...props} className={cn(containerVariants({ size }), className)} testID={testID}>
      {typeof checked === 'boolean' && (
        <View className={checkboxContainerVariants({ size })}>
          {checked && (
            <Icon
              className="mt-[1px] ml-[1px]"
              color="#98A2B3"
              name="check"
              size={iconSize[size]}
            />
          )}
        </View>
      )}
      {icon && <Icon color={icon.color} name={icon.name} size={icon.size || iconSize[size]} />}
      <Text className={tagTextVariants({ size })} type={textType}>
        {text}
      </Text>
      {counter !== undefined && (
        <View className={counterContainerVariants({ size })}>
          <Text className="text-gray-600" type={textType}>
            {counter}
          </Text>
        </View>
      )}
      {onClose && (
        <Pressable testID={testID ? `${testID}-close` : 'tag-close'} onPress={onClose}>
          <Icon className={closeIconVariants({ size })} name="x-close" size={iconSize[size]} />
        </Pressable>
      )}
    </View>
  )
}
