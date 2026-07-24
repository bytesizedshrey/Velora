import React from 'react'

const ProductSkeleton = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          style={{
            height: 280,
            borderRadius: 14,
            background: '#090909',
            border: '1px solid #141414',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
      ))}
    </div>
  )
}

export default ProductSkeleton
