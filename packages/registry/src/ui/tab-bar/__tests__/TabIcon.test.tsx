import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import TabIcon from '../components/TabIcon'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: ({ name, color }: any) => <View color={color} testID={`icon-${name}`} />,
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return { Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text> }
})

const home = { active: 'home-05-filled', inactive: 'home-05' } as const
const bell = { active: 'bell-03-filled', inactive: 'bell-03', badge: 'bell-notification' } as const
const orders = { active: 'file-check-02', inactive: 'file-check-02' } as const

describe('TabIcon', () => {
  it('should render active icon when focused', () => {
    const { getByTestId } = render(<TabIcon isFocused icons={home} />)

    expect(getByTestId('icon-home-05-filled').props.color).toBe('#3b4aca')
  })

  it('should render inactive icon when not focused', () => {
    const { getByTestId } = render(<TabIcon icons={home} isFocused={false} />)

    expect(getByTestId('icon-home-05').props.color).toBe('#475467')
  })

  it('should render active icon when focused even with badge', () => {
    const { getByTestId } = render(<TabIcon badge isFocused icons={bell} />)

    expect(getByTestId('icon-bell-03-filled')).toBeTruthy()
  })

  it('should render the badge icon variant when unfocused and badge is set', () => {
    const { getByTestId, queryByTestId } = render(<TabIcon badge icons={bell} isFocused={false} />)

    expect(getByTestId('icon-bell-notification')).toBeTruthy()
    expect(queryByTestId('tab-icon-badge')).toBeNull()
  })

  it('should render inactive icon when badge is false', () => {
    const { getByTestId } = render(<TabIcon badge={false} icons={bell} isFocused={false} />)

    expect(getByTestId('icon-bell-03')).toBeTruthy()
  })

  it('should render a dot when badge is true and no badge icon is defined', () => {
    const { getByTestId } = render(<TabIcon badge icons={home} isFocused={false} />)

    expect(getByTestId('icon-home-05')).toBeTruthy()
    expect(getByTestId('tab-icon-badge')).toBeTruthy()
  })

  it('should render a counter when badge is a number', () => {
    const { getByText } = render(<TabIcon badge={5} icons={home} isFocused={false} />)

    expect(getByText('5')).toBeTruthy()
  })

  it('should cap counter at 99+', () => {
    const { getByText } = render(<TabIcon badge={150} icons={home} isFocused={false} />)

    expect(getByText('99+')).toBeTruthy()
  })

  it('should not render badge when badge is 0', () => {
    const { queryByTestId } = render(<TabIcon badge={0} icons={home} isFocused={false} />)

    expect(queryByTestId('tab-icon-badge')).toBeNull()
  })

  it('should render same icon for routes with identical active/inactive', () => {
    const { getByTestId } = render(<TabIcon icons={orders} isFocused={false} />)

    expect(getByTestId('icon-file-check-02')).toBeTruthy()
  })

  it('should render nothing when route has no icons', () => {
    const { toJSON } = render(<TabIcon isFocused={false} />)

    expect(toJSON()).toBeNull()
  })
})
