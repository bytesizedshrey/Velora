import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'

/* ─── Icons ──────────────────────────────────────── */
const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const CloudIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
)
const XIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const ChevronDown = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'none' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const ImageIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD']

/* ─── Debossed input field ───────────────────────── */
const Field = ({ id, label, type = 'text', value, onChange, multiline, rows = 3, placeholder = '' }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor={id} style={{
        display: 'block', marginBottom: 5,
        fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: focused ? 'rgba(212,212,212,0.6)' : 'rgba(255,255,255,0.28)',
        fontFamily: 'Inter, system-ui', fontWeight: 600, transition: 'color 0.2s',
      }}>{label}</label>
      <div style={{
        borderRadius: 10, background: '#030303',
        border: focused ? '1px solid rgba(212,212,212,0.22)' : '1px solid #1a1a1a',
        borderTopColor: focused ? 'rgba(212,212,212,0.22)' : '#060606',
        borderLeftColor: focused ? 'rgba(212,212,212,0.22)' : '#060606',
        boxShadow: focused
          ? 'inset 0 3px 8px rgba(0,0,0,0.7),inset 0 1px 3px rgba(0,0,0,0.5),0 0 0 2px rgba(212,212,212,0.06)'
          : 'inset 0 3px 8px rgba(0,0,0,0.6),inset 0 1px 3px rgba(0,0,0,0.4)',
        transition: 'all 0.22s',
      }}>
        {multiline
          ? <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={placeholder}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', padding: '10px 13px', resize: 'none', caretColor: '#d4d4d4', lineHeight: 1.55 }} />
          : <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              autoComplete="off"
              style={{ width: '100%', height: 40, background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', padding: '0 13px', caretColor: '#d4d4d4' }} />
        }
      </div>
    </div>
  )
}

/* ─── Panel card ─────────────────────────────────── */
const Panel = ({ children, style = {} }) => (
  <div style={{
    borderRadius: 18, background: '#0c0c0c',
    borderTop: '1px solid #252525', borderLeft: '1px solid #252525',
    borderRight: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5),0 1px 4px rgba(0,0,0,0.4)',
    padding: '18px 20px', ...style,
  }}>
    {children}
  </div>
)

const PanelLabel = ({ n, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    <span style={{
      fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em',
      color: 'rgba(212,212,212,0.4)', fontFamily: 'Geist, system-ui',
      background: '#101010', borderTop: '1px solid #2a2a2a', borderLeft: '1px solid #2a2a2a',
      borderRight: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f',
      borderRadius: 6, padding: '2px 7px', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }}>{String(n).padStart(2, '0')}</span>
    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.48)', fontFamily: 'Geist, system-ui' }}>{text}</span>
  </div>
)

