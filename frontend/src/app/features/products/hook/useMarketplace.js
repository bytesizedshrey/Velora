import { useState, useMemo } from 'react'
import { filterAndSortProducts } from '../utils/productFilters'

export const useMarketplace = (products = []) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, searchQuery, sortBy)
  }, [products, searchQuery, sortBy])

  const openModal = (product) => {
    setSelectedProduct(product)
    setActiveImageIdx(0)
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

  return {
    searchQuery,
    setSearchQuery,
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
  }
}
