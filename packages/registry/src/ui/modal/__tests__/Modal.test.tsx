import { beforeEach, describe, expect, it, jest } from '@jest/globals'
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
    useReducedMotion: jest.fn(() => false),
    FadeIn: {},
    FadeOut: {},
  }
})

import React from 'react'
import { Platform } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import { Modal } from '../Modal'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}))

jest.mock('../components/CompactModal/CompactModal', () => {
  const React = require('react')
  const { View } = require('react-native')

  return function CompactModal({ isVisible, testID }: any) {
    return isVisible ? <View testID={testID || 'compact-modal'} /> : null
  }
})

jest.mock('../components/ModalFeedBack/ModalFeedBack', () => {
  const React = require('react')
  const { View } = require('react-native')

  return function FeedbackModal({ testID }: any) {
    return <View testID={testID || 'feedback-modal'} />
  }
})

jest.mock('../components/ModalFullScreen/ModalFullScreen', () => ({
  ModalFullScreen: jest.fn(({ visible, testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return visible ? <View testID={testID || 'fullscreen-modal'} /> : null
  }),
}))

jest.mock('../components/ModalNormal/ModalNormal', () => ({
  ModalNormal: jest.fn(({ visible, testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return visible ? <View testID={testID || 'normal-modal'} /> : null
  }),
}))

jest.mock('../ModalSuccessAnimated', () => ({
  ModalSuccessAnimated: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'success-modal'} />
  }),
}))

jest.mock('@farma/registry/ui/button-section-layout', () => ({
  ButtonSectionLayout: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'button-section'} />
  }),
}))

describe('Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render CompactModal when isCompactModal is true', () => {
    const { getByTestId } = render(
      <Modal isCompactModal={true} visible={true} title="Test" description="Test description" />,
    )

    expect(getByTestId('compact-modal')).toBeTruthy()
  })

  it('should render FeedbackModal when feedback is true', () => {
    const { getByTestId } = render(
      <Modal feedback={true} visible={true} title="Test" description="Test description" />,
    )

    expect(getByTestId('feedback-modal')).toBeTruthy()
  })

  it('should render ModalSuccessAnimated when isSuccess is true', () => {
    const { getByTestId } = render(
      <Modal isSuccess={true} visible={true} title="Test" description="Test description" />,
    )

    expect(getByTestId('success-modal')).toBeTruthy()
  })

  it('should render ModalFullScreen when fullScreen is true', () => {
    const { getByTestId } = render(
      <Modal fullScreen={true} visible={true} title="Test" description="Test description" />,
    )

    expect(getByTestId('fullscreen-modal')).toBeTruthy()
  })


  it('should render ModalNormal by default', () => {
    const { getByTestId } = render(
      <Modal visible={true} title="Test" description="Test description" />,
    )

    expect(getByTestId('normal-modal')).toBeTruthy()
  })
})

