import FrameworkPage from '../Framework/FrameworkPage.jsx'

const stages = [
  { code: 'BED_LINEN', title: 'Bed Linen', fit: 'contain' },
  { code: 'KITCHEN_DINING', title: 'Kitchen and Dining', fit: 'contain' },
  { code: 'DESIGN_AND_FINISHING', title: 'Considered Design and Finishing' },
  { code: 'QUALITY', title: 'Quality Around Your Requirements' },
]
// Existing static fallback copy remains available; database content overrides it.
// The supplied photo descriptions do not assert company production capabilities.
const fallbackContent = {
  PAGE_HERO: { body_content: 'A closer look at colour, texture and the details that bring a room together.' },
  INTRODUCTION: { heading: 'Considered Details for Everyday Living', body_content: 'Discuss home-textile requirements with our team and explore approved materials, construction and finishing options.' },
  BED_LINEN: { heading: 'Colour, Layers and Comfort', body_content: 'Bedding inspiration: colourful layered covers and patterned cushions, arranged on a white bed.' },
  KITCHEN_DINING: { heading: 'A Place to Gather', body_content: 'Dining inspiration: a floral table runner, natural wood and simple tableware.' },
  DESIGN_AND_FINISHING: { heading: 'Considered Design and Finishing', body_content: 'Share your design and finishing requirements to explore suitable options.' },
  QUALITY: { heading: 'Quality Around Your Requirements', body_content: 'Speak with our team about specifications and quality expectations.' },
}

export default function HomeTextilesPage() {
  return <FrameworkPage pageCode="HOME_TEXTILES" title="Home Textiles" stages={stages} fallbackContent={fallbackContent} />
}
