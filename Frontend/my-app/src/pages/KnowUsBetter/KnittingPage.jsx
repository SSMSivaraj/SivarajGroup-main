import FrameworkPage from '../Framework/FrameworkPage.jsx'

const stages = [
  {
    "code": "KNITTING_FLOOR",
    "title": "The Knitting Floor"
  },
  {
    "code": "PRODUCT_CAPABILITY",
    "title": "Fabric Capabilities"
  },
  {
    "code": "TECHNOLOGY",
    "title": "Knitting Technology"
  },
  {
    "code": "QUALITY_CONTROL",
    "title": "Quality"
  }
]

export default function KnittingPage() {
  return <FrameworkPage pageCode="KNITTING" title="Knitting" stages={stages} />
}
