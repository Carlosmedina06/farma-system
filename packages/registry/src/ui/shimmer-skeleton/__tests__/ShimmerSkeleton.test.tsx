import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'

import ShimmerSkeleton from '../ShimmerSkeleton'
import ShimmerSkeletonProvider from '../ShimmerSkeletonProvider'

describe('ShimmerSkeleton', () => {
  it('se renderiza sin provider', () => {
    const { getByTestId } = render(<ShimmerSkeleton height={20} testID="skeleton" width={100} />)

    expect(getByTestId('skeleton')).toHaveStyle({ height: 20, width: 100 })
  })

  it('se renderiza dentro del provider', () => {
    const { getByTestId } = render(
      <ShimmerSkeletonProvider>
        <ShimmerSkeleton height={20} radius={8} testID="skeleton" width="100%" />
      </ShimmerSkeletonProvider>,
    )

    expect(getByTestId('skeleton')).toHaveStyle({ borderRadius: 8 })
  })
})
