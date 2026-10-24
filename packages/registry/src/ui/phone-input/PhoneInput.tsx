import { useState } from 'react'
import { Platform, TextInput, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { CheckIcon } from '@farma/registry/ui/check-icon'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { PhoneInputProps } from './PhoneInput.types'

const PHONE_MASK_LENGTH = 10
const GLOW_DISTANCE = 2
const BORDER_RADIUS = 12

const getGlowColor = (focus: boolean, error: boolean) => {
  if (focus && !error) return '#d4d8fd'
  if (error) return '#fbd2d5'

  return undefined
}

export const PhoneInput = ({
  value = '',
  onChangeText,
  error = false,
  errorMessage,
  label = 'Número de teléfono',
  helperText = 'Código de área + número.',
  countryCode = '+54 9',
  placeholder = '11 1234 5678',
  onFocus,
  onBlur,
  isValid = false,
  testID,
  ...textInputProps
}: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const glowColor = getGlowColor(isFocused, error)
  const borderColor = error ? 'border-error-300' : 'border-gray-300'

  return (
    <View className="gap-gap-xxs" testID={testID}>
      {!!label && (
        <Text semibold className="text-gray-800" type="body2">
          {label}
        </Text>
      )}
      <View style={{ alignSelf: 'stretch' }}>
        {!!glowColor && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -GLOW_DISTANCE,
              right: -GLOW_DISTANCE,
              bottom: -GLOW_DISTANCE,
              left: -GLOW_DISTANCE,
              borderRadius: BORDER_RADIUS + GLOW_DISTANCE,
              backgroundColor: glowColor,
            }}
            testID={testID ? `${testID}-glow` : 'phone-input-glow'}
          />
        )}
        <View
          className={cn(
            'gap-gap-sm bg-base-white px-padding-sm h-14 flex-row items-center rounded-md border',
            borderColor,
          )}
        >
          <Text className="text-gray-400" type="body1">
            {countryCode}
          </Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            className="h-14 flex-1 text-gray-800"
            keyboardType="phone-pad"
            placeholder={placeholder}
            maxLength={PHONE_MASK_LENGTH}
            placeholderTextColorClassName="accent-gray-400"
            style={{
              fontSize: 16,
              lineHeight: Platform.OS === 'ios' ? 20 : 24,
              paddingVertical: 10,
              fontFamily: 'Inter-Regular',
              textAlignVertical: 'center',
              includeFontPadding: false,
            }}
            testID={testID ? `${testID}-input` : 'phone-input'}
            value={value}
            {...textInputProps}
            onBlur={handleBlur}
            onChangeText={(text) => {
              const cleanText = text.replaceAll(/\D/g, '').slice(0, PHONE_MASK_LENGTH)

              onChangeText?.(cleanText)
            }}
            onFocus={handleFocus}
          />
          {error && <Icon color="#fa4752" name="alert-circle" size={24} />}
          {!error && isValid && <CheckIcon color="#475467" size={24} />}
        </View>
      </View>
      {!error && !!helperText && (
        <Text className="mt-0 text-gray-700" type="body2">
          {helperText}
        </Text>
      )}
      {error && errorMessage && (
        <Text className="text-error-600 mt-0" type="body2">
          {errorMessage}
        </Text>
      )}
    </View>
  )
}
