import React from 'react'
import { ShoppingBagIcon } from '../../../../shared/icons'

const EmptyState = ({ searchQuery = '' }) => {
  return (
    <div
      data-anim
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        borderRadius: 16,
        background: '#080808',
        borderTop: '1px solid #0a0a0a',
        borderLeft: '1px solid #0a0a0a',
        borderRight: '1px solid #1c1c1c',
        borderBottom: '1px solid #1c1c1c',
        boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: '#141414',
          borderTop: '1px solid #242424',
          borderLeft: '1px solid #242424',
          borderRight: '1px solid #0c0c0c',
          borderBottom: '1px solid #0c0c0c',
          boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
          display: 'grid',
          placeItems: 'center',
          color: 'rgba(212,212,212,0.4)',
        }}
      >
        <ShoppingBagIcon />
      </div>
      <div>
        <h3
          style={{
            fontFamily: 'Geist, system-ui',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {searchQuery ? 'No matching products found' : 'No products available right now'}
        </h3>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.25)',
            marginTop: 4,
            maxWidth: 360,
          }}
        >
          {searchQuery
            ? 'Try searching for another keyword.'
            : 'Check back soon for new luxury listing releases.'}
        </p>
      </div>
    </div>
  )
}

export default EmptyState
