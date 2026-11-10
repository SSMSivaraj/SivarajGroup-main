import { imageSlots, imageSlot } from '../../config/imageSlots.js'

export const standardSections = ['PAGE_HERO', 'INTRODUCTION']
export const pageSections = Object.fromEntries(Object.entries(imageSlots).map(([page, slots]) => [page, slots.filter(slot => slot.isUploadable).map(slot => slot.sectionCode)]))
export const position = imageSlot
export const positionLabel = (page, section) => position(page, section)?.adminLabel || section
export const adminImagePositions = Object.entries(pageSections).flatMap(([page, sections]) => sections.map(section => position(page, section)))
export const adminFrameworkPositions = adminImagePositions.filter(slot => slot.group === 'Framework')
