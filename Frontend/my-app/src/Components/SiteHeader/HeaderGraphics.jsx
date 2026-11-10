import { useEffect, useState } from 'react'
import styles from './HeaderGraphics.module.css'

const base = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const endpoint = `${base}/api/website/page-images/WELCOME_WAY`

// One database graphic belongs to the header, independently of the active slide.
export default function HeaderGraphics() {
  const [graphic, setGraphic] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    let sequence = 0
    async function refresh() {
      if (document.visibilityState === 'hidden') return
      const current = ++sequence
      try {
        const response = await fetch(endpoint, { cache: 'no-store', signal: controller.signal })
        if (!response.ok) return
        const result = await response.json()
        if (controller.signal.aborted || current !== sequence || !Array.isArray(result.data)) return
        setGraphic(result.data.find(row => row.section_code === 'HEADER_GRAPHICS' && row.is_active !== false && row.is_active !== 0) || null)
      } catch { /* Keep the navigation usable when the image service is unavailable. */ }
    }
    const onStorage = event => { if (event.key === 'website-image-revision') refresh() }
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('storage', onStorage)
    window.addEventListener('website-images-changed', refresh)
    document.addEventListener('visibilitychange', refresh)
    const interval = window.setInterval(refresh, 30000)
    return () => {
      controller.abort(); window.clearInterval(interval)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('website-images-changed', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  if (!graphic) return null
  const revision = graphic.updated_at || graphic.created_at || ''
  const src = `${endpoint}/HEADER_GRAPHICS?v=${encodeURIComponent(revision)}`
  return <GraphicImage key={src} src={src} alt={graphic.alt_text || 'Sivaraj Group textile journey'} />
}
function GraphicImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return <div className={styles.graphic}><img className={styles.image} src={src} alt={alt} onError={() => setFailed(true)} /></div>
}
