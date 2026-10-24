import { Platform, Pressable, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Icon } from '@farma/registry/ui/icon'

import AnimatedStepCircle from './components/AnimatedCircle'
import { StepHeaderProps } from './StepHeader.types'

const backHitSlop = Platform.select({
  ios: { top: 20, bottom: 20, left: 0, right: 20 },
  default: { top: 25, bottom: 25, left: 25, right: 25 },
})

const BACK_BUTTON_SLOT_SIZE = 44

export const StepHeader = ({
  steps,
  activeStep,
  onBack,
  backIcon,
  backAccessibilityLabel = 'Volver',
  backAccessibilityHint = 'Toque dos veces para regresar a la pantalla anterior',
  className,
  testID,
  ...props
}: StepHeaderProps) => {
  const renderSteps = () => (
    <View className="flex-row items-center justify-center gap-14">
      {steps.map((title, index) => (
        <AnimatedStepCircle
          key={`${index}-${title}`}
          isActive={index === activeStep}
          isCompleted={index < activeStep}
          stepNumber={index + 1}
          stepTitle={title}
        />
      ))}
    </View>
  )

  return (
    <View
      className={cn(
        'bg-base-white px-padding-xl pb-padding-xl border-b-2 border-b-gray-300',
        className,
      )}
      testID={testID}
      {...props}
    >
      {onBack ? (
        <View className="flex-row items-center">
          <View
            className="shrink-0 items-center justify-center"
            style={{ width: BACK_BUTTON_SLOT_SIZE, height: BACK_BUTTON_SLOT_SIZE }}
          >
            <Pressable
              hitSlop={backHitSlop}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: BACK_BUTTON_SLOT_SIZE,
                minWidth: BACK_BUTTON_SLOT_SIZE,
              }}
              accessibilityHint={backAccessibilityHint}
              accessibilityLabel={backAccessibilityLabel}
              accessibilityRole="button"
              testID={testID ? `${testID}-back` : 'step-header-back'}
              onPress={onBack}
            >
              <View className="h-8 w-8 items-center justify-center">
                <Icon name={backIcon || 'arrow-left'} size={24} />
              </View>
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center">{renderSteps()}</View>

          <View style={{ width: BACK_BUTTON_SLOT_SIZE, height: BACK_BUTTON_SLOT_SIZE }} />
        </View>
      ) : (
        renderSteps()
      )}
    </View>
  )
}

export default StepHeader
