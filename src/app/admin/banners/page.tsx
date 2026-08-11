import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import DeleteBannerButton from "./DeleteBannerButton"

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: '#3E3125' }}>🖼️ Bannières du carousel</h3>
        <Link href="/admin/banners/nouveau" className="btn" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
          ➕ Nouvelle bannière
        </Link>
      </div>

      {banners.length === 0 ? (
        <p style={{ color: '#6F4E37' }}>Aucune bannière pour le moment.</p>
      ) : (
        <div className="table-responsive">
          <table className="table" style={{ backgroundColor: '#F8F5EF' }}>
            <thead style={{ backgroundColor: '#3E3125', color: '#F8F5EF' }}>
              <tr>
                <th>Ordre</th>
                <th>Image</th>
                <th>Titre</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td style={{ color: '#3E3125', fontWeight: 'bold' }}>{banner.sortOrder}</td>
                  <td>
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ color: '#3E3125', fontWeight: 500 }}>
                    {banner.title}
                    <br />
                    <small style={{ color: '#6F4E37' }}>{banner.subtitle}</small>
                  </td>
                  <td>
                    {banner.isActive ? (
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        🟢 Actif
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                        🔴 Inactif
                      </span>
                    )}
                  </td>
                  <td>
                    <Link
                      href={`/admin/banners/modifier/${banner.id}`}
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: '#B8895A', color: '#F8F5EF' }}
                    >
                      ✏️ Modifier
                    </Link>
                    <DeleteBannerButton bannerId={banner.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}