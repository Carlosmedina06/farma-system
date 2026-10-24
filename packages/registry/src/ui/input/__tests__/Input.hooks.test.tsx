import { describe, expect, it, jest } from '@jest/globals'
import { renderHook, act } from '@testing-library/react-native'

import { useInputMask } from '../Input.hooks'

jest.mock('react-native-mask-text', () => ({
  mask: jest.fn((value: any) => value),
  unMask: jest.fn((value: any) => value),
}))

describe('useInputMask', () => {
  it('should return default values when no mask is provided', () => {
    const { result } = renderHook(() => useInputMask({}))

    expect(result.current.usingMask).toBe(false)
    expect(result.current.maskedValue).toBeDefined()
    expect(typeof result.current.onChangeMask).toBe('function')
  })

  it('should return usingMask true when maskPattern is provided', () => {
    const { result } = renderHook(() => useInputMask({ maskPattern: '9999' }))

    expect(result.current.usingMask).toBe(true)
  })

  it('should return usingMask true when maskType is provided', () => {
    const { result } = renderHook(() => useInputMask({ maskType: 'currency' }))

    expect(result.current.usingMask).toBe(true)
  })

  it('should call onChangeMask function', () => {
    const { result } = renderHook(() => useInputMask({ maskType: 'currency' }))

    act(() => {
      result.current.onChangeMask('100')
    })

    expect(result.current.maskedValue).toBeDefined()
  })

  it('should handle value changes', () => {
    const { result, rerender } = renderHook((props) => useInputMask(props), {
      initialProps: { maskType: 'currency', value: '100' },
    })

    expect(result.current.usingMask).toBe(true)

    rerender({ maskType: 'currency', value: '200' })

    expect(result.current.maskedValue).toBeDefined()
  })

  it('should handle custom mask pattern', () => {
    const { result } = renderHook(() => useInputMask({ maskPattern: '9999-9999' }))

    expect(result.current.usingMask).toBe(true)
  })
})
