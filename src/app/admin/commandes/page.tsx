import { prisma } from "@/lib/db/prisma"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING: { label: '⏳ En attente', color: '#ea580c' },
    CONFIRMED: { label: '✅ Confirmée', color: '#16a34a' },
    SHIPPED: { label: '🚚 Expédiée', color: '#2563eb' },
    DELIVERED: { label: '📦 Livrée', color: '#16a34a' },
    CANCELLED: { label: '❌ Annulée', color: '#dc2626' },
  }

  return (
    <div>
      <h3 className="mb-4 fw-bold" style={{ color: '#3E3125' }}>📦 Commandes</h3>

      {orders.length === 0 ? (
        <p style={{ color: '#6F4E37' }}>Aucune commande pour le moment.</p>
      ) : (
        <div className="table-responsive">
          <table className="table" style={{ backgroundColor: '#F8F5EF' }}>
            <thead style={{ backgroundColor: '#3E3125', color: '#F8F5EF' }}>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = statusLabels[order.status] || statusLabels.PENDING
                const customerName = order.user 
                  ? `${order.user.firstName} ${order.user.lastName}`
                  : order.email || 'Client invité'

                return (
                  <tr key={order.id}>
                    <td style={{ color: '#3E3125', fontWeight: 500 }}>{order.orderNumber}</td>
                    <td style={{ color: '#6F4E37' }}>
                      {customerName}
                      <br />
                      <small>{order.user?.email || order.email}</small>
                    </td>
                    <td style={{ color: '#6F4E37' }}>{order.items.length} article(s)</td>
                    <td style={{ color: '#3E3125', fontWeight: 'bold' }}>
                      {Number(order.total).toFixed(2)} DT
                    </td>
                    <td>
                      <span 
                        className="badge" 
                        style={{ backgroundColor: status.color, color: 'white', fontSize: 12 }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td style={{ color: '#6F4E37', fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}