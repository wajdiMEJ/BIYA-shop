import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export default async function NewBannerPage() {
  async function createBanner(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const buttonText = formData.get('buttonText') as string
    const buttonLink = formData.get('buttonLink') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
    const isActive = formData.get('isActive') === 'on'

    const file = formData.get('image') as File
    let imageUrl = '/assets/img/placeholder.jpg'

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const dataUri = `data:${file.type || 'image/jpeg'};base64,${base64}`

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'biya-shop/banners',
        public_id: `${Date.now()}-${file.name.replace(/\s/g, '-').replace(/\.[^/.]+$/, '')}`,
      })

      imageUrl = result.secure_url
    }

    await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || null,
        description: description || null,
        buttonText: buttonText || null,
        buttonLink: buttonLink || null,
        imageUrl,
        sortOrder,
        isActive,
      }
    })

    // ✅ REVALIDER la page d'accueil ET l'admin
    revalidatePath('/', 'layout')
revalidatePath('/admin/banners')
redirect('/admin/banners')
  }

  return (
    <div>
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>➕ Nouvelle bannière</h3>

      <form action={createBanner} className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Titre *</label>
            <input name="title" type="text" className="form-control" required
              placeholder="ex: BIYA Boutique"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Sous-titre</label>
            <input name="subtitle" type="text" className="form-control"
              placeholder="ex: Nouvelle Collection Ete"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea name="description" className="form-control" rows={3}
              placeholder="ex: Decouvrez notre selection..."
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}></textarea>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Texte du bouton (optionnel)</label>
            <input name="buttonText" type="text" className="form-control"
              placeholder="ex: Voir la collection"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Lien du bouton (optionnel)</label>
            <input name="buttonLink" type="text" className="form-control"
              placeholder="ex: /produits"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Image de la bannière *</label>
            <input name="image" type="file" accept="image/*" className="form-control" required
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-bold">Ordre d'affichage</label>
            <input name="sortOrder" type="number" min="0" defaultValue="0" className="form-control"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
            <small style={{ color: '#6F4E37' }}>0 = premiere position</small>
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-end">
            <div className="form-check">
              <input name="isActive" type="checkbox" className="form-check-input" id="isActive" defaultChecked />
              <label className="form-check-label fw-bold" htmlFor="isActive" style={{ color: '#3E3125' }}>
                Bannière active
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            💾 Enregistrer la bannière
          </button>
          <Link href="/admin/banners" className="btn fw-bold" style={{ backgroundColor: '#D8CBB8', color: '#3E3125' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}