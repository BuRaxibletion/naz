import type { AnimationDensity } from '../config/experience'

export function isTouchPrimary(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0
  )
}

export function getParticleBudget(density: AnimationDensity, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      floatingHearts: 4,
      stars: 18,
      touchBurst: 6,
      confetti: 20,
      releaseHearts: 40,
      rainPerTick: 2,
      rainMax: 36,
    }
  }

  const scale = density === 'high' ? 1.2 : density === 'low' ? 0.7 : 1

  return {
    floatingHearts: Math.round(10 * scale),
    stars: Math.round(42 * scale),
    touchBurst: Math.round(8 * scale),
    confetti: Math.round(36 * scale),
    releaseHearts: Math.round(70 * scale),
    rainPerTick: Math.max(2, Math.round(3 * scale)),
    rainMax: Math.round(70 * scale),
  }
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}
