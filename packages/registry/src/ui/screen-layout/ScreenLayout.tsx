import { View } from 'react-native'
import { cn } from '@farma/registry/lib/utils'
import { UniwindSafeAreaView } from '@farma/registry/ui/safe-area-view'

import { NAVIGATION_HEADER_EDGES, ScreenLayoutProps } from './ScreenLayout.types'

const ScreenLayout = ({
  children,
  style,
  className,
  backgroundClassName = 'bg-base-white',
  testID,
  edges = NAVIGATION_HEADER_EDGES,
  ...props
}: ScreenLayoutProps) => {
  return (
    <UniwindSafeAreaView className={cn(backgroundClassName, 'flex-1')} edges={edges}>
      <View
        className={cn(backgroundClassName, 'p-padding-xl gap-padding-xl flex-1', className)}
        style={style}
        testID={testID}
        {...props}
      >
        {children}
      </View>
    </UniwindSafeAreaView>
  )
}

export default ScreenLayout
