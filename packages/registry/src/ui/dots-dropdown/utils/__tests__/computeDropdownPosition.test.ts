import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { Dimensions } from 'react-native'

import computeDropdownPosition from '../computeDropdownPosition'

describe('computeDropdownPosition', () => {
  beforeEach(() => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 1,
    } as ReturnType<typeof Dimensions.get>)
  })

  it('should place the menu below the trigger when there is enough space', () => {
    const result = computeDropdownPosition({ pageX: 300, pageY: 100, width: 40, height: 40, optionsCount: 2 })

    expect(result).toEqual({ left: 300, top: 144 })
  })

  it('should pin the menu to the right edge when the trigger is near the right', () => {
    const result = computeDropdownPosition({ pageX: 370, pageY: 100, width: 40, height: 40, optionsCount: 2 })

    expect(result.right).toBe(16)
  })

  it('should open above the trigger when there is no space below', () => {
    const result = computeDropdownPosition({ pageX: 100, pageY: 760, width: 40, height: 40, optionsCount: 2 })

    expect(result.top).toBe(760 - (2 * 44 + 16))
  })
})
