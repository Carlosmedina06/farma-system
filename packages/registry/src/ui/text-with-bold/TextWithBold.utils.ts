export const regexBoldText = /^\*\*[a-zA-ZÀ-ÿ\s.,\d]+\*\*+$/

export const findBoldText = (text: string): boolean => regexBoldText.test(text)

export const removeBoldSimbol = (text: string): string => text.replaceAll('**', '')

export const splitBoldText = (text: string): string[] =>
  text?.includes('#**') || text?.includes('**#') ? text.split('#').filter((item) => item) : text.split(' ')

export const splitRegularText = (text: string): string[] => text?.split(' ').filter((item) => item)
