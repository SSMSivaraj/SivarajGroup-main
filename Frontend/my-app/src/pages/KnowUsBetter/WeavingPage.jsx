import FrameworkPage from '../Framework/FrameworkPage.jsx'

const stages = [
  {
    "code": "WARPING",
    "title": "Warping"
  },
  {
    "code": "SIZING",
    "title": "Sizing"
  },
  {
    "code": "DRAWING_IN",
    "title": "Drawing-in"
  },
  {
    "code": "LOOM_WEAVING",
    "title": "Loom Weaving"
  },
  {
    "code": "QUALITY_CONTROL",
    "title": "Inspection",
    "images": [
      "INSPECTION_PRIMARY",
      "INSPECTION_SECONDARY"
    ]
  },
  {
    "code": "PACKING",
    "title": "Packing"
  }
]

export default function WeavingPage() {
  return <FrameworkPage pageCode="WEAVING" title="Weaving" stages={stages} />
}
