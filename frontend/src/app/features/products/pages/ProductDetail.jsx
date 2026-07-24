import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

const NOTCH_H = 64   // navbar is h-16 = 64px fixed
const TOP_PAD = NOTCH_H + 48  // 112px — well clear of notch

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleGetProductById } = useProduct()
  const reduxProducts = useSelector(
    (s) => s.product?.products || s.products?.products || []
  )

  const [product,   setProduct]   = useState(() => reduxProducts.find(p => p._id === productId) || null)
  const [loading,   setLoading]   = useState(!product)
  const [activeImg, setActiveImg] = useState(0)
  const [qty,       setQty]       = useState(1)
  const pageRef = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (product) { setLoading(false); return }
      setLoading(true)
      try {
        const data = await handleGetProductById(productId)
        if (alive && data) setProduct(data)
      } catch (e) { console.error(e) }
      finally { if (alive) setLoading(false) }
    })()
    return () => { alive = false }
  }, [productId])

  useEffect(() => {
    if (!loading && pageRef.current) {
      gsap.fromTo(
        pageRef.current.querySelectorAll('[data-fade]'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading])

  const goBack    = () => navigate('/')
  const addToCart = () => alert(`Added "${product?.title}" to cart!`)
  const buyNow    = () => alert(`Checkout for "${product?.title}"!`)

  /* ─── Loading ─── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060606', paddingTop: TOP_PAD }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div style={{ aspectRatio: '1', borderRadius: 24, background: 'rgba(255,255,255,0.04)' }} className="animate-pulse" />
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[60,40,30,80,50,70].map((w,i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} className="animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  /* ─── Not found ─── */
  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#060606', paddingTop: TOP_PAD, display: 'flex', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#fff', marginTop: 80, maxWidth: 320 }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🔍</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Product Not Found</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
          This listing may have been removed or is temporarily unavailable.
        </p>
        <button onClick={goBack} style={{
          padding: '12px 28px', borderRadius: 999, background: '#fff', color: '#000',
          fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer'
        }}>Back to Marketplace</button>
      </div>
    </div>
  )

  /* ─── Data ─── */
  const images   = product.images?.length > 0 ? product.images : [{ url: DEFAULT_PRODUCT_IMAGE }]
  const imgSrc   = images[activeImg]?.url || DEFAULT_PRODUCT_IMAGE
  const price    = Number(product.price?.amount || 0)
  const currency = product.price?.currency || 'INR'
  const seller   = product.seller?.fullname || product.seller?.name || 'Verified Seller'
  const stock    = product.stock ?? product.quantity ?? null
  const inStock  = stock === null || stock > 0
  const category = product.category || product.type || null

  const specs = [
    product.brand      && { k: 'Brand',      v: product.brand },
    product.model      && { k: 'Model',      v: product.model },
    product.material   && { k: 'Material',   v: product.material },
    product.weight     && { k: 'Weight',     v: product.weight },
    product.dimensions && { k: 'Dimensions', v: product.dimensions },
    category           && { k: 'Category',   v: category },
  ].filter(Boolean)

  const trustItems = [
    { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12l1-12',   text: 'Free shipping on orders above ₹999' },
    { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: '30-day hassle-free returns' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',                text: '1-year manufacturer warranty' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: '100% genuine — Velora guarantee' },
  ]

  /* ─── Styles ─── */
  const S = {
    page: {
      minHeight: '100vh',
      background: '#060606',
      color: '#fff',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    shell: {
      maxWidth: 960,
      margin: '0 auto',
      padding: `${TOP_PAD}px 32px 160px`,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'start',
    },
    sectionLabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.28)',
      marginBottom: 10,
      display: 'block',
    },
    spacer: { height: 36 },
  }

  return (
    <div ref={pageRef} style={S.page}>
      <div style={S.shell}>

        {/* Back */}
        <div data-fade style={{ marginBottom: 48 }}>
          <button onClick={goBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: 'rgba(255,255,255,0.35)', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Catalog
          </button>
        </div>

        {/* Grid */}
        <div style={S.grid}>

          {/* ── LEFT: Gallery ── */}
          <div data-fade style={{ position: 'sticky', top: TOP_PAD + 16 }}>

            {/* Main image */}
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '1',
              borderRadius: 24, overflow: 'hidden',
              background: 'linear-gradient(145deg, #141414 0%, #0a0a0a 100%)',
              boxShadow: [
                '0 24px 48px #000000',
                '0 12px 24px rgba(0,0,0,0.95)',
                '0 4px 8px #000000',
                'inset 0 1px 0 rgba(255,255,255,0.12)',
                'inset 0 -2px 0 #000000',
                'inset 1px 0 0 rgba(255,255,255,0.06)',
              ].join(', '),
              border: '1px solid rgba(255,255,255,0.07)',
            }}
              className="group"
            >
              <img
                key={activeImg}
                src={imgSrc}
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 40 }}
                className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />

              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    style={{
                      position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all hover:!text-white"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    style={{
                      position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-all hover:!text-white"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                  <div style={{
                    position: 'absolute', bottom: 14, right: 14,
                    fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)',
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)',
                    padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {activeImg + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImg(idx)}
                    style={{
                      flexShrink: 0, width: 60, height: 60, borderRadius: 12,
                      overflow: 'hidden', cursor: 'pointer', padding: 0,
                      border: `2px solid ${activeImg === idx ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)'}`,
                      opacity: activeImg === idx ? 1 : 0.4,
                      transform: activeImg === idx ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s',
                      boxShadow: activeImg === idx
                        ? '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Story ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* 1. Title */}
            <div data-fade>
              {category && (
                <span style={S.sectionLabel}>{category}</span>
              )}
              <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                {product.title}
              </h1>
              <p style={{ marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                Sold by <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{seller}</span>
              </p>
            </div>

            <div style={S.spacer} />

            {/* 2. Price */}
            <div data-fade>
              <span style={S.sectionLabel}>Price</span>
              <p style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                {currency} {price.toLocaleString('en-IN')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: inStock ? '#34d399' : '#f87171' }} />
                <span style={{ fontSize: 13, color: inStock ? '#34d399' : '#f87171' }}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {stock !== null && inStock && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 2 }}>
                    — {stock} units
                  </span>
                )}
              </div>
            </div>

            <div style={S.spacer} />

            {/* 3. Description */}
            <div data-fade>
              <span style={S.sectionLabel}>Description</span>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.52)', margin: 0 }}>
                {product.description || 'No description available for this item.'}
              </p>
            </div>

            <div style={S.spacer} />

            {/* 4. Specs */}
            {specs.length > 0 && (
              <>
                <div data-fade>
                  <span style={S.sectionLabel}>Specifications</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {specs.map(({ k, v }) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>{k}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'right' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={S.spacer} />
              </>
            )}

            {/* 5. Delivery & Trust */}
            <div data-fade>
              <span style={S.sectionLabel}>Delivery & Returns</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {trustItems.map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.28)" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={icon}/>
                    </svg>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.spacer} />

            {/* 6. Quantity */}
            <div data-fade>
              <span style={S.sectionLabel}>Quantity</span>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                overflow: 'hidden', background: 'rgba(255,255,255,0.03)',
              }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >−</button>
                <span style={{ width: 44, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >+</button>
              </div>
            </div>

            <div style={{ height: 40 }} />

            {/* 7. CTAs — Dark Skeuomorphic Buttons */}
            <div data-fade style={{ display: 'flex', gap: 12 }}>
              {/* Buy Now — Dark Skeuomorphic Primary Button */}
              <button
                onClick={buyNow}
                disabled={!inStock}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 16,
                  background: 'linear-gradient(180deg, #262626 0%, #141414 100%)',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 600,
                  borderTop: '1px solid #383838',
                  borderLeft: '1px solid #383838',
                  borderRight: '1px solid #0a0a0a',
                  borderBottom: '1px solid #0a0a0a',
                  boxShadow: '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.15)',
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  opacity: inStock ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  outline: 'none',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  if (inStock) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #303030 0%, #1a1a1a 100%)'
                  }
                }}
                onMouseLeave={e => {
                  if (inStock) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #262626 0%, #141414 100%)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.15)'
                  }
                }}
                onMouseDown={e => {
                  if (inStock) {
                    e.currentTarget.style.transform = 'translateY(1px)'
                    e.currentTarget.style.boxShadow = 'inset 0 4px 10px #000000, inset 0 1px 0 rgba(255,255,255,0.06)'
                  }
                }}
                onMouseUp={e => {
                  if (inStock) {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.15)'
                  }
                }}
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Buy Now
              </button>

              {/* Add to Cart — Dark Skeuomorphic Secondary Button */}
              <button
                onClick={addToCart}
                disabled={!inStock}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 16,
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 14,
                  fontWeight: 600,
                  borderTop: '1px solid #282828',
                  borderLeft: '1px solid #282828',
                  borderRight: '1px solid #060606',
                  borderBottom: '1px solid #060606',
                  boxShadow: '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)',
                  cursor: inStock ? 'pointer' : 'not-allowed',
                  opacity: inStock ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  outline: 'none',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  if (inStock) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #222222 0%, #141414 100%)'
                  }
                }}
                onMouseLeave={e => {
                  if (inStock) {
                    e.currentTarget.style.background = 'linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)'
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                  }
                }}
                onMouseDown={e => {
                  if (inStock) {
                    e.currentTarget.style.transform = 'translateY(1px)'
                    e.currentTarget.style.boxShadow = 'inset 0 4px 10px #000000, inset 0 1px 0 rgba(255,255,255,0.04)'
                  }
                }}
                onMouseUp={e => {
                  if (inStock) {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                  }
                }}
              >
                <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.7)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Add to Cart
              </button>
            </div>

          </div>
          {/* end right */}

        </div>
        {/* end grid */}

      </div>
    </div>
  )
}