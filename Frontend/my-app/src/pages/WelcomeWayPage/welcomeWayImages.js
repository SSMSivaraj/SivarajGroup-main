const mdImage = new URL('../../assets/slideshow/md-placeholder.png', import.meta.url).href
const leadershipImage = new URL('../../assets/slideshow/leadership.jpeg', import.meta.url).href
const cottonImage = new URL('../../assets/slideshow/cotton.png', import.meta.url).href
const spinningImage = new URL('../../assets/slideshow/spinning-oe.png', import.meta.url).href
const weavingImage = new URL('../../assets/slideshow/weaving.png', import.meta.url).href
const knittingImage = new URL('../../assets/slideshow/knitting.png', import.meta.url).href
const garmentsImage = new URL('../../assets/slideshow/garments-pos.png', import.meta.url).href
const homeTextilesImage = new URL('../../assets/slideshow/home-textiles.png', import.meta.url).href

export const welcomeWaySlides = [
  { sectionCode: 'HERO_LEADERSHIP', label: 'Hero slide 1 - Leadership', image: leadershipImage, eyebrow: 'Leadership', title: 'A vision woven into every possibility.', description: 'Guiding Sivaraj Group with purpose, progress and enduring values.', position: 'right center', fit: 'contain' },
  { sectionCode: 'HERO_COTTON', label: 'Hero slide 2 - Cotton', image: cottonImage, eyebrow: 'Cotton', title: 'Rooted in nature. Refined by expertise.', description: 'Responsible fibre is where our journey begins.', position: 'center' },
  { sectionCode: 'HERO_SPINNING_OE', label: 'Hero slide 3 - Spinning & OE', image: spinningImage, eyebrow: 'Spinning & OE', title: 'Precision in every strand.', description: 'Advanced spinning technology engineered for consistent quality.', position: 'center' },
  { sectionCode: 'HERO_WEAVING', label: 'Hero slide 4 - Weaving', image: weavingImage, eyebrow: 'Weaving', title: 'Crafting strength into every weave.', description: 'Modern looms bring performance and possibility together.', position: 'center' },
  { sectionCode: 'HERO_KNITTING', label: 'Hero slide 5 - Knitting', image: knittingImage, eyebrow: 'Knitting', title: 'Innovation shaped for comfort.', description: 'Fine knitted fabrics made with care, speed and precision.', position: 'center' },
  { sectionCode: 'FABRIC_ROLLS', label: 'Fabric Rolls (hero slide 6 - Our Fabrics)', image: mdImage, eyebrow: 'Our Fabrics', title: 'Colour, quality and possibilities.', description: 'Discover the textile expertise of Sivaraj Group.', position: 'center' },
  { sectionCode: 'HERO_GARMENTS_POS', label: 'Hero slide 7 - Garments & POS', image: garmentsImage, eyebrow: 'Garments & POS', title: 'From thoughtful design to the marketplace.', description: 'Contemporary apparel and retail solutions created to connect.', position: 'center' },
  { sectionCode: 'HERO_HOME_TEXTILES', label: 'Hero slide 8 - Home Textiles', image: homeTextilesImage, eyebrow: 'Home Textiles', title: 'Comfort, beautifully woven.', description: 'Elevated home collections with natural texture and timeless appeal.', position: 'center' },
]

export const welcomeWayHeaderPosition = {
  pageCode: 'WELCOME_WAY', sectionCode: 'HEADER_GRAPHICS',
  label: 'Graphics Clip (header above carousel)', displayOrder: 1,
  altPlaceholder: 'Describe the graphic, for example: Cotton farming to finished baby wear',
  isUploadable: true,
}
export const welcomeWayImagePositions = [
  welcomeWayHeaderPosition,
  ...welcomeWaySlides.map((slide, index) => ({
    pageCode: 'WELCOME_WAY', sectionCode: slide.sectionCode, label: `Welcome Way ? Slide ${String(index + 1).padStart(2, '0')}`,
    displayOrder: index + 1, isUploadable: true, fallbackSource: slide.image,
  })),
]
export function welcomeWayImageUrl(sectionCode) {
  const base = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
  return `${base}/api/website/page-images/WELCOME_WAY/${sectionCode}`
}
