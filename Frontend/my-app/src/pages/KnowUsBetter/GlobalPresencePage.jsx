import { useWebsitePage } from './useWebsitePage.js'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { Action, AdditionalContent, Content, Hero, PageEnd, Photo, PublishedNote, Section } from './KnowUsBetterShared.jsx'
import { verifiedContent } from './verifiedContent.js'
import styles from './KnowUsBetter.module.css'

const markets = [...verifiedContent.markets].sort((a, b) => a.name.localeCompare(b.name))
const business = verifiedContent.company[1]
const brand = { heading: 'Explore Chennis', body_content: 'Chennis is a brand by Sivaraj Spinning Mill. The published brand story describes a premium casual collection and lifestyle products including traditional dhotis, shirts, trousers and T-shirts, with categories such as Urban, Sport, Excursion and Club.' }

function MarketMap() {
  const [selected, setSelected] = useState('India')
  const current = markets.find(market => market.name === selected)
  const x = longitude => 40 + (longitude + 180) / 360 * 920
  const y = latitude => 25 + (90 - latitude) / 180 * 380
  return <><label htmlFor="market-selection" className="d-block mb-2">Explore a published market</label><select id="market-selection" className={`${styles.marketSelect} mb-4`} value={selected} onChange={event => setSelected(event.target.value)}>{markets.map(market => <option key={market.name}>{market.name}</option>)}</select>
    <svg viewBox="0 0 1000 440" className={styles.map} role="img" aria-labelledby="market-map-title market-map-description"><title id="market-map-title">Sivaraj published market locations</title><desc id="market-map-description">A longitude and latitude map of the country and territory markers on the existing Sivaraj website. Selected: {selected}. These markers indicate markets, not office addresses. The complete textual list follows.</desc>
      {[-120, -60, 0, 60, 120].map(lng => <g key={lng}><path d={`M${x(lng)} 25V405`} stroke="#d8d8cd" /><text x={x(lng)} y="429" textAnchor="middle">{lng}°</text></g>)}
      {[-60, -30, 0, 30, 60].map(lat => <g key={lat}><path d={`M40 ${y(lat)}H960`} stroke="#d8d8cd" /><text x="5" y={y(lat) + 4}>{lat}°</text></g>)}
      {markets.map(market => <circle key={market.name} cx={x(market.lng)} cy={y(market.lat)} r="4" fill="#063f35" stroke="#fff" strokeWidth="1"><title>{market.name}</title></circle>)}
      <circle cx={x(current.lng)} cy={y(current.lat)} r="8" fill="#b88a3b" stroke="#082f28" strokeWidth="2" />
    </svg><p role="status" className={`${styles.sourceNote} mt-3`}>Selected market: {selected}. Country and territory markers are reproduced from the published map; they do not indicate office addresses.</p>
    <h3 className="mt-5 mb-4">Published markets</h3><ul className={styles.marketList}>{markets.map(market => <li key={market.name}>{market.name}</li>)}</ul><p className={styles.sourceNote}>The source map names Swaziland and Korea; those labels are retained. It also includes India alongside the export markets.</p>
  </>
}

export default function GlobalPresencePage() {
  const data = useWebsitePage('GLOBAL_PRESENCE', 'Global Presence')
  return <main className={styles.page} aria-busy={data.loading}>
    <Hero data={data} title="Global Presence" intro="Textile expertise from India, connected to markets around the world." />
    <Container className="pt-4"><PublishedNote /></Container>
    <Section data={data} code="GLOBAL_INTRODUCTION" source={{ heading: 'India to the world', body_content: verifiedContent.global }} aliases={['INTRODUCTION']} alt="Textile products prepared for international delivery" white />
    <Section data={data} code="INDIA_PRESENCE" source={business} alt="Sivaraj manufacturing operations in India" reverse />
    {data.lookup.INTERNATIONAL_PRESENCE && <Section data={data} code="INTERNATIONAL_PRESENCE" alt="Textile export and international delivery" white />}
    <section className={`${styles.section} ${styles.paper}`} id="MARKET_MAP"><Container><p className={styles.label}>Our market connections</p><h2 className="mb-4">A view of our global presence</h2>{data.lookup.MARKET_MAP && <Content item={data.lookup.MARKET_MAP} level="h3" />}<MarketMap /></Container></section>
    <section className={styles.section} id="CHENNIS_BRAND"><Container><div className={styles.brand}><Row className="g-5 align-items-center"><Col lg={6}><Photo data={data} code="CHENNIS_BRAND" alt="Approved Chennis apparel collection" /></Col><Col lg={6}><p className={styles.label}>The apparel connection</p><h2 className="mb-4">Explore Chennis</h2><Content item={data.get('CHENNIS_BRAND', { ...brand, heading: 'A brand by Sivaraj Spinning Mill' })} source={{ ...brand, heading: 'A brand by Sivaraj Spinning Mill' }} level="h3" /><Action url="/enlightenment/brands">Explore Chennis<span aria-hidden="true">→</span></Action></Col></Row></div></Container></section>
    <Section data={data} code="GLOBAL_CAPABILITIES" source={{ heading: 'Yarn, fabrics and garments', body_content: 'The published company profile identifies four product portfolios: Yarn, Woven fabric, Knitted fabric and Readymade garments.' }} alt="Yarn cones, folded fabrics and garments prepared for distribution" white />
    <AdditionalContent data={data} handled={['PAGE_HERO', 'GLOBAL_INTRODUCTION', 'INDIA_PRESENCE', 'INTERNATIONAL_PRESENCE', 'MARKET_MAP', 'CHENNIS_BRAND', 'GLOBAL_CAPABILITIES', 'ENQUIRY_BANNER']} />
    <PageEnd data={data} title="Global Presence" />
  </main>
}
