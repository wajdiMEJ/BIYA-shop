'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  isPrimary: boolean
}

interface ProductVariant {
  id: string
  size: string
  stock: number
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  salePrice: number | null
  images: ProductImage[]
  variants: ProductVariant[]
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const mainImage = product.images.find(img => img.isPrimary)?.url 
    || product.images[0]?.url 
    || '/assets/img/placeholder.jpg'

  const selectedVariant = product.variants.find(v => v.size === selectedSize)
  const maxQuantity = selectedVariant ? selectedVariant.stock : 0
  const canAddToCart = selectedSize && maxQuantity > 0 && quantity <= maxQuantity

  function addToCart() {
    if (!canAddToCart) {
      setMessage('❌ Sélectionnez une taille disponible')
      return
    }

    try {
      const cart = JSON.parse(localStorage.getItem('biya-cart') || '[]')
      
      const existingIndex = cart.findIndex(
        (item: any) => item.productId === product.id && item.size === selectedSize
      )

      if (existingIndex >= 0) {
        const newQty = cart[existingIndex].quantity + quantity
        if (newQty > maxQuantity) {
          setMessage(`❌ Stock insuffisant. Maximum: ${maxQuantity}`)
          return
        }
        cart[existingIndex].quantity = newQty
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          size: selectedSize,
          quantity: quantity,
          image: mainImage,
        })
      }

      localStorage.setItem('biya-cart', JSON.stringify(cart))
      setMessage('✅ Ajouté au panier !')
      
      // Rafraîchir pour mettre à jour le compteur panier
      router.refresh()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      console.error(e)
      setMessage('❌ Erreur panier')
    }
  }

  function buyNow() {
    addToCart()
    router.push('/panier')
  }

  return (
    <div className="row">
      {/* Image */}
      <div className="col-md-6 mb-4">
        <div className="card border-0" style={{ backgroundColor: '#F8F5EF' }}>
          <img 
            src={mainImage} 
            alt={product.name} 
            className="img-fluid rounded"
            style={{ maxHeight: 500, objectFit: 'cover', width: '100%' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg' }}
          />
        </div>
        {/* Miniatures */}
        <div className="d-flex gap-2 mt-3">
          {product.images.map((img, i) => (
            <img 
              key={img.id || i} 
              src={img.url} 
              alt={img.alt || product.name}
              className="rounded border"
              style={{ width: 60, height: 60, objectFit: 'cover', cursor: 'pointer' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ))}
        </div>
      </div>

      {/* Détails */}
      <div className="col-md-6">
        <h1 className="fw-bold mb-3" style={{ color: '#3E3125' }}>{product.name}</h1>
        
        <h3 className="fw-bold mb-3" style={{ color: '#6F4E37' }}>
          {(product.salePrice || product.price).toFixed(2)} DT
          {product.salePrice && (
            <span className="text-decoration-line-through ms-2" style={{ color: '#999', fontSize: 18 }}>
              {product.price.toFixed(2)} DT
            </span>
          )}
        </h3>

        <p className="mb-4" style={{ color: '#6F4E37' }}>{product.description || 'Aucune description'}</p>

        {/* Taille */}
        <div className="mb-4">
          <h5 className="fw-bold mb-2" style={{ color: '#3E3125' }}>Taille</h5>
          <div className="d-flex gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.stock <= 0}
                onClick={() => {
                  setSelectedSize(v.size)
                  setQuantity(1)
                  setMessage('')
                }}
                className="btn rounded-circle fw-bold"
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: selectedSize === v.size ? '#6F4E37' : '#F8F5EF',
                  color: selectedSize === v.size ? '#F8F5EF' : '#3E3125',
                  border: `2px solid ${v.stock <= 0 ? '#ccc' : '#D8CBB8'}`,
                  opacity: v.stock <= 0 ? 0.5 : 1,
                  cursor: v.stock <= 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {v.size}
              </button>
            ))}
          </div>
          {selectedVariant && selectedVariant.stock > 0 && (
            <small style={{ color: '#6F4E37' }}>Stock: {selectedVariant.stock}</small>
          )}
        </div>

        {/* Quantité */}
        <div className="mb-4">
          <h5 className="fw-bold mb-2" style={{ color: '#3E3125' }}>Quantité</h5>
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn rounded-circle fw-bold"
              style={{ width: 40, height: 40, backgroundColor: '#EEE6D8' }}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={!selectedSize}
            >-</button>
            <span className="fw-bold fs-5" style={{ minWidth: 30, textAlign: 'center' }}>{quantity}</span>
            <button 
              className="btn rounded-circle fw-bold"
              style={{ width: 40, height: 40, backgroundColor: '#EEE6D8' }}
              onClick={() => setQuantity(q => Math.min(maxQuantity || 1, q + 1))}
              disabled={!selectedSize || quantity >= maxQuantity}
            >+</button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mb-3`}>
            {message}
          </div>
        )}

        {/* Boutons */}
        <div className="d-flex flex-column gap-3">
          <button
            onClick={addToCart}
            disabled={!canAddToCart}
            className="btn btn-lg fw-bold w-100"
            style={{ 
              backgroundColor: canAddToCart ? '#6F4E37' : '#ccc', 
              color: '#F8F5EF',
              borderRadius: 50,
            }}
          >
            🛒 Ajouter au panier
          </button>
          <button
            onClick={buyNow}
            disabled={!canAddToCart}
            className="btn btn-lg fw-bold w-100"
            style={{ 
              backgroundColor: canAddToCart ? '#3E3125' : '#ccc', 
              color: '#F8F5EF',
              borderRadius: 50,
            }}
          >
            ⚡ Commander
          </button>
        </div>
      </div>
    </div>
  )
}