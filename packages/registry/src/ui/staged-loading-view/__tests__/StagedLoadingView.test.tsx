import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import StagedLoadingView from '../StagedLoadingView'
import type { LoadingStage } from '../StagedLoadingView.types'

jest.mock('@farma/registry/ui/screen-layout', () => {
  const { View } = require('react-native')

  return {
    FULL_SCREEN_EDGES: ['top', 'bottom', 'left', 'right'],
    ScreenLayout: ({ children, testID, backgroundClassName }: any) => (
      <View backgroundClassName={backgroundClassName} testID={testID ?? 'screen-layout'}>
        {children}
      </View>
    ),
  }
})

jest.mock('@farma/registry/ui/animated-layout', () => {
  const { View } = require('react-native')

  return { AnimatedLayout: ({ children }: any) => <View>{children}</View> }
})

jest.mock('@farma/registry/ui/progress', () => {
  const { View } = require('react-native')

  return { SteppedProgressBar: ({ progress }: any) => <View progress={progress} testID="stepped-progress-bar" /> }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return { Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text> }
})

const steps: LoadingStage[] = [
  { title: 'Buscando información', description: 'Esperá unos instantes...', progress: 33 },
  { title: 'Analizando', description: 'Sólo unos segundos más', progress: 66 },
  { title: 'Terminando', description: 'En breve vas a poder continuar', progress: 100 },
]

describe('StagedLoadingView', () => {
  it('should render the active stage title and description', () => {
    const { getByText } = render(<StagedLoadingView activeStepIndex={0} progress={35} steps={steps} />)

    expect(getByText('Buscando información')).toBeTruthy()
    expect(getByText('Esperá unos instantes...')).toBeTruthy()
  })

  it('should always render stepped progress bar with the given progress', () => {
    const { getByTestId } = render(<StagedLoadingView activeStepIndex={0} progress={35} steps={steps} />)

    expect(getByTestId('stepped-progress-bar').props.progress).toBe(35)
  })

  it('should clamp the active step index', () => {
    const { getByText, rerender } = render(<StagedLoadingView activeStepIndex={10} progress={100} steps={steps} />)

    expect(getByText('Terminando')).toBeTruthy()

    rerender(<StagedLoadingView activeStepIndex={-3} progress={0} steps={steps} />)

    expect(getByText('Buscando información')).toBeTruthy()
  })

  it('should render nothing without steps', () => {
    const { toJSON } = render(<StagedLoadingView activeStepIndex={0} progress={0} steps={[]} />)

    expect(toJSON()).toBeNull()
  })

  it('should forward a custom background class', () => {
    const { getByTestId } = render(
      <StagedLoadingView activeStepIndex={0} backgroundClassName="bg-white" progress={0} steps={steps} />,
    )

    expect(getByTestId('staged-loading-view').props.backgroundClassName).toBe('bg-white')
  })
})
