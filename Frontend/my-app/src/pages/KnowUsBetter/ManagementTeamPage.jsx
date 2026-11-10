import { useWebsitePage } from './useWebsitePage.js'
import { Col, Container, Row } from 'react-bootstrap'
// Exact first slide reference from WelcomeWayPage. Do not duplicate or replace it.
import leadershipImage from '../../assets/slideshow/leadership.jpeg'
import { AdditionalContent, Content, Hero, PageEnd, Photo, PublishedNote, Section } from './KnowUsBetterShared.jsx'
import { verifiedContent } from './verifiedContent.js'
import styles from './KnowUsBetter.module.css'

const [intro, md, ...members] = verifiedContent.management
const memberCodes = ['SUBRATA_PAL', 'SANJAY_DROLIA', 'SENDURGANI', 'MOORTHY']
const values = verifiedContent.company[7]

export default function ManagementTeamPage() {
  const data = useWebsitePage('MANAGEMENT_TEAM', 'Management Team')
  return <main className={styles.page} aria-busy={data.loading}>
    <Hero data={data} title="Management Team" eyebrow="People & purpose" intro="Business strategy, operational experience and customer satisfaction." imageFallback={leadershipImage} imageAlt="Shri.K.Sivaraj, Managing Director — the leadership photograph shown on Welcome Way" className={styles.managementHero} />
    <Container className="pt-4"><PublishedNote /></Container>
    <Section data={data} code="LEADERSHIP_INTRODUCTION" source={{ ...intro, heading: 'Leadership with a shared purpose' }} aliases={['INTRODUCTION']} alt="Sivaraj manufacturing operations" white />
    <section className={styles.section} id="MANAGING_DIRECTOR"><Container><Row className="g-5 align-items-start"><Col lg={4}><Photo data={data} code="MANAGING_DIRECTOR" alt="Approved portrait of Shri.K.Sivaraj" portrait /></Col><Col lg={8}><p className={styles.label}>Managing Director</p><Content item={data.get('MANAGING_DIRECTOR', md)} source={md} /></Col></Row></Container></section>
    <section className={`${styles.section} ${styles.paper}`} id="MANAGEMENT_TEAM"><Container><p className={styles.label}>Our management</p><h2 className="mb-4">Experience across the business</h2>{data.lookup.MANAGEMENT_TEAM && <Content item={data.lookup.MANAGEMENT_TEAM} level="h3" />}<Row className="g-4">{members.map((source, index) => <Col lg={6} key={memberCodes[index]}><article className={styles.card}><span className={styles.index}>{String(index + 1).padStart(2, '0')}</span><Content item={data.get(memberCodes[index], source)} source={source} level="h3" /></article></Col>)}</Row></Container></section>
    {data.lookup.LEADERSHIP_MESSAGE && <Section data={data} code="LEADERSHIP_MESSAGE" alt="Sivaraj corporate operations" />}
    <section className={styles.section} id="LEADERSHIP_VALUES"><Container><Row className="g-5 align-items-center"><Col lg={5}><Photo data={data} code="LEADERSHIP_VALUES" alt="Textile quality review and operations" /></Col><Col lg={7}><p className={styles.label}>The group philosophy</p><Content item={data.get('LEADERSHIP_VALUES', { ...values, heading: 'Principles that guide our decisions' })} source={{ ...values, heading: 'Principles that guide our decisions' }} /></Col></Row></Container></section>
    <AdditionalContent data={data} handled={['PAGE_HERO', 'LEADERSHIP_INTRODUCTION', 'MANAGING_DIRECTOR', 'MANAGEMENT_TEAM', 'LEADERSHIP_MESSAGE', 'LEADERSHIP_VALUES', ...memberCodes, 'ENQUIRY_BANNER']} />
    <PageEnd data={data} title="Management Team" />
  </main>
}
