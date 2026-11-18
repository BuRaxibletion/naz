import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'ember' | 'bloom' | 'starlight' | 'ink'

const styles: Record<
  Variant,
  { bg: string; border: string; glow: string; accent: string }
> = {
  ember: {
    bg: 'linear-gradient(145deg, rgba(90,20,45,0.55), rgba(40,8,22,0.7))',
    border: 'rgba(255,150,180,0.35)',
    glow: '0 10px 36px rgba(120,20,60,0.4)',
    accent: 'rgba(255,170,195,0.15)',
  },
  bloom: {
    bg: 'linear-gradient(145deg, rgba(120,40,80,0.45), rgba(50,12,35,0.72))',
    border: 'rgba(255,190,210,0.4)',
    glow: '0 10px 36px rgba(160,40,90,0.35)',
    accent: 'rgba(255,200,220,0.18)',
  },
  starlight: {
    bg: 'linear-gradient(145deg, rgba(30,18,48,0.65), rgba(20,8,30,0.78))',
    border: 'rgba(240,210,170,0.35)',
    glow: '0 10px 36px rgba(80,40,100,0.35)',
    accent: 'rgba(240,210,170,0.12)',
  },
  ink: {
    bg: 'linear-gradient(145deg, rgba(45,18,35,0.6), rgba(18,6,16,0.8))',
    border: 'rgba(230,180,160,0.32)',
    glow: '0 10px 36px rgba(60,20,40,0.4)',
    accent: 'rgba(230,180,160,0.12)',
  },
}

type Props = {
  children: ReactNode
  onClick: () => void
  variant?: Variant
  icon?: ReactNode
}

export function SurpriseButton({
  children,
  onClick,
  variant = 'ember',
  icon,
}: Props) {
  const s = styles[variant]

  return (
    <motion.button
      type="button"
      data-no-burst
      onClick={onClick}
      className="relative w-full overflow-hidden rounded-[1.35rem] px-5 py-4 text-left touch-manipulation"
      style={{
        minHeight: 56,
        background: s.bg,
        boxShadow: `${s.glow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
        border: `1px solid ${s.border}`,
        backdropFilter: 'blur(14px)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <span
        className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-70"
        style={{ background: s.accent, filter: 'blur(18px)' }}
      />
      <span className="relative flex items-center gap-3">
        {icon && (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-[var(--blush)]">
            {icon}
          </span>
        )}
        <span className="font-body text-[0.95rem] leading-snug tracking-wide text-[var(--soft)]">
          {children}
        </span>
      </span>
    </motion.button>
  )
}
