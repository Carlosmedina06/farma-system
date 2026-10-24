import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { RefreshControl } from 'react-native'

import AppRefreshControl from '../AppRefreshControl'

describe('AppRefreshControl', () => {
  it('should render a refresh control with default appearance', () => {
    const onRefresh = jest.fn<() => void>()
    const { UNSAFE_getByType } = render(
      <AppRefreshControl refreshing={false} testID="home-refresh-control" onRefresh={onRefresh} />,
    )

    expect(UNSAFE_getByType(RefreshControl).props.refreshing).toBe(false)
    expect(UNSAFE_getByType(RefreshControl).props.onRefresh).toBe(onRefresh)
  })

  it('should let props override the default appearance', () => {
    const { UNSAFE_getByType } = render(
      <AppRefreshControl refreshing tintColor="#ff0000" tintColorClassName="accent-red-600" />,
    )

    expect(UNSAFE_getByType(RefreshControl).props.refreshing).toBe(true)
    expect(UNSAFE_getByType(RefreshControl).props.tintColor).toBe('#ff0000')
  })
})
