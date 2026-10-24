import { useState } from 'react'
import { Pressable, TextInput, View, ViewProps } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { useInputMask } from './Input.hooks'
import { assignRef, getGlowColor, getInputClasses, InputGlow } from './Input.styles'
import { InputProps, getInputVariants } from './Input.types'
import { buildFieldErrorAccessibilityLabel } from './utils/buildFieldErrorAccessibilityLabel'

export const Input = ({
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
  className,
  inputClassName,
  testID,
  autoCapitalize = 'none',
  accessibilityLabel,
  accessibilityHint,
  ...inputProps
}: InputProps & ViewProps) => {
  const [focus, setFocus] = useState(false)

  const { usingMask, maskedValue, onChangeMask } = useInputMask({
    onChangeText,
    value,
    maskPattern,
    maskOptions,
    maskType,
  })

  const variant = getInputVariants({ disabled, focus, error, filled })
  const glowColor = getGlowColor(focus, error)
  const borderRadius = rounded ? 32 : 12
  const fieldName = accessibilityLabel ?? label ?? placeholder ?? ''
  const hasErrorMessage = Boolean(error && errorMessage)
  const errorAccessibilityLabel = hasErrorMessage
    ? buildFieldErrorAccessibilityLabel(fieldName, errorMessage as string)
    : undefined
  const resolvedAccessibilityLabel = hasErrorMessage ? errorAccessibilityLabel : accessibilityLabel

  return (
    <View accessible={false} className={cn('self-stretch', className)} testID={testID}>
      {!!label && (
        <Text accessible={false} semibold className="mb-1.5" type="body2">
          {label}
        </Text>
      )}

      <View accessible={false} className="justify-center self-stretch">
        <InputGlow
          borderRadius={borderRadius}
          color={glowColor}
          style={{ alignSelf: 'stretch', maxHeight: 100 }}
        >
          <View accessible={false} className="relative self-stretch">
            <TextInput
              ref={(ref) => assignRef(inputRef, ref)}
              maxLength={maxLength}
              style={{
                fontSize: 16,
                color: error ? '#d8313c' : '#1d2939',
                paddingVertical: customPaddingVertical,
                paddingRight: icon ? 30 : undefined,
              }}
              {...inputProps}
              accessibilityHint={accessibilityHint}
              accessibilityLabel={resolvedAccessibilityLabel}
              autoCapitalize={autoCapitalize}
              autoComplete="off"
              autoCorrect={false}
              className={cn(
                getInputClasses(variant, !!rounded, Boolean(icon?.position === 'left'), disabled),
                inputClassName,
              )}
              editable={!disabled}
              placeholder={focus ? '' : placeholder}
              testID={testID ? `${testID}-input` : 'input'}
              value={usingMask ? maskedValue : value}
              onBlur={(e) => {
                inputProps.onBlur?.(e)
                setFocus(false)
              }}
              onChangeText={usingMask ? onChangeMask : onChangeText}
              onFocus={(e) => {
                inputProps.onFocus?.(e)
                setFocus(true)
              }}
            />

            {icon &&
              (icon.onPress ? (
                <Pressable
                  accessibilityRole="button"
                  className={cn(
                    'absolute items-center justify-center',
                    icon.position === 'left' ? 'left-2.5' : 'right-2.5',
                    'top-0 bottom-0',
                  )}
                  style={{ minHeight: 44, minWidth: 44 }}
                  testID={testID ? `${testID}-icon` : 'input-icon'}
                  onPress={icon.onPress}
                >
                  <Icon color={icon.color} name={icon.name} size={icon.size || 20} />
                </Pressable>
              ) : (
                <View
                  accessible={false}
                  className={cn(
                    'absolute items-center justify-center',
                    icon.position === 'left' ? 'left-2.5' : 'right-2.5',
                    'top-0 bottom-0',
                  )}
                  importantForAccessibility="no-hide-descendants"
                  pointerEvents="none"
                  testID={testID ? `${testID}-icon` : 'input-icon'}
                >
                  <Icon color={icon.color} name={icon.name} size={icon.size || 20} />
                </View>
              ))}
          </View>
        </InputGlow>
      </View>
      {hasErrorMessage && (
        <AnimatedLayout>
          <Text
            accessibilityLabel={errorAccessibilityLabel}
            accessibilityLiveRegion="polite"
            accessibilityRole="text"
            accessible
            className="text-error-600 mt-1.5"
            testID={testID ? `${testID}-error` : 'input-error'}
            type="body2"
          >
            {errorMessage}
          </Text>
        </AnimatedLayout>
      )}
      {helperText && !errorMessage && (
        <Text accessible={false} className="mt-1.5 text-gray-700" type="body2">
          {helperText}
        </Text>
      )}
    </View>
  )
}
