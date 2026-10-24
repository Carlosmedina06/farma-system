import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

import ShimmerSkeletonProvider from '../ShimmerSkeletonProvider'

describe('ShimmerSkeletonProvider', () => {
  it('should render children', () => {
    const { getByText } = render(
      <ShimmerSkeletonProvider>
        <Text>skeleton-child</Text>
      </ShimmerSkeletonProvider>,
    )

    expect(getByText('skeleton-child')).toBeTruthy()
  })
})
