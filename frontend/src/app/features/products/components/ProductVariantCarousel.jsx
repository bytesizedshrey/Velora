import React from 'react'
import { DiagonalCarousel } from '@/components/ui/diagonal-carousel'
import { DEFAULT_PRODUCT_IMAGE } from '../utils/constants'

export const ProductVariantCarousel = ({
  images = [],
  varients = [],
  title = '',
  activeIdx = 0,
  onSelectIdx,
}) => {
  let carouselItems = []

  if (varients && varients.length > 0) {
    carouselItems = varients.map((variant, idx) => {
      const variantImg = variant.images?.[0]?.url || images?.[idx]?.url || images?.[0]?.url || DEFAULT_PRODUCT_IMAGE
      const attrString = variant.attribute
        ? (variant.attribute instanceof Map
            ? Array.from(variant.attribute.values()).join(' / ')
            : typeof variant.attribute === 'object'
            ? Object.values(variant.attribute).join(' / ')
            : String(variant.attribute))
        : ''
      const variantTitle = attrString || (variant.price?.amount ? `${variant.price.currency || 'INR'} ${variant.price.amount}` : `Variant ${idx + 1}`)

      return {
        src: variantImg,
        title: variantTitle,
        alt: `${title} - ${variantTitle}`,
      }
    })
  } else if (images && images.length > 0) {
    carouselItems = images.map((img, idx) => ({
      src: img.url || DEFAULT_PRODUCT_IMAGE,
      title: img.alt || `Image ${idx + 1}`,
      alt: img.alt || title || `Product image ${idx + 1}`,
    }))
  } else {
    carouselItems = [{
      src: DEFAULT_PRODUCT_IMAGE,
      title: 'Original',
      alt: title || 'Product image',
    }]
  }

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#141414] to-[#0a0a0a] shadow-[0_24px_48px_#000000,0_12px_24px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] border border-white/10 flex items-center justify-center p-4">
      <DiagonalCarousel
        items={carouselItems}
        activeIndex={activeIdx}
        onActiveIndexChange={onSelectIdx}
        slideSize={220}
        verticalStep={60}
        rotationStep={15}
        showControls={true}
        showDots={true}
        className="w-full h-full min-h-[340px]"
        imageClassName="border border-white/10 rounded-2xl shadow-2xl"
        controlsClassName="bg-black/80 border-white/15 text-white"
      />
    </div>
  )
}

export default ProductVariantCarousel
