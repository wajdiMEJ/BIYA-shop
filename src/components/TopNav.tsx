export default function TopNav() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-light d-none d-lg-block" id="templatemo_nav_top">
      <div className="container text-light">
        <div className="w-100 d-flex justify-content-between">
          <div>
            <i className="fa fa-envelope mx-2"></i>
            <a className="navbar-sm-brand text-light text-decoration-none" href="mailto:info@BIYA.com">BiYaShop4you.com</a>
            <i className="fa fa-phone mx-2"></i>
            <a className="navbar-sm-brand text-light text-decoration-none" href="tel:27055521">27055521</a>
          </div>
          <div>
            <a className="text-light" href="#"><i className="fab fa-facebook-f fa-sm fa-fw me-2"></i></a>
            <a className="text-light" href="#"><i className="fab fa-instagram fa-sm fa-fw me-2"></i></a>
            
          </div>
        </div>
      </div>
    </nav>
  )
}