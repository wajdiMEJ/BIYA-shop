'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteBannerButton({ bannerId }: { bannerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Supprimer cette bannière ?')) return
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Erreur suppression')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setLoading(false)
    }
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