import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'
import { Text as RNText, View } from 'react-native'

import CustomScreenHeader from '../CustomScreenHeader'

const mockUseBackHandler = jest.fn()

jest.mock('@react-native-community/hooks', () => ({
  useBackHandler: (callback: () => boolean) => mockUseBackHandler(callback),
}))

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function Icon({ name, testID }: any) {
      return <View testID={testID || `icon-${name}`} />
    },
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({
      children,
      className,
      numberOfLines,
      maxFontSizeMultiplier,
      accessibilityRole,
      testID,
    }: any) {
      return (
        <Text
          accessibilityRole={accessibilityRole}
          className={className}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          numberOfLines={numberOfLines}
          testID={testID || 'text'}
        >
          {children}
        </Text>
      )
    },
  }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

const getBackHandler = () => mockUseBackHandler.mock.calls.at(-1)?.[0] as () => boolean

describe('CustomScreenHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title', () => {
    const { getByText } = render(<CustomScreenHeader title="Test Title" />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should expose title as header and back button with a11y props', () => {
    const { getByText, getByLabelText } = render(
      <CustomScreenHeader title="Test Title" onBack={jest.fn()} />,
    )

    expect(getByText('Test Title').props.accessibilityRole).toBe('header')

    const backButton = getByLabelText('Volver')

    expect(backButton.props.accessibilityRole).toBe('button')
    expect(backButton.props.accessibilityHint).toContain('regresar')
  })

  it('should allow overriding back a11y texts', () => {
    const { getByLabelText } = render(
      <CustomScreenHeader
        backAccessibilityHint="Go back"
        backAccessibilityLabel="Back"
        title="Test Title"
        onBack={jest.fn()}
      />,
    )

    expect(getByLabelText('Back').props.accessibilityHint).toBe('Go back')
  })

  it('should render back button when onBack is provided', () => {
    const { getByTestId } = render(<CustomScreenHeader title="Test Title" onBack={jest.fn()} />)

    expect(getByTestId('icon-chevron-left')).toBeTruthy()
  })

  it('should render custom back icon', () => {
    const { getByTestId } = render(
      <CustomScreenHeader backIcon="arrow-left" title="Test Title" onBack={jest.fn()} />,
    )

    expect(getByTestId('icon-arrow-left')).toBeTruthy()
  })

  it('should call onBack when back button is pressed', () => {
    const onBack = jest.fn()
    const { getByTestId } = render(<CustomScreenHeader title="Test Title" onBack={onBack} />)

    fireEvent.press(getByTestId('custom-screen-header-back'))
    expect(onBack).toHaveBeenCalled()
  })

  it('should render logo slot when there is no title', () => {
    const { getByTestId } = render(<CustomScreenHeader logo={<View testID="brand-logo" />} />)

    expect(getByTestId('brand-logo')).toBeTruthy()
  })

  it('should prefer title over logo', () => {
    const { queryByTestId, getByText } = render(
      <CustomScreenHeader logo={<View testID="brand-logo" />} title="Title" />,
    )

    expect(getByText('Title')).toBeTruthy()
    expect(queryByTestId('brand-logo')).toBeNull()
  })

  it('should render subHeader below the top bar', () => {
    const { getByTestId } = render(
      <CustomScreenHeader subHeader={<View testID="sub-header" />} testID="header" title="T" />,
    )

    expect(getByTestId('header')).toBeTruthy()
    expect(getByTestId('sub-header')).toBeTruthy()
  })

  it('should hide the top bar with hideTopBar and keep subHeader', () => {
    const { queryByTestId, getByTestId } = render(
      <CustomScreenHeader
        hideTopBar
        subHeader={<View testID="sub-header" />}
        testID="header"
        onBack={jest.fn()}
      />,
    )

    expect(queryByTestId('header')).toBeNull()
    expect(getByTestId('sub-header')).toBeTruthy()
  })

  it('should render actions', () => {
    const actions = [{ name: 'cart' as any, onPress: jest.fn() }]
    const { getByTestId } = render(<CustomScreenHeader actions={actions} title="Test Title" />)

    expect(getByTestId('icon-cart')).toBeTruthy()
  })

  it('should call action onPress when action is pressed', () => {
    const onPress = jest.fn()
    const actions = [{ name: 'cart' as any, onPress }]
    const { getByTestId } = render(<CustomScreenHeader actions={actions} title="Test Title" />)

    fireEvent.press(getByTestId('custom-screen-header-action-0'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should render customIcon when provided', () => {
    const actions = [{ customIcon: <RNText testID="custom-icon">Custom</RNText>, onPress: jest.fn() }]
    const { getByTestId } = render(<CustomScreenHeader actions={actions} title="Test Title" />)

    expect(getByTestId('custom-icon')).toBeTruthy()
  })

  it('should render amount badge when amount is provided', () => {
    const actions = [{ name: 'cart' as any, onPress: jest.fn(), amount: 5 }]
    const { getByText } = render(<CustomScreenHeader actions={actions} title="Test Title" />)

    expect(getByText('5')).toBeTruthy()
  })

  it('should render rightAction slot', () => {
    const { getByTestId } = render(
      <CustomScreenHeader rightAction={<View testID="right-action" />} title="Test Title" />,
    )

    expect(getByTestId('right-action')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <CustomScreenHeader className="custom-class" testID="header" title="Test Title" />,
    )

    expect(getByTestId('header').props.className).toContain('custom-class')
  })

  it('should not render actions when actions array is empty', () => {
    const { queryByTestId } = render(<CustomScreenHeader actions={[]} title="Test Title" />)

    expect(queryByTestId('custom-screen-header-action-0')).toBeNull()
  })

  describe('hardware back', () => {
    it('should call onBack and consume the event by default', () => {
      const onBack = jest.fn()

      render(<CustomScreenHeader title="T" onBack={onBack} />)

      expect(getBackHandler()()).toBe(true)
      expect(onBack).toHaveBeenCalledTimes(1)
    })

    it('should not handle the event when handleHardwareBack is false', () => {
      const onBack = jest.fn()

      render(<CustomScreenHeader handleHardwareBack={false} title="T" onBack={onBack} />)

      expect(getBackHandler()()).toBe(false)
      expect(onBack).not.toHaveBeenCalled()
    })

    it('should use onHardwareBack when provided', () => {
      const onBack = jest.fn()
      const onHardwareBack = jest.fn(() => false)

      render(<CustomScreenHeader title="T" onBack={onBack} onHardwareBack={onHardwareBack} />)

      expect(getBackHandler()()).toBe(false)
      expect(onHardwareBack).toHaveBeenCalledTimes(1)
      expect(onBack).not.toHaveBeenCalled()
    })
  })
})
