import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { PixelatedImageTrail } from "../../../components/ui/pixelated-image-trail"

// Abstract dark-luxury Unsplash images used as the trail effect
const TRAIL_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=400&q=80",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80",
  "https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?w=400&q=80",
]

/**
 * LoadingScreen
 * A reusable fullscreen premium loading screen for Velora.
 *
 * @param {boolean} isVisible - Controls whether the screen is shown
 * @param {function} onComplete - Called when the exit animation completes
 */
const LoadingScreen = ({ isVisible = true, onComplete }) => {
  const overlayRef = useRef(null)
  const logoRef = useRef(null)
  const dotRefs = useRef([])
  const wordRef = useRef(null)

  // Entrance animation
  useEffect(() => {
    if (!isVisible) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Fade in overlay
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      )

      // Logo reveal
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" },
        "-=0.1"
      )

      // Dots pulse
      tl.fromTo(
        dotRefs.current,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.4,
          ease: "back.out(2)",
        },
        "-=0.3"
      )

      // Looping dot pulse
      gsap.to(dotRefs.current, {
        opacity: 0.25,
        stagger: { each: 0.2, repeat: -1, yoyo: true },
        duration: 0.5,
        ease: "sine.inOut",
        delay: 0.8,
      })
    }, overlayRef)

    return () => ctx.revert()
  }, [isVisible])

  // Exit animation
  useEffect(() => {
    if (isVisible) return
    const ctx = gsap.context(() => {
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 1.02,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          onComplete?.()
        },
      })
    }, overlayRef)

    return () => ctx.revert()
  }, [isVisible, onComplete])

  return (
    <div
      ref={overlayRef}
      aria-label="Loading Velora"
      role="status"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#050505",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        overflow: "hidden",
      }}
    >
      {/* Image trail — active across the full loading screen */}
      <PixelatedImageTrail
        images={TRAIL_IMAGES}
        imageSize={180}
        slices={6}
        spawnThreshold={28}
        smoothing={0.28}
        className="absolute inset-0 z-0"
      />

      {/* Center content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          pointerEvents: "none",
        }}
      >
        {/* Logo wordmark */}
        <div
          ref={logoRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 6vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            userSelect: "none",
          }}
        >
          VELORA
        </div>

        {/* Subtitle */}
        <p
          ref={wordRef}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          Premium Marketplace
        </p>

        {/* Loading dots */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient blend */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, #050505, transparent)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

export default LoadingScreen
