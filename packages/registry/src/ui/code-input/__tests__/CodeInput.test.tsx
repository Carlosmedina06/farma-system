import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'
import { TextInput, View, type TextInputInstance } from 'react-native'

import CodeInput from '../CodeInput'

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>
    },
  }
})

describe('CodeInput', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(
      <CodeInput length={4} testID="code-input" value="" onChange={jest.fn()} />,
    )

    expect(getByTestId('code-input')).toBeTruthy()
  })

  it('should render correct number of input fields', () => {
    const { UNSAFE_root } = render(
      <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should call onChange when text is entered', () => {
    const mockOnChange = jest.fn()
    const { UNSAFE_getByType } = render(
      <CodeInput length={4} testID="code-input" value="" onChange={mockOnChange} />,
    )

    const textInput = UNSAFE_getByType(TextInput)

    fireEvent.changeText(textInput, '1234')

    expect(mockOnChange).toHaveBeenCalledWith('1234')
  })

  it('should sanitize non-numeric input', () => {
    const mockOnChange = jest.fn()
    const { UNSAFE_getByType } = render(
      <CodeInput length={4} testID="code-input" value="" onChange={mockOnChange} />,
    )

    const textInput = UNSAFE_getByType(TextInput)

    fireEvent.changeText(textInput, 'abc123def')

    expect(mockOnChange).toHaveBeenCalledWith('123')
  })

  it('should display error text when provided', () => {
    const { getByText } = render(
      <CodeInput
        errorText="Invalid code"
        length={4}
        testID="code-input"
        value=""
        onChange={jest.fn()}
      />,
    )

    expect(getByText('Invalid code')).toBeTruthy()
  })

  it('should apply error border to cells when hasError is true', () => {
    const { UNSAFE_getAllByType } = render(
      <CodeInput hasError length={6} testID="code-input" value="" onChange={jest.fn()} />,
    )

    const cellViews = UNSAFE_getAllByType(View).filter((view) =>
      view.props.className?.includes('rounded-md'),
    )

    expect(cellViews.length).toBeGreaterThan(0)
    cellViews.forEach((view) => {
      expect(view.props.className).toContain('border-error-100')
    })
  })

  it('should render cells with normal border when hasError is false and no errorText', () => {
    const { UNSAFE_getAllByType } = render(
      <CodeInput hasError={false} length={6} testID="code-input" value="" onChange={jest.fn()} />,
    )

    const cellViews = UNSAFE_getAllByType(View).filter((view) =>
      view.props.className?.includes('rounded-md'),
    )

    expect(cellViews.length).toBeGreaterThan(0)
    cellViews.forEach((view) => {
      expect(view.props.className).not.toContain('border-error-100')
    })
  })

  it('should call onFocus when input is focused', () => {
    const mockOnFocus = jest.fn()
    const { UNSAFE_getByType } = render(
      <CodeInput
        length={4}
        testID="code-input"
        value=""
        onChange={jest.fn()}
        onFocus={mockOnFocus}
      />,
    )

    fireEvent(UNSAFE_getByType(TextInput), 'focus')

    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <CodeInput
        className="custom-class"
        length={4}
        testID="code-input"
        value=""
        onChange={jest.fn()}
      />,
    )

    expect(getByTestId('code-input')).toBeTruthy()
  })

  it('should blur input when code length is reached', () => {
    const mockOnChange = jest.fn()
    const { UNSAFE_getByType } = render(
      <CodeInput length={4} testID="code-input" value="" onChange={mockOnChange} />,
    )

    const textInput = UNSAFE_getByType(TextInput)

    fireEvent.changeText(textInput, '1234')

    expect(mockOnChange).toHaveBeenCalledWith('1234')
  })

  it('should use native autoFocus only on Android', () => {
    const { Platform } = require('react-native')
    const originalOS = Platform.OS

    try {
      Platform.OS = 'android'

      const { UNSAFE_getByType, unmount } = render(
        <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} />,
      )

      expect(UNSAFE_getByType(TextInput).props.autoFocus).toBe(true)
      unmount()

      const { UNSAFE_getByType: getByTypeFilled } = render(
        <CodeInput length={6} testID="code-input" value="936736" onChange={jest.fn()} />,
      )

      expect(getByTypeFilled(TextInput).props.autoFocus).toBe(true)
      unmount()

      Platform.OS = 'ios'

      const { UNSAFE_getByType: getByTypeIos } = render(
        <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} />,
      )

      expect(getByTypeIos(TextInput).props.autoFocus).toBe(false)
    } finally {
      Platform.OS = originalOS
    }
  })

  it('should apply autofill bulk insert in a single change', () => {
    const mockOnChange = jest.fn()
    const { UNSAFE_getByType } = render(
      <CodeInput length={6} testID="code-input" value="" onChange={mockOnChange} />,
    )

    fireEvent.changeText(UNSAFE_getByType(TextInput), '936736')

    expect(mockOnChange).toHaveBeenCalledWith('936736')
  })

  it('should configure OTP autofill props for iOS and Android', () => {
    const { UNSAFE_getByType } = render(
      <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} />,
    )

    const textInput = UNSAFE_getByType(TextInput)

    expect(textInput.props.autoComplete).toBe('one-time-code')
    expect(textInput.props.textContentType).toBe('oneTimeCode')
    expect(textInput.props.keyboardType).toBe('number-pad')
    expect(textInput.props.importantForAutofill).toBe('yes')
  })

  it('should use a full-size near-invisible overlay TextInput for OTP autofill', () => {
    const { UNSAFE_getByType } = render(
      <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} />,
    )

    const textInput = UNSAFE_getByType(TextInput)
    const style = textInput.props.style

    expect(style).toEqual(
      expect.objectContaining({
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        color: 'transparent',
        backgroundColor: 'transparent',
        fontSize: 1,
        opacity: 0.02,
      }),
    )
    expect(style).not.toEqual(expect.objectContaining({ width: 1, height: 1 }))
    expect(style).not.toEqual(expect.objectContaining({ opacity: 0 }))
    expect(textInput.props.caretHidden).toBe(true)
  })

  it('should refocus when parent clears the value', () => {
    jest.useFakeTimers()

    const inputRef = { current: null as TextInputInstance | null }
    const { rerender } = render(
      <CodeInput
        inputRef={inputRef}
        length={6}
        testID="code-input"
        value="123456"
        onChange={jest.fn()}
      />,
    )

    const focusSpy = jest
      .spyOn(inputRef.current as TextInputInstance, 'focus')
      .mockImplementation(() => {})

    rerender(
      <CodeInput
        inputRef={inputRef}
        length={6}
        testID="code-input"
        value=""
        onChange={jest.fn()}
      />,
    )

    jest.runAllTimers()

    expect(focusSpy).toHaveBeenCalled()
    focusSpy.mockRestore()
    jest.useRealTimers()
  })

  it('should keep autofill value while parent value is still syncing', () => {
    const mockOnChange = jest.fn()
    const { UNSAFE_getByType, rerender } = render(
      <CodeInput length={6} testID="code-input" value="" onChange={mockOnChange} />,
    )

    const textInput = UNSAFE_getByType(TextInput)

    fireEvent.changeText(textInput, '936736')

    expect(mockOnChange).toHaveBeenCalledWith('936736')
    expect(textInput.props.value).toBe('936736')

    rerender(<CodeInput length={6} testID="code-input" value="" onChange={mockOnChange} />)

    expect(UNSAFE_getByType(TextInput).props.value).toBe('936736')

    rerender(<CodeInput length={6} testID="code-input" value="936736" onChange={mockOnChange} />)

    expect(UNSAFE_getByType(TextInput).props.value).toBe('936736')
  })

  describe('lifecycle callbacks', () => {
    it('should call onMounted once on first focus with maxLength', () => {
      const onMounted = jest.fn()
      const { UNSAFE_getByType } = render(
        <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} onMounted={onMounted} />,
      )

      fireEvent(UNSAFE_getByType(TextInput), 'focus')
      fireEvent(UNSAFE_getByType(TextInput), 'focus')

      expect(onMounted).toHaveBeenCalledTimes(1)
      expect(onMounted).toHaveBeenCalledWith({ maxLength: 6 })
    })

    it('should call onAutofill and onComplete(autofill: true) on bulk insert', () => {
      const onAutofill = jest.fn()
      const onComplete = jest.fn()
      const { UNSAFE_getByType } = render(
        <CodeInput
          length={6}
          testID="code-input"
          value=""
          onAutofill={onAutofill}
          onChange={jest.fn()}
          onComplete={onComplete}
        />,
      )

      fireEvent.changeText(UNSAFE_getByType(TextInput), '936736')

      expect(onAutofill).toHaveBeenCalledWith({ elapsedMs: expect.any(Number) })
      expect(onComplete).toHaveBeenCalledWith({
        code: '936736',
        autofill: true,
        elapsedMs: expect.any(Number),
      })
    })

    it('should call onComplete(autofill: false) when typing digit by digit', () => {
      const onAutofill = jest.fn()
      const onComplete = jest.fn()
      const { UNSAFE_getByType } = render(
        <CodeInput
          length={4}
          testID="code-input"
          value=""
          onAutofill={onAutofill}
          onChange={jest.fn()}
          onComplete={onComplete}
        />,
      )

      const textInput = UNSAFE_getByType(TextInput)

      fireEvent.changeText(textInput, '1')
      fireEvent.changeText(textInput, '12')
      fireEvent.changeText(textInput, '123')
      fireEvent.changeText(textInput, '1234')

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith({
        code: '1234',
        autofill: false,
        elapsedMs: expect.any(Number),
      })
      expect(onAutofill).not.toHaveBeenCalled()
    })

    it('should call onComplete again after the parent clears the value', () => {
      const onComplete = jest.fn()
      const { UNSAFE_getByType, rerender } = render(
        <CodeInput length={4} testID="code-input" value="" onChange={jest.fn()} onComplete={onComplete} />,
      )

      fireEvent.changeText(UNSAFE_getByType(TextInput), '1234')
      rerender(
        <CodeInput length={4} testID="code-input" value="1234" onChange={jest.fn()} onComplete={onComplete} />,
      )
      expect(onComplete).toHaveBeenCalledTimes(1)

      rerender(
        <CodeInput length={4} testID="code-input" value="" onChange={jest.fn()} onComplete={onComplete} />,
      )
      fireEvent.changeText(UNSAFE_getByType(TextInput), '5678')

      expect(onComplete).toHaveBeenCalledTimes(2)
      expect(onComplete).toHaveBeenLastCalledWith(expect.objectContaining({ code: '5678' }))
    })

    it('should call onError when non-numeric characters are rejected', () => {
      const onError = jest.fn()
      const { UNSAFE_getByType } = render(
        <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} onError={onError} />,
      )

      fireEvent.changeText(UNSAFE_getByType(TextInput), '12ab')

      expect(onError).toHaveBeenCalledWith({ attemptedValue: '12', rawValue: '12ab' })
    })

    it('should not call onError for numeric input', () => {
      const onError = jest.fn()
      const { UNSAFE_getByType } = render(
        <CodeInput length={6} testID="code-input" value="" onChange={jest.fn()} onError={onError} />,
      )

      fireEvent.changeText(UNSAFE_getByType(TextInput), '123')

      expect(onError).not.toHaveBeenCalled()
    })
  })
})
