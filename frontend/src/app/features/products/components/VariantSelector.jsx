import React from 'react'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'
import { getAttrObj, resolveVariantImages } from '../utils/variantHelper'

const StockBadge = ({ stock }) => {
  if (stock === undefined || stock === null) return null
  const n = Number(stock)
  const isOut = n === 0
  const isLow = n > 0 && n < 10
  const color = isOut ? '#f87171' : isLow ? '#fbbf24' : '#34d399'
  const bg = isOut ? 'rgba(248,113,113,0.08)' : isLow ? 'rgba(251,191,36,0.08)' : 'rgba(52,211,153,0.08)'
  const border = isOut ? 'rgba(248,113,113,0.2)' : isLow ? 'rgba(251,191,36,0.2)' : 'rgba(52,211,153,0.2)'
  const label = isOut ? 'Out of stock' : isLow ? `${n} left` : 'In stock'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 6, padding: '2px 7px',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }} />
      {label}
    </span>
  )
}

export const VariantSelector = ({
  variants = [],
  varients = [],
  mainImages = [],
  selectedVariantIdx = 0,
  onSelectVariantIdx,
  selectedAttributes = {},
  onSelectAttribute,
}) => {
  const variantsList = (variants && variants.length > 0) ? variants : varients
  const hasVariants = variantsList && variantsList.length > 0
  const activeVar = hasVariants ? (variantsList[selectedVariantIdx] || variantsList[0]) : null

  // Collect ONLY real attribute keys and values present on variants in database
  const attributeGroups = {}
  if (hasVariants) {
    variantsList.forEach((v) => {
      const attrObj = getAttrObj(v.attributes || v.attribute)
      Object.entries(attrObj).forEach(([key, val]) => {
        if (!val || key === 'Style') return
        if (!attributeGroups[key]) attributeGroups[key] = new Set()
        attributeGroups[key].add(String(val))
      })
    })
  }

  const groupKeys = Object.keys(attributeGroups)

  // Active variant info
  const activeTitle = activeVar?.title || `Variant ${selectedVariantIdx + 1}`
  const activePrice = activeVar?.price?.amount
    ? `${activeVar.price.currency || 'INR'} ${Number(activeVar.price.amount).toLocaleString('en-IN')}`
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 8 }}>

      {/* ── Active Variant Selection Confirmation Banner ── */}
      <div style={{
        padding: '12px 16px',
        borderRadius: 14,
        background: 'linear-gradient(180deg, #141416 0%, #0a0a0c 100%)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 14px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: '#34d399',
            boxShadow: '0 0 8px rgba(52,211,153,0.9)'
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Selected Variant:
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>
            {activeTitle}
          </span>
        </div>
        {activePrice && (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>
            {activePrice}
          </span>
        )}
      </div>

      {/* ── 1. REAL Attribute Selectors (Color, Size, etc. from DB) ── */}
      {groupKeys.length > 0 && groupKeys.map((groupKey) => {
        const values = Array.from(attributeGroups[groupKey])
        if (values.length === 0) return null
        const currentSelected = selectedAttributes[groupKey] || values[0]

        return (
          <div key={groupKey}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                Select {groupKey}: <strong style={{ color: '#fff', fontWeight: 700 }}>{currentSelected}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {values.map((val) => {
                const sel = String(currentSelected).toLowerCase() === String(val).toLowerCase()

                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onSelectAttribute?.(groupKey, val)}
                    style={{
                      height: 38,
                      padding: '0 16px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: sel ? 700 : 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      outline: 'none',
                      transition: 'all 0.15s ease',
                      background: sel
                        ? 'linear-gradient(180deg, #ffffff 0%, #d4d4d4 100%)'
                        : 'linear-gradient(180deg, #141414 0%, #090909 100%)',
                      color: sel ? '#000000' : 'rgba(255,255,255,0.7)',
                      border: sel ? '1px solid #ffffff' : '1px solid #202020',
                      boxShadow: sel
                        ? '0 4px 14px rgba(255,255,255,0.25), inset 0 1px 0 #ffffff'
                        : '0 2px 6px rgba(0,0,0,0.5)',
                      transform: sel ? 'scale(1.02)' : 'scale(1)',
                    }}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* ── 2. All Available Variants Grid (Card for EVERY Variant in DB) ── */}
      {hasVariants && (
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 12, display: 'block',
          }}>
            Available Variants ({variantsList.length})
          </span>

          <div className="pd-variant-grid">
            {variantsList.map((item, idx) => {
              const isSelected = selectedVariantIdx === idx

              // Resolve correct cover image for this variant card
              const resolvedImgs = resolveVariantImages(item, idx, mainImages)
              const firstImg = resolvedImgs[0]
              const imgSrc = firstImg?.url || (typeof firstImg === 'string' ? firstImg : DEFAULT_PRODUCT_IMAGE)
              const imageCount = resolvedImgs.length

              const rawAttr = getAttrObj(item.attributes || item.attribute)
              const attrEntries = Object.entries(rawAttr).filter(([k, v]) => k !== 'Style' && v)
              const displayTitle = item.title || attrEntries.map(([,v]) => v).join(' / ') || `Variant ${idx + 1}`
              const priceVal = item.price?.amount
                ? `${item.price.currency || 'INR'} ${Number(item.price.amount).toLocaleString('en-IN')}`
                : null

              return (
                <VariantCard
                  key={idx}
                  isSelected={isSelected}
                  imgSrc={imgSrc}
                  displayTitle={displayTitle}
                  attrEntries={attrEntries}
                  priceVal={priceVal}
                  stock={item.stock}
                  imageCount={imageCount}
                  onClick={() => onSelectVariantIdx?.(idx)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ── 3. Angle views if no variants exist ── */}
      {!hasVariants && mainImages && mainImages.length > 1 && (
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 12, display: 'block',
          }}>
            Product Angle Views
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 8 }}>
            {mainImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectVariantIdx?.(idx)}
                style={{
                  padding: 0, aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
                  border: selectedVariantIdx === idx ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                  boxShadow: selectedVariantIdx === idx ? '0 0 12px rgba(255,255,255,0.2)' : 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <img src={img.url || DEFAULT_PRODUCT_IMAGE} alt={img.alt || `View ${idx+1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

/* ─── VariantCard Component ─────────────────────────── */
function VariantCard({ isSelected, imgSrc, displayTitle, attrEntries, priceVal, stock, imageCount, onClick }) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 0, borderRadius: 16, outline: 'none', cursor: 'pointer',
        textAlign: 'left', display: 'flex', flexDirection: 'column',
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered && !isSelected ? 'translateY(-3px)' : 'none',
        background: isSelected ? 'linear-gradient(160deg,#1e1e1e,#0e0e0e)' : 'linear-gradient(160deg,#111,#080808)',
        borderTop: isSelected ? '1px solid rgba(255,255,255,0.3)' : (hovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid #1c1c1c'),
        borderLeft: isSelected ? '1px solid rgba(255,255,255,0.3)' : (hovered ? '1px solid rgba(255,255,255,0.15)' : '1px solid #1c1c1c'),
        borderRight: '1px solid #060606',
        borderBottom: '1px solid #060606',
        boxShadow: isSelected
          ? '0 0 0 2px #ffffff, 0 0 24px rgba(255,255,255,0.15), 0 10px 30px rgba(0,0,0,0.8)'
          : hovered
          ? '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 4px 12px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: '#050505', overflow: 'hidden' }}>
        <img
          src={imgSrc}
          alt={displayTitle}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        {/* Selected checkmark */}
        {isSelected && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            width: 22, height: 22, borderRadius: '50%',
            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(34,197,94,0.8)',
          }}>
            <svg width="12" height="12" fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Multi-image count badge */}
        {imageCount > 1 && (
          <div style={{
            position: 'absolute', bottom: 6, left: 6,
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)',
            background: 'rgba(0,0,0,0.75)', borderRadius: 5,
            padding: '2px 6px', backdropFilter: 'blur(4px)',
          }}>
            <svg width="8" height="8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2.5"/>
              <path d="M3 9h18M9 21V9" strokeWidth="2.5"/>
            </svg>
            {imageCount}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ padding: '10px 10px 11px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Title */}
        <p style={{
          fontSize: 12, fontWeight: isSelected ? 700 : 600, margin: 0,
          color: isSelected ? '#fff' : 'rgba(255,255,255,0.75)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {displayTitle}
        </p>

        {/* Attribute pills */}
        {attrEntries.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {attrEntries.slice(0, 3).map(([k, v]) => (
              <span key={k} style={{
                fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                background: 'rgba(255,255,255,0.06)', borderRadius: 4,
                padding: '1px 5px', letterSpacing: '0.04em',
              }}>
                {v}
              </span>
            ))}
          </div>
        )}

        {/* Price & stock row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 1 }}>
          {priceVal && (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              {priceVal}
            </span>
          )}
          <StockBadge stock={stock} />
        </div>
      </div>
    </button>
  )
}

export default VariantSelector
