import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

// Icons
const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const BoxIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

// Skeuomorphic Button Component
const SkeuoButton = ({ onClick, children, height = 36, padding = '0 16px', fontSize = '0.8rem', primary = false }) => {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        height,
        padding,
        borderRadius: 10,
        cursor: 'pointer',
        fontFamily: 'Inter, system-ui',
        fontSize,
        fontWeight: 600,
        color: primary ? '#000000' : 'rgba(255,255,255,0.85)',
        background: primary
          ? (pressed ? '#d4d4d4' : '#ffffff')
          : (pressed ? '#080808' : '#141414'),
        borderTop: primary
          ? (pressed ? '1px solid #bcbcbc' : '1px solid #ffffff')
          : (pressed ? '1px solid #080808' : '1px solid #2a2a2a'),
        borderLeft: primary
          ? (pressed ? '1px solid #bcbcbc' : '1px solid #ffffff')
          : (pressed ? '1px solid #080808' : '1px solid #2a2a2a'),
        borderRight: primary
          ? (pressed ? '1px solid #ffffff' : '1px solid #a3a3a3')
          : (pressed ? '1px solid #2a2a2a' : '1px solid #080808'),
        borderBottom: primary
          ? (pressed ? '1px solid #ffffff' : '1px solid #a3a3a3')
          : (pressed ? '1px solid #2a2a2a' : '1px solid #080808'),
        boxShadow: pressed
          ? 'inset 0 3px 8px rgba(0,0,0,0.7)'
          : '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
        transform: pressed ? 'translateY(1px)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

const SellerProductDetails = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleGetProductById } = useProduct()

  const sellerProducts = useSelector(
    (state) => state.product?.sellerProducts || state.products?.sellerProducts || []
  )
  const reduxProducts = useSelector(
    (state) => state.product?.products || state.products?.products || []
  )

  const [product, setProduct] = useState(() => {
    return sellerProducts.find((p) => p._id === productId) || reduxProducts.find((p) => p._id === productId) || null
  })
  const [loading, setLoading] = useState(!product)
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  const containerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const fetchProduct = async () => {
      if (product) {
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const data = await handleGetProductById(productId)
        if (isMounted && data) {
          setProduct(data)
        }
      } catch (err) {
        console.error('Failed to load seller product details:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProduct()
    return () => {
      isMounted = false
    }
  }, [productId])

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        '[data-anim]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading])

  const handleBackToDashboard = () => {
    navigate('/seller/dashboard')
  }

  const handleViewPublicPage = () => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040404', color: '#fff', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ height: 40, width: 160, borderRadius: 10, background: '#0a0a0a' }} className="animate-pulse" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div style={{ height: 400, borderRadius: 16, background: '#0a0a0a' }} className="animate-pulse" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[80, 50, 40, 90, 60].map((w, i) => (
                <div key={i} style={{ height: 20, width: `${w}%`, borderRadius: 8, background: '#0a0a0a' }} className="animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#040404', color: '#fff', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{
          padding: '48px 32px',
          borderRadius: 16,
          background: '#080808',
          borderTop: '1px solid #1a1a1a',
          borderLeft: '1px solid #1a1a1a',
          borderRight: '1px solid #060606',
          borderBottom: '1px solid #060606',
          boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          textAlign: 'center',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Product Not Found</h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            The requested product listing could not be found in your seller catalog.
          </p>
          <SkeuoButton onClick={handleBackToDashboard} height={38} padding="0 20px">
            <ChevronLeftIcon /> Back to Dashboard
          </SkeuoButton>
        </div>
      </div>
    )
  }

  const images = product.images?.length > 0 ? product.images : [{ url: DEFAULT_PRODUCT_IMAGE }]
  const currentImg = images[activeImgIdx]?.url || DEFAULT_PRODUCT_IMAGE
  const priceAmount = Number(product.price?.amount || 0)
  const currencySymbol = product.price?.currency || 'INR'
  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently Added'
  const category = product.category || product.type || 'General'

  const specs = [
    product.brand && { label: 'Brand', value: product.brand },
    product.model && { label: 'Model', value: product.model },
    product.material && { label: 'Material', value: product.material },
    product.weight && { label: 'Weight', value: product.weight },
    product.dimensions && { label: 'Dimensions', value: product.dimensions },
    { label: 'Category', value: category },
  ].filter(Boolean)

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      background: '#040404',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui',
      padding: '32px 24px 80px',
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── TOP ACTION BAR ─────────────────────────────────────────────────── */}
        <div data-anim style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <SkeuoButton onClick={handleBackToDashboard} height={36} padding="0 14px" fontSize="0.8rem">
            <ChevronLeftIcon /> Back to Studio Dashboard
          </SkeuoButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(34,197,94,0.9)',
              fontWeight: 600,
              background: '#09150d',
              padding: '4px 10px',
              borderRadius: 6,
              borderTop: '1px solid #14301d',
              borderLeft: '1px solid #14301d',
              borderRight: '1px solid #050a06',
              borderBottom: '1px solid #050a06',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
              Live Seller Listing
            </span>

            <SkeuoButton onClick={handleViewPublicPage} height={36} padding="0 14px" fontSize="0.8rem">
              View Public Page <ExternalLinkIcon />
            </SkeuoButton>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ──────────────────────────────────────────────── */}
        <div data-anim style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* ── LEFT: IMAGE STAGE ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Main Image Socket */}
            <div style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 16,
              background: '#080808',
              borderTop: '1px solid #1c1c1c',
              borderLeft: '1px solid #1c1c1c',
              borderRight: '1px solid #060606',
              borderBottom: '1px solid #060606',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}>
              <img
                src={currentImg}
                alt={product.title}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease',
                }}
              />
              {images.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(8,8,8,0.88)',
                  border: '1px solid #222',
                  fontSize: '0.68rem',
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {activeImgIdx + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      background: '#080808',
                      border: activeImgIdx === idx ? '2px solid #ffffff' : '1px solid #1a1a1a',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 2,
                      opacity: activeImgIdx === idx ? 1 : 0.4,
                      transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: DETAILS & METRICS ─────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Title & Metadata Card */}
            <div style={{
              borderRadius: 14,
              background: '#0e0e0e',
              borderTop: '1px solid #222222',
              borderLeft: '1px solid #222222',
              borderRight: '1px solid #060606',
              borderBottom: '1px solid #060606',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div>
                <span style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}>
                  {category}
                </span>
                <h1 style={{
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.2,
                  margin: 0,
                }}>
                  {product.title}
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarIcon /> Created {formattedDate}
                </span>
                <span>•</span>
                <span>Listing ID: {productId.slice(-8)}</span>
              </div>
            </div>

            {/* Price & Valuation Card */}
            <div style={{
              borderRadius: 14,
              background: '#0e0e0e',
              borderTop: '1px solid #222222',
              borderLeft: '1px solid #222222',
              borderRight: '1px solid #060606',
              borderBottom: '1px solid #060606',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}>
                  Listed Unit Price
                </span>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  {currencySymbol} {priceAmount.toLocaleString('en-IN')}
                </h2>
              </div>

              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: '#161616',
                borderTop: '1px solid #262626',
                borderLeft: '1px solid #262626',
                borderRight: '1px solid #080808',
                borderBottom: '1px solid #080808',
                display: 'grid',
                placeItems: 'center',
                color: 'rgba(212,212,212,0.6)',
                boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
              }}>
                <TagIcon />
              </div>
            </div>

            {/* Description Card */}
            <div style={{
              borderRadius: 14,
              background: '#0e0e0e',
              borderTop: '1px solid #222222',
              borderLeft: '1px solid #222222',
              borderRight: '1px solid #060606',
              borderBottom: '1px solid #060606',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              <span style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 600,
              }}>
                Description
              </span>
              <p style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.6,
                margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {product.description || 'No description added for this listing.'}
              </p>
            </div>

            {/* Specifications Card */}
            {specs.length > 0 && (
              <div style={{
                borderRadius: 14,
                background: '#0e0e0e',
                borderTop: '1px solid #222222',
                borderLeft: '1px solid #222222',
                borderRight: '1px solid #060606',
                borderBottom: '1px solid #060606',
                boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <span style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                }}>
                  Specifications
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {specs.map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}

export default SellerProductDetails