import { prisma } from "@/lib/db/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, variants: true, category: true }
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany()

  const now = new Date()
  const nowLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  async function updateProduct(formData: FormData) {
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
    for (const size of sizes) {
      const stockValue = formData.get(`stock_${size}`)
      if (stockValue === null) continue
      const stock = parseInt(stockValue as string) || 0

      const existingVariant = await prisma.productVariant.findFirst({
        where: { productId: id, size }
      })

      if (existingVariant) {
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: { stock }
        })
      } else if (stock > 0) {
        await prisma.productVariant.create({
          data: {
            productId: id,
            size,
            stock,
            sku: `${sku}-${size}`,
            color: 'Standard',
            isActive: true
          }
        })
      }
    }

    const files = formData.getAll('images') as File[]
    const hasNewImages = files.some(f => f.size > 0)

    if (hasNewImages) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products')
      await mkdir(uploadDir, { recursive: true })

      await prisma.productImage.deleteMany({ where: { productId: id } })

      const imageUrls: { url: string; isPrimary: boolean; alt: string; sortOrder: number }[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size === 0) continue

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        imageUrls.push({
          url: `/uploads/products/${filename}`,
          isPrimary: i === 0,
          alt: name,
          sortOrder: i
        })
      }

      await prisma.productImage.createMany({
        data: imageUrls.map(img => ({ ...img, productId: id }))
      })
    }

    const variants = await prisma.productVariant.findMany({ where: { productId: id } })
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)

    await prisma.product.update({
      where: { id },
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
      }
    })

    revalidatePath('/admin/produits')
    redirect('/admin/produits')
  }

  const getStockForSize = (size: string) => {
    const variant = product.variants.find(v => v.size === size)
    return variant?.stock ?? 0
  }

  // Formatte une date pour l'input datetime-local (format YYYY-MM-DDTHH:mm)
  const formatDateTimeForInput = (date: Date | null) => {
    if (!date) return ''
    const d = new Date(date)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }

  return (
    <div>
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>✏️ Modifier le produit</h3>

      <form action={updateProduct} className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nom du produit *</label>
            <input name="name" type="text" className="form-control" required defaultValue={product.name}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Slug (URL) *</label>
            <input name="slug" type="text" className="form-control" required defaultValue={product.slug}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">Prix (DT) *</label>
            <input name="price" type="number" step="0.01" min="0" className="form-control" required
              defaultValue={product.price.toString()}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">
              Réduction (%) <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- promo</span>
            </label>
            <input name="discountPercent" type="number" step="1" min="0" max="99" className="form-control"
              defaultValue={
                product.salePrice && product.price
                  ? Math.round((1 - Number(product.salePrice) / Number(product.price)) * 100).toString()
                  : ''
              }
              placeholder="Ex: 15 pour -15%"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-bold">SKU (référence) *</label>
            <input name="sku" type="text" className="form-control" required defaultValue={product.sku}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Début de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span>
            </label>
            <input name="saleStartDate" type="datetime-local" min={nowLocal} className="form-control"
              defaultValue={formatDateTimeForInput(product.saleStartDate)}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">
              Fin de la promo <span className="fw-normal" style={{ fontSize: 12, color: '#6F4E37' }}>- optionnel</span>
            </label>
            <input name="saleEndDate" type="datetime-local" min={nowLocal} className="form-control"
              defaultValue={formatDateTimeForInput(product.saleEndDate)}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Catégorie *</label>
            <select name="categoryId" className="form-control" required defaultValue={product.categoryId}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}>
              <option value="">Choisir...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nouvelles images (optionnel)</label>
            <input name="images" type="file" multiple accept="image/*" className="form-control"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
            <small style={{ color: '#6F4E37' }}>Laissez vide pour garder les images actuelles</small>
            {product.images.length > 0 && (
              <div className="d-flex gap-2 mt-2">
                {product.images.map(img => (
                  <img key={img.id} src={img.url} alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6, border: '1px solid #D8CBB8' }} />
                ))}
              </div>
            )}
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
                    defaultValue={getStockForSize(size)}
                    className="form-control text-center fw-bold"
                    style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 mb-4">
            <label className="form-label fw-bold">Description</label>
            <textarea name="description" className="form-control" rows={4} defaultValue={product.description || ''}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}></textarea>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            💾 Enregistrer les modifications
          </button>
          <Link href="/admin/produits" className="btn fw-bold" style={{ backgroundColor: '#D8CBB8', color: '#3E3125' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}