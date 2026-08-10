'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: { url: string }[]
  categoryName: string
}

export default function ProductListClient({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = useState('featured')

  const sortedProducts = useMemo(() => {
    const list = [...products]
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price)
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return list
    }
  }, [products, sortBy])

  return (
    <div>
      {/* Header avec tri */}
      <div className="d-flex justify-content-end align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #ddd' }}>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
          style={{ width: 160, fontSize: 13, borderRadius: 0, borderColor: '#999' }}
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      {/* Grille produits */}
      <div className="row g-4">
        {sortedProducts.map((product) => {
          const imageUrl = product.images?.[0]?.url || '/assets/img/placeholder.jpg'
          
          return (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <Link href={`/produits/${product.slug}`} className="text-decoration-none">
                <div className="text-center">
                  <div 
                    className="position-relative w-100 mb-3" 
                    style={{ height: 320, backgroundColor: '#f0f0f0', overflow: 'hidden' }}
                  >
                    <Image 
                      src={imageUrl} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  <p className="mb-1" style={{ color: '#333', fontSize: 13, fontWeight: 500 }}>
                    {product.name}
                  </p>
                  <p className="fw-bold mb-0" style={{ color: '#000', fontSize: 14 }}>
                    {product.price.toFixed(0)} DT
                  </p>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}