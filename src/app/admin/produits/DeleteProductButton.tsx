'use client'

import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    const res = await fetch(`/api/produits/${productId}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.refresh()
    } else {
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <button 
      onClick={handleDelete}
      className="btn btn-sm"
      style={{ backgroundColor: '#dc3545', color: 'white' }}
    >
      🗑️ Supprimer
    </button>
  )
}