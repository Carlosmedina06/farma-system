import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** Le enseña a tailwind-merge los espaciados del theme (`px-padding-xl`, `gap-gap-sm`, `w-sm`, …). */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'none',
        'xxxs',
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        'xxl',
        'xxxl',
        (value: string) => /^(padding|gap|spacing)-/.test(value),
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
