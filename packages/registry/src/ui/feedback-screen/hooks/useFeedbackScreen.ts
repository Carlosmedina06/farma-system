import type { AnimationObject } from 'lottie-react-native'
import type LottieView from 'lottie-react-native'
import type {
  FeedbackAction,
  FeedbackAutoAction,
  FeedbackType,
} from '../types/FeedbackScreen.types'

import { useCallback, useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

import {
  FEEDBACK_BASE_WHITE,
  FEEDBACK_BUTTON_ENTER_DELAY_MS,
  FEEDBACK_CONTENT_FADE_DURATION_MS,
  FEEDBACK_EXIT_DURATION_MS,
  FEEDBACK_ICON_PLAY_DELAY_MS,
  FEEDBACK_REVEAL_COMPLETE_MS,
  FEEDBACK_REVEAL_DURATION_MS,
  FEEDBACK_TYPE_CONFIG,
} from '../constants/FeedbackScreen.constants'
import {
  clearAutoActionTimer,
  clearRevealTimers,
  resolveAutoActionStartAfter,
} from '../methods/feedbackScreenMethods'

const REDUCE_MOTION = ReduceMotion.System

interface UseFeedbackScreenParams {
  feedbackId: number
  type: FeedbackType
  animationSource?: AnimationObject
  loop?: boolean
  primaryAction?: FeedbackAction
  secondaryAction?: FeedbackAction
  autoAction?: FeedbackAutoAction
  onAutoActionPress: () => void
  onPrimaryPress: () => void
  onSecondaryPress: () => void
}

export default function useFeedbackScreen({
  feedbackId,
  type,
  animationSource,
  loop,
  primaryAction,
  secondaryAction,
  autoAction,
  onAutoActionPress,
  onPrimaryPress,
  onSecondaryPress,
}: UseFeedbackScreenParams) {
  const config = FEEDBACK_TYPE_CONFIG[type]
  const lottieSource = animationSource ?? config.source
  const lottieLoop = loop ?? config.loop
  const showPrimaryButton = !!primaryAction && !primaryAction.hidden
  const showSecondaryButton = !!secondaryAction && !secondaryAction.hidden

  const scale = useSharedValue(0)
  const contentOpacity = useSharedValue(0)
  const buttonsOpacity = useSharedValue(0)
  const buttonsTranslateY = useSharedValue(24)
  const baseColor = useSharedValue(FEEDBACK_BASE_WHITE)
  const circleColor = useSharedValue(config.color)

  const lottieRef = useRef<LottieView>(null)
  const isExitingRef = useRef(false)
  const revealTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const autoActionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationAutoCloseRef = useRef<(() => void) | null>(null)

  const handleExit = useCallback(
    (action: () => void) => {
      if (isExitingRef.current) {
        return
      }

      isExitingRef.current = true
      animationAutoCloseRef.current = null
      clearRevealTimers(revealTimersRef)
      clearAutoActionTimer(autoActionTimerRef)
      buttonsOpacity.value = withTiming(0, { duration: 150, reduceMotion: REDUCE_MOTION })
      contentOpacity.value = withTiming(0, {
        duration: FEEDBACK_EXIT_DURATION_MS,
        reduceMotion: REDUCE_MOTION,
      })
      baseColor.value = FEEDBACK_BASE_WHITE
      circleColor.value = config.color
      scale.value = 1
      scale.value = withTiming(
        0,
        { duration: FEEDBACK_EXIT_DURATION_MS, reduceMotion: REDUCE_MOTION },
        (finished) => {
          if (finished) {
            scheduleOnRN(action)
          }
        },
      )
    },
    [baseColor, buttonsOpacity, circleColor, config.color, contentOpacity, scale],
  )

  const handlePrimaryPress = useCallback(
    () => handleExit(onPrimaryPress),
    [handleExit, onPrimaryPress],
  )

  const handleSecondaryPress = useCallback(
    () => handleExit(onSecondaryPress),
    [handleExit, onSecondaryPress],
  )

  const handleLottieAnimationFinish = useCallback(() => {
    animationAutoCloseRef.current?.()
    animationAutoCloseRef.current = null
  }, [])

  useEffect(() => {
    const onBackPress = () => {
      if (showSecondaryButton) {
        handleSecondaryPress()
      } else if (showPrimaryButton) {
        handlePrimaryPress()
      }

      return true
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

    return () => subscription.remove()
  }, [handlePrimaryPress, handleSecondaryPress, showPrimaryButton, showSecondaryButton])

  useEffect(() => {
    isExitingRef.current = false
    baseColor.value = FEEDBACK_BASE_WHITE
    circleColor.value = config.color
    scale.value = 0
    contentOpacity.value = 0
    buttonsOpacity.value = 0

    scale.value = withTiming(1, {
      duration: FEEDBACK_REVEAL_DURATION_MS,
      reduceMotion: REDUCE_MOTION,
    })
    contentOpacity.value = withDelay(
      FEEDBACK_REVEAL_DURATION_MS,
      withTiming(1, { duration: FEEDBACK_CONTENT_FADE_DURATION_MS, reduceMotion: REDUCE_MOTION }),
      REDUCE_MOTION,
    )

    const lottieTimerId = setTimeout(() => {
      lottieRef.current?.reset()
      lottieRef.current?.play()
    }, FEEDBACK_REVEAL_DURATION_MS + FEEDBACK_ICON_PLAY_DELAY_MS)

    const buttonsTimerId = setTimeout(() => {
      if (!showPrimaryButton && !showSecondaryButton) {
        buttonsOpacity.value = withTiming(0, { duration: 150, reduceMotion: REDUCE_MOTION })

        return
      }

      buttonsTranslateY.value = 24
      buttonsOpacity.value = withDelay(
        FEEDBACK_BUTTON_ENTER_DELAY_MS,
        withTiming(1, { duration: 300, reduceMotion: REDUCE_MOTION }),
        REDUCE_MOTION,
      )
      buttonsTranslateY.value = withDelay(
        FEEDBACK_BUTTON_ENTER_DELAY_MS,
        withSpring(0, { damping: 14, reduceMotion: REDUCE_MOTION }),
        REDUCE_MOTION,
      )
    }, FEEDBACK_REVEAL_COMPLETE_MS)

    revealTimersRef.current.push(lottieTimerId, buttonsTimerId)

    return () => {
      clearRevealTimers(revealTimersRef)
    }
  }, [
    baseColor,
    buttonsOpacity,
    buttonsTranslateY,
    circleColor,
    config.color,
    contentOpacity,
    feedbackId,
    lottieSource,
    scale,
    showPrimaryButton,
    showSecondaryButton,
    type,
  ])

  useEffect(() => {
    animationAutoCloseRef.current = null
    clearAutoActionTimer(autoActionTimerRef)

    if (!autoAction) {
      return () => {
        clearAutoActionTimer(autoActionTimerRef)
      }
    }

    const runAutoActionCountdown = () => {
      if (!autoAction || isExitingRef.current || autoActionTimerRef.current) {
        return
      }

      autoActionTimerRef.current = setTimeout(() => {
        autoActionTimerRef.current = null

        if (!isExitingRef.current) {
          handleExit(onAutoActionPress)
        }
      }, autoAction.delayMs)
    }

    const startAfter = resolveAutoActionStartAfter(autoAction.startAfter, lottieLoop)

    if (startAfter === 'animation') {
      animationAutoCloseRef.current = runAutoActionCountdown

      return () => {
        animationAutoCloseRef.current = null
        clearAutoActionTimer(autoActionTimerRef)
      }
    }

    autoActionTimerRef.current = setTimeout(() => {
      autoActionTimerRef.current = null
      runAutoActionCountdown()
    }, FEEDBACK_REVEAL_COMPLETE_MS)

    return () => {
      clearAutoActionTimer(autoActionTimerRef)
    }
  }, [autoAction, feedbackId, handleExit, lottieLoop, onAutoActionPress])

  const rootStyle = useAnimatedStyle(() => ({
    backgroundColor: baseColor.value,
  }))

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: circleColor.value,
    transform: [{ scale: scale.value }],
  }))

  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }))

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }))

  return {
    lottieRef,
    lottieSource,
    lottieLoop,
    showPrimaryButton,
    showSecondaryButton,
    rootStyle,
    circleStyle,
    contentStyle,
    buttonsStyle,
    handlePrimaryPress,
    handleSecondaryPress,
    handleLottieAnimationFinish,
  }
}
