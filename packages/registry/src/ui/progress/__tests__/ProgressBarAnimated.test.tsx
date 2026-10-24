import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { AnimatedProgressBar } from '../ProgressBarAnimated'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  return {
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useReducedMotion: jest.fn(() => false),
    useAnimatedStyle: jest.fn(() => ({ width: '0%' })),
    withRepeat: jest.fn((animation: any) => animation),
    withTiming: jest.fn((value: any) => ({ value })),
    Easing: {
      linear: 'linear',
    },
  }
})

describe('AnimatedProgressBar', () => {
  const { withTiming } = require('react-native-reanimated')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const { UNSAFE_root } = render(<AnimatedProgressBar />)

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should animate using the default duration when none is provided', () => {
    render(<AnimatedProgressBar />)

    expect(withTiming).toHaveBeenCalledWith(100, {
      duration: 2000,
      easing: 'linear',
    })
  })

  it('should animate using a custom duration when provided', () => {
    render(<AnimatedProgressBar durationMs={1000} />)

    expect(withTiming).toHaveBeenCalledWith(100, {
      duration: 1000,
      easing: 'linear',
    })
  })
})
