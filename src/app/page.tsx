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

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: 3,
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

      <section className="container py-5">
        <div className="row text-center pt-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Categories du Mois</h1>
            <p>Explorez nos categories les plus populaires.</p>
          </div>
        </div>
        <div className="row">
          {categories.map((cat) => (
            <div className="col-12 col-md-4 p-5 mt-3" key={cat.id}>
              <Link href={`/produits?category=${cat.slug}`}>
                <img src={cat.image || '/assets/img/category_img_01.jpg'} className="rounded-circle img-fluid border" alt={cat.name} />
              </Link>
              <h5 className="text-center mt-3 mb-3">{cat.name}</h5>
              <p className="text-center"><Link className="btn btn-success" href={`/produits?category=${cat.slug}`}>Voir</Link></p>
            </div>
          ))}
        </div>
      </section>

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