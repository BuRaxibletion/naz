import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../config/experience'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { GlowingHeart } from './ui/GlowingHeart'

type Props = {
  visible: boolean
  transitioning: boolean
  onBegin: () => void
}

export function OpeningScreen({ visible, transitioning, onBegin }: Props) {
  const reduced = useReducedMotion()
  const name = experience.recipientName.trim()

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
          style={{
            paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: reduced ? undefined : 'blur(12px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Expanding heart overlay during transition */}
          <AnimatePresence>
            {transitioning && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 80,
                    height: 80,
                    background:
                      'radial-gradient(circle, rgba(255,200,220,0.95) 0%, rgba(232,90,138,0.7) 40%, transparent 70%)',
                  }}
                  initial={{ scale: 0.2, opacity: 0.9 }}
                  animate={{ scale: 28, opacity: [0.95, 0.6, 0] }}
                  transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="absolute h-40 w-40"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 14, opacity: 0 }}
                  transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <GlowingHeart size={160} beatSpeed={2.4} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="relative flex flex-col items-center text-center"
            animate={transitioning ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlowingHeart size={132} beatSpeed={1} />
            </motion.div>

            {name && (
              <motion.p
                className="mt-8 font-display text-[clamp(1.6rem,6vw,2.4rem)] tracking-wide text-[var(--soft)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
              >
                {name}
              </motion.p>
            )}

            <motion.h1
              className="mt-5 max-w-[18rem] font-display text-[clamp(1.35rem,5.5vw,1.85rem)] leading-snug text-[var(--blush)] sm:max-w-md"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
            >
              {experience.opening.greeting}
            </motion.h1>

            <motion.button
              type="button"
              data-no-burst
              onClick={onBegin}
              className="relative mt-10 min-h-12 overflow-hidden rounded-full px-8 py-3.5 touch-manipulation"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,180,200,0.22), rgba(140,40,80,0.35))',
                boxShadow:
                  '0 0 0 1px rgba(255,190,210,0.35), 0 12px 40px rgba(80,10,40,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="relative font-body text-[0.95rem] tracking-[0.04em] text-[var(--soft)]">
                {experience.opening.cta}{' '}
                <span aria-hidden className="inline-block animate-pulse-soft">
                  ❤️
                </span>
              </span>
            </motion.button>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
