import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { SteppedProgressBar } from '@farma/registry/ui/progress'
import { FULL_SCREEN_EDGES, ScreenLayout } from '@farma/registry/ui/screen-layout'
import { Text } from '@farma/registry/ui/text'

import type { StagedLoadingViewProps } from './StagedLoadingView.types'

/** Pantalla de carga por etapas: barra de progreso + título/descripción de la etapa activa. */
export default function StagedLoadingView({
  steps,
  activeStepIndex,
  progress,
  className,
  backgroundClassName = 'bg-primary-25',
  testID = 'staged-loading-view',
}: StagedLoadingViewProps) {
  const safeIndex = Math.min(Math.max(activeStepIndex, 0), Math.max(steps.length - 1, 0))
  const currentStep = steps[safeIndex]

  if (!currentStep) {
    return null
  }

  return (
    <ScreenLayout
      backgroundClassName={backgroundClassName}
      className={className ?? 'p-padding-lg justify-center gap-0'}
      edges={FULL_SCREEN_EDGES}
      testID={testID}
    >
      <StatusBar style="dark" />
      <AnimatedLayout>
        <View className="gap-lg items-center justify-center">
          <View className="p-gap-md self-stretch">
            <SteppedProgressBar progress={progress} />
          </View>
          <View className="gap-xs">
            <Text className="text-center" testID={`${testID}-title`} type="h3">
              {currentStep.title}
            </Text>
            <Text className="text-center" testID={`${testID}-description`} type="body1">
              {currentStep.description}
            </Text>
          </View>
        </View>
      </AnimatedLayout>
    </ScreenLayout>
  )
}
