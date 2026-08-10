import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth"
import Link from "next/link"

export default async function AdminReturnButton() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "ADMIN") {
    return null
  }

  return (
    <Link
      href="/admin"
      className="text-decoration-none fw-bold d-inline-flex align-items-center gap-2"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: '#3E3125',
        color: '#F8F5EF',
        padding: '12px 20px',
        borderRadius: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        fontSize: 14,
      }}
    >
      ← Retour à l'admin
    </Link>
  )
}