import { imageUrl } from '../../pages/KnowUsBetter/useWebsitePage.js'
import { useState } from 'react'
import styles from './FrameworkSplitHero.module.css'

function PanelImage({ src, fallback, alt }) {
  const [legacy, setLegacy] = useState(false)
  const [failed, setFailed] = useState(false)
  if (failed || (!src && !fallback)) return <div className={styles.placeholder} role="img" aria-label={`${alt} — photograph coming soon`} />
  return <img src={legacy ? fallback : src || fallback} alt={alt} loading="eager" onError={() => { if (!legacy && src && fallback) setLegacy(true); else setFailed(true) }} />
}
export default function FrameworkSplitHero({ pageCode, alt, children, data }) {
  const primary = data.images.PAGE_HERO_1
  const legacy = data.images.PAGE_HERO
  const secondary = data.images.PAGE_HERO_2
  const source = code => imageUrl(pageCode, code, data.images[code])
  return <section className={styles.hero} aria-label={`${alt} hero`}>
    <div className={styles.primary} data-image-page={pageCode} data-image-position="PAGE_HERO_1">
      <PanelImage key={`${primary?.updated_at}-${legacy?.updated_at}-${!!primary}-${!!legacy}`} src={primary ? source('PAGE_HERO_1') : undefined} fallback={legacy ? source('PAGE_HERO') : undefined} alt={primary?.alt_text || legacy?.alt_text || alt} />
      <div className={styles.content}>{children}</div>
    </div>
    <div className={styles.secondary} data-image-page={pageCode} data-image-position="PAGE_HERO_2"><PanelImage key={`${secondary?.updated_at}-${!!secondary}`} src={secondary ? source('PAGE_HERO_2') : undefined} alt={secondary?.alt_text || `${alt} detail`} /></div>
  </section>
}
