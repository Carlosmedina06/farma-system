import { describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'

import OptimizedImage from '../OptimizedImage'

jest.mock('expo-image', () => {
  const React = require('react')
  const { Image } = require('react-native')

  return {
    Image: React.forwardRef((props: any, ref: any) => <Image ref={ref} {...props} />),
  }
})

jest.mock('@farma/registry/ui/spinner', () => ({
  Spinner: (props: any) => {
    const React = require('react')
    const { View } = require('react-native')

    return <View testID="spinner" {...props} />
  },
}))

describe('OptimizedImage', () => {
  it('should render with url', () => {
    const { getByTestId } = render(
      <OptimizedImage testID="optimized-image" url="https://example.com/image.jpg" />,
    )

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should render with width and height', () => {
    const { getByTestId } = render(
      <OptimizedImage
        height={100}
        testID="optimized-image"
        url="https://example.com/image.jpg"
        width={100}
      />,
    )

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should render with borderRadius', () => {
    const { getByTestId } = render(
      <OptimizedImage
        borderRadius={10}
        testID="optimized-image"
        url="https://example.com/image.jpg"
      />,
    )

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should render with different resizeMode', () => {
    const { getByTestId } = render(
      <OptimizedImage
        resizeMode="contain"
        testID="optimized-image"
        url="https://example.com/image.jpg"
      />,
    )

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <OptimizedImage
        className="custom-class"
        testID="optimized-image"
        url="https://example.com/image.jpg"
      />,
    )

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should handle invalid url', () => {
    const { getByTestId } = render(<OptimizedImage testID="optimized-image" url="invalid-url" />)

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should handle empty url', () => {
    const { getByTestId } = render(<OptimizedImage testID="optimized-image" url="" />)

    expect(getByTestId('optimized-image')).toBeTruthy()
  })

  it('should not render an image when url is invalid and there is no fallback', () => {
    const { queryByTestId } = render(<OptimizedImage testID="optimized-image" url="invalid-url" />)

    expect(queryByTestId('optimized-image-image')).toBeNull()
  })

  it('should render fallbackSource when url is invalid', () => {
    const fallback = { uri: 'https://example.com/fallback.png' }
    const { getByTestId } = render(
      <OptimizedImage fallbackSource={fallback} testID="optimized-image" url="" />,
    )

    expect(getByTestId('optimized-image-image').props.source).toEqual(fallback)
  })

  it('should show spinner while loading a remote url', () => {
    const { getByTestId } = render(
      <OptimizedImage testID="optimized-image" url="https://example.com/image.jpg" />,
    )

    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('should switch to fallback, call onError and add the url to failedCache on error', () => {
    const onError = jest.fn()
    const failedCache = { has: jest.fn((_uri: string) => false), add: jest.fn() }
    const fallback = 42
    const { getByTestId } = render(
      <OptimizedImage
        failedCache={failedCache}
        fallbackSource={fallback}
        testID="optimized-image"
        url="https://example.com/broken.jpg"
        onError={onError}
      />,
    )

    fireEvent(getByTestId('optimized-image-image'), 'error')

    expect(onError).toHaveBeenCalled()
    expect(failedCache.add).toHaveBeenCalledWith('https://example.com/broken.jpg')
    expect(getByTestId('optimized-image-image').props.source).toBe(fallback)
  })

  it('should skip the network when failedCache (sync) knows the url failed', () => {
    const failedCache = { has: jest.fn((_uri: string) => true), add: jest.fn() }
    const { getByTestId, queryByTestId } = render(
      <OptimizedImage
        failedCache={failedCache}
        fallbackSource={7}
        testID="optimized-image"
        url="https://example.com/known-broken.jpg"
      />,
    )

    expect(failedCache.has).toHaveBeenCalledWith('https://example.com/known-broken.jpg')
    expect(getByTestId('optimized-image-image').props.source).toBe(7)
    expect(queryByTestId('spinner')).toBeNull()
  })

  it('should wait for an async failedCache before loading the url', async () => {
    let resolve: (value: boolean) => void = () => {}
    const failedCache = {
      has: jest.fn(() => new Promise<boolean>((r) => (resolve = r))),
      add: jest.fn(),
    }
    const { queryByTestId, getByTestId } = render(
      <OptimizedImage
        failedCache={failedCache}
        testID="optimized-image"
        url="https://example.com/image.jpg"
      />,
    )

    expect(queryByTestId('optimized-image-image')).toBeNull()
    expect(getByTestId('spinner')).toBeTruthy()

    await act(async () => resolve(false))

    await waitFor(() =>
      expect(getByTestId('optimized-image-image').props.source).toEqual({
        uri: 'https://example.com/image.jpg',
      }),
    )
  })
})
