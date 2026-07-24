import React from 'react'
import { GridIcon, ListIcon } from '../../../../shared/icons'
import { SORT_OPTIONS } from '../utils/constants'

const MarketplaceToolbar = ({
  filteredCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div
      data-anim
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        background: '#0e0e0e',
        padding: '12px 16px',
        borderRadius: 14,
        borderTop: '1px solid #202020',
        borderLeft: '1px solid #202020',
        borderRight: '1px solid #060606',
        borderBottom: '1px solid #060606',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      {/* Item count text */}
      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
        Showing <strong style={{ color: '#ffffff' }}>{filteredCount}</strong>{' '}
        {filteredCount === 1 ? 'product' : 'products'}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Sort Dropdown */}
        <div
          style={{
            borderRadius: 9,
            background: '#060606',
            borderTop: '1px solid #080808',
            borderLeft: '1px solid #080808',
            borderRight: '1px solid #1a1a1a',
            borderBottom: '1px solid #1a1a1a',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              height: 36,
              padding: '0 14px',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.78rem',
              fontFamily: 'Inter, system-ui',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#0e0e0e' }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Rocker Switch */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#060606',
            borderRadius: 10,
            padding: 3,
            gap: 3,
            borderTop: '1px solid #080808',
            borderLeft: '1px solid #080808',
            borderRight: '1px solid #1a1a1a',
            borderBottom: '1px solid #1a1a1a',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              boxSizing: 'border-box',
              border: viewMode === 'grid' ? '1px solid #282828' : '1px solid transparent',
              background: viewMode === 'grid' ? '#161616' : 'transparent',
              color: viewMode === 'grid' ? '#ffffff' : 'rgba(255,255,255,0.25)',
              boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.6)' : 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: 0,
              transition: 'all 0.15s',
            }}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              boxSizing: 'border-box',
              border: viewMode === 'list' ? '1px solid #282828' : '1px solid transparent',
              background: viewMode === 'list' ? '#161616' : 'transparent',
              color: viewMode === 'list' ? '#ffffff' : 'rgba(255,255,255,0.25)',
              boxShadow: viewMode === 'list' ? '0 2px 6px rgba(0,0,0,0.6)' : 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              padding: 0,
              transition: 'all 0.15s',
            }}
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceToolbar
