import { useRef, useState, useEffect } from "react"
import { gsap } from "gsap"

import AuthLayout from "../components/AuthLayout"
import LoginHeader from "../components/LoginHeader"
import LoginForm from "../components/LoginForm"
import LoadingScreen from "../../../../shared/components/loading/LoadingScreen"
import useAudio from "../../../../shared/hooks/useAudio"

/**
 * Login — Page
 */
const Login = () => {
  const [loadingVisible, setLoadingVisible] = useState(true)
  const [loadingMounted, setLoadingMounted] = useState(true)

  const rightPanelRef = useRef(null)
  const leftPanelRef = useRef(null)
  const ambientRef = useRef(null)
  const { whoosh } = useAudio()

  // ── Dismiss loading after 1.8s ────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoadingVisible(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  // ── Entrance animation — fires when loading unmounts ──────────────
  useEffect(() => {
    if (loadingMounted) return

    whoosh()

    const ctx = gsap.context(() => {
      // Set initial states FIRST
      gsap.set(".auth-layout__right", { opacity: 0, x: 28 })
      gsap.set(".auth-layout__display-text", { opacity: 0, y: 36, scale: 0.94 })
      gsap.set([".auth-layout__divider", ".auth-layout__tagline", ".auth-layout__stats"], { opacity: 0, y: 10 })
      gsap.set(".login-header-eyebrow", { opacity: 0, y: -8 })
      gsap.set(".login-heading-word", { opacity: 0, y: 18 })
      gsap.set(".login-header-subtitle", { opacity: 0, y: 8 })
      gsap.set(".form-field", { opacity: 0, y: 14 })

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

      // Right panel
      tl.to(".auth-layout__right", { opacity: 1, x: 0, duration: 0.85 })

      // Left panel
      tl.to(".auth-layout__display-text", { opacity: 1, y: 0, scale: 1, duration: 1.1 }, "-=0.65")
      tl.to(
        [".auth-layout__divider", ".auth-layout__tagline", ".auth-layout__stats"],
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 },
        "-=0.6"
      )

      // Header
      tl.to(".login-header-eyebrow", { opacity: 1, y: 0, duration: 0.45 }, "-=0.75")
      tl.to(".login-heading-word", { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 }, "-=0.4")
      tl.to(".login-header-subtitle", { opacity: 1, y: 0, duration: 0.45 }, "-=0.4")

      // Form fields
      tl.to(".form-field", { opacity: 1, y: 0, duration: 0.4, stagger: 0.065 }, "-=0.3")
    })

    return () => ctx.revert()
  }, [loadingMounted])

  // ── Ambient orb float — starts after loading gone ─────────────────
  useEffect(() => {
    if (loadingMounted) return

    const ctx = gsap.context(() => {
      gsap.to(".orb--1", { y: -24, duration: 5, ease: "sine.inOut", repeat: -1, yoyo: true })
      gsap.to(".orb--2", { y: 18, x: 10, duration: 6.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1 })
      gsap.to(".orb--3", { y: -14, x: -8, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2 })
    }, ambientRef)

    return () => ctx.revert()
  }, [loadingMounted])

  return (
    <>
      {loadingMounted && (
        <LoadingScreen
          isVisible={loadingVisible}
          onComplete={() => setLoadingMounted(false)}
        />
      )}

      <AuthLayout
        leftPanelRef={leftPanelRef}
        rightPanelRef={rightPanelRef}
        ambientRef={ambientRef}
      >
        <LoginHeader />
        <LoginForm />
      </AuthLayout>
    </>
  )
}

export default Login