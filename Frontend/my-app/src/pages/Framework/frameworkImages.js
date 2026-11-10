// Shared placement names keep the public layouts and protected uploader in sync.
export const frameworkImageSections = {
  SPINNING: ['PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'BLOW_ROOM_PRIMARY', 'BLOW_ROOM_SECONDARY', 'CARDING', 'COMBER', 'DRAW_FRAME', 'SIMPLEX', 'RING_SPINNING', 'LINK_CONER_PRIMARY', 'LINK_CONER_SECONDARY', 'BALE_TRANSPORT', 'LINK_CONER', 'YARN_CONDITIONING', 'OE_BLOW_ROOM', 'OE_DRAW_FRAME', 'OE_WINDING'],
  KNITTING: ['PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'KNITTING_FLOOR', 'TECHNOLOGY', 'QUALITY_CONTROL', 'PRODUCT_CAPABILITY'],
  WEAVING: ['PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'WARPING', 'SIZING', 'DRAWING_IN', 'LOOM_WEAVING', 'INSPECTION_PRIMARY', 'INSPECTION_SECONDARY', 'PACKING'],
  GARMENTING: ['PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'FABRIC_STORE', 'FABRIC_INSPECTION', 'CUTTING', 'CUT_PANEL_CHECKING', 'SEWING_UNIT_ONE', 'SEWING_UNIT_TWO', 'IRONING_FINISHING', 'PACKING', 'QUALITY_CONTROL'],
  HOME_TEXTILES: ['PAGE_HERO_1', 'PAGE_HERO_2', 'INTRODUCTION', 'BED_LINEN', 'KITCHEN_DINING', 'DESIGN_AND_FINISHING', 'QUALITY'],
}
const names = {
  PAGE_HERO_1: 'Page Hero - Primary (75%)', PAGE_HERO_2: 'Page Hero - Secondary (25%)', PAGE_HERO: 'Main banner', INTRODUCTION: 'Introduction', KNITTING_FLOOR: 'Knitting floor', TECHNOLOGY: 'Technology',
  QUALITY_CONTROL: 'Quality control', PRODUCT_CAPABILITY: 'Fabric capabilities', ENQUIRY_BANNER: 'Enquiry banner',
  WARPING: 'Warping', SIZING: 'Sizing', DRAWING_IN: 'Drawing-in', LOOM_WEAVING: 'Loom weaving',
  INSPECTION_PRIMARY: 'Inspection · first view', INSPECTION_SECONDARY: 'Inspection · second view', PACKING: 'Packing',
  FABRIC_STORE: 'Fabric store', FABRIC_INSPECTION: 'Fabric inspection', CUTTING: 'Cutting', CUT_PANEL_CHECKING: 'Cut panel checking',
  SEWING_UNIT_ONE: 'Sewing · first view', SEWING_UNIT_TWO: 'Sewing · second view', IRONING_FINISHING: 'Ironing and finishing',
  BED_LINEN: 'Bed linen', KITCHEN_DINING: 'Kitchen and dining', PRODUCT_CAPABILITIES: 'Product collection', MATERIALS: 'Materials',
  DESIGN_AND_FINISHING: 'Design and finishing', QUALITY: 'Quality',
}
export const imageSectionLabel = code => names[code] || code.replaceAll('_', ' ').toLowerCase()
export const frameworkPageLabel = code => code === 'HOME_TEXTILES' ? 'Home Textiles' : code.charAt(0) + code.slice(1).toLowerCase()
// Reuse existing stage codes instead of introducing conflicting Framework prefixes.
export const imagePositions = {
  WELCOME_WAY: {
    HEADER_GRAPHICS: { label: 'Graphics Clip', displayOrder: 0, altPlaceholder: 'Describe the graphic, for example: Cotton farming to finished baby wear' },
  },
  SPINNING: {
    LINK_CONER: { label: 'Spinning / Link Coner', displayOrder: 3 },
    BALE_TRANSPORT: { label: 'Bobbin Transport on the Production Floor', displayOrder: 11 },
  },
  CSR: {
    RAIN_WATER_HARVESTING: { label: 'Environmental Responsibility — Rain Water Harvesting', displayOrder: 5 },
    WIND_MILL: { label: 'Environmental Responsibility — Wind Mill', displayOrder: 6 },
    TREE_PLANTATION: { label: 'Environmental Responsibility — Tree Plantation', displayOrder: 7 },
    CSR_GALLERY_PRIMARY: { label: 'Community Support', displayOrder: 7 },
    CSR_GALLERY_SECONDARY: { label: 'A Closer Look — Saplings and Green Cover', displayOrder: 8 },
    EDUCATION: { label: 'Education / A Closer Look — SSM School (shared image)', displayOrder: 4 },
  },
  WEAVING: { QUALITY_CONTROL: { label: '05 / Weaving', displayOrder: 2 } },
}
export const imagePositionLabel = (page, section) => imagePositions[page]?.[section]?.label || section.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
export const homeTextileUploadHints = {
  BED_LINEN: { filename: 'Home Textile1.jpeg', alt: 'Colourful layered bedding and cushions on a white bed', note: 'Use the supplied bedding photograph. A landscape crop works best.' },
  KITCHEN_DINING: { filename: 'Kitchen.webp', alt: 'Floral table runner on a wooden dining table with chairs and tableware', note: 'Use the supplied table-runner photograph. The portrait composition is preserved.' },
}

export const frameworkImagePositions = Object.fromEntries(Object.entries(frameworkImageSections).map(([pageCode,codes]) => [pageCode,Object.fromEntries(codes.map((sectionCode,index) => [sectionCode,{ group:'Framework', pageLabel:frameworkPageLabel(pageCode), pageCode, sectionCode, label:imageSectionLabel(sectionCode), intendedPosition:sectionCode, displayOrder:index+1 }]))]))
