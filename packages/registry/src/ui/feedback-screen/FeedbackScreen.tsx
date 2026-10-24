import { useCallback, useRef } from 'react'

import FeedbackScreenView from './FeedbackScreenView'
import type { ShowFeedbackParams } from './types/FeedbackScreen.types'

export type FeedbackScreenProps = ShowFeedbackParams & {
  visible: boolean
  /** Se llama después de cualquier acción (primaria, secundaria o automática). */
  onClose?: () => void
}

/**
 * Pantalla de resultado (éxito, error, aviso, info) a pantalla completa. Controlada por `visible`:
 * no necesita Host ni estado global. Al ocultarse se desmonta, así que cada vez arranca de cero.
 */
export function FeedbackScreen({ visible, onClose, ...params }: FeedbackScreenProps) {
  const paramsRef = useRef(params)
  paramsRef.current = params
  const finish = useCallback(
    (action?: () => void) => {
      action?.()
      paramsRef.current.onDismiss?.()
      onClose?.()
    },
    [onClose],
  )

  if (!visible) return null

  return (
    <FeedbackScreenView
      animationSource={params.animationSource}
      autoAction={params.autoAction}
      feedbackId={0}
      loop={params.loop}
      primaryAction={params.primaryAction}
      secondaryAction={params.secondaryAction}
      subtitle={params.subtitle}
      testID={params.testID}
      title={params.title}
      type={params.type}
      onAutoActionPress={() => finish(paramsRef.current.autoAction?.onAction)}
      onPrimaryPress={() => finish(paramsRef.current.primaryAction?.onPress)}
      onSecondaryPress={() => finish(paramsRef.current.secondaryAction?.onPress)}
    />
  )
}
