import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Platform } from 'react-native'

import { LoadingView } from '../LoadingView'

jest.mock('@farma/registry/ui/spinner', () => {
  const { View } = require('react-native')

  return { Spinner: ({ testID }: any) => <View testID={testID || 'spinner'} /> }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, className, testID }: any) => (
      <Text className={className} testID={testID || 'text'}>
        {children}
      </Text>
    ),
  }
})

jest.mock('@farma/registry/lib/dimensions', () => ({
  getWP: jest.fn((percentage: number) => percentage * 10),
  getHP: jest.fn((percentage: number) => percentage * 10),
}))

const originalOS = Platform.OS

describe('LoadingView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    Platform.OS = originalOS
  })

  it('should render title and description', () => {
    const { getByText } = render(<LoadingView description="Please wait" title="Loading..." />)

    expect(getByText('Loading...')).toBeTruthy()
    expect(getByText('Please wait')).toBeTruthy()
  })

  it('should render Spinner on Android', () => {
    Platform.OS = 'android'
    const { getByTestId, queryByTestId } = render(<LoadingView description="Please wait" title="Loading..." />)

    expect(getByTestId('spinner')).toBeTruthy()
    expect(queryByTestId('lottie-view')).toBeNull()
  })

  it('should render LottieView with the default dots loader on iOS', () => {
    Platform.OS = 'ios'
    const { getByTestId } = render(<LoadingView description="Please wait" title="Loading..." />)
    const lottie = getByTestId('lottie-view')

    expect(lottie).toBeTruthy()
    expect(lottie.props.source).toEqual(expect.objectContaining({ layers: expect.any(Array) }))
  })

  it('should allow overriding the lottie source', () => {
    Platform.OS = 'ios'
    const source = { uri: 'https://example.com/anim.json' }
    const { getByTestId } = render(<LoadingView description="d" source={source} title="t" />)

    expect(getByTestId('lottie-view').props.source).toBe(source)
  })

  it('should use default and custom background color', () => {
    const { getByTestId, rerender } = render(<LoadingView description="d" testID="loading-view" title="t" />)

    expect(getByTestId('loading-view')).toHaveStyle({ backgroundColor: '#ffffff' })

    rerender(<LoadingView background="#f0f0f0" description="d" testID="loading-view" title="t" />)

    expect(getByTestId('loading-view')).toHaveStyle({ backgroundColor: '#f0f0f0' })
  })
})
