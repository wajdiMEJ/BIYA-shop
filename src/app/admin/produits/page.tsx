import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import DeleteProductButton from "./DeleteProductButton"
export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ color: '#3E3125' }}>Tous les produits</h3>
        <Link href="/admin/produits/nouveau" className="btn" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
          ➕ Nouveau produit
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table" style={{ backgroundColor: '#F8F5EF' }}>
          <thead style={{ backgroundColor: '#3E3125', color: '#F8F5EF' }}>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isOutOfStock = product.stock === 0
              const isLowStock = product.stock > 0 && product.stock <= 5

              return (
                <tr key={product.id} style={{ borderColor: '#D8CBB8' }}>
                  <td>
                    <img 
                      src={product.images[0]?.url || '/assets/img/placeholder.jpg'} 
                      alt={product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </td>
                  <td style={{ color: '#3E3125', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ color: '#6F4E37' }}>{product.category.name}</td>
                  <td style={{ color: '#3E3125', fontWeight: 'bold' }}>{product.price.toString()} DT</td>
                  
                  {/* Colonne Stock avec couleur */}
                  <td>
                    {isOutOfStock ? (
                      <span className="badge" style={{ backgroundColor: '#dc2626', color: 'white' }}>
                        0
                      </span>
                    ) : isLowStock ? (
                      <span className="badge" style={{ backgroundColor: '#ea580c', color: 'white' }}>
                        {product.stock}
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#16a34a', color: 'white' }}>
                        {product.stock}
                      </span>
                    )}
                  </td>

                  {/* Colonne Statut */}
                  <td>
                    {isOutOfStock ? (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '12px' }}>
                        🔴 Rupture
                      </span>
                    ) : isLowStock ? (
                      <span className="badge" style={{ backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '12px' }}>
                        🟠 Faible
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '12px' }}>
                        🟢 Disponible
                      </span>
                    )}
                  </td>

                  <td>
                    <Link 
                      href={`/admin/produits/modifier/${product.id}`}
                      className="btn btn-sm me-2"
                      style={{ backgroundColor: '#B8895A', color: '#F8F5EF' }}
                    >
                      ✏️ Modifier
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}