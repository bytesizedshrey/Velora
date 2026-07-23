import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'

// ── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ display: 'block' }}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <line x1="8.5" y1="6" x2="20.5" y2="6" />
    <line x1="8.5" y1="12" x2="20.5" y2="12" />
    <line x1="8.5" y1="18" x2="20.5" y2="18" />
    <line x1="3.5" y1="6" x2="3.51" y2="6" />
    <line x1="3.5" y1="12" x2="3.51" y2="12" />
    <line x1="3.5" y1="18" x2="3.51" y2="18" />
  </svg>
)

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const TagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
)

const TrendingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

// ── Skeuomorphic Metric Card Component ───────────────────────────────────────
const MetricCard = ({ title, value, subtitle, icon: Icon }) => (
  <div style={{
    borderRadius: 14,
    background: '#0e0e0e',
    borderTop: '1px solid #222222',
    borderLeft: '1px solid #222222',
    borderRight: '1px solid #060606',
    borderBottom: '1px solid #060606',
    boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <p style={{
        fontSize: '0.62rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.32)',
        fontWeight: 600,
        margin: 0,
      }}>
        {title}
      </p>
      {/* Raised icon housing in top right */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        background: '#161616',
        borderTop: '1px solid #262626',
        borderLeft: '1px solid #262626',
        borderRight: '1px solid #080808',
        borderBottom: '1px solid #080808',
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(212,212,212,0.5)',
        boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
        flexShrink: 0,
      }}>
        <Icon />
      </div>
    </div>
    <div>
      <h3 style={{
        fontFamily: 'Geist, system-ui',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {value}
      </h3>
      {subtitle && (
        <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)', margin: '6px 0 0 0' }}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
)

// ── Skeuomorphic Button Helper Component ────────────────────────────────────
const SkeuoButton = ({ onClick, children, height = 36, padding = '0 16px', fontSize = '0.8rem' }) => {
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
        fontFamily: 'Geist, system-ui',
        fontSize,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
        background: pressed ? '#080808' : '#141414',
        borderTop: pressed ? '1px solid #080808' : '1px solid #2a2a2a',
        borderLeft: pressed ? '1px solid #080808' : '1px solid #2a2a2a',
        borderRight: pressed ? '1px solid #2a2a2a' : '1px solid #080808',
        borderBottom: pressed ? '1px solid #2a2a2a' : '1px solid #080808',
        boxShadow: pressed
          ? 'inset 0 3px 8px rgba(0,0,0,0.7)'
          : '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
        transform: pressed ? 'translateY(1px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

// ── Dashboard Main ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const { handleGetSellerProduct } = useProduct()
  const { user } = useSelector((state) => state.auth)
  const sellerProducts = useSelector(state => state.product?.sellerProducts || state.products?.sellerProducts || [])

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const containerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const fetchProducts = async () => {
      setLoading(true)
      try {
        await handleGetSellerProduct()
      } catch (err) {
        console.error("Failed to fetch seller products:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('[data-anim]',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading])

  // Filter & sort logic
  const filteredProducts = sellerProducts
    .filter(p => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sortBy === 'price-high') return (b.price?.amount || 0) - (a.price?.amount || 0)
      if (sortBy === 'price-low') return (a.price?.amount || 0) - (b.price?.amount || 0)
      return 0
    })

  // Metrics calculation
  const totalCount = sellerProducts.length
  const totalValuation = sellerProducts.reduce((acc, curr) => acc + (Number(curr.price?.amount) || 0), 0)
  const currencySymbol = sellerProducts[0]?.price?.currency || 'INR'
  const avgPrice = totalCount > 0 ? (totalValuation / totalCount).toFixed(2) : 0

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      background: '#040404',
      color: '#ffffff',
      fontFamily: 'Inter, system-ui',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── HEADER BAR ──────────────────────────────────────────────────────── */}
      <header style={{
        height: 56,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#080808',
        borderBottom: '1px solid #0c0c0c',
        borderTop: '1px solid #1a1a1a',
        boxShadow: '0 3px 12px rgba(0,0,0,0.6)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: '#141414',
              borderTop: '1px solid #242424',
              borderLeft: '1px solid #242424',
              borderRight: '1px solid #080808',
              borderBottom: '1px solid #080808',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              display: 'grid',
              placeItems: 'center',
              lineHeight: 1,
              fontSize: '0.78rem',
              fontWeight: 800,
              fontFamily: 'Geist, system-ui',
              color: '#d4d4d4',
            }}>
              V
            </div>
            <span style={{
              fontFamily: 'Geist, system-ui',
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}>
              Velora
            </span>
          </Link>
          <span style={{ color: '#1a1a1a', fontSize: '0.8rem' }}>/</span>
          <span style={{
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            fontWeight: 600,
          }}>
            Seller Studio
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* User badge — debossed inset socket */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            borderRadius: 8,
            background: '#060606',
            borderTop: '1px solid #080808',
            borderLeft: '1px solid #080808',
            borderRight: '1px solid #1a1a1a',
            borderBottom: '1px solid #1a1a1a',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 6px rgba(34,197,94,0.5)',
            }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {user?.fullname || 'Seller'}
            </span>
          </div>

          {/* New Product CTA Button */}
          <SkeuoButton onClick={() => navigate('/seller/create-product')} height={34} padding="0 14px" fontSize="0.78rem">
            <PlusIcon /> New Product
          </SkeuoButton>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        maxWidth: 1040,
        width: '100%',
        margin: '0 auto',
        padding: '28px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>

        {/* Top Banner */}
        <div data-anim style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(212,212,212,0.3)',
              fontWeight: 600,
              marginBottom: 4,
            }}>
              Overview
            </p>
            <h1 style={{
              fontFamily: 'Geist, system-ui',
              fontSize: '1.7rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.1,
            }}>
              Product Catalog
            </h1>
          </div>

          <SkeuoButton onClick={() => navigate('/seller/create-product')} height={38} padding="0 16px" fontSize="0.8rem">
            <PlusIcon /> Add Product
          </SkeuoButton>
        </div>

        {/* ── METRICS GRID ───────────────────────────────────────────────────── */}
        <div data-anim style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}>
          <MetricCard
            title="Total Listings"
            value={totalCount}
            subtitle="Published items"
            icon={BoxIcon}
          />
          <MetricCard
            title="Catalog Valuation"
            value={`${currencySymbol} ${totalValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtitle="Combined value"
            icon={TagIcon}
          />
          <MetricCard
            title="Average Price"
            value={`${currencySymbol} ${Number(avgPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            subtitle="Per item average"
            icon={TrendingIcon}
          />
        </div>

        {/* ── SEARCH & CONTROLS BAR (Raised Panel) ──────────────────────────── */}
        <div data-anim style={{
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
        }}>

          {/* Search Input — Sunken Debossed Socket */}
          <div style={{
            position: 'relative',
            flex: '1 1 240px',
            maxWidth: 380,
          }}>
            <span style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.25)',
              display: 'flex',
            }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px 0 34px',
                borderRadius: 9,
                background: '#060606',
                borderTop: '1px solid #080808',
                borderLeft: '1px solid #080808',
                borderRight: '1px solid #1a1a1a',
                borderBottom: '1px solid #1a1a1a',
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.82rem',
                fontFamily: 'Inter, system-ui',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Sort Select — Debossed Socket */}
            <div style={{
              borderRadius: 9,
              background: '#060606',
              borderTop: '1px solid #080808',
              borderLeft: '1px solid #080808',
              borderRight: '1px solid #1a1a1a',
              borderBottom: '1px solid #1a1a1a',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  height: 38,
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
                <option value="newest" style={{ background: '#0e0e0e' }}>Newest First</option>
                <option value="oldest" style={{ background: '#0e0e0e' }}>Oldest First</option>
                <option value="price-high" style={{ background: '#0e0e0e' }}>Price: High to Low</option>
                <option value="price-low" style={{ background: '#0e0e0e' }}>Price: Low to High</option>
              </select>
            </div>

            {/* View Mode Toggle — Hardware Rocker Switch */}
            <div style={{
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
            }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  boxSizing: 'border-box',
                  border: viewMode === 'grid' ? '1px solid #282828' : '1px solid transparent',
                  borderTop: viewMode === 'grid' ? '1px solid #282828' : '1px solid transparent',
                  borderLeft: viewMode === 'grid' ? '1px solid #282828' : '1px solid transparent',
                  borderRight: viewMode === 'grid' ? '1px solid #0e0e0e' : '1px solid transparent',
                  borderBottom: viewMode === 'grid' ? '1px solid #0e0e0e' : '1px solid transparent',
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
                onClick={() => setViewMode('list')}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 7,
                  boxSizing: 'border-box',
                  border: viewMode === 'list' ? '1px solid #282828' : '1px solid transparent',
                  borderTop: viewMode === 'list' ? '1px solid #282828' : '1px solid transparent',
                  borderLeft: viewMode === 'list' ? '1px solid #282828' : '1px solid transparent',
                  borderRight: viewMode === 'list' ? '1px solid #0e0e0e' : '1px solid transparent',
                  borderBottom: viewMode === 'list' ? '1px solid #0e0e0e' : '1px solid transparent',
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

        {/* ── PRODUCT LISTINGS ───────────────────────────────────────────────── */}
        {loading ? (
          /* Skeleton Loading Cards */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: 260,
                borderRadius: 14,
                background: '#090909',
                border: '1px solid #141414',
                animation: 'pulse 1.5s infinite ease-in-out',
              }} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Skeuomorphic Empty State */
          <div data-anim style={{
            padding: '56px 24px',
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
          }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: '#141414',
              borderTop: '1px solid #242424',
              borderLeft: '1px solid #242424',
              borderRight: '1px solid #0c0c0c',
              borderBottom: '1px solid #0c0c0c',
              boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(212,212,212,0.4)',
            }}>
              <BoxIcon />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Geist, system-ui', fontSize: '1.05rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                {searchQuery ? 'No matching products found' : 'No products listed yet'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)', marginTop: 4, maxWidth: 360 }}>
                {searchQuery ? 'Try adjusting your search terms or filters.' : 'Create your first product listing to start selling on Velora.'}
              </p>
            </div>
            {!searchQuery && (
              <SkeuoButton onClick={() => navigate('/seller/create-product')} height={36} padding="0 16px" fontSize="0.8rem">
                <PlusIcon /> Create Product
              </SkeuoButton>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View — Skeuomorphic Product Cards */
          <div data-anim style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {filteredProducts.map(product => {
              const mainImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
              const formattedDate = product.createdAt
                ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null

              return (
                <div
                  key={product._id}
                  style={{
                    borderRadius: 14,
                    background: '#0e0e0e',
                    borderTop: '1px solid #222222',
                    borderLeft: '1px solid #222222',
                    borderRight: '1px solid #060606',
                    borderBottom: '1px solid #060606',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'
                  }}
                >
                  {/* Debossed Inset Image Frame */}
                  <div style={{
                    position: 'relative',
                    aspectRatio: '16/10',
                    background: '#060606',
                    overflow: 'hidden',
                    borderBottom: '1px solid #0c0c0c',
                    boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
                  }}>
                    <img
                      src={mainImg}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Price Tag — Skeuomorphic Plaque */}
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      padding: '4px 10px',
                      borderRadius: 7,
                      background: 'rgba(8,8,8,0.92)',
                      borderTop: '1px solid #2a2a2a',
                      borderLeft: '1px solid #2a2a2a',
                      borderRight: '1px solid #080808',
                      borderBottom: '1px solid #080808',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(6px)',
                      fontSize: '0.78rem',
                      fontFamily: 'Geist, system-ui',
                      fontWeight: 700,
                      color: 'rgba(212,212,212,0.95)',
                    }}>
                      {product.price?.currency || 'INR'} {Number(product.price?.amount || 0).toLocaleString('en-IN')}
                    </div>

                    {/* Photos Count Badge */}
                    {product.images?.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        padding: '2px 7px',
                        borderRadius: 5,
                        background: 'rgba(8,8,8,0.85)',
                        borderTop: '1px solid #262626',
                        borderLeft: '1px solid #262626',
                        borderRight: '1px solid #080808',
                        borderBottom: '1px solid #080808',
                        fontSize: '0.58rem',
                        color: 'rgba(255,255,255,0.6)',
                        fontWeight: 600,
                      }}>
                        {product.images.length} photos
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: 10 }}>
                    <div>
                      <h4 style={{
                        fontFamily: 'Geist, system-ui',
                        fontSize: '0.92rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        lineHeight: 1.3,
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {product.title}
                      </h4>
                      <p style={{
                        fontSize: '0.76rem',
                        color: 'rgba(255,255,255,0.3)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {product.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: 10,
                      borderTop: '1px solid #121212',
                    }}>
                      {formattedDate && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.22)', fontSize: '0.65rem' }}>
                          <CalendarIcon /> {formattedDate}
                        </div>
                      )}
                      {/* Skeuomorphic LED Active Chip */}
                      <span style={{
                        fontSize: '0.58rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(34,197,94,0.9)',
                        fontWeight: 600,
                        background: '#09150d',
                        padding: '2px 7px',
                        borderRadius: 5,
                        borderTop: '1px solid #14301d',
                        borderLeft: '1px solid #14301d',
                        borderRight: '1px solid #050a06',
                        borderBottom: '1px solid #050a06',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.8)' }} />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Table View — Skeuomorphic Table */
          <div data-anim style={{
            borderRadius: 14,
            background: '#0e0e0e',
            borderTop: '1px solid #222222',
            borderLeft: '1px solid #222222',
            borderRight: '1px solid #060606',
            borderBottom: '1px solid #060606',
            boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{
                  background: '#060606',
                  borderBottom: '1px solid #141414',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
                }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Product</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Price</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Date Created</th>
                  <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => {
                  const mainImg = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
                  const formattedDate = product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'N/A'

                  return (
                    <tr
                      key={product._id}
                      style={{
                        borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid #101010',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#090909'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={mainImg}
                            alt=""
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: 7,
                              objectFit: 'cover',
                              background: '#060606',
                              borderTop: '1px solid #1e1e1e',
                              borderLeft: '1px solid #1e1e1e',
                              borderRight: '1px solid #080808',
                              borderBottom: '1px solid #080808',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                            }}
                          />
                          <div>
                            <p style={{ fontFamily: 'Geist, system-ui', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>
                              {product.title}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'Geist, system-ui', fontWeight: 600, fontSize: '0.85rem', color: '#ffffff' }}>
                        {product.price?.currency || 'INR'} {Number(product.price?.amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                        {formattedDate}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.58rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'rgba(34,197,94,0.9)',
                          fontWeight: 600,
                          background: '#09150d',
                          padding: '2px 7px',
                          borderRadius: 5,
                          borderTop: '1px solid #14301d',
                          borderLeft: '1px solid #14301d',
                          borderRight: '1px solid #050a06',
                          borderBottom: '1px solid #050a06',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.8)' }} />
                          Active
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard