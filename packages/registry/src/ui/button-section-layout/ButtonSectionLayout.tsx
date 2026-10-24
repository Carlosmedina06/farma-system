import { VARIANT_MAP } from './ButtonSectionLayout.variantMap'
import { ButtonSectionProps } from './ButtonSectionLayout.types'

const ButtonSectionLayout = ({
  variant = 'verticalSingleButton',
  ...props
}: ButtonSectionProps) => {
  const Component = VARIANT_MAP[variant]

  return Component ? <Component {...props} variant={variant} /> : null
}

export default ButtonSectionLayout
