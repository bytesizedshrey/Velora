import { useRef, useCallback } from "react"

/**
 * useAudio
 * Synthesizes prominent, crisp UI sound effects using the Web Audio API.
 *
 * Sounds:
 *  - click()   → loud, punchy mechanical pop (button press)
 *  - hover()   → clear airy pop (mouse hover)
 *  - tick()    → crisp transient (stepper, checkbox)
 *  - focus()   → sine tone swell (input focus)
 *  - whoosh()  → filtered noise sweep (transition)
 */
const useAudio = () => {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  /**
   * Tactile Click — loud, punchy mechanical click.
   */
  const click = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      // Primary Click Transient
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.05)

      gain.gain.setValueAtTime(0.55, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

      // Sub-harmonic Body (tactile weight)
      const subOsc = ctx.createOscillator()
      const subGain = ctx.createGain()

      subOsc.connect(subGain)
      subGain.connect(ctx.destination)

      subOsc.type = "triangle"
      subOsc.frequency.setValueAtTime(280, now)
      subOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04)

      subGain.gain.setValueAtTime(0.35, now)
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      osc.start(now)
      osc.stop(now + 0.06)
      subOsc.start(now)
      subOsc.stop(now + 0.05)
    } catch {
      // Silently fail if audio context is restricted
    }
  }, [getCtx])

  /**
   * Hover Pop — clear airy pop when mousing over interactive items.
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
      osc.frequency.setValueAtTime(500, now)
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.03)

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035)

      osc.start(now)
      osc.stop(now + 0.035)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Tick — crisp transient for steppers and checkboxes.
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
      osc.frequency.setValueAtTime(1000, now)
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.04)

      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

      osc.start(now)
      osc.stop(now + 0.045)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Focus tone — swell when input receives focus.
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
      osc.frequency.setValueAtTime(550, now)

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch {
      // Silently fail
    }
  }, [getCtx])

  /**
   * Whoosh — soft noise sweep for page transitions / success.
   */
  const whoosh = useCallback(() => {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime
      const duration = 0.35

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
      filter.frequency.setValueAtTime(1800, now)
      filter.frequency.exponentialRampToValueAtTime(7500, now + duration)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.08, now)
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

  return { click, tick, focus, whoosh, hover }
}

export default useAudio
