import { View } from 'react-native'
import { tv } from 'tailwind-variants'
import { cn } from '@farma/registry/lib/utils'

import { StepperProps } from './Stepper.types'

const stepVariants = tv({
  base: 'h-2 flex-1 rounded-sm',
  variants: {
    colored: {
      true: 'bg-gray-200',
      false: 'bg-primary-600',
    },
  },
})

export const Stepper = ({ steps, currentStep, className, testID, ...props }: StepperProps) => {
  return (
    <View {...props} className={cn('flex-row gap-1 self-stretch', className)} testID={testID}>
      {Array.from({ length: Math.max(0, steps) }, (_, index) => (
        <View key={index} className={stepVariants({ colored: index < currentStep })} />
      ))}
    </View>
  )
}
