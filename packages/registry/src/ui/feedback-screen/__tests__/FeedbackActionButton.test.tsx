import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import FeedbackActionButton from '../components/FeedbackActionButton'

jest.mock('@farma/registry/ui/button', () => {
  const { Pressable, Text } = require('react-native')

  return {
    Button: jest.fn(({ children, testID, onPress }: any) => (
      <Pressable testID={testID} onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    )),
  }
})

const { Button } = require('@farma/registry/ui/button')

const lastButtonProps = () => Button.mock.calls.at(-1)[0]

describe('FeedbackActionButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when there is no action', () => {
    const { queryByTestId } = render(<FeedbackActionButton variant="primary" onPress={jest.fn()} />)

    expect(queryByTestId('feedback-primary-button')).toBeNull()
    expect(Button).not.toHaveBeenCalled()
  })

  it('renders nothing when the action is hidden', () => {
    render(
      <FeedbackActionButton
        action={{ label: 'Continuar', hidden: true }}
        variant="primary"
        onPress={jest.fn()}
      />,
    )

    expect(Button).not.toHaveBeenCalled()
  })

  it('applies the default primary look when no type is provided', () => {
    const { getByText } = render(
      <FeedbackActionButton
        action={{ label: 'Continuar' }}
        variant="primary"
        onPress={jest.fn()}
      />,
    )

    expect(getByText('Continuar')).toBeTruthy()
    expect(lastButtonProps()).toMatchObject({
      testID: 'feedback-primary-button',
      className: 'bg-base-white',
      color: 'text-gray-900',
      type: undefined,
    })
  })

  it('applies the default secondary look when no type is provided', () => {
    render(
      <FeedbackActionButton
        action={{ label: 'Cancelar' }}
        variant="secondary"
        onPress={jest.fn()}
      />,
    )

    expect(lastButtonProps()).toMatchObject({
      testID: 'feedback-secondary-button',
      className: 'bg-transparent',
      color: 'text-base-white',
      type: 'tertiary',
    })
  })

  it('lets the button type drive the look when a custom type is set', () => {
    render(
      <FeedbackActionButton
        action={{ label: 'Reintentar', type: 'secondary' }}
        variant="primary"
        onPress={jest.fn()}
      />,
    )

    expect(lastButtonProps()).toMatchObject({
      type: 'secondary',
      className: undefined,
      color: undefined,
    })
  })

  it('honors explicit className and color overrides alongside a custom type', () => {
    render(
      <FeedbackActionButton
        action={{
          label: 'Reintentar',
          type: 'secondary',
          className: 'bg-base-white',
          color: 'text-primary-600',
        }}
        variant="primary"
        onPress={jest.fn()}
      />,
    )

    expect(lastButtonProps()).toMatchObject({
      type: 'secondary',
      className: 'bg-base-white',
      color: 'text-primary-600',
    })
  })

  it('wires the onPress handler', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <FeedbackActionButton action={{ label: 'Continuar' }} variant="primary" onPress={onPress} />,
    )

    fireEvent.press(getByTestId('feedback-primary-button'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
