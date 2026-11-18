import { AnimatePresence, motion } from 'framer-motion'
import { Music2, VolumeX } from 'lucide-react'
import { experience } from '../../config/experience'

type Props = {
  playing: boolean
  onToggle: () => void
}

export function MusicToggle({ playing, onToggle }: Props) {
  return (
    <motion.button
      type="button"
      data-no-burst
      onClick={onToggle}
      aria-label={playing ? experience.music.labelOn : experience.music.labelOff}
      className="fixed z-50 flex h-11 w-11 items-center justify-center rounded-full touch-manipulation"
      style={{
        top: 'max(0.85rem, env(safe-area-inset-top))',
        right: 'max(0.85rem, env(safe-area-inset-right))',
        background:
          'linear-gradient(145deg, rgba(80,25,50,0.65), rgba(25,8,20,0.75))',
        border: '1px solid rgba(255,180,200,0.28)',
        boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(12px)',
      }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={playing ? 'on' : 'off'}
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
          transition={{ duration: 0.25 }}
          className="text-[var(--blush)]"
        >
          {playing ? <Music2 size={18} /> : <VolumeX size={18} />}
        </motion.span>
      </AnimatePresence>

      {playing && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: '0 0 0 1px rgba(255,160,190,0.35)' }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  )
}
