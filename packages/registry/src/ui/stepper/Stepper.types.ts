import { ViewProps } from 'react-native'

export interface StepperProps extends ViewProps {
  steps: number
  currentStep: number
  className?: string
  testID?: string
}
