import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  onDiscover: () => void
  discovered: boolean
}

export function HiddenCornerHeart({ onDiscover, discovered }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      data-no-burst
      aria-label="Gizli sürpriz"
      onClick={onDiscover}
      className="fixed z-30 flex h-11 w-11 items-center justify-center touch-manipulation"
      style={{
        left: 'max(0.4rem, env(safe-area-inset-left))',
        bottom: 'max(0.6rem, env(safe-area-inset-bottom))',
      }}
      whileTap={{ scale: 0.88 }}
    >
      <motion.span
        className="absolute inset-1 rounded-full"
        style={{
          background: discovered
            ? 'radial-gradient(circle, rgba(255,150,190,0.25), transparent 70%)'
            : 'radial-gradient(circle, rgba(255,140,185,0.35), transparent 70%)',
        }}
        animate={
          reduced
            ? { opacity: 0.5 }
            : { opacity: [0.25, 0.7, 0.25], scale: [0.9, 1.15, 0.9] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-[14px] w-[14px]"
        aria-hidden
        style={{ opacity: discovered ? 0.45 : 0.55 }}
      >
        <path
          d="M12 20s-7.2-4.4-7.2-9.1C4.8 7.5 7.3 6 9.5 6c1.3 0 2.2.65 2.5 1.3C12.3 6.65 13.2 6 14.5 6c2.2 0 4.7 1.5 4.7 4.9C19.2 15.6 12 20 12 20z"
          fill="#e8a0b8"
        />
      </svg>
    </motion.button>
  )
}
