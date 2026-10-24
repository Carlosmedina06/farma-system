import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'

import { Search } from '../Search'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name, testID, ...props }: any) {
      return <View testID={`icon-${name}`} {...props} />
    },
  }
})

describe('Search accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should expose search role and labels on the input', () => {
    const { UNSAFE_getByType } = render(
      <Search
        accessibilityHint="Ingresá una calle, altura o localidad"
        accessibilityLabel="Buscar direcciones"
        testID="search"
        value=""
        onChangeText={jest.fn()}
      />,
    )

    const { TextInput } = require('react-native')
    const input = UNSAFE_getByType(TextInput)

    expect(input.props.accessibilityRole).toBe('search')
    expect(input.props.accessibilityLabel).toBe('Buscar direcciones')
    expect(input.props.accessibilityHint).toBe('Ingresá una calle, altura o localidad')
  })

  it('should expose clear button a11y props when value is present', () => {
    const { getByTestId } = render(
      <Search
        clearAccessibilityHint="Elimina el texto ingresado"
        clearAccessibilityLabel="Borrar búsqueda"
        clearTestID="search-clear"
        testID="search"
        value="Av Cabildo"
        onChangeText={jest.fn()}
        onClear={jest.fn()}
      />,
    )

    const clearButton = getByTestId('search-clear')

    expect(clearButton.props.accessibilityRole).toBe('button')
    expect(clearButton.props.accessibilityLabel).toBe('Borrar búsqueda')
    expect(clearButton.props.accessibilityHint).toBe('Elimina el texto ingresado')
  })
})
