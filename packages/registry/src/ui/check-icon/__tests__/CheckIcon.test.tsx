import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { CheckboxCheckIcon, CheckIcon } from '../CheckIcon'

describe('CheckIcon', () => {
  it('should render with default size', () => {
    const { getByTestId } = render(<CheckIcon testID="check" />)

    expect(getByTestId('check').props.width).toBe(24)
  })

  it('should accept custom size and color', () => {
    const { getByTestId } = render(<CheckIcon color="#ff0000" size={16} testID="check" />)

    expect(getByTestId('check').props.width).toBe(16)
  })
})

describe('CheckboxCheckIcon', () => {
  it('should render with default size', () => {
    const { getByTestId } = render(<CheckboxCheckIcon testID="check" />)

    expect(getByTestId('check').props.width).toBe(17)
  })
})
