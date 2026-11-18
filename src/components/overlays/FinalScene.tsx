import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../../config/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { GlowingHeart } from '../ui/GlowingHeart'

type Props = {
  open: boolean
  onClose: () => void
}

export function FinalScene({ open, onClose }: Props) {
  const reduced = useReducedMotion()
  const name = experience.recipientName.trim()

  const orbiters = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * Math.PI * 2,
    radius: 88 + (i % 3) * 18,
    size: 3 + (i % 4),
    delay: i * 0.08,
  }))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden px-6"
          style={{
            paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: '#040106' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1 }}
          />

          {/* Soft nebula */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
            style={{
              background: `
                radial-gradient(ellipse 55% 40% at 50% 42%, rgba(160,40,90,0.35), transparent 60%),
                radial-gradient(ellipse 40% 30% at 30% 70%, rgba(90,20,60,0.25), transparent 55%)
              `,
            }}
          />

          {/* Orbiting light particles */}
          {!reduced && (
            <div className="pointer-events-none absolute left-1/2 top-[38%] h-0 w-0">
              {orbiters.map((o) => (
                <motion.span
                  key={o.id}
                  className="absolute rounded-full bg-[var(--blush)]"
                  style={{
                    width: o.size,
                    height: o.size,
                    boxShadow: '0 0 10px rgba(255,180,200,0.8)',
                  }}
                  animate={{
                    x: [
                      Math.cos(o.angle) * o.radius,
                      Math.cos(o.angle + Math.PI) * o.radius,
                      Math.cos(o.angle + Math.PI * 2) * o.radius,
                    ],
                    y: [
                      Math.sin(o.angle) * o.radius,
                      Math.sin(o.angle + Math.PI) * o.radius,
                      Math.sin(o.angle + Math.PI * 2) * o.radius,
                    ],
                    opacity: [0.35, 1, 0.35],
                  }}
                  transition={{
                    duration: 7 + (o.id % 3),
                    repeat: Infinity,
                    ease: 'linear',
                    delay: o.delay,
                  }}
                />
              ))}
            </div>
          )}

          {/* Floating mini hearts */}
          {!reduced &&
            Array.from({ length: 8 }, (_, i) => (
              <motion.span
                key={`fh-${i}`}
                className="pointer-events-none absolute text-[var(--rose)]/40"
                style={{
                  left: `${10 + i * 11}%`,
                  bottom: '-5%',
                  fontSize: 12 + (i % 4) * 4,
                }}
                animate={{ y: [0, -720], opacity: [0, 0.55, 0] }}
                transition={{
                  duration: 8 + i,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: 'linear',
                }}
              >
                ♥
              </motion.span>
            ))}

          <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
            <motion.p
              className="mb-5 font-body text-[0.68rem] uppercase tracking-[0.3em] text-[var(--gold)]/75"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {experience.finale.title}
            </motion.p>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 160, damping: 14 }}
            >
              <GlowingHeart size={156} beatSpeed={1.15} />
            </motion.div>

            {name && (
              <motion.p
                className="mt-6 font-display text-[1.35rem] text-[var(--blush)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {name}
              </motion.p>
            )}

            <motion.p
              className="mt-5 whitespace-pre-line font-display text-[clamp(1.35rem,5.8vw,1.9rem)] leading-relaxed text-[var(--soft)]"
              initial={{
                opacity: 0,
                filter: reduced ? undefined : 'blur(14px)',
                y: 12,
              }}
              animate={{
                opacity: 1,
                filter: reduced ? undefined : 'blur(0px)',
                y: 0,
              }}
              transition={{ delay: 1.05, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {experience.finale.message}
            </motion.p>

            <motion.p
              className="mt-10 max-w-xs font-body text-[0.88rem] leading-relaxed text-[var(--rose)]/80"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
            >
              {experience.finale.thanks}
            </motion.p>

            <motion.button
              type="button"
              data-no-burst
              onClick={onClose}
              className="mt-10 min-h-12 rounded-full px-7 py-3 font-body text-sm tracking-wide text-[var(--soft)] touch-manipulation"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,180,200,0.2), rgba(120,30,70,0.4))',
                border: '1px solid rgba(255,190,210,0.35)',
                boxShadow: '0 12px 40px rgba(40,5,20,0.45)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }}
              whileTap={{ scale: 0.96 }}
            >
              Geri dön
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
