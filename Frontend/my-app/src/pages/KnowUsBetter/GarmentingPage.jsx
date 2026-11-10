import FrameworkPage from '../Framework/FrameworkPage.jsx'

const stages = [
  {
    "code": "FABRIC_STORE",
    "title": "Fabric Store"
  },
  {
    "code": "FABRIC_INSPECTION",
    "title": "Fabric Inspection"
  },
  {
    "code": "CUTTING",
    "title": "Cutting"
  },
  {
    "code": "CUT_PANEL_CHECKING",
    "title": "Cut Panel Checking"
  },
  {
    "code": "SEWING",
    "title": "Sewing",
    "images": [
      "SEWING_UNIT_ONE",
      "SEWING_UNIT_TWO"
    ]
  },
  {
    "code": "IRONING_FINISHING",
    "title": "Ironing and Finishing"
  },
  {
    "code": "PACKING",
    "title": "Packing"
  },
  {
    "code": "QUALITY_CONTROL",
    "title": "Quality"
  },
  {
    "code": "MENS_APPAREL",
    "title": "Men’s Apparel"
  },
  {
    "code": "UNDER_GARMENTS",
    "title": "Under Garments and Casualwear"
  },
  {
    "code": "TRADITIONAL_WEAR",
    "title": "Traditional and Party Wear"
  }
]

export default function GarmentingPage() {
  return <FrameworkPage pageCode="GARMENTING" title="Garmenting" stages={stages} />
}
