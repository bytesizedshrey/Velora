import { DEFAULT_PRODUCT_IMAGE } from './constants'

export const getAttrObj = (rawAttr) => {
  if (!rawAttr) return {}
  if (rawAttr instanceof Map) return Object.fromEntries(rawAttr)
  if (typeof rawAttr === 'object') return rawAttr
  return {}
}

export const resolveVariantImages = (variant, variantIdx = 0, allProductImages = []) => {
  const mainImgs = allProductImages.length > 0 ? allProductImages : [{ url: DEFAULT_PRODUCT_IMAGE }]

  // If variant has explicit non-empty images array
  let vImgs = (variant?.images && variant.images.length > 0) ? [...variant.images] : []

  if (vImgs.length === 0) {
    if (mainImgs[variantIdx]) {
      vImgs = [mainImgs[variantIdx], ...mainImgs.filter((_, i) => i !== variantIdx)]
    } else {
      vImgs = [...mainImgs]
    }
  }

  // Try to find image matching variant title or color attribute (e.g. "white", "02")
  const rawAttr = getAttrObj(variant?.attributes || variant?.attribute)
  const keywords = [
    variant?.title,
    rawAttr.Color,
    rawAttr.color,
    rawAttr.Style,
    rawAttr.style
  ].filter(Boolean).map(k => String(k).toLowerCase())

  if (keywords.length > 0 && vImgs.length > 1) {
    const matchIdx = vImgs.findIndex(img => {
      const urlStr = String(img?.url || img || '').toLowerCase()
      const altStr = String(img?.alt || '').toLowerCase()
      return keywords.some(kw => (kw !== 'standard' && kw !== 'default' && kw !== 'variant') && (urlStr.includes(kw) || altStr.includes(kw)))
    })

    if (matchIdx > 0) {
      const matched = vImgs[matchIdx]
      vImgs = [matched, ...vImgs.filter((_, i) => i !== matchIdx)]
    }
  }

  return vImgs.length > 0 ? vImgs : mainImgs
}
