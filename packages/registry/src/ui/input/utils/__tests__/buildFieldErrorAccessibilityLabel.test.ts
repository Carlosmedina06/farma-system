import { describe, expect, it } from '@jest/globals'

import { buildFieldErrorAccessibilityLabel } from '../buildFieldErrorAccessibilityLabel'

describe('buildFieldErrorAccessibilityLabel', () => {
  it('builds field name, error keyword and message', () => {
    expect(buildFieldErrorAccessibilityLabel('Nombre', 'El campo es obligatorio')).toBe(
      'Nombre, error, El campo es obligatorio',
    )
  })

  it('falls back when field name is empty', () => {
    expect(buildFieldErrorAccessibilityLabel('  ', 'Dato inválido')).toBe('error, Dato inválido')
  })
})
