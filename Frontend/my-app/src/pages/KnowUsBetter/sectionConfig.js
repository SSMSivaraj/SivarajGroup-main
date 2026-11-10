// Presentation and image slots only. Editorial copy is read from the database.
export const sectionPages = {
  TEXTILE: { title: 'Textile', category: 'Enlightenment', slug: 'textile', lists: ['RESEARCH_DEVELOPMENT','PRODUCT_PARTNERSHIP','MANUFACTURING','CUT_N_SEW','PRODUCT_PROMOTION','DISTRIBUTION'] },
  EDUCATION: { title: 'Education', category: 'Enlightenment', slug: 'education' },
  NATURAL_ENERGY: { title: 'Natural Energy', category: 'Enlightenment', slug: 'natural-energy' },
  BRANDS: { title: 'Brands', category: 'Enlightenment', slug: 'brands', lists: ['BRAND_PRODUCTS'] },
  COTTON_YARN: { title: 'Cotton Yarn', category: 'Goods', slug: 'cotton-yarn', lists: ['YARN_RANGE','YARN_CAPABILITIES','YARN_GALLERY'], tables: ['APPLICATIONS'], products: { YARN_CAPABILITIES: 12, YARN_GALLERY: 8 } },
  KNITTED_FABRICS: { title: 'Knitted Fabrics', category: 'Goods', slug: 'knitted-fabrics', lists: ['FABRIC_RANGE','KNIT_STRUCTURES'], products: { KNIT_STRUCTURES: 12 } },
  WOVEN_FABRICS: { title: 'Woven Fabrics', category: 'Goods', slug: 'woven-fabrics', lists: ['FABRIC_RANGE','WEAVE_CAPABILITIES','FABRIC_GALLERY'], products: { FABRIC_GALLERY: 14 } },
  GARMENTS: { title: 'Garments', category: 'Goods', slug: 'garments', lists: ['PRODUCT_RANGE'], products: { PRODUCT_RANGE: 8 } },
  CREDENTIALS_CERTIFICATIONS: { title: 'Certifications', category: 'Credentials', slug: 'certifications', tables: ['QUALITY_SYSTEMS'] },
  CREDENTIALS_REWARDS: { title: 'Rewards', category: 'Credentials', slug: 'rewards' },
}
// Explicit image areas in InnerPage; other database sections remain text-only.
const primaryCodes = {
  TEXTILE: ['PAGE_HERO', 'INTRODUCTION', 'MANUFACTURING', 'DISTRIBUTION'],
  EDUCATION: ['PAGE_HERO', 'INTRODUCTION', 'INSTITUTIONS', 'ENGINEERING_COLLEGE'],
  NATURAL_ENERGY: ['PAGE_HERO', 'INTRODUCTION', 'ENERGY_INITIATIVES', 'RESPONSIBLE_GROWTH'],
  BRANDS: ['PAGE_HERO', 'INTRODUCTION', 'CHENNIS_BRAND', 'BRAND_PRODUCTS'],
  COTTON_YARN: ['PAGE_HERO', 'INTRODUCTION', 'YARN_CAPABILITIES', 'APPLICATIONS'],
  KNITTED_FABRICS: ['PAGE_HERO', 'INTRODUCTION', 'FABRIC_RANGE', 'APPLICATIONS'],
  WOVEN_FABRICS: ['PAGE_HERO', 'INTRODUCTION', 'FABRIC_RANGE', 'FABRIC_GALLERY'],
  GARMENTS: ['PAGE_HERO', 'INTRODUCTION', 'PRODUCT_RANGE', 'GARMENT_APPLICATIONS'],
  CREDENTIALS_CERTIFICATIONS: ['PAGE_HERO', 'QUALITY_SYSTEMS', 'CERTIFICATION_GALLERY'],
  CREDENTIALS_REWARDS: ['PAGE_HERO', 'INTRODUCTION', 'REWARD_GALLERY'],
}
const primaryLabels = {
  TEXTILE: ['Page Hero', 'Textile Overview', 'Integrated Manufacturing', 'Textile Supply Chain'],
  EDUCATION: ['Page Hero', 'Education Overview', 'Schools and Academy', 'Engineering Institute'],
  NATURAL_ENERGY: ['Page Hero', 'Natural Energy Overview', 'Wind Energy', 'Sustainable Power'],
  BRANDS: ['Page Hero', 'Brand Overview', 'Chennis Brand', 'Brand Collection'],
  COTTON_YARN: ['Page Hero', 'Cotton Yarn Overview', 'Speciality Yarns', 'Yarn Applications'],
  KNITTED_FABRICS: ['Page Hero', 'Knitted Fabrics Overview', 'Knitted Fabric Range', 'Knitted Fabric Applications'],
  WOVEN_FABRICS: ['Page Hero', 'Woven Fabrics Overview', 'Woven Fabric Range', 'Woven Fabric Applications'],
  GARMENTS: ['Page Hero', 'Garments Overview', 'Garment Collection', 'Garment Showcase'],
  CREDENTIALS_CERTIFICATIONS: ['Page Hero', 'Quality and Testing Laboratory', 'Certification Showcase'],
  CREDENTIALS_REWARDS: ['Page Hero', 'Awards Overview', 'Rewards and Achievements'],
}
export const primaryImagePositions = Object.fromEntries(Object.entries(primaryCodes).map(([pageCode, codes]) => [pageCode, Object.fromEntries(codes.map((sectionCode, index) => [sectionCode, {
  group: sectionPages[pageCode].category, pageLabel: sectionPages[pageCode].title,
  pageCode, sectionCode, label: primaryLabels[pageCode][index], displayOrder: index + 1,
  altPlaceholder: `Describe the approved ${primaryLabels[pageCode][index].toLowerCase()} photograph for ${sectionPages[pageCode].title}`,
}]))]))
export const sectionImageSlots = Object.fromEntries(Object.entries(primaryImagePositions).map(([page, positions]) => [page, [
  ...Object.keys(positions),
  ...Object.entries(sectionPages[page].products || {}).flatMap(([code,count]) => Array.from({length:count},(_,index) => code+'_'+String(index+1).padStart(2,'0'))),
  ...(page === 'CREDENTIALS_CERTIFICATIONS' ? ['CERTIFICATE_PRIMARY','CERTIFICATE_SECONDARY','CERTIFICATE_TERTIARY'] : []),
]]))
