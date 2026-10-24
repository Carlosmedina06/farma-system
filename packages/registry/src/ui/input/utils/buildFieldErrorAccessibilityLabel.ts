export const buildFieldErrorAccessibilityLabel = (
  fieldName: string,
  errorMessage: string,
): string => {
  const trimmedFieldName = fieldName.trim()
  const trimmedErrorMessage = errorMessage.trim()

  if (!trimmedFieldName) {
    return `error, ${trimmedErrorMessage}`
  }

  return `${trimmedFieldName}, error, ${trimmedErrorMessage}`
}
