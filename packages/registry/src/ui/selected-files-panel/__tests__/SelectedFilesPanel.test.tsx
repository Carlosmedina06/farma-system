import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { getFileExtension, getFileNameWithoutExtension } from '../files'
import SelectedFilesPanel from '../SelectedFilesPanel'
import type { SelectedFile } from '../SelectedFilesPanel.types'

jest.mock('@farma/registry/ui/animated-layout', () => {
  const { View } = require('react-native')

  return { AnimatedLayout: ({ children }: any) => <View>{children}</View> }
})

jest.mock('@farma/registry/ui/shimmer-skeleton', () => {
  const { View } = require('react-native')

  return { ShimmerSkeleton: () => <View /> }
})

jest.mock('@farma/registry/ui/spinner', () => {
  const { View } = require('react-native')

  return { Spinner: () => <View testID="button-spinner" /> }
})

const file = (fileName: string, type = 'application/pdf'): SelectedFile => ({
  data: { uri: `file:///${fileName}`, type },
  fileName,
})

const mockOnRemoveFile = jest.fn()
const mockOnProcess = jest.fn()

describe('SelectedFilesPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render file names without extension and the default process label', () => {
    const { getByText, queryByText } = render(
      <SelectedFilesPanel files={[file('Documento A.pdf')]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )

    expect(getByText('Documento A')).toBeTruthy()
    expect(queryByText('Documento A.pdf')).toBeNull()
    expect(getByText('Continuar')).toBeTruthy()
  })

  it('should render a custom process label', () => {
    const { getByText } = render(
      <SelectedFilesPanel
        files={[file('a.pdf')]}
        processLabel="Procesar receta"
        onProcess={mockOnProcess}
        onRemoveFile={mockOnRemoveFile}
      />,
    )

    expect(getByText('Procesar receta')).toBeTruthy()
  })

  it('should ellipsize long file names in a single line', () => {
    const { getByTestId } = render(
      <SelectedFilesPanel files={[file('Archivo muy largo.pdf')]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )
    const fileName = getByTestId('selected-files-panel-preview-name-0')

    expect(fileName.props.numberOfLines).toBe(1)
    expect(fileName.props.ellipsizeMode).toBe('tail')
  })

  it('should render a thumbnail per file type', () => {
    const { getByTestId } = render(
      <SelectedFilesPanel
        files={[file('a.pdf'), file('b.JPG', 'image/jpeg'), file('c.docx', 'application/msword')]}
        onProcess={mockOnProcess}
        onRemoveFile={mockOnRemoveFile}
      />,
    )

    expect(getByTestId('selected-files-panel-preview-thumb-0-pdf')).toBeTruthy()
    expect(getByTestId('selected-files-panel-preview-thumb-1-image')).toBeTruthy()
    expect(getByTestId('selected-files-panel-preview-thumb-2-generic')).toBeTruthy()
  })

  it('should call onProcess when the process button is pressed', () => {
    const { getByTestId } = render(
      <SelectedFilesPanel files={[file('a.pdf')]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )

    fireEvent.press(getByTestId('selected-files-panel-process'))

    expect(mockOnProcess).toHaveBeenCalledTimes(1)
  })

  it('should call onRemoveFile with the file index and use the default a11y label', () => {
    const { getByTestId, getByLabelText } = render(
      <SelectedFilesPanel files={[file('a.pdf'), file('b.pdf')]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )

    expect(getByLabelText('Quitar b')).toBeTruthy()
    fireEvent.press(getByTestId('selected-files-panel-preview-delete-1'))

    expect(mockOnRemoveFile).toHaveBeenCalledWith(1)
  })

  it('should allow overriding the remove a11y label', () => {
    const { getByLabelText } = render(
      <SelectedFilesPanel
        files={[file('a.pdf')]}
        getRemoveAccessibilityLabel={(name) => `Remove ${name}`}
        onProcess={mockOnProcess}
        onRemoveFile={mockOnRemoveFile}
      />,
    )

    expect(getByLabelText('Remove a')).toBeTruthy()
  })

  it('should show a skeleton and disable processing when a file is loading', () => {
    const { getByTestId } = render(
      <SelectedFilesPanel isLoading files={[]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )

    expect(getByTestId('selected-files-panel-preview-skeleton')).toBeTruthy()
    expect(getByTestId('selected-files-panel-process').props.accessibilityState?.disabled).toBe(true)
  })

  it('should show the button spinner when processing', () => {
    const { getByTestId } = render(
      <SelectedFilesPanel isProcessing files={[file('a.pdf')]} onProcess={mockOnProcess} onRemoveFile={mockOnRemoveFile} />,
    )

    expect(getByTestId('button-spinner')).toBeTruthy()
  })
})

describe('files helpers', () => {
  it('should strip the extension', () => {
    expect(getFileNameWithoutExtension('a.b.pdf')).toBe('a.b')
    expect(getFileNameWithoutExtension('.env')).toBe('.env')
    expect(getFileNameWithoutExtension('noext')).toBe('noext')
    expect(getFileNameWithoutExtension(undefined)).toBe('')
  })

  it('should return the lowercase extension', () => {
    expect(getFileExtension('photo.JPG')).toBe('jpg')
    expect(getFileExtension('noext')).toBeUndefined()
  })
})
