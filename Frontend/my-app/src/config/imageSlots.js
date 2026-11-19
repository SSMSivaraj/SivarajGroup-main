import { welcomeWayImagePositions } from '../pages/WelcomeWayPage/welcomeWayImages.js'
// Public layout positions only. Admin derives its options from this same registry.
// No credentials, API permissions, or database connection details belong here.
import { frameworkImageSections, frameworkImagePositions, imagePositions, imagePositionLabel } from '../pages/Framework/frameworkImages.js'
import { primaryImagePositions, sectionImageSlots, sectionPages } from '../pages/KnowUsBetter/sectionConfig.js'
import { knowUsBetterImageSections } from '../pages/KnowUsBetter/knowUsBetterImages.js'

const codes = {
  ...sectionImageSlots,
  ...frameworkImageSections,
  ...knowUsBetterImageSections,
  WELCOME_WAY: welcomeWayImagePositions.map(slot => slot.sectionCode),
}
const publicLabels = {
  GLOBAL_PRESENCE: { GLOBAL_INTRODUCTION:'India to the World', INDIA_PRESENCE:'Renowned Business House' },
}
export const imageSlots = Object.fromEntries(Object.entries(codes).map(([pageCode, sections]) => [pageCode, sections.map((sectionCode,index) => {
  const existing = (pageCode === 'WELCOME_WAY' ? welcomeWayImagePositions.find(slot => slot.sectionCode === sectionCode) : undefined) || primaryImagePositions[pageCode]?.[sectionCode] || imagePositions[pageCode]?.[sectionCode] || frameworkImagePositions[pageCode]?.[sectionCode]
  const label = publicLabels[pageCode]?.[sectionCode] || existing?.label || imagePositionLabel(pageCode, sectionCode)
  return {
    ...existing,
    group: sectionPages[pageCode]?.category || (frameworkImageSections[pageCode] ? 'Framework' : knowUsBetterImageSections[pageCode] ? 'Know Us Better' : 'Other Pages'),
    pageLabel: sectionPages[pageCode]?.title || imagePositionLabel('', pageCode),
    pageCode, sectionCode, label, adminLabel:label,
    publicPurpose:label, intendedPosition:sectionCode,
    displayOrder:existing?.displayOrder ?? index + 1, isUploadable:true,
  }
})]))
export const imageSlot = (pageCode, sectionCode) => imageSlots[pageCode]?.find(slot => slot.sectionCode === sectionCode)
export const publicImagePositions = Object.values(imageSlots).flat()
