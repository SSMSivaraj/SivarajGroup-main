import imageStyles from '../Framework/FrameworkPage.module.css'
import EnquiryBanner from '../../Components/EnquiryBanner/EnquiryBanner.jsx'
import FrameworkSplitHero from '../../Components/PageHero/FrameworkSplitHero.jsx'
import PageGroupTabs from '../../Components/Navigation/PageGroupTabs.jsx'
import SectionNavigator from '../../Components/Navigation/SectionNavigator.jsx'
import { useWebsitePage, imageUrl } from './useWebsitePage.js'
import { useContext, useEffect, useRef, useState } from 'react'
import { FrameworkImageContext } from '../Framework/frameworkImageContext.js'
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const API_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
const palette = { green: '#063F35', dark: '#082F28', ivory: '#F6F2E9', text: '#1D2926', muted: '#66736F' }
const headingStyle = { fontFamily: 'Georgia, serif', lineHeight: 1.15 }
const actionStyle = { background: palette.green, color: '#fff', borderRadius: 0, padding: '12px 24px' }
const anchorStyle = { scrollMarginTop: 100 }
// Reference: https://www.sivaraj.co.in/infrastructure/spinning/
// General process explanations avoid unverified capacities, models and certifications.
const fallback = {
  PAGE_HERO: ['Precision Spinning. Consistent Yarn.', 'Carefully prepared fibre becomes yarn through connected manufacturing stages and attention to quality.'],
  INTRODUCTION: ['From Fibre Preparation to Finished Yarn', 'The published Sivaraj spinning process connects cotton preparation, carding, drawing, combing where required, roving, ring spinning, winding and yarn conditioning.\n\nRaw-cotton inspection and a trained workforce support quality throughout the process.'],
  PROCESS_FLOW: ['From Fibre to Yarn', 'Explore the ring-spinning route below. Where required, pre-comber drawing and lap preparation precede combing. Open-End spinning follows a separate route.'],
  BLOW_ROOM: ['Opening, Cleaning and Consistent Blending', 'Cotton bales are opened and fibres progressively loosened. Blending and cleaning prepare a consistent fibre feed for carding.'],
  CARDING: ['Carding — The Foundation of Yarn Quality', 'Carding further opens and cleans the fibre, separates and aligns it, and forms a continuous sliver for the next stage.'],
  COMBER: ['Refining Fibre for Finer Yarn', 'Where the yarn specification requires combing, prepared laps are combed to improve fibre parallelisation and reduce short fibres and remaining impurities. This preparation route is not required for every yarn.'],
  DRAWING_SIMPLEX: ['Preparing an Even Feed for Spinning', 'Controlled preparation supports consistency before yarn formation.'],
  DRAW_FRAME: ['Drawing', 'Multiple slivers are combined and drafted to reduce variation and prepare a more even feed for subsequent processing.'],
  SIMPLEX: ['Simplex / Roving', 'Drawn sliver is drafted into roving with a light twist. Roving packages provide a controlled feed to the ring-spinning frame.'],
  RING_SPINNING: ['Where Roving Becomes Yarn', 'Roving is drafted to the required fineness. Inserting twist gives the forming yarn its strength and structure.'],
  LINK_CONER: ['Precision Winding and Package Consistency', 'Following ring spinning, yarn is wound into packages for subsequent processing. The published facility description includes linked winding and yarn contamination removal.'],
  YARN_CONDITIONING: ['Yarn Conditioning and Finished Packages', 'The published spinning sequence includes yarn conditioning before packing. Finished yarn packages are prepared for the next manufacturing stage or dispatch.'],
  OPEN_END_SPINNING: ['Open-End Spinning — A Separate Yarn Route', 'Open-End spinning uses prepared sliver directly for yarn formation and package building, following a route distinct from roving and ring spinning.'],
  QUALITY_CONTROL: ['Quality Built into Every Stage', 'The published quality approach begins with raw-cotton inspection and continues through trained operation and contamination removal. Discuss current inspection and traceability requirements with our team.'],
  ENQUIRY_BANNER: ['Let’s Build the Right Yarn Solution', 'Connect with our team to discuss yarn requirements, manufacturing capabilities and business enquiries.'],
}
const ringSteps = [['Cotton Opening', 'BLOW_ROOM'], ['Blow Room', 'BLOW_ROOM'], ['Carding', 'CARDING'], ['Combing (when required)', 'COMBER'], ['Drawing', 'DRAW_FRAME'], ['Simplex', 'SIMPLEX'], ['Ring Spinning', 'RING_SPINNING'], ['Link Coner / Winding', 'LINK_CONER'], ['Yarn Conditioning', 'YARN_CONDITIONING'], ['Finished Yarn', 'FINISHED_YARN']]
const oeSteps = [['Opening', 'OE_BLOW_ROOM'], ['Blow Room', 'OE_BLOW_ROOM'], ['Draw Frame', 'OE_DRAW_FRAME'], ['OE Spinning', 'OE_WINDING'], ['Winding', 'OE_WINDING']]
const related = [['Knitting', '/framework/knitting'], ['Weaving', '/framework/weaving'], ['Garmenting', '/framework/garmenting'], ['Home Textiles', '/framework/home-textiles'], ['Cotton Yarn', '/goods/cotton-yarn']]

