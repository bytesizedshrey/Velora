import React from 'react'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

export const VariantSelector = ({
  varients = [],
  mainImages = [],
  selectedVariantIdx = 0,
  onSelectVariantIdx,
  selectedAttributes = {},
  onSelectAttribute,
}) => {
  const hasVariants = varients && varients.length > 0
  const hasImages = mainImages && mainImages.length > 1

  if (!hasVariants && !hasImages) return null

  // Collect all unique attribute keys and values across variants
  const attributeGroups = {}

  if (hasVariants) {
    varients.forEach((variant) => {
      const attrObj = variant.attribute
        ? (variant.attribute instanceof Map
            ? Object.fromEntries(variant.attribute)
            : typeof variant.attribute === 'object'
            ? variant.attribute
            : {})
        : {}

      Object.entries(attrObj).forEach(([key, val]) => {
        if (!val) return
        if (!attributeGroups[key]) {
          attributeGroups[key] = new Set()
        }
        attributeGroups[key].add(String(val))
      })
    })
  }

  const groupKeys = Object.keys(attributeGroups)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 12 }}>

      {/* ── 1. Attribute Key-Value Pills (If Attribute Map Exists) ── */}
      {groupKeys.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {groupKeys.map((groupKey) => {
            const values = Array.from(attributeGroups[groupKey])
            const currentSelected = selectedAttributes[groupKey] || values[0]

            return (
              <div key={groupKey}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 10,
                    display: 'block',
                    fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui, sans-serif",
                  }}
                >
                  Select {groupKey}: <strong style={{ color: '#ffffff', fontWeight: 600 }}>{currentSelected}</strong>
                </span>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {values.map((val) => {
                    const isSelected = currentSelected === val

                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onSelectAttribute && onSelectAttribute(groupKey, val)}
                        style={{
                          height: 38,
                          padding: '0 16px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: isSelected ? 700 : 500,
                          fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui, sans-serif",
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          outline: 'none',
                          transition: 'all 0.15s ease',
                          background: isSelected
                            ? 'linear-gradient(180deg, #2a2a2a 0%, #141414 100%)'
                            : 'linear-gradient(180deg, #111111 0%, #080808 100%)',
                          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.6)',
                          borderTop: isSelected ? '1px solid #444444' : '1px solid #202020',
                          borderLeft: isSelected ? '1px solid #444444' : '1px solid #202020',
                          borderRight: '1px solid #060606',
                          borderBottom: '1px solid #060606',
                          boxShadow: isSelected
                            ? '0 6px 18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)'
                            : '0 2px 8px rgba(0,0,0,0.5)',
                        }}
                      >
                        {isSelected && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#34d399',
                              boxShadow: '0 0 6px rgba(52,211,153,0.9)',
                            }}
                          />
                        )}
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── 2. Direct Variant / Style Cards Selection ── */}
      <div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 10,
            display: 'block',
            fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui, sans-serif",
          }}
        >
          {hasVariants ? 'Available Variants' : 'Product Styles / Angle Views'}
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
          {(hasVariants ? varients : mainImages).map((item, idx) => {
            const isSelected = selectedVariantIdx === idx
            const imgSrc = hasVariants
              ? (item.images?.[0]?.url || DEFAULT_PRODUCT_IMAGE)
              : (item.url || DEFAULT_PRODUCT_IMAGE)

            const attrString = hasVariants && item.attribute
              ? (item.attribute instanceof Map
                  ? Array.from(item.attribute.values()).join(' / ')
                  : typeof item.attribute === 'object'
                  ? Object.values(item.attribute).filter(Boolean).join(' / ')
                  : String(item.attribute))
              : ''

            const displayTitle = attrString || (hasVariants ? `Variant ${idx + 1}` : `Style ${idx + 1}`)
            const priceVal = hasVariants && item.price?.amount ? `${item.price.currency || 'INR'} ${Number(item.price.amount).toLocaleString('en-IN')}` : null

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectVariantIdx && onSelectVariantIdx(idx)}
                style={{
                  padding: 10,
                  borderRadius: 14,
                  background: isSelected
                    ? 'linear-gradient(180deg, #222222 0%, #101010 100%)'
                    : 'linear-gradient(180deg, #0e0e0e 0%, #060606 100%)',
                  borderTop: isSelected ? '1px solid #444444' : '1px solid #1c1c1c',
                  borderLeft: isSelected ? '1px solid #444444' : '1px solid #1c1c1c',
                  borderRight: '1px solid #050505',
                  borderBottom: '1px solid #050505',
                  boxShadow: isSelected
                    ? '0 8px 24px #000000, 0 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
                    : '0 4px 12px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', background: '#000', position: 'relative' }}>
                  <img src={imgSrc} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(34,197,94,0.8)',
                      }}
                    >
                      <svg width="10" height="10" fill="none" stroke="#000000" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Title & Price */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: isSelected ? 700 : 600, color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whitespace: 'nowrap' }}>
                    {displayTitle}
                  </p>
                  {priceVal && (
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0 0' }}>
                      {priceVal}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default VariantSelector
