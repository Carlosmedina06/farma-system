import { ComponentProps } from 'react'
import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native'
import { type ClassValue } from 'clsx'
import { useResolveClassNames } from 'uniwind'
import { cn } from '@farma/registry/lib/utils'

import FarmaIcon from './FarmaIcon'
import glyphMap from './glyph-map.json'
import { miscIcons, type MiscIconName } from './misc-icons'

/** Nombre de un glifo de la fuente farmaIcons. */
export type GlyphName = ComponentProps<typeof FarmaIcon>['name']

/** Glifo de la fuente o ícono SVG `misc-*` (mismas claves que app-mobile). */
export type IconName = GlyphName | MiscIconName

/** @deprecated usa `IconName`. Alias para migrar desde app-mobile. */
export type FarmaIcons = IconName

const isMiscIconName = (name: string): name is MiscIconName => name in miscIcons

/** ¿El string es un ícono conocido? Úsalo para nombres que llegan de afuera (backend, deep links). */
export const isIconName = (name: unknown): name is IconName =>
  typeof name === 'string' && (name in glyphMap || isMiscIconName(name))

export type IconProps = {
  /** Acepta cualquier string: si no es un ícono conocido se usa `fallback` (o no se dibuja nada). */
  name: IconName | (string & {})
  /** Ícono a mostrar cuando `name` no es un ícono conocido. */
  fallback?: IconName
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

const Icon = ({ name, fallback, size, color, className, style, ...props }: IconProps) => {
  const resolvedClassName = StyleSheet.flatten(
    useResolveClassNames(String(cn(className) ?? '')),
  ) as TextStyle | undefined
  const { color: classNameColor, layoutStyle } = splitClassNameStyles(resolvedClassName)
  const resolvedColor = color ?? (typeof classNameColor === 'string' ? classNameColor : '#000000')
  const metricsStyle = getIconMetricsStyle(size)
  const icon = isIconName(name) ? name : fallback

  if (!icon) return null

  if (isMiscIconName(icon)) {
    const MiscSvg = miscIcons[icon]

    return (
      <View
        className={cn('items-center justify-center', className)}
        style={[metricsStyle, layoutStyle, style]}
      >
        <MiscSvg
          color={resolvedColor}
          height={size}
          width={size}
          {...props}
        />
      </View>
    )
  }

  return (
    <FarmaIcon
      {...NO_FONT_SCALING}
      color={resolvedColor}
      name={icon}
      size={size}
      style={[metricsStyle, layoutStyle, style]}
      {...props}
    />
  )
}

export default Icon
