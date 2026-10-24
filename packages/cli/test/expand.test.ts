import { describe, expect, it } from 'vitest'

import { expandNames } from '../src/registry/expand'

const index = ['button', 'illustration-kyc-ok', 'illustration-kyc-error', 'illustration-home-banner', 'animation-success'].map(
  (name) => ({ name, type: 'ui' as const, registryDependencies: [] }),
)

describe('expandNames', () => {
  it('deja pasar nombres sin comodín', () => {
    expect(expandNames(['button'], index)).toEqual(['button'])
  })

  it('expande comodines y quita duplicados', () => {
    expect(expandNames(['illustration-kyc-*', 'illustration-kyc-ok'], index)).toEqual([
      'illustration-kyc-ok',
      'illustration-kyc-error',
    ])
    expect(expandNames(['*success'], index)).toEqual(['animation-success'])
  })

  it('falla si un comodín no coincide con nada', () => {
    expect(() => expandNames(['icon-*'], index)).toThrow('Ningún item coincide con "icon-*"')
  })
})
