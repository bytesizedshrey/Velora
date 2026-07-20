import { useRef, useCallback } from "react"

/**
 * useAudio
 * Synthesizes subtle premium UI sound effects using the Web Audio API.
 * No audio files needed — all sounds generated programmatically.
 *
 * Sounds:
 *  - click()   → soft transient click (button press)
 *  - tick()    → lighter tick (checkbox, small toggle)
 *  - focus()   → gentle sine tone swell (input focus)
 *  - whoosh()  → soft high-pass noise sweep (page transition)
 */
const useAudio = () => {
  const ctxRef = useRef(null)

  // Lazily create AudioContext on first use (respects browser autoplay policy)
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (some browsers suspend after inactivity)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  /**
   * Soft click — used on primary button press.
   * A quick sine burst shaped by an exponential envelope.
   */
  const click = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1)

      osc.start(now)
      osc.stop(now + 0.1)
    } catch {
      // Silently fail if audio context is unavailable
    }
  }, [getCtx])

  /**
   * Tick — lighter, higher pitched. Used for checkbox toggle.
   */
  const tick = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(900, now)
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.04)

      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Focus tone — ultra-subtle sine swell. Used when input receives focus.
   */
  const focus = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.04, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

      osc.start(now)
      osc.stop(now + 0.18)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Whoosh — soft filtered noise sweep. Used on loading → page transition.
   */
  const whoosh = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      const duration = 0.4

      const bufferSize = ctx.sampleRate * duration
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = "highpass"
      filter.frequency.setValueAtTime(2000, now)
      filter.frequency.exponentialRampToValueAtTime(8000, now + duration)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      source.start(now)
      source.stop(now + duration)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Hover — ultra-subtle low-volume pip. Used when mousing over interactive elements.
   */
  const hover = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(300, now)
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03)

      gain.gain.setValueAtTime(0.015, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.start(now)
      osc.stop(now + 0.03)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  return { click, tick, focus, whoosh, hover }
}

export default useAudio
