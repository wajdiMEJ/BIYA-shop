'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

export default function PanierPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('biya-cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  function updateQuantity(index: number, newQty: number) {
    if (newQty < 1) return
    const updated = [...cart]
    updated[index].quantity = newQty
    setCart(updated)
    localStorage.setItem('biya-cart', JSON.stringify(updated))
  }

  function removeItem(index: number) {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem('biya-cart', JSON.stringify(updated))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = total > 50 ? 0 : 7
  const finalTotal = total + shipping

  if (!mounted) {
    return (
      <>
        <TopNav />
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border" style={{ color: '#6F4E37' }} />
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
        <h2 className="fw-bold mb-4" style={{ color: '#3E3125' }}>🛒 Mon Panier</h2>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h4 style={{ color: '#6F4E37' }}>Votre panier est vide</h4>
            <Link href="/produits" className="btn mt-3 fw-bold" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <div className="row">
            {/* Liste des articles */}
            <div className="col-lg-8">
              {cart.map((item, index) => (
                <div key={`${item.productId}-${item.size}`} className="card mb-3 p-3" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
                  <div className="row align-items-center">
                    <div className="col-3">
                      <img 
                        src={item.image || '/assets/img/placeholder.jpg'} 
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ height: 80, objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg' }}
                      />
                    </div>
                    <div className="col-4">
                      <h6 className="fw-bold mb-1" style={{ color: '#3E3125' }}>{item.name}</h6>
                      <small style={{ color: '#6F4E37' }}>Taille: {item.size}</small>
                    </div>
                    <div className="col-3">
                      <div className="d-flex align-items-center gap-2">
                        <button 
                          className="btn btn-sm rounded-circle"
                          style={{ backgroundColor: '#EEE6D8', width: 30, height: 30 }}
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                        >-</button>
                        <span className="fw-bold">{item.quantity}</span>
                        <button 
                          className="btn btn-sm rounded-circle"
                          style={{ backgroundColor: '#EEE6D8', width: 30, height: 30 }}
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                    <div className="col-2 text-end">
                      <h6 className="fw-bold" style={{ color: '#3E3125' }}>{(item.price * item.quantity).toFixed(3)} DT</h6>
                      <button 
                        className="btn btn-sm text-danger"
                        onClick={() => removeItem(index)}
                      >🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="col-lg-4">
              <div className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
                <h5 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Récapitulatif</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#6F4E37' }}>Sous-total</span>
                  <span className="fw-bold">{total.toFixed(3)} DT</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#6F4E37' }}>Livraison</span>
                  <span className="fw-bold">{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(3)} DT`}</span>
                </div>
                <hr style={{ borderColor: '#D8CBB8' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold" style={{ color: '#3E3125' }}>Total</span>
                  <span className="fw-bold fs-5" style={{ color: '#3E3125' }}>{finalTotal.toFixed(3)} DT</span>
                </div>

                <button 
                  onClick={() => router.push('/commander')}
                  className="btn btn-lg fw-bold w-100"
                  style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50 }}
                >
                  Passer la commande →
                </button>
                <Link href="/produits" className="btn btn-outline w-100 mt-2 fw-bold" style={{ borderColor: '#D8CBB8', color: '#3E3125' }}>
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}