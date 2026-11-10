import { useWebsitePage } from './useWebsitePage.js'
import { Col, Container, Row } from 'react-bootstrap'
import { AdditionalContent, Content, Hero, PageEnd, Photo, PublishedNote, Section } from './KnowUsBetterShared.jsx'
import { verifiedContent } from './verifiedContent.js'
import styles from './KnowUsBetter.module.css'

const [legacy, business, quality, growth, , vision, mission, values] = verifiedContent.company
const [heritage, ...introduction] = legacy.body_content.split('\n\n')
const intro = { heading: 'A distinguished member of SSM Group', body_content: introduction.join('\n\n') }
const story = { heading: legacy.heading, body_content: heritage }
const capabilities = ['Yarn', 'Woven fabric', 'Knitted fabric', 'Readymade garments']

export default function CompanyProfilePage() {
  const data = useWebsitePage('COMPANY_PROFILE', 'Company Profile')
  return <main className={styles.page} aria-busy={data.loading}>
    <Hero data={data} title="Company Profile" intro="Yarn, fabrics and readymade garments. Discover the Sivaraj Spinning Mills story." />
    <Container className="pt-4"><PublishedNote /></Container>
    <Section data={data} code="INTRODUCTION" source={intro} aliases={['WHO_WE_ARE']} alt="Sivaraj textile manufacturing facility" white />
    <Section data={data} code="LEGACY" source={story} aliases={['OUR_JOURNEY', 'MILESTONES']} alt="Cotton and textile manufacturing at Sivaraj" reverse />
    <section className={`${styles.section} ${styles.paper}`} id="INTEGRATED_CAPABILITIES"><Container><Row className="g-5 align-items-center"><Col lg={5}><Photo data={data} code="INTEGRATED_CAPABILITIES" alt="Yarn, fabric and garment production" /></Col><Col lg={7}><p className={styles.label}>From cotton to clothing</p><Content item={data.get('INTEGRATED_CAPABILITIES', { heading: 'Four connected product portfolios' }, ['FIBRE_TO_FASHION', 'BUSINESS_CAPABILITIES'])} /><ul className={styles.capabilities}>{capabilities.map((name, index) => <li key={name}><span>{String(index + 1).padStart(2, '0')}</span>{name}</li>)}</ul></Col></Row></Container></section>
    <Section data={data} code="MANUFACTURING_STRENGTH" source={business} alt="Textile facility and manufacturing operations" reverse />
    <Section data={data} code="QUALITY_COMMITMENT" source={quality} alt="Textile product quality inspection" white />
    <Section data={data} code="COMPANY_HIGHLIGHT" source={growth} alt="Sivaraj manufacturing floor" reverse><p className={styles.sourceNote}>The revenue target above is retained as a statement from the published profile; its original two-year period is not dated on that page.</p></Section>
    <section className={`${styles.section} ${styles.paper}`}><Container><p className={styles.label}>Our philosophy</p><h2 className="mb-5">A shared direction</h2><Row className="g-4">{[['VISION', vision], ['MISSION', mission], ['CORE_VALUES', values]].map(([code, source]) => <Col lg={4} key={code}><article className={styles.card}><Content item={data.get(code, source)} source={source} level="h3" /></article></Col>)}</Row></Container></section>
    <AdditionalContent data={data} handled={['PAGE_HERO', 'INTRODUCTION', 'LEGACY', 'INTEGRATED_CAPABILITIES', 'MANUFACTURING_STRENGTH', 'QUALITY_COMMITMENT', 'COMPANY_HIGHLIGHT', 'VISION', 'MISSION', 'CORE_VALUES', 'ENQUIRY_BANNER']} />
    <PageEnd data={data} title="Company Profile" />
  </main>
}
