import { Pressable, View } from 'react-native'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { UniwindLinearGradient } from '@farma/registry/ui/linear-gradient'
import { cn } from '@farma/registry/lib/utils'

import type { GradientCardProps } from './GradientCard.types'

export const DEFAULT_GRADIENT_COLORS = ['#FFFFFF', '#98DAF1', '#98DAF1'] as const

/** Tarjeta con fondo degradado horizontal; presionable si recibe `onPress`. */
export default function GradientCard({
  children,
  width,
  minHeight,
  gradientColors,
  onPress,
  className,
  testID,
  ...stylePropsView
}: Readonly<GradientCardProps>) {
  const WrapperComponent = onPress ? Pressable : View

  return (
    <AnimatedLayout>
      <WrapperComponent
        className={cn('justify-center self-stretch bg-white', className)}
        testID={testID}
        onPress={onPress}
      >
        <View
          {...stylePropsView}
          style={[{ minHeight, maxWidth: '100%', width: width ?? '100%' }, stylePropsView.style]}
        >
          <UniwindLinearGradient
            colors={gradientColors ?? DEFAULT_GRADIENT_COLORS}
            end={{ x: 1, y: 0.5 }}
            start={{ x: 0, y: 0.5 }}
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden', width: '100%', justifyContent: 'center' }}
          >
            {children}
          </UniwindLinearGradient>
        </View>
      </WrapperComponent>
    </AnimatedLayout>
  )
}