function DatabaseImage({ sectionCode, altText, background = false, ratio = '5 / 4' }) {
  const data = useContext(FrameworkImageContext)
  return <DatabasePhoto key={sectionCode + '-' + data.images[sectionCode]?.updated_at + '-' + !!data.images[sectionCode]} {...{sectionCode,altText,background,ratio,data}} />
}
function DatabasePhoto({ sectionCode, altText, background, ratio, data }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const hero = sectionCode === 'PAGE_HERO'
  if (!data.images[sectionCode] || failed) return null
  return <div data-image-page="SPINNING" data-image-position={sectionCode} className={background ? 'position-absolute w-100 h-100' : 'position-relative overflow-hidden'} style={{ ...(background ? { inset: 0 } : failed ? { minHeight: 88 } : { aspectRatio: ratio }), background: '#eeeae1' }}>
    {!failed && !loaded && <span role="status" className="d-block p-3 small">Loading photograph…</span>}
    {!failed && <img src={imageUrl('SPINNING', sectionCode, data.images[sectionCode])} alt={altText} loading={hero ? 'eager' : 'lazy'} fetchPriority={hero ? 'high' : 'auto'} onLoad={() => setLoaded(true)} onError={() => setFailed(true)} className="position-absolute w-100 h-100" style={{ inset: 0, objectFit: 'cover' }} />}
  </div>
}
function Label({ children, light = false }) {
  return <p className="small text-uppercase fw-semibold mb-3" style={{ letterSpacing: '.14em', color: light ? '#E8C58E' : '#806024' }}>{children}</p>
}
function Copy({ text, light = false }) {
  return text ? <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: light ? '#E5ECE8' : palette.muted }}>{text}</p> : null
}
function Content({ item, level: Heading = 'h2', light = false }) {
  return <>{item.label && <Label light={light}>{item.label}</Label>}<Heading className={Heading === 'h3' ? 'h4 mb-3' : 'display-6 mb-4'} style={headingStyle}>{item.title}</Heading><Copy text={item.body} light={light} /></>
}
function ProcessNavigation({ steps, label }) {
  return <SectionNavigator items={steps.map(([title,code]) => ({title,code}))} label={label} />
}
function Stage({ code, imageCode = code, alt, item, reverse = false, white = false, children }) {
  return <section id={code} tabIndex={-1} className={`py-5 ${white ? 'bg-white' : ''}`} style={anchorStyle}><Container><Row className="g-5 align-items-center"><Col data-image-column lg={6} className={reverse ? 'order-lg-2' : ''}><DatabaseImage sectionCode={imageCode} altText={alt} />{children}</Col><Col data-copy-column lg={6}><Label>Spinning / {code.replaceAll('_', ' ')}</Label><Content item={item} /></Col></Row></Container></section>
}
export default function SpinningPage() {
  const imageData = useWebsitePage('SPINNING', 'Spinning')
  const [state, setState] = useState({ loading: true, error: false, rows: [] })
  const contentRequest = useRef(null)
  useEffect(() => {
    let active = true
    // Reuse the request during StrictMode's development effect replay.
    if (!contentRequest.current) {
      contentRequest.current = (async () => {
        const response = await fetch(`${API_URL}/api/website/page-content/SPINNING`)
        const result = await response.json()
        const rows = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : result.data?.data
        if (!response.ok || result.success === false || !Array.isArray(rows)) throw new Error('Content unavailable')
        return rows.filter(row => typeof row.section_code === 'string')
      })()
    }
    contentRequest.current.then(rows => {
      if (active) setState({ loading: false, error: false, rows })
    }).catch(() => {
      if (active) setState({ loading: false, error: true, rows: [] })
    })
    const previousTitle = document.title
    document.title = 'Spinning | Sivaraj Group'
    return () => { active = false; document.title = previousTitle }
  }, [])
  const lookup = Object.fromEntries(state.rows.map(row => [row.section_code, row]))
  const get = code => {
    const row = lookup[code]
    return { title: row?.heading ?? fallback[code]?.[0], body: row?.body_content ?? fallback[code]?.[1], label: row?.subheading, action: row?.button_text }
  }
  const hero = get('PAGE_HERO')
  const enquiry = get('ENQUIRY_BANNER')
  return <FrameworkImageContext.Provider value={imageData}><main className={imageStyles.imageLayout} style={{ background: palette.ivory, color: palette.text, overflowWrap: 'anywhere' }} aria-busy={state.loading}>
    <FrameworkSplitHero data={imageData} pageCode="SPINNING" alt="Spinning and linked winding machinery along the Sivaraj production aisle">
      <Container className="position-relative d-flex align-items-center py-5" ><div style={{ maxWidth: 800 }}>
        <nav aria-label="Breadcrumb" className="small mb-5 d-flex flex-wrap gap-2"><Link to="/" className="text-white">Home</Link><span>/</span><Link to="/framework" className="text-white">Framework</Link><span>/</span><span aria-current="page">Spinning</span></nav>
        <Label light>Framework</Label><h1 className="mb-4" style={{ ...headingStyle, fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>{hero.title}</h1><div style={{ maxWidth: 640 }}><Copy text={hero.body} light /></div>
      </div></Container>
    </FrameworkSplitHero>
    <PageGroupTabs group="Framework" />
    <Container>{state.loading && <div role="status" className="py-4 d-flex gap-3 align-items-center"><Spinner size="sm" animation="border" /><span>Loading spinning…</span></div>}{state.error && <Alert variant="light" className="mt-4">Latest updates are temporarily unavailable. Explore the overview below or contact our team.</Alert>}</Container>
    <Stage code="INTRODUCTION" alt="Connected spinning and winding production floor" item={get('INTRODUCTION')} />
    <Container><ul className="list-unstyled d-flex flex-wrap gap-3 mb-5">{['Fibre Preparation', 'Process Control', 'Yarn Consistency', 'Quality Monitoring'].map(label => <li key={label} className="border px-3 py-2 bg-white" style={{ color: palette.green }}>{label}</li>)}</ul></Container>
    <section id="PROCESS_FLOW" className="py-5 bg-white" style={anchorStyle}><Container><Label>The ring-spinning route</Label><Content item={get('PROCESS_FLOW')} /><ProcessNavigation steps={ringSteps} label="Ring-spinning process stages" /></Container></section>
    <Stage code="BLOW_ROOM" imageCode="BLOW_ROOM_PRIMARY" alt="Cotton bales and opening machinery in the blow room" item={get('BLOW_ROOM')}>{imageData.images.BLOW_ROOM_SECONDARY && <div className="mt-3"><DatabaseImage sectionCode="BLOW_ROOM_SECONDARY" altText="A second view of bale opening and cotton preparation" ratio="16 / 7" /></div>}</Stage>
    <Stage code="CARDING" alt="Carding machinery with sliver collected in cans" item={get('CARDING')} reverse white />
    <Stage code="COMBER" alt="Comber machinery processing prepared cotton laps" item={get('COMBER')} />
    <section className="py-5 bg-white"><Container><Label>Drawing and simplex</Label><Content item={get('DRAWING_SIMPLEX')} /><Row className="g-5">{[['DRAW_FRAME', 'Sliver cans feeding a draw frame'], ['SIMPLEX', 'Roving packages on the simplex frame']].map(([code, alt]) => <Col md={6} key={code}><article id={code} tabIndex={-1} style={anchorStyle}><DatabaseImage sectionCode={code} altText={alt} ratio="4 / 3" /><div className="pt-4"><Content item={get(code)} level="h3" /></div></article></Col>)}</Row></Container></section>
    <Stage code="RING_SPINNING" alt="Roving feed and yarn formation on a ring-spinning frame" item={get('RING_SPINNING')} />
    <Stage code="LINK_CONER" imageCode="LINK_CONER_PRIMARY" alt="Linked winding machines forming yarn packages" item={get('LINK_CONER')} reverse white><Row className="g-3 mt-0">{imageData.images.LINK_CONER_SECONDARY && <Col xs={imageData.images.BALE_TRANSPORT ? 6 : 12}><DatabaseImage sectionCode="LINK_CONER_SECONDARY" altText="Detail of yarn package winding equipment" ratio="4 / 3" /></Col>}{imageData.images.BALE_TRANSPORT && <Col xs={imageData.images.LINK_CONER_SECONDARY ? 6 : 12}><figure className="mb-0"><DatabaseImage sectionCode="BALE_TRANSPORT" altText="Overhead bobbin transport equipment above spinning machinery" ratio="4 / 3" /><figcaption className="small mt-2" style={{ color: palette.muted }}>Bobbin transport on the production floor</figcaption></figure></Col>}</Row></Stage>
    {imageData.images.LINK_CONER && <section className="py-4 bg-white"><Container><figure className="mb-0"><DatabaseImage sectionCode="LINK_CONER" altText="Spinning / Link Coner" ratio="16 / 7" /><figcaption className="small mt-2">Spinning / Link Coner</figcaption></figure></Container></section>}
    <Stage code="YARN_CONDITIONING" alt="Finished yarn cones arranged as packages" item={get('YARN_CONDITIONING')}><p id="FINISHED_YARN" tabIndex={-1} className="small mt-2 mb-0" style={{ ...anchorStyle, color: palette.muted }}>Finished yarn packages</p></Stage>
    <section id="OPEN_END_SPINNING" tabIndex={-1} className="py-5 text-white" style={{ ...anchorStyle, background: palette.dark }}><Container><Label light>A distinct process</Label><Content item={get('OPEN_END_SPINNING')} light /><ProcessNavigation steps={oeSteps} label="Open-End spinning process stages" light /><Row className="g-4 mt-3">{[
      ['OE_BLOW_ROOM', 'Fibre preparation', 'Cotton bales supplied to opening machinery', 'Opening and preparation provide the fibre feed for the Open-End route.'],
      ['OE_DRAW_FRAME', 'Drawing', 'Sliver cans and drafting equipment in the Open-End preparation area', 'Drawing combines and evens the sliver before yarn formation.'],
      ['OE_WINDING', 'Open-End yarn and package formation', 'Open-End spinning equipment with yarn packages and sliver cans', 'Prepared sliver feeds yarn formation and winding into packages.'],
    ].map(([code, title, alt, body]) => <Col md={4} key={code}><article id={code} tabIndex={-1} style={anchorStyle}><DatabaseImage sectionCode={code} altText={alt} ratio="4 / 3" /><div className="pt-4"><Content item={{ title: lookup[code]?.heading ?? title, body: lookup[code]?.body_content ?? body }} level="h3" light /></div></article></Col>)}</Row></Container></section>
    <section id="QUALITY_CONTROL" className="py-5 bg-white" style={anchorStyle}><Container><Label>Attention throughout the process</Label><Content item={get('QUALITY_CONTROL')} /><Row as="ul" className="list-unstyled g-3 mt-3">{['Raw-material preparation', 'Sliver evenness', 'Roving consistency', 'Yarn fault monitoring', 'Package quality', 'Process traceability — discuss requirements'].map((label, index) => <Col as="li" sm={6} lg={4} key={label}><div className="h-100 p-4 border" style={{ background: palette.ivory }}><span className="small" style={{ color: '#806024' }}>{String(index + 1).padStart(2, '0')}</span><p className="mt-2 mb-0">{label}</p></div></Col>)}</Row></Container></section>
    <section className="py-5" aria-label="Related pages"><Container><Label>Continue exploring</Label><h2 className="h2 mb-4" style={headingStyle}>Connected Expertise</h2><div className="d-flex flex-wrap gap-3">{related.map(([label, url]) => <Link key={url} to={url} className="btn" style={actionStyle}>{label} →</Link>)}</div></Container></section>
    <EnquiryBanner><Container><Row className="g-4 align-items-center"><Col lg={9}><Label light>Start a conversation</Label><Content item={enquiry} light /></Col><Col lg={3}><Link to="/lets-talk" className="btn" style={{ ...actionStyle, background: '#E8C58E', color: palette.dark }}>{enquiry.action || 'Let’s Talk'} →</Link></Col></Row></Container></EnquiryBanner>
  </main></FrameworkImageContext.Provider>
}
