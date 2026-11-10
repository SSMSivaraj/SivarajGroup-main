import { useEffect, useRef, useState } from 'react'
import styles from './Navigation.module.css'

export default function SectionNavigator({ items, label }) {
  const [active, setActive] = useState('')
  const rail = useRef(null)
  const codes = [...new Set(items.map(item => item.code))].join(',')
  useEffect(() => {
    const targets = codes.split(',').map(code => document.getElementById(code)).filter(Boolean)
    const header = document.querySelector('.navbar.sticky-top')
    const offset = Math.ceil(header?.getBoundingClientRect().height || 100) + 16
    targets.forEach(target => { target.style.scrollMarginTop = `${offset}px` })
    const visibleTargets = new Map()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleTargets.set(entry.target.id, entry)
        else visibleTargets.delete(entry.target.id)
      })
      const visible = [...visibleTargets.values()].sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: `-${offset}px 0px -45% 0px`, threshold: 0 })
    targets.forEach(target => observer.observe(target))
    const restore = () => {
      const target = targets.find(target => `#${target.id}` === window.location.hash)
      if (target) { setActive(target.id); target.scrollIntoView({ behavior:'instant' }) }
    }
    restore()
    window.addEventListener('popstate', restore)
    window.addEventListener('hashchange', restore)
    return () => { observer.disconnect(); window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore) }
  }, [codes])
  useEffect(() => {
    const link = rail.current?.querySelector('[aria-current]')
    if (link && rail.current.scrollWidth > rail.current.clientWidth) rail.current.scrollTo({ left:link.parentElement.offsetLeft - rail.current.offsetLeft, behavior:'instant' })
  }, [active])
  return <nav aria-label={label}><ol ref={rail} className={styles.rail}>{items.map(({code,title},index) => <li key={`${code}-${index}`}><a href={`#${code}`} aria-current={active === code ? 'location' : undefined} onClick={event => {
    event.preventDefault()
    const target = document.getElementById(code)
    if (!target) return
    if (window.location.hash !== `#${code}`) window.history.pushState(window.history.state, '', `#${code}`)
    target.setAttribute('tabindex','-1')
    target.focus({ preventScroll:true })
    target.scrollIntoView({ behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start' })
    setActive(code)
  }}><span>{String(index + 1).padStart(2,'0')}</span>{title}</a></li>)}</ol></nav>
}
