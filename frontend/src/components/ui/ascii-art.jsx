import React, { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"

function playMarioCoinSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    if (ctx.state === "suspended") {
      ctx.resume()
    }

    const now = ctx.currentTime

    // Note 1: B5 (987.77 Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "square"
    osc1.frequency.setValueAtTime(987.77, now)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.08)

    // Note 2: E6 (1318.51 Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "square"
    osc2.frequency.setValueAtTime(1318.51, now + 0.08)
    gain2.gain.setValueAtTime(0.35, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.35)
  } catch (e) {
    // Audio context error fallback
  }
}

export function AsciiArt({
  text = "HELLO",
  subtext = "",
  className = "",
  asciiChars = "01#@$%*+=-:.",
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const mouseRef = useRef({ x: -100, y: -100 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    const width = (canvas.width = 240)
    const height = (canvas.height = 90)

    const fontSize = 10
    const cols = Math.floor(width / fontSize)
    const drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -20))
    const speeds = Array.from({ length: cols }, () => 0.5 + Math.random() * 0.8)

    let time = 0

    const render = () => {
      time += 0.03
      // Clear background with solid pure black
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, width, height)

      ctx.font = "9px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const mouseX = mouseRef.current.x
      const mouseY = mouseRef.current.y

      // 1. Matrix Cascading ASCII Rain
      for (let i = 0; i < cols; i++) {
        const x = i * fontSize + fontSize / 2
        drops[i] += speeds[i]
        if (drops[i] * fontSize > height && Math.random() > 0.95) {
          drops[i] = 0
        }

        const y = drops[i] * fontSize
        const charIdx = Math.floor(Math.abs(Math.sin(i + time + drops[i])) * asciiChars.length) % asciiChars.length
        const char = asciiChars[charIdx] || "."

        // Check proximity to cursor for interactive glow ripple
        const dx = x - mouseX
        const dy = y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const isNearCursor = dist < 45

        if (isNearCursor) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + (1 - dist / 45) * 0.5})`
        } else {
          ctx.fillStyle = hovered ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.1)"
        }

        ctx.fillText(char, x, y)
      }

      // 2. High-Fashion Main Typography with Shimmer Glow
      const glowIntensity = Math.abs(Math.sin(time * 1.5)) * 6 + (hovered ? 14 : 5)
      ctx.font = "bold 13px 'Plus Jakarta Sans', system-ui, sans-serif"
      ctx.fillStyle = hovered ? "#ffffff" : "rgba(255, 255, 255, 0.96)"
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)"
      ctx.shadowBlur = glowIntensity
      ctx.fillText(text, width / 2, height / 2 - (subtext ? 8 : 0))

      if (subtext) {
        ctx.font = "10px monospace"
        ctx.fillStyle = "rgba(255, 255, 255, 0.48)"
        ctx.shadowBlur = 0
        ctx.fillText(subtext, width / 2, height / 2 + 12)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [text, subtext, hovered, asciiChars])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        setHovered(true)
        playMarioCoinSound()
      }}
      onMouseLeave={() => {
        setHovered(false)
        mouseRef.current = { x: -100, y: -100 }
      }}
      onMouseMove={handleMouseMove}
      style={{
        background: "#000000",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 -1px 0 rgba(0, 0, 0, 0.9), 0 12px 32px rgba(0, 0, 0, 0.95)",
        border: "none",
        outline: "none",
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer bg-black",
        className
      )}
    >
      <div
        style={{
          background: "#000000",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.95)",
        }}
        className="rounded-xl p-0.5 bg-black"
      >
        <canvas ref={canvasRef} className="block w-full h-auto rounded-lg pointer-events-none bg-black" />
      </div>
    </div>
  )
}

export default AsciiArt
