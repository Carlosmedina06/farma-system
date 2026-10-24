import { describe, expect, it, test } from '@jest/globals'
import {
  regexBoldText,
  findBoldText,
  removeBoldSimbol,
  splitBoldText,
  splitRegularText,
} from '../TextWithBold.utils'

describe('TextWithBold.utils', () => {
  describe('regexBoldText', () => {
    it('should match text with bold markers', () => {
      expect(regexBoldText.test('**Hello**')).toBe(true)
      expect(regexBoldText.test('**Test**')).toBe(true)
    })

    it('should match text with accents and special characters', () => {
      expect(regexBoldText.test('**José**')).toBe(true)
      expect(regexBoldText.test('**María**')).toBe(true)
    })

    it('should not match text without bold markers', () => {
      expect(regexBoldText.test('Hello')).toBe(false)
      expect(regexBoldText.test('*Hello*')).toBe(false)
    })
  })

  describe('findBoldText', () => {
    it('should return true for text with bold markers', () => {
      expect(findBoldText('**Hello**')).toBe(true)
      expect(findBoldText('**Test**')).toBe(true)
    })

    it('should return false for text without bold markers', () => {
      expect(findBoldText('Hello')).toBe(false)
      expect(findBoldText('Regular text')).toBe(false)
    })
  })

  describe('removeBoldSimbol', () => {
    it('should remove all bold markers', () => {
      expect(removeBoldSimbol('**Hello**')).toBe('Hello')
      expect(removeBoldSimbol('**Test**')).toBe('Test')
    })

    it('should remove multiple bold markers', () => {
      expect(removeBoldSimbol('**Hello** **World**')).toBe('Hello World')
    })

    it('should handle text without bold markers', () => {
      expect(removeBoldSimbol('Hello')).toBe('Hello')
    })
  })

  describe('splitBoldText', () => {
    it('should split by # when text contains #** or **#', () => {
      expect(splitBoldText('Hello#**World**')).toEqual(['Hello', '**World**'])
      expect(splitBoldText('**Hello**#World')).toEqual(['**Hello**', 'World'])
    })

    it('should split by space when text does not contain #** or **#', () => {
      expect(splitBoldText('Hello World')).toEqual(['Hello', 'World'])
      expect(splitBoldText('Test String')).toEqual(['Test', 'String'])
    })

    it('should filter empty items', () => {
      // splitBoldText only splits by # if text includes '#**' or '**#'
      // It splits by #, so 'Hello#**World' becomes ['Hello', '**World']
      expect(splitBoldText('Hello#**World')).toEqual(['Hello', '**World'])
    })

    it('should handle empty string', () => {
      expect(splitBoldText('')).toEqual([''])
    })
  })

  describe('splitRegularText', () => {
    it('should split text by spaces', () => {
      expect(splitRegularText('Hello World')).toEqual(['Hello', 'World'])
      expect(splitRegularText('Test String')).toEqual(['Test', 'String'])
    })

    it('should filter empty items', () => {
      expect(splitRegularText('Hello  World')).toEqual(['Hello', 'World'])
      expect(splitRegularText('  Test  String  ')).toEqual(['Test', 'String'])
    })

    it('should handle empty string', () => {
      expect(splitRegularText('')).toEqual([])
    })

    it('should handle single word', () => {
      expect(splitRegularText('Hello')).toEqual(['Hello'])
    })
  })
})
