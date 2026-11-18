import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { experience } from '../../config/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GlowingHeart } from '../ui/GlowingHeart'

type Props = {
  open: boolean
  onClose: () => void
}

export function HiddenHeartSurprise({ open, onClose }: Props) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center px-6"
          style={{
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            data-no-burst
            aria-label="Kapat"
            className="absolute inset-0"
            style={{ background: 'rgba(6, 2, 8, 0.88)' }}
            onClick={onClose}
          />

          {!reduced &&
            Array.from({ length: 14 }, (_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute text-[var(--blush)]"
                style={{
                  left: `${8 + ((i * 17) % 84)}%`,
                  top: `${12 + ((i * 23) % 76)}%`,
                  fontSize: 10 + (i % 5) * 3,
                }}
                initial={{ opacity: 0, y: 20, scale: 0.4 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  y: [20, -30],
                  scale: [0.4, 1, 0.8],
                }}
                transition={{
                  delay: 0.15 + i * 0.06,
                  duration: 2.2,
                  ease: 'easeOut',
                }}
              >
                {i % 3 === 0 ? '✦' : '♥'}
              </motion.span>
            ))}

          <motion.div
            data-no-burst
            className="relative z-10 flex max-w-sm flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
            >
              <GlowingHeart size={140} beatSpeed={1.35} />
            </motion.div>

            <motion.p
              className="mt-8 whitespace-pre-line font-display text-[clamp(1.25rem,5.5vw,1.7rem)] leading-relaxed text-[var(--soft)]"
              initial={{
                opacity: 0,
                filter: reduced ? undefined : 'blur(12px)',
              }}
              animate={{
                opacity: 1,
                filter: reduced ? undefined : 'blur(0px)',
              }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              {experience.hiddenHeart.message}
            </motion.p>

            <button
              type="button"
              data-no-burst
              onClick={onClose}
              className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-body text-sm text-[var(--soft)]/90 touch-manipulation"
            >
              <X size={14} /> Kapat
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
