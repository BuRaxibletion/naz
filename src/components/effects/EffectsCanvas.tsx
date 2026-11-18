import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { experience } from '../../config/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getParticleBudget } from '../../utils/performance'

type ParticleKind = 'heart' | 'rain' | 'star' | 'spark' | 'ring'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  kind: ParticleKind
  hue: number
  spin: number
  spinSpeed: number
  alpha: number
  gravity: number
}

export type EffectsApi = {
  burstAt: (x: number, y: number, power?: number) => void
  heartExplosion: (x: number, y: number) => void
  releaseHearts: () => void
  confettiHearts: () => void
  sparkleAt: (x: number, y: number) => void
  startHeartRain: () => void
  stopHeartRain: () => void
  isRaining: () => boolean
}

type Props = {
  active: boolean
  /** When true, empty-screen long-press starts rain; tap still bursts */
  enableHoldRain?: boolean
  onHoldRainStart?: () => void
}

const LONG_PRESS_MS = 420

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number,
  rotation: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.scale(size / 16, size / 16)
  ctx.globalAlpha = Math.max(0, alpha)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, 4)
  ctx.bezierCurveTo(0, 0, -8, 0, -8, 6)
  ctx.bezierCurveTo(-8, 12, 0, 16, 0, 20)
  ctx.bezierCurveTo(0, 16, 8, 12, 8, 6)
  ctx.bezierCurveTo(8, 0, 0, 0, 0, 4)
  ctx.fill()
  ctx.restore()
}

