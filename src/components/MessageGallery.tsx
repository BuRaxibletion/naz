import { AnimatePresence, motion } from 'framer-motion'
import { experience } from '../config/experience'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  index: number
  onAdvance: () => void
}

export function MessageGallery({ index, onAdvance }: Props) {
  const reduced = useReducedMotion()
  const messages = experience.messages
  const message = messages[index % messages.length]
  const glowShift = index % 3

  return (
    <div className="relative mx-auto w-full max-w-lg px-2">
      <motion.div
        className="pointer-events-none absolute inset-[-20%] -z-10 rounded-full"
        animate={{
          background: [
            `radial-gradient(circle, rgba(255,120,170,${0.12 + glowShift * 0.04}) 0%, transparent 65%)`,
            `radial-gradient(circle, rgba(180,70,130,${0.16 + glowShift * 0.03}) 0%, transparent 65%)`,
            `radial-gradient(circle, rgba(255,120,170,${0.12 + glowShift * 0.04}) 0%, transparent 65%)`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <button
        type="button"
        data-no-burst
        onClick={onAdvance}
        className="relative w-full touch-manipulation text-left outline-none"
        aria-label="Sonraki mesaj"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 18,
              filter: reduced ? undefined : 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: reduced ? undefined : 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              y: -12,
              filter: reduced ? undefined : 'blur(8px)',
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-[7.5rem] py-2"
          >
            <p className="font-display text-[clamp(1.25rem,5.2vw,1.75rem)] leading-relaxed text-[var(--soft)]">
              “{message}”
            </p>
            <p className="mt-5 font-body text-[0.72rem] uppercase tracking-[0.22em] text-[var(--rose)]/70">
              Dokun — sonraki satır
            </p>
          </motion.div>
        </AnimatePresence>
      </button>

      <div className="mt-3 flex gap-1.5" aria-hidden>
        {messages.map((_, i) => (
          <span
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === index % messages.length ? 18 : 6,
              background:
                i === index % messages.length
                  ? 'rgba(255,180,200,0.85)'
                  : 'rgba(255,180,200,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
