import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import { Dimensions } from 'react-native'

import {
  circumferenceSize,
  circumferenceSpace,
  circumferenceNegativeMargin,
} from '../OptionModal.constants'

jest.mock('react-native', () => ({
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  Platform: { OS: 'ios', select: jest.fn((obj: any) => obj.ios ?? obj.default) },
}))

describe('OptionModal.constants', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('circumferenceSize', () => {
    it('should calculate circumference size based on screen width', () => {
      const expectedSize = 375 * 1.3 // screenWidth * 1.3

      expect(circumferenceSize).toBe(expectedSize)
    })

    it('should use screen width from Dimensions', () => {
      // Dimensions.get is called when the module is loaded, not during test execution
      // So we verify the constant was calculated correctly instead
      const mockWidth = 375

      expect(circumferenceSize).toBe(mockWidth * 1.3)
    })
  })

  describe('circumferenceSpace', () => {
    it('should calculate circumference space correctly', () => {
      const expectedSpace = (circumferenceSize / 2) * 0.4

      expect(circumferenceSpace).toBe(expectedSpace)
    })

    it('should be 40% of half the circumference size', () => {
      const halfCircumference = circumferenceSize / 2

      expect(circumferenceSpace).toBe(halfCircumference * 0.4)
    })
  })

  describe('circumferenceNegativeMargin', () => {
    it('should have correct negative margin value', () => {
      expect(circumferenceNegativeMargin).toBe(16)
    })

    it('should be a constant value', () => {
      expect(typeof circumferenceNegativeMargin).toBe('number')
    })
  })
})
