import Link from 'next/link'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth"
import LogoutButton from "@/components/LogoutButton"

export default async function Footer() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <footer className="bg-dark" id="tempaltemo_footer" style={{ backgroundColor: '#3E3125' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 pt-5">
            <h2 className="h2 border-bottom pb-3 border-light logo" style={{ color: '#B8895A' }}>BIYA</h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li><i className="fas fa-map-marker-alt fa-fw"></i> Grombalia,Nabeul</li>
              <li><i className="fa fa-phone fa-fw"></i> <a className="text-decoration-none" href="tel:27055521" style={{ color: '#EEE6D8' }}>27055521</a></li>
              <li><i className="fa fa-envelope fa-fw"></i> <a className="text-decoration-none" href="mailto:info@biya.com" style={{ color: '#EEE6D8' }}>BiYaShop4you@gmail.com</a></li>
            </ul>
          </div>
          <div className="col-md-4 pt-5">
            <h2 className="h2 text-light border-bottom pb-3 border-light">Produits</h2>
            <ul className="list-unstyled text-light footer-link-list">
              <li><Link className="text-decoration-none" href="/produits" style={{ color: '#EEE6D8' }}>T-shirt</Link></li>
              <li><Link className="text-decoration-none" href="/produits" style={{ color: '#EEE6D8' }}>Robe</Link></li>
              <li><Link className="text-decoration-none" href="/produits" style={{ color: '#EEE6D8' }}>Top</Link></li>
              <li><Link className="text-decoration-none" href="/produits" style={{ color: '#EEE6D8' }}>Pantalon</Link></li>
            </ul>
          </div>
          <div className="col-md-4 pt-5">
            <h2 className="h2 text-light border-bottom pb-3 border-light">Mon Compte</h2>
            <ul className="list-unstyled text-light footer-link-list">
              {isAdmin && (
                <li><Link className="text-decoration-none" href="/admin" style={{ color: '#EEE6D8' }}>🛠️ Retour à l'admin</Link></li>
              )}
              {session ? (
                <li><LogoutButton /></li>
              ) : (
                <li><Link className="text-decoration-none" href="/login" style={{ color: '#EEE6D8' }}>🔑 Se connecter</Link></li>
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

      <div className="w-100 py-3" style={{ backgroundColor: '#2a2018' }}>
        <div className="container">
          <div className="row pt-2">
            <div className="col-12">
              <p className="text-left text-light">
                Copyright &copy; 2026 BIYA | Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}