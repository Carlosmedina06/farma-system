import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ViewProps,
  type TextInputInstance,
} from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Text } from '@farma/registry/ui/text'

import { CodeInputProps } from './CodeInput.types'

const GLOW_DISTANCE = 2
const CELL_RADIUS = 12

const styles = StyleSheet.create({
  cellsRow: {
    position: 'relative',
  },
  overlayInput: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    color: 'transparent',
    backgroundColor: 'transparent',
    fontSize: 1,
    opacity: 0.02,
  },
  glow: {
    position: 'absolute',
    top: -GLOW_DISTANCE,
    right: -GLOW_DISTANCE,
    bottom: -GLOW_DISTANCE,
    left: -GLOW_DISTANCE,
    borderRadius: CELL_RADIUS + GLOW_DISTANCE,
  },
})

const sanitizeCode = (text: string, maxLength: number) => text.replace(/\D+/g, '').slice(0, maxLength)

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const getGlowColor = (isFocused: boolean, invalid: boolean) => {
  if (isFocused) return '#d4d8fd'
  if (invalid) return '#fee4e2'

  return undefined
}

const getCellClasses = (focused: boolean, invalid: boolean) => {
  const base =
    'min-h-[44px] min-w-[44px] justify-center py-padding-md px-padding-lg items-center border bg-base-white rounded-md self-stretch'

  if (invalid) return `${base} border-error-100`
  if (focused) return `${base} border-primary-300`

  return `${base} border-gray-300`
}

const CodeInput = ({
  value,
  onChange,
  length,
  errorText,
  hasError = false,
  onFocus,
  onMounted,
  onError,
  onAutofill,
  onComplete,
  className,
  testID,
  inputRef: externalInputRef,
  ...props
}: CodeInputProps & ViewProps) => {
  const internalInputRef = useRef<TextInputInstance>(null)
  const pendingValueRef = useRef<string | null>(null)
  const previousValueRef = useRef(value ?? '')
  const mountTimeRef = useRef(Date.now())
  const hasNotifiedMountedRef = useRef(false)
  const hasNotifiedCompletionRef = useRef(false)
  const [isFocused, setIsFocused] = useState(false)
  const [draft, setDraft] = useState(value ?? '')

  const invalid = hasError || (errorText?.length ?? 0) > 0
  const activeCell = isFocused ? clamp(draft.length, 0, length - 1) : undefined

  const assignInputRef = useCallback(
    (node: TextInputInstance | null) => {
      internalInputRef.current = node

      if (externalInputRef) {
        externalInputRef.current = node
      }
    },
    [externalInputRef],
  )

  useEffect(() => {
    const nextValue = value ?? ''
    const previousValue = previousValueRef.current

    previousValueRef.current = nextValue

    if (pendingValueRef.current !== null) {
      if (nextValue === pendingValueRef.current) {
        pendingValueRef.current = null
      }

      return
    }

    setDraft((current) => (current === nextValue ? current : nextValue))

    if (nextValue === '' && previousValue.length > 0) {
      hasNotifiedCompletionRef.current = false
      mountTimeRef.current = Date.now()

      const timer = setTimeout(() => {
        internalInputRef.current?.focus()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [value])

  useEffect(() => {
    if (Platform.OS !== 'android') return

    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      internalInputRef.current?.blur()
    })

    return () => subscription.remove()
  }, [])

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()

    if (hasNotifiedMountedRef.current) return

    hasNotifiedMountedRef.current = true
    onMounted?.({ maxLength: length })
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleChangeText = (text: string) => {
    const previousDraft = draft
    const sanitized = sanitizeCode(text, length)
    const insertedChars = sanitized.length - previousDraft.length

    if (text !== sanitized) {
      onError?.({ attemptedValue: sanitized, rawValue: text })
    }

    pendingValueRef.current = sanitized
    setDraft(sanitized)
    onChange(sanitized)

    if (!hasNotifiedCompletionRef.current && sanitized.length >= length) {
      hasNotifiedCompletionRef.current = true
      const elapsedMs = Date.now() - mountTimeRef.current
      const autofill = insertedChars > 1

      if (autofill) {
        onAutofill?.({ elapsedMs })
      }
      onComplete?.({ code: sanitized, autofill, elapsedMs })
    }

    if (sanitized.length >= length) {
      internalInputRef.current?.blur()
    }
  }

  return (
    <View
      {...props}
      className={cn('pb-gap-md pt-gap-md items-stretch self-stretch', className)}
      testID={testID}
    >
      <View style={styles.cellsRow}>
        <View pointerEvents="none" className="flex-row items-center justify-between">
          {Array.from({ length }, (_, index) => {
            const cellFocused = index === activeCell
            const glowColor = getGlowColor(cellFocused, invalid)

            return (
              <View key={index}>
                {!!glowColor && (
                  <View style={[styles.glow, { backgroundColor: glowColor }]} testID="code-input-glow" />
                )}
                <View className={getCellClasses(cellFocused, invalid)}>
                  <Text className="text-gray-800" type="body1">
                    {draft[index] || (cellFocused ? '|' : '')}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        <TextInput
          ref={assignInputRef}
          autoCapitalize="none"
          autoComplete="one-time-code"
          autoCorrect={false}
          autoFocus={Platform.OS === 'android'}
          caretHidden
          importantForAutofill="yes"
          keyboardType="number-pad"
          maxLength={length}
          spellCheck={false}
          style={styles.overlayInput}
          testID={testID ? `${testID}-input` : 'code-input'}
          textContentType="oneTimeCode"
          underlineColorAndroid="transparent"
          value={draft}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          {...(Platform.OS === 'android' ? { inputMode: 'numeric' as const } : {})}
        />
      </View>

      {errorText ? (
        <Text className="mt-gap-xxs text-error-600" type="body2">
          {errorText}
        </Text>
      ) : null}
    </View>
  )
}

export default CodeInput
