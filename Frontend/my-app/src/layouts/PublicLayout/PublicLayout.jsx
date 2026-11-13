import { navigationGroups } from '../../config/navigation.js'
import { Outlet } from 'react-router-dom'
import SiteHeader from '../../Components/SiteHeader/SiteHeader.jsx'
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop.jsx'
import { NavLink } from 'react-router-dom'
export default function PublicLayout() {
  return <><ScrollToTop /><SiteHeader /><Outlet /><footer className="py-5 text-white" style={{ background: '#082F28' }}>
    <div className="container"><div className="row g-4"><div className="col-lg-6"><p className="h4 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Sivaraj Group</p><p className="small mb-0">Textile expertise. Connected possibilities.</p></div>
      <nav aria-label="Footer navigation" className="col-lg-6 d-flex flex-wrap align-items-start gap-4">
        {navigationGroups.map(({ label, path, children }) => <NavLink key={path} className="text-white" to={children[0]?.path || path}>{label}</NavLink>)}<NavLink className="text-white" to="/lets-talk">Let’s Talk</NavLink>
      </nav><section className="col-12" aria-label="Follow Us"><h2 className="h6">Follow Us</h2><div className="d-flex flex-wrap gap-3 gap-md-4"><a className="text-white text-break" href="https://www.facebook.com/sivarajspinningmills" target="_blank" rel="noopener noreferrer" aria-label="Visit Sivaraj Spinning Mills on Facebook">Facebook · @sivarajspinningmills</a><a className="text-white text-break" href="https://www.instagram.com/chennis_mensclothing" target="_blank" rel="noopener noreferrer" aria-label="Visit Chennis Mens Clothing on Instagram">Instagram · @chennis_mensclothing</a></div></section></div></div>
  </footer></>
}
