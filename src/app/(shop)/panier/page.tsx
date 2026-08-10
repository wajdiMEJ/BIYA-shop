'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import Toast from '@/components/ui/Toast'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleRemove = (id: string, size: string, name: string) => {
    removeItem(id, size)
    showToast(`${name} retiré du panier`)
  }

  const handleClear = () => {
    clearCart()
    showToast('Panier vidé')
  }

  if (items.length === 0) {
    return (
      <>
        <TopNav />
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
          <Toast 
            message={toast.message} 
            visible={toast.visible} 
            onClose={() => setToast({ ...toast, visible: false })} 
          />
          <div className="mb-4" style={{ fontSize: 64 }}>🛒</div>
          <h2 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Votre panier est vide</h2>
          <p className="mb-4" style={{ color: '#6F4E37' }}>Découvrez nos produits et ajoutez-les ici !</p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-lg fw-bold px-5"
            style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50 }}
          >
            Continuer les achats
          </button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <Header />
      <div className="container py-5">
        <Toast 
          message={toast.message} 
          visible={toast.visible} 
          onClose={() => setToast({ ...toast, visible: false })} 
        />

        <h2 className="fw-bold mb-4" style={{ color: '#3E3125' }}>
          🛒 Mon Panier ({items.length} article{items.length > 1 ? 's' : ''})
        </h2>
        
        <div className="row g-4">
          {/* Liste des articles */}
          <div className="col-lg-8">
            {items.map((item) => (
              <div 
                key={`${item.id}-${item.size}`} 
                className="card mb-3 p-3 d-flex flex-row align-items-center gap-3" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8', borderRadius: 16 }}
              >
                {/* Image */}
                <div 
                  className="position-relative flex-shrink-0" 
                  style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden' }}
                >
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                
                {/* Infos */}
                <div className="flex-grow-1">
                  <Link href={`/produits/${item.slug}`} className="text-decoration-none">
                    <h5 className="fw-bold mb-1" style={{ color: '#3E3125' }}>{item.name}</h5>
                  </Link>
                  <p className="mb-1" style={{ color: '#6F4E37', fontSize: 14 }}>
                    Taille: <span className="fw-bold">{item.size}</span>
                  </p>
                  <p className="fw-bold mb-0" style={{ color: '#6F4E37', fontSize: 16 }}>
                    {item.price.toFixed(2)} DT
                  </p>
                </div>
                
                {/* Quantité */}
                <div className="d-flex align-items-center gap-2">
                  <button 
                    className="btn btn-sm fw-bold d-flex align-items-center justify-content-center border-0"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    style={{ 
                      backgroundColor: '#EEE6D8', 
                      color: '#3E3125', 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%' 
                    }}
                  >−</button>
                  <span className="fw-bold" style={{ minWidth: 28, textAlign: 'center', color: '#3E3125' }}>
                    {item.quantity}
                  </span>
                  <button 
                    className="btn btn-sm fw-bold d-flex align-items-center justify-content-center border-0"
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    style={{ 
                      backgroundColor: '#EEE6D8', 
                      color: '#3E3125', 
                      width: 36, 
                      height: 36, 
                      borderRadius: '50%' 
                    }}
                  >+</button>
                </div>
                
                {/* Prix total ligne + Supprimer */}
                <div className="text-end d-none d-md-block" style={{ minWidth: 100 }}>
                  <p className="fw-bold mb-2" style={{ color: '#3E3125', fontSize: 16 }}>
                    {(item.price * item.quantity).toFixed(2)} DT
                  </p>
                  <button 
                    className="btn btn-sm fw-bold border-0"
                    onClick={() => handleRemove(item.id, item.size, item.name)}
                    style={{ color: '#dc2626', fontSize: 13, backgroundColor: 'transparent', textDecoration: 'underline' }}
                  >
                    Supprimer
                  </button>
                </div>
                
                {/* Supprimer mobile */}
                <button 
                  className="btn btn-sm fw-bold border-0 d-md-none"
                  onClick={() => handleRemove(item.id, item.size, item.name)}
                  style={{ color: '#dc2626', backgroundColor: 'transparent' }}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button 
              className="btn fw-bold mt-2"
              onClick={handleClear}
              style={{ color: '#6F4E37', fontSize: 14, backgroundColor: 'transparent', textDecoration: 'underline' }}
            >
              Vider le panier
            </button>
          </div>

          {/* Récapitulatif */}
          <div className="col-lg-4">
            <div 
              className="card p-4 sticky-top" 
              style={{ 
                backgroundColor: '#F8F5EF', 
                borderColor: '#D8CBB8', 
                borderRadius: 16,
                top: 20 
              }}
            >
              <h4 className="fw-bold mb-4" style={{ color: '#3E3125' }}>Récapitulatif</h4>
              
              <div className="d-flex justify-content-between mb-2" style={{ color: '#6F4E37' }}>
                <span>Sous-total</span>
                <span className="fw-bold">{totalPrice.toFixed(2)} DT</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ color: '#6F4E37' }}>
                <span>Livraison</span>
                <span className="fw-bold" style={{ color: '#16a34a' }}>8.000 DT</span>
              </div>
              <hr style={{ borderColor: '#D8CBB8' }} />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>Total</span>
                <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>
                  {(totalPrice + 8).toFixed(3)} DT
                </span>
              </div>
              
              <Link
                href="/commander"
                className="btn w-100 fw-bold mb-3 border-0 text-decoration-none text-center d-block"
                style={{ 
                  backgroundColor: '#6F4E37', 
                  color: '#F8F5EF',
                  borderRadius: 50,
                  padding: '16px',
                  fontSize: 16
                }}
              >
                Commander
              </Link>
              
              <button
                onClick={() => router.push('/')}
                className="btn w-100 fw-bold border-0"
                style={{ 
                  backgroundColor: '#EEE6D8', 
                  color: '#3E3125',
                  borderRadius: 50,
                  padding: '14px',
                  fontSize: 15
                }}
              >
                Continuer les achats
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}