import React from 'react'
import { useNavigate } from 'react-router'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

const ProductGrid = ({ products = [], onSelectProduct }) => {
  const navigate = useNavigate()

  const handleProductClick = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product)
    } else {
      navigate(`/product/${product._id}`)
    }
  }

  return (
    <div
      data-anim
      className="product-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 24,
      }}
    >
      {products.map((product) => {
        const mainImg = product.images?.[0]?.url || DEFAULT_PRODUCT_IMAGE

        return (
          <div
            key={product._id}
            className="product-card"
            onClick={() => handleProductClick(product)}
            style={{
              borderRadius: 20,
              background: 'linear-gradient(180deg, #101012 0%, #080809 100%)',
              borderTop: '1px solid #242428',
              borderLeft: '1px solid #242428',
              borderRight: '1px solid #050505',
              borderBottom: '1px solid #050505',
              boxShadow: '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow =
                '0 16px 40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow =
                '0 8px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)'
            }}
          >
            {/* Image Container */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                background: '#040404',
                overflow: 'hidden',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <img
                src={mainImg}
                alt={product.title}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'block',
                }}
              />

              {/* Price Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  padding: '6px 12px',
                  borderRadius: 10,
                  background: 'rgba(10, 10, 12, 0.88)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '0.8rem',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {product.price?.currency || 'USD'}{' '}
                {Number(product.price?.amount || 0).toLocaleString('en-US')}
              </div>

              {product.images?.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(10, 10, 12, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.62rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                  }}
                >
                  {product.images.length} photos
                </div>
              )}
            </div>

            {/* Card Content */}
            <div
              className="product-card__content"
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <h4
                  className="product-card__title"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    marginBottom: 6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {product.title}
                </h4>
                <p
                  className="product-card__desc"
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.45)',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  {product.seller?.fullname || 'Velora Atelier'}
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#ffffff',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    background: 'linear-gradient(180deg, #222226 0%, #121214 100%)',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Piece →
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductGrid
