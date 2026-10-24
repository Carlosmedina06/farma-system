import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Text as RNText } from 'react-native'

import TabLabel from '../components/TabLabel'

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, type, className, testID }: any) => (
      <Text className={className} testID={testID || 'text'} type={type}>
        {children}
      </Text>
    ),
  }
})

describe('TabLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render string label', () => {
    const { getByText } = render(<TabLabel isFocused={false} label="Home" />)

    expect(getByText('Home')).toBeTruthy()
  })

  it('should apply focused color when isFocused is true', () => {
    const { getByText } = render(<TabLabel isFocused label="Home" />)

    expect(getByText('Home').props.className).toContain('text-primary-700')
  })

  it('should apply unfocused color when isFocused is false', () => {
    const { getByText } = render(<TabLabel isFocused={false} label="Home" />)

    expect(getByText('Home').props.className).toContain('text-gray-600')
  })

  it('should call a function label with focused/color/position/children', () => {
    const label = jest.fn((props: any) => <RNText>{`custom-${props.children}`}</RNText>)
    const { getByText } = render(<TabLabel isFocused label={label} routeName="HomeTab" />)

    expect(getByText('custom-HomeTab')).toBeTruthy()
    expect(label).toHaveBeenCalledWith({
      focused: true,
      color: '#3b4aca',
      position: 'below-icon',
      children: 'HomeTab',
    })
  })
})
