export type SelectedFile = {
  fileName: string
  data: { uri: string; type?: string }
}

export type SelectedFilesPreviewProps = {
  files: SelectedFile[]
  isLoading?: boolean
  onRemoveFile: (index: number) => void
  /** a11y del botón de quitar; recibe el nombre sin extensión. Default `Quitar {nombre}`. */
  getRemoveAccessibilityLabel?: (fileName: string) => string
  className?: string
  testID?: string
}

export type SelectedFilesPanelProps = {
  files: SelectedFile[]
  isLoading?: boolean
  isProcessing?: boolean
  /** Texto del botón principal. Default "Continuar". */
  processLabel?: string
  onRemoveFile: (index: number) => void
  onProcess: () => void
  getRemoveAccessibilityLabel?: (fileName: string) => string
  className?: string
  testID?: string
}
