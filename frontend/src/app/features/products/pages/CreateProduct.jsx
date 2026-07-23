import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'

const BackIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const CloudIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
)
const XIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ display: 'block' }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD']

/* ─── Skeuomorphic debossed input ─────────────────── */
const Field = ({ id, label, type = 'text', value, onChange, multiline, rows = 3 }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor={id} style={{
        display: 'block', marginBottom: 6,
        fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        color: focused ? 'rgba(212,212,212,0.6)' : 'rgba(255,255,255,0.28)',
        fontFamily: 'Inter, system-ui', fontWeight: 600, transition: 'color 0.2s',
      }}>{label}</label>
      <div style={{
        borderRadius: 10,
        background: '#030303',
        /* debossed: dark top-left, slightly lighter bottom-right */
        border: focused ? '1px solid rgba(212,212,212,0.22)' : '1px solid #1a1a1a',
        borderTopColor: focused ? 'rgba(212,212,212,0.22)' : '#060606',
        borderLeftColor: focused ? 'rgba(212,212,212,0.22)' : '#060606',
        boxShadow: focused
          ? 'inset 0 3px 8px rgba(0,0,0,0.7), inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 2px rgba(212,212,212,0.06)'
          : 'inset 0 3px 8px rgba(0,0,0,0.6), inset 0 1px 3px rgba(0,0,0,0.4)',
        transition: 'all 0.22s',
      }}>
        {multiline
          ? <textarea id={id} rows={rows} value={value} onChange={onChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', padding: '10px 13px', resize: 'none', caretColor: '#d4d4d4', lineHeight: 1.55 }} />
          : <input id={id} type={type} value={value} onChange={onChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              autoComplete="off"
              style={{ width: '100%', height: 43, background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', padding: '0 13px', caretColor: '#d4d4d4' }} />
        }
      </div>
    </div>
  )
}

/* ─── Raised panel (embossed card) ────────────────── */
const Panel = ({ children, style = {} }) => (
  <div style={{
    borderRadius: 18,
    background: '#0c0c0c',
    /* raised feel: lighter top-left border, darker bottom-right */
    borderTop: '1px solid #252525',
    borderLeft: '1px solid #252525',
    borderRight: '1px solid #0e0e0e',
    borderBottom: '1px solid #0e0e0e',
    boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)',
    padding: '18px 20px',
    ...style,
  }}>
    {children}
  </div>
)

const PanelLabel = ({ n, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
    <span style={{
      fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em',
      color: 'rgba(212,212,212,0.4)', fontFamily: 'Geist, system-ui',
      background: '#101010',
      borderTop: '1px solid #2a2a2a', borderLeft: '1px solid #2a2a2a',
      borderRight: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f',
      borderRadius: 6, padding: '2px 7px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
    }}>{String(n).padStart(2, '0')}</span>
    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.48)', fontFamily: 'Geist, system-ui' }}>{text}</span>
  </div>
)

/* ─── Main ─────────────────────────────────────────── */
const CreateProduct = () => {
  const { handleCreateProduct } = useProduct()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', priceAmount: '', priceCurrency: 'INR' })
  const [images, setImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [btnDown, setBtnDown] = useState(false)

  useEffect(() => {
    gsap.fromTo('[data-anim]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
  }, [])

  const set = f => e => { setError(null); setForm(p => ({ ...p, [f]: e.target.value })) }
  const addImages = files => {
    const rem = 7 - images.length
    const valid = Array.from(files).slice(0, rem).filter(f => f.type.startsWith('image/'))
    setImages(p => [...p, ...valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }))])
  }
  const removeImage = i => setImages(p => { URL.revokeObjectURL(p[i].preview); return p.filter((_, j) => j !== i) })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.description || !form.priceAmount) return setError('Fill all required fields.')
    if (!images.length) return setError('Add at least one image.')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries({ title: form.title, description: form.description, priceAmount: form.priceAmount, priceCurrency: form.priceCurrency }).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img.file))
      await handleCreateProduct(fd)
    } catch (err) { setError(err?.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ height: '100dvh', overflow: 'hidden', background: '#040404', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui' }}>

      {/* ── Header ─────────────────────────── */}
      <header data-anim style={{
        height: 50, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#070707',
        borderBottom: '1px solid #0c0c0c',
        borderTop: '1px solid #1e1e1e',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Raised back button */}
          <button type="button" style={{
            width: 28, height: 28, borderRadius: 8, cursor: 'pointer',
            background: '#101010',
            borderTop: '1px solid #282828',
            borderLeft: '1px solid #282828',
            borderRight: '1px solid #0e0e0e',
            borderBottom: '1px solid #0e0e0e',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.35)',
          }}>
            <BackIcon />
          </button>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', fontWeight: 600 }}>
            Velora · New Listing
          </span>
        </div>
        {/* Draft chip — debossed */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 8,
          background: '#060606',
          borderTop: '1px solid #0a0a0a', borderLeft: '1px solid #0a0a0a',
          borderRight: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2c2c2c', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)' }} />
          <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>Draft</span>
        </div>
      </header>

      {/* ── Grid Body ──────────────────────── */}
      <form onSubmit={handleSubmit} noValidate style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr auto',
        gap: 12, padding: '14px 18px',
        maxWidth: 1020, width: '100%', margin: '0 auto',
        minHeight: 0,
      }}>

        {/* Left column */}
        <div data-anim style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <Panel>
            <PanelLabel n={1} text="Product Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field id="title" label="Title *" value={form.title} onChange={set('title')} />
              <Field id="description" label="Description *" multiline rows={4} value={form.description} onChange={set('description')} />
            </div>
          </Panel>

          <Panel>
            <PanelLabel n={2} text="Pricing" />
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Currency — debossed */}
              <div style={{ width: 100, flexShrink: 0 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontFamily: 'Inter, system-ui', fontWeight: 600 }}>Currency</label>
                <div style={{
                  borderRadius: 10, background: '#030303',
                  borderTop: '1px solid #0d0d0d', borderLeft: '1px solid #0d0d0d',
                  borderRight: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a',
                  boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6)',
                }}>
                  <select value={form.priceCurrency} onChange={set('priceCurrency')} style={{ width: '100%', height: 43, padding: '0 12px', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.82)', fontFamily: 'Inter, system-ui', fontSize: '0.85rem', cursor: 'pointer', appearance: 'none' }}>
                    {CURRENCIES.map(c => <option key={c} value={c} style={{ background: '#0c0c0c' }}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Field id="priceAmount" label="Amount *" type="number" value={form.priceAmount} onChange={set('priceAmount')} />
              </div>
            </div>
            {form.priceAmount && parseFloat(form.priceAmount) > 0 && (
              <div style={{
                marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 13px', borderRadius: 50,
                background: '#080808',
                borderTop: '1px solid #1e1e1e', borderLeft: '1px solid #1e1e1e',
                borderRight: '1px solid #0c0c0c', borderBottom: '1px solid #0c0c0c',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Listing at</span>
                <span style={{ fontSize: '0.82rem', fontFamily: 'Geist, system-ui', fontWeight: 600, color: 'rgba(212,212,212,0.88)' }}>
                  {form.priceCurrency} {parseFloat(form.priceAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </Panel>
        </div>

        {/* Right column */}
        <div data-anim style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Panel style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <PanelLabel n={3} text="Images" />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>{images.length} / 7</span>
            </div>

            {images.length < 7 && (
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files) }}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  borderRadius: 12,
                  background: dragOver ? '#080808' : '#060606',
                  /* debossed drop zone */
                  borderTop: '1px solid #0a0a0a', borderLeft: '1px solid #0a0a0a',
                  borderRight: dragOver ? '1px solid rgba(212,212,212,0.15)' : '1px solid #1c1c1c',
                  borderBottom: dragOver ? '1px solid rgba(212,212,212,0.15)' : '1px solid #1c1c1c',
                  boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.6)',
                  padding: images.length > 0 ? '14px 20px' : '26px 20px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 8, cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s', marginBottom: images.length > 0 ? 10 : 0,
                }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => addImages(e.target.files)} style={{ display: 'none' }} />
                {/* Raised upload icon */}
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: '#101010',
                  borderTop: '1px solid #282828', borderLeft: '1px solid #282828',
                  borderRight: '1px solid #0f0f0f', borderBottom: '1px solid #0f0f0f',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(212,212,212,0.4)',
                }}>
                  <CloudIcon />
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.32)', fontWeight: 500 }}>
                    {dragOver ? 'Release to upload' : 'Drag & drop or click'}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.16)', marginTop: 2 }}>
                    PNG, JPG, WEBP · max 5MB · {7 - images.length} left
                  </p>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, alignContent: 'start' }}>
                {images.map((img, i) => (
                  <div key={i} style={{
                    position: 'relative', aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden',
                    /* raised image tile */
                    borderTop: '1px solid #2a2a2a', borderLeft: '1px solid #2a2a2a',
                    borderRight: '1px solid #0e0e0e', borderBottom: '1px solid #0e0e0e',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
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
                        background: 'rgba(0,0,0,0.85)',
                        borderTop: '1px solid #333', borderLeft: '1px solid #333',
                        borderRight: '1px solid #111', borderBottom: '1px solid #111',
                      }}>Cover</span>
                    )}
                    <button type="button" onClick={() => removeImage(i)} style={{
                      position: 'absolute', top: 5, right: 5,
                      width: 20, height: 20, borderRadius: 6,
                      background: 'rgba(0,0,0,0.85)',
                      borderTop: '1px solid #333', borderLeft: '1px solid #333',
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

        {/* Bottom row */}
        <div data-anim style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, background: '#150a0a', border: '1px solid #2e1010', color: 'rgba(255,100,100,0.9)', fontSize: '0.8rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            {/* Raised CTA button — presses inward on click */}
            <button
              type="submit"
              disabled={loading}
              onMouseDown={() => setBtnDown(true)}
              onMouseUp={() => setBtnDown(false)}
              onMouseLeave={() => setBtnDown(false)}
              style={{
                width: 200, height: 40, borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Geist, system-ui', fontSize: '0.82rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.82)',
                background: btnDown ? '#080808' : '#121212',
                borderTop: btnDown ? '1px solid #0e0e0e' : '1px solid #2c2c2c',
                borderLeft: btnDown ? '1px solid #0e0e0e' : '1px solid #2c2c2c',
                borderRight: btnDown ? '1px solid #2c2c2c' : '1px solid #0e0e0e',
                borderBottom: btnDown ? '1px solid #2c2c2c' : '1px solid #0e0e0e',
                boxShadow: btnDown
                  ? 'inset 0 3px 8px rgba(0,0,0,0.6)'
                  : '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
                transform: btnDown ? 'translateY(1px)' : 'none',
                transition: 'all 0.1s',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                    Publishing...
                  </span>
                : 'Publish Listing'
              }
            </button>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.14)', whiteSpace: 'nowrap' }}>Goes live immediately.</p>
          </div>
        </div>

      </form>
    </div>
  )
}

export default CreateProduct