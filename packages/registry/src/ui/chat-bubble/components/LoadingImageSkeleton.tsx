import { View } from 'react-native'

import { ShimmerSkeleton } from '@farma/registry/ui/shimmer-skeleton'

export const LoadingImageSkeleton = () => (
  <View
    style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 8 }}
    testID="chat-bubble-loading"
  >
    <ShimmerSkeleton colorMode="light" height={100} width={100} />
  </View>
)
