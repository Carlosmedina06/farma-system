/** "informe.final.pdf" → "informe.final"; nombres sin extensión (o dotfiles) se devuelven tal cual. */
export const getFileNameWithoutExtension = (fileName?: string): string => {
  if (!fileName) return ''

  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex <= 0) return fileName

  return fileName.slice(0, lastDotIndex)
}

export const getFileExtension = (fileName?: string) =>
  fileName?.includes('.') ? fileName.split('.').pop()?.toLowerCase() : undefined
