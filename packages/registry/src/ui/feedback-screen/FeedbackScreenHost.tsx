import { createStore, useStore } from '@farma/registry/lib/store'

import { FeedbackScreen } from './FeedbackScreen'
import type { FeedbackScreenState, ShowFeedbackParams } from './types/FeedbackScreen.types'

const feedbackStore = createStore<FeedbackScreenState | undefined>(undefined)
let nextId = 0

/**
 * Capa imperativa OPCIONAL sobre `<FeedbackScreen>`. Montá `<FeedbackScreenHost />` una vez en el root
 * y llamá `feedbackScreen.show()` o `useFeedback().showFeedback()`.
 */
export function FeedbackScreenHost() {
  const feedback = useStore(feedbackStore)

  if (!feedback) return null

  // `key` por id: mostrar otro feedback reinicia la animación aunque el anterior siga visible.
  return <FeedbackScreen key={feedback.id} {...feedback} visible onClose={feedbackScreen.hide} />
}

export const feedbackScreen = {
  show(params: ShowFeedbackParams) {
    nextId += 1
    feedbackStore.set({ ...params, id: nextId })
  },
  hide() {
    feedbackStore.set(undefined)
  },
}

/** Misma forma que el `useFeedback` de app-mobile. */
export function useFeedback() {
  return { showFeedback: feedbackScreen.show, hideFeedback: feedbackScreen.hide }
}