export const EffectsCanvas = forwardRef<EffectsApi, Props>(
  function EffectsCanvas({ active, enableHoldRain = true, onHoldRainStart }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<Particle[]>([])
    const stars = useRef<
      { x: number; y: number; r: number; tw: number; phase: number }[]
    >([])
    const floaters = useRef<
      { x: number; y: number; size: number; speed: number; drift: number; phase: number }[]
    >([])
    const combo = useRef({ count: 0, last: 0 })
    const raining = useRef(false)
    const rainSpawnAcc = useRef(0)
    const reduced = useReducedMotion()
    const raf = useRef(0)
    const holdTimer = useRef<number | null>(null)
    const holdActive = useRef(false)
    const touchOrigin = useRef<{ x: number; y: number } | null>(null)
    const onHoldRainStartRef = useRef(onHoldRainStart)
    onHoldRainStartRef.current = onHoldRainStart

    const budget = getParticleBudget(experience.animation.density, reduced)

    const spawn = useCallback((p: Particle) => {
      particles.current.push(p)
      const cap = raining.current ? 220 : 180
      if (particles.current.length > cap) {
        particles.current.splice(0, particles.current.length - cap)
      }
    }, [])

    const spawnRainDrop = useCallback(() => {
      const w = window.innerWidth
      const falling = particles.current.filter((p) => p.kind === 'rain').length
      if (falling >= budget.rainMax) return

      const isSpark = Math.random() > 0.78
      if (isSpark) {
        spawn({
          x: Math.random() * w,
          y: -8 - Math.random() * 40,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 1.2 + Math.random() * 2.2,
          life: 0,
          maxLife: 70 + Math.random() * 40,
          size: 1.5 + Math.random() * 2.5,
          kind: 'star',
          hue: 40 + Math.random() * 25,
          spin: 0,
          spinSpeed: 0,
          alpha: 0.95,
          gravity: 0.03,
        })
        return
      }

      spawn({
        x: Math.random() * w,
        y: -20 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.4 + Math.random() * 2.8,
        life: 0,
        maxLife: 90 + Math.random() * 50,
        size: 8 + Math.random() * 20,
        kind: 'rain',
        hue: 325 + Math.random() * 35,
        spin: Math.random() * Math.PI,
        spinSpeed: (Math.random() - 0.5) * 0.14,
        alpha: 0.88,
        gravity: 0.035 + Math.random() * 0.04,
      })
    }, [budget.rainMax, spawn])

    const startHeartRain = useCallback(() => {
      if (raining.current) return
      raining.current = true
      onHoldRainStartRef.current?.()
    }, [])

    const stopHeartRain = useCallback(() => {
      raining.current = false
      rainSpawnAcc.current = 0
    }, [])

    const heartExplosion = useCallback(
      (x: number, y: number) => {
        const n = budget.confetti
        for (let i = 0; i < n; i++) {
          const a = (Math.PI * 2 * i) / n + Math.random() * 0.2
          const s = 1.5 + Math.random() * 4
          spawn({
            x,
            y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s - 1,
            life: 0,
            maxLife: 55 + Math.random() * 35,
            size: 10 + Math.random() * 18,
            kind: 'heart',
            hue: 320 + Math.random() * 40,
            spin: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.12,
            alpha: 1,
            gravity: -0.02,
          })
        }
      },
      [budget.confetti, spawn],
    )

    const burstAt = useCallback(
      (x: number, y: number, power = 1) => {
        const now = performance.now()
        if (now - combo.current.last < 420) combo.current.count += 1
        else combo.current.count = 1
        combo.current.last = now

        const big = combo.current.count >= 4
        const count = Math.round(budget.touchBurst * power * (big ? 2.2 : 1))

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.4 + Math.random() * 1.8 * power
          spawn({
            x,
            y,
            vx: Math.cos(angle) * speed * 0.35,
            vy: -1.2 - Math.random() * 2.4 * power,
            life: 0,
            maxLife: 50 + Math.random() * 40,
            size: 8 + Math.random() * 16 * (big ? 1.4 : 1),
            kind: 'heart',
            hue: 330 + Math.random() * 30,
            spin: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.08,
            alpha: 0.9,
            gravity: -0.015,
          })
        }

        spawn({
          x,
          y,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: 36,
          size: 8,
          kind: 'ring',
          hue: 340,
          spin: 0,
          spinSpeed: 0,
          alpha: 0.7,
          gravity: 0,
        })

        if (Math.random() > 0.35 || big) {
          for (let i = 0; i < (big ? 10 : 5); i++) {
            const a = Math.random() * Math.PI * 2
            const s = 0.8 + Math.random() * 2.5
            spawn({
              x,
              y,
              vx: Math.cos(a) * s,
              vy: Math.sin(a) * s,
              life: 0,
              maxLife: 28 + Math.random() * 20,
              size: 2 + Math.random() * 3,
              kind: 'star',
              hue: 40 + Math.random() * 20,
              spin: 0,
              spinSpeed: 0,
              alpha: 1,
              gravity: 0.01,
            })
          }
        }

        if (big) heartExplosion(x, y)
      },
      [budget.touchBurst, heartExplosion, spawn],
    )

    const releaseHearts = useCallback(() => {
      const w = window.innerWidth
      const h = window.innerHeight
      const n = budget.releaseHearts
      for (let i = 0; i < n; i++) {
        const side = Math.random()
        let x = Math.random() * w
        let y = h + 20
        if (side < 0.2) {
          x = -10
          y = h * (0.3 + Math.random() * 0.7)
        } else if (side < 0.4) {
          x = w + 10
          y = h * (0.3 + Math.random() * 0.7)
        }
        spawn({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -1.5 - Math.random() * 2.8,
          life: 0,
          maxLife: 90 + Math.random() * 60,
          size: 8 + Math.random() * 22,
          kind: 'heart',
          hue: 325 + Math.random() * 35,
          spin: Math.random() * Math.PI,
          spinSpeed: (Math.random() - 0.5) * 0.06,
          alpha: 0.85,
          gravity: -0.02,
        })
      }
    }, [budget.releaseHearts, spawn])

    const confettiHearts = useCallback(() => {
      heartExplosion(window.innerWidth / 2, window.innerHeight * 0.42)
    }, [heartExplosion])

    const sparkleAt = useCallback(
      (x: number, y: number) => {
        for (let i = 0; i < 8; i++) {
          const a = Math.random() * Math.PI * 2
          const s = 0.4 + Math.random() * 1.6
          spawn({
            x,
            y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s,
            life: 0,
            maxLife: 24 + Math.random() * 16,
            size: 1.5 + Math.random() * 2.5,
            kind: 'spark',
            hue: 350,
            spin: 0,
            spinSpeed: 0,
            alpha: 1,
            gravity: 0.01,
          })
        }
      },
      [spawn],
    )

    useImperativeHandle(
      ref,
      () => ({
        burstAt,
        heartExplosion,
        releaseHearts,
        confettiHearts,
        sparkleAt,
        startHeartRain,
        stopHeartRain,
        isRaining: () => raining.current,
      }),
      [
        burstAt,
        heartExplosion,
        releaseHearts,
        confettiHearts,
        sparkleAt,
        startHeartRain,
        stopHeartRain,
      ],
    )

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = window.innerWidth
        const h = window.innerHeight
        canvas.width = w * dpr
        canvas.height = h * dpr
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        const ctx = canvas.getContext('2d')
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      resize()
      window.addEventListener('resize', resize)

      stars.current = Array.from({ length: budget.stars }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.6,
        tw: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      }))

      floaters.current = Array.from({ length: budget.floatingHearts }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: 8 + Math.random() * 18,
        speed: 0.08 + Math.random() * 0.18,
        drift: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      }))

      return () => window.removeEventListener('resize', resize)
    }, [budget.floatingHearts, budget.stars])

    // Tap vs long-press (mobile only gestures)
    useEffect(() => {
      if (!active) return

      const clearHold = () => {
        if (holdTimer.current != null) {
          window.clearTimeout(holdTimer.current)
          holdTimer.current = null
        }
      }

      const endGesture = () => {
        const wasHold = holdActive.current
        clearHold()
        if (wasHold) stopHeartRain()
        holdActive.current = false
        touchOrigin.current = null
      }

      const onPointerDown = (e: PointerEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('[data-no-burst]')) return
        if (target.closest('[data-hold-rain]')) return

        touchOrigin.current = { x: e.clientX, y: e.clientY }
        holdActive.current = false
        clearHold()

        if (!enableHoldRain) {
          burstAt(e.clientX, e.clientY, 1)
          return
        }

        holdTimer.current = window.setTimeout(() => {
          holdActive.current = true
          startHeartRain()
        }, LONG_PRESS_MS)
      }

      const onPointerUp = (e: PointerEvent) => {
        const origin = touchOrigin.current
        const wasHold = holdActive.current
        clearHold()

        if (!wasHold && origin) {
          const dx = e.clientX - origin.x
          const dy = e.clientY - origin.y
          if (dx * dx + dy * dy < 36 * 36) {
            const target = e.target as HTMLElement
            if (!target.closest('[data-no-burst]') && !target.closest('[data-hold-rain]')) {
              burstAt(origin.x, origin.y, 1)
            }
          }
        }

        if (wasHold) stopHeartRain()
        holdActive.current = false
        touchOrigin.current = null
      }

      const onPointerCancel = () => endGesture()

      window.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerCancel)
      window.addEventListener('blur', endGesture)

      return () => {
        clearHold()
        stopHeartRain()
        window.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerCancel)
        window.removeEventListener('blur', endGesture)
      }
    }, [active, burstAt, enableHoldRain, startHeartRain, stopHeartRain])

    // Render loop
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      let running = true
      let last = performance.now()

      const loop = (now: number) => {
        if (!running) return
        const dt = Math.min(32, now - last)
        last = now

        const w = window.innerWidth
        const h = window.innerHeight
        ctx.clearRect(0, 0, w, h)

        const t = now / 1000

        // Rain spawn while holding
        if (raining.current && !reduced) {
          rainSpawnAcc.current += dt
          const interval = 55
          while (rainSpawnAcc.current >= interval) {
            rainSpawnAcc.current -= interval
            for (let i = 0; i < budget.rainPerTick; i++) spawnRainDrop()
          }
        }

        for (const s of stars.current) {
          const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * s.tw + s.phase))
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 220, 235, ${twinkle * 0.85})`
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
          ctx.fill()
        }

        if (!reduced) {
          for (const f of floaters.current) {
            f.y -= f.speed * 0.0025
            f.x += Math.sin(t * 0.4 + f.phase) * 0.00025 + f.drift * 0.0004
            if (f.y < -0.05) {
              f.y = 1.05
              f.x = Math.random()
            }
            drawHeart(
              ctx,
              f.x * w,
              f.y * h,
              f.size,
              `hsla(${330 + Math.sin(f.phase) * 20}, 70%, 72%, 0.35)`,
              0.35,
              Math.sin(t * 0.6 + f.phase) * 0.2,
            )
          }
        }

        const next: Particle[] = []
        for (const p of particles.current) {
          p.life += 1
          if (p.life >= p.maxLife) continue
          if (p.y > h + 80 && (p.kind === 'rain' || p.gravity > 0)) continue

          const progress = p.life / p.maxLife
          p.x += p.vx
          p.y += p.vy
          p.vy += p.gravity
          p.vx *= 0.995
          p.spin += p.spinSpeed
          const fade = 1 - progress
          const alpha = p.alpha * fade

          if (p.kind === 'heart' || p.kind === 'rain') {
            drawHeart(
              ctx,
              p.x,
              p.y,
              p.size * (0.7 + fade * 0.3),
              `hsla(${p.hue}, 75%, ${65 + fade * 10}%, ${alpha})`,
              alpha,
              p.spin,
            )
          } else if (p.kind === 'ring') {
            const r = 12 + progress * 70
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 150, 190, ${alpha * 0.65})`
            ctx.lineWidth = 2.5 * (1 - progress)
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
            ctx.stroke()
          } else if (p.kind === 'star' || p.kind === 'spark') {
            ctx.save()
            ctx.globalAlpha = alpha
            ctx.fillStyle =
              p.kind === 'star'
                ? `hsla(${p.hue}, 90%, 85%, 1)`
                : `hsla(340, 80%, 80%, 1)`
            ctx.beginPath()
            const r = p.size * (1 - progress * 0.4)
            ctx.moveTo(p.x, p.y - r)
            for (let i = 0; i < 4; i++) {
              const a = (i * Math.PI) / 2 + Math.PI / 4
              ctx.lineTo(p.x + Math.cos(a) * r * 0.4, p.y + Math.sin(a) * r * 0.4)
              const a2 = a + Math.PI / 4
              ctx.lineTo(p.x + Math.cos(a2) * r, p.y + Math.sin(a2) * r)
            }
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          }

          next.push(p)
        }
        particles.current = next

        raf.current = requestAnimationFrame(loop)
      }

      raf.current = requestAnimationFrame(loop)
      return () => {
        running = false
        cancelAnimationFrame(raf.current)
      }
    }, [budget.rainPerTick, reduced, spawnRainDrop])

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
        aria-hidden
      />
    )
  },
)
