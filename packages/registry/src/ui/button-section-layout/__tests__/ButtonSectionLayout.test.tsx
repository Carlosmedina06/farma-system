import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ButtonSectionLayoutBase from '../ButtonSectionLayout'

const formatAmount = (value: number) => `$${value.toFixed(2)}`
const ButtonSectionLayout = (props: any) => <ButtonSectionLayoutBase formatAmount={formatAmount} {...props} />

jest.mock('@farma/registry/ui/button', () => ({
  Button: jest.fn(({ children, onPress, disabled, full, type, icon, testID, ...props }: any) => {
    const React = require('react')
    const { Pressable, Text, View } = require('react-native')
    return (
      <Pressable testID={testID || 'button'} onPress={onPress} disabled={disabled} {...props}>
        {icon && <View testID={`icon-${icon}`} />}
        <Text>{children}</Text>
      </Pressable>
    )
  }),
}))

jest.mock('@farma/registry/ui/animated-layout', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function AnimatedLayout({ children, testID }: any) {
    return <View testID={testID || 'animated-layout'}>{children}</View>
  }
})()
  return { AnimatedLayout: mod?.default ?? mod }
})

jest.mock('@farma/registry/ui/icon', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function Icon({ name, color, size, testID }: any) {
    return <View testID={testID || `icon-${name}`} />
  }
})()
  return { Icon: mod?.default ?? mod }
})

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, type, className, semibold, testID }: any) {
    return (
      <Text testID={testID || 'text'} type={type} className={className} style={{ fontWeight: semibold ? '600' : '400' }}>
        {children}
      </Text>
    )
  }
})()
  return { Text: mod?.default ?? mod }
})

jest.mock('@farma/registry/ui/shimmer-skeleton', () => {
  const mod: any = (() => ({
  __esModule: true,
  default: jest.fn(({ height, width, colorMode, testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'skeleton'} style={{ height, width }} />
  }),
}))()
  return { ShimmerSkeleton: mod?.default ?? mod }
})

