import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import { useProduct } from '../hook/useProduct'
import { useMarketplace } from '../hook/useMarketplace'
import HeroSection from '../components/HeroSection'
import MarketplaceToolbar from '../components/MarketplaceToolbar'
import ProductSkeleton from '../components/ProductSkeleton'
import EmptyState from '../components/EmptyState'
import ProductGrid from '../components/ProductGrid'
import ProductTable from '../components/ProductTable'
import ProductModal from '../components/ProductModal'

const Home = () => {
  const navigate = useNavigate()
  const { handleGetAllProducts } = useProduct()
  const products = useSelector(
    (state) => state.product?.products || state.products?.products || []
  )

  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  const {
    searchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedProduct,
    activeImageIdx,
    setActiveImageIdx,
    openModal,
    closeModal,
    filteredProducts,
  } = useMarketplace(products)

  useEffect(() => {
    let isMounted = true
    const fetchProducts = async () => {
      setLoading(true)
      try {
        await handleGetAllProducts()
      } catch (err) {
        console.error('Failed to fetch marketplace products:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        '[data-anim]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      )
    }
  }, [loading])

  const handleSelectProduct = (product) => {
    navigate(`/product/${product._id}`)
  }

  const handleContactSeller = () => {
    alert('Interest recorded! Seller contact details will be emailed.')
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#040404',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <main
        style={{
          flex: 1,
          maxWidth: 1100,
          width: '100%',
          margin: '0 auto',
          padding: '32px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <HeroSection totalProductsCount={products.length} />

        <MarketplaceToolbar
          filteredCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <ProductSkeleton />
        ) : filteredProducts.length === 0 ? (
          <EmptyState searchQuery={searchQuery} />
        ) : viewMode === 'grid' ? (
          <ProductGrid products={filteredProducts} onSelectProduct={handleSelectProduct} />
        ) : (
          <ProductTable products={filteredProducts} onSelectProduct={handleSelectProduct} />
        )}
      </main>

      <ProductModal
        product={selectedProduct}
        activeImageIdx={activeImageIdx}
        onImageSelect={setActiveImageIdx}
        onClose={closeModal}
        onContactSeller={handleContactSeller}
      />
    </div>
  )
}

export default Home