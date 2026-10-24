import type { SharedValue } from 'react-native-reanimated'

import { createContext, useContext } from 'react'

type ShimmerSkeletonContextValue = {
  progress: SharedValue<number>
}

export const ShimmerSkeletonContext = createContext<ShimmerSkeletonContextValue | null>(null)

export function useShimmerSkeletonContext(): ShimmerSkeletonContextValue | null {
  return useContext(ShimmerSkeletonContext)
}
