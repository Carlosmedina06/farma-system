import { describe, expect, it, jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react-native'
import LottieView from 'lottie-react-native'

import { Spinner } from '../Spinner'

jest.mock('lottie-react-native', () => {
  const React = require('react')
  const { View } = require('react-native')

  return React.forwardRef((props: any, ref: any) => {
    return <View ref={ref} testID="lottie-view" {...props} />
  })
})

describe('Spinner', () => {
  it('should render with default props', async () => {
    const { getByTestId, queryByTestId } = render(<Spinner testID="spinner" />)

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeTruthy()
    })
  })

  it('should render with custom size string', async () => {
    const { getByTestId } = render(<Spinner size="lg" testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })

  it('should render with custom size number', async () => {
    const { getByTestId } = render(<Spinner size={50} testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })

  it('should render with custom color', async () => {
    const { getByTestId } = render(<Spinner color="blue" testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })

  it('should render with absolute position', async () => {
    const { getByTestId } = render(<Spinner position="absolute" testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })

  it('should render with relative position', async () => {
    const { getByTestId } = render(<Spinner position="relative" testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })

  it('should apply custom className', async () => {
    const { getByTestId } = render(<Spinner className="custom-class" testID="spinner" />)

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeTruthy()
    })
  })


  it('should render with different size variants', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const

    for (const size of sizes) {
      const { getByTestId, unmount } = render(<Spinner size={size} testID="spinner" />)

      await waitFor(() => {
        expect(getByTestId('spinner')).toBeTruthy()
      })

      unmount()
    }
  })
})
