import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import StepHeader from '../StepHeader'

jest.mock('../components/AnimatedCircle', () => {
  const { View, Text } = require('react-native')

  return function AnimatedStepCircle({ stepNumber, stepTitle, isActive, isCompleted }: any) {
    return (
      <View testID={`step-circle-${stepNumber}`}>
        <Text testID={`step-number-${stepNumber}`}>{stepNumber}</Text>
        <Text testID={`step-title-${stepNumber}`}>{stepTitle}</Text>
        {isActive && <Text testID={`step-active-${stepNumber}`}>Active</Text>}
        {isCompleted && <Text testID={`step-completed-${stepNumber}`}>Completed</Text>}
      </View>
    )
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function Icon({ name, testID }: any) {
      return <View testID={testID || `icon-${name}`} />
    },
  }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

const STEPS = ['Step 1', 'Step 2', 'Step 3']

describe('StepHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with default props', () => {
    const { getByTestId } = render(<StepHeader activeStep={0} steps={STEPS} testID="step-header" />)

    expect(getByTestId('step-header')).toBeTruthy()
  })

  it('should render all steps with titles and numbers starting from 1', () => {
    const { getByTestId } = render(<StepHeader activeStep={0} steps={STEPS} testID="step-header" />)

    STEPS.forEach((title, index) => {
      expect(getByTestId(`step-circle-${index + 1}`)).toBeTruthy()
      expect(getByTestId(`step-title-${index + 1}`).props.children).toBe(title)
      expect(getByTestId(`step-number-${index + 1}`).props.children).toBe(index + 1)
    })
  })

  it('should mark only activeStep as active', () => {
    const { getByTestId, queryByTestId } = render(
      <StepHeader activeStep={0} steps={STEPS} testID="step-header" />,
    )

    expect(getByTestId('step-active-1')).toBeTruthy()
    expect(queryByTestId('step-active-2')).toBeNull()
    expect(queryByTestId('step-completed-1')).toBeNull()
  })

  it('should mark steps before activeStep as completed', () => {
    const { getByTestId, queryByTestId } = render(
      <StepHeader activeStep={2} steps={STEPS} testID="step-header" />,
    )

    expect(getByTestId('step-completed-1')).toBeTruthy()
    expect(getByTestId('step-completed-2')).toBeTruthy()
    expect(getByTestId('step-active-3')).toBeTruthy()
    expect(queryByTestId('step-completed-3')).toBeNull()
  })

  it('should update when activeStep changes (controlled)', () => {
    const { getByTestId, rerender } = render(
      <StepHeader activeStep={0} steps={STEPS} testID="step-header" />,
    )

    rerender(<StepHeader activeStep={1} steps={STEPS} testID="step-header" />)

    expect(getByTestId('step-completed-1')).toBeTruthy()
    expect(getByTestId('step-active-2')).toBeTruthy()
  })

  it('should render back button when onBack is provided', () => {
    const { getByTestId } = render(
      <StepHeader activeStep={0} steps={STEPS} testID="step-header" onBack={jest.fn()} />,
    )

    expect(getByTestId('icon-arrow-left')).toBeTruthy()
  })

  it('should not render back button when onBack is not provided', () => {
    const { queryByTestId } = render(<StepHeader activeStep={0} steps={STEPS} testID="step-header" />)

    expect(queryByTestId('icon-arrow-left')).toBeNull()
  })

  it('should call onBack when back button is pressed', () => {
    const mockOnBack = jest.fn()
    const { getByTestId } = render(
      <StepHeader activeStep={0} steps={STEPS} testID="step-header" onBack={mockOnBack} />,
    )

    fireEvent.press(getByTestId('step-header-back'))
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('should use default back testID when no testID is given', () => {
    const { getByTestId } = render(<StepHeader activeStep={0} steps={STEPS} onBack={jest.fn()} />)

    expect(getByTestId('step-header-back')).toBeTruthy()
  })

  it('should use custom backIcon when provided', () => {
    const { getByTestId } = render(
      <StepHeader
        activeStep={0}
        backIcon="chevron-left"
        steps={STEPS}
        testID="step-header"
        onBack={jest.fn()}
      />,
    )

    expect(getByTestId('icon-chevron-left')).toBeTruthy()
  })

  it('should use default and custom back accessibility texts', () => {
    const { getByTestId, rerender } = render(
      <StepHeader activeStep={0} steps={STEPS} testID="step-header" onBack={jest.fn()} />,
    )

    expect(getByTestId('step-header-back').props.accessibilityLabel).toBe('Volver')

    rerender(
      <StepHeader
        activeStep={0}
        backAccessibilityHint="Go back"
        backAccessibilityLabel="Back"
        steps={STEPS}
        testID="step-header"
        onBack={jest.fn()}
      />,
    )

    expect(getByTestId('step-header-back').props.accessibilityLabel).toBe('Back')
    expect(getByTestId('step-header-back').props.accessibilityHint).toBe('Go back')
  })

  it('should pass additional props to View', () => {
    const { getByTestId } = render(
      <StepHeader accessibilityLabel="Step header" activeStep={0} steps={STEPS} testID="step-header" />,
    )

    expect(getByTestId('step-header').props.accessibilityLabel).toBe('Step header')
  })

  it('should handle empty steps array', () => {
    const { getByTestId, queryByTestId } = render(
      <StepHeader activeStep={0} steps={[]} testID="step-header" />,
    )

    expect(getByTestId('step-header')).toBeTruthy()
    expect(queryByTestId('step-circle-1')).toBeNull()
  })
})
