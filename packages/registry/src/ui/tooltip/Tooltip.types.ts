import { ReactNode } from 'react'

export interface TooltipProps {
  children: ReactNode
  close?: boolean
  supportingText?: string
  text: string
  className?: string
  testID?: string
}

export interface ElementDistance {
  distanceFromRight: number
  distanceFromLeft: number
}
