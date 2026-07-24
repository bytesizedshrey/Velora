import React from 'react'
import { useNavigate } from 'react-router'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

const ProductTable = ({ products = [], onSelectProduct }) => {
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
        borderRadius: 14,
        background: '#0e0e0e',
        borderTop: '1px solid #222222',
        borderLeft: '1px solid #222222',
        borderRight: '1px solid #060606',
        borderBottom: '1px solid #060606',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr
            style={{
              background: '#060606',
              borderBottom: '1px solid #141414',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Product</th>
            <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Price</th>
            <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>Seller</th>
            <th style={{ padding: '12px 16px', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', fontWeight: 600, textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const mainImg = product.images?.[0]?.url || DEFAULT_PRODUCT_IMAGE

            return (
              <tr
                key={product._id}
                onClick={() => handleProductClick(product)}
                style={{
                  borderBottom: idx === products.length - 1 ? 'none' : '1px solid #101010',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#090909')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={mainImg}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
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
                  {product.price?.currency || 'INR'}{' '}
                  {Number(product.price?.amount || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
                  {product.seller?.fullname || 'Verified Seller'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(212,212,212,0.6)', background: '#141414', padding: '3px 10px', borderRadius: 6, border: '1px solid #222222' }}>
                    View Details
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
