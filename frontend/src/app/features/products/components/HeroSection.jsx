import React from 'react'
import { SparklesIcon } from '../../../../shared/icons'

const HeroSection = ({ totalProductsCount = 0 }) => {
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
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 6,
            background: '#141414',
            border: '1px solid #222222',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(212,212,212,0.6)',
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          <SparklesIcon /> Curated Marketplace
        </div>
        <h1
          style={{
            fontFamily: 'Geist, system-ui',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Velora Luxury Collection
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Explore premium products crafted and verified by trusted global sellers. High-artisan goods, electronics, and rare collectibles.
        </p>
      </div>

      {/* Quick Stats Plaque */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          position: 'relative',
          zIndex: 1,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            background: '#060606',
            borderTop: '1px solid #080808',
            borderLeft: '1px solid #080808',
            borderRight: '1px solid #1a1a1a',
            borderBottom: '1px solid #1a1a1a',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontSize: '0.58rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.25)',
              margin: 0,
              fontWeight: 600,
            }}
          >
            Active Goods
          </p>
          <h4
            style={{
              fontFamily: 'Geist, system-ui',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
            }}
          >
            {totalProductsCount} Items
          </h4>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
