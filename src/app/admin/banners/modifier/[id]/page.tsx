import { prisma } from "@/lib/db/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import cloudinary from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const banner = await prisma.banner.findUnique({ where: { id } })

  if (!banner) {
    notFound()
  }

  async function updateBanner(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const buttonText = formData.get('buttonText') as string
    const buttonLink = formData.get('buttonLink') as string
    const sortOrder = parseInt(formData.get('sortOrder') as string) || 0
    const isActive = formData.get('isActive') === 'on'

    const file = formData.get('image') as File
    let imageUrl = banner!.imageUrl

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

    await prisma.banner.update({
      where: { id },
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
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>✏️ Modifier la bannière</h3>

      <form action={updateBanner} className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Titre *</label>
            <input name="title" type="text" className="form-control" required defaultValue={banner.title}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Sous-titre</label>
            <input name="subtitle" type="text" className="form-control" defaultValue={banner.subtitle || ''}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea name="description" className="form-control" rows={3} defaultValue={banner.description || ''}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }}></textarea>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Texte du bouton (optionnel)</label>
            <input name="buttonText" type="text" className="form-control" defaultValue={banner.buttonText || ''}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Lien du bouton (optionnel)</label>
            <input name="buttonLink" type="text" className="form-control" defaultValue={banner.buttonLink || ''}
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nouvelle image (optionnel)</label>
            <input name="image" type="file" accept="image/*" className="form-control"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
            <small style={{ color: '#6F4E37' }}>Laissez vide pour garder l'image actuelle</small>
            <div className="mt-2">
              <img src={banner.imageUrl} alt={banner.title}
                style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #D8CBB8' }} />
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label fw-bold">Ordre d'affichage</label>
            <input name="sortOrder" type="number" min="0" defaultValue={banner.sortOrder} className="form-control"
              style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8', color: '#3E3125' }} />
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-end">
            <div className="form-check">
              <input name="isActive" type="checkbox" className="form-check-input" id="isActive" defaultChecked={banner.isActive} />
              <label className="form-check-label fw-bold" htmlFor="isActive" style={{ color: '#3E3125' }}>
                Bannière active
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn fw-bold" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            💾 Enregistrer les modifications
          </button>
          <Link href="/admin/banners" className="btn fw-bold" style={{ backgroundColor: '#D8CBB8', color: '#3E3125' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}