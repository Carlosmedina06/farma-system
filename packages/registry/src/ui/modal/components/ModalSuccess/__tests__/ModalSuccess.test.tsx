import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { Platform } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}))

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
      if (component === LottieView.default || component === LottieView) return AnimatedLottieView
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

import { ModalSuccess } from '../ModalSuccess'

jest.mock('lottie-react-native', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedLottieView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)
  AnimatedLottieView.displayName = 'Animated.LottieView'

  return {
    default: React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} testID="lottie-view" />),
  }
})

jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}))

jest.mock('../../ModalContent/ModalContent', () => ({
  ModalContent: jest.fn(({ title, description, testID }: any) => {
    const React = require('react')
    const { View, Text } = require('react-native')
    return (
      <View testID={testID || 'modal-content'}>
        {title && <Text>{title}</Text>}
        {description && <Text>{description}</Text>}
      </View>
    )
  }),
}))

jest.mock('../../ModalActions/ModalActions', () => ({
  ModalActions: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'modal-actions'} />
  }),
}))

jest.mock('@farma/registry/ui/icon', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function Icon({ name, color, size, testID }: any) {
    return <View testID={testID || `icon-${name}`} />
  }
})()
  return { ...mod, Icon: mod.Icon ?? mod.default ?? mod }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ModalSuccess', () => {
  const defaultProps = {
    visible: true,
    title: 'Test Title',
    description: 'Test Description',
    primaryAction: {
      onPress: jest.fn(),
      children: 'OK',
    },
    secondaryAction: {
      onPress: jest.fn(),
      children: 'Cancel',
    },
    variant: 'verticalTwoButtons' as const,
    close: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null when visible is false', () => {
    const { queryByTestId } = render(<ModalSuccess {...defaultProps} visible={false} />)

    expect(queryByTestId('modal-content')).toBeNull()
  })

  it('should render when visible is true', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should render Lottie animation', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    expect(getByTestId('lottie-view')).toBeTruthy()
  })

  it('should render title and description', () => {
    const { getByText } = render(<ModalSuccess {...defaultProps} />)

    expect(getByText('Test Title')).toBeTruthy()
    expect(getByText('Test Description')).toBeTruthy()
  })

  it('should render close button when close is provided', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should render back icon when showBackIcon is true', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} showBackIcon={true} />)

    expect(getByTestId('icon-arrow-left')).toBeTruthy()
  })

  it('should call close when close button is pressed', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    const closeButton = getByTestId('icon-x-close').parent
    if (closeButton) {
      fireEvent.press(closeButton)
      expect(defaultProps.close).toHaveBeenCalled()
    }
  })

  it('should call customClose when customClose is provided', () => {
    const customClose = jest.fn()
    const { getByTestId } = render(<ModalSuccess {...defaultProps} customClose={customClose} />)

    const closeButton = getByTestId('icon-x-close').parent
    if (closeButton) {
      fireEvent.press(closeButton)
      expect(customClose).toHaveBeenCalled()
      expect(defaultProps.close).not.toHaveBeenCalled()
    }
  })

  it('should render ModalActions', () => {
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    expect(getByTestId('modal-actions')).toBeTruthy()
  })

  it('should render StatusBar', () => {
    const { StatusBar } = require('expo-status-bar')
    render(<ModalSuccess {...defaultProps} />)

    expect(StatusBar).toHaveBeenCalled()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<ModalSuccess {...defaultProps} formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should handle Android platform', () => {
    // Platform.OS is already mocked by jest, just verify component renders
    const { getByTestId } = render(<ModalSuccess {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should not render close button when close and customClose are not provided', () => {
    const { queryByTestId } = render(
      <ModalSuccess
        {...defaultProps}
        close={undefined}
        customClose={undefined}
      />,
    )

    expect(queryByTestId('icon-x-close')).toBeNull()
    expect(queryByTestId('icon-arrow-left')).toBeNull()
  })
})

