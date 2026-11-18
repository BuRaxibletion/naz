import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { experience } from '../../config/experience'

type Props = {
  open: boolean
  onClose: () => void
}

export function LetterOverlay({ open, onClose }: Props) {
  const { letter } = experience

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          style={{
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            data-no-burst
            aria-label="Kapat"
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.article
            data-no-burst
            className="relative z-10 mx-4 mb-2 w-full max-w-md overflow-hidden rounded-[1.75rem] px-6 pb-7 pt-6 sm:mb-0"
            style={{
              background:
                'linear-gradient(165deg, #2a1420 0%, #1a0c14 50%, #120810 100%)',
              boxShadow:
                '0 0 0 1px rgba(255,190,210,0.2), 0 30px 80px rgba(0,0,0,0.55)',
            }}
            initial={{ y: 80, opacity: 0, rotateX: 12, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            {/* Envelope flap accent */}
            <div
              className="pointer-events-none absolute -top-1 left-1/2 h-16 w-[120%] -translate-x-1/2"
              style={{
                background:
                  'linear-gradient(180deg, rgba(232,90,138,0.22), transparent)',
                clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
              }}
            />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-[var(--rose)]/70">
                  El yazısı not
                </p>
                <h2 className="mt-2 font-display text-[1.55rem] text-[var(--blush)]">
                  {letter.title}
                </h2>
              </div>
              <button
                type="button"
                data-no-burst
                onClick={onClose}
                className="rounded-full bg-white/5 p-2 text-[var(--soft)]/80 touch-manipulation"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>
            </div>

            <motion.p
              className="relative mt-6 whitespace-pre-line font-display text-[1.05rem] leading-[1.85] text-[var(--soft)]/92"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              {letter.body}
            </motion.p>

            <motion.p
              className="mt-8 text-right font-display text-[1.1rem] text-[var(--rose)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {letter.signOff}
            </motion.p>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
