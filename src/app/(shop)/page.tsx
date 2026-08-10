import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HomePage() {
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
                    <p>Découvrez notre sélection de vêtements tendance. Qualité premium, prix accessible, livraison rapide partout dans le monde.</p>
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
                    <p>Des tenues adaptées à votre quotidien, du bureau aux soirées entre amis.</p>
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
                    <p>Profitez de la livraison offerte sur toute la France métropolitaine. Retours gratuits sous 30 jours.</p>
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
            <p>Explorez nos catégories les plus populaires cette saison.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-4 p-5 mt-3">
            <Link href="/produits?category=montres"><img src="/assets/img/category_img_01.jpg" className="rounded-circle img-fluid border" alt="Montres" /></Link>
            <h5 className="text-center mt-3 mb-3">Montres</h5>
            <p className="text-center"><Link className="btn btn-success" href="/produits?category=montres">Voir</Link></p>
          </div>
          <div className="col-12 col-md-4 p-5 mt-3">
            <Link href="/produits?category=chaussures"><img src="/assets/img/category_img_02.jpg" className="rounded-circle img-fluid border" alt="Chaussures" /></Link>
            <h5 className="text-center mt-3 mb-3">Chaussures</h5>
            <p className="text-center"><Link className="btn btn-success" href="/produits?category=chaussures">Voir</Link></p>
          </div>
          <div className="col-12 col-md-4 p-5 mt-3">
            <Link href="/produits?category=accessoires"><img src="/assets/img/category_img_03.jpg" className="rounded-circle img-fluid border" alt="Accessoires" /></Link>
            <h5 className="text-center mt-3 mb-3">Accessoires</h5>
            <p className="text-center"><Link className="btn btn-success" href="/produits?category=accessoires">Voir</Link></p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-light">
        <div className="container py-5">
          <div className="row text-center py-3">
            <div className="col-lg-6 m-auto">
              <h1 className="h1">Produits en Vedette</h1>
              <p>Nos meilleures ventes sélectionnées pour vous.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                <Link href="/produits/gym-weight">
                  <img src="/assets/img/feature_prod_01.jpg" className="card-img-top" alt="Gym Weight" />
                </Link>
                <div className="card-body">
                  <ul className="list-unstyled d-flex justify-content-between">
                    <li>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-muted fa fa-star"></i>
                      <i className="text-muted fa fa-star"></i>
                    </li>
                    <li className="text-muted text-right">240.00 DT</li>
                  </ul>
                  <Link href="/produits/gym-weight" className="h2 text-decoration-none text-dark">Gym Weight</Link>
                  <p className="card-text">Équipement de sport professionnel pour votre entraînement quotidien.</p>
                  <p className="text-muted">Avis (24)</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                <Link href="/produits/cloud-nike">
                  <img src="/assets/img/feature_prod_02.jpg" className="card-img-top" alt="Nike Shoes" />
                </Link>
                <div className="card-body">
                  <ul className="list-unstyled d-flex justify-content-between">
                    <li>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-muted fa fa-star"></i>
                    </li>
                    <li className="text-muted text-right">480.00 DT</li>
                  </ul>
                  <Link href="/produits/cloud-nike" className="h2 text-decoration-none text-dark">Cloud Nike Shoes</Link>
                  <p className="card-text">Confort ultime pour vos séances de running et votre quotidien.</p>
                  <p className="text-muted">Avis (48)</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                <Link href="/produits/summer-addides">
                  <img src="/assets/img/feature_prod_03.jpg" className="card-img-top" alt="Summer Shoes" />
                </Link>
                <div className="card-body">
                  <ul className="list-unstyled d-flex justify-content-between">
                    <li>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                      <i className="text-warning fa fa-star"></i>
                    </li>
                    <li className="text-muted text-right">360.00 DT</li>
                  </ul>
                  <Link href="/produits/summer-addides" className="h2 text-decoration-none text-dark">Summer Shoes</Link>
                  <p className="card-text">La chaussure parfaite pour l'été. Légère et respirante.</p>
                  <p className="text-muted">Avis (74)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}