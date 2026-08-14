'use client'

import Link from 'next/link'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonText: string | null
  buttonLink: string | null
}

export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-5" style={{ backgroundColor: '#F8F5EF' }}>
        <p style={{ color: '#6F4E37' }}>Aucune bannière active</p>
      </div>
    )
  }

  return (
    <div id="template-mo-zay-hero-carousel" className="carousel slide" data-bs-ride="carousel">
      {banners.length > 1 && (
        <ol className="carousel-indicators">
          {banners.map((_, index) => (
            <li 
              key={index}
              data-bs-target="#template-mo-zay-hero-carousel" 
              data-bs-slide-to={index} 
              className={index === 0 ? 'active' : ''}
            ></li>
          ))}
        </ol>
      )}
      
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="container">
              <div className="row p-5">
                <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                  <img 
                    className="img-fluid rounded" 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    style={{ maxHeight: 450, objectFit: 'cover', width: '100%' }}
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = '/assets/img/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="col-lg-6 mb-0 d-flex align-items-center">
                  <div className="text-align-left align-self-center">
                    <h1 className="h1" style={{ color: '#3E3125' }}>
                      <b style={{ color: '#6F4E37' }}>{banner.title}</b>
                    </h1>
                    {banner.subtitle && (
                      <h3 className="h2" style={{ color: '#6F4E37' }}>{banner.subtitle}</h3>
                    )}
                    {banner.description && (
                      <p style={{ color: '#6F4E37' }}>{banner.description}</p>
                    )}
                    {banner.buttonText && banner.buttonLink && (
                      <Link 
                        href={banner.buttonLink} 
                        className="btn fw-bold text-decoration-none mt-2"
                        style={{ 
                          backgroundColor: '#6F4E37', 
                          color: '#F8F5EF', 
                          borderRadius: 50, 
                          padding: '10px 30px' 
                        }}
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
      
      {banners.length > 1 && (
        <>
          <a className="carousel-control-prev text-decoration-none w-auto ps-3" 
             href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="prev">
            <i className="fas fa-chevron-left" style={{ color: '#3E3125', fontSize: 24 }}></i>
          </a>
          <a className="carousel-control-next text-decoration-none w-auto pe-3" 
             href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="next">
            <i className="fas fa-chevron-right" style={{ color: '#3E3125', fontSize: 24 }}></i>
          </a>
        </>
      )}
    </div>
  )
}