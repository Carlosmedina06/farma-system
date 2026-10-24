import type { ButtonSectionProps } from './ButtonSectionLayout.types'

export const defaultFormatAmount = (value: number): string => value.toLocaleString('es-AR')

const toNumber = (amountValue: ButtonSectionProps['amountValue']): number =>
  typeof amountValue === 'number' || typeof amountValue === 'string' ? Number(amountValue) : NaN

const shouldShowAmount = (amountValue: ButtonSectionProps['amountValue']): boolean => {
  const value = toNumber(amountValue)

  return !Number.isNaN(value) && value > 0
}

/** `true` si el monto es numérico y > 0, o exactamente `0`. */
export const showFormattedOrZero = (amountValue: ButtonSectionProps['amountValue']): boolean =>
  shouldShowAmount(amountValue) || amountValue === 0

export const formatAmountValue = (
  amountValue: ButtonSectionProps['amountValue'],
  formatAmount: (value: number) => string = defaultFormatAmount,
): string => formatAmount(toNumber(amountValue))
