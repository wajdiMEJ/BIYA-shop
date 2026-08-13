'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProductPage({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const now = new Date()
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const name = formData.get('name') as string
      const slug = formData.get('slug') as string
      const description = formData.get('description') as string
      const price = parseFloat(formData.get('price') as string)
      const discountPercentRaw = formData.get('discountPercent') as string
      const discountPercent = discountPercentRaw && discountPercentRaw.trim() !== '' ? parseFloat(discountPercentRaw) : 0
      const salePrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : null

      const saleStartRaw = formData.get('saleStartDate') as string
      const saleEndRaw = formData.get('saleEndDate') as string

      let saleStartDate = null
      let saleEndDate = null

      if (discountPercent > 0) {
        const nowCheck = new Date()
        if (saleStartRaw) {
          const start = new Date(saleStartRaw)
          if (start < nowCheck) throw new Error("La date de début ne peut pas être dans le passé")
          saleStartDate = start.toISOString()
        }
        if (saleEndRaw) {
          const end = new Date(saleEndRaw)
          if (end < nowCheck) throw new Error("La date de fin ne peut pas être dans le passé")
          if (saleStartDate && end <= new Date(saleStartDate)) throw new Error("La date de fin doit être après la date de début")
          saleEndDate = end.toISOString()
        }
      }

      const categoryId = formData.get('categoryId') as string
      const sku = formData.get('sku') as string

      const sizes = ['XS', 'S', 'M', 'L', 'XL']
      const variants = sizes.map(size => ({
        size,
        stock: parseInt(formData.get(`stock_${size}`) as string) || 0,
        sku: `${sku}-${size}`,
        color: 'Standard'
      }))

      // 1. Upload images via ton API /api/upload
      const files = formData.getAll('images') as File[]
      const imageUrls: string[] = []

      for (const file of files) {
        if (file.size === 0) continue
        const uploadData = new FormData()
        uploadData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(`Erreur upload image: ${err.error || 'Inconnue'}`)
        }

        const data = await res.json()
        imageUrls.push(data.url)
      }

      if (imageUrls.length === 0) {
        imageUrls.push('/assets/img/placeholder.jpg')
      }

      // 2. Créer le produit
      const productData = {
        name,
        slug,
        description,
        price,
        salePrice,
        saleStartDate,
        saleEndDate,
        stock: variants.reduce((sum, v) => sum + v.stock, 0),
        sku,
        categoryId,
        imageUrls,
        variants: variants.filter(v => v.stock >= 0),
      }

      const res = await fetch('/api/produits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erreur création produit')
      }

      router.push('/admin/produits')
      router.refresh()

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>➕ Ajouter un nouveau produit</h3>

      {error && (
        <div className="alert alert-danger mb-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nom du produit *</label>
            <input name="name" type="text" className="form-control" required 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Slug (URL) *</label>
            <input name="slug" type="text" className="form-control" required placeholder="ex: t-shirt-blanc" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Prix (DT) *</label>
            <input name="price" type="number" step="0.01" min="0" className="form-control" required 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Réduction (%) <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- promo</span></label>
            <input name="discountPercent" type="number" step="1" min="0" max="99" className="form-control" 
              placeholder="Ex: 15"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">SKU (référence) *</label>
            <input name="sku" type="text" className="form-control" required placeholder="ex: TS-001" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Début de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span></label>
            <input name="saleStartDate" type="datetime-local" min={nowLocal} className="form-control" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Fin de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span></label>
            <input name="saleEndDate" type="datetime-local" min={nowLocal} className="form-control" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Catégorie *</label>
            <select name="categoryId" className="form-control" required 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}>
              <option value="">Choisir...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Images du produit *</label>
            <input name="images" type="file" multiple accept="image/*" className="form-control" required
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
            <small style={{ color: '#6F4E37' }}>Sélectionnez plusieurs images depuis votre PC</small>
          </div>

          <div className="col-12 mb-4">
            <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Quantité par taille</label>
            <div className="row g-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <div className="col" key={size}>
                  <label className="form-label text-center w-100 fw-bold" style={{ color: '#6F4E37' }}>Taille {size}</label>
                  <input name={`stock_${size}`} type="number" min="0" defaultValue="0"
                    className="form-control text-center fw-bold" 
                    style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
                </div>
              ))}
            </div>
            <small style={{ color: '#6F4E37' }}>Mettez 0 si la taille n'est pas disponible</small>
          </div>

          <div className="col-12 mb-4">
            <label className="form-label fw-bold">Description</label>
            <textarea name="description" className="form-control" rows={4} 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}></textarea>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" disabled={loading} className="btn fw-bold" 
            style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            {loading ? '⏳ Enregistrement...' : '💾 Enregistrer le produit'}
          </button>
          <Link href="/admin/produits" className="btn fw-bold" style={{ backgroundColor: '#D8CBB8', color: '#3E3125' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}