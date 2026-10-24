import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { FeaturedIcon } from '../FeaturedIcon'

jest.mock('@farma/registry/ui/icon', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function MockIcon({ name, testID, ...props }: any) {
    return <View testID={`icon-${name}`} {...props} />
  }
})()
  return { Icon: mod?.default ?? mod }
})

describe('FeaturedIcon', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<FeaturedIcon icon="check" testID="featured-icon" />)

    expect(getByTestId('featured-icon')).toBeTruthy()
  })

  it('should render with different types', () => {
    const types = ['success', 'error', 'warning', 'info'] as const

    types.forEach((type) => {
      const { getByTestId, unmount } = render(
        <FeaturedIcon icon="check" testID="featured-icon" type={type} />,
      )

      expect(getByTestId('featured-icon')).toBeTruthy()
      unmount()
    })
  })

  it('should render with outline', () => {
    const { getByTestId } = render(<FeaturedIcon outline icon="check" testID="featured-icon" />)

    expect(getByTestId('featured-icon')).toBeTruthy()
  })

  it('should render without outline', () => {
    const { getByTestId } = render(
      <FeaturedIcon icon="check" outline={false} testID="featured-icon" />,
    )

    expect(getByTestId('featured-icon')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <FeaturedIcon className="custom-class" icon="check" testID="featured-icon" />,
    )

    expect(getByTestId('featured-icon')).toBeTruthy()
  })
})
