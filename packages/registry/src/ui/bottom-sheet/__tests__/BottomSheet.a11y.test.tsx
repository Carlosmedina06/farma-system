import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'

import { BottomSheet } from '../BottomSheet'

jest.mock('@farma/registry/ui/portal', () => ({
  Portal: ({ children }: any) => children,
}))

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native')

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component: any) => component,
    },
    View,
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: any) => v,
    cancelAnimation: jest.fn(),
    Easing: { out: () => undefined, cubic: undefined },
  }
})

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: any) => fn(),
}))

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native')

  return {
    Gesture: {
      Pan: () => ({
        activeOffsetY: () => ({ failOffsetX: () => ({ onStart: () => ({ onUpdate: () => ({ onEnd: () => ({}) }) }) }) }),
      }),
    },
    GestureDetector: ({ children }: any) => <View>{children}</View>,
  }
})

jest.mock('@react-native-community/hooks', () => ({
  useBackHandler: jest.fn(),
}))

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function Icon() {
      return <View testID="close-icon" />
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

describe('BottomSheet accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should expose header role and polite live region on title', () => {
    const { getByText } = render(
      <BottomSheet
        close={jest.fn()}
        closeIconTestID="sheet-close"
        open
        title="Elegí una dirección"
      />,
    )

    const title = getByText('Elegí una dirección')

    expect(title.props.accessibilityRole).toBe('header')
    expect(title.props.accessibilityLiveRegion).toBe('polite')
  })

  it('should expose close button label and hint', () => {
    const { getByTestId } = render(
      <BottomSheet
        close={jest.fn()}
        closeAccessibilityHint="Cierra la elección de dirección"
        closeAccessibilityLabel="Cerrar"
        closeIconTestID="sheet-close"
        open
        title="Elegí una dirección"
      />,
    )

    const closeButton = getByTestId('sheet-close')

    expect(closeButton.props.accessibilityRole).toBe('button')
    expect(closeButton.props.accessibilityLabel).toBe('Cerrar')
    expect(closeButton.props.accessibilityHint).toBe('Cierra la elección de dirección')
  })
})
