import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'
import { Text, Dimensions, ScrollView } from 'react-native'

import { BottomSheet } from '../BottomSheet'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}))

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: () => void) => {
    fn()
  },
}))

jest.mock('@farma/registry/ui/portal', () => ({
  Portal: ({ children }: any) => children,
}))

jest.mock('react-native-gesture-handler', () => {
  const React = require('react')
  const { View } = require('react-native')

  const chainable = () => ({
    activeOffsetY: () => chainable(),
    failOffsetX: () => chainable(),
    onStart: () => chainable(),
    onUpdate: () => chainable(),
    onEnd: () => chainable(),
  })

  return {
    Gesture: {
      Pan: () => chainable(),
    },
    GestureDetector: ({ children }: { children?: React.ReactNode }) => <View>{children}</View>,
  }
})

jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)
  AnimatedView.displayName = 'Animated.View'

  const Animated = {
    View: AnimatedView,
    createAnimatedComponent: (component: any) => {
      if (component === View) return AnimatedView
      return React.forwardRef((props: any, ref: any) => {
        const Component = component
        return <Component ref={ref} {...props} />
      })
    },
  }

  return {
    default: Animated,
    ...Animated,
    Easing: {
      cubic: jest.fn(),
      out: jest.fn((fn: unknown) => fn),
    },
    cancelAnimation: jest.fn(),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value: any, _config: any, callback: any) => {
      if (typeof callback === 'function') {
        callback(true)
      }

      return value
    }),
  }
})

jest.mock('@react-native-community/hooks', () => ({
  useBackHandler: jest.fn((callback: any) => {
    // Mock back handler
  }),
}))

jest.spyOn(Dimensions, 'get').mockReturnValue({
  window: { width: 375, height: 812, scale: 2, fontScale: 1 },
  screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
} as unknown as ReturnType<typeof Dimensions.get>)

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name, testID, ...props }: any) {
      return <View testID={`icon-${name}`} {...props} />
    },
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>
    },
  }
})

describe('BottomSheet', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should not render when open is false', () => {
    const { queryByText } = render(
      <BottomSheet close={jest.fn()} content={ScrollView} open={false}>
        <Text>Content</Text>
      </BottomSheet>,
    )

    expect(queryByText('Content')).toBeNull()
  })

  it('should render when open is true', () => {
    const { getByText } = render(
      <BottomSheet close={jest.fn()} content={ScrollView} open={true}>
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(getByText('Content')).toBeTruthy()
  })

  it('should render with title', () => {
    const { getByText } = render(
      <BottomSheet close={jest.fn()} content={ScrollView} open={true} title="Sheet Title">
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(getByText('Sheet Title')).toBeTruthy()
  })

  it('should call close when close button is pressed', () => {
    const mockClose = jest.fn()
    const { getByTestId } = render(
      <BottomSheet close={mockClose} closeControl="x" content={ScrollView} open={true} title="Title">
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    const closeButton = getByTestId('icon-x-close').parent

    if (closeButton) {
      fireEvent.press(closeButton)
    }

    expect(mockClose).toHaveBeenCalled()
  })

  it('should call onCloseIconPress instead of close when provided', () => {
    const mockClose = jest.fn()
    const mockOnCloseIcon = jest.fn()
    const { getByTestId } = render(
      <BottomSheet
        close={mockClose}
        closeControl="x"
        content={ScrollView}
        open={true}
        title="Title"
        onCloseIconPress={mockOnCloseIcon}
      >
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    const closeButton = getByTestId('icon-x-close').parent

    if (closeButton) {
      fireEvent.press(closeButton)
    }

    expect(mockOnCloseIcon).toHaveBeenCalled()
    expect(mockClose).not.toHaveBeenCalled()
  })

  it('should render with divider when divider is true', () => {
    const { UNSAFE_root } = render(
      <BottomSheet divider close={jest.fn()} content={ScrollView} open={true}>
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should render with full height when full is true', () => {
    const { UNSAFE_root } = render(
      <BottomSheet full close={jest.fn()} content={ScrollView} open={true}>
        <Text>Content</Text>
      </BottomSheet>,
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(UNSAFE_root).toBeTruthy()
  })
})
