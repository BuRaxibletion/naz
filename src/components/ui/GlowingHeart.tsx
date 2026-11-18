import { motion } from 'framer-motion'
import type { ElementType, MouseEvent } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  size?: number
  beatSpeed?: number
  interactive?: boolean
  onPulse?: () => void
  className?: string
}

export function GlowingHeart({
  size = 120,
  beatSpeed = 1,
  interactive = false,
  onPulse,
  className = '',
}: Props) {
  const reduced = useReducedMotion()
  const duration = Math.max(0.45, 1.35 / beatSpeed)
  const Tag = (interactive ? motion.button : motion.div) as ElementType

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      data-no-burst
      aria-label={interactive ? 'Parlayan kalp' : undefined}
      aria-hidden={interactive ? undefined : true}
      className={`relative outline-none ${interactive ? 'touch-manipulation cursor-pointer' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      onClick={
        interactive
          ? (e: MouseEvent) => {
              e.stopPropagation()
              onPulse?.()
            }
          : undefined
      }
      whileTap={interactive ? { scale: 0.92 } : undefined}
    >
      {/* Soft aura */}
      <motion.span
        className="absolute inset-[-35%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,140,185,0.45) 0%, rgba(120,40,80,0.15) 45%, transparent 70%)',
          filter: 'blur(8px)',
        }}
        animate={
          reduced
            ? { opacity: 0.7 }
            : { opacity: [0.45, 0.9, 0.45], scale: [0.92, 1.08, 0.92] }
        }
        transition={{ duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.span
        className="relative block h-full w-full"
        animate={
          reduced
            ? { scale: 1 }
            : { scale: [1, 1.12, 1] }
        }
        transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 32 32" className="h-full w-full drop-shadow-[0_0_28px_rgba(255,120,170,0.65)]">
          <defs>
            <linearGradient id="heartFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb6c9" />
              <stop offset="45%" stopColor="#e85a8a" />
              <stop offset="100%" stopColor="#8b1e4a" />
            </linearGradient>
            <radialGradient id="heartShine" cx="35%" cy="30%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <path
            d="M16 28s-12-7.4-12-15.2C4 7.5 8.2 5 12 5c2.2 0 3.6 1.1 4 2.2C16.4 6.1 17.8 5 20 5c3.8 0 8 2.5 8 7.8C28 20.6 16 28 16 28z"
            fill="url(#heartFill)"
          />
          <path
            d="M16 28s-12-7.4-12-15.2C4 7.5 8.2 5 12 5c2.2 0 3.6 1.1 4 2.2C16.4 6.1 17.8 5 20 5c3.8 0 8 2.5 8 7.8C28 20.6 16 28 16 28z"
            fill="url(#heartShine)"
          />
        </svg>
      </motion.span>
    </Tag>
  )
}
