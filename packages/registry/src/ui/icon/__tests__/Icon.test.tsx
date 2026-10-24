import { beforeEach, describe, expect, it, jest, test } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import Icon from '../Icon'

jest.mock('uniwind', () => ({
  useResolveClassNames: jest.fn((className: string) => {
    if (className.includes('custom-class')) {
      return { color: '#5864F8' }
    }

    return {}
  }),
}))

jest.mock('../FarmaIcon', () => ({
  __esModule: true,
  default: jest.fn(({ name, size, color, testID, style }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View style={style} testID={testID || `farma-icon-${name}`} />
  }),
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('Icon', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should pass size to FarmaIcon', () => {
    render(<Icon name="check" size={24} />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[calls.length - 1][0]).toMatchObject({ size: 24 })
  })

  it('should pass color to FarmaIcon', () => {
    render(<Icon name="check" color="#FF0000" />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[calls.length - 1][0]).toMatchObject({ color: '#FF0000' })
  })

  it('should use the className color when color is not passed', () => {
    render(<Icon name="check" className="custom-class" />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls

    expect(calls[calls.length - 1][0]).toMatchObject({ color: '#5864F8' })
  })

  it('should use black when neither color nor a className color is passed', () => {
    render(<Icon name="check" />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls

    expect(calls[calls.length - 1][0]).toMatchObject({ color: '#000000' })
  })

  it('should pass additional props to FarmaIcon', () => {
    render(<Icon name="check" {...({ testID: 'custom-icon' } as any)} />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    expect(calls[calls.length - 1][0]).toMatchObject({ testID: 'custom-icon' })
  })

  it('should disable font scaling on FarmaIcon', () => {
    render(<Icon name="check" />)

    const FarmaIcon = require('../FarmaIcon').default
    const lastCall = FarmaIcon.mock.calls[FarmaIcon.mock.calls.length - 1][0]
    expect(lastCall.allowFontScaling).toBe(false)
    expect(lastCall.maxFontSizeMultiplier).toBe(1)
  })
})

describe('Icon con nombres fuera de la fuente', () => {
  it('usa fallback cuando el nombre no existe', () => {
    render(<Icon fallback="check" name="no-existe-en-la-fuente" />)

    const FarmaIcon = require('../FarmaIcon').default
    const calls = FarmaIcon.mock.calls
    expect(calls[calls.length - 1][0]).toMatchObject({ name: 'check' })
  })

  it('no dibuja nada sin fallback', () => {
    const { toJSON } = render(<Icon name="no-existe-en-la-fuente" />)

    expect(toJSON()).toBeNull()
  })

  it('isIconName distingue glifos incluidos', () => {
    const { isIconName } = require('../Icon')

    expect(isIconName('check')).toBe(true)
    expect(isIconName('no-existe-en-la-fuente')).toBe(false)
    expect(isIconName(undefined)).toBe(false)
  })
})
