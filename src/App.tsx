import { useCallback, useEffect, useRef, useState } from 'react'
import { experience } from './config/experience'
import { EffectsCanvas, type EffectsApi } from './components/effects/EffectsCanvas'
import { MainExperience } from './components/MainExperience'
import { OpeningScreen } from './components/OpeningScreen'
import { MusicToggle } from './components/ui/MusicToggle'
import { createAmbientAudio } from './utils/ambientAudio'

type Phase = 'opening' | 'transition' | 'main'

export default function App() {
  const [phase, setPhase] = useState<Phase>('opening')
  const [musicOn, setMusicOn] = useState(false)
  const effectsRef = useRef<EffectsApi | null>(null)
  const rainDiscoverRef = useRef<(() => void) | null>(null)
  const audioRef = useRef<ReturnType<typeof createAmbientAudio> | null>(null)
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    document.title = experience.pageTitle
  }, [])

  useEffect(() => {
    audioRef.current = createAmbientAudio()
    return () => {
      audioRef.current?.stop()
      htmlAudioRef.current?.pause()
    }
  }, [])

  const stopMusic = useCallback(() => {
    audioRef.current?.stop()
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause()
      htmlAudioRef.current.currentTime = 0
    }
    setMusicOn(false)
  }, [])

  const startMusic = useCallback(async () => {
    const src = experience.music.src.trim()
    if (src) {
      if (!htmlAudioRef.current) {
        const el = new Audio(src)
        el.loop = true
        el.volume = 0.45
        htmlAudioRef.current = el
      }
      try {
        await htmlAudioRef.current.play()
        setMusicOn(true)
      } catch {
        await audioRef.current?.start()
        setMusicOn(true)
      }
      return
    }
    await audioRef.current?.start()
    setMusicOn(true)
  }, [])

  const toggleMusic = useCallback(() => {
    if (musicOn) stopMusic()
    else void startMusic()
  }, [musicOn, startMusic, stopMusic])

  const begin = useCallback(() => {
    if (phase !== 'opening') return
    setPhase('transition')

    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    window.setTimeout(() => {
      effectsRef.current?.heartExplosion(cx, cy)
      effectsRef.current?.burstAt(cx, cy, 1.6)
    }, 380)

    window.setTimeout(() => setPhase('main'), 1050)
  }, [phase])

  const showOpening = phase === 'opening' || phase === 'transition'
  const showMain = phase === 'main'

  return (
    <div className="app-shell relative min-h-[100dvh] overflow-x-hidden overflow-y-auto">
      <div className="night-sky pointer-events-none fixed inset-0 z-0" aria-hidden />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 50% -10%, rgba(120,30,70,0.45), transparent 55%),
            radial-gradient(ellipse 50% 40% at 15% 80%, rgba(80,20,60,0.28), transparent 50%),
            radial-gradient(ellipse 45% 35% at 90% 70%, rgba(100,30,70,0.22), transparent 50%)
          `,
        }}
        aria-hidden
      />
      <div className="vignette pointer-events-none fixed inset-0 z-[2]" aria-hidden />

      <EffectsCanvas
        ref={effectsRef}
        active={showMain}
        enableHoldRain
        onHoldRainStart={() => rainDiscoverRef.current?.()}
      />

      <MusicToggle playing={musicOn} onToggle={toggleMusic} />

      <OpeningScreen
        visible={showOpening}
        transitioning={phase === 'transition'}
        onBegin={begin}
      />

      <MainExperience
        visible={showMain}
        effects={effectsRef}
        rainDiscoverRef={rainDiscoverRef}
      />
    </div>
  )
}
