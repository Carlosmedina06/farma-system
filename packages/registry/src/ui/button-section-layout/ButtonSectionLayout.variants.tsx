import { FC } from 'react'
import { View } from 'react-native'
import { getHP } from '@farma/registry/lib/dimensions'
import { cn } from '@farma/registry/lib/utils'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { Button } from '@farma/registry/ui/button'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { AmountRow, LinkPromptRow, TwoButtonsVertical } from './ButtonSectionLayout.parts'
import { ButtonSectionProps } from './ButtonSectionLayout.types'
import { formatAmountValue, showFormattedOrZero } from './ButtonSectionLayout.utils'

const ACTION_ROW_MIN_HEIGHT = 52

/** Props que no deben llegar al `View` contenedor. */
type LayoutOnlyProps =
  | 'variant'
  | 'orientation'
  | 'amountText'
  | 'amountCaption'
  | 'amountValue'
  | 'formatAmount'
  | 'amountLabel'
  | 'primaryButton'
  | 'secondaryButton'
  | 'promptText'
  | 'headerTitle'
  | 'headerCaption'
  | 'headerIcon'
  | 'renderAction'
  | 'isLoading'

const viewProps = (props: ButtonSectionProps) => {
  const {
    variant: _variant,
    orientation: _orientation,
    amountText: _amountText,
    amountCaption: _amountCaption,
    amountValue: _amountValue,
    formatAmount: _formatAmount,
    amountLabel: _amountLabel,
    primaryButton: _primaryButton,
    secondaryButton: _secondaryButton,
    promptText: _promptText,
    headerTitle: _headerTitle,
    headerCaption: _headerCaption,
    headerIcon: _headerIcon,
    renderAction: _renderAction,
    isLoading: _isLoading,
    className: _className,
    testID: _testID,
    ...rest
  } = props

  return rest as Omit<ButtonSectionProps, LayoutOnlyProps | 'className' | 'testID'>
}

export const VerticalSingleButton: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, className, testID = 'button-section' } = props

  return (
    <View className={cn('bg-base-white', className)} testID={testID} {...viewProps(props)}>
      {primaryButton && (
        <Button
          {...primaryButton}
          full
          testID={primaryButton.testID ?? `${testID}-primary-button`}
        />
      )}
    </View>
  )
}

export const VerticalSingleButtonWithAmount: FC<ButtonSectionProps> = (props) => {
  const { amountText, amountValue, formatAmount, primaryButton, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View className={cn('bg-base-white', className)} testID={testID} {...viewProps(props)}>
      <View className="flex-row justify-between">
        {amountText ? (
          <Text semibold type="body1">
            {amountText}
          </Text>
        ) : null}
        {showFormattedOrZero(amountValue) ? (
          <Text semibold type="body1">
            {formatAmountValue(amountValue, formatAmount)}
          </Text>
        ) : null}
      </View>
      {primaryButton && (
        <Button {...primaryButton} testID={primaryButton.testID ?? `${testID}-primary-button`} />
      )}
    </View>
  )
}

export const VerticalSingleButtonWithText: FC<ButtonSectionProps> = (props) => {
  const { amountLabel = 'Total', amountText, primaryButton, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View className={cn('bg-base-white', className)} testID={testID} {...viewProps(props)}>
      <View className="flex-row justify-between">
        {amountLabel ? (
          <Text semibold type="body1">
            {amountLabel}
          </Text>
        ) : null}
        {amountText ? (
          <Text semibold type="body1">
            {amountText}
          </Text>
        ) : null}
      </View>
      {primaryButton && (
        <Button {...primaryButton} testID={primaryButton.testID ?? `${testID}-primary-button`} />
      )}
    </View>
  )
}

export const VerticalTwoButtons: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, secondaryButton, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View className={cn('bg-base-white', className)} testID={testID} {...viewProps(props)}>
      <TwoButtonsVertical
        full
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        testID={testID}
      />
    </View>
  )
}

export const VerticalPrimaryWithLinkPrompt: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, secondaryButton, promptText, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View className={cn('bg-base-white gap-2', className)} testID={testID} {...viewProps(props)}>
      {primaryButton ? (
        <Button
          {...primaryButton}
          full
          testID={primaryButton.testID ?? `${testID}-primary-button`}
        />
      ) : null}
      {secondaryButton ? (
        <LinkPromptRow
          disabled={secondaryButton.disabled}
          linkText={secondaryButton.children}
          promptText={promptText}
          testID={secondaryButton.testID ?? `${testID}-link-prompt`}
          onPress={secondaryButton.onPress}
        />
      ) : null}
    </View>
  )
}

export const HorizontalTwoButtons: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, secondaryButton, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View
      className={cn('bg-base-white w-full gap-4', className)}
      style={{ marginBottom: getHP(1), paddingHorizontal: 24, paddingVertical: 24 }}
      testID={testID}
      {...viewProps(props)}
    >
      <View className="flex-row justify-between">
        {[secondaryButton, primaryButton].map((button, index) =>
          button ? (
            <Button
              key={button.id ?? `secondary-primary-${index}`}
              {...button}
              testID={button.testID ?? `${testID}-${index === 0 ? 'secondary' : 'primary'}-button`}
            />
          ) : null,
        )}
      </View>
    </View>
  )
}

