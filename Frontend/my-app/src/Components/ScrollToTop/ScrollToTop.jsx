import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previous }
  }, [])
  useLayoutEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); return }
    let id
    try { id = decodeURIComponent(hash.slice(1)) } catch { return }
    const reveal = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ behavior: 'instant', block: 'start' })
      return true
    }
    if (reveal()) return
    // Database sections may arrive after the navigation effect.
    const observer = new MutationObserver(() => { if (reveal()) observer.disconnect() })
    observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true })
    const timeout = setTimeout(() => observer.disconnect(), 5000)
    return () => { clearTimeout(timeout); observer.disconnect() }
  }, [pathname, hash])
  return null
}
