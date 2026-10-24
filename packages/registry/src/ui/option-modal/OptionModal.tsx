import React, { useEffect, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useReducedMotion,
} from 'react-native-reanimated'

import { cn } from '@farma/registry/lib/utils'
import { Button } from '@farma/registry/ui/button'
import { Input } from '@farma/registry/ui/input'
import { Radio } from '@farma/registry/ui/radio'
import { Text } from '@farma/registry/ui/text'
import { Portal } from '@farma/registry/ui/portal'

import { circumferenceNegativeMargin, circumferenceSize, circumferenceSpace } from './OptionModal.constants'
import type { ModalOption, OptionModalProps } from './OptionModal.types'

const AnimatedView = Animated.createAnimatedComponent(View)

const DEFAULT_MIN_LENGTH = 10
const DEFAULT_MAX_LENGTH = 150

/** ¿La selección actual es la opción de texto libre y le falta texto? */
export function isFreeTextInvalid(selected: ModalOption | undefined, freeText: OptionModalProps['freeTextOption']) {
  if (!freeText || selected?.value !== freeText.value) return false
  return (selected.otherText?.length ?? 0) < (freeText.minLength ?? DEFAULT_MIN_LENGTH)
}

/** Modal con una lista de opciones (radio). Controlado por `visible`; no usa estado global. */
export const OptionModal: React.FC<OptionModalProps> = ({
  fullScreen,
  primaryAction,
  secondaryAction,
  preContent,
  title,
  visible,
  options,
  freeTextOption,
  selectedOption: controlledOption,
  onSelectOption,
  close,
  circumferenceColor,
  testID = 'option-modal',
}) => {
  const [internalOption, setInternalOption] = useState<ModalOption | undefined>()
  const selectedOption = controlledOption ?? internalOption
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  const select = (option: ModalOption | undefined) => {
    setInternalOption(option)
    onSelectOption?.(option)
  }

  useEffect(() => {
    if (!visible) setInternalOption(undefined)
  }, [visible])

  const isFreeTextSelected = !!freeTextOption && selectedOption?.value === freeTextOption.value
  const showOtherTextError = isFreeTextInvalid(selectedOption, freeTextOption)

  const handleOnOtherTextChange = (text: string) => {
    if (!selectedOption) return
    select({ ...selectedOption, otherText: text.slice(0, freeTextOption?.maxLength ?? DEFAULT_MAX_LENGTH) })
  }

  if (!visible) return null

  return (
    <Portal>
      <AnimatedView
        className="absolute top-0 right-0 bottom-0 left-0 bg-[#1d293999]"
        entering={reduceMotion ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid ? undefined : FadeOut}
        style={{ opacity: 1 }}
      />
      <AnimatedView
        className={cn(
          'absolute top-0 right-0 bottom-0 left-0 flex-row items-center justify-center p-6',
          fullScreen && 'bg-base-white overflow-hidden p-0 pt-8',
          !fullScreen && 'mx-4',
        )}
        entering={reduceMotion ? undefined : SlideInDown}
        exiting={reduceMotion || isAndroid ? undefined : SlideOutDown}
        style={{ height: '100%' }}
      >
        <Pressable className="absolute top-0 right-0 bottom-0 left-0" testID={`${testID}-overlay`} onPress={close} />
        {circumferenceColor && (
          <View
            className="absolute self-center rounded-full"
            style={{
              top: -circumferenceSize / 2 - circumferenceNegativeMargin,
              backgroundColor: circumferenceColor,
              width: circumferenceSize,
              height: circumferenceSize,
            }}
          />
        )}
        <Pressable
          className={cn(
            'bg-base-white flex-1 items-center rounded-md px-6 py-6',
            fullScreen && 'm-0 max-w-none flex-1 justify-between self-stretch rounded-none bg-transparent px-0 py-4',
          )}
          style={{
            maxWidth: fullScreen ? undefined : 400,
            paddingTop: circumferenceColor ? circumferenceSpace - circumferenceNegativeMargin : undefined,
          }}
          testID={`${testID}-content`}
          onPress={() => {}}
        >
          <View
            className={cn('items-center justify-center', circumferenceColor && 'mt-4')}
            style={{
              padding: 24,
              paddingTop: circumferenceColor ? circumferenceSpace - circumferenceNegativeMargin : 24,
            }}
          >
            {preContent}
            <Text className={cn('pb-1 text-center text-gray-800', circumferenceColor && 'mt-4')} type="h1">
              {title}
            </Text>
          </View>

          <View className="gap-4 self-stretch py-4">
            {options?.map((option) => (
              <Pressable
                key={option.value}
                className="flex-row gap-3 self-stretch"
                testID={`${testID}-option-${option.value}`}
                onPress={() => select(option)}
              >
                <Radio
                  selected={selectedOption?.value === option.value}
                  size="md"
                  testID={`${testID}-option-${option.value}-radio`}
                />
                <View className="flex-1">
                  <Text type="body1">{option.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {isFreeTextSelected && (
            <View className="gap-4 self-stretch py-4">
              <Input
                helperText={
                  showOtherTextError
                    ? (freeTextOption.errorText ??
                      `Ingresá un mínimo de ${freeTextOption.minLength ?? DEFAULT_MIN_LENGTH} caracteres`)
                    : ''
                }
                placeholder={freeTextOption.placeholder}
                testID={`${testID}-other-input`}
                value={selectedOption?.otherText}
                onChangeText={handleOnOtherTextChange}
              />
            </View>
          )}

          {(primaryAction || secondaryAction) && (
            <View className={cn('mt-6 gap-3 self-stretch', fullScreen && 'mt-0')}>
              {primaryAction && (
                <Button
                  key="primary-action"
                  type="primary"
                  {...primaryAction}
                  full
                  disabled={!selectedOption || showOtherTextError}
                  size="lg"
                  testID={primaryAction.testID ?? `${testID}-primary-button`}
                />
              )}
              {secondaryAction && (
                <Button
                  key="secondary-action"
                  type="tertiary"
                  {...secondaryAction}
                  full
                  size="lg"
                  testID={secondaryAction.testID ?? `${testID}-secondary-button`}
                />
              )}
            </View>
          )}
        </Pressable>
      </AnimatedView>
    </Portal>
  )
}
