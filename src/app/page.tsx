import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import ProductGridModern from '@/components/product/ProductGridModern'

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

      {banners.length > 0 && (
        <div id="template-mo-zay-hero-carousel" className="carousel slide" data-bs-ride="carousel">
          <ol className="carousel-indicators">
            {banners.map((banner, index) => (
              <li
                key={banner.id}
                data-bs-target="#template-mo-zay-hero-carousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
              ></li>
            ))}
          </ol>
          <div className="carousel-inner">
            {banners.map((banner, index) => (
              <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="container">
                  <div className="row p-5">
                    <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                      <img
                        className="img-fluid"
                        src={banner.imageUrl}
                        alt={banner.title}
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </div>
                    <div className="col-lg-6 mb-0 d-flex align-items-center">
                      <div className="text-align-left align-self-center">
                        <h1 className="h1">{banner.title}</h1>
                        {banner.subtitle && <h3 className="h2">{banner.subtitle}</h3>}
                        {banner.description && <p>{banner.description}</p>}
                        {banner.buttonText && banner.buttonLink && (
                          <Link
                            href={banner.buttonLink}
                            className="btn fw-bold mt-2"
                            style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50, padding: '10px 28px' }}
                          >
                            {banner.buttonText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <a className="carousel-control-prev text-decoration-none w-auto ps-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="prev">
            <i className="fas fa-chevron-left"></i>
          </a>
          <a className="carousel-control-next text-decoration-none w-auto pe-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="next">
            <i className="fas fa-chevron-right"></i>
          </a>
        </div>
      )}

      <section style={{ backgroundColor: '#EEE6D8' }}>
        <div className="container py-5">
          <ProductGridModern 
            products={featuredProducts.map(p => ({ 
              ...p, 
              price: Number(p.price),
              comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
              saleStartDate: p.saleStartDate ? p.saleStartDate.toISOString() : null,
              saleEndDate: p.saleEndDate ? p.saleEndDate.toISOString() : null,
            }))} 
            title="Nouveautes" 
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