jest.mock('@farma/registry/lib/dimensions', () => ({
  getHP: jest.fn((percentage: number) => percentage * 10),
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ButtonSectionLayout', () => {
  const mockPrimaryButton = {
    onPress: jest.fn(),
    children: 'Primary',
    type: 'primary' as any,
  }

  const mockSecondaryButton = {
    onPress: jest.fn(),
    children: 'Secondary',
    type: 'secondary' as any,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render verticalSingleButton variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout variant="verticalSingleButton" primaryButton={mockPrimaryButton} />,
    )

    expect(getByText('Primary')).toBeTruthy()
  })

  it('should render verticalSingleButtonWithAmount variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithAmount"
        amountText="Total"
        amountValue="100"
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(getByText('Total')).toBeTruthy()
    expect(getByText('$100.00')).toBeTruthy()
    expect(getByText('Primary')).toBeTruthy()
  })

  it('should not render amount when amountValue is NaN', () => {
    const { queryByText } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithAmount"
        amountText="Total"
        amountValue="invalid"
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(queryByText('$NaN.00')).toBeNull()
  })

  it('should render amount when amountValue is 0', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithAmount"
        amountText="Total"
        amountValue={0}
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(getByText('$0.00')).toBeTruthy()
  })

  it('should render verticalSingleButtonWithText variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout variant="verticalSingleButtonWithText" amountText="100" primaryButton={mockPrimaryButton} />,
    )

    expect(getByText('Total')).toBeTruthy()
    expect(getByText('100')).toBeTruthy()
    expect(getByText('Primary')).toBeTruthy()
  })

  it('should render verticalTwoButtons variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtons"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Primary')).toBeTruthy()
    expect(getByText('Secondary')).toBeTruthy()
  })

  it('should render verticalPrimaryWithLinkPrompt variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalPrimaryWithLinkPrompt"
        promptText="¿Ya tenés cuenta?"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Primary')).toBeTruthy()
    expect(getByText('¿Ya tenés cuenta?')).toBeTruthy()
    expect(getByText('Secondary')).toBeTruthy()
  })

  it('should call secondaryButton onPress when login prompt is pressed', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalPrimaryWithLinkPrompt"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    fireEvent.press(getByText('Secondary'))
    expect(mockSecondaryButton.onPress).toHaveBeenCalled()
  })

  it('should render horizontalTwoButtons variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="horizontalTwoButtons"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Primary')).toBeTruthy()
    expect(getByText('Secondary')).toBeTruthy()
  })

  it('should render verticalTwoButtonsWithAmount variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithAmount"
        amountText="Total"
        amountValue="100"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Total')).toBeTruthy()
    expect(getByText('$100.00')).toBeTruthy()
    expect(getByText('Primary')).toBeTruthy()
    expect(getByText('Secondary')).toBeTruthy()
  })

  it('should render skeleton when isLoading is true in verticalTwoButtonsWithAmount', () => {
    const { getByTestId } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithAmount"
        amountText="Total"
        amountValue="100"
        isLoading={true}
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should render verticalTwoButtonsWithSummary variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithSummary"
        amountText="Total"
        amountValue="100"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Total')).toBeTruthy()
    expect(getByText('$100.00')).toBeTruthy()
  })

  it('should render amountValue as text when amount is not valid in verticalTwoButtonsWithSummary', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithSummary"
        amountText="Total"
        amountValue="invalid"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('invalid')).toBeTruthy()
  })

  it('should render skeleton when isLoading is true in verticalTwoButtonsWithSummary', () => {
    const { getByTestId } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithSummary"
        amountText="Total"
        amountValue="100"
        isLoading={true}
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should render verticalTwoButtonsWithSummary variant', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtonsWithSummary"
        amountText="Total"
        amountValue="100"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Total')).toBeTruthy()
    expect(getByText('$100.00')).toBeTruthy()
  })

  it('should render verticalSingleButtonWithHeader variant', () => {
    const { getByText, getByTestId } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithHeader"
        headerIcon="marker-pin-02"
        headerTitle="Home"
        headerCaption="123 Main St"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(getByText('Home')).toBeTruthy()
    expect(getByText('123 Main St')).toBeTruthy()
    expect(getByTestId('icon-marker-pin-02')).toBeTruthy()
    expect(getByText('Primary')).toBeTruthy()
  })

  it('should render actionSlotWithButton variant with renderAction slot', () => {
    const React = require('react')
    const { View } = require('react-native')
    const renderAction = jest.fn(({ height }: { height: number }) => (
      <View testID="custom-action" style={{ height }} />
    ))
    const { getByText, getByTestId } = render(
      <ButtonSectionLayout
        variant="actionSlotWithButton"
        amountText="Label"
        amountCaption="Caption"
        amountValue="$ 100"
        renderAction={renderAction}
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(getByText('Label')).toBeTruthy()
    expect(getByText('Caption')).toBeTruthy()
    expect(getByText('$ 100')).toBeTruthy()
    expect(getByTestId('custom-action')).toBeTruthy()
    expect(getByTestId('button-section-action-slot')).toBeTruthy()
    expect(renderAction).toHaveBeenCalledWith({ height: 60 })
    expect(getByText('Primary')).toBeTruthy()
  })

  it('should not render the action slot when renderAction is not provided', () => {
    const { queryByTestId } = render(
      <ButtonSectionLayout variant="actionSlotWithButton" primaryButton={mockPrimaryButton} />,
    )

    expect(queryByTestId('button-section-action-slot')).toBeNull()
  })

  it('should call primaryButton onPress when pressed', () => {
    const { getByText } = render(
      <ButtonSectionLayout variant="verticalSingleButton" primaryButton={mockPrimaryButton} />,
    )

    const button = getByText('Primary').parent
    if (button) {
      fireEvent.press(button)
      expect(mockPrimaryButton.onPress).toHaveBeenCalled()
    }
  })

  it('should call secondaryButton onPress when pressed', () => {
    const { getByText } = render(
      <ButtonSectionLayout
        variant="verticalTwoButtons"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    const button = getByText('Secondary').parent
    if (button) {
      fireEvent.press(button)
      expect(mockSecondaryButton.onPress).toHaveBeenCalled()
    }
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ButtonSectionLayout
        variant="verticalSingleButton"
        primaryButton={mockPrimaryButton}
        className="custom-class"
        testID="button-section"
      />,
    )

    expect(getByTestId('button-section')).toBeTruthy()
  })

  it('should return null for unknown variant', () => {
    const { toJSON } = render(
      <ButtonSectionLayoutBase variant={'unknown' as any} primaryButton={mockPrimaryButton} />,
    )

    expect(toJSON()).toBeNull()
  })

  it('should use the default es-AR formatter when formatAmount is not provided', () => {
    const { getByText } = render(
      <ButtonSectionLayoutBase
        variant="verticalSingleButtonWithAmount"
        amountText="Total"
        amountValue={1234}
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(getByText((1234).toLocaleString('es-AR'))).toBeTruthy()
  })

  it('should use a custom amountLabel in verticalSingleButtonWithText', () => {
    const { getByText, queryByText } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithText"
        amountLabel="Subtotal"
        amountText="100"
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(getByText('Subtotal')).toBeTruthy()
    expect(queryByText('Total')).toBeNull()
  })

  it('should not render business copy by default in verticalPrimaryWithLinkPrompt', () => {
    const { queryByText, getByText } = render(
      <ButtonSectionLayout
        variant="verticalPrimaryWithLinkPrompt"
        primaryButton={mockPrimaryButton}
        secondaryButton={mockSecondaryButton}
      />,
    )

    expect(queryByText('¿Ya tenés cuenta?')).toBeNull()
    expect(getByText('Secondary')).toBeTruthy()
  })

  it('should not render a header icon unless headerIcon is provided', () => {
    const { queryByTestId } = render(
      <ButtonSectionLayout
        variant="verticalSingleButtonWithHeader"
        headerTitle="Title"
        primaryButton={mockPrimaryButton}
      />,
    )

    expect(queryByTestId('icon-marker-pin-02')).toBeNull()
  })

  it('should not leak layout props to the container view', () => {
    const { getByTestId } = render(
      <ButtonSectionLayout
        variant="verticalSingleButton"
        primaryButton={mockPrimaryButton}
        testID="section"
      />,
    )

    expect(getByTestId('section').props.primaryButton).toBeUndefined()
    expect(getByTestId('section').props.formatAmount).toBeUndefined()
  })
})
