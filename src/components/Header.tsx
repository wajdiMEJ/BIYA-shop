'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { useSession } from 'next-auth/react'

export default function Header() {
  const { totalItems } = useCart()
  const { data: session } = useSession()

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow" style={{ backgroundColor: '#F8F5EF' }}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link 
          className="navbar-brand text-success logo h1 align-self-center" 
          href="/" 
          style={{ color: '#59ab6e' }}
        >
          <span style={{ color: '#6F4E37' }}>BI</span>
          <span style={{ color: '#B8895A' }} suppressHydrationWarning>YA </span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {session?.user?.name && (
            <span style={{ color: '#3E3125', fontSize: 14 }}>
              👋 Bonjour, {session.user.name.split(' ')[0]}
            </span>
          )}

          <Link href="/panier" className="position-relative text-decoration-none">
            <span style={{ fontSize: 24 }}>🛒</span>
            {totalItems > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', fontSize: 10 }}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}