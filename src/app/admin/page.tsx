import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/db/prisma'
import ProductGridModern from '@/components/product/ProductGridModern'
import HeroCarousel from '@/components/HeroCarousel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 10,
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  })

  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <>
      <TopNav />
      <Header />
      <HeroCarousel banners={banners} />
      <section style={{ backgroundColor: '#EEE6D8' }}>
        <div className="container py-5">
          <ProductGridModern 
            products={featuredProducts.map(p => ({ 
              ...p, 
              price: Number(p.price),
              salePrice: p.salePrice ? Number(p.salePrice) : null,
              saleStartDate: p.saleStartDate ? p.saleStartDate.toISOString() : null,
              saleEndDate: p.saleEndDate ? p.saleEndDate.toISOString() : null,
            }))} 
            title="Nouveautés" 
          />        
          <div className="text-center mt-4">
            <a 
              href="/produits" 
              className="btn btn-lg px-5 fw-bold text-decoration-none"
              style={{ 
                backgroundColor: '#6F4E37', 
                color: '#F8F5EF', 
                borderRadius: 50,
                display: 'inline-block'
              }}
            >
              Voir tous les produits →
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}