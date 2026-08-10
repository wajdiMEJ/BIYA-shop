'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
      <div className="mb-4" style={{ fontSize: 80 }}>🎉</div>
      <h2 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Commande confirmée !</h2>
      <p className="mb-2" style={{ color: '#6F4E37' }}>
        Merci pour votre achat. Votre commande a été reçue.
      </p>
      <p className="mb-4" style={{ color: '#6F4E37' }}>
        Vous paierez <span className="fw-bold">8.000 DT</span> de livraison + le montant de votre commande à la livraison.
      </p>
      <Link 
        href="/" 
        className="btn btn-lg fw-bold px-5"
        style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50 }}
      >
        Continuer les achats
      </Link>
    </div>
  )
}