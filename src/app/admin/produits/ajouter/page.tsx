'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
}

export default function AjouterProduitPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    sku: '',
    categoryId: '',
    imageUrl: '',
  })

  const [variants, setVariants] = useState({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  })

  const [files, setFiles] = useState<FileList | null>(null)

  // Charger les catégories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => setCategories(data))
      .catch(console.error)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleVariantChange = (size: string, value: string) => {
    setVariants(prev => ({ ...prev, [size]: parseInt(value) || 0 }))
  }

  const uploadImages = async (): Promise<string[]> => {
    if (!files || files.length === 0) return []
    setUploading(true)
    
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData()
      fd.append('file', files[i])
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) urls.push(data.url)
    }
    setUploading(false)
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrl = form.imageUrl
    const uploaded = await uploadImages()
    if (uploaded.length > 0) imageUrl = uploaded[0]

    const totalStock = Object.values(variants).reduce((a, b) => a + b, 0)

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        stock: totalStock,
        sku: form.sku,
        categoryId: form.categoryId,
        imageUrl: imageUrl || '/assets/img/placeholder.jpg',
        variants: Object.entries(variants)
          .filter(([_, stock]) => stock > 0)
          .map(([size, stock]) => ({ size, stock })),
      })
    })

    if (res.ok) {
      router.push('/admin/produits')
    } else {
      const err = await res.json()
      alert('Erreur : ' + (err.error || 'Inconnue'))
    }
    setLoading(false)
  }

  // Groupes de catégories
  const vetements = ['Pull', 'Top', 'Pantalon', 'T-shirt', 'Veste']
  const accessoires = ['Sacs']

  const vetementCats = categories.filter(c => vetements.includes(c.name))
  const accessoireCats = categories.filter(c => accessoires.includes(c.name))

 const isSaleInvalid = Boolean(form.salePrice) && parseFloat(form.salePrice) >= parseFloat(form.price || '0')

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#F8F5EF', minHeight: '100vh' }}>
      <div className="container">
        <h2 className="fw-bold mb-4" style={{ color: '#3E3125' }}>➕ Ajouter un nouveau produit</h2>
        
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#D8CBB8', borderRadius: 12 }}>
          <div className="row g-3">
            
            {/* Ligne 1 : Nom + Slug */}
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Nom du produit *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Slug (URL) *</label>
              <input 
                name="slug" 
                value={form.slug} 
                onChange={handleChange} 
                required 
                placeholder="ex: t-shirt-blanc" 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
            </div>

            {/* Ligne 2 : Prix + Prix soldé + SKU */}
            <div className="col-md-4">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Prix (DT) *</label>
              <input 
                name="price" 
                type="number" 
                step="0.001" 
                value={form.price} 
                onChange={handleChange} 
                required 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>
                Prix soldé (DT) <span className="fw-normal text-muted" style={{ fontSize: 12 }}>- promo</span>
              </label>
              <input 
                name="salePrice" 
                type="number" 
                step="0.001" 
                value={form.salePrice} 
                onChange={handleChange} 
                placeholder="Laissez vide si pas de solde"
                className="form-control" 
                style={{ 
                  backgroundColor: '#F8F5EF', 
                  borderColor: isSaleInvalid ? '#dc2626' : form.salePrice ? '#16a34a' : '#D8CBB8',
                  borderWidth: isSaleInvalid || form.salePrice ? 2 : 1
                }}
              />
              {isSaleInvalid && (
                <div className="small fw-bold mt-1" style={{ color: '#dc2626' }}>
                  Le prix soldé doit être inférieur au prix normal
                </div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>SKU (référence) *</label>
              <input 
                name="sku" 
                value={form.sku} 
                onChange={handleChange} 
                required 
                placeholder="ex: TS-001" 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
            </div>

            {/* Ligne 3 : Catégorie + Images */}
            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Catégorie *</label>
              <select 
                name="categoryId" 
                value={form.categoryId} 
                onChange={handleChange} 
                required 
                className="form-select" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}
              >
                <option value="">Choisir...</option>
                
                <optgroup label="Vêtements">
                  {vetementCats.length > 0 ? (
                    vetementCats.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  ) : (
                    vetements.map((name, i) => (
                      <option key={i} value="" disabled>{name} (créer d'abord)</option>
                    ))
                  )}
                </optgroup>
                
                <optgroup label="Accessoires">
                  {accessoireCats.length > 0 ? (
                    accessoireCats.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  ) : (
                    accessoires.map((name, i) => (
                      <option key={i} value="" disabled>{name} (créer d'abord)</option>
                    ))
                  )}
                </optgroup>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Images du produit *</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => setFiles(e.target.files)} 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
              <div className="form-text" style={{ color: '#6F4E37', fontSize: 12 }}>
                Sélectionnez plusieurs images depuis votre PC
              </div>
            </div>

            {/* Ligne 4 : Quantité par taille */}
            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Quantité par taille</label>
              <div className="row g-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <div className="col" key={size}>
                    <label className="form-label text-center w-100 fw-bold" style={{ color: '#6F4E37', fontSize: 13 }}>
                      Taille {size}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variants[size as keyof typeof variants]}
                      onChange={(e) => handleVariantChange(size, e.target.value)}
                      className="form-control text-center"
                      style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}
                    />
                  </div>
                ))}
              </div>
              <div className="form-text" style={{ color: '#6F4E37', fontSize: 12 }}>
                Mettez 0 si la taille n'est pas disponible
              </div>
            </div>

            {/* Ligne 5 : Description */}
            <div className="col-12">
              <label className="form-label fw-bold" style={{ color: '#3E3125' }}>Description</label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows={4} 
                className="form-control" 
                style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }} 
              />
            </div>

            {/* Boutons */}
            <div className="col-12 d-flex gap-2 mt-3">
              <button 
                type="submit" 
                disabled={loading || uploading || isSaleInvalid}
                className="btn fw-bold border-0"
                style={{ 
                  backgroundColor: '#6F4E37', 
                  color: '#F8F5EF', 
                  borderRadius: 8, 
                  padding: '10px 24px' 
                }}
              >
                {uploading ? 'Upload...' : loading ? 'Enregistrement...' : '💾 Enregistrer le produit'}
              </button>
              
              <button 
                type="button"
                onClick={() => router.push('/admin/produits')}
                className="btn fw-bold"
                style={{ 
                  backgroundColor: '#D8CBB8', 
                  color: '#3E3125', 
                  borderRadius: 8, 
                  padding: '10px 24px' 
                }}
              >
                Annuler
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}