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
        borderRadius: 24,
        background: 'linear-gradient(180deg, #111113 0%, #070708 100%)',
        borderTop: '1px solid #2a2a2e',
        borderLeft: '1px solid #2a2a2e',
        borderRight: '1px solid #050505',
        borderBottom: '1px solid #050505',
        boxShadow: '0 16px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: '44px 40px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 32,
      }}
    >
      {/* Editorial High Fashion Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          left: '20%',
          width: 500,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(245,245,240,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
        {/* Editorial Subheader Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ height: 1, width: 28, background: 'rgba(255,255,255,0.35)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
            ATELIER & HIGH FASHION
          </span>
        </div>

        {/* Brand Name — Primary Visual Focus */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3.6rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#ffffff',
            lineHeight: 1.05,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
        >
          By Jessika
        </h1>

        {/* Tagline — Supporting Statement */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.6,
            margin: 0,
            letterSpacing: '0.04em',
          }}
        >
          For the Future She Always Imagined.
        </p>
      </div>

      {/* ASCII Art greeting */}
      <div style={{ flexShrink: 0, zIndex: 1, width: 230 }}>
        <AsciiArt text={greetingText} />
      </div>
    </div>
  )
}

export default HeroSection
