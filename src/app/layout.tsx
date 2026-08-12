
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/hooks/useCart'
import Providers from '@/components/Providers'
import BootstrapClient from '@/components/BootstrapClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BIYA - Boutique de Mode',
  description: 'Decouvrez notre collection de vetements tendance',
  verification: {
    google: '2MMqJrnIw3rBz3C1lWqR76x6tKMcSY5U6kMAdZ3pUoM',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/templatemo.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap" />
        <link rel="stylesheet" href="/assets/css/fontawesome.min.css" />
        <link rel="stylesheet" href="/assets/css/biya-theme.css" />
      </head>
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            {children}
          </CartProvider>
        </Providers>
        <BootstrapClient />
      </body>
    </html>
  )
}
