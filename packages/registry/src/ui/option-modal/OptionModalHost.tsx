import { createStore, useStore } from '@farma/registry/lib/store'

import { OptionModal } from './OptionModal'
import type { ModalOption, OptionModalProps } from './OptionModal.types'

export type OptionModalOptions = Omit<OptionModalProps, 'visible' | 'selectedOption' | 'onSelectOption'>

const modalStore = createStore<OptionModalOptions | undefined>(undefined)
const selectionStore = createStore<ModalOption | undefined>(undefined)

/**
 * Capa imperativa OPCIONAL sobre `<OptionModal>`. Montá `<OptionModalHost />` una vez
 * y usá `optionModal.show()` / `useOptionModal()`.
 */
export function OptionModalHost() {
  const options = useStore(modalStore)
  const selectedOption = useStore(selectionStore)

  return (
    <OptionModal
      {...options}
      close={optionModal.hide}
      selectedOption={selectedOption}
      visible={options !== undefined}
      onSelectOption={selectionStore.set}
    />
  )
}

export const optionModal = {
  show(options: OptionModalOptions) {
    selectionStore.set(undefined)
    modalStore.set(options)
  },
  hide() {
    modalStore.set(undefined)
    selectionStore.set(undefined)
  },
  get selectedOption() {
    return selectionStore.get()
  },
}

/** Misma forma que el `useModalWithOptions` de app-mobile. */
export function useOptionModal() {
  const selectedOption = useStore(selectionStore)
  return { showModal: optionModal.show, hideModal: optionModal.hide, selectedOption }
}
