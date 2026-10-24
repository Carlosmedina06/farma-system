import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, render, within } from '@testing-library/react-native'

import { Icon } from '@farma/registry/ui/icon'

import { MAX_VISIBLE_TOASTS, ToastHost, ToastType, showToast, toast } from '../toast'

describe('toast (pila propia, sin librerías)', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => toast.hide())
    jest.useRealTimers()
  })

  it('no muestra nada sin toasts', () => {
    const { queryByTestId } = render(<ToastHost />)

    expect(queryByTestId('toast')).toBeNull()
  })

  it('muestra un toast con showToast (alias de toast.show)', () => {
    const { getByText } = render(<ToastHost />)

    act(() => {
      showToast({ text: 'Guardado', type: ToastType.Success })
    })

    expect(getByText('Guardado')).toBeTruthy()
  })

  it(`apila hasta ${MAX_VISIBLE_TOASTS}: el más nuevo abajo y el más viejo se descarta`, () => {
    const { getAllByTestId, queryByText } = render(<ToastHost />)

    act(() => {
      for (const n of [1, 2, 3, 4]) toast.show({ text: `Toast ${n}` })
    })

    const texts = getAllByTestId('toast').map((node) => within(node).getByText(/Toast \d/).props.children)
    expect(texts).toEqual(['Toast 2', 'Toast 3', 'Toast 4'])
    expect(queryByText('Toast 1')).toBeNull()
  })

  it('cada toast se va solo al cumplir su duración', () => {
    const { queryByText } = render(<ToastHost />)

    act(() => {
      toast.show({ text: 'Corto', duration: 1000 })
      toast.show({ text: 'Largo', duration: 5000 })
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(queryByText('Corto')).toBeNull()
    expect(queryByText('Largo')).toBeTruthy()

    act(() => {
      jest.advanceTimersByTime(4000)
    })
    expect(queryByText('Largo')).toBeNull()
  })

  it('usa 4000 ms por defecto', () => {
    const { queryByText } = render(<ToastHost />)

    act(() => {
      toast.show({ text: 'Default' })
    })
    act(() => {
      jest.advanceTimersByTime(3999)
    })
    expect(queryByText('Default')).toBeTruthy()

    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(queryByText('Default')).toBeNull()
  })

  it('tocar el toast o la X lo cierra solo a él', () => {
    const { getAllByTestId, queryByText } = render(<ToastHost />)

    act(() => {
      toast.show({ text: 'Uno' })
      toast.show({ text: 'Dos', withCloseIcon: true })
    })
    fireEvent.press(getAllByTestId('toast')[0]!)
    expect(queryByText('Uno')).toBeNull()

    fireEvent.press(getAllByTestId('toast-close')[0]!)
    expect(queryByText('Dos')).toBeNull()
  })

  it('toast.hide(id) cierra uno y toast.hide() cierra todos', () => {
    const { queryByText } = render(<ToastHost />)

    let first = 0
    act(() => {
      first = toast.show({ text: 'A' })
      toast.show({ text: 'B' })
      toast.show({ text: 'C' })
    })
    act(() => toast.hide(first))
    expect(queryByText('A')).toBeNull()
    expect(queryByText('B')).toBeTruthy()

    act(() => toast.hide())
    expect(queryByText('B')).toBeNull()
    expect(queryByText('C')).toBeNull()
  })

  it('separa las pilas de arriba y de abajo con sus offsets', () => {
    const { getByTestId } = render(<ToastHost bottomOffset={40} topOffset={120} />)

    act(() => {
      toast.show({ text: 'Arriba' })
      toast.show({ text: 'Abajo', position: 'bottom' })
    })

    const top = getByTestId('toast-stack-top')
    const bottom = getByTestId('toast-stack-bottom')
    expect(within(top).getByText('Arriba')).toBeTruthy()
    expect(within(bottom).getByText('Abajo')).toBeTruthy()
    expect(top).toHaveStyle({ top: 120 })
    expect(bottom).toHaveStyle({ bottom: 40 })
  })

  it('acepta className para el contenedor e iconSize para el ícono', () => {
    const { getByTestId, UNSAFE_getByType } = render(<ToastHost />)

    act(() => {
      toast.show({ text: 'Eliminado', withIcon: true, iconSize: 18, className: 'mx-padding-xl' })
    })

    const className = getByTestId('toast').props.className as string
    expect(className).toContain('mx-padding-xl')
    expect(className).not.toContain('mx-padding-4xl')
    expect(UNSAFE_getByType(Icon).props.size).toBe(18)
  })
})
