import { describe, expect, it, jest } from '@jest/globals'
import { render, within } from '@testing-library/react-native'
import { Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { PortalHost } from '@farma/registry/ui/portal'

import { BottomSheet } from '../BottomSheet'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

describe('BottomSheet with the registry Portal', () => {
  it('should render in place when no PortalHost is mounted', () => {
    const { getByText } = render(
      <GestureHandlerRootView>
        <BottomSheet open close={jest.fn()} title="Título">
          <Text>Contenido</Text>
        </BottomSheet>
      </GestureHandlerRootView>,
    )

    expect(getByText('Contenido')).toBeTruthy()
  })

  it('should render into the PortalHost when one is mounted', () => {
    const { getByText, getByTestId } = render(
      <GestureHandlerRootView>
        <View testID="screen">
          <BottomSheet open close={jest.fn()} title="Título">
            <Text>Contenido</Text>
          </BottomSheet>
        </View>
        <PortalHost />
      </GestureHandlerRootView>,
    )

    expect(getByText('Contenido')).toBeTruthy()
    expect(within(getByTestId('screen')).queryByText('Contenido')).toBeNull()
  })
})
