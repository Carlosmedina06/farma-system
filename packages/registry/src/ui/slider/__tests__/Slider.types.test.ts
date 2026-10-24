import { describe, expect, it } from '@jest/globals'

import { pointToValue, valueToPoint } from '../Slider.types'

describe('Slider helpers', () => {
  it('valueToPoint maps a value to a position along the width', () => {
    expect(valueToPoint({ value: 50, min: 0, max: 100, width: 200 })).toBe(100)
  })

  it('pointToValue maps a position back to a value', () => {
    expect(pointToValue({ point: 100, min: 0, max: 100, width: 200 })).toBe(50)
  })
})
