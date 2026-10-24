import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'

import { Portal, PortalHost } from '../Portal'

describe('Portal', () => {
  it('renderiza en el lugar cuando no hay PortalHost', () => {
    const { getByTestId } = render(
      <View testID="parent">
        <Portal>
          <Text testID="content">hola</Text>
        </Portal>
      </View>,
    )

    expect(getByTestId('parent')).toContainElement(getByTestId('content'))
  })

  it('renderiza dentro del PortalHost cuando está montado', () => {
    const { getByTestId } = render(
      <>
        <View testID="parent">
          <Portal>
            <Text testID="content">hola</Text>
          </Portal>
        </View>
        <View testID="host">
          <PortalHost />
        </View>
      </>,
    )

    expect(getByTestId('host')).toContainElement(getByTestId('content'))
    expect(getByTestId('parent')).not.toContainElement(getByTestId('content'))
  })

  it('quita el contenido del host al desmontar el Portal', () => {
    const { queryByTestId, rerender } = render(
      <>
        <Portal>
          <Text testID="content">hola</Text>
        </Portal>
        <PortalHost />
      </>,
    )
    rerender(<PortalHost />)

    expect(queryByTestId('content')).toBeNull()
  })
})
