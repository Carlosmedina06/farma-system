import type { ReactNode, Ref } from 'react'
import { View, type StyleProp, type TextInputInstance, type ViewStyle } from 'react-native'

import { cn } from '@farma/registry/lib/utils'

import { Variants } from './Input.types'

export const GLOW_FOCUS_COLOR = '#d4d8fd'
export const GLOW_ERROR_COLOR = '#fbd2d5'
const GLOW_DISTANCE = 2

/** Color del halo (focus/error) alrededor del campo, o `undefined` si no hay halo. */
export const getGlowColor = (focus: boolean, error: boolean) => {
  if (focus && !error) return GLOW_FOCUS_COLOR
  if (error) return GLOW_ERROR_COLOR

  return undefined
}

interface InputGlowProps {
  color?: string
  borderRadius: number
  style?: StyleProp<ViewStyle>
  children: ReactNode
}

/**
 * Halo sólido de 2px dibujado por fuera del campo (no afecta el layout).
 * Reemplaza el `Shadow` de react-native-shadow-2.
 */
export const InputGlow = ({ color, borderRadius, style, children }: InputGlowProps) => (
  <View style={style}>
    {!!color && (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -GLOW_DISTANCE,
          right: -GLOW_DISTANCE,
          bottom: -GLOW_DISTANCE,
          left: -GLOW_DISTANCE,
          borderRadius: borderRadius + GLOW_DISTANCE,
          backgroundColor: color,
        }}
        testID="input-glow"
      />
    )}
    {children}
  </View>
)

export const getInputClasses = (
  variant: Variants,
  rounded: boolean,
  iconLeft: boolean,
  disabled: boolean,
) => {
  const base = 'self-stretch min-h-14 border px-2.5 bg-base-white'
  const borderRadius = rounded ? 'rounded-xl' : 'rounded-md'

  let variantClasses = ''

  switch (variant) {
    case Variants.Default:
      variantClasses = 'border-gray-300 bg-base-white'
      break
    case Variants.Error:
      variantClasses = 'border-error-300 bg-base-white'
      break
    case Variants.Filled:
      variantClasses = 'border-gray-400 bg-gray-25'
      break
    case Variants.FilledError:
      variantClasses = 'border-error-400 bg-error-25'
      break
    case Variants.Focus:
      variantClasses = 'border-primary-300'
      break
    case Variants.FocusError:
      variantClasses = 'bg-base-white border-error-300'
      break
    case Variants.Disabled:
      variantClasses = 'border-gray-300 bg-gray-50'
      break
  }

  const paddingLeft = iconLeft ? 'pl-10' : ''

  return cn(base, borderRadius, variantClasses, paddingLeft, disabled && 'opacity-50')
}

/** Asigna un nodo a una ref de función u objeto. */
export const assignRef = (ref: Ref<TextInputInstance | null> | undefined, node: TextInputInstance | null) => {
  if (typeof ref === 'function') {
    ref(node)
  } else if (ref) {
    ;(ref as { current: TextInputInstance | null }).current = node
  }
}
