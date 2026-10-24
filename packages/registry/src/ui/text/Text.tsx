import { Text as RNText, type TextProps as RNTextProps } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'
import { type ClassValue } from 'clsx'
import { cn } from '@farma/registry/lib/utils'

const textVariants = tv({
  base: 'text-gray-800 font-normal',
  variants: {
    type: {
      h1: 'text-[24px] leading-[32px] font-semibold',
      h2: 'text-[20px] leading-[24px] font-semibold',
      h3: 'text-[18px] leading-[24px] font-semibold',
      h4: 'text-[16px] leading-[20px] font-semibold',
      blue: 'text-primary-600 text-[16px] leading-[20px] font-semibold',
      gray: 'text-gray-400 text-[16px] leading-[20px] font-normal',
      semiGray: 'text-gray-600 text-[16px] leading-[20px] font-normal',
      body1: 'text-[16px] leading-[24px]',
      body2: 'text-[14px] leading-[20px]',
      caption: 'text-[12px] leading-[16px]',
      'mono-lg': 'text-[16px] tracking-[2.4px]',
      'mono-sm': 'text-[12px] tracking-[0.6px]',
      navbar: 'text-[10px] leading-[14px]',
      price: 'text-[24px] leading-[28px] font-normal',
    },
    semibold: {
      true: 'font-semibold',
      false: '',
    },
  },
  defaultVariants: {
    type: 'body1',
    semibold: false,
  },
})

export interface TextProps
  extends Omit<RNTextProps, 'className'>, Omit<VariantProps<typeof textVariants>, 'semibold'> {
  semibold?: boolean
  className?: ClassValue
}

export default function Text({
  type = 'body1',
  semibold = false,
  className,
  style,
  children,
  allowFontScaling = false,
  maxFontSizeMultiplier = 1,
  ...props
}: TextProps) {
  const shouldApplySemibold =
    semibold && !['h1', 'h2', 'h3', 'h4', 'blue'].includes(type ?? 'body1')

  const fontFamily = (() => {
    if (type && ['mono-lg', 'mono-sm'].includes(type)) {
      return { fontFamily: 'Manrope-SemiBold' }
    }

    if (semibold || (type && ['h1', 'h2', 'h3', 'blue'].includes(type))) {
      return { fontFamily: 'Inter-SemiBold' }
    }

    return { fontFamily: 'Inter-Regular' }
  })()

  return (
    <RNText
      allowFontScaling={allowFontScaling}
      className={cn(textVariants({ type, semibold: shouldApplySemibold }), className)}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={props.numberOfLines}
      style={[fontFamily, style]}
      {...props}
    >
      {children}
    </RNText>
  )
}
