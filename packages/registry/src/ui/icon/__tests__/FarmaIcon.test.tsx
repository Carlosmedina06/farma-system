import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import { FarmaIcon } from '../FarmaIcon'

jest.mock('uniwind', () => ({
  useResolveClassNames: jest.fn((className: string) => {
    if (className.includes('custom-class')) {
      return { color: '#5864F8' }
    }

    return {}
  }),
}))

jest.mock('@react-native-vector-icons/common', () => ({
  createIconSet: jest.fn((glyphMap: any, options: any) => {
    const React = require('react')
    const { Text } = require('react-native')
    return function MockIconSet({ name, size, color, testID, className, style, ...props }: any) {
      return (
        <Text
          className={className}
          style={[{ fontSize: size, color }, style]}
          testID={testID || `farma-icon-${name}`}
          {...props}
        >
          {name}
        </Text>
      )
    }
  }),
}))

jest.mock('../glyph-map.json', () => ({
  check: 1,
  close: 2,
  arrow: 3,
}))

describe('FarmaIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render icon with name', () => {
    const { getByText } = render(<FarmaIcon name="check" />)

    expect(getByText('check')).toBeTruthy()
  })

  it('should apply size', () => {
    const { getByTestId } = render(<FarmaIcon name="check" size={24} testID="icon" />)

    const icon = getByTestId('icon')
    const style = Array.isArray(icon.props.style)
      ? Object.assign({}, ...icon.props.style)
      : icon.props.style

    expect(style.fontSize).toBe(24)
  })

  it('should apply color', () => {
    const { getByTestId } = render(<FarmaIcon name="check" color="#FF0000" testID="icon" />)

    const icon = getByTestId('icon')
    const style = Array.isArray(icon.props.style)
      ? Object.assign({}, ...icon.props.style)
      : icon.props.style

    expect(style.color).toBe('#FF0000')
  })

  it('should pass additional props', () => {
    const { getByTestId } = render(<FarmaIcon name="check" testID="custom-icon" />)

    expect(getByTestId('custom-icon')).toBeTruthy()
  })
})

