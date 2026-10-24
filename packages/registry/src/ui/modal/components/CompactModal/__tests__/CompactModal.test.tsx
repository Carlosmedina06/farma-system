import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CompactModal from '../CompactModal'

jest.mock('@farma/registry/lib/dimensions', () => ({
  getWP: jest.fn((percentage: number) => percentage * 4),
}))

jest.mock('@farma/registry/ui/button-section-layout', () => ({
  ButtonSectionLayout: jest.fn(({ primaryButton, secondaryButton, testID }: any) => {
    const React = require('react')
    const { View, Pressable, Text } = require('react-native')
    return (
      <View testID={testID || 'button-section'}>
        {primaryButton && (
          <Pressable
            testID="primary-button"
            onPress={primaryButton.onPress}
            disabled={primaryButton.disabled !== undefined ? primaryButton.disabled : false}
          >
            <Text>{primaryButton.children}</Text>
          </Pressable>
        )}
        {secondaryButton && (
          <Pressable
            testID="secondary-button"
            onPress={secondaryButton.onPress}
            disabled={secondaryButton.disabled !== undefined ? secondaryButton.disabled : false}
          >
            <Text>{secondaryButton.children}</Text>
          </Pressable>
        )}
      </View>
    )
  }),
}))

jest.mock('@farma/registry/ui/featured-icon', () => ({
  FeaturedIcon: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'featured-icon'} />
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

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, type, className, numberOfLines, testID }: any) {
    return (
      <Text testID={testID || 'text'} type={type} className={className} numberOfLines={numberOfLines}>
        {children}
      </Text>
    )
  }
})()
  return { ...mod, Text: mod.Text ?? mod.default ?? mod }
})

describe('CompactModal', () => {
  const defaultProps = {
    isVisible: true,
    primaryAction: {
      onPress: jest.fn(),
      children: 'Primary',
    },
    secondaryAction: {
      onPress: jest.fn(),
      children: 'Secondary',
    },
    title: 'Test Title',
    primaryDescription: 'Primary Description',
    secondaryDescription: 'Secondary Description',
    formattedDescription: null,
    icon: {
      icon: 'check-circle' as any,
      type: 'success',
    },
    isLoading: false,
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when visible', () => {
    const { getByText } = render(<CompactModal {...defaultProps} />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should not render modal when not visible', () => {
    const { queryByText } = render(<CompactModal {...defaultProps} isVisible={false} />)

    expect(queryByText('Test Title')).toBeNull()
  })

  it('should render icon', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    expect(getByTestId('featured-icon')).toBeTruthy()
  })

  it('should render title when formattedDescription is not provided', () => {
    const { getByText } = render(<CompactModal {...defaultProps} />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should render primary and secondary descriptions when formattedDescription is not provided', () => {
    const { getByText } = render(<CompactModal {...defaultProps} />)

    expect(getByText('Primary Description')).toBeTruthy()
    expect(getByText('Secondary Description')).toBeTruthy()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<CompactModal {...defaultProps} formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should not render title when formattedDescription is provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { queryByText } = render(<CompactModal {...defaultProps} formattedDescription={formattedDescription} />)

    expect(queryByText('Test Title')).toBeNull()
  })

  it('should render close button', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should call secondaryAction.onPress when close button is pressed', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    const closeButton = getByTestId('icon-x-close').parent
    if (closeButton) {
      fireEvent.press(closeButton)
      expect(defaultProps.secondaryAction.onPress).toHaveBeenCalled()
    }
  })

  it('should render primary and secondary buttons', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    expect(getByTestId('primary-button')).toBeTruthy()
    expect(getByTestId('secondary-button')).toBeTruthy()
  })

  it('should call primaryAction.onPress when primary button is pressed', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    fireEvent.press(getByTestId('primary-button'))
    expect(defaultProps.primaryAction.onPress).toHaveBeenCalled()
  })

  it('should call secondaryAction.onPress when secondary button is pressed', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} />)

    fireEvent.press(getByTestId('secondary-button'))
    expect(defaultProps.secondaryAction.onPress).toHaveBeenCalled()
  })

  it('should disable buttons when isLoading is true', () => {
    const { getByTestId } = render(<CompactModal {...defaultProps} isLoading={true} />)

    const primaryButton = getByTestId('primary-button')
    const secondaryButton = getByTestId('secondary-button')
    
    // The disabled prop should be passed through ButtonSectionLayout
    // We verify that the buttons are rendered (they exist) and the component handles isLoading
    expect(primaryButton).toBeTruthy()
    expect(secondaryButton).toBeTruthy()
    
    // Verify that ButtonSectionLayout was called with disabled: true
    const ButtonSectionLayout = require('@farma/registry/ui/button-section-layout').ButtonSectionLayout
    const calls = ButtonSectionLayout.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const lastCall = calls[calls.length - 1]
    expect(lastCall[0].primaryButton.disabled).toBe(true)
    expect(lastCall[0].secondaryButton.disabled).toBe(true)
  })

  it('should handle missing secondaryAction.onPress', () => {
    const propsWithoutOnPress = {
      ...defaultProps,
      secondaryAction: {
        children: 'Secondary',
      },
    }

    const { getByTestId } = render(<CompactModal {...propsWithoutOnPress} />)

    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should handle missing primaryAction.onPress', () => {
    const propsWithoutOnPress = {
      ...defaultProps,
      primaryAction: {
        children: 'Primary',
      },
    }

    const { getByTestId } = render(<CompactModal {...propsWithoutOnPress} />)

    expect(getByTestId('primary-button')).toBeTruthy()
  })
})

