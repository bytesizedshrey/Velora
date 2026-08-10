import React from 'react'
import { DiagonalCarousel } from '../../../../components/ui/diagonal-carousel'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

/**
 * 3D Coverflow Diagonal Carousel for the currently active variant.
 * Displays primary variant image front and center with adjacent angle/gallery images
 * partially visible on the left and right with smooth spring transitions.
 */
export const ProductVariantCarousel = ({
  images = [],
  allProductImages = [],
  title = '',
  activeIdx = 0,
  onSelectIdx,
}) => {
  let rawList = (images && images.length > 0) ? [...images] : []

  // Ensure at least 3 slides exist so 3D coverflow perspective always renders side slides
  if (rawList.length < 3 && allProductImages && allProductImages.length > 0) {
    const existingUrls = new Set(rawList.map(img => img?.url || img))
    const extra = allProductImages.filter(img => !existingUrls.has(img?.url || img))
    rawList = [...rawList, ...extra]
  }

  if (rawList.length === 0) {
    rawList = [{ url: DEFAULT_PRODUCT_IMAGE, alt: title || 'Product Image' }]
  }

  // Duplicate slides if still < 3 so sides are always populated in 3D coverflow
  if (rawList.length < 3) {
    let copyIndex = 0
    while (rawList.length < 3) {
      rawList.push(rawList[copyIndex % rawList.length])
      copyIndex++
    }
  }

  const carouselItems = rawList.map((img, idx) => ({
    src: img?.url || img || DEFAULT_PRODUCT_IMAGE,
    title: img?.alt || (idx === 0 ? (title || 'Primary View') : `Angle View ${idx + 1}`),
    alt: img?.alt || title || `Product image ${idx + 1}`,
  }))

  return (
    <div className="pd-carousel-wrapper">
      <DiagonalCarousel
        items={carouselItems}
        activeIndex={Math.min(activeIdx, carouselItems.length - 1)}
        onActiveIndexChange={onSelectIdx}
        slideSize={210}
        verticalStep={45}
        rotationStep={18}
        inactiveScale={0.72}
        showControls={true}
        showDots={carouselItems.length > 1}
        className="pd-carousel-inner"
        imageClassName="border-t border-l border-white/30 border-r border-b border-black/90 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_20px_50px_rgba(0,0,0,0.95)]"
        controlsClassName="bg-gradient-to-b from-[#1c1c22] to-[#0a0a0d] border-t border-l border-white/25 border-r border-b border-black/90 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.8),0_10px_24px_rgba(0,0,0,0.95)] backdrop-blur-md"
      />
    </div>
  )
}

export default ProductVariantCarousel
