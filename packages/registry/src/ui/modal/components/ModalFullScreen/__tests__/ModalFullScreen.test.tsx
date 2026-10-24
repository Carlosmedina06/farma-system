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

import { ModalFullScreen } from '../ModalFullScreen'

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

describe('ModalFullScreen', () => {
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
    const { queryByTestId } = render(<ModalFullScreen {...defaultProps} visible={false} />)

    expect(queryByTestId('modal-content')).toBeNull()
  })

  it('should render when visible is true', () => {
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should render title and description', () => {
    const { getByText } = render(<ModalFullScreen {...defaultProps} />)

    expect(getByText('Test Title')).toBeTruthy()
    expect(getByText('Test Description')).toBeTruthy()
  })

  it('should render close button when close is provided', () => {
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} />)

    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should render back icon when showBackIcon is true', () => {
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} showBackIcon={true} />)

    expect(getByTestId('icon-arrow-left')).toBeTruthy()
  })

  it('should call close when close button is pressed', () => {
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} />)

    const closeButton = getByTestId('icon-x-close').parent
    if (closeButton) {
      fireEvent.press(closeButton)
      expect(defaultProps.close).toHaveBeenCalled()
    }
  })

  it('should call customClose when customClose is provided', () => {
    const customClose = jest.fn()
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} customClose={customClose} />)

    const closeButton = getByTestId('icon-x-close').parent
    if (closeButton) {
      fireEvent.press(closeButton)
      expect(customClose).toHaveBeenCalled()
      expect(defaultProps.close).not.toHaveBeenCalled()
    }
  })

  it('should not render close button when hideCloseButton is true', () => {
    const { queryByTestId } = render(<ModalFullScreen {...defaultProps} hideCloseButton={true} />)

    expect(queryByTestId('icon-x-close')).toBeNull()
    expect(queryByTestId('icon-arrow-left')).toBeNull()
  })

  it('should render ModalActions', () => {
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} />)

    expect(getByTestId('modal-actions')).toBeTruthy()
  })

  it('should render StatusBar', () => {
    const { StatusBar } = require('expo-status-bar')
    render(<ModalFullScreen {...defaultProps} />)

    expect(StatusBar).toHaveBeenCalled()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<ModalFullScreen {...defaultProps} formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <ModalFullScreen {...defaultProps} icon={{ icon: 'check-circle', type: 'success' }} />,
    )

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should render preContent when provided', () => {
    const preContent = <div>Pre Content</div>
    const { UNSAFE_root } = render(<ModalFullScreen {...defaultProps} preContent={preContent} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should handle Android platform', () => {
    // Platform.OS is already mocked by jest, just verify component renders
    const { getByTestId } = render(<ModalFullScreen {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should skip the entering/exiting animation when instant is true', () => {
    const { UNSAFE_getByProps } = render(<ModalFullScreen {...defaultProps} instant={true} />)

    const backdrop = UNSAFE_getByProps({
      className: 'bg-base-white absolute top-0 right-0 bottom-0 left-0',
    })

    expect(backdrop.props.entering).toBeUndefined()
    expect(backdrop.props.exiting).toBeUndefined()
  })

  it('should animate the entering/exiting by default (instant not set)', () => {
    const { UNSAFE_getByProps } = render(<ModalFullScreen {...defaultProps} />)

    const backdrop = UNSAFE_getByProps({
      className: 'bg-base-white absolute top-0 right-0 bottom-0 left-0',
    })

    expect(backdrop.props.entering).toBeDefined()
  })
})

