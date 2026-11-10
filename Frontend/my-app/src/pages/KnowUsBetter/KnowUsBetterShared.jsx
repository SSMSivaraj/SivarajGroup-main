import EnquiryBanner from '../../Components/EnquiryBanner/EnquiryBanner.jsx'
import PageGroupTabs from '../../Components/Navigation/PageGroupTabs.jsx'
import PageHero from '../../Components/PageHero/PageHero.jsx'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './KnowUsBetter.module.css'
import { imageUrl, safeUrl } from './useWebsitePage.js'
import { imageSlot } from '../../config/imageSlots.js'

export function Photo({ data, code, alt, hero = false, portrait = false, wide = false, fallbackCode }) {
  const sourceCode = data.images[code] ? code : fallbackCode || code
  const metadata = data.images[sourceCode]
  if (!imageSlot(data.page, code)) return null
  if (data.loading) return <div className={styles.fallback} role="status">Loading photograph…</div>
  return <PhotoView key={`${data.page}/${code}/${metadata?.updated_at || metadata?.created_at || ''}`} page={data.page} code={code} sourceCode={sourceCode} metadata={metadata} alt={alt} hero={hero} portrait={portrait} wide={wide} />
}
function PhotoView({ page, code, sourceCode, metadata, alt, hero, portrait, wide }) {
  const [failed, setFailed] = useState(false)
  const missing = failed || !metadata
  if (missing) return hero ? null : <div className={styles.fallback}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="m3 17 5-5 4 4 4-6 5 7" /></svg><span>Photograph coming soon</span></div>
  return <img data-image-page={page} data-image-position={code} src={imageUrl(page, sourceCode, metadata)} alt={metadata?.alt_text || alt} className={hero ? styles.heroImage : `${styles.photo} ${portrait ? styles.portrait : ''} ${wide ? styles.wide : ''}`} loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'} onError={() => setFailed(true)} />
}
export function Copy({ text }) {
  return text ? <div className={styles.copy}>{text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div> : null
}
export function Action({ url, children }) {
  if (!safeUrl(url)) return null
  return url.startsWith('/') ? <Link className={styles.action} to={url}>{children}</Link> : <a className={styles.action} href={url}>{children}</a>
}
export function Content({ item, source, level: Heading = 'h2' }) {
  if (!item && !source) return null
  const value = item || source
  const normalise = text => (text || '').replace(/\s+/g, ' ').trim().toLowerCase()
  const showSource = source && item && ((!normalise(item.body_content).includes(normalise(source.body_content))) || normalise(item.heading) !== normalise(source.heading) || normalise(item.subheading) !== normalise(source.subheading))
  return <>{value.subheading && <p className={styles.label}>{value.subheading}</p>}<Heading className="mb-4">{value.heading || source?.heading}</Heading><Copy text={value.body_content} />{value.button_text && <Action url={value.button_url}>{value.button_text}</Action>}{showSource && <div className={styles.archive}><p className={styles.sourceNote}>From the published company profile{source.heading ? `: ${source.heading}` : ''}{source.subheading ? ` / ${source.subheading}` : ''}</p><Copy text={source.body_content} /></div>}</>
}
export function Hero({ data, title, intro, imageFallback, imageAlt, className, eyebrow = 'Know Us Better' }) {
  const metadata = data.images.PAGE_HERO
  const hero = data.lookup.PAGE_HERO
  return <><PageHero pageCode={data.page} className={className} src={metadata ? imageUrl(data.page, 'PAGE_HERO', metadata) : imageFallback} fallbackSrc={imageFallback} alt={metadata?.alt_text || imageAlt || title}>
    <Container><div className={styles.heroCopy}><Breadcrumb title={title} /><p className={styles.label}>{eyebrow}</p><h1 className="mb-4">{title}</h1>{hero?.heading && hero.heading !== title && <p className="fs-4">{hero.heading}</p>}<p>{hero?.body_content || intro}</p>{hero?.subheading && <p>{hero.subheading}</p>}{hero?.button_text && <Action url={hero.button_url}>{hero.button_text}</Action>}</div></Container>
  </PageHero><PageGroupTabs group="Know Us Better" /></>
}
export function Breadcrumb({ title }) {
  return <nav aria-label="Breadcrumb"><Link to="/know-us-better">Know Us Better</Link><span> / </span><span aria-current="page">{title}</span></nav>
}
export function Section({ data, code, source, aliases = [], alt, reverse = false, white = false, children }) {
  const item = data.get(code, source, aliases)
  if (!item && !children) return null
  return <section id={code} className={`${styles.section} ${white ? styles.paper : ''}`}><Container><Row className="g-5 align-items-center"><Col lg={6} className={reverse ? 'order-lg-2' : ''}><Photo data={data} code={code} alt={alt || item?.heading} /></Col><Col lg={6}><Content item={item} source={source} />{children}</Col></Row></Container></section>
}
export function AdditionalContent({ data, handled }) {
  // Render every other active database row visibly, including legacy aliases and member rows.
  return data.rows.filter(row => !handled.includes(row.section_code)).map(row => <section key={row.content_id || row.section_code} className={`${styles.section} border-top`}><Container><Content item={row} /></Container></section>)
}
export function PageEnd({ data, title }) {
  const enquiry = data.lookup.ENQUIRY_BANNER
  const pages = [['Company Profile', 'company-profile'], ['Management Team', 'management-team'], ['CSR', 'csr'], ['Global Presence', 'global-presence']]
  return <><section className={styles.section}><Container><p className={styles.label}>Continue exploring</p><h2 className="mb-4">Know Us Better</h2><nav aria-label="Related Know Us Better pages" className={styles.related}>{pages.filter(([name]) => name !== title).map(([name, slug]) => <Action key={slug} url={`/know-us-better/${slug}`}>{name}<span aria-hidden="true">→</span></Action>)}</nav></Container></section>
    <EnquiryBanner><Container><Row className="g-4 align-items-center"><Col lg={9}><p className={styles.label}>Start a conversation</p><h2 className="mb-3">{enquiry?.heading || 'Let’s Build Something Together'}</h2>{enquiry?.subheading && <p>{enquiry.subheading}</p>}<Copy text={enquiry?.body_content || 'Speak with our team about your requirements and explore the next step.'} /></Col><Col lg={3}><Action url={safeUrl(enquiry?.button_url) ? enquiry.button_url : '/lets-talk'}>{enquiry?.button_text || 'Let’s Talk'}<span aria-hidden="true">→</span></Action></Col></Row></Container></EnquiryBanner></>
}
export function PublishedNote() {
  return <p className={styles.sourceNote}>Company information is retained from the published Sivaraj website. Figures, experience and forward-looking statements refer to that published profile.</p>
}
