import type { AnimationObject } from 'lottie-react-native'
import approved from '@farma/assets/lottie/approved.json'
import inProgress from '@farma/assets/lottie/in-progress.json'
import rejected from '@farma/assets/lottie/rejected.json'

import type { FeedbackType } from '../types/FeedbackScreen.types'

export interface FeedbackTypeConfig {
  color: string
  loop: boolean
  source: AnimationObject
}

const COLOR_SUCCESS_600 = '#027a48'
const COLOR_ERROR_500 = '#d8313c'
const COLOR_WARNING_600 = '#dc6803'
const COLOR_PRIMARY_600 = '#4955ec'
const COLOR_BASE_WHITE = '#ffffff'

export const FEEDBACK_TYPE_CONFIG: Record<FeedbackType, FeedbackTypeConfig> = {
  success: {
    color: COLOR_SUCCESS_600,
    loop: false,
    source: approved as AnimationObject,
  },
  error: {
    color: COLOR_ERROR_500,
    loop: false,
    source: rejected as AnimationObject,
  },
  warning: {
    color: COLOR_WARNING_600,
    loop: false,
    source: rejected as AnimationObject,
  },
  info: {
    color: COLOR_PRIMARY_600,
    loop: false,
    source: inProgress as AnimationObject,
  },
}

export const FEEDBACK_REVEAL_DURATION_MS = 600
export const FEEDBACK_CONTENT_FADE_DURATION_MS = 300
export const FEEDBACK_ICON_PLAY_DELAY_MS = 120
export const FEEDBACK_BUTTON_ENTER_DELAY_MS = 120
export const FEEDBACK_EXIT_DURATION_MS = 500
export const FEEDBACK_BASE_WHITE = COLOR_BASE_WHITE
export const FEEDBACK_REVEAL_COMPLETE_MS =
  FEEDBACK_REVEAL_DURATION_MS + FEEDBACK_CONTENT_FADE_DURATION_MS
