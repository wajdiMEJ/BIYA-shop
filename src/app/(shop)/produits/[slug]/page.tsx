import { prisma } from '@/lib/db/prisma'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { images: true, category: true, variants: true, reviews: true },
  })

  if (!product) {
    return (
      <>
        <TopNav />
        <Header />
        <div className="container py-5 text-center">
          <h2 style={{ color: '#3E3125' }}>Produit non trouvé</h2>
        </div>
        <Footer />
      </>
    )
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,   // ← CORRIGÉ
    saleStartDate: product.saleStartDate ? product.saleStartDate.toISOString() : null,
    saleEndDate: product.saleEndDate ? product.saleEndDate.toISOString() : null,
    weight: product.weight ? Number(product.weight) : null,
  }

  return (
    <>
      <TopNav />
      <Header />
      <div className="container py-5">
        <ProductDetailClient product={serializedProduct} />
      </div>
      <Footer />
    </>
  )
}