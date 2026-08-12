import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import cloudinary from "@/lib/cloudinary"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()

  const now = new Date()
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  async function createProduct(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const discountPercentRaw = formData.get('discountPercent') as string
    const discountPercent = discountPercentRaw && discountPercentRaw.trim() !== '' ? parseFloat(discountPercentRaw) : 0
    const salePrice = discountPercent > 0 ? price * (1 - discountPercent / 100) : null

    const saleStartRaw = formData.get('saleStartDate') as string
    const saleEndRaw = formData.get('saleEndDate') as string

    let saleStartDate: Date | null = null
    let saleEndDate: Date | null = null

    if (discountPercent > 0) {
      const nowCheck = new Date()

      if (saleStartRaw) {
        const start = new Date(saleStartRaw)
        if (start < nowCheck) {
          throw new Error("La date de début de la promo ne peut pas être dans le passé")
        }
        saleStartDate = start
      }

      if (saleEndRaw) {
        const end = new Date(saleEndRaw)
        if (end < nowCheck) {
          throw new Error("La date de fin de la promo ne peut pas être dans le passé")
        }
        if (saleStartDate && end <= saleStartDate) {
          throw new Error("La date de fin doit être après la date de début")
        }
        saleEndDate = end
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

    // ✅ UPLOAD CLOUDINARY (utilise ton export existant)
    const files = formData.getAll('images') as File[]
    const imageUrls: { url: string; isPrimary: boolean; alt: string; sortOrder: number }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.size === 0) continue

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const dataUri = `data:${file.type || 'image/jpeg'};base64,${base64}`

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'biya-shop/products',
        public_id: `${Date.now()}-${file.name.replace(/\s/g, '-').replace(/\.[^/.]+$/, '')}`,
      })

      imageUrls.push({
        url: result.secure_url,
        isPrimary: i === 0,
        alt: name,
        sortOrder: i
      })
    }

    if (imageUrls.length === 0) {
      imageUrls.push({
        url: '/assets/img/placeholder.jpg',
        isPrimary: true,
        alt: name,
        sortOrder: 0
      })
    }

    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice,
        saleStartDate,
        saleEndDate,
        stock: totalStock,
        sku,
        categoryId,
        isActive: true,
        images: { create: imageUrls },
        variants: {
          create: variants.filter(v => v.stock >= 0).map(v => ({
            size: v.size,
            color: v.color,
            stock: v.stock,
            sku: v.sku,
            isActive: true
          }))
        }
      }
    })

    redirect('/admin/produits')
  }

  return (
    <div>
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>➕ Ajouter un nouveau produit</h3>

      <form action={createProduct} className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
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
            <label className="form-label fw-bold">
              Réduction (%) <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- promo</span>
            </label>
            <input name="discountPercent" type="number" step="1" min="0" max="99" className="form-control" 
              placeholder="Ex: 15 pour -15%"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">SKU (référence) *</label>
            <input name="sku" type="text" className="form-control" required placeholder="ex: TS-001" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Début de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span>
            </label>
            <input name="saleStartDate" type="datetime-local" min={nowLocal} className="form-control" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Fin de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span>
            </label>
            <input name="saleEndDate" type="datetime-local" min={nowLocal} className="form-control" 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Catégorie *</label>
            <select name="categoryId" className="form-control" required 
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}>
              <option value="">Choisir...</option>
              {categories.map((cat) => (
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
                  <input 
                    name={`stock_${size}`} 
                    type="number" 
                    min="0" 
                    defaultValue="0"
                    className="form-control text-center fw-bold" 
                    style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} 
                  />
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
          <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            💾 Enregistrer le produit
          </button>
          <Link href="/admin/produits" className="btn fw-bold" style={{ backgroundColor: '#D8CBB8', color: '#3E3125' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}