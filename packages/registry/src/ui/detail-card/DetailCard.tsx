import { Fragment } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Button } from '@farma/registry/ui/button'
import { Icon } from '@farma/registry/ui/icon'
import { ListBold } from '@farma/registry/ui/list'
import { ShimmerSkeleton } from '@farma/registry/ui/shimmer-skeleton'
import { Text } from '@farma/registry/ui/text'

import { DetailCardProps } from './DetailCard.types'

const DividerContainer = () => <View className="my-2 h-[1px] self-stretch bg-gray-300" />

const capitalizeFirst = (text?: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text)

export const DetailCard = ({
  showEdit,
  editAccessibilityLabel = 'Editar',
  title,
  itemsList,
  buttonText,
  borderColor,
  isListLight = false,
  isLoading,
  onPress,
  divider = false,
  noCostLabel = 'Sin costo',
  upperFirst = true,
  footer,
  className,
  testID,
  style,
  ...props
}: DetailCardProps) => {
  const borderColorValue = borderColor || '#D1D5DB'
  const format = upperFirst ? capitalizeFirst : (text?: string) => text

  return (
    <View
      className={cn(
        'bg-base-white flex-grow items-center justify-center self-stretch rounded-md border',
        className,
      )}
      style={[{ borderColor: borderColorValue }, style]}
      testID={testID}
      {...props}
    >
      <View
        className="flex-row items-center justify-between self-stretch border-b px-3 py-2"
        style={{ borderBottomColor: borderColorValue }}
      >
        {isLoading ? (
          <View className="self-stretch py-2.5">
            <ShimmerSkeleton colorMode="light" height={20} width="90%" />
          </View>
        ) : (
          <Text semibold className="py-1" type="body1">
            {title}
          </Text>
        )}
        {showEdit ? (
          <TouchableOpacity
            accessibilityLabel={editAccessibilityLabel}
            accessibilityRole="button"
            testID={testID ? `${testID}-edit` : 'detail-card-edit'}
            onPress={onPress}
          >
            <Icon color="#1E3A8A" name="edit-01" size={20} />
          </TouchableOpacity>
        ) : (
          !!buttonText && (
            <Button
              className="absolute right-2.5 py-1"
              testID={testID ? `${testID}-action` : 'detail-card-action'}
              type="textLink"
              onPress={onPress}
            >
              {buttonText}
            </Button>
          )
        )}
      </View>

      <View className="gap-3 self-stretch px-3 py-2">
        {isLoading ? (
          <View className="flex-row gap-3 py-2">
            <ShimmerSkeleton colorMode="light" height={30} width="90%" />
          </View>
        ) : (
          itemsList.map((item, ind) => (
            <Fragment key={`${item.label}-${ind}`}>
              <ListBold
                additionalDescription={format(item.additionalDescription)}
                caption={format(item.caption)}
                className={item.description ? 'py-2' : 'py-4'}
                description={format(item.description)}
                footnote={item.noCost ? noCostLabel : undefined}
                icon={item.icon!}
                isListLight={isListLight}
                label={format(item.label) ?? ''}
              />
              {divider && ind !== itemsList.length - 1 && <View className="h-[1px] bg-gray-300" />}
            </Fragment>
          ))
        )}
        {footer ? (
          <View className="mb-3" testID={testID ? `${testID}-footer` : 'detail-card-footer'}>
            <DividerContainer />
            {isLoading ? (
              <View>
                <ShimmerSkeleton colorMode="light" height={30} width="80%" />
              </View>
            ) : (
              footer
            )}
          </View>
        ) : null}
      </View>
    </View>
  )
}
