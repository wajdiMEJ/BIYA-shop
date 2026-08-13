'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Footer() {
  const { data: session } = useSession()

  return (
    <footer className="bg-dark" id="tempaltemo_footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 pt-5">
            <h2 className="h2 text-success border-bottom pb-3 border-light logo">BIYA Shop</h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li><i className="fas fa-map-marker-alt fa-fw"></i> Tunis, Tunisie</li>
              <li><i className="fa fa-phone fa-fw"></i> <a className="text-decoration-none" href="tel:27055521">27 055 521</a></li>
              <li><i className="fa fa-envelope fa-fw"></i> <a className="text-decoration-none" href="mailto:BiYaShop4you@gmail.com">BiYaShop4you@gmail.com</a></li>
            </ul>
          </div>

          <div className="col-md-4 pt-5">
            <h2 className="h2 text-light border-bottom pb-3 border-light">Produits</h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li><Link className="text-decoration-none" href="/produits?category=pull">Pull</Link></li>
              <li><Link className="text-decoration-none" href="/produits?category=top">Top</Link></li>
              <li><Link className="text-decoration-none" href="/produits?category=pantalon">Pantalon</Link></li>
              <li><Link className="text-decoration-none" href="/produits?category=t-shirt">T-shirt</Link></li>
              <li><Link className="text-decoration-none" href="/produits?category=veste">Veste</Link></li>
              <li><Link className="text-decoration-none" href="/produits?category=sacs">Sacs</Link></li>
            </ul>
          </div>

          <div className="col-md-4 pt-5">
            <h2 className="h2 text-light border-bottom pb-3 border-light">Info</h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li><Link className="text-decoration-none" href="/">Accueil</Link></li>
              <li><Link className="text-decoration-none" href="/produits">Tous les produits</Link></li>
              {session?.user?.role === 'ADMIN' && (
                <li><Link className="text-decoration-none" href="/admin">Admin</Link></li>
              )}
            </ul>
          </div>
        </div>

        <div className="row text-light mb-4">
          <div className="col-12 mb-3">
            <div className="w-100 my-3 border-top border-light"></div>
          </div>
          <div className="col-auto me-auto">
            <ul className="list-inline text-left footer-icons">
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a className="text-light text-decoration-none" href="#"><i className="fab fa-facebook-f fa-lg fa-fw"></i></a>
              </li>
              <li className="list-inline-item border border-light rounded-circle text-center">
                <a className="text-light text-decoration-none" href="#"><i className="fab fa-instagram fa-lg fa-fw"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-100 bg-black py-3">
        <div className="container">
          <div className="row pt-2">
            <div className="col-12">
              <p className="text-left text-light">Copyright &copy; 2026 BIYA Shop</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}