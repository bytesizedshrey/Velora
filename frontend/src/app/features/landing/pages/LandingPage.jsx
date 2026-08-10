import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import LiquidMetalButton from '../../../../components/ui/liquid-metal'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040404',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Ambient background grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />
      
      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 30%, #040404 90%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'center'
      }}>
        {/* Editorial Subheader Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.8 }}>
          <span style={{ height: 1, width: 28, background: 'rgba(255,255,255,0.35)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
            ATELIER & HIGH FASHION
          </span>
          <span style={{ height: 1, width: 28, background: 'rgba(255,255,255,0.35)' }} />
        </div>

        {/* Brand Name */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(5rem, 15vw, 10rem)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#ffffff',
          lineHeight: 1,
          margin: 0,
          textTransform: 'uppercase',
          textShadow: '0 10px 40px rgba(255,255,255,0.1)'
        }}>
          Velora
        </h1>

        {/* Tagline */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: '0.04em',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          Wear Confidence.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {user ? (
            <LiquidMetalButton
              size="lg"
              borderWidth={2}
              onClick={() => navigate('/marketplace')}
              metalConfig={{ colorBack: "#1a1a1a", colorTint: "#d4d4d4", speed: 1.5, distortion: 2.5 }}
              style={{ padding: '0 3rem' }}
            >
              ENTER MARKETPLACE
            </LiquidMetalButton>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '0.8rem 2.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                Log In
              </button>
              
              <LiquidMetalButton
                size="md"
                borderWidth={2}
                onClick={() => navigate('/register')}
                metalConfig={{ colorBack: "#1a1a1a", colorTint: "#d4d4d4", speed: 1, distortion: 2 }}
                style={{ padding: '0 2.5rem' }}
              >
                CREATE ACCOUNT
              </LiquidMetalButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
