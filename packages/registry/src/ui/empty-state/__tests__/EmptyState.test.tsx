import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'

import { EmptyState } from '../EmptyState'

jest.mock('@farma/registry/ui/screen-layout', () => {
  const { View } = require('react-native')

  return {
    ScreenLayout: ({ children, className, testID }: any) => (
      <View className={className} testID={testID || 'screen-layout'}>
        {children}
      </View>
    ),
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, type, className, maxFontSizeMultiplier, testID }: any) => (
      <Text className={className} maxFontSizeMultiplier={maxFontSizeMultiplier} testID={testID || 'text'} type={type}>
        {children}
      </Text>
    ),
  }
})

describe('EmptyState', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render an illustration when not provided', () => {
    const { queryByTestId } = render(<EmptyState content={{ title: 'Sin resultados' }} />)

    expect(queryByTestId('custom-illustration', { includeHiddenElements: true })).toBeNull()
  })

  it('should render custom illustration when provided', () => {
    const { getByTestId } = render(<EmptyState illustration={<View testID="custom-illustration" />} />)

    expect(getByTestId('custom-illustration', { includeHiddenElements: true })).toBeTruthy()
  })

  it('should render title when provided', () => {
    const { getByText } = render(<EmptyState content={{ title: 'No Results' }} />)

    expect(getByText('No Results')).toBeTruthy()
  })

  it('should render both title and label', () => {
    const { getByText } = render(<EmptyState content={{ title: 'No Results', label: 'Try again later' }} />)

    expect(getByText('No Results')).toBeTruthy()
    expect(getByText('Try again later')).toBeTruthy()
  })

  it('should not render title when empty', () => {
    const { queryByText, getByText } = render(<EmptyState content={{ title: '', label: 'Try again later' }} />)

    expect(queryByText('No Results')).toBeNull()
    expect(getByText('Try again later')).toBeTruthy()
  })

  it('should build the accessibility label from title and label', () => {
    const { getByLabelText } = render(<EmptyState content={{ title: 'No Results', label: 'Try again later' }} />)

    expect(getByLabelText('No Results. Try again later')).toBeTruthy()
  })

  it('should pass testID to ScreenLayout', () => {
    const { getByTestId } = render(<EmptyState className="custom-class" testID="empty-state" />)

    expect(getByTestId('empty-state')).toBeTruthy()
  })
})
