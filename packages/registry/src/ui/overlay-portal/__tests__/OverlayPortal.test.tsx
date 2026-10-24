import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Platform, View } from 'react-native'

import OverlayPortal from '../OverlayPortal'

jest.mock('@farma/registry/ui/portal', () => {
  const { View: MockView } = require('react-native')

  return {
    Portal: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="portal">{children}</MockView>
    ),
  }
})

jest.mock('react-native-screens', () => {
  const { View: MockView } = require('react-native')

  return {
    FullWindowOverlay: ({ children }: { children: React.ReactNode }) => (
      <MockView testID="full-window-overlay">{children}</MockView>
    ),
  }
})

const originalOS = Platform.OS

describe('OverlayPortal', () => {
  afterEach(() => {
    Platform.OS = originalOS
  })

  it('should render children in a FullWindowOverlay when platform is iOS', () => {
    Platform.OS = 'ios'

    const { getByTestId } = render(
      <OverlayPortal>
        <View testID="overlay-child" />
      </OverlayPortal>,
    )

    expect(getByTestId('full-window-overlay')).toBeTruthy()
    expect(getByTestId('overlay-child')).toBeTruthy()
  })

  it('should render children in a Portal when platform is Android', () => {
    Platform.OS = 'android'

    const { getByTestId, queryByTestId } = render(
      <OverlayPortal>
        <View testID="overlay-child" />
      </OverlayPortal>,
    )

    expect(getByTestId('portal')).toBeTruthy()
    expect(queryByTestId('full-window-overlay')).toBeNull()
  })
})
