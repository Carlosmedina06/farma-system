import type { ReactNode } from 'react'
import { Platform } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import { Portal } from '@farma/registry/ui/portal'

export type OverlayPortalProps = Readonly<{
  children: ReactNode
}>

// iOS necesita FullWindowOverlay para quedar por encima de headers nativos y modales.
export default function OverlayPortal({ children }: OverlayPortalProps) {
  if (Platform.OS === 'ios') {
    return <FullWindowOverlay>{children}</FullWindowOverlay>
  }

  return <Portal>{children}</Portal>
}
