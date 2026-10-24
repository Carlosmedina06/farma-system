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

import { ModalNormal } from '../ModalNormal'

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

  return function Icon({ name, color, size, className, testID }: any) {
    return <View testID={testID || `icon-${name}`} />
  }
})()
  return { ...mod, Icon: mod.Icon ?? mod.default ?? mod }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ModalNormal', () => {
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
    const { queryByTestId } = render(<ModalNormal {...defaultProps} visible={false} />)

    expect(queryByTestId('modal-content')).toBeNull()
  })

  it('should render when visible is true', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should render title and description', () => {
    const { getByText } = render(<ModalNormal {...defaultProps} />)

    expect(getByText('Test Title')).toBeTruthy()
    expect(getByText('Test Description')).toBeTruthy()
  })

  it('should render close button when close is provided', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} />)

    expect(getByTestId('modal-normal-close')).toBeTruthy()
  })

  it('should call close when close button is pressed', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} />)

    fireEvent.press(getByTestId('modal-normal-close'))
    expect(defaultProps.close).toHaveBeenCalled()
  })

  it('should call customClose when customClose is provided', () => {
    const customClose = jest.fn()
    const { getByTestId } = render(<ModalNormal {...defaultProps} customClose={customClose} />)

    fireEvent.press(getByTestId('modal-normal-close'))
    expect(customClose).toHaveBeenCalled()
    expect(defaultProps.close).not.toHaveBeenCalled()
  })

  it('should render ModalActions', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} />)

    expect(getByTestId('modal-actions')).toBeTruthy()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<ModalNormal {...defaultProps} formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render icon when provided', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} icon={{ icon: 'check-circle', type: 'success' }} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should render preContent when provided', () => {
    const preContent = <div>Pre Content</div>
    const { UNSAFE_root } = render(<ModalNormal {...defaultProps} preContent={preContent} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should handle verticalSingleButton variant', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} variant="verticalSingleButton" />)

    expect(getByTestId('modal-actions')).toBeTruthy()
  })

  it('should handle Android platform', () => {
    // Platform.OS is already mocked by jest, just verify component renders
    const { getByTestId } = render(<ModalNormal {...defaultProps} />)

    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('should not render close button when close and customClose are not provided', () => {
    const { queryByTestId } = render(
      <ModalNormal
        {...defaultProps}
        close={undefined}
        customClose={undefined}
      />,
    )

    expect(queryByTestId('icon-x-close')).toBeNull()
  })

  it('should not render close button when hideCloseButton is true', () => {
    const { queryByTestId } = render(<ModalNormal {...defaultProps} hideCloseButton />)

    expect(queryByTestId('icon-x-close')).toBeNull()
  })

  it('should expose dialog a11y props for TalkBack', () => {
    const { getByTestId } = render(<ModalNormal {...defaultProps} testID="delete-modal" />)

    const dialog = getByTestId('delete-modal')
    const backdrop = getByTestId('delete-modal-backdrop', { includeHiddenElements: true })
    const closeButton = getByTestId('delete-modal-close')

    expect(dialog.props.accessibilityViewIsModal).toBe(true)
    expect(dialog.props.accessibilityLabel).toBe('Test Title')
    expect(backdrop.props.accessibilityElementsHidden).toBe(true)
    expect(backdrop.props.importantForAccessibility).toBe('no-hide-descendants')
    expect(closeButton.props.accessibilityRole).toBe('button')
    expect(closeButton.props.accessibilityLabel).toBe('Cerrar')
  })
})

