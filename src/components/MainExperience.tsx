import { motion } from 'framer-motion'
import { Heart, Sparkles, Stars, Mail, Hand } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react'
import { experience } from '../config/experience'
import type { EffectsApi } from './effects/EffectsCanvas'
import { MessageGallery } from './MessageGallery'
import { FinalScene } from './overlays/FinalScene'
import { HiddenHeartSurprise } from './overlays/HiddenHeartSurprise'
import { LetterOverlay } from './overlays/LetterOverlay'
import { WishOverlay } from './overlays/WishOverlay'
import { GlowingHeart } from './ui/GlowingHeart'
import { HiddenCornerHeart } from './ui/HiddenCornerHeart'
import { SurpriseButton } from './ui/SurpriseButton'

type DiscoveryKey =
  | 'confetti'
  | 'release'
  | 'wish'
  | 'letter'
  | 'hidden'
  | 'rain'

type Props = {
  visible: boolean
  effects: RefObject<EffectsApi | null>
  rainDiscoverRef?: RefObject<(() => void) | null>
}

export function MainExperience({ visible, effects, rainDiscoverRef }: Props) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [beat, setBeat] = useState(1)
  const [letterOpen, setLetterOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [hiddenOpen, setHiddenOpen] = useState(false)
  const [finaleOpen, setFinaleOpen] = useState(false)
  const [holding, setHolding] = useState(false)
  const [finaleSeen, setFinaleSeen] = useState(false)
  const [discovered, setDiscovered] = useState<Record<DiscoveryKey, boolean>>({
    confetti: false,
    release: false,
    wish: false,
    letter: false,
    hidden: false,
    rain: false,
  })

  const mark = useCallback((key: DiscoveryKey) => {
    setDiscovered((d) => (d[key] ? d : { ...d, [key]: true }))
  }, [])

  useEffect(() => {
    if (!rainDiscoverRef) return
    rainDiscoverRef.current = () => mark('rain')
    return () => {
      rainDiscoverRef.current = null
    }
  }, [mark, rainDiscoverRef])

  const allFound = useMemo(
    () => Object.values(discovered).every(Boolean),
    [discovered],
  )

  if (!visible) return null

  const pulseHeart = () => {
    setBeat(2.6)
    window.setTimeout(() => setBeat(1), 2800)
    const cx = window.innerWidth / 2
    const cy = window.innerHeight * 0.28
    effects.current?.heartExplosion(cx, cy)
    effects.current?.burstAt(cx, cy, 1.4)
  }

  const beginHold = () => {
    setHolding(true)
    effects.current?.startHeartRain()
    mark('rain')
  }

  const endHold = () => {
    setHolding(false)
    effects.current?.stopHeartRain()
  }

  const openFinale = () => {
    setFinaleOpen(true)
    setFinaleSeen(true)
  }

  return (
    <>
      <motion.main
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5"
        style={{
          paddingTop: 'max(4.5rem, calc(env(safe-area-inset-top) + 3.2rem))',
          paddingBottom: 'max(4.5rem, calc(env(safe-area-inset-bottom) + 2.5rem))',
        }}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        <div className="flex flex-col items-center">
          <GlowingHeart
            size={96}
            beatSpeed={beat}
            interactive
            onPulse={pulseHeart}
            className="mb-2"
          />
          <p className="mb-8 font-body text-[0.68rem] uppercase tracking-[0.24em] text-[var(--rose)]/65">
            Kalbe dokun
          </p>
        </div>

        <MessageGallery
          index={msgIndex}
          onAdvance={() => {
            setMsgIndex((i) => i + 1)
            effects.current?.sparkleAt(
              window.innerWidth / 2,
              window.innerHeight * 0.45,
            )
            effects.current?.burstAt(
              window.innerWidth * (0.3 + Math.random() * 0.4),
              window.innerHeight * 0.5,
              0.7,
            )
          }}
        />

        <motion.div
          className="mt-10 flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          <SurpriseButton
            variant="bloom"
            icon={<Sparkles size={18} />}
            onClick={() => {
              effects.current?.confettiHearts()
              mark('confetti')
            }}
          >
            {experience.surprises.moreSurprise}
          </SurpriseButton>

          <SurpriseButton
            variant="ember"
            icon={<Heart size={18} />}
            onClick={() => {
              effects.current?.releaseHearts()
              mark('release')
            }}
          >
            {experience.surprises.releaseHearts} ❤️
          </SurpriseButton>

          {/* Hold-to-rain zone */}
          <motion.button
            type="button"
            data-no-burst
            data-hold-rain
            className="relative w-full overflow-hidden rounded-[1.35rem] px-5 py-4 text-left touch-manipulation select-none"
            style={{
              minHeight: 56,
              background: holding
                ? 'linear-gradient(145deg, rgba(160,50,90,0.55), rgba(60,15,40,0.75))'
                : 'linear-gradient(145deg, rgba(90,20,45,0.55), rgba(40,8,22,0.7))',
              boxShadow: holding
                ? '0 0 0 1px rgba(255,180,200,0.55), 0 14px 40px rgba(160,40,90,0.45)'
                : '0 10px 36px rgba(120,20,60,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,150,180,0.35)',
              backdropFilter: 'blur(14px)',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
            }}
            whileTap={{ scale: 0.98 }}
            onPointerDown={(e) => {
              e.preventDefault()
              e.currentTarget.setPointerCapture(e.pointerId)
              beginHold()
            }}
            onPointerUp={endHold}
            onPointerCancel={endHold}
            onLostPointerCapture={endHold}
          >
            <span className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-[var(--blush)]">
                <Hand size={18} />
              </span>
              <span className="font-body text-[0.95rem] leading-snug tracking-wide text-[var(--soft)]">
                {holding
                  ? experience.holdRain.hint
                  : experience.holdRain.buttonLabel}{' '}
                💕
              </span>
            </span>
            {holding && (
              <motion.span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 120%, rgba(255,160,190,0.28), transparent 55%)',
                }}
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </motion.button>

          <SurpriseButton
            variant="starlight"
            icon={<Stars size={18} />}
            onClick={() => {
              setWishOpen(true)
              mark('wish')
            }}
          >
            {experience.wish.buttonLabel} ✨
          </SurpriseButton>

          <SurpriseButton
            variant="ink"
            icon={<Mail size={18} />}
            onClick={() => {
              setLetterOpen(true)
              mark('letter')
            }}
          >
            {experience.letter.buttonLabel}
          </SurpriseButton>
        </motion.div>

        {allFound && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-3 text-center font-body text-[0.75rem] tracking-wide text-[var(--gold)]/80">
              {experience.finale.unlockHint}
            </p>
            <SurpriseButton
              variant="starlight"
              icon={<Sparkles size={18} />}
              onClick={openFinale}
            >
              {finaleSeen
                ? experience.finale.replayLabel
                : experience.finale.openLabel}
            </SurpriseButton>
          </motion.div>
        )}

        <p className="mt-auto pt-10 text-center font-body text-[0.7rem] tracking-wide text-[var(--rose)]/45">
          Dokun · basılı tut · sürprizleri keşfet
        </p>
      </motion.main>

      <HiddenCornerHeart
        discovered={discovered.hidden}
        onDiscover={() => {
          setHiddenOpen(true)
          mark('hidden')
          effects.current?.heartExplosion(
            window.innerWidth * 0.12,
            window.innerHeight * 0.88,
          )
        }}
      />

      <LetterOverlay open={letterOpen} onClose={() => setLetterOpen(false)} />
      <WishOverlay open={wishOpen} onClose={() => setWishOpen(false)} />
      <HiddenHeartSurprise open={hiddenOpen} onClose={() => setHiddenOpen(false)} />
      <FinalScene open={finaleOpen} onClose={() => setFinaleOpen(false)} />
    </>
  )
}