/* ─── Per-variant image uploader ─────────────────── */
const VariantImageUploader = ({ images, onAdd, onRemove, maxImages = 5 }) => {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (files) => {
    const rem = maxImages - images.length
    const valid = Array.from(files).slice(0, rem).filter(f => f.type.startsWith('image/'))
    onAdd(valid.map(f => ({ file: f, preview: URL.createObjectURL(f) })))
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ImageIcon />
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, system-ui' }}>
          Variant Images&nbsp;<span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 500 }}>({images.length}/{maxImages})</span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Thumbnails */}
        {images.map((img, i) => (
          <div key={i} style={{
            position: 'relative', width: 58, height: 58, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
            borderTop: '1px solid #2a2a2a', borderLeft: '1px solid #2a2a2a',
            borderRight: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e',
            boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
          }}>
            <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {i === 0 && (
              <span style={{
                position: 'absolute', bottom: 3, left: 3,
                fontSize: '0.4rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.85)',
                borderRadius: 3, padding: '1px 4px',
              }}>Cover</span>
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              style={{
                position: 'absolute', top: 3, right: 3,
                width: 16, height: 16, borderRadius: 5,
                background: 'rgba(0,0,0,0.8)', border: '1px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3a0808'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              <XIcon />
            </button>
          </div>
        ))}

        {/* Upload zone */}
        {images.length < maxImages && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            onClick={() => inputRef.current?.click()}
            style={{
              width: 58, height: 58, borderRadius: 10, cursor: 'pointer',
              background: dragOver ? '#0a0a0a' : '#060606',
              border: dragOver ? '1px dashed rgba(212,212,212,0.25)' : '1px dashed rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, color: 'rgba(255,255,255,0.25)', transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={e => handleFiles(e.target.files)} />
            <span style={{ fontSize: 18, lineHeight: 1, color: 'rgba(255,255,255,0.2)' }}>+</span>
            <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.15)', fontWeight: 600, letterSpacing: '0.05em' }}>ADD</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Single variant card ────────────────────────── */
const VariantCard = ({ v, i, total, isOpen, onToggle, onUpdate, onRemove, onAddImages, onRemoveImage }) => (
  <div style={{
    borderRadius: 14,
    background: isOpen ? '#0a0a0a' : '#080808',
    borderTop: isOpen ? '1px solid #2c2c2c' : '1px solid #1c1c1c',
    borderLeft: isOpen ? '1px solid #2c2c2c' : '1px solid #1c1c1c',
    borderRight: '1px solid #060606',
    borderBottom: '1px solid #060606',
    boxShadow: isOpen ? '0 6px 20px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)' : '0 2px 8px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    transition: 'all 0.2s',
  }}>
    {/* Header */}
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '100%', padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer', outline: 'none',
      }}
    >
      {/* Cover thumbnail */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
        background: '#111',
        borderTop: '1px solid #222', borderLeft: '1px solid #222',
        borderRight: '1px solid #080808', borderBottom: '1px solid #080808',
      }}>
        {v.images && v.images.length > 0
          ? <img src={v.images[0].preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.12)' }}>
              <ImageIcon />
            </div>
        }
      </div>

      {/* Title & meta */}
      <div style={{ flex: 1, textAlign: 'left' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.72)', fontFamily: 'Inter, system-ui' }}>
          {v.title || `Variant ${i + 1}`}
        </p>
        <p style={{ margin: 0, fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
          {[v.color, v.size].filter(Boolean).join(' · ') || 'No attributes set'}
          {v.images?.length > 0 && <span style={{ color: 'rgba(255,255,255,0.18)', marginLeft: 6 }}>· {v.images.length} image{v.images.length > 1 ? 's' : ''}</span>}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {total > 1 && (
          <span
            onClick={e => { e.stopPropagation(); onRemove() }}
            style={{ fontSize: '0.62rem', color: '#f87171', cursor: 'pointer', padding: '2px 6px',
              borderRadius: 5, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}
          >
            Remove
          </span>
        )}
        <span style={{ color: 'rgba(255,255,255,0.22)' }}><ChevronDown open={isOpen} /></span>
      </div>
    </button>

    {/* Body — only rendered when open */}
    {isOpen && (
      <div style={{ padding: '4px 14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Row 1: title + color */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field id={`v-title-${i}`} label="Variant Title" value={v.title}
            onChange={e => onUpdate('title', e.target.value)} placeholder="e.g. Space Black" />
          <Field id={`v-color-${i}`} label="Color" value={v.color}
            onChange={e => onUpdate('color', e.target.value)} placeholder="e.g. Black" />
        </div>
        {/* Row 2: size + stock + price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <Field id={`v-size-${i}`} label="Size (Opt)" value={v.size}
            onChange={e => onUpdate('size', e.target.value)} placeholder="e.g. XL" />
          <Field id={`v-stock-${i}`} label="Stock" type="number" value={v.stock}
            onChange={e => onUpdate('stock', e.target.value)} />
          <Field id={`v-price-${i}`} label="Custom Price" type="number" value={v.priceAmount}
            onChange={e => onUpdate('priceAmount', e.target.value)} placeholder="Override" />
        </div>
        {/* Per-variant images */}
        <div style={{
          padding: '12px 12px 14px', borderRadius: 10,
          background: '#060606',
          borderTop: '1px solid #0a0a0a', borderLeft: '1px solid #0a0a0a',
          borderRight: '1px solid #141414', borderBottom: '1px solid #141414',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
        }}>
          <VariantImageUploader
            images={v.images || []}
            onAdd={imgs => onAddImages(imgs)}
            onRemove={idx => onRemoveImage(idx)}
          />
        </div>
      </div>
    )}
  </div>
)

/* ─── Main CreateProduct ─────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct()
  const coverInputRef = useRef(null)

  const [form, setForm] = useState({ title: '', description: '', priceAmount: '', priceCurrency: 'INR', stock: '100' })
  const [coverImages, setCoverImages] = useState([])   // global fallback images
  const [coverDragOver, setCoverDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [btnDown, setBtnDown] = useState(false)
  const [expandedVariant, setExpandedVariant] = useState(0)

  const [variantList, setVariantList] = useState([
    { title: 'Standard', color: '', size: '', stock: '100', priceAmount: '', images: [] }
  ])

  useEffect(() => {
    gsap.fromTo('[data-anim]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
  }, [])

  const set = f => e => { setError(null); setForm(p => ({ ...p, [f]: e.target.value })) }

  const addCoverImages = files => {
    const rem = 7 - coverImages.length
    const valid = Array.from(files).slice(0, rem).filter(f => f.type.startsWith('image/'))
    setCoverImages(p => [...p, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }))])
  }
  const removeCoverImage = i => setCoverImages(p => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i) })

  const addVariant = () => {
    const idx = variantList.length
    setVariantList(prev => [...prev, { title: `Variant ${idx + 1}`, color: '', size: '', stock: form.stock || '100', priceAmount: '', images: [] }])
    setExpandedVariant(idx)
  }

  const updateVariant = (i, field, value) =>
    setVariantList(prev => prev.map((v, j) => j === i ? { ...v, [field]: value } : v))

  const removeVariant = i => {
    if (variantList.length <= 1) return
    setVariantList(prev => prev.filter((_, j) => j !== i))
    setExpandedVariant(prev => prev >= i && prev > 0 ? prev - 1 : prev)
  }

  const addVariantImages = (i, imgs) =>
    setVariantList(prev => prev.map((v, j) => j === i ? { ...v, images: [...(v.images || []), ...imgs].slice(0, 5) } : v))

  const removeVariantImage = (varIdx, imgIdx) =>
    setVariantList(prev => prev.map((v, j) => {
      if (j !== varIdx) return v
      const imgs = [...(v.images || [])]
      URL.revokeObjectURL(imgs[imgIdx].preview)
      imgs.splice(imgIdx, 1)
      return { ...v, images: imgs }
    }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.description || !form.priceAmount) return setError('Fill all required fields.')

    // At least one variant needs images, or cover images must exist
    const hasVariantImages = variantList.some(v => v.images?.length > 0)
    if (!hasVariantImages && !coverImages.length) return setError('Add at least one image to a variant or cover images.')

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('priceAmount', form.priceAmount)
      fd.append('priceCurrency', form.priceCurrency)
      fd.append('stock', form.stock || '100')

      // Append cover images first, then per-variant images in sequence
      // Track imageStartIndex per variant
      let imageOffset = 0
      if (coverImages.length > 0) {
        coverImages.forEach(img => fd.append('images', img.file))
        imageOffset += coverImages.length
      }

      // Per-variant images
      const variantImageOffsets = variantList.map(v => {
        const start = imageOffset
        const count = v.images?.length || 0
        if (count > 0) {
          v.images.forEach(img => fd.append('images', img.file))
          imageOffset += count
        }
        return { start, count }
      })

      const formattedVariants = variantList.map((v, i) => ({
        title: v.title || 'Standard',
        stock: Number(v.stock || form.stock || 100),
        priceAmount: v.priceAmount ? Number(v.priceAmount) : Number(form.priceAmount),
        priceCurrency: form.priceCurrency,
        attributes: {
          ...(v.color ? { Color: v.color } : {}),
          ...(v.size ? { Size: v.size } : {}),
        },
        imageStartIndex: variantImageOffsets[i].start,
        imageCount: variantImageOffsets[i].count,
      }))

      fd.append('variants', JSON.stringify(formattedVariants))
      await handleCreateProduct(fd)
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', overflowY: 'auto', background: '#040404', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui', paddingBottom: 60 }}>

      {/* ── Header ── */}
      <header data-anim style={{
        height: 50, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#070707', borderBottom: '1px solid #0c0c0c', borderTop: '1px solid #1e1e1e',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" style={{
            width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
            background: '#101010', borderTop: '1px solid #282828', borderLeft: '1px solid #282828',
            borderRight: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)',
          }}><BackIcon /></button>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', fontWeight: 600 }}>
            Velora · New Collection Piece
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 8,
          background: '#060606', borderTop: '1px solid #0a0a0a', borderLeft: '1px solid #0a0a0a',
          borderRight: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2c2c2c', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)' }} />
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>Draft</span>
        </div>
      </header>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate style={{
        flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 12, padding: '14px 18px', maxWidth: 1080, width: '100%', margin: '0 auto',
      }}>

        {/* LEFT COLUMN */}
        <div data-anim style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 01 — Product Details */}
          <Panel>
            <PanelLabel n={1} text="Product Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field id="title" label="Title *" value={form.title} onChange={set('title')} placeholder="e.g. Empress Black Boxy Tee" />
              <Field id="description" label="Description *" multiline rows={3} value={form.description} onChange={set('description')} placeholder="Detail the craftsmanship, specs, and materials..." />
            </div>
          </Panel>

          {/* 02 — Pricing & Base Inventory */}
          <Panel>
            <PanelLabel n={2} text="Pricing & Base Inventory" />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 90, flexShrink: 0 }}>
                <label style={{ display: 'block', marginBottom: 5, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Currency</label>
                <div style={{ borderRadius: 10, background: '#030303', borderTop: '1px solid #0d0d0d', borderLeft: '1px solid #0d0d0d', borderRight: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6)' }}>
                  <select value={form.priceCurrency} onChange={set('priceCurrency')} style={{ width: '100%', height: 40, padding: '0 10px', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', cursor: 'pointer', appearance: 'none' }}>
                    {CURRENCIES.map(c => <option key={c} value={c} style={{ background: '#0c0c0c' }}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Field id="priceAmount" label="Base Price *" type="number" value={form.priceAmount} onChange={set('priceAmount')} placeholder="e.g. 14999" />
              </div>
              <div style={{ width: 100, flexShrink: 0 }}>
                <Field id="stock" label="Base Stock" type="number" value={form.stock} onChange={set('stock')} />
              </div>
            </div>
          </Panel>

          {/* 03 — Product Variants (collapsible cards) */}
          <Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <PanelLabel n={3} text="Product Variants" />
              <button
                type="button"
                onClick={addVariant}
                style={{
                  fontSize: '0.65rem', fontWeight: 700, color: '#34d399',
                  background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
                  padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>+</span> Add Variant
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {variantList.map((v, i) => (
                <VariantCard
                  key={i}
                  v={v}
                  i={i}
                  total={variantList.length}
                  isOpen={expandedVariant === i}
                  onToggle={() => setExpandedVariant(expandedVariant === i ? null : i)}
                  onUpdate={(field, value) => updateVariant(i, field, value)}
                  onRemove={() => removeVariant(i)}
                  onAddImages={imgs => addVariantImages(i, imgs)}
                  onRemoveImage={imgIdx => removeVariantImage(i, imgIdx)}
                />
              ))}
            </div>

            <p style={{ margin: '12px 0 0', fontSize: '0.62rem', color: 'rgba(255,255,255,0.16)', lineHeight: 1.6 }}>
              Each variant has its own images, stock, and price. Expand a card to configure it.
            </p>
          </Panel>
        </div>

        {/* RIGHT COLUMN — Cover / fallback images */}
        <div data-anim style={{ display: 'flex', flexDirection: 'column' }}>
          <Panel style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <PanelLabel n={4} text="Cover / Fallback Images" />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>{coverImages.length} / 7</span>
            </div>

            <p style={{ margin: '0 0 14px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
              Used as product thumbnail and shown when a variant has no images. Drag &amp; drop up to 7 images.
            </p>

            {coverImages.length < 7 && (
              <div
                onDragOver={e => { e.preventDefault(); setCoverDragOver(true) }}
                onDragLeave={() => setCoverDragOver(false)}
                onDrop={e => { e.preventDefault(); setCoverDragOver(false); addCoverImages(e.dataTransfer.files) }}
                onClick={() => coverInputRef.current?.click()}
                style={{
                  borderRadius: 12,
                  background: coverDragOver ? '#080808' : '#060606',
                  borderTop: '1px solid #0a0a0a', borderLeft: '1px solid #0a0a0a',
                  borderRight: coverDragOver ? '1px solid rgba(212,212,212,0.15)' : '1px solid #1c1c1c',
                  borderBottom: coverDragOver ? '1px solid rgba(212,212,212,0.15)' : '1px solid #1c1c1c',
                  boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.6)',
                  padding: coverImages.length > 0 ? '14px 20px' : '30px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  marginBottom: coverImages.length > 0 ? 10 : 0,
                }}
              >
                <input ref={coverInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                  onChange={e => addCoverImages(e.target.files)} />
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: '#101010', borderTop: '1px solid #282828', borderLeft: '1px solid #282828',
                  borderRight: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(212,212,212,0.4)',
                }}>
                  <CloudIcon />
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                    {coverDragOver ? 'Release to upload' : 'Drag & drop or click'}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.15)', marginTop: 2 }}>
                    PNG, JPG, WEBP · max 5MB · {7 - coverImages.length} left
                  </p>
                </div>
              </div>
            )}

            {coverImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, alignContent: 'start' }}>
                {coverImages.map((img, i) => (
                  <div key={i} style={{
                    position: 'relative', aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden',
                    borderTop: '1px solid #2a2a2a', borderLeft: '1px solid #2a2a2a',
                    borderRight: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.5)', transition: 'transform 0.2s,box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.5)' }}
                  >
                    <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', bottom: 5, left: 5,
                        fontSize: '0.48rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'rgba(212,212,212,0.9)', fontWeight: 700, padding: '2px 6px', borderRadius: 5,
                        background: 'rgba(0,0,0,0.85)', borderTop: '1px solid #333', borderLeft: '1px solid #333',
                        borderRight: '1px solid #111', borderBottom: '1px solid #111',
                      }}>Cover</span>
                    )}
                    <button type="button" onClick={() => removeCoverImage(i)} style={{
                      position: 'absolute', top: 5, right: 5, width: 20, height: 20, borderRadius: 6,
                      background: 'rgba(0,0,0,0.85)', borderTop: '1px solid #333', borderLeft: '1px solid #333',
                      borderRight: '1px solid #111', borderBottom: '1px solid #111',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#3a0808'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.85)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                    ><XIcon /></button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* BOTTOM ROW — error + submit */}
        <div data-anim style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: '#150a0a', border: '1px solid #2e1010', color: 'rgba(255,100,100,0.9)', fontSize: '0.8rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <button
              type="submit"
              disabled={loading}
              onMouseDown={() => setBtnDown(true)}
              onMouseUp={() => setBtnDown(false)}
              onMouseLeave={() => setBtnDown(false)}
              style={{
                width: 240, height: 44, borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Geist, system-ui', fontSize: '0.82rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.82)',
                background: btnDown ? '#080808' : '#121212',
                borderTop: btnDown ? '1px solid #0e0e0e' : '1px solid #2c2c2c',
                borderLeft: btnDown ? '1px solid #0e0e0e' : '1px solid #2c2c2c',
                borderRight: btnDown ? '1px solid #2c2c2c' : '1px solid #0e0e0e',
                borderBottom: btnDown ? '1px solid #2c2c2c' : '1px solid #0e0e0e',
                boxShadow: btnDown ? 'inset 0 3px 8px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.5),0 1px 3px rgba(0,0,0,0.4)',
                transform: btnDown ? 'translateY(1px)' : 'none',
                transition: 'all 0.1s', opacity: loading ? 0.5 : 1,
              }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Publishing...
                  </span>
                : 'Publish Listing'
              }
            </button>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.14)', whiteSpace: 'nowrap' }}>
              Goes live immediately · {variantList.length} variant{variantList.length > 1 ? 's' : ''} configured
            </p>
          </div>
        </div>

      </form>
    </div>
  )
}

export default CreateProduct