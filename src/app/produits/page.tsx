import { prisma } from '@/lib/db/prisma'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductListClient from '@/components/product/ProductListClient'
import CategoriesSidebar from '@/components/product/CategoriesSidebar'

export default async function ProduitsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true, category: true },
    orderBy: { createdAt: 'desc' },
  })

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
  })

  return (
    <>
      <TopNav />
      <Header />
      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <CategoriesSidebar categories={categories} />
          </div>

          {/* Grille produits */}
          <div className="col-lg-9">
            <ProductListClient 
              products={products.map(p => {
                const product = p as any  // ← CAST ICI
                return {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: Number(product.price),
                  salePrice: product.salePrice ? Number(product.salePrice) : null,
                  images: product.images,
                  categoryName: product.category?.name || ''
                }
              })} 
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}