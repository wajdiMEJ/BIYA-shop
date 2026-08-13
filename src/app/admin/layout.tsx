import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

// ✅ Force le rendu dynamique pour éviter "headers outside request scope"
export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#EEE6D8' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#3E3125', color: '#F8F5EF', flexShrink: 0 }}>
        <div className="p-4">
          <h4 className="mb-4">🛠️ Admin BIYA</h4>
          <nav>
            <ul className="list-unstyled">
              <li className="mb-3">
                <Link href="/admin" style={{ color: '#EEE6D8', textDecoration: 'none' }}>
                  📊 Dashboard
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/admin/produits" style={{ color: '#EEE6D8', textDecoration: 'none' }}>
                  👕 Produits
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/admin/produits/nouveau" style={{ color: '#EEE6D8', textDecoration: 'none' }}>
                  ➕ Ajouter Produit
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/admin/commandes" style={{ color: '#EEE6D8', textDecoration: 'none' }}>
                  📦 Commandes
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/admin/banners" style={{ color: '#EEE6D8', textDecoration: 'none' }}>
                  🖼️ Bannières
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/" style={{ color: '#B8895A', textDecoration: 'none' }}>
                  🏠 Voir le site
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '30px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: '#3E3125' }}>Tableau de bord</h2>
          <div>
            <span style={{ color: '#6F4E37' }}>👤 {session.user?.name || 'Admin'}</span>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}