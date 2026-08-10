'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ProductGallery({ images, name }: { images: any[]; name: string }) {
  const validImages = images.length > 0 ? images : [{ url: '/assets/img/placeholder.jpg' }]
  const [mainIndex, setMainIndex] = useState(0)
  
  const mainImage = validImages[mainIndex]?.url || validImages[0]?.url
  
  const prevImage = () => {
    setMainIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
  }
  
  const nextImage = () => {
    setMainIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="d-flex gap-3">
      {/* Miniatures verticales à gauche */}
      <div className="d-flex flex-column gap-2" style={{ width: 70, flexShrink: 0 }}>
        {validImages.map((img, idx) => (
          <div 
            key={idx}
            className="position-relative overflow-hidden"
            style={{ 
              width: 70, 
              height: 70, 
              borderRadius: 10,
              border: mainIndex === idx ? '2px solid #6F4E37' : '1px solid #D8CBB8',
              cursor: 'pointer',
              backgroundColor: '#F8F5EF'
            }}
            onClick={() => setMainIndex(idx)}
          >
            <Image
              src={img.url}
              alt={`${name} - ${idx + 1}`}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      
      {/* Image principale */}
      <div className="flex-grow-1 position-relative" style={{ minHeight: 520 }}>
        <div 
          className="position-relative overflow-hidden w-100 h-100" 
          style={{ backgroundColor: '#F0EDE8', borderRadius: 20, minHeight: 520 }}
        >
          <Image
            src={mainImage}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        {/* Flèches navigation */}
        {validImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="position-absolute d-flex align-items-center justify-content-center border-0"
              style={{
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#3E3125',
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
            >‹</button>
            <button 
              onClick={nextImage}
              className="position-absolute d-flex align-items-center justify-content-center border-0"
              style={{
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#3E3125',
                fontSize: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
            >›</button>
          </>
        )}
      </div>
    </div>
  )
}