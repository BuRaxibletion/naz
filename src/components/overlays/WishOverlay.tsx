import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { experience } from '../../config/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  open: boolean
  onClose: () => void
}

export function WishOverlay({ open, onClose }: Props) {
  const reduced = useReducedMotion()
  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 90}%`,
    delay: (i % 7) * 0.18,
    size: 1.5 + (i % 4),
  }))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            data-no-burst
            aria-label="Kapat"
            className="absolute inset-0"
            style={{ background: 'rgba(5, 2, 8, 0.94)' }}
            onClick={onClose}
          />

          {!reduced &&
            stars.map((s) => (
              <motion.span
                key={s.id}
                className="pointer-events-none absolute rounded-full bg-[var(--gold)]"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  boxShadow: '0 0 8px rgba(240,210,170,0.8)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.4, 1], scale: [0.4, 1, 0.85, 1] }}
                transition={{
                  delay: 0.2 + s.delay,
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}

          {/* Shooting star */}
          {!reduced && (
            <motion.span
              className="pointer-events-none absolute h-px w-24 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent"
              style={{ top: '22%', left: '-10%' }}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: '120vw', opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }}
            />
          )}

          <motion.div
            data-no-burst
            className="relative z-10 max-w-sm text-center"
            initial={{ opacity: 0, scale: 0.9, filter: reduced ? undefined : 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: reduced ? undefined : 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-[0.7rem] uppercase tracking-[0.3em] text-[var(--gold)]/80">
              Dileğin tutuldu
            </p>
            <p className="mt-5 whitespace-pre-line font-display text-[clamp(1.3rem,5.5vw,1.75rem)] leading-relaxed text-[var(--soft)]">
              {experience.wish.message}
            </p>
            <button
              type="button"
              data-no-burst
              onClick={onClose}
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-body text-sm text-[var(--soft)]/90 touch-manipulation"
            >
              <X size={14} /> Geri dön
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
