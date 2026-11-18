/**
 * Soft romantic ambient pad via Web Audio API.
 * Used when no music file is provided in config.
 */

type AmbientHandle = {
  start: () => Promise<void>
  stop: () => void
  isPlaying: () => boolean
}

export function createAmbientAudio(): AmbientHandle {
  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let nodes: OscillatorNode[] = []
  let playing = false

  const chords = [
    [220.0, 277.18, 329.63], // A minor-ish soft
    [196.0, 246.94, 293.66], // G
    [174.61, 220.0, 261.63], // F
    [146.83, 220.0, 293.66], // D minor flavor
  ]

  async function start() {
    if (playing) return
    ctx = new AudioContext()
    if (ctx.state === 'suspended') await ctx.resume()

    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const now = ctx.currentTime
    master.gain.linearRampToValueAtTime(0.08, now + 1.8)

    nodes = []
    chords.forEach((freqs, chordIndex) => {
      freqs.forEach((freq, i) => {
        const osc = ctx!.createOscillator()
        const gain = ctx!.createGain()
        const filter = ctx!.createBiquadFilter()

        osc.type = i === 0 ? 'sine' : 'triangle'
        osc.frequency.value = freq

        filter.type = 'lowpass'
        filter.frequency.value = 900

        const base = 0.012 + i * 0.004
        gain.gain.value = 0

        // Slow chord pads cycling
        const period = 12
        const offset = chordIndex * 3
        for (let beat = 0; beat < 8; beat++) {
          const t0 = now + offset + beat * period
          gain.gain.setValueAtTime(0, t0)
          gain.gain.linearRampToValueAtTime(base, t0 + 2.5)
          gain.gain.linearRampToValueAtTime(0, t0 + 8)
        }

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(master!)
        osc.start(now)
        nodes.push(osc)
      })
    })

    playing = true
  }

  function stop() {
    if (!playing || !ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(0, now + 0.8)

    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      nodes = []
      void ctx?.close()
      ctx = null
      master = null
      playing = false
    }, 900)
  }

  return {
    start,
    stop,
    isPlaying: () => playing,
  }
}
