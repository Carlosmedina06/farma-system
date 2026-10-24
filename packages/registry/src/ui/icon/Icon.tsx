import { ComponentProps } from 'react'
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native'
import { type ClassValue } from 'clsx'
import { useResolveClassNames } from 'uniwind'
import { cn } from '@farma/registry/lib/utils'

import FarmaIcon from './FarmaIcon'

/** Nombre de un glifo de la fuente farmaIcons. */
export type IconName = ComponentProps<typeof FarmaIcon>['name']

/** @deprecated usa `IconName`. Alias para migrar desde app-mobile. */
export type FarmaIcons = IconName

export type IconProps = {
  name: IconName
  size?: number
  color?: string
  className?: ClassValue
  style?: TextStyle
}

const NO_FONT_SCALING = {
  allowFontScaling: false,
  maxFontSizeMultiplier: 1,
} as const

const getIconMetricsStyle = (size?: number): (TextStyle & ViewStyle) | undefined => {
  if (size == null) {
    return undefined
  }

  return {
    height: size,
    lineHeight: size,
    textAlign: 'center',
    width: size,
  }
}

const splitClassNameStyles = (resolved?: TextStyle) => {
  if (!resolved) {
    return { color: undefined, layoutStyle: undefined }
  }

  const { color, fontFamily: _fontFamily, ...layoutStyle } = resolved

  return {
    color,
    layoutStyle: Object.keys(layoutStyle).length > 0 ? layoutStyle : undefined,
  }
}

const Icon = ({ name, size, color, className, style, ...props }: IconProps) => {
  const resolvedClassName = StyleSheet.flatten(
    useResolveClassNames(String(cn(className) ?? '')),
  ) as TextStyle | undefined
  const { color: classNameColor, layoutStyle } = splitClassNameStyles(resolvedClassName)
  const resolvedColor = color ?? (typeof classNameColor === 'string' ? classNameColor : '#000000')
  const metricsStyle = getIconMetricsStyle(size)

  return (
    <FarmaIcon
      {...NO_FONT_SCALING}
      color={resolvedColor}
      name={name}
      size={size}
      style={[metricsStyle, layoutStyle, style]}
      {...props}
    />
  )
}

export default Icon
