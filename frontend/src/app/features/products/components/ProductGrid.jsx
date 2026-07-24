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
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {products.map((product) => {
        const mainImg = product.images?.[0]?.url || DEFAULT_PRODUCT_IMAGE

        return (
          <div
            key={product._id}
            onClick={() => handleProductClick(product)}
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
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow =
                '0 10px 28px rgba(0,0,0,0.7), 0 2px 6px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow =
                '0 6px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)'
            }}
          >
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/10',
                background: '#060606',
                overflow: 'hidden',
                borderBottom: '1px solid #0c0c0c',
                boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.7)',
              }}
            >
              <img
                src={mainImg}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
              />

              <div
                style={{
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
                  fontSize: '0.8rem',
                  fontFamily: 'Geist, system-ui',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {product.price?.currency || 'INR'}{' '}
                {Number(product.price?.amount || 0).toLocaleString('en-IN')}
              </div>

              {product.images?.length > 1 && (
                <div
                  style={{
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
                  }}
                >
                  {product.images.length} photos
                </div>
              )}
            </div>

            <div
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <div>
                <h4
                  style={{
                    fontFamily: 'Geist, system-ui',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.3,
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {product.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: 1.4,
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
                  paddingTop: 10,
                  borderTop: '1px solid #121212',
                }}
              >
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                  {product.seller?.fullname || 'Verified Seller'}
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    color: 'rgba(212,212,212,0.6)',
                    letterSpacing: '0.06em',
                    background: '#141414',
                    padding: '2px 8px',
                    borderRadius: 5,
                    border: '1px solid #222222',
                  }}
                >
                  View Item →
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
