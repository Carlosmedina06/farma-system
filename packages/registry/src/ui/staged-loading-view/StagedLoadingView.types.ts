export interface LoadingStage {
  title: string
  description: string
  /** Progreso orientativo de la etapa (0–100). No lo usa el componente; útil para el que orquesta. */
  progress: number
}

export interface StagedLoadingViewProps {
  steps: LoadingStage[]
  activeStepIndex: number
  /** Progreso de la barra (0–100). */
  progress: number
  /** Reemplaza las clases del contenedor. Default `p-padding-lg justify-center gap-0`. */
  className?: string
  /** Fondo de la pantalla. Default `bg-primary-25`. */
  backgroundClassName?: string
  testID?: string
}
