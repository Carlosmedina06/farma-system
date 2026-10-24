import { useState } from 'react'
import { Platform, Pressable, TextInput, View, ViewProps } from 'react-native'

import { TOUCH_HIT_SLOP } from '@farma/registry/lib/tokens'
import { cn } from '@farma/registry/lib/utils'
import { Icon } from '@farma/registry/ui/icon'

import { getInputVariants, SearchProps, Variants } from './Search.types'

const GLOW_COLOR = '#d4d8fd'
const GLOW_DISTANCE = 2
const BORDER_RADIUS = 32

const getInputClasses = (variant: Variants) => {
  const base = 'self-stretch border bg-base-white rounded-xl text-base'

  switch (variant) {
    case Variants.Default:
      return `${base} border-gray-300 bg-base-white`
    case Variants.Focus:
      return `${base} border-primary-300`
    case Variants.Placeholder:
      return `${base} bg-gray-25 border-gray-400`
    case Variants.Disabled:
      return `${base} border-gray-300 bg-gray-50`
    default:
      return base
  }
}

const getIconColor = (disabled: boolean, focus: boolean, filled: boolean): string => {
  if (disabled) {
    return 'text-gray-400'
  }
  if (focus || filled) {
    return 'text-gray-800'
  }

  return 'text-gray-600'
}

const getPaddingBottom = (hasValue: boolean, focus: boolean, isAndroid: boolean): number => {
  if (!hasValue && focus && !isAndroid) return 1

  if (hasValue && focus && !isAndroid) return 7

  if (hasValue && focus && isAndroid) return 8

  if (!hasValue && focus && isAndroid) return 8

  return isAndroid ? 10 : 4
}

const PADDING_INTERNAL = 12
const GAP_ICON_TEXT = 8
const ICON_SIZE = 24

const INPUT_PADDING_LEFT = PADDING_INTERNAL + ICON_SIZE + GAP_ICON_TEXT
const INPUT_PADDING_RIGHT = GAP_ICON_TEXT + ICON_SIZE + PADDING_INTERNAL

export const Search = ({
  disabled = false,
  placeholder = 'Buscar',
  inputRef,
  value,
  onClear,
  onSearch,
  autoFocus,
  onBlur,
  onFocus,
  className,
  testID,
  keepPlaceholderOnFocus = false,
  returnKeyType = 'search',
  clearTestID,
  clearAccessibilityLabel = 'Borrar búsqueda',
  clearAccessibilityHint,
  accessibilityLabel,
  accessibilityHint,
  ...inputProps
}: SearchProps & ViewProps) => {
  const [focus, setFocus] = useState(false)
  const isAndroid = Platform.OS === 'android'

  const variant = getInputVariants({ disabled, focus, filled: Boolean(value?.length) })
  const inputClasses = getInputClasses(variant)
  const searchIconColor = getIconColor(disabled, focus, Boolean(value?.length))
  const paddingBottom = getPaddingBottom(Boolean(value?.length), focus, isAndroid)

  return (
    <View className={cn('self-stretch', className)} testID={testID}>
      <View className="relative justify-center gap-2 self-stretch">
        <View style={{ alignSelf: 'stretch' }}>
          {focus && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: -GLOW_DISTANCE,
                right: -GLOW_DISTANCE,
                bottom: -GLOW_DISTANCE,
                left: -GLOW_DISTANCE,
                borderRadius: BORDER_RADIUS + GLOW_DISTANCE,
                backgroundColor: GLOW_COLOR,
              }}
              testID={testID ? `${testID}-glow` : 'search-glow'}
            />
          )}
          <TextInput
            ref={inputRef}
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="search"
            autoCorrect={false}
            autoFocus={autoFocus}
            className={inputClasses}
            editable={!disabled}
            placeholder={focus && !keepPlaceholderOnFocus ? '' : placeholder}
            returnKeyType={returnKeyType}
            placeholderTextColorClassName="accent-gray-400"
            style={{
              fontSize: 15,
              color: '#1d2939',
              textAlignVertical: 'center',
              borderRadius: BORDER_RADIUS,
              includeFontPadding: true,
              height: 44,
              paddingBottom,
              paddingLeft: INPUT_PADDING_LEFT,
              paddingRight: INPUT_PADDING_RIGHT,
            }}
            testID={testID ? `${testID}-input` : 'search-input'}
            value={value}
            {...inputProps}
            onBlur={(e) => {
              onBlur?.(e)
              setFocus(false)
            }}
            onFocus={(e) => {
              onFocus?.(e)
              setFocus(true)
            }}
          />
        </View>

        {onSearch ? (
          <Pressable
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute top-0 bottom-0 left-0 justify-center"
            disabled={disabled}
            style={{ paddingLeft: PADDING_INTERNAL }}
            testID={testID ? `${testID}-search` : 'search-button'}
            onPress={onSearch}
          >
            <Icon className={cn(searchIconColor)} name="search-sm" size={ICON_SIZE} />
          </Pressable>
        ) : (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="pointer-events-none absolute top-0 bottom-0 left-0 justify-center"
            style={{ paddingLeft: PADDING_INTERNAL }}
          >
            <Icon className={cn(searchIconColor)} name="search-sm" size={ICON_SIZE} />
          </View>
        )}

        {value && value.length > 0 && (
          <Pressable
            accessibilityHint={clearAccessibilityHint}
            accessibilityLabel={clearAccessibilityLabel}
            accessibilityRole="button"
            className="absolute top-0 right-0 bottom-0 justify-center"
            hitSlop={TOUCH_HIT_SLOP}
            style={{ paddingRight: PADDING_INTERNAL }}
            testID={clearTestID}
            onPress={onClear}
          >
            <Icon className="text-gray-800" name="x-close" size={ICON_SIZE} />
          </Pressable>
        )}
      </View>
    </View>
  )
}
