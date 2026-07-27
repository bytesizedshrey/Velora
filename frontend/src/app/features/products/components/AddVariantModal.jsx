import React, { useState } from 'react'

export const AddVariantModal = ({ isOpen, onClose, onAddVariant, productId }) => {
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [variantTitle, setVariantTitle] = useState('')
  const [attrName, setAttrName] = useState('Color')
  const [attrValue, setAttrValue] = useState('')
  const [priceAmount, setPriceAmount] = useState('')
  const [priceCurrency, setPriceCurrency] = useState('INR')
  const [stock, setStock] = useState('10')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const imageObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...imageObjects])
    setPreviews((prev) => [...prev, ...imageObjects.map((i) => i.url)])
  }

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const attributes = attrValue.trim() ? { [attrName]: attrValue.trim() } : {}
      const variantPayload = {
        title: variantTitle.trim() || attrValue.trim() || 'Custom Variant',
        images,
        stock: Number(stock) || 0,
        price: {
          amount: Number(priceAmount) || 0,
          currency: priceCurrency,
        },
        attributes,
        attribute: attributes,
      }

      await onAddVariant(productId, variantPayload)
      onClose()
      // Reset
      setImages([])
      setPreviews([])
      setVariantTitle('')
      setAttrValue('')
      setPriceAmount('')
    } catch (err) {
      console.error('Failed to add variant:', err)
      alert(err.message || 'Failed to add variant')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#0d0d0d',
          borderRadius: 20,
          borderTop: '1px solid #282828',
          borderLeft: '1px solid #282828',
          borderRight: '1px solid #080808',
          borderBottom: '1px solid #080808',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.5)',
          padding: '28px 24px',
          color: '#fff',
          fontFamily: "'Duality', 'Orbitron', 'Space Grotesk', system-ui",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Add Product Variant</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Variant Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6 }}>
              Variant Title / Label
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight Black / 256GB"
              value={variantTitle}
              onChange={(e) => setVariantTitle(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                padding: '0 12px',
                borderRadius: 8,
                background: '#060606',
                border: '1px solid #222',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Images Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>
              Variant Images
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 60, height: 60, borderRadius: 10, overflow: 'hidden', border: '1px solid #222' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: 10,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  background: '#141414',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                +
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Attribute Key Value */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6 }}>
                Attribute Name
              </label>
              <input
                type="text"
                placeholder="e.g. Color / Size"
                value={attrName}
                onChange={(e) => setAttrName(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#060606',
                  border: '1px solid #222',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6 }}>
                Value
              </label>
              <input
                type="text"
                placeholder="e.g. Space Black / XL"
                value={attrValue}
                onChange={(e) => setAttrValue(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#060606',
                  border: '1px solid #222',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6 }}>
                Price Amount
              </label>
              <input
                type="number"
                placeholder="Variant price"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#060606',
                  border: '1px solid #222',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 6 }}>
                Stock Units
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{
                  width: '100%',
                  height: 38,
                  padding: '0 12px',
                  borderRadius: 8,
                  background: '#060606',
                  border: '1px solid #222',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              height: 44,
              marginTop: 10,
              borderRadius: 12,
              background: 'linear-gradient(180deg, #262626 0%, #141414 100%)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 600,
              borderTop: '1px solid #383838',
              borderLeft: '1px solid #383838',
              borderRight: '1px solid #0a0a0a',
              borderBottom: '1px solid #0a0a0a',
              boxShadow: '0 6px 18px #000000, inset 0 1px 0 rgba(255,255,255,0.15)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.5 : 1,
            }}
          >
            {submitting ? 'Saving Variant...' : 'Add Variant'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddVariantModal
