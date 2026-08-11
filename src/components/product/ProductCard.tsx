'use client'

import Image from 'next/image'
import Link from 'next/link'
//import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    stock: number
    images: { url: string; isPrimary: boolean }[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/assets/img/placeholder.jpg'
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
      <Link href={isOutOfStock ? '#' : `/produits/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden" style={{ backgroundColor: '#EEE6D8' }}>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isOutOfStock ? 'opacity-60' : 'group-hover:scale-105'}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                RUPTURE DE STOCK
              </span>
            </div>
          )}
          {hasDiscount && !isOutOfStock && (
            <span className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#B8895A' }}>
              -{Math.round(((product.salePrice! - product.price) / product.salePrice!) * 100)}%
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 mb-2" style={{ color: '#3E3125' }}>
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold" style={{ color: '#3E3125' }}>{product.price.toFixed(2)} DT</span>
          {hasDiscount && (
            <span className="text-sm line-through" style={{ color: '#6F4E37' }}>{product.salePrice!.toFixed(2)} DT</span>
          )}
        </div>

        {/* Badge stock */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="inline-block text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              ⚠️ Rupture de stock
            </span>
          ) : isLowStock ? (
            <span className="inline-block text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#ffedd5', color: '#ea580c' }}>
              🔥 Plus que {product.stock} en stock
            </span>
          ) : (
            <span className="inline-block text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
              ✅ En stock
            </span>
          )}
        </div>

        <button 
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isOutOfStock 
              ? 'cursor-not-allowed' 
              : 'hover:opacity-90'
          }`}
          style={{ 
            backgroundColor: isOutOfStock ? '#D8CBB8' : '#6F4E37', 
            color: isOutOfStock ? '#6F4E37' : '#F8F5EF' 
          }}
        >
            🛒
          {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}