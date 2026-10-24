import { beforeEach, describe, expect, it, jest } from '@jest/globals'
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')
  const LottieView = require('lottie-react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)
  AnimatedView.displayName = 'Animated.View'

  const AnimatedLottieView = React.forwardRef((props: any, ref: any) => {
    const Lottie = LottieView.default || LottieView
    return <Lottie ref={ref} {...props} />
  })
  AnimatedLottieView.displayName = 'Animated.LottieView'

  const Animated = {
    View: AnimatedView,
    createAnimatedComponent: (component: any) => {
      if (component === View) return AnimatedView
      if (component && (component.displayName === 'LottieView' || component.name === 'LottieView')) {
        return AnimatedLottieView
      }
      return React.forwardRef((props: any, ref: any) => {
        const Component = component
        return <Component ref={ref} {...props} />
      })
    },
  }

  return {
    default: Animated,
    ...Animated,
    useReducedMotion: jest.fn(() => false),
    FadeIn: {},
    FadeOut: {},
  }
})

import React from 'react'
import { Platform } from 'react-native'
import { render } from '@testing-library/react-native'
import { ModalSuccessAnimated } from '../ModalSuccessAnimated'

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.fn(({ children, edges, testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'safe-area'}>{children}</View>
  }),
  EdgeInsets: {},
}))

jest.mock('lottie-react-native', () => {
  const React = require('react')
  const { View } = require('react-native')

  return jest.fn().mockImplementation(({ testID, ...props }: any) => {
    return <View testID={testID || 'lottie-view'} {...props} />
  })
})

jest.mock('@farma/registry/ui/animated-layout', () => {
  const mod: any = (() => {
  const React = require('react')

  return function AnimatedLayout({ children }: any) {
    return <>{children}</>
  }
})()
  return { ...mod, AnimatedLayout: mod.AnimatedLayout ?? mod.default ?? mod }
})

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, type, className, testID }: any) {
    return (
      <Text testID={testID || 'text'} type={type} className={className}>
        {children}
      </Text>
    )
  }
})()
  return { ...mod, Text: mod.Text ?? mod.default ?? mod }
})

jest.mock('@farma/registry/ui/button-section-layout', () => ({
  ButtonSectionLayout: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'button-section'} />
  }),
}))

jest.mock('@farma/registry/lib/dimensions', () => ({
  getWP: jest.fn((percentage: number) => percentage * 10),
}))

describe('ModalSuccessAnimated', () => {
  const mockInsets = { top: 0, bottom: 0, left: 0, right: 0 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with title', () => {
    const { getByText } = render(
      <ModalSuccessAnimated title="Success!" description="Operation completed" insets={mockInsets} />,
    )

    expect(getByText('Success!')).toBeTruthy()
  })

  it('should render with description', () => {
    const { getByText } = render(
      <ModalSuccessAnimated title="Success!" description="Operation completed" insets={mockInsets} />,
    )

    expect(getByText('Operation completed')).toBeTruthy()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(
      <ModalSuccessAnimated
        title="Success!"
        formattedDescription={formattedDescription}
        insets={mockInsets}
      />,
    )

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render LottieView', () => {
    const { getByTestId } = render(
      <ModalSuccessAnimated title="Success!" description="Operation completed" insets={mockInsets} />,
    )

    expect(getByTestId('lottie-view')).toBeTruthy()
  })

  it('should render ButtonSectionLayout when actions are provided', () => {
    const { getByTestId } = render(
      <ModalSuccessAnimated
        title="Success!"
        description="Operation completed"
        insets={mockInsets}
        primaryAction={{ onPress: jest.fn(), children: 'OK' }}
      />,
    )

    expect(getByTestId('button-section')).toBeTruthy()
  })

  it('should not render ButtonSectionLayout when no actions are provided', () => {
    const { queryByTestId } = render(
      <ModalSuccessAnimated title="Success!" description="Operation completed" insets={mockInsets} />,
    )

    expect(queryByTestId('button-section')).toBeNull()
  })
})

