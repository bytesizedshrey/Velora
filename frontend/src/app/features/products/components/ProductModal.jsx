import React from 'react'
import SkeuoButton from '../../../../shared/components/ui/SkeuoButton'
import { XIcon } from '../../../../shared/icons'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

const ProductModal = ({
  product,
  activeImageIdx,
  onImageSelect,
  onClose,
  onContactSeller,
}) => {
  if (!product) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: 620,
          width: '100%',
          background: '#0d0d0d',
          borderRadius: 18,
          borderTop: '1px solid #252525',
          borderLeft: '1px solid #252525',
          borderRight: '1px solid #080808',
          borderBottom: '1px solid #080808',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 9,
            background: '#161616',
            border: '1px solid #282828',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            zIndex: 10,
          }}
        >
          <XIcon />
        </button>

        {/* Image Viewer */}
        <div
          style={{
            position: 'relative',
            height: 280,
            background: '#040404',
            borderBottom: '1px solid #161616',
          }}
        >
          <img
            src={product.images?.[activeImageIdx]?.url || DEFAULT_PRODUCT_IMAGE}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 8,
                background: 'rgba(8,8,8,0.85)',
                padding: 4,
                borderRadius: 9,
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt=""
                  onClick={() => onImageSelect(i)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: activeImageIdx === i ? '2px solid #ffffff' : '1px solid transparent',
                    opacity: activeImageIdx === i ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: '0.62rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                }}
              >
                Listing Details
              </span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                Seller:{' '}
                <strong style={{ color: '#ffffff' }}>
                  {product.seller?.fullname || 'Verified Seller'}
                </strong>
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'Geist, system-ui',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
              }}
            >
              {product.title}
            </h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, margin: 0 }}>
            {product.description}
          </p>

          {/* Price & Action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTop: '1px solid #181818',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.25)',
                  margin: 0,
                }}
              >
                Price
              </p>
              <h3
                style={{
                  fontFamily: 'Geist, system-ui',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {product.price?.currency || 'INR'}{' '}
                {Number(product.price?.amount || 0).toLocaleString('en-IN')}
              </h3>
            </div>

            <SkeuoButton onClick={onContactSeller} height={40} padding="0 20px" fontSize="0.85rem" primary>
              Contact Seller
            </SkeuoButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
