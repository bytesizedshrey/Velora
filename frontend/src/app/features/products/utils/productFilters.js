/**
 * Pure utility function to filter and sort products array based on searchQuery and sortBy criteria.
 */
export const filterAndSortProducts = (products = [], searchQuery = '', sortBy = 'newest') => {
  return products
    .filter((p) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.seller?.fullname?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      if (sortBy === 'price-high') return (b.price?.amount || 0) - (a.price?.amount || 0)
      if (sortBy === 'price-low') return (a.price?.amount || 0) - (b.price?.amount || 0)
      return 0
    })
}
