import React from 'react'
import { useSelector } from 'react-redux'
import AsciiArt from '../../../../components/ui/ascii-art'

const HeroSection = ({ totalProductsCount = 0 }) => {
  const { user } = useSelector((state) => state.auth)
  const username = user?.fullname || user?.name || 'MEMBER'
  const greetingText = `HELLO, ${username.toUpperCase()}`

  return (
    <div
      data-anim
      style={{
        borderRadius: 18,
        background: '#0a0a0a',
        borderTop: '1px solid #202020',
        borderLeft: '1px solid #202020',
        borderRight: '1px solid #060606',
        borderBottom: '1px solid #060606',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: '30%',
          width: 400,
          height: 200,
          background: 'radial-gradient(ellipse, rgba(212,212,212,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
        <h1
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          Velora
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.5,
            margin: 0,
            letterSpacing: '0.01em',
          }}
        >
          Modern ready-to-wear & timeless luxury essentials.
        </p>
      </div>

      {/* Aceternity ASCII Art Component displaying Hello + Username */}
      <div style={{ flexShrink: 0, zIndex: 1, width: 230 }}>
        <AsciiArt text={greetingText} />
      </div>
    </div>
  )
}

export default HeroSection
