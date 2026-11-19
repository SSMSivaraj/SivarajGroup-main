import heroStyles from '../../Components/PageHero/PageHero.module.css'
import { Carousel } from 'react-bootstrap'
import { welcomeWaySlides as slides, welcomeWayImageUrl } from './welcomeWayImages.js'

export default function WelcomeWayPage() {
  return (
    <main className="bg-dark">
      <Carousel fade interval={5000} pause="hover" touch keyboard aria-label="Sivaraj Group highlights">
        {slides.map((slide, index) => (
          <Carousel.Item key={slide.eyebrow}>
            <div style={{ height: 'clamp(480px, calc(100vh - 74px), 760px)', position: 'relative', overflow: 'hidden' }}>
              <img
                data-image-page="WELCOME_WAY"
                data-image-position={slide.sectionCode}
                src={welcomeWayImageUrl(slide.sectionCode)}
                onError={(event) => {
                  if (event.currentTarget.getAttribute('src') !== slide.image) event.currentTarget.src = slide.image
                }}
                alt={`${slide.eyebrow} at Sivaraj Group`}
                className="d-block w-100 h-100"
                style={{ objectFit: slide.fit || 'cover', objectPosition: slide.position, backgroundColor: slide.fit === 'contain' ? '#fff' : undefined }}
              />
              <div aria-hidden="true" className={heroStyles.tint} />
            </div>
            <Carousel.Caption className="text-start start-0 end-0 h-100 bottom-0 p-0" style={{ zIndex: 2 }}>
              <div className="container-xl h-100 d-flex align-items-center px-4 px-xl-2">
                <div style={{ maxWidth: 650, paddingBottom: 25 }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span style={{ width: 38, height: 1, background: '#B88A3B' }} />
                    <span className="text-uppercase fw-semibold" style={{ color: '#D8AE65', letterSpacing: '.16em', fontSize: 12 }}>{slide.eyebrow}</span>
                  </div>
                  <h1 className="display-3 fw-normal mb-3" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.08, textShadow: '0 2px 18px rgba(0,0,0,.2)' }}>{slide.title}</h1>
                  <p className="fs-5 mb-4" style={{ maxWidth: 570, color: 'rgba(255,255,255,.82)' }}>{slide.description}</p>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-semibold" style={{ color: '#D8AE65' }}>{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ width: 54, height: 1, background: 'rgba(255,255,255,.5)' }} />
                    <span style={{ color: 'rgba(255,255,255,.65)' }}>{String(slides.length).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </main>
  )
}
