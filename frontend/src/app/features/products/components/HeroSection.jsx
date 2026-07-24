import React from 'react'
import { SparklesIcon } from '../../../../shared/icons'

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const HeroSection = ({ totalProductsCount = 0, searchQuery = '', onSearchChange }) => {
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
        {/* Search Bar Input (Replaced Curated Marketplace Pill) */}
        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.3)',
              display: 'flex',
              pointerEvents: 'none',
            }}
          >
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            style={{
              width: '100%',
              height: 38,
              padding: '0 12px 0 34px',
              borderRadius: 10,
              background: '#060606',
              borderTop: '1px solid #080808',
              borderLeft: '1px solid #080808',
              borderRight: '1px solid #1a1a1a',
              borderBottom: '1px solid #1a1a1a',
              boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.82rem',
              fontFamily: 'Inter, system-ui',
              outline: 'none',
            }}
          />
        </div>
        <h1
          style={{
            fontFamily: "'Colleged', 'Bungee', 'Graduate', system-ui",
            fontSize: '2.2rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 8,
          }}
        >
          Velora Luxury Collection
        </h1>
        <p
          style={{
            fontFamily: "'Duality', 'Orbitron', 'Rajdhani', system-ui",
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.5,
            margin: 0,
            letterSpacing: '0.02em',
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
