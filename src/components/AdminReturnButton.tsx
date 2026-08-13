'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function AdminReturnButton() {
  const { data: session } = useSession()

  if (session?.user?.role !== 'ADMIN') return null

  return (
    <Link href="/admin" className="btn btn-sm mb-3" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
      ← Retour à l'admin
    </Link>
  )
}