import { useEffect, useState } from 'react'
import { AppState, Platform } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  FadeInDown,
  FadeInUp,
  ReduceMotion,
  useReducedMotion,
} from 'react-native-reanimated'
import { cn } from '@farma/registry/lib/utils'

import {
  markSkipAnimatedLayoutEntering,
  shouldSkipAnimatedLayoutEntering,
} from './animatedLayoutSkipEntering'
import { AnimatedLayoutProps } from './AnimatedLayout.types'

const SKIP_ENTERING_DURATION_MS = 800

const AnimatedLayout = ({
  children,
  style,
  effect = 'linear',
  animateLayout = false,
  className,
  testID,
}: AnimatedLayoutProps) => {
  const isAndroid = Platform.OS === 'android'
  const reduceMotion = useReducedMotion()
  const [skipEntering, setSkipEntering] = useState(shouldSkipAnimatedLayoutEntering)
  const shouldDisableMotion = reduceMotion || skipEntering

  useEffect(() => {
    let appState = AppState.currentState
    let skipEnteringTimeoutId: ReturnType<typeof setTimeout> | undefined

    const subscription = AppState.addEventListener('change', (nextState) => {
      if ((appState === 'background' || appState === 'inactive') && nextState === 'active') {
        markSkipAnimatedLayoutEntering(SKIP_ENTERING_DURATION_MS)
        setSkipEntering(true)

        if (skipEnteringTimeoutId) clearTimeout(skipEnteringTimeoutId)
        skipEnteringTimeoutId = setTimeout(() => {
          setSkipEntering(false)
        }, SKIP_ENTERING_DURATION_MS)
      }

      appState = nextState
    })

    return () => {
      subscription.remove()
      if (skipEnteringTimeoutId) clearTimeout(skipEnteringTimeoutId)
    }
  }, [])

  const getTransition = () => {
    switch (effect) {
      case 'linear':
        return LinearTransition.springify().reduceMotion(ReduceMotion.System)
      case 'fade':
        return FadeInDown.reduceMotion(ReduceMotion.System)
      case 'fadeUp':
        return FadeInUp.reduceMotion(ReduceMotion.System)
      case 'fadeDown':
        return FadeInDown.reduceMotion(ReduceMotion.System)
      default:
        return LinearTransition.springify().reduceMotion(ReduceMotion.System)
    }
  }

  const entering = shouldDisableMotion ? undefined : FadeIn.reduceMotion(ReduceMotion.System)
  const exiting =
    shouldDisableMotion || isAndroid ? undefined : FadeOut.reduceMotion(ReduceMotion.System)
  const layout = shouldDisableMotion || !animateLayout ? undefined : getTransition()

  return (
    <Animated.View
      className={cn(className)}
      entering={entering}
      exiting={exiting}
      layout={layout}
      style={style}
      testID={testID}
    >
      {children}
    </Animated.View>
  )
}

export default AnimatedLayout
