import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import ProductGridModern from '@/components/product/ProductGridModern'

export default async function HomePage() {
  // ✅ Les 10 derniers produits ajoutés par l'admin (les plus récents en premier)
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 10,
    include: { images: true },
    orderBy: { createdAt: 'desc' }, // ← DU PLUS RÉCENT AU PLUS ANCIEN
  })

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: 3,
  })

  return (
    <>
      <TopNav />
      <Header />

      {/* Carousel Hero */}
      <div id="template-mo-zay-hero-carousel" className="carousel slide" data-bs-ride="carousel">
        <ol className="carousel-indicators">
          <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="0" className="active"></li>
          <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="1"></li>
          <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img className="img-fluid" src="/assets/img/banner_img_01.jpg" alt="Banner 1" />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left align-self-center">
                    <h1 className="h1 text-success"><b>BIYA</b> Boutique</h1>
                    <h3 className="h2">Nouvelle Collection 2026</h3>
                    <p>Découvrez notre sélection de vêtements tendance. Qualité premium, prix accessible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img className="img-fluid" src="/assets/img/banner_img_02.jpg" alt="Banner 2" />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    <h1 className="h1">Style & Élégance</h1>
                    <h3 className="h2">Pour toutes les occasions</h3>
                    <p>Des tenues adaptées à votre quotidien, du bureau aux soirées.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img className="img-fluid" src="/assets/img/banner_img_03.jpg" alt="Banner 3" />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left">
                    <h1 className="h1">Livraison Gratuite</h1>
                    <h3 className="h2">Dès 50 DT d'achat</h3>
                    <p>Profitez de la livraison offerte sur toute la Tunisie. Retours gratuits sous 30 jours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="carousel-control-prev text-decoration-none w-auto ps-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="prev">
          <i className="fas fa-chevron-left"></i>
        </a>
        <a className="carousel-control-next text-decoration-none w-auto pe-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="next">
          <i className="fas fa-chevron-right"></i>
        </a>
      </div>

      {/* Categories */}
      <section className="container py-5">
        <div className="row text-center pt-3">
          <div className="col-lg-6 m-auto">
            <h1 className="h1">Catégories du Mois</h1>
            <p>Explorez nos catégories les plus populaires.</p>
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

      {/* Featured Products - Nouveautés : les derniers ajoutés automatiquement */}
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