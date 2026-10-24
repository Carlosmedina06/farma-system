import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'

import SteppedProgressBar from '../SteppedProgressBar'

describe('SteppedProgressBar', () => {
  it('should render with the default testID', () => {
    const { getByTestId } = render(<SteppedProgressBar progress={40} />)

    expect(getByTestId('stepped-progress-bar')).toBeTruthy()
  })

  it('should forward a custom testID', () => {
    const { getByTestId } = render(
      <SteppedProgressBar progress={80} testID="kyc-stepped-progress-bar" />,
    )

    expect(getByTestId('kyc-stepped-progress-bar')).toBeTruthy()
  })
})
