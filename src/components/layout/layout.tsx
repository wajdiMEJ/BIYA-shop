'use client'

import { useEffect } from 'react'
import AdminReturnButton from "@/components/AdminReturnButton"
import "bootstrap/dist/css/bootstrap.min.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return (
    <html lang="fr">
      <body>
        {children}
        <AdminReturnButton />
      </body>
    </html>
  )
}