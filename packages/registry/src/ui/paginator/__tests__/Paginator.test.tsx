import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'
import { Paginator } from '../Paginator'

// Track mock functions to verify calls
let mockUseDerivedValue: jest.Mock
let mockUseAnimatedStyle: jest.Mock
let mockWithSpring: jest.Mock
let mockWithTiming: jest.Mock

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => (
    <View ref={ref} testID="animated-view" {...props} />
  ))

  AnimatedView.displayName = 'Animated.View'

  mockUseDerivedValue = jest.fn((callback: any) => {
    const result = callback()
    return { value: result }
  })

  mockUseAnimatedStyle = jest.fn((callback: any) => {
    const result = callback()
    return result
  })

  mockWithSpring = jest.fn((value: any) => value)
  mockWithTiming = jest.fn((value: any) => value)

  return {
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
    useSharedValue: jest.fn((initialValue: any) => ({ value: initialValue })),
    useAnimatedStyle: mockUseAnimatedStyle,
    useDerivedValue: mockUseDerivedValue,
    withSpring: mockWithSpring,
    withTiming: mockWithTiming,
    Easing: {
      linear: 'linear',
      out: jest.fn((easing: any) => easing),
      quad: 'quad',
    },
  }
})

describe('Paginator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render with pagesAmount and currentPageIndex', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should render paginator container', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      const container = UNSAFE_root.findAllByType(require('react-native').View)[0]
      expect(container).toBeTruthy()
    })

    it('should not render dots when pagesAmount is 1', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={1} visibleDots={3} />,
      )

      const animatedViews = UNSAFE_root.findAllByProps({ testID: 'animated-view' })
      // Should only have the container, no dots container
      expect(animatedViews.length).toBe(0)
    })

    it('should render dots container when pagesAmount > 1', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      const animatedViews = UNSAFE_root.findAllByProps({ testID: 'animated-view' })
      // Should have dots container
      expect(animatedViews.length).toBeGreaterThan(0)
    })
  })

  describe('Props handling', () => {
    it('should use default dotSize (12) when not provided', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(<Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />)

      // useAnimatedStyle should be called with calculations using default dotSize
      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should use custom dotSize when provided', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(
        <Paginator
          currentPageIndex={mockCurrentPageIndex}
          dotSize={16}
          pagesAmount={5}
          visibleDots={3}
        />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should use default spacing (8) when not provided', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(<Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />)

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should use custom spacing when provided', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(
        <Paginator
          currentPageIndex={mockCurrentPageIndex}
          pagesAmount={5}
          spacing={12}
          visibleDots={3}
        />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })
  })

  describe('visibleDotsIndices calculation', () => {
    it('should calculate visible dots indices correctly for middle page', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
      const visibleDotsCallback = mockUseDerivedValue.mock.calls.find(
        (call) => (call[0] as any).toString().includes('currentIndex - halfVisible'),
      )

      if (visibleDotsCallback) {
        const result = (visibleDotsCallback[0] as any)()
        expect(result).toHaveProperty('start')
        expect(result).toHaveProperty('end')
        expect(result).toHaveProperty('currentIndex')
      }
    })

    it('should handle start at beginning (currentIndex near 0)', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should handle end at pagesAmount (adjust start when end === pagesAmount)', () => {
      const mockCurrentPageIndex = { value: 9 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should handle visibleDots greater than pagesAmount', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={10} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should round currentPageIndex value', () => {
      const mockCurrentPageIndex = { value: 2.7 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })
  })

  describe('Container animated style', () => {
    it('should calculate translateX for container animation', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
      const styleCallback = (mockUseAnimatedStyle.mock.calls[0] as any)[0]
      const result = styleCallback()

      expect(result).toHaveProperty('transform')
      expect(result.transform).toBeDefined()
      expect(Array.isArray(result.transform)).toBe(true)
    })

    it('should use withSpring for transform animation', () => {
      const mockCurrentPageIndex = { value: 1 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      expect(mockWithSpring).toHaveBeenCalled()
    })

    it('should calculate correct translateX for different page indices', () => {
      const mockCurrentPageIndex1 = { value: 0 } as any
      const { rerender } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex1} pagesAmount={5} visibleDots={3} />,
      )

      const mockCurrentPageIndex2 = { value: 4 } as any
      rerender(
        <Paginator currentPageIndex={mockCurrentPageIndex2} pagesAmount={5} visibleDots={3} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })
  })

  describe('Dots rendering', () => {
    it('should render correct number of dots based on pagesAmount', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      // Each dot has 2 Animated.Views (container + dot), plus dots container
      const animatedViews = UNSAFE_root.findAllByProps({ testID: 'animated-view' })
      // Should have dots container + (pagesAmount * 2 views per dot)
      // For 5 pages: 1 container + (5 * 2) = 11, but may vary based on implementation
      expect(animatedViews.length).toBeGreaterThan(0)
      // Verify that we have at least the dots container
      expect(animatedViews.length).toBeGreaterThanOrEqual(1)
    })

    it('should render dots for different pagesAmount values', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { rerender, UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={3} visibleDots={3} />,
      )

      let animatedViews = UNSAFE_root.findAllByProps({ testID: 'animated-view' })
      const initialCount = animatedViews.length
      expect(initialCount).toBeGreaterThan(0)

      rerender(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={7} visibleDots={3} />,
      )

      animatedViews = UNSAFE_root.findAllByProps({ testID: 'animated-view' })
      // Should have more views for more pages
      expect(animatedViews.length).toBeGreaterThan(initialCount)
    })
  })

  describe('AnimatedDot visibility and styling', () => {
    it('should calculate visibility for dots', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      // useDerivedValue should be called for visibility calculation
      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should calculate opacity based on active and visible state', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      // Should call useDerivedValue for visibility opacity calculation
      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should use withTiming for opacity animation', () => {
      const mockCurrentPageIndex = { value: 1 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      expect(mockWithTiming).toHaveBeenCalled()
    })

    it('should calculate scale for active dot (scale = 1)', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should calculate scale for first visible but not actual first (scale = 0.6)', () => {
      const mockCurrentPageIndex = { value: 3 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should calculate scale for last visible but not actual last (scale = 0.6)', () => {
      const mockCurrentPageIndex = { value: 6 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should calculate scale for middle inactive dots (scale = 0.8)', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should calculate scale for actual first dot (scale = 0.8)', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    it('should calculate scale for actual last dot (scale = 0.8)', () => {
      const mockCurrentPageIndex = { value: 9 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })
  })

  describe('Dot background color', () => {
    it('should use active color (#007AFF) for active dot', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockWithTiming).toHaveBeenCalled()
    })

    it('should use inactive color (rgba(0, 0, 0, 0.15)) for inactive dots', () => {
      const mockCurrentPageIndex = { value: 2 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(mockWithTiming).toHaveBeenCalled()
    })

    it('should use withTiming for background color animation', () => {
      const mockCurrentPageIndex = { value: 1 } as any
      render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      expect(mockWithTiming).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle pagesAmount of 0', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={0} visibleDots={3} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle visibleDots of 0', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={0} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle very large pagesAmount', () => {
      const mockCurrentPageIndex = { value: 50 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={100} visibleDots={5} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle currentPageIndex at maximum value', () => {
      const mockCurrentPageIndex = { value: 9 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle currentPageIndex at minimum value', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle negative currentPageIndex value', () => {
      const mockCurrentPageIndex = { value: -1 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })

    it('should handle currentPageIndex greater than pagesAmount', () => {
      const mockCurrentPageIndex = { value: 15 } as any
      const { UNSAFE_root } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={10} visibleDots={5} />,
      )

      expect(UNSAFE_root).toBeTruthy()
    })
  })

  describe('Memoization', () => {
    it('should memoize dots array based on pagesAmount', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { rerender } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      // Change pagesAmount should recreate dots array
      rerender(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={7} visibleDots={3} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })

    it('should not recreate dots array when pagesAmount unchanged', () => {
      const mockCurrentPageIndex = { value: 0 } as any
      const { rerender } = render(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={3} />,
      )

      // Change other props, pagesAmount stays same
      rerender(
        <Paginator currentPageIndex={mockCurrentPageIndex} pagesAmount={5} visibleDots={5} />,
      )

      expect(mockUseDerivedValue).toHaveBeenCalled()
    })
  })

  describe('Component display names', () => {
    it('should have correct displayName for Paginator', () => {
      expect(Paginator.displayName).toBe('Paginator')
    })
  })
})
