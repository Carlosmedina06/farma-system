const SKIP_ENTERING_MS = 800

let skipAnimatedLayoutEnteringUntil = 0

export const shouldSkipAnimatedLayoutEntering = () => Date.now() < skipAnimatedLayoutEnteringUntil

export const markSkipAnimatedLayoutEntering = (durationMs = SKIP_ENTERING_MS) => {
  skipAnimatedLayoutEnteringUntil = Date.now() + durationMs
}
