import { createStore, useStore } from '@farma/registry/lib/store'

import { Modal } from './Modal'
import type { ModalProps } from './Modal.types'

export type ModalOptions = Omit<ModalProps, 'visible'>

const modalStore = createStore<ModalOptions | undefined>(undefined)

/**
 * Capa imperativa OPCIONAL sobre `<Modal>`. Montá `<ModalHost />` una vez en el root
 * y abrí modales desde cualquier lado con `modal.show({...})` o `useModal()`.
 * `<Modal visible ... />` sigue funcionando solo, sin host.
 */
export function ModalHost() {
  const options = useStore(modalStore)

  return (
    <Modal
      {...options}
      close={modal.hide}
      testID={options?.testID ?? 'modal'}
      visible={options !== undefined}
    />
  )
}

export const modal = {
  show(options: ModalOptions) {
    modalStore.set(options)
  },
  hide() {
    modalStore.set(undefined)
  },
  /** El modal abierto ahora mismo (o `undefined`). */
  get current() {
    return modalStore.get()
  },
}

/** Hook con la misma forma que el `useModal` de app-mobile. */
export function useModal() {
  return { showModal: modal.show, hideModal: modal.hide }
}

/** Para leer el modal abierto de forma reactiva. */
export function useCurrentModal() {
  return useStore(modalStore)
}
