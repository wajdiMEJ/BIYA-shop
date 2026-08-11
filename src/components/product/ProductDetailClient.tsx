'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import Toast from '@/components/ui/Toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [hoveredSize, setHoveredSize] = useState<string | null>(null)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [sizeError, setSizeError] = useState(false)
  const [qtyError, setQtyError] = useState(false)
  
  const { addItem } = useCart()
  const router = useRouter()
  
  const variants = product.variants || []
  
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
  const sizesFromVariants: string[] = variants.map((v: any) => String(v.size))
  const availableSizes = [...new Set(sizesFromVariants)].sort(
    (a: string, b: string) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
  )
  
  const getVariantStock = (size: string) => {
    const variant = variants.find((v: any) => v.size === size)
    return variant ? variant.stock : 0
  }
  
  const selectedStock = selectedSize ? getVariantStock(selectedSize) : 0
  const canBuy = selectedSize && selectedStock > 0

  // Vérifie si la promo est actuellement active selon les dates
  const now = new Date()
  const saleStart = product.saleStartDate ? new Date(product.saleStartDate) : null
  const saleEnd = product.saleEndDate ? new Date(product.saleEndDate) : null

  const isWithinSalePeriod = 
    (!saleStart || now >= saleStart) && 
    (!saleEnd || now <= saleEnd)

  const isOnSale = Boolean(product.salePrice) && 
    Number(product.salePrice) < Number(product.price) && 
    isWithinSalePeriod

  // Prix final à utiliser (soldé si applicable, sinon normal)
  const finalPrice = isOnSale ? product.salePrice : product.price

  const handleSizeClick = (size: string) => {
    const stock = getVariantStock(size)
    if (stock === 0) return
    setSelectedSize(size)
    setSizeError(false)
  }

  const handleQuantityUp = () => {
    if (selectedSize && quantity >= selectedStock) {
      setQtyError(true)
      setTimeout(() => setQtyError(false), 2500)
      return
    }
    if (!selectedSize) {
      setQuantity(quantity + 1)
      return
    }
    setQuantity(Math.min(selectedStock, quantity + 1))
  }

  const handleQuantityDown = () => {
    setQuantity(Math.max(1, quantity - 1))
    setQtyError(false)
  }

  const handleAddToCart = () => {
    if (!canBuy) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 3000)
      return
    }
    
    const imageUrl = product.images?.[0]?.url || '/assets/img/placeholder.jpg'
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      size: selectedSize!,
      quantity: quantity,
      image: imageUrl,
    })

    setToast({ 
      visible: true, 
      message: `${product.name} (Taille ${selectedSize}) ajouté au panier` 
    })

    setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 3000)
  }

  const handleBuyNow = () => {
    if (!canBuy) {
      setSizeError(true)
      setTimeout(() => setSizeError(false), 3000)
      return
    }
    
    const imageUrl = product.images?.[0]?.url || '/assets/img/placeholder.jpg'
    
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      size: selectedSize!,
      quantity: quantity,
      image: imageUrl,
    })

    router.push('/commander')
  }

  return (
    <div>
      <Toast 
        message={toast.message} 
        visible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />

      <h1 className="fw-bold mb-3" style={{ color: '#3E3125', fontSize: '1.8rem', lineHeight: 1.3 }}>
        {product.name}
      </h1>
      
      {/* Prix */}
      <div className="mb-4">
        {isOnSale ? (
          <div className="d-flex align-items-center gap-3">
            <span 
              className="text-decoration-line-through fw-bold"
              style={{ color: '#999', fontSize: '1.3rem' }}
            >
              {product.price.toFixed(2)} DT
            </span>
            <span 
              className="fw-bold"
              style={{ color: '#dc2626', fontSize: '1.8rem' }}
            >
              {product.salePrice.toFixed(2)} DT
            </span>
            <span 
              className="fw-bold px-2 py-1 text-white"
              style={{ backgroundColor: '#dc2626', fontSize: 12, borderRadius: 6 }}
            >
              SOLDE
            </span>
          </div>
        ) : (
          <span className="fw-bold" style={{ color: '#3E3125', fontSize: '1.6rem' }}>
            {product.price.toFixed(2)} DT
          </span>
        )}
      </div>

{/* Info fin de promo */}
{isOnSale && saleEnd && (
  <div className="mb-4">
    <span 
      className="d-inline-block px-3 py-2 fw-bold"
      style={{ 
        backgroundColor: '#fee2e2', 
        color: '#dc2626', 
        fontSize: 13, 
        borderRadius: 8 
      }}
    >
      ⏰ Offre valable jusqu'au {saleEnd.toLocaleDateString('fr-FR')} à {saleEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    </span>
  </div>
)}


      {/* Description */}
      {product.description && (
        <div className="mb-4">
          <p style={{ color: '#6F4E37', fontSize: 15, lineHeight: 1.6 }}>
            {product.description}
          </p>
        </div>
      )}
      
      {/* Sélecteur de taille */}
      <div className="mb-3">
        <label className="form-label fw-bold mb-3" style={{ color: '#3E3125', fontSize: 15 }}>
          Taille {selectedSize ? `• ${selectedSize}` : ''}
        </label>
        <div className="d-flex gap-2 flex-wrap">
          {availableSizes.length > 0 ? (
            availableSizes.map((size: string) => {
              const stock = getVariantStock(size)
              const isSelected = selectedSize === size
              const noStock = stock === 0
              const isHovered = hoveredSize === size
              
              return (
                <div key={size} className="position-relative">
                  <button
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    onMouseEnter={() => setHoveredSize(size)}
                    onMouseLeave={() => setHoveredSize(null)}
                    className="d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      border: isSelected && !noStock ? '2px solid #3E3125' : '1px solid #D8CBB8',
                      backgroundColor: isSelected && !noStock ? '#F8F5EF' : noStock ? '#f5f0eb' : '#fff',
                      color: noStock ? '#B8895A' : '#3E3125',
                      cursor: noStock ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      opacity: noStock ? 0.5 : 1,
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                  
                  {noStock && isHovered && (
                    <div 
                      className="position-absolute text-center fw-bold"
                      style={{
                        bottom: -28,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#3E3125',
                        color: '#F8F5EF',
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 6,
                        whiteSpace: 'nowrap',
                        zIndex: 100,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      Stock épuisé
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <span style={{ color: '#6F4E37' }}>Taille unique</span>
          )}
        </div>
        
        {sizeError && (
          <div 
            className="mt-2 p-2 rounded fw-bold"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 13 }}
          >
            ⚠️ Veuillez choisir une taille
          </div>
        )}
      </div>
      
      {/* Quantité */}
      <div className="mb-4">
        <label className="form-label fw-bold mb-3" style={{ color: '#3E3125', fontSize: 15 }}>Quantité</label>
        <div className="d-flex align-items-center gap-3">
          <button 
            className="d-flex align-items-center justify-content-center border-0 fw-bold"
            onClick={handleQuantityDown}
            style={{ 
              width: 44, height: 44, borderRadius: '50%', 
              backgroundColor: '#F8F5EF', color: '#3E3125',
              fontSize: 20, cursor: 'pointer', border: '1px solid #D8CBB8'
            }}
          >−</button>
          <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center', color: '#3E3125', fontSize: 18 }}>
            {quantity}
          </span>
          <button 
            className="d-flex align-items-center justify-content-center border-0 fw-bold"
            onClick={handleQuantityUp}
            style={{ 
              width: 44, height: 44, borderRadius: '50%', 
              backgroundColor: '#F8F5EF', color: '#3E3125',
              fontSize: 20, cursor: 'pointer', border: '1px solid #D8CBB8'
            }}
          >+</button>
        </div>
        
        {qtyError && (
          <div 
            className="mt-2 p-2 rounded fw-bold"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 13 }}
          >
            ⚠️ Stock insuffisant pour cette quantité
          </div>
        )}
      </div>
      
      {/* Boutons d'action */}
      <div className="d-flex flex-column gap-3">
        <button 
          className="btn w-100 fw-bold border-0"
          onClick={handleAddToCart}
          style={{ 
            backgroundColor: '#6F4E37', 
            color: '#F8F5EF',
            borderRadius: 50,
            padding: '16px',
            fontSize: 16,
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
        >
          🛒 Ajouter au panier
        </button>
        
        <button 
          className="btn w-100 fw-bold border-0"
          onClick={handleBuyNow}
          style={{ 
            backgroundColor: '#3E3125', 
            color: '#F8F5EF',
            borderRadius: 50,
            padding: '16px',
            fontSize: 16,
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
        >
          ⚡ Commander
        </button>
      </div>
    </div>
  )
}