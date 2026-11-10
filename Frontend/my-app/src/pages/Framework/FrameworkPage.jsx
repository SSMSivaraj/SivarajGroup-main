import EnquiryBanner from '../../Components/EnquiryBanner/EnquiryBanner.jsx'
import FrameworkSplitHero from '../../Components/PageHero/FrameworkSplitHero.jsx'
import PageGroupTabs from '../../Components/Navigation/PageGroupTabs.jsx'
import SectionNavigator from '../../Components/Navigation/SectionNavigator.jsx'
import { useWebsitePage } from '../KnowUsBetter/useWebsitePage.js'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './FrameworkPage.module.css'
import { frameworkImageSections } from './frameworkImages.js'

const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const api = path => `${API_URL}/api/website/${path}`
const related = ['Spinning', 'Knitting', 'Weaving', 'Garmenting', 'Home Textiles']

function getWebsiteImageUrl(page, section, version) {
  return `${api(`page-images/${encodeURIComponent(page)}/${encodeURIComponent(section)}`)}${version ? `?v=${encodeURIComponent(version)}` : ''}`
}
function Photo({ page, code, metadata, hero = false, onFailure, fit }) {
  const [failed, setFailed] = useState(false)
  if (!metadata || failed) return null
  return <img data-image-page={page} data-image-position={code} className={hero ? styles.heroImage : fit === 'contain' ? styles.productPhoto : styles.photo}
    src={getWebsiteImageUrl(page, code, metadata.updated_at || metadata.created_at)}
    alt={metadata.alt_text || `${page.charAt(0)}${page.slice(1).toLowerCase()} facility`}
    loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'}
    onError={() => {
      setFailed(true)
      onFailure?.()
      if (import.meta.env.DEV) console.warn(`[Website image] ${page}/${code} unavailable`)
    }} />
}
function Copy({ text }) {
  return text?.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)
}
function Specifications({ text }) {
  return <Row className="g-4">{text?.split(/\n\s*\n/).map((paragraph, index) => {
    const [name, ...details] = paragraph.split('\n')
    return <Col md={6} key={index}><article className="border-top pt-4"><h3 className="h4 mb-3">{name}</h3><Copy text={details.join('\n')} /></article></Col>
  })}</Row>
}
export default function FrameworkPage({ pageCode, title, stages, fallbackContent = {} }) {
  return <PageView key={pageCode} pageCode={pageCode} title={title} stages={stages} fallbackContent={fallbackContent} />
}
function PageView({ pageCode, title, stages, fallbackContent }) {
  const live = useWebsitePage(pageCode, title)
  const state = live
  const lookup = { ...fallbackContent, ...Object.fromEntries(state.rows.map(row => [row.section_code, row])) }
  const images = live.images
  const hero = lookup.PAGE_HERO
  const intro = lookup.INTRODUCTION
  const enquiry = lookup.ENQUIRY_BANNER

  const handled = new Set(['PAGE_HERO', 'PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'ENQUIRY_BANNER', ...stages.map(stage => stage.code)])
  const removed = pageCode === 'HOME_TEXTILES' ? ['PRODUCT_CAPABILITIES', 'MATERIALS'] : []
  const extras = state.rows.filter(row => !handled.has(row.section_code) && !removed.includes(row.section_code)).map(row => ({ code: row.section_code, title: row.heading }))
  // Empty stages have no invented explanatory text; verified image labels may stand alone.
  const visible = [...stages, ...extras].filter(stage => lookup[stage.code] || (stage.images || [stage.code]).some(code => images[code]))
  // Group adjacent empty positions without moving them out of process order.
  const blocks = []
  for (const [index, stage] of [...stages, ...extras].entries()) {
    if (visible.some(item => item.code === stage.code)) blocks.push({ stage, index })
    else if (blocks.at(-1)?.pending) blocks.at(-1).pending.push(stage)
    else blocks.push({ pending: [stage] })
  }
  const journey = stages.filter(stage => !['MACHINERY', 'MENS_APPAREL', 'UNDER_GARMENTS', 'TRADITIONAL_WEAR'].includes(stage.code) && !(pageCode === 'GARMENTING' && stage.code === 'QUALITY_CONTROL'))
  return <main className={`${styles.page} ${styles.imageLayout}`} aria-busy={state.loading}>
    <FrameworkSplitHero data={live} pageCode={pageCode} alt={title}>
      <Container><div className={styles.heroCopy}>
        <nav aria-label="Breadcrumb" className="small mb-4"><Link to="/framework">Framework</Link> / <span aria-current="page">{title}</span></nav>
        <h1 className="mb-4">{title}</h1><Copy text={hero?.body_content} />
      </div></Container>
    </FrameworkSplitHero>
    <PageGroupTabs group="Framework" />
    {state.loading && <Container className="py-3" role="status">Loading {title.toLowerCase()}…</Container>}
    {state.error && <Container className="py-3" role="status">Latest information is temporarily unavailable. Please contact our team.</Container>}
    {(intro || frameworkImageSections[pageCode].includes('INTRODUCTION')) && <section className="py-5"><Container><Row className="g-5 align-items-center">
      {images.INTRODUCTION && <Col data-image-column lg={6}><Photo key={`intro-${images.INTRODUCTION?.updated_at || ''}`} page={pageCode} code="INTRODUCTION" metadata={images.INTRODUCTION} /></Col>}
      <Col data-copy-column lg={images.INTRODUCTION ? 6 : 12}><p className={styles.label}>Framework / {title}</p><h2 className="mb-4">{intro?.heading || `Inside ${title}`}</h2><div className={styles.copy}><Copy text={intro?.body_content} /></div></Col>
    </Row></Container></section>}
    {journey.length > 0 && <section className="py-4 border-top border-bottom bg-white"><Container><SectionNavigator items={journey} label={`${title} sections`} /></Container></section>}
    {blocks.map(block => {
      if (block.pending) return <section className="py-5" key={`pending-${block.pending[0].code}`}><Container><p className={styles.label}>Inside {title}</p><h2 className="mb-4">A Closer Look</h2><Row className="g-3">{block.pending.map(stage => <Col sm={6} lg={4} key={stage.code}><article id={stage.code} tabIndex={-1} className={styles.pendingStage}><h3 className="h5 mb-3">{stage.title}</h3>{(stage.images || [stage.code]).filter(code => frameworkImageSections[pageCode].includes(code) && images[code]).map(code => <Photo key={code} page={pageCode} code={code} metadata={images[code]} />)}</article></Col>)}</Row></Container></section>
      const { stage, index } = block
      const item = lookup[stage.code]
      const photos = (stage.images || [stage.code]).filter(code => frameworkImageSections[pageCode]?.includes(code) && images[code])
      return <section key={stage.code} id={stage.code} tabIndex={-1} className={`py-5 ${index % 2 === 0 ? 'bg-white' : ''}`}><Container><Row className="g-5 align-items-center">
        {photos.length > 0 && <Col data-image-column lg={6} className={index % 2 ? 'order-lg-2' : ''}><Row className="g-3">{photos.map(code => <Col data-photo-cell xs={12} sm={photos.length > 1 ? 6 : 12} key={code}><Photo key={`${code}-${images[code]?.updated_at || ''}`} page={pageCode} code={code} metadata={images[code]} fit={stage.fit} /></Col>)}</Row></Col>}
        <Col data-copy-column lg={photos.length ? 6 : 12}><p className={styles.label}>{String(index + 1).padStart(2, '0')} / {title}</p><h2 className="mb-4">{item?.heading || stage.title}</h2><div className={styles.copy}>{['MENS_APPAREL', 'UNDER_GARMENTS', 'TRADITIONAL_WEAR'].includes(stage.code) ? <Specifications text={item?.body_content} /> : stage.code === 'PRODUCT_CAPABILITY' ? <ul className="d-flex flex-wrap gap-3 list-unstyled">{item?.body_content?.split('\n').filter(Boolean).map(line => <li key={line} className="border p-3">{line}</li>)}</ul> : <Copy text={item?.body_content} />}</div></Col>
      </Row></Container></section>
    })}
    <section className="py-5" aria-label="Related Framework pages"><Container><p className={styles.label}>Continue exploring</p><h2 className="mb-4">Connected Expertise</h2><div className="d-flex flex-wrap gap-3">{related.filter(name => name !== title).map(name => <Link key={name} className={styles.action} to={`/framework/${name.toLowerCase().replaceAll(' ', '-')}`}>{name} →</Link>)}</div></Container></section>
    <EnquiryBanner><Container><Row className="g-4 align-items-center"><Col lg={9}><p className="small text-uppercase">Start a conversation</p><h2 className="mb-3">{enquiry?.heading || 'Let’s Build Something Together'}</h2><Copy text={enquiry?.body_content || 'Speak with our team about your requirements and explore the next step.'} /></Col><Col lg={3}><Link className={styles.action} to="/lets-talk">{enquiry?.button_text || 'Let’s Talk'} →</Link></Col></Row>
    </Container></EnquiryBanner>
  </main>
}
