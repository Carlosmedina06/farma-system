import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import SelectMenu from '../SelectMenu'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return { Icon: ({ name, testID }: any) => <View testID={testID ?? `icon-${name}`} /> }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return { Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text> }
})

describe('SelectMenu', () => {
  const options = [
    { value: 'F', label: 'Femenino' },
    { value: 'M', label: 'Masculino' },
    { value: 'X', label: 'X' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render default placeholder when no value is selected', () => {
    const { getByText } = render(<SelectMenu options={options} testID="gender-menu" />)

    expect(getByText('Seleccioná una opción')).toBeTruthy()
  })

  it('should render the selected value label', () => {
    const { getByText } = render(<SelectMenu options={options} value={options[1]} />)

    expect(getByText('Masculino')).toBeTruthy()
  })

  it('should call onChange when an option is selected', async () => {
    const onChange = jest.fn()
    const { getByTestId, findByTestId } = render(
      <SelectMenu options={options} testID="gender-menu" onChange={onChange} />,
    )

    fireEvent.press(getByTestId('gender-menu-trigger'))
    fireEvent.press(await findByTestId('gender-menu-option-X'))

    expect(onChange).toHaveBeenCalledWith({ value: 'X', label: 'X' })
  })
})
