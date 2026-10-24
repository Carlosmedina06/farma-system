import { useState, useEffect, useCallback } from 'react'
import { Pressable, TextInput, View, ViewProps } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { shadowCard } from '@farma/registry/lib/tokens'
import { cn } from '@farma/registry/lib/utils'
import { CheckIcon } from '@farma/registry/ui/check-icon'
import { Icon } from '@farma/registry/ui/icon'
import {
  assignRef,
  getGlowColor,
  getInputClasses,
  getInputVariants,
  InputGlow,
  useInputMask,
} from '@farma/registry/ui/input'
import { Text } from '@farma/registry/ui/text'

import { EmailInputProps, EMAIL_DOMAINS } from './EmailInput.types'

export const EmailInput = ({
  disabled = false,
  error = false,
  errorMessage,
  filled = false,
  helperText,
  label,
  placeholder,
  icon,
  rounded,
  inputRef,
  value,
  maskPattern,
  maskOptions,
  maskType,
  maxLength,
  customPaddingVertical = 12,
  onChangeText,
  onSelectDomain,
  onDropdownToggle,
  isValid = false,
  domains = EMAIL_DOMAINS,
  className,
  inputClassName,
  testID,
  ...inputProps
}: EmailInputProps & ViewProps) => {
  const [focus, setFocus] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [filteredDomains, setFilteredDomains] = useState<readonly string[]>([])

  const dropdownHeight = useSharedValue(0)
  const dropdownOpacity = useSharedValue(0)

  const { usingMask, maskedValue, onChangeMask } = useInputMask({
    onChangeText,
    value,
    maskPattern,
    maskOptions,
    maskType,
  })

  const handleTextChange = useCallback(
    (text: string) => {
      if (usingMask) {
        onChangeMask(text)
      } else {
        onChangeText?.(text)
      }

      const atIndex = text.lastIndexOf('@')

      if (atIndex !== -1 && atIndex === text.length - 1) {
        setFilteredDomains(domains)
        setShowDropdown(true)
      } else if (atIndex !== -1 && atIndex < text.length - 1) {
        const domainPart = text.substring(atIndex)

        // Verificar si el dominio coincide exactamente con alguno de los disponibles
        const exactMatch = domains.some(
          (domain) => domain.toLowerCase() === domainPart.toLowerCase(),
        )

        if (exactMatch) {
          setShowDropdown(false)

          return
        }

        const filtered = domains.filter((domain) =>
          domain.toLowerCase().startsWith(domainPart.toLowerCase()),
        )

        if (filtered.length > 0) {
          setFilteredDomains(filtered)
          setShowDropdown(true)
        } else {
          setShowDropdown(false)
        }
      } else {
        setShowDropdown(false)
      }
    },
    [usingMask, onChangeMask, onChangeText, domains],
  )

  const handleSelectDomain = useCallback(
    (domain: string) => {
      const currentValue = value || ''
      const atIndex = currentValue.lastIndexOf('@')

      const newValue =
        atIndex === -1 ? currentValue + domain : currentValue.substring(0, atIndex) + domain

      onChangeText?.(newValue)
      onSelectDomain?.(domain)
      setShowDropdown(false)
    },
    [value, onChangeText, onSelectDomain],
  )

  useEffect(() => {
    onDropdownToggle?.(showDropdown)
  }, [showDropdown, onDropdownToggle])

  useEffect(() => {
    if (showDropdown) {
      setIsMounted(true)
      dropdownHeight.value = withTiming(filteredDomains.length * 48 + 16, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })
      dropdownOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      })
    } else if (isMounted) {
      dropdownOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
      dropdownHeight.value = withTiming(
        0,
        {
          duration: 350,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(setIsMounted)(false)
          }
        },
      )
    }
  }, [showDropdown, filteredDomains.length, dropdownHeight, dropdownOpacity, isMounted])

  const displayError = error && !showDropdown
  const variant = getInputVariants({ disabled, focus, error: displayError, filled })
  const glowColor = getGlowColor(focus, displayError)
  const borderRadius = rounded ? 32 : 12

  const animatedStyle = useAnimatedStyle(() => ({
    height: dropdownHeight.value,
    opacity: dropdownOpacity.value,
  }))

  return (
    <View className={cn('self-stretch', className)} testID={testID}>
      {!!label && (
        <Text semibold className="mb-1.5" type="body2">
          {label}
        </Text>
      )}

      <View className="relative self-stretch">
        <InputGlow
          borderRadius={borderRadius}
          color={glowColor}
          style={{ alignSelf: 'stretch', maxHeight: 100 }}
        >
          <View className="relative self-stretch">
            <TextInput
              ref={(ref) => assignRef(inputRef, ref)}
              maxLength={maxLength}
              style={{
                fontSize: 16,
                color: displayError ? '#d8313c' : '#1d2939',
                paddingVertical: customPaddingVertical,
                paddingRight: icon ? 30 : undefined,
              }}
              {...inputProps}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              className={cn(
                getInputClasses(variant, !!rounded, Boolean(icon?.position === 'left'), disabled),
                inputClassName,
              )}
              editable={!disabled}
              placeholder={focus ? '' : placeholder}
              testID={testID ? `${testID}-input` : 'email-input'}
              value={usingMask ? maskedValue : value}
              onBlur={(e) => {
                inputProps.onBlur?.(e)
                setTimeout(() => {
                  setFocus(false)
                  setShowDropdown(false)
                }, 150)
              }}
              onChangeText={handleTextChange}
              onFocus={(e) => {
                inputProps.onFocus?.(e)
                setFocus(true)
              }}
            />

            {displayError && (
              <View
                className="absolute top-1/2 right-3"
                style={{ transform: [{ translateY: -12 }] }}
              >
                <Icon color="#fa4752" name="alert-circle" size={24} />
              </View>
            )}

            {!displayError && isValid && (
              <View
                className="absolute top-1/2 right-3"
                style={{ transform: [{ translateY: -12 }] }}
              >
                <CheckIcon color="#475467" size={24} />
              </View>
            )}

            {!displayError && !isValid && icon && (
              <Pressable
                className={cn(
                  'absolute top-0 bottom-0 items-center justify-center',
                  icon.position === 'left' ? 'left-2.5' : 'right-2.5',
                )}
                testID={testID ? `${testID}-icon` : 'email-input-icon'}
                onPress={icon.onPress}
              >
                <Icon color={icon.color} name={icon.name} size={icon.size || 20} />
              </Pressable>
            )}
          </View>
        </InputGlow>
      </View>

      {isMounted && filteredDomains.length > 0 && (
        <Animated.View className="mt-2 self-stretch overflow-hidden" style={animatedStyle}>
          <View
            className="bg-base-white overflow-hidden rounded-md border border-gray-200"
            style={shadowCard.sm}
          >
            {filteredDomains.map((domain) => (
              <Pressable
                key={domain}
                testID={
                  testID
                    ? `${testID}-domain-${domain.replace('@', '')}`
                    : `email-input-domain-${domain.replace('@', '')}`
                }
                onPress={() => handleSelectDomain(domain)}
              >
                <View className="h-12 justify-center rounded-md px-4 py-2.5">
                  <Text semibold type="body1">
                    {domain}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}

      {displayError && errorMessage && (
        <Text className="text-error-600 mt-1" type="body2">
          {errorMessage}
        </Text>
      )}
      {helperText && !errorMessage && (
        <Text className="mt-1 text-gray-700" type="body2">
          {helperText}
        </Text>
      )}
    </View>
  )
}