export const HorizontalTwoButtonsFilters: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, secondaryButton, className } = props
  const testID = props.testID ?? 'button-section'

  return (
    <View
      className={cn('bg-base-white w-full', className)}
      style={{ paddingHorizontal: 24, paddingVertical: 24 }}
      testID={testID}
      {...viewProps(props)}
    >
      <View className="gap-gap-xs flex-row items-center justify-between">
        {secondaryButton && (
          <View style={{ width: '45%' }}>
            <Button
              {...secondaryButton}
              full
              testID={secondaryButton.testID ?? `${testID}-secondary-button`}
            />
          </View>
        )}
        {primaryButton && (
          <View style={{ width: '45%' }}>
            <Button
              {...primaryButton}
              full
              testID={primaryButton.testID ?? `${testID}-primary-button`}
            />
          </View>
        )}
      </View>
    </View>
  )
}

export const VerticalTwoButtonsWithAmount: FC<ButtonSectionProps> = (props) => (
  <View className={cn('bg-base-white', props.className)} testID={props.testID} {...viewProps(props)}>
    <AmountRow
      amountText={props.amountText}
      amountValue={props.amountValue}
      formatAmount={props.formatAmount}
      isLoading={props.isLoading}
    />
    <TwoButtonsVertical
      primaryButton={props.primaryButton}
      secondaryButton={props.secondaryButton}
      testID={props.testID}
    />
  </View>
)

export const VerticalTwoButtonsWithSummary: FC<ButtonSectionProps> = (props) => (
  <View className={cn('bg-base-white', props.className)} testID={props.testID} {...viewProps(props)}>
    <AmountRow
      fallbackToRaw
      amountText={props.amountText}
      amountValue={props.amountValue}
      formatAmount={props.formatAmount}
      isLoading={props.isLoading}
    />
    <TwoButtonsVertical
      primaryButton={props.primaryButton}
      secondaryButton={props.secondaryButton}
      testID={props.testID}
    />
  </View>
)

export const VerticalSingleButtonWithHeader: FC<ButtonSectionProps> = (props) => {
  const { primaryButton, secondaryButton, headerTitle, headerCaption, headerIcon, className } =
    props
  const testID = props.testID ?? 'button-section'

  return (
    <AnimatedLayout>
      <View className={cn('bg-base-white', className)} testID={testID} {...viewProps(props)}>
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-1 flex-row items-center gap-3">
            {headerIcon ? <Icon name={headerIcon} size={20} /> : null}
            <View className="w-[90%] gap-1">
              {headerTitle ? (
                <Text semibold type="body1">
                  {headerTitle}
                </Text>
              ) : null}
              {headerCaption ? <Text type="body2">{headerCaption}</Text> : null}
            </View>
          </View>
          {secondaryButton && (
            <Button
              {...secondaryButton}
              testID={secondaryButton.testID ?? `${testID}-secondary-button`}
            >
              {secondaryButton.children}
            </Button>
          )}
        </View>
        {primaryButton && (
          <Button
            {...primaryButton}
            full
            className="px-6 py-3"
            testID={primaryButton.testID ?? `${testID}-primary-button`}
          />
        )}
      </View>
    </AnimatedLayout>
  )
}

export const ActionSlotWithButton: FC<ButtonSectionProps> = (props) => {
  const { amountText, amountCaption, amountValue, primaryButton, renderAction, className } = props
  const testID = props.testID ?? 'button-section'
  const actionRowHeight = Math.max(getHP(6), ACTION_ROW_MIN_HEIGHT)
  const hasAmountValue = amountValue != null && amountValue !== '' && amountValue !== false
  const isTextValue = typeof amountValue === 'string' || typeof amountValue === 'number'

  return (
    <View
      className={cn('bg-base-white justify-between', className)}
      style={{ minHeight: getHP(14) }}
      testID={testID}
      {...viewProps(props)}
    >
      <View
        className="gap-gap-sm flex-row items-start justify-between pb-4"
        style={{ marginBottom: getHP(0.7) }}
      >
        <View className="min-w-0 flex-1 gap-1">
          {amountText ? (
            <Text semibold type="body2">
              {amountText}
            </Text>
          ) : null}
          {amountCaption ? <Text type="caption">{amountCaption}</Text> : null}
        </View>
        {hasAmountValue ? (
          <View className="pl-padding-xs shrink-0 items-end justify-start">
            {isTextValue ? (
              <Text semibold type="body1">
                {amountValue}
              </Text>
            ) : (
              amountValue
            )}
          </View>
        ) : null}
      </View>
      <View className="flex-row items-stretch gap-2" style={{ height: actionRowHeight }}>
        {renderAction ? (
          <View
            style={{ width: '35%', minHeight: actionRowHeight }}
            testID={`${testID}-action-slot`}
          >
            {renderAction({ height: actionRowHeight })}
          </View>
        ) : null}
        {primaryButton ? (
          <Button
            {...primaryButton}
            className={cn('min-h-0 flex-1 justify-center py-0', primaryButton.className)}
            style={{ height: actionRowHeight, minHeight: actionRowHeight }}
            testID={primaryButton.testID ?? `${testID}-primary-button`}
          />
        ) : null}
      </View>
    </View>
  )
}
