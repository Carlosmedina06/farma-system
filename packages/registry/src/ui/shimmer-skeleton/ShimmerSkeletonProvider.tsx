import { useEffect, useMemo, type ReactNode } from 'react'
import {
  Easing,
  cancelAnimation,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'

import { ShimmerSkeletonContext, useShimmerSkeletonContext } from './shimmerSkeletonContext'

const SHIMMER_DURATION_MS = 1400

/** Anima `progress` de 0 a 1 en loop, salvo que el usuario pida reducir movimiento. */
function useShimmerLoop(progress: SharedValue<number>, enabled: boolean) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!enabled || reduceMotion) {
      progress.value = 0
      return
    }

    progress.value = withRepeat(
      withTiming(1, { duration: SHIMMER_DURATION_MS, easing: Easing.linear }),
      -1,
      false,
    )
    return () => cancelAnimation(progress)
  }, [enabled, progress, reduceMotion])
}

/**
 * Opcional: sincroniza todos los skeletons de la pantalla en una sola animación.
 * Sin provider, cada ShimmerSkeleton se anima por su cuenta.
 */
export default function ShimmerSkeletonProvider({ children }: { children: ReactNode }) {
  const progress = useSharedValue(0)
  useShimmerLoop(progress, true)

  const contextValue = useMemo(() => ({ progress }), [progress])

  return (
    <ShimmerSkeletonContext.Provider value={contextValue}>
      {children}
    </ShimmerSkeletonContext.Provider>
  )
}

/** Progreso compartido del provider o, si no hay, uno propio del skeleton. */
export function useShimmerProgress() {
  const ctx = useShimmerSkeletonContext()
  const local = useSharedValue(0)
  useShimmerLoop(local, !ctx)

  return ctx?.progress ?? local
}
