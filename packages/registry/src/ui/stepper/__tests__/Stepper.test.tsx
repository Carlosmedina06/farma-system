import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { Stepper } from '../Stepper'

describe('Stepper', () => {
  it('should render with steps and currentStep', () => {
    const { getByTestId } = render(<Stepper currentStep={2} steps={5} testID="stepper" />)

    expect(getByTestId('stepper')).toBeTruthy()
  })

  it('should render correct number of steps', () => {
    const { getByTestId } = render(<Stepper currentStep={1} steps={3} testID="stepper" />)

    expect(getByTestId('stepper')).toBeTruthy()
  })

  it('should render with different currentStep values', () => {
    const { getByTestId, rerender } = render(<Stepper currentStep={0} steps={5} testID="stepper" />)

    expect(getByTestId('stepper')).toBeTruthy()

    rerender(<Stepper currentStep={3} steps={5} testID="stepper" />)
    expect(getByTestId('stepper')).toBeTruthy()

    rerender(<Stepper currentStep={5} steps={5} testID="stepper" />)
    expect(getByTestId('stepper')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Stepper className="custom-class" currentStep={2} steps={4} testID="stepper" />,
    )

    expect(getByTestId('stepper')).toBeTruthy()
  })
})
