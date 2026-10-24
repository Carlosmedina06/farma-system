import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { Progress } from '../Progress'

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, ...props }: any) {
    return <Text {...props}>{children}</Text>
  }
})()
  return { Text: mod?.default ?? mod }
})

describe('Progress', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<Progress progress={50} testID="progress" />)

    expect(getByTestId('progress')).toBeTruthy()
  })

  it('should render with label when withLabel is true', () => {
    const { getByText } = render(<Progress withLabel progress={75} testID="progress" />)

    expect(getByText('75%')).toBeTruthy()
  })

  it('should render without label when withLabel is false', () => {
    const { queryByText, getByTestId } = render(
      <Progress progress={50} testID="progress" withLabel={false} />,
    )

    expect(getByTestId('progress')).toBeTruthy()
    expect(queryByText('50%')).toBeNull()
  })

  it('should render with right direction', () => {
    const { getByTestId } = render(<Progress direction="right" progress={50} testID="progress" />)

    expect(getByTestId('progress')).toBeTruthy()
  })

  it('should render with bottom direction', () => {
    const { getByTestId } = render(<Progress direction="bottom" progress={50} testID="progress" />)

    expect(getByTestId('progress')).toBeTruthy()
  })

  it('should render with different progress values', () => {
    const progressValues = [0, 25, 50, 75, 100]

    progressValues.forEach((progress) => {
      const { getByTestId, unmount } = render(<Progress progress={progress} testID="progress" />)

      expect(getByTestId('progress')).toBeTruthy()
      unmount()
    })
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Progress className="custom-class" progress={50} testID="progress" />,
    )

    expect(getByTestId('progress')).toBeTruthy()
  })
})
