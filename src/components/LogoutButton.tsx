'use client'

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-decoration-none btn btn-link p-0 text-start"
      style={{ color: '#EEE6D8' }}
    >
      🚪 Se déconnecter
    </button>
  )
}