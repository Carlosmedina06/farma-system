const React = require('react')
const { FlatList, Image, ScrollView, Text, View } = require('react-native')

const asAnimated = (Component) =>
  React.forwardRef((props, ref) =>
    React.createElement(Component, {
      ...props,
      ref,
      style: props.style == null ? undefined : [].concat(props.style),
    }),
  )

const chain = () => {
  const fn = () => chain()

  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === 'then') return undefined

      return chain()
    },
    apply() {
      return chain()
    },
  })
}

const shared = (initial) => {
  const value = {
    value: initial,
    __isSharedValue: true,
    get: () => value.value,
    set: (next) => {
      value.value = next
    },
    addListener: () => {},
    removeListener: () => {},
  }

  return value
}

const Animated = {
  View: asAnimated(View),
  Text: asAnimated(Text),
  Image: asAnimated(Image),
  ScrollView: asAnimated(ScrollView),
  FlatList: asAnimated(FlatList),
  createAnimatedComponent: asAnimated,
  call: () => {},
}

const reanimated = {
  __esModule: true,
  default: Animated,
  Animated,
  createAnimatedComponent: Animated.createAnimatedComponent,
  useReducedMotion: () => false,
  useSharedValue: (initial) => {
    const ref = React.useRef(null)

    if (ref.current == null) ref.current = shared(initial)

    return ref.current
  },
  useAnimatedStyle: (updater) => (typeof updater === 'function' ? updater() : {}),
  useAnimatedScrollHandler: (handlers) => handlers,
  useDerivedValue: (updater) => shared(typeof updater === 'function' ? updater() : updater),
  useAnimatedRef: () => ({ current: null }),
  withTiming: (value) => value,
  withSpring: (value) => value,
  withDelay: (_delay, value) => value,
  withRepeat: (value) => value,
  withSequence: (...values) => values[0],
  cancelAnimation: () => {},
  runOnJS: (fn) => fn,
  runOnUI: (fn) => fn,
  makeMutable: shared,
  isSharedValue: (value) => Boolean(value && value.__isSharedValue),
  interpolate: () => 0,
  interpolateColor: () => 'transparent',
  clamp: (value) => value,
  measure: () => {},
  scrollTo: () => {},
  Easing: new Proxy(
    {},
    {
      get: () => () => 0,
    },
  ),
}

module.exports = new Proxy(reanimated, {
  get(target, prop) {
    if (prop in target) return target[prop]

    return chain()
  },
})
