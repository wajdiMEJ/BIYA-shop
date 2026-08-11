'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteBannerButton({ bannerId }: { bannerId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer cette bannière ?')) return

    setLoading(true)
    const res = await fetch(`/api/banners/${bannerId}`, { method: 'DELETE' })

    if (res.ok) {
      router.refresh()
    } else {
      alert('Erreur lors de la suppression')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn btn-sm"
      style={{ backgroundColor: '#dc2626', color: '#fff' }}
    >
      {loading ? '...' : '🗑️ Supprimer'}
    </button>
  )
}
