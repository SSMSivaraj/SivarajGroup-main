import { navigationGroup } from '../../config/navigation.js'
import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

export default function PageGroupTabs({ group }) {
  const config = navigationGroup(group)
  const rail = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const active = rail.current?.querySelector('[aria-current="page"]')
    if (active && rail.current.scrollWidth > rail.current.clientWidth) rail.current.scrollTo({ left:active.offsetLeft - rail.current.offsetLeft, behavior:'instant' })
  }, [pathname])
  return <div className="container"><nav ref={rail} className={styles.tabs} aria-label={`${config.label} pages`}>{config.children.map(({ label, path }) => <NavLink key={path} to={path}>{label}</NavLink>)}</nav></div>
}
