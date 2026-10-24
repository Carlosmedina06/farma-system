import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { act, renderHook } from '@testing-library/react-native'
import { BackHandler } from 'react-native'

import { FEEDBACK_REVEAL_COMPLETE_MS } from '../constants/FeedbackScreen.constants'
import useFeedbackScreen from '../hooks/useFeedbackScreen'

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  useSharedValue: (value: unknown) => ({ value }),
  useAnimatedStyle: () => ({}),
  withTiming: (toValue: unknown, _config: unknown, callback?: (finished: boolean) => void) => {
    callback?.(true)

    return toValue
  },
  withDelay: (_delay: number, animation: unknown) => animation,
  withSpring: (toValue: unknown) => toValue,
  ReduceMotion: { System: 'system' },
}))

const REVEAL_COMPLETE_MS = FEEDBACK_REVEAL_COMPLETE_MS

const baseParams = {
  feedbackId: 1,
  type: 'success' as const,
  onAutoActionPress: jest.fn(),
  onPrimaryPress: jest.fn(),
  onSecondaryPress: jest.fn(),
}

const flushMicrotasks = async () => {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('useFeedbackScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers({ doNotFake: ['queueMicrotask'] })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('runs the primary action through the exit animation', async () => {
    const onPrimaryPress = jest.fn()
    const { result } = renderHook(() => useFeedbackScreen({ ...baseParams, onPrimaryPress }))

    await act(async () => {
      result.current.handlePrimaryPress()
      await Promise.resolve()
    })

    expect(onPrimaryPress).toHaveBeenCalledTimes(1)
  })

  it('ignores repeated presses while exiting (re-entrancy guard)', async () => {
    const onPrimaryPress = jest.fn()
    const { result } = renderHook(() => useFeedbackScreen({ ...baseParams, onPrimaryPress }))

    await act(async () => {
      result.current.handlePrimaryPress()
      result.current.handlePrimaryPress()
      await Promise.resolve()
    })

    expect(onPrimaryPress).toHaveBeenCalledTimes(1)
  })

  it('triggers the secondary action on Android back press when present', async () => {
    const onSecondaryPress = jest.fn()
    let backPressHandler: () => boolean = () => false

    jest.spyOn(BackHandler, 'addEventListener').mockImplementation(((_event: string, cb: any) => {
      backPressHandler = cb

      return { remove: jest.fn() }
    }) as never)

    renderHook(() =>
      useFeedbackScreen({
        ...baseParams,
        onSecondaryPress,
        primaryAction: { label: 'Reintentar' },
        secondaryAction: { label: 'Cancelar' },
      }),
    )

    let handled = false
    await act(async () => {
      handled = backPressHandler()
      await Promise.resolve()
    })

    expect(handled).toBe(true)
    expect(onSecondaryPress).toHaveBeenCalledTimes(1)
  })

  it('falls back to the primary action on back press when there is no secondary', async () => {
    const onPrimaryPress = jest.fn()
    let backPressHandler: () => boolean = () => false

    jest.spyOn(BackHandler, 'addEventListener').mockImplementation(((_event: string, cb: any) => {
      backPressHandler = cb

      return { remove: jest.fn() }
    }) as never)

    renderHook(() =>
      useFeedbackScreen({ ...baseParams, onPrimaryPress, primaryAction: { label: 'Continuar' } }),
    )

    await act(async () => {
      backPressHandler()
      await Promise.resolve()
    })

    expect(onPrimaryPress).toHaveBeenCalledTimes(1)
  })

  it('fires the auto action after the reveal and configured delay', async () => {
    const onAutoActionPress = jest.fn()
    renderHook(() =>
      useFeedbackScreen({
        ...baseParams,
        onAutoActionPress,
        autoAction: { delayMs: 2000, startAfter: 'reveal' },
      }),
    )

    await act(async () => {
      jest.advanceTimersByTime(REVEAL_COMPLETE_MS + 2000)
      await Promise.resolve()
    })
    await flushMicrotasks()

    expect(onAutoActionPress).toHaveBeenCalledTimes(1)
  })
})
