import { View, ViewProps } from 'react-native'
import { Button } from '@farma/registry/ui/button'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { ListBoldProps } from './List.types'

const DISABLED_ICON_COLOR = '#98a2b3'

export const ListBold = ({
  label,
  disabled = false,
  subtitle,
  footnote,
  description,
  descriptionNumberOfLines = 3,
  descriptionClassName,
  additionalDescription,
  caption,
  icon,
  textLinkLabel,
  onTextLinkPress,
  rightIcon,
  capitalize = false,
  isListLight = false,
  className,
  testID,
  ...props
}: ListBoldProps & ViewProps) => {
  const textTransform = capitalize ? 'capitalize' : 'none'

  return (
    <View {...props} className={cn('flex-1 flex-row', className)} testID={testID}>
      <View className="gap-sm flex-1 flex-row items-start">
        <Icon color={disabled ? DISABLED_ICON_COLOR : undefined} name={icon} size={20} />

        <View className="gap-gap-xxs flex-1">
          <Text
            className={disabled ? 'text-gray-400' : 'text-gray-800'}
            semibold={disabled || !isListLight}
            style={{ textTransform }}
            type="body1"
          >
            {label}
          </Text>
          {subtitle ? (
            <Text
              className={disabled ? 'text-gray-400' : 'text-gray-700'}
              style={{ textTransform }}
              type="body2"
            >
              {subtitle}
            </Text>
          ) : null}

          {description ? (
            <View>
              <Text
                className={cn('text-gray-700', descriptionClassName)}
                ellipsizeMode="tail"
                numberOfLines={descriptionNumberOfLines}
                type="body2"
              >
                {description}
              </Text>
            </View>
          ) : null}
          {additionalDescription ? (
            <Text className="text-gray-700" ellipsizeMode="tail" numberOfLines={2} type="caption">
              {additionalDescription}
            </Text>
          ) : null}
          {footnote ? (
            <Text className="text-gray-700" ellipsizeMode="tail" numberOfLines={2} type="body2">
              {footnote}
            </Text>
          ) : null}
        </View>
      </View>
      {caption ? (
        <Text className="text-gray-700" type="caption">
          {typeof caption === 'function' ? caption() : caption}
        </Text>
      ) : null}
      {textLinkLabel ? (
        <Button
          size="sm"
          testID={testID ? `${testID}-link` : 'list-bold-link'}
          type="textLink"
          onPress={onTextLinkPress}
        >
          {textLinkLabel}
        </Button>
      ) : null}
      {rightIcon ? <Icon name={rightIcon} size={20} /> : null}
    </View>
  )
}
