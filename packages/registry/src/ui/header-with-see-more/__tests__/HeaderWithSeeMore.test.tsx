import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import HeaderWithSeeMore from '../HeaderWithSeeMore'

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, className, semibold, testID }: any) => (
      <Text className={className} style={{ fontWeight: semibold ? '600' : '400' }} testID={testID || 'text'}>
        {children}
      </Text>
    ),
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: ({ name, testID }: any) => <View testID={testID || `icon-${name}`} />,
  }
})

describe('HeaderWithSeeMore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title', () => {
    const { getByText } = render(<HeaderWithSeeMore title="Test Title" />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should render seeMoreText when provided', () => {
    const { getByText } = render(<HeaderWithSeeMore seeMoreText="See More" title="Test Title" onPress={jest.fn()} />)

    expect(getByText('See More')).toBeTruthy()
  })

  it('should render default icon when seeMoreText and onPress are provided', () => {
    const { getByTestId } = render(
      <HeaderWithSeeMore seeMoreText="See More" title="Test Title" onPress={jest.fn()} />,
    )

    expect(getByTestId('icon-chevron-right')).toBeTruthy()
  })

  it('should render custom icon when provided', () => {
    const { getByTestId } = render(
      <HeaderWithSeeMore icon="arrow-right" seeMoreText="See More" title="Test Title" onPress={jest.fn()} />,
    )

    expect(getByTestId('icon-arrow-right')).toBeTruthy()
  })

  it('should call onPress when see more is pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <HeaderWithSeeMore seeMoreTestID="see-more" seeMoreText="See More" title="Test Title" onPress={onPress} />,
    )

    fireEvent.press(getByTestId('see-more'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should not render seeMoreText when onPress is not provided', () => {
    const { queryByText } = render(<HeaderWithSeeMore seeMoreText="See More" title="Test Title" />)

    expect(queryByText('See More')).toBeNull()
  })

  it('should not render icon when seeMoreText is not provided', () => {
    const { queryByTestId } = render(<HeaderWithSeeMore title="Test Title" onPress={jest.fn()} />)

    expect(queryByTestId('icon-chevron-right')).toBeNull()
  })

  it('should pass style and additional props to the container', () => {
    const { getByTestId } = render(
      <HeaderWithSeeMore accessibilityLabel="Header" style={{ backgroundColor: 'red' }} testID="header" title="Test Title" />,
    )

    expect(getByTestId('header').props.accessibilityLabel).toBe('Header')
    expect(getByTestId('header')).toHaveStyle({ backgroundColor: 'red' })
  })
})
