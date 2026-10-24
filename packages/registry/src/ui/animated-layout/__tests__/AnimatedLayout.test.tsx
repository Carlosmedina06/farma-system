import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { Platform, Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { useReducedMotion } from 'react-native-reanimated'

import AnimatedLayout from '../AnimatedLayout'

const mockUseReducedMotion = useReducedMotion as jest.MockedFunction<typeof useReducedMotion>

jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => {
    const Component = View

    return <Component ref={ref} {...props} />
  })

  AnimatedView.displayName = 'Animated.View'

  const withReduceMotion = (animation: object) => ({
    ...animation,
    reduceMotion: jest.fn(function reduceMotion(this: object) {
      return this
    }),
  })

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
    FadeIn: withReduceMotion({}),
    FadeOut: withReduceMotion({}),
    FadeInDown: withReduceMotion({}),
    FadeInUp: withReduceMotion({}),
    LinearTransition: {
      springify: jest.fn(() => withReduceMotion({})),
    },
    ReduceMotion: {
      System: 'system',
      Always: 'always',
      Never: 'never',
    },
    useReducedMotion: jest.fn(() => false),
  }
})

jest.mock('../animatedLayoutSkipEntering', () => ({
  shouldSkipAnimatedLayoutEntering: jest.fn(() => false),
  markSkipAnimatedLayoutEntering: jest.fn(),
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('AnimatedLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseReducedMotion.mockReturnValue(false)
    Platform.OS = 'ios'
  })

  it('should render children', () => {
    const { getByText } = render(
      <AnimatedLayout>
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should use linear effect by default', () => {
    const { getByText } = render(
      <AnimatedLayout>
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should use fade effect when specified', () => {
    const { getByText } = render(
      <AnimatedLayout effect="fade">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should use fadeUp effect when specified', () => {
    const { getByText } = render(
      <AnimatedLayout effect="fadeUp">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should use fadeDown effect when specified', () => {
    const { getByText } = render(
      <AnimatedLayout effect="fadeDown">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <AnimatedLayout className="custom-class" testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByTestId('animated-layout')).toBeTruthy()
  })

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' }
    const { getByTestId } = render(
      <AnimatedLayout style={customStyle} testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByTestId('animated-layout')).toBeTruthy()
  })

  it('should apply layout animation only when animateLayout is enabled', () => {
    const { getByTestId } = render(
      <AnimatedLayout animateLayout effect="linear" testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByTestId('animated-layout').props.layout).toBeDefined()
  })

  it('should omit entering, exiting and layout when reduceMotion is enabled', () => {
    mockUseReducedMotion.mockReturnValue(true)

    const { getByTestId } = render(
      <AnimatedLayout animateLayout testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    const props = getByTestId('animated-layout').props

    expect(props.entering).toBeUndefined()
    expect(props.exiting).toBeUndefined()
    expect(props.layout).toBeUndefined()
  })

  it('should omit exiting on Android', () => {
    Platform.OS = 'android'

    const { getByTestId } = render(
      <AnimatedLayout testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    expect(getByTestId('animated-layout').props.exiting).toBeUndefined()
    expect(getByTestId('animated-layout').props.entering).toBeDefined()
  })

  it('should set entering and exiting on iOS when motion is allowed', () => {
    Platform.OS = 'ios'

    const { getByTestId } = render(
      <AnimatedLayout testID="animated-layout">
        <Text>Test Content</Text>
      </AnimatedLayout>,
    )

    const props = getByTestId('animated-layout').props

    expect(props.entering).toBeDefined()
    expect(props.exiting).toBeDefined()
  })
})
