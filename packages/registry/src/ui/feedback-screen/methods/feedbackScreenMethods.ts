import type { FeedbackAutoActionStartAfter } from '../types/FeedbackScreen.types'

export const resolveAutoActionStartAfter = (
  startAfter: FeedbackAutoActionStartAfter | undefined,
  loopEnabled: boolean,
): FeedbackAutoActionStartAfter => {
  if (startAfter === 'animation' && loopEnabled) {
    return 'reveal'
  }

  return startAfter ?? 'reveal'
}

export const clearRevealTimers = (timersRef: { current: ReturnType<typeof setTimeout>[] }) => {
  timersRef.current.forEach(clearTimeout)
  timersRef.current = []
}

export const clearAutoActionTimer = (timerRef: {
  current: ReturnType<typeof setTimeout> | null
}) => {
  if (timerRef.current) {
    clearTimeout(timerRef.current)
    timerRef.current = null
  }
}
