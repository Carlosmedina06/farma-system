import { useCallback, useEffect, useState } from 'react'
import { mask, unMask } from 'react-native-mask-text'

import { InputProps } from './Input.types'

export const useInputMask = ({
  maskType,
  maskPattern,
  maskOptions,
  onChangeText,
  value,
}: Partial<InputProps>) => {
  const usingMask = !!(maskPattern || maskType)

  const getMaskedValue = useCallback(
    (value: string) => mask(value, maskPattern, maskType, maskOptions),
    [maskOptions, maskPattern, maskType],
  )

  const getUnMaskedValue = useCallback(
    (value: string) => unMask(value, maskType as 'custom' | 'currency'),
    [maskType],
  )

  const defaultValueCustom = ''
  const defaultValueCurrency = '0'

  const initialMaskedValue = getMaskedValue(
    maskType === 'currency' ? defaultValueCurrency : defaultValueCustom,
  )

  const initialUnMaskedValue = getUnMaskedValue(
    maskType === 'currency' ? defaultValueCurrency : defaultValueCustom,
  )

  const [maskedValue, setMaskedValue] = useState(initialMaskedValue)
  const [unMaskedValue, setUnMaskedValue] = useState(initialUnMaskedValue)
  const [isInitialRender, setIsInitialRender] = useState(true)

  function onChangeMask(value: string) {
    if (!usingMask) {
      return
    }

    const newUnMaskedValue = unMask(value, maskType as 'custom' | 'currency')
    const newMaskedValue = mask(newUnMaskedValue, maskPattern, maskType, maskOptions)

    setMaskedValue(newMaskedValue)
    setUnMaskedValue(newUnMaskedValue)
  }

  useEffect(() => {
    if (!usingMask) return
    if (isInitialRender) {
      setIsInitialRender(false)

      return
    }

    onChangeText?.(maskedValue, unMaskedValue)
  }, [maskedValue, unMaskedValue]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!usingMask) return
    if (value) {
      setMaskedValue(getMaskedValue(value))
      setUnMaskedValue(getUnMaskedValue(value))
    } else {
      setMaskedValue(initialMaskedValue)
      setUnMaskedValue(initialUnMaskedValue)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  return { maskedValue, onChangeMask, usingMask }
}
