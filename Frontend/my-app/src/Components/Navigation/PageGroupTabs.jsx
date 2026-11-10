import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

const groups = {
  'Know Us Better': ['Company Profile', 'Management Team', 'CSR', 'Global Presence'],
  Enlightenment: ['Textile', 'Education', 'Natural Energy', 'Brands'],
  Framework: ['Spinning', 'Knitting', 'Weaving', 'Garmenting', 'Home Textiles'],
  Goods: ['Cotton Yarn', 'Knitted Fabrics', 'Woven Fabrics', 'Garments'],
  Credentials: ['Certifications', 'Rewards'],
}
const slug = value => value.toLowerCase().replaceAll(' ', '-')
export default function PageGroupTabs({ group }) {
  const rail = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const active = rail.current?.querySelector('[aria-current="page"]')
    if (active && rail.current.scrollWidth > rail.current.clientWidth) rail.current.scrollTo({ left:active.offsetLeft - rail.current.offsetLeft, behavior:'instant' })
  }, [pathname])
  return <div className="container"><nav ref={rail} className={styles.tabs} aria-label={`${group} pages`}>{groups[group].map(title => <NavLink key={title} to={`/${slug(group)}/${slug(title)}`}>{title}</NavLink>)}</nav></div>
}
