export type SelectMenuOption = {
  value: string
  label: string
}

export interface SelectMenuProps {
  options: SelectMenuOption[]
  value?: SelectMenuOption
  /** Default "Seleccioná una opción". */
  placeholder?: string
  onChange?: (option: SelectMenuOption) => void
  accessibilityLabel?: string
  accessibilityHint?: string
  className?: string
  testID?: string
}
