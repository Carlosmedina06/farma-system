import type { ComponentType } from 'react'
import { View } from 'react-native'
import type { SvgProps } from 'react-native-svg'
import { useResolveClassNames } from 'uniwind'

import { cn } from '@farma/registry/lib/utils'

export type SvgIconProps = {
  /** Componente SVG (react-native-svg o importado con react-native-svg-transformer). */
  icon: ComponentType<SvgProps>
  size?: number
  color?: string
  className?: string
  testID?: string
}

/**
 * Renderiza un ícono SVG con la misma API que `Icon` (size, color, className).
 * Para íconos propios de la app (marcas, ilustraciones) que no están en la fuente.
 */
export function SvgIcon({ icon: Svg, size, color, className, testID }: SvgIconProps) {
  const resolved = useResolveClassNames(cn(className))
  const resolvedColor = color ?? (typeof resolved.color === 'string' ? resolved.color : '#000000')

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={size != null ? { width: size, height: size } : undefined}
      testID={testID}
    >
      <Svg color={resolvedColor} height={size} width={size} />
    </View>
  )
}
