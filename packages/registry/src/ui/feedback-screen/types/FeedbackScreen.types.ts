import type { AnimationObject } from 'lottie-react-native'
import type { ButtonType } from '@farma/registry/ui/button'

export type FeedbackType = 'success' | 'error' | 'warning' | 'info'

export type FeedbackAutoActionStartAfter = 'reveal' | 'animation'

export interface FeedbackAction {
  label: string
  onPress?: () => void
  hidden?: boolean
  type?: ButtonType
  className?: string
  color?: string
}

export interface FeedbackAutoAction {
  delayMs: number
  onAction?: () => void
  startAfter?: FeedbackAutoActionStartAfter
}

export interface ShowFeedbackParams {
  type: FeedbackType
  title: string
  subtitle?: string
  primaryAction?: FeedbackAction
  secondaryAction?: FeedbackAction
  animationSource?: AnimationObject
  loop?: boolean
  autoAction?: FeedbackAutoAction
  onDismiss?: () => void
  testID?: string
}

export interface FeedbackScreenState extends ShowFeedbackParams {
  id: number
}

export interface FeedbackScreenViewProps {
  readonly feedbackId: number
  readonly type: FeedbackType
  readonly title: string
  readonly subtitle?: string
  readonly primaryAction?: FeedbackAction
  readonly secondaryAction?: FeedbackAction
  readonly animationSource?: AnimationObject
  readonly loop?: boolean
  readonly autoAction?: FeedbackAutoAction
  readonly testID?: string
  readonly onAutoActionPress: () => void
  readonly onPrimaryPress: () => void
  readonly onSecondaryPress: () => void
}
