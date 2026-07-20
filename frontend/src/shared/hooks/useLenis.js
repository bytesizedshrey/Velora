import { useEffect, useRef } from "react"
import Lenis from "lenis"

/**
 * useLenis
 * Creates and manages a Lenis smooth scroll instance.
 *
 * @param {boolean} disabled - Pass true to prevent scroll entirely (auth pages)
 * @returns {React.RefObject} ref to the Lenis instance (for external control)
 */
const useLenis = (disabled = false) => {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (disabled) {
      // Lock scroll for pages that shouldn't scroll (auth, modals, etc.)
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
      return () => {
        document.documentElement.style.overflow = ""
        document.body.style.overflow = ""
      }
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // RAF loop
    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [disabled])

  return lenisRef
}

export default useLenis
