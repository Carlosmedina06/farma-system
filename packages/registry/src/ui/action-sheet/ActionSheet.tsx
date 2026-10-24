import { Fragment, type ReactNode } from 'react'
import { Platform, View } from 'react-native'

import { getHP } from '@farma/registry/lib/dimensions'
import { cn } from '@farma/registry/lib/utils'
import { BottomSheet } from '@farma/registry/ui/bottom-sheet'
import { Icon } from '@farma/registry/ui/icon'
import { RippleButtonEffect } from '@farma/registry/ui/ripple-button'
import { Text } from '@farma/registry/ui/text'

import { ActionSheetOption, ActionSheetProps } from './ActionSheet.types'

function OptionRow({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <View className="gap-gap-sm p-padding-md flex-row content-center items-center rounded-md">
      {children}
    </View>
  )
}

export function ActionSheet({
  open,
  close,
  options,
  title,
  description,
  descriptionIcon = 'info-circle',
  footer,
  closeOnSelect = false,
  className,
  testID = 'action-sheet',
}: ActionSheetProps) {
  const handlePress = (option: ActionSheetOption) => {
    if (option.disabled) return

    void option.onPress()
    if (closeOnSelect) close()
  }

  return (
    <BottomSheet
      close={close}
      closeIconTestID={`${testID}-close`}
      content={Fragment}
      open={open}
      testID={`${testID}-bottom-sheet`}
      title={title}
    >
      <View
        className={cn('flex-1 border-t border-gray-300', className)}
        style={{ paddingBottom: Platform.OS === 'android' ? getHP(3) : 0 }}
        testID={testID}
      >
        <View className="mt-gap-lg gap-gap-md pb-gap-lg pl-gap-lg pr-gap-lg">
          {options.map((option) => (
            <RippleButtonEffect
              key={option.key}
              accessibilityLabel={option.label}
              accessibilityRole="button"
              accessibilityState={{ disabled: !!option.disabled }}
              disabled={option.disabled}
              testID={option.testID ?? `${testID}-${option.key}`}
              onPress={() => handlePress(option)}
            >
              <OptionRow>
                {option.icon ? (
                  <Icon color={option.disabled ? '#98a2b3' : undefined} name={option.icon} size={24} />
                ) : null}
                <View className="flex-1">
                  <Text className={option.disabled ? 'text-gray-400' : undefined}>{option.label}</Text>
                  {option.description ? (
                    <Text className="text-gray-600" type="body2">
                      {option.description}
                    </Text>
                  ) : null}
                </View>
              </OptionRow>
            </RippleButtonEffect>
          ))}

          {description ? (
            <View className="border-t border-gray-300" testID={`${testID}-info`}>
              <View className="gap-gap-sm p-padding-xl flex-row items-center">
                <Icon className="text-primary-700" name={descriptionIcon} size={20} />
                <Text className="flex-1 text-gray-800" type="body2">
                  {description}
                </Text>
              </View>
            </View>
          ) : null}

          {footer}
        </View>
      </View>
    </BottomSheet>
  )
}

export default ActionSheet
