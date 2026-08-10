'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  saleStartDate?: string | null
  saleEndDate?: string | null
  images: { url: string }[]
}

export default function ProductGridModern({ products, title }: { products: Product[], title?: string }) {
  return (
    <div>
      {title && (
        <h2 className="fw-bold text-center mb-5" style={{ color: '#3E3125' }}>{title}</h2>
      )}
      
      <div className="row g-4">
        {products.map((product) => {
          const imageUrl = product.images?.[0]?.url || '/assets/img/placeholder.jpg'
          const price = Number(product.price)
          const comparePrice = product.comparePrice != null ? Number(product.comparePrice) : null

          const now = new Date()
          const saleStart = product.saleStartDate ? new Date(product.saleStartDate) : null
          const saleEnd = product.saleEndDate ? new Date(product.saleEndDate) : null

          const isWithinSalePeriod = 
            (!saleStart || now >= saleStart) && 
            (!saleEnd || now <= saleEnd)

          const isOnSale = comparePrice !== null && comparePrice < price && isWithinSalePeriod
          const discountPercent = isOnSale 
            ? Math.round((1 - comparePrice! / price) * 100) 
            : 0
          
          return (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <Link href={`/produits/${product.slug}`} className="text-decoration-none">
                <div 
                  className="card h-100 border-0 position-relative"
                  style={{ 
                    backgroundColor: '#F8F5EF', 
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(62,49,37,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div 
                    className="position-relative w-100" 
                    style={{ height: 280, backgroundColor: '#EEE6D8' }}
                  >
                    {isOnSale && (
                      <div 
                        className="position-absolute top-0 start-0 fw-bold text-white px-3 py-1"
                        style={{ 
                          backgroundColor: '#dc2626', 
                          fontSize: 12,
                          borderRadius: '0 0 12px 0',
                          zIndex: 10
                        }}
                      >
                        -{discountPercent}%
                      </div>
                    )}
                    <Image 
                      src={imageUrl} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 576px) 50vw, (max-width: 768px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  
                  <div className="card-body text-center p-3">
                    <h5 className="fw-bold mb-2" style={{ color: '#3E3125', fontSize: 15 }}>
                      {product.name}
                    </h5>
                    
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      {isOnSale ? (
                        <>
                          <span 
                            className="text-decoration-line-through"
                            style={{ color: '#999', fontSize: 14 }}
                          >
                            {price.toFixed(2)} DT
                          </span>
                          <span 
                            className="fw-bold"
                            style={{ color: '#dc2626', fontSize: 18 }}
                          >
                            {comparePrice!.toFixed(2)} DT
                          </span>
                        </>
                      ) : (
                        <span className="fw-bold" style={{ color: '#6F4E37', fontSize: 16 }}>
                          {price.toFixed(2)} DT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}