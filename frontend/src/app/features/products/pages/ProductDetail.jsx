import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'
import ProductVariantCarousel from '../components/ProductVariantCarousel'
import AddVariantModal from '../components/AddVariantModal'
import VariantSelector from '../components/VariantSelector'
import { useCart } from '../../cart/hook/useCart'
import { resolveVariantImages } from '../utils/variantHelper'

const NOTCH_H = 64
const TOP_PAD = NOTCH_H + 48  // 112px clearance from notch

export default function ProductDetail({ productData = null, loadingState = null, isSeller = false }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleGetProductById, handleAddProductVarient } = useProduct()
  const { handleAddItem } = useCart()

  const reduxProducts = useSelector(
    (s) => s.product?.products || s.products?.products || []
  )

  const [product, setProduct] = useState(() => {
    return productData || reduxProducts.find((p) => p._id === productId) || null
  })
  const [loading, setLoading] = useState(() => {
    if (loadingState !== null) return loadingState
    return !product
  })
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState({ text: '', isError: false })
  const [stickyBarVisible, setStickyBarVisible] = useState(true)
  const pageRef = useRef(null)

  useEffect(() => {
    if (productData) {
      setProduct(productData)
      if (loadingState !== null) setLoading(loadingState)
    }
  }, [productData, loadingState])

  useEffect(() => {
    const list = product?.variants || product?.varients || []
    if (list.length > 0) {
      const firstVar = list[selectedVariantIdx] || list[0]
      const attrObj = firstVar?.attributes || firstVar?.attribute
        ? (firstVar.attributes instanceof Map
            ? Object.fromEntries(firstVar.attributes)
            : firstVar.attribute instanceof Map
            ? Object.fromEntries(firstVar.attribute)
            : typeof (firstVar.attributes || firstVar.attribute) === 'object'
            ? (firstVar.attributes || firstVar.attribute)
            : {})
        : {}
      setSelectedAttributes(attrObj)
    }
  }, [product, selectedVariantIdx])

  const activeVariant = useMemo(() => {
    const list = product?.variants || product?.varients || []
    if (list.length === 0) return null
    return list[selectedVariantIdx] || list[0]
  }, [product, selectedVariantIdx])

  const images = useMemo(() => {
    return resolveVariantImages(activeVariant, selectedVariantIdx, product?.images || [])
  }, [activeVariant, selectedVariantIdx, product])

  const fetchProductDetail = async () => {
    if (productData || product) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await handleGetProductById(productId)
      if (data) setProduct(data?.product || data)
    } catch (e) {
      console.error('Failed to fetch product details:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!productData) {
      fetchProductDetail()
    }
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

  const handleAddVariantSubmit = async (targetProductId, variantPayload) => {
    const updated = await handleAddProductVarient(targetProductId, variantPayload)
    if (updated) {
      setProduct(updated)
    }
  }

  const goBack = () => navigate(isSeller ? '/seller/dashboard' : '/')
  const viewPublicPage = () => navigate(`/product/${productId || product?._id}`)
  const addToCart = () => alert(`Added "${product?.title}" to cart!`)
  const buyNow = () => alert(`Checkout for "${product?.title}"!`)

  /* ── Loading State ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', paddingTop: TOP_PAD }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div style={{ aspectRatio: '1', borderRadius: 24, background: 'rgba(255,255,255,0.04)' }} className="animate-pulse" />
            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[60, 40, 30, 80, 50, 70].map((w, i) => (
                <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} className="animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Not Found State ── */
  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#060606', paddingTop: TOP_PAD, display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff', marginTop: 80, maxWidth: 320 }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🔍</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Product Not Found</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
            This listing may have been removed or is temporarily unavailable.
          </p>
          <button
            onClick={goBack}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              background: '#ffffff',
              color: '#000000',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isSeller ? 'Back to Dashboard' : 'Back to Marketplace'}
          </button>
        </div>
      </div>
    )
  }

  /* ── Derived Data (Variant Fallback to Main Product) ── */

  const price = (activeVariant?.price?.amount !== undefined && activeVariant?.price?.amount !== null && Number(activeVariant.price.amount) > 0)
    ? Number(activeVariant.price.amount)
    : Number(product.price?.amount || 0)

  const currency = activeVariant?.price?.currency || product.price?.currency || 'INR'

  const seller = product.seller?.fullname || product.seller?.name || 'Verified Seller'

  const stock = (activeVariant?.stock !== undefined && activeVariant?.stock !== null)
    ? Number(activeVariant.stock)
    : (product.stock ?? product.quantity ?? null)

  const inStock = stock === null || stock > 0
  const category = product.category || product.type || null
  const formattedDate = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const handleSelectVariantIdx = (idx) => {
    setSelectedVariantIdx(idx)
    setActiveImg(0)   // reset to first image of newly selected variant
    const list = product?.variants || product?.varients || []
    if (list[idx]) {
      const v = list[idx]
      const rawAttr = v?.attributes || v?.attribute
      const attrObj = rawAttr
        ? (rawAttr instanceof Map
            ? Object.fromEntries(rawAttr)
            : typeof rawAttr === 'object'
            ? rawAttr
            : {})
        : {}
      if (Object.keys(attrObj).length > 0) {
        setSelectedAttributes(attrObj)
      }
    }
  }

  const handleSelectAttribute = (key, val) => {
    const newAttrs = { ...selectedAttributes, [key]: val }
    setSelectedAttributes(newAttrs)
    const list = product?.variants || product?.varients || []

    if (list.length > 0) {
      const matchIdx = list.findIndex((v) => {
        const rawAttr = v.attributes || v.attribute
        const vAttr = rawAttr
          ? (rawAttr instanceof Map
              ? Object.fromEntries(rawAttr)
              : typeof rawAttr === 'object'
              ? rawAttr
              : {})
          : {}
        return Object.entries(newAttrs).every(([k, vVal]) => {
          if (!vAttr[k]) return false
          return String(vAttr[k]).toLowerCase() === String(vVal).toLowerCase()
        })
      })
      if (matchIdx !== -1) {
        setSelectedVariantIdx(matchIdx)
        setActiveImg(0)
      }
    }
  }

  const handleAddToCartAsync = async () => {
    if (!product) return
    const list = product?.variants || product?.varients || []
    
    // Explicitly target the selected variant object
    const selectedVariant = list[selectedVariantIdx] || activeVariant || list[0]
    const targetVariantId = selectedVariant?._id || product._id || productId

    if (!targetVariantId) {
      setCartMessage({ text: 'Unable to identify product variant.', isError: true })
      return
    }

    setAddingToCart(true)
    setCartMessage({ text: '', isError: false })

    try {
      const res = await handleAddItem({
        productId: product._id || productId,
        variantId: targetVariantId,
        quantity: qty
      })
      if (res?.success !== false) {
        const variantTitle = selectedVariant?.title ? ` (${selectedVariant.title})` : ''
        setCartMessage({ text: `Added ${qty}x "${product.title}${variantTitle}" to cart!`, isError: false })
      } else {
        setCartMessage({ text: res.message || 'Failed to add item to cart', isError: true })
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add item to cart'
      setCartMessage({ text: errorMsg, isError: true })
    } finally {
      setAddingToCart(false)
    }
  }

  const specs = [
    product.brand && { k: 'Brand', v: product.brand },
    product.model && { k: 'Model', v: product.model },
    product.material && { k: 'Material', v: product.material },
    product.weight && { k: 'Weight', v: product.weight },
    product.dimensions && { k: 'Dimensions', v: product.dimensions },
    category && { k: 'Category', v: category },
  ].filter(Boolean)

  const trustItems = [
    { icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12h12l1-12', text: 'Free shipping on orders above ₹999' },
    { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', text: '30-day hassle-free returns' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', text: '1-year manufacturer warranty' },
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: '100% genuine — By Jessika guarantee' },
  ]

  const S = {
    page: {
      minHeight: '100vh',
      background: '#060606',
      color: '#fff',
      fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui, sans-serif",
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

        {/* Back Link & Header Badge */}
        <div data-fade style={{ marginBottom: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={goBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'rgba(255,255,255,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isSeller ? 'Back to Studio Dashboard' : 'Back to Catalog'}
          </button>

          {isSeller && (
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
              Seller Listing View
            </span>
          )}
        </div>

        {/* Main Grid Layout */}
        <div style={S.grid}>

          {/* ── LEFT: 3D Coverflow Diagonal Carousel for active variant ── */}
          <div data-fade style={{ position: 'sticky', top: TOP_PAD + 16 }}>
            <ProductVariantCarousel
              images={images}
              allProductImages={product?.images}
              title={product?.title}
              activeIdx={activeImg}
              onSelectIdx={setActiveImg}
            />
          </div>

          {/* ── RIGHT: Product Story Column (Non-boxed) ── */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* 1. Category & Title */}
            <div data-fade>
              {category && <span style={S.sectionLabel}>{category}</span>}
              <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                {product.title}
              </h1>
              <p style={{ marginTop: 10, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                {isSeller ? 'Listed by ' : 'Sold by '}<span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{seller}</span>
                {isSeller && formattedDate && ` • Added ${formattedDate}`}
              </p>
            </div>

            <div style={S.spacer} />

            {/* 2. Variant Selector */}
            <div data-fade>
              <VariantSelector
                variants={product.variants || product.varients}
                varients={product.variants || product.varients}
                mainImages={product.images}
                selectedVariantIdx={selectedVariantIdx}
                onSelectVariantIdx={handleSelectVariantIdx}
                selectedAttributes={selectedAttributes}
                onSelectAttribute={handleSelectAttribute}
              />
            </div>
            <div style={S.spacer} />

            {/* 2. Price & Availability */}
            <div data-fade>
              <span style={S.sectionLabel}>{isSeller ? 'Price & Inventory' : 'Price'}</span>
              <p style={{ fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                {currency} {price.toLocaleString('en-IN')}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: inStock ? '#34d399' : '#f87171' }} />
                <span style={{ fontSize: 13, color: inStock ? '#34d399' : '#f87171' }}>
                  {inStock ? (isSeller ? 'Active & In Stock' : 'In Stock') : 'Out of Stock'}
                </span>
                {stock !== null && inStock && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 2 }}>
                    — {stock} units {isSeller ? 'available' : ''}
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

            {/* 4. Specifications */}
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

            {/* 5. Delivery & Policy */}
            <div data-fade>
              <span style={S.sectionLabel}>{isSeller ? 'Seller Policy' : 'Delivery & Returns'}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {trustItems.map(({ icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.28)" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={icon} />
                    </svg>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {!isSeller && (
              <>
                <div style={S.spacer} />

                {/* 6. Quantity Stepper for Buyer */}
                <div data-fade>
                  <span style={S.sectionLabel}>Quantity</span>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                  }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      −
                    </button>
                    <span style={{ width: 44, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>{qty}</span>
                    <button
                      onClick={() => setQty(q => q + 1)}
                      style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

            <div style={{ height: 40 }} />

            {/* 7. Action Buttons — Dark Skeuomorphic */}
            <div data-fade style={{ display: 'flex', gap: 12 }}>
              {isSeller ? (
                <>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 16,
                      background: 'linear-gradient(180deg, #303030 0%, #1c1c1c 100%)',
                      color: '#ffffff',
                      fontSize: 14,
                      fontWeight: 600,
                      borderTop: '1px solid #404040',
                      borderLeft: '1px solid #404040',
                      borderRight: '1px solid #0a0a0a',
                      borderBottom: '1px solid #0a0a0a',
                      boxShadow: '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      outline: 'none',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v14m-7-7h14" />
                    </svg>
                    Add Variant
                  </button>

                  <button
                    onClick={goBack}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      outline: 'none',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg, #303030 0%, #1a1a1a 100%)'}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #262626 0%, #141414 100%)'
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.15)'
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.transform = 'translateY(1px)'
                      e.currentTarget.style.boxShadow = 'inset 0 4px 10px #000000, inset 0 1px 0 rgba(255,255,255,0.06)'
                    }}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.15)'
                    }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Dashboard
                  </button>

                  <button
                    onClick={viewPublicPage}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      outline: 'none',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(180deg, #222222 0%, #141414 100%)'}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)'
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                    }}
                    onMouseDown={e => {
                      e.currentTarget.style.transform = 'translateY(1px)'
                      e.currentTarget.style.boxShadow = 'inset 0 4px 10px #000000, inset 0 1px 0 rgba(255,255,255,0.04)'
                    }}
                    onMouseUp={e => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                    }}
                  >
                    View Public Page
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  {/* Buy Now */}
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
                      if (inStock) e.currentTarget.style.background = 'linear-gradient(180deg, #303030 0%, #1a1a1a 100%)'
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Buy Now
                  </button>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCartAsync}
                    disabled={!inStock || addingToCart}
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
                      cursor: (inStock && !addingToCart) ? 'pointer' : 'not-allowed',
                      opacity: (inStock && !addingToCart) ? 1 : 0.4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      outline: 'none',
                      transition: 'all 0.12s ease',
                    }}
                    onMouseEnter={e => {
                      if (inStock && !addingToCart) e.currentTarget.style.background = 'linear-gradient(180deg, #222222 0%, #141414 100%)'
                    }}
                    onMouseLeave={e => {
                      if (inStock && !addingToCart) {
                        e.currentTarget.style.background = 'linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)'
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                      }
                    }}
                    onMouseDown={e => {
                      if (inStock && !addingToCart) {
                        e.currentTarget.style.transform = 'translateY(1px)'
                        e.currentTarget.style.boxShadow = 'inset 0 4px 10px #000000, inset 0 1px 0 rgba(255,255,255,0.04)'
                      }
                    }}
                    onMouseUp={e => {
                      if (inStock && !addingToCart) {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '0 8px 24px #000000, 0 3px 8px #000000, inset 0 1px 0 rgba(255,255,255,0.08)'
                      }
                    }}
                  >
                    <svg width="15" height="15" fill="none" stroke="rgba(255,255,255,0.7)" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </>
              )}
            </div>

            {/* Cart Message Toast / Banner */}
            {cartMessage.text && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  background: cartMessage.isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(52, 211, 153, 0.12)',
                  border: cartMessage.isError ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(52, 211, 153, 0.3)',
                  color: cartMessage.isError ? '#f87171' : '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>{cartMessage.isError ? '⚠️' : '✓'}</span>
                <span>{cartMessage.text}</span>
              </div>
            )}

          </div>
          {/* end right */}

        </div>
        {/* end grid */}

      </div>

      {isSeller && (
        <AddVariantModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddVariant={handleAddVariantSubmit}
          productId={product?._id}
        />
      )}

      {/* ── Sticky Buy Bar (buyer only) ── */}
      {!isSeller && product && (
        <StickyBuyBar
          visible={stickyBarVisible}
          product={product}
          activeVariant={activeVariant}
          variantImg={images?.[0]?.url || DEFAULT_PRODUCT_IMAGE}
          price={price}
          currency={currency}
          inStock={inStock}
          qty={qty}
          setQty={setQty}
          addingToCart={addingToCart}
          onAddToCart={handleAddToCartAsync}
          onDismiss={() => setStickyBarVisible(false)}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────
   Sticky Buy Bar
───────────────────────────────────────────────────── */
function StickyBuyBar({ visible, product, activeVariant, variantImg, price, currency, inStock, qty, setQty, addingToCart, onAddToCart, onDismiss }) {
  const [barDown, setBarDown] = useState(false)

  const variantTitle = activeVariant?.title
    || Object.values(
        activeVariant?.attributes instanceof Map
          ? Object.fromEntries(activeVariant.attributes)
          : (activeVariant?.attributes || activeVariant?.attribute || {})
      ).filter(Boolean).join(' / ')
    || 'Standard'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Gradient fade above bar */}
      <div style={{
        height: 48,
        background: 'linear-gradient(to top, rgba(6,6,6,0.95), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Main bar */}
      <div style={{
        background: 'linear-gradient(180deg, #111111 0%, #080808 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: '14px 24px 22px',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>

          {/* Variant thumbnail + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
            }}>
              <img
                src={variantImg}
                alt={variantTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 700,
                color: '#ffffff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {product.title}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.38)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.06)', borderRadius: 5,
                  padding: '1px 7px', fontSize: 10, fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
                }}>
                  {variantTitle}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>
                  {currency} {price.toLocaleString('en-IN')}
                </span>
              </p>
            </div>
          </div>

          {/* Quantity stepper */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            flexShrink: 0,
          }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              disabled={!inStock}
              style={{
                width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (inStock) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              −
            </button>
            <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {qty}
            </span>
            <button
              onClick={() => setQty(q => q + 1)}
              disabled={!inStock}
              style={{
                width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (inStock) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
            >
              +
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={onAddToCart}
            disabled={!inStock || addingToCart}
            onMouseDown={() => setBarDown(true)}
            onMouseUp={() => setBarDown(false)}
            onMouseLeave={() => setBarDown(false)}
            style={{
              height: 46,
              padding: '0 28px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: inStock ? '#000000' : 'rgba(255,255,255,0.3)',
              background: inStock
                ? (barDown
                    ? 'linear-gradient(180deg, #d4d4d4 0%, #a3a3a3 100%)'
                    : 'linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%)')
                : 'rgba(255,255,255,0.06)',
              borderTop: inStock ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.08)',
              borderLeft: inStock ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.08)',
              borderRight: inStock ? '1px solid #999' : '1px solid rgba(255,255,255,0.04)',
              borderBottom: inStock ? '1px solid #999' : '1px solid rgba(255,255,255,0.04)',
              boxShadow: inStock
                ? (barDown
                    ? 'inset 0 3px 8px rgba(0,0,0,0.15)'
                    : '0 6px 20px rgba(255,255,255,0.18), inset 0 1px 0 rgba(255,255,255,0.9)')
                : 'none',
              cursor: (inStock && !addingToCart) ? 'pointer' : 'not-allowed',
              opacity: (inStock && !addingToCart) ? 1 : 0.4,
              transform: barDown ? 'translateY(1px)' : 'none',
              transition: 'all 0.12s ease',
              display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
            }}
          >
            {addingToCart ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Adding...
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </>
            )}
          </button>

          {/* Dismiss */}
          <button
            onClick={onDismiss}
            style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.25)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            title="Dismiss"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
          