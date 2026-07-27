import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../hook/useCart'
import { DEFAULT_PRODUCT_IMAGE } from '../../products/utils/constants'

const NOTCH_H = 64
const TOP_PAD = NOTCH_H + 48

export default function Cart() {
  const { cart, items, loading, handleGetCart, handleUpdateQuantity, handleRemoveItem, handleCreateCartOrder, handleVerifyCartOrder } = useCart()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth?.user || state.user)

  /* Local quantity state — key: cartItem._id, value: number (Ankur's pattern) */
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    handleGetCart()
  }, [])

  const cartItems = items || cart?.items || []

  /* ─── Ankur's Helper Functions ─── */
  const getVariantDetails = (product, variantId) => {
    if (!product || !variantId) return null
    const variantsList = product.variants || product.varients || []
    return variantsList.find(v => v._id?.toString() === variantId?.toString())
  }

  const getDisplayImage = (product, variant) => {
    if (variant?.images?.length) return variant.images[0].url
    if (product?.images?.length) return product.images[0]?.url || product.images[0]
    return DEFAULT_PRODUCT_IMAGE
  }

  const formatCurrency = (amount, currency = 'INR') =>
    `${currency} ${Number(amount || 0).toLocaleString('en-IN')}`

  const changeQty = (id, currentQty, delta, availableStock = 100) => {
    const newQty = Math.max(1, Math.min(availableStock, (quantities[id] ?? currentQty) + delta))
    setQuantities((prev) => ({
      ...prev,
      [id]: newQty,
    }))
    handleUpdateQuantity(id, newQty)
  }

  /* Calculate Subtotal & Total */
  const subtotal = cartItems.reduce((acc, item) => {
    const qty = quantities[item._id] ?? item.quantity ?? 1
    const itemPrice = item.price?.amount || item.product?.price?.amount || 0
    return acc + Number(itemPrice) * Number(qty)
  }, 0)

  const currency = cartItems[0]?.price?.currency || cartItems[0]?.product?.price?.currency || 'INR'

  /* Ankur's Razorpay / Checkout Handler */
  async function handleCheckout() {
    try {
      if (handleCreateCartOrder) {
        const order = await handleCreateCartOrder()
        if (order && window.Razorpay) {
          const options = {
            key: "rzp_test_ShNSkpxt3emQVJ",
            amount: order.amount, // Amount in paise
            currency: order.currency || currency,
            name: "Velora",
            description: "Marketplace Order",
            order_id: order.id,
            handler: async (response) => {
              if (handleVerifyCartOrder) {
                const isValid = await handleVerifyCartOrder(response)
                if (isValid) {
                  navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                }
              }
            },
            prefill: {
              name: user?.fullname,
              email: user?.email,
              contact: user?.contact,
            },
          }
          const razorpayInstance = new window.Razorpay(options)
          razorpayInstance.open()
          return
        }
      }
      alert(`Proceeding to checkout with total ${formatCurrency(subtotal, currency)}!`)
    } catch (err) {
      console.error("Checkout error:", err)
      alert(`Proceeding to checkout with total ${formatCurrency(subtotal, currency)}!`)
    }
  }

  const S = {
    page: {
      minHeight: '100vh',
      background: '#060606',
      color: '#ffffff',
      fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui, sans-serif",
      padding: `${TOP_PAD}px 32px 120px`,
    },
    shell: {
      maxWidth: 1100,
      margin: '0 auto',
    },
    title: {
      fontFamily: "'Colleged', 'Bungee', 'Graduate', cursive",
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: '0.04em',
      color: '#ffffff',
      margin: '0 0 8px 0',
      textTransform: 'uppercase',
    },
    subtitle: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.45)',
      margin: 0,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: 40,
      marginTop: 36,
      alignItems: 'start',
    },
    card: {
      background: 'linear-gradient(180deg, #101010 0%, #080808 100%)',
      borderRadius: 24,
      borderTop: '1px solid #222222',
      borderLeft: '1px solid #222222',
      borderRight: '1px solid #050505',
      borderBottom: '1px solid #050505',
      boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
      padding: 24,
    },
    stepperBtn: {
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.7)',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
      borderTop: '1px solid #282828',
      borderLeft: '1px solid #282828',
      borderRight: '1px solid #060606',
      borderBottom: '1px solid #060606',
      borderRadius: 8,
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.12s ease',
    },
  }

  /* ─── 1. Empty Cart View ─── */
  if (!loading && cartItems.length === 0) {
    return (
      <div style={S.page}>
        <div style={S.shell}>
          <div style={{ textAlign: 'center', padding: '90px 20px' }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #1e1e1e 0%, #0a0a0a 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <svg width="32" height="32" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 style={S.title}>YOUR ARCHIVE IS EMPTY</h1>
            <p style={{ ...S.subtitle, maxWidth: 400, margin: '12px auto 32px' }}>
              Your shopping bag is currently empty. Explore our curated catalog and add high-end products to your personal vault.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                height: 50,
                padding: '0 32px',
                borderRadius: 16,
                background: 'linear-gradient(180deg, #2a2a2a 0%, #141414 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'Duality', system-ui, sans-serif",
                borderTop: '1px solid #444444',
                borderLeft: '1px solid #444444',
                borderRight: '1px solid #080808',
                borderBottom: '1px solid #080808',
                boxShadow: '0 8px 24px #000000, inset 0 1px 0 rgba(255,255,255,0.2)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Explore Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.shell}>

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={S.title}>MY SHOPPING CART</h1>
            <p style={S.subtitle}>Review your selected items and manage quantities before checkout.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Grid Layout */}
        <div style={S.grid}>

          {/* ── LEFT: Items List ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cartItems.map((item, idx) => {
              const prod = item.product || {}
              const itemTitle = prod.title || 'Velora Item'
              const itemPrice = item.price?.amount || prod.price?.amount || 0
              const itemCurrency = item.price?.currency || prod.price?.currency || currency
              
              /* Use Ankur's helper logic */
              const variantObj = getVariantDetails(prod, item.variant)
              const availableStock = variantObj ? (variantObj.stock ?? 0) : (prod.stock ?? 100)
              const itemImg = getDisplayImage(prod, variantObj)
              const currentQty = quantities[item._id] ?? item.quantity ?? 1

              const rawAttr = variantObj?.attributes || variantObj?.attribute
              const attrString = rawAttr
                ? (rawAttr instanceof Map
                    ? Array.from(rawAttr.values()).join(' / ')
                    : typeof rawAttr === 'object'
                    ? Object.values(rawAttr).filter(Boolean).join(' / ')
                    : String(rawAttr))
                : (variantObj?.title && variantObj.title !== 'Standard' ? variantObj.title : '')

              return (
                <div key={item._id || idx} style={S.card}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>

                    {/* Image */}
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 16,
                        overflow: 'hidden',
                        background: '#000000',
                        flexShrink: 0,
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/product/${prod._id}`)}
                    >
                      <img src={itemImg} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Product Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        onClick={() => navigate(`/product/${prod._id}`)}
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#ffffff',
                          margin: '0 0 6px 0',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {itemTitle}
                      </h3>

                      {attrString && (
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px 0' }}>
                          Variant: <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{attrString}</span>
                        </p>
                      )}

                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 6px 0' }}>
                        Stock: <span style={{ color: availableStock > 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>{availableStock > 0 ? `${availableStock} units available` : 'Out of stock'}</span>
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: '#34d399', margin: 0 }}>
                          {formatCurrency(itemPrice, itemCurrency)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper (Ankur's changeQty) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        style={S.stepperBtn}
                        onClick={() => changeQty(item._id, currentQty, -1, availableStock)}
                      >
                        −
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 700, width: 24, textAlign: 'center' }}>
                        {currentQty}
                      </span>
                      <button
                        style={{
                          ...S.stepperBtn,
                          opacity: currentQty >= availableStock ? 0.4 : 1,
                          cursor: currentQty >= availableStock ? 'not-allowed' : 'pointer',
                        }}
                        disabled={currentQty >= availableStock}
                        onClick={() => changeQty(item._id, currentQty, 1, availableStock)}
                      >
                        +
                      </button>
                    </div>

                    {/* Total & Remove */}
                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: '0 0 6px 0' }}>
                        {formatCurrency(Number(itemPrice) * Number(currentQty), itemCurrency)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        style={{
                          fontSize: 12,
                          color: '#f87171',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: 0.8,
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>

          {/* ── RIGHT: Summary Sidebar ── */}
          <div style={S.card}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#ffffff',
                margin: '0 0 20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: 12,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>

              {/* Ankur's Complimentary Shipping Logic */}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)' }}>
                <span>Estimated Shipping</span>
                <span style={{ color: subtotal >= 15000 ? '#34d399' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                  {subtotal >= 15000 ? 'COMPLIMENTARY' : 'FREE over ₹15,000'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.6)' }}>
                <span>Duties & Taxes</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Included</span>
              </div>

              <div
                style={{
                  margin: '12px 0',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: '#ffffff' }}>
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>
            </div>

            {/* Checkout CTA Button (Triggers Ankur's handleCheckout) */}
            <button
              id="proceed-checkout"
              onClick={handleCheckout}
              style={{
                width: '100%',
                height: 52,
                marginTop: 24,
                borderRadius: 16,
                background: 'linear-gradient(180deg, #2a2a2a 0%, #141414 100%)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderTop: '1px solid #444444',
                borderLeft: '1px solid #444444',
                borderRight: '1px solid #080808',
                borderBottom: '1px solid #080808',
                boxShadow: '0 8px 24px #000000, inset 0 1px 0 rgba(255,255,255,0.2)',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.12s ease',
              }}
            >
              PROCEED TO CHECKOUT
            </button>

            {/* Ankur's Footnote & Guarantees */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>✓</span> 100% Authentic Velora Verified Items
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>✓</span> Free returns within 14 days
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>✓</span> Secure 256-bit Encrypted Checkout
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
