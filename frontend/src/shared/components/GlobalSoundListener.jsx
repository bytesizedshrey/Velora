import { useEffect } from 'react'
import useAudio from '../hooks/useAudio'

export const GlobalSoundListener = () => {
  const { click, tick, focus, hover } = useAudio()

  useEffect(() => {
    // 1. Handle Click Events on Interactive Elements
    const handleClick = (e) => {
      const target = e.target.closest('button, a, input[type="checkbox"], input[type="radio"], [role="button"], [data-clickable]')
      if (!target) return

      const text = target.innerText || ''
      if (
        target.matches('input[type="checkbox"], input[type="radio"]') ||
        text.trim() === '+' ||
        text.trim() === '−' ||
        text.trim() === '-'
      ) {
        tick()
      } else {
        click()
      }
    }

    // 2. Handle Focus Events on Input Elements
    const handleFocus = (e) => {
      if (e.target.matches('input, textarea, select')) {
        focus()
      }
    }

    // 3. Handle Mouse Over on Interactive Elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, [role="button"], input, select, textarea, label')
      if (target && !target.dataset.audioHovered) {
        target.dataset.audioHovered = 'true'
        hover()
        setTimeout(() => {
          if (target) delete target.dataset.audioHovered
        }, 120)
      }
    }

    window.addEventListener('click', handleClick, true)
    window.addEventListener('focusin', handleFocus, true)
    window.addEventListener('mouseover', handleMouseOver, true)

    return () => {
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('focusin', handleFocus, true)
      window.removeEventListener('mouseover', handleMouseOver, true)
    }
  }, [click, tick, focus, hover])

  return null
}

export default GlobalSoundListener
