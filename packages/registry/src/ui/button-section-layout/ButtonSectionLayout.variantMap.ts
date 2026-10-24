import { FC } from 'react'

import {
  ActionSlotWithButton,
  HorizontalTwoButtons,
  HorizontalTwoButtonsFilters,
  VerticalPrimaryWithLinkPrompt,
  VerticalSingleButton,
  VerticalSingleButtonWithAmount,
  VerticalSingleButtonWithHeader,
  VerticalSingleButtonWithText,
  VerticalTwoButtons,
  VerticalTwoButtonsWithAmount,
  VerticalTwoButtonsWithSummary,
} from './ButtonSectionLayout.variants'
import { ButtonSectionProps, ButtonSectionVariant } from './ButtonSectionLayout.types'

export const VARIANT_MAP: Record<ButtonSectionVariant, FC<ButtonSectionProps>> = {
  verticalSingleButton: VerticalSingleButton,
  verticalSingleButtonWithAmount: VerticalSingleButtonWithAmount,
  verticalSingleButtonWithText: VerticalSingleButtonWithText,
  verticalTwoButtons: VerticalTwoButtons,
  verticalPrimaryWithLinkPrompt: VerticalPrimaryWithLinkPrompt,
  horizontalTwoButtons: HorizontalTwoButtons,
  horizontalTwoButtonsFilters: HorizontalTwoButtonsFilters,
  verticalTwoButtonsWithAmount: VerticalTwoButtonsWithAmount,
  verticalTwoButtonsWithSummary: VerticalTwoButtonsWithSummary,
  verticalSingleButtonWithHeader: VerticalSingleButtonWithHeader,
  actionSlotWithButton: ActionSlotWithButton,
}
