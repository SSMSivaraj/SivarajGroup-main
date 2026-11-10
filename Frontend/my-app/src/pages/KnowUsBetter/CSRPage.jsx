import { useWebsitePage } from './useWebsitePage.js'
import { Col, Container, Row } from 'react-bootstrap'
import { AdditionalContent, Content, Hero, PageEnd, Photo, PublishedNote, Section } from './KnowUsBetterShared.jsx'
import { verifiedContent } from './verifiedContent.js'
import styles from './KnowUsBetter.module.css'

const [intro, rainwater, wind, trees, school, hall, food] = verifiedContent.csr

export default function CSRPage() {
  const data = useWebsitePage('CSR', 'CSR')
  return <main className={styles.page} aria-busy={data.loading}>
    <Hero data={data} title="CSR" intro="Social commitment through S. Chennimalai Gounder Charitable Trust." />
    <Container className="pt-4"><PublishedNote /></Container>
    <Section data={data} code="CSR_INTRODUCTION" source={{ ...intro, heading: 'Responsibility to the community' }} aliases={['INTRODUCTION']} alt="Approved charitable trust community activity" white />
    <Section data={data} code="COMMUNITY" source={hall} alt="The charitable trust marriage hall in Tirupur" reverse />
    <Section data={data} code="EDUCATION" source={school} alt="Approved photograph of SSM School" white />
    <section className={styles.section} id="ENVIRONMENT" aria-labelledby="environment-heading">
      <Container>
        <div className={styles.environmentHeading}>
          <p className={styles.label}>Environmental responsibility</p>
          <h2 id="environment-heading">Water, energy and green cover</h2>
          {data.lookup.ENVIRONMENT && <Content item={data.lookup.ENVIRONMENT} level="h3" />}
          <p className={styles.sourceNote}>The published profile describes rainwater harvesting, wind power and tree plantation.</p>
        </div>
        <div className={styles.environmentList}>
          {[
            { code: 'RAIN_WATER_HARVESTING', source: rainwater, alt: 'Rain water harvesting and water conservation' },
            { code: 'WIND_MILL', source: wind, alt: 'Wind mill generating renewable energy' },
            { code: 'TREE_PLANTATION', source: trees, alt: 'Tree plantation and sapling care' },
          ].map(({ code, source, alt }, index) => <article key={code} id={code} className={styles.environmentItem}>
            <Row className="g-0 align-items-stretch">
              <Col lg={5} className={index % 2 ? 'order-lg-2' : ''}>
                <div className={styles.environmentPhoto}>
                  <Photo data={data} code={code} fallbackCode={code === 'TREE_PLANTATION' ? 'ENVIRONMENT' : undefined} alt={alt} />
                </div>
              </Col>
              <Col lg={7}>
                <div className={styles.environmentCopy}>
                  <span className={styles.index} aria-hidden="true">0{index + 1}</span>
                  <Content item={data.get(code, source)} source={source} level="h3" />
                  {code === 'WIND_MILL' && <p className={`${styles.sourceNote} mb-0`}>Wind-power figures and the reference to power consumption are retained from the published profile.</p>}
                </div>
              </Col>
            </Row>
          </article>)}
        </div>
      </Container>
    </section>
    <section className={`${styles.section} ${styles.paper}`} id="FREE_FOOD_DISTRIBUTION"><Container><Row className="g-5 align-items-center"><Col lg={6}><Photo data={data} code="CSR_GALLERY_PRIMARY" alt="Approved photograph of free food distribution" /></Col><Col lg={6}><p className={styles.label}>Community support</p><Content item={data.get('FREE_FOOD_DISTRIBUTION', food)} source={food} /><p className={styles.sourceNote}>Free Food Distribution is an activity listed on the published CSR page.</p></Col></Row></Container></section>
    {data.lookup.HEALTH_WELLBEING && <Section data={data} code="HEALTH_WELLBEING" alt="Approved health and wellbeing initiative" />}
    {data.lookup.EMPLOYEE_WELFARE && <Section data={data} code="EMPLOYEE_WELFARE" alt="Approved employee welfare activity" white />}
    <section className={`${styles.section} ${styles.gallery}`} aria-label="CSR photography"><Container><p className={styles.label}>A closer look</p><h2 className="mb-4">Community & environment</h2><Row className="g-4"><Col md={6}><figure><Photo data={data} code="CSR_GALLERY_SECONDARY" alt="Supporting photograph of sapling care" /><figcaption>Saplings and green cover</figcaption></figure></Col><Col md={6}><figure><figcaption>SSM School</figcaption></figure></Col></Row></Container></section>
    <AdditionalContent data={data} handled={['PAGE_HERO', 'CSR_INTRODUCTION', 'COMMUNITY', 'EDUCATION', 'ENVIRONMENT', 'RAIN_WATER_HARVESTING', 'WIND_MILL', 'TREE_PLANTATION', 'FREE_FOOD_DISTRIBUTION', 'HEALTH_WELLBEING', 'EMPLOYEE_WELFARE', 'ENQUIRY_BANNER']} />
    <PageEnd data={data} title="CSR" />
  </main>
}
