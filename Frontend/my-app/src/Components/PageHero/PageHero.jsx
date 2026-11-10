import { useState } from 'react'
import styles from './PageHero.module.css'

export default function PageHero(props) {
  return <HeroImage key={props.src || props.pageCode} {...props} />
}
function HeroImage({ src, fallbackSrc, alt, pageCode, children, className = '' }) {
  const [status, setStatus] = useState(src ? 'loading' : 'missing')
  const usingFallback = status.endsWith('-fallback')
  const imageSrc = usingFallback ? fallbackSrc : src
  const available = status === 'loaded' || status === 'loaded-fallback'
  const loading = status.startsWith('loading')
  return <section data-image-page={pageCode} data-image-position="PAGE_HERO" className={`${styles.hero} ${available ? styles.loaded : ''} ${loading ? styles.loading : ''} ${className}`} aria-busy={loading}>
    {imageSrc && status !== 'failed' && <img className={styles.image} src={imageSrc} alt={alt} loading="eager" fetchPriority="high" onLoad={() => setStatus(usingFallback ? 'loaded-fallback' : 'loaded')} onError={() => {
      if (fallbackSrc && !usingFallback && imageSrc !== fallbackSrc) { setStatus('loading-fallback'); return }
      setStatus('failed')
      if (import.meta.env.DEV) console.warn(`[Website image] ${pageCode}/PAGE_HERO`)
    }} />}
    <div className={styles.content}>{children}</div>
  </section>
}
