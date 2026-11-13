import { navigationGroup } from '../../config/navigation.js'
import EnquiryBanner from '../../Components/EnquiryBanner/EnquiryBanner.jsx'
import { imageSlot } from '../../config/imageSlots.js'
import PageGroupTabs from '../../Components/Navigation/PageGroupTabs.jsx'
import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PageHero from '../../Components/PageHero/PageHero.jsx'
import { useWebsitePage, imageUrl } from './useWebsitePage.js'
import { Photo, Copy, Action } from './KnowUsBetterShared.jsx'
import { primaryImagePositions, sectionPages } from './sectionConfig.js'
import styles from './InnerPage.module.css'

export default function InnerPage({ config }) {
  return <Page key={config.pageCode} config={{ ...sectionPages[config.pageCode], ...config }} />
}
function Specification({ row, product = false }) {
  const lines = row.body_content?.split(product ? /\r?\n/ : '\n').filter(line => product ? line.trim().length > 0 : Boolean(line)) || []
  if (product) return <div className="table-responsive"><table className={styles.table}><caption>{row.heading}</caption><tbody>{lines.map((line, index) => {
    const separator = line.indexOf(': ')
    return separator < 0
      ? <tr key={index}><td colSpan={2}>{line}</td></tr>
      : <tr key={index}><th scope="row">{line.slice(0, separator)}</th><td>{line.slice(separator + 2)}</td></tr>
  })}</tbody></table></div>
  return <div className="table-responsive"><table className={styles.table}><caption>{row.heading}</caption><thead><tr><th scope="col">{row.section_code === 'APPLICATIONS' ? 'Published detail' : 'Testing / checking'}</th><th scope="col">{row.section_code === 'APPLICATIONS' ? 'Specification' : 'Instrument make'}</th></tr></thead><tbody>{lines.map((line,index) => {
    const separator = line.includes(' — ') ? ' — ' : ': '
    const [name,...value] = line.split(separator)
    return <tr key={index}><th scope="row">{name}</th><td>{value.join(separator) || '—'}</td></tr>
  })}</tbody></table></div>
}
function ProductRange({ data, row, config }) {
  const products = row.body_content?.split(/\r?\n/).filter(Boolean) || []
  const photographic = Boolean(config.products?.[row.section_code])
  return <ul className={`${styles.range} ${photographic ? styles.catalogue : ''}`}>{products.map((name,index) => {
    const code = `${row.section_code}_${String(index+1).padStart(2,'0')}`
    return <li key={index}>{photographic && imageSlot(data.page,code) && data.images[code] && <Photo data={data} code={code} alt={name} />}<span>{name}</span></li>
  })}</ul>
}
function Page({ config }) {
  const group = navigationGroup(config.category)
  const scopedPresentation = ['Enlightenment', 'Goods'].includes(config.category)
  const data = useWebsitePage(config.pageCode, config.title)
  const hero = data.lookup.PAGE_HERO
  const enquiry = data.lookup.ENQUIRY_BANNER
  const metadata = data.images.PAGE_HERO
  const primary = primaryImagePositions[data.page] || {}
  const contentCodes = new Set(data.rows.map(row => row.section_code))
  const documentSlots = Object.keys(data.images).filter(code => imageSlot(data.page,code) && !contentCodes.has(code) && /^(CERTIFICATE_|REWARD_GALLERY)/.test(code))
  return <main className={`${styles.page} ${config.category === 'Goods' ? styles.goods : ''} ${scopedPresentation ? styles.reviewedPages : ''}`} aria-busy={data.loading}>
    <PageHero pageCode={data.page} src={metadata ? imageUrl(data.page,'PAGE_HERO',metadata) : undefined} alt={metadata?.alt_text || `${config.title} at Sivaraj Group`}><Container><div className={styles.heroCopy}>
      <nav aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to={group.path}>{group.label}</Link> / <span aria-current="page">{config.title}</span></nav>
      <p className={styles.label}>{group.label}</p><h1>{config.title}</h1>{hero?.heading && hero.heading !== config.title && <p>{hero.heading}</p>}{hero?.subheading && <p>{hero.subheading}</p>}<Copy text={hero?.body_content} />{hero?.button_text && <Action url={hero.button_url}>{hero.button_text}</Action>}
    </div></Container></PageHero>
    <PageGroupTabs group={config.category} />
    {data.loading && <Container className="py-3" role="status">Loading {config.title.toLowerCase()}…</Container>}
    {!data.loading && !data.rows.length && <Container className="py-5"><h2>Explore {config.title}</h2><p>Published information is temporarily unavailable. Please contact our team.</p></Container>}
    {data.rows.filter(row => !['PAGE_HERO','ENQUIRY_BANNER'].includes(row.section_code)).map((row,index) => {
      const supporting = row.section_code === 'PRODUCT_RANGE' && data.page === 'GARMENTS'
      const photograph = primary[row.section_code] || supporting
      return <section key={row.content_id || row.section_code} id={row.section_code} className={`${styles.section} ${index % 2 ? styles.paper : ''}`}><Container><Row className="g-4 g-lg-5 align-items-center">
        {photograph && <Col lg={5} className={index % 2 ? 'order-lg-2' : ''}><Photo data={data} code={row.section_code} alt={row.heading || config.title} />{supporting && <div className="mt-4"><Photo data={data} code="GARMENT_APPLICATIONS" alt="Garment showcase" /></div>}</Col>}
        <Col lg={photograph ? 7 : 12}><p className={styles.label}>{row.subheading || `${config.category} / ${config.title}`}</p><h2>{row.heading}</h2>{config.tables?.includes(row.section_code) ? <Specification row={row} product={config.category === 'Goods'} /> : config.lists?.includes(row.section_code) ? <ProductRange data={data} row={row} config={config} /> : <Copy text={row.body_content} />}{row.button_text && <Action url={row.button_url}>{row.button_text}</Action>}</Col>
      </Row></Container></section>
    })}
    {Object.keys(primary).filter(code => code !== 'PAGE_HERO' && !contentCodes.has(code) && !documentSlots.includes(code) && !(code === 'GARMENT_APPLICATIONS' && contentCodes.has('PRODUCT_RANGE')) && data.images[code]).map(code => <Container key={code} className="py-4"><Photo data={data} code={code} alt={primary[code].label} /></Container>)}
    {documentSlots.length > 0 && <section className={styles.section}><Container><h2>Published documents</h2><Row className="g-4">{documentSlots.map(code => <Col md={6} lg={4} key={code}><figure className={styles.document}><Photo data={data} code={code} alt={data.images[code].alt_text || 'Published document; contact our team for details'} /><figcaption><a href={imageUrl(data.page,code,data.images[code])} target="_blank" rel="noopener noreferrer">Open {data.images[code].alt_text || 'document'} (new tab)</a></figcaption></figure></Col>)}</Row></Container></section>}
    <EnquiryBanner><Container><Row className="g-4 align-items-center"><Col lg={9}><p className={styles.label}>Start a conversation</p><h2>{enquiry?.heading || 'Let’s Build Something Together'}</h2><Copy text={enquiry?.body_content || 'Speak with our team about your requirements and explore the next step.'} /></Col><Col lg={3}><Action url={enquiry?.button_url || '/lets-talk'}>{enquiry?.button_text || 'Let’s Talk'}</Action></Col></Row></Container></EnquiryBanner>
  </main>
}
