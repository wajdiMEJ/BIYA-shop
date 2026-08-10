import { prisma } from "@/lib/db/prisma"
import Link from "next/link"

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-4 text-center" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
            <h3 style={{ color: '#6F4E37' }}>{totalProducts}</h3>
            <p style={{ color: '#3E3125' }}>Produits</p>
            <Link href="/admin/produits" style={{ color: '#B8895A' }}>Gérer →</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 text-center" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
            <h3 style={{ color: '#6F4E37' }}>{totalOrders}</h3>
            <p style={{ color: '#3E3125' }}>Commandes</p>
            <Link href="/admin/commandes" style={{ color: '#B8895A' }}>Voir →</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 text-center" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
            <h3 style={{ color: '#6F4E37' }}>{totalUsers}</h3>
            <p style={{ color: '#3E3125' }}>Clients</p>
          </div>
        </div>
      </div>

      <div className="card p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
        <h4 style={{ color: '#3E3125' }}>Actions rapides</h4>
        <div className="mt-3">
          <Link href="/admin/produits/nouveau" className="btn me-2" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
            ➕ Ajouter un produit
          </Link>
          <Link href="/admin/produits" className="btn" style={{ backgroundColor: '#B8895A', color: '#F8F5EF' }}>
            📋 Liste des produits
          </Link>
        </div>
      </div>
    </div>
  )
}