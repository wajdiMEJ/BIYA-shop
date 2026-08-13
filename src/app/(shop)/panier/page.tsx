'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PanierPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [toast, setToast] = useState({ visible: false, message: '' })
  
  // ✅ mounted LOCAL (pas dans le contexte)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        <TopNav />
        <Header />
        <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border" style={{ color: '#6F4E37' }} />
          <p className="mt-3" style={{ color: '#6F4E37' }}>Chargement du panier...</p>
        </div>
        <Footer />
      </>
    )
  }

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

  const shipping = totalPrice > 50 ? 0 : 8
  const finalTotal = totalPrice + shipping

  return (
    <>
      <TopNav />
      <Header />

      {toast.visible && (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="alert alert-success alert-dismissible fade show">
            {toast.message}
            <button type="button" className="btn-close" onClick={() => setToast({ ...toast, visible: false })} />
          </div>
        </div>
      )}

      <div className="container py-5">
        <h2 className="fw-bold mb-4" style={{ color: '#3E3125' }}>
          🛒 Mon Panier ({items.length} article{items.length > 1 ? 's' : ''})
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-5" style={{ minHeight: '50vh' }}>
            <div className="mb-4" style={{ fontSize: 64 }}>🛒</div>
            <h2 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Votre panier est vide</h2>
            <p className="mb-4" style={{ color: '#6F4E37' }}>Découvrez nos produits et ajoutez-les ici !</p>
            <button
              onClick={() => router.push('/produits')}
              className="btn btn-lg fw-bold px-5"
              style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50 }}
            >
              Continuer les achats
            </button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="card mb-3 p-3"
                  style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8', borderRadius: 16 }}
                >
                  <div className="row align-items-center">
                    <div className="col-3 col-md-2">
                      <img
                        src={item.image || '/assets/img/placeholder.jpg'}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ width: '100%', height: 80, objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg' }}
                      />
                    </div>

                    <div className="col-5 col-md-4">
                      <Link href={`/produits/${item.slug || ''}`} className="text-decoration-none">
                        <h6 className="fw-bold mb-1" style={{ color: '#3E3125' }}>{item.name}</h6>
                      </Link>
                      <p className="mb-1" style={{ color: '#6F4E37', fontSize: 14 }}>
                        Taille: <span className="fw-bold">{item.size}</span>
                      </p>
                      <p className="fw-bold mb-0 d-md-none" style={{ color: '#6F4E37' }}>
                        {(item.price * item.quantity).toFixed(3)} DT
                      </p>
                    </div>

                    <div className="col-4 col-md-3">
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        <button
                          className="btn btn-sm fw-bold border-0"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          style={{ backgroundColor: '#EEE6D8', color: '#3E3125', width: 32, height: 32, borderRadius: '50%' }}
                        >−</button>
                        <span className="fw-bold" style={{ minWidth: 24, textAlign: 'center', color: '#3E3125' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm fw-bold border-0"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          style={{ backgroundColor: '#EEE6D8', color: '#3E3125', width: 32, height: 32, borderRadius: '50%' }}
                        >+</button>
                      </div>
                    </div>

                    <div className="col-md-3 text-end d-none d-md-block">
                      <p className="fw-bold mb-1" style={{ color: '#3E3125' }}>
                        {(item.price * item.quantity).toFixed(3)} DT
                      </p>
                      <button
                        className="btn btn-sm p-0"
                        onClick={() => handleRemove(item.id, item.size, item.name)}
                        style={{ color: '#dc2626', fontSize: 13, backgroundColor: 'transparent', textDecoration: 'underline' }}
                      >
                        Supprimer
                      </button>
                    </div>

                    <div className="col-12 d-md-none mt-2 text-end">
                      <button
                        className="btn btn-sm p-0"
                        onClick={() => handleRemove(item.id, item.size, item.name)}
                        style={{ color: '#dc2626', fontSize: 13, backgroundColor: 'transparent' }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn fw-bold mt-2 p-0"
                onClick={handleClear}
                style={{ color: '#6F4E37', fontSize: 14, backgroundColor: 'transparent', textDecoration: 'underline' }}
              >
                Vider le panier
              </button>
            </div>

            <div className="col-lg-4">
              <div
                className="card p-4"
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8', borderRadius: 16 }}
              >
                <h4 className="fw-bold mb-4" style={{ color: '#3E3125' }}>Récapitulatif</h4>

                <div className="d-flex justify-content-between mb-2" style={{ color: '#6F4E37' }}>
                  <span>Sous-total</span>
                  <span className="fw-bold">{totalPrice.toFixed(3)} DT</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ color: '#6F4E37' }}>
                  <span>Livraison</span>
                  <span className="fw-bold" style={{ color: shipping === 0 ? '#16a34a' : '#6F4E37' }}>
                    {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(3)} DT`}
                  </span>
                </div>
                <hr style={{ borderColor: '#D8CBB8' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>Total</span>
                  <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>
                    {finalTotal.toFixed(3)} DT
                  </span>
                </div>

                <Link
                  href="/commander"
                  className="btn w-100 fw-bold mb-3 text-decoration-none text-center d-block"
                  style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50, padding: '14px' }}
                >
                  Commander →
                </Link>

                <button
                  onClick={() => router.push('/produits')}
                  className="btn w-100 fw-bold border-0"
                  style={{ backgroundColor: '#EEE6D8', color: '#3E3125', borderRadius: 50, padding: '12px' }}
                >
                  Continuer les achats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}