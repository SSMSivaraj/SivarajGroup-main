// Pure development/test check; no debug output is rendered in the public UI.
export function validateImagePositions(publicPositions, adminPositions) {
  const issues = []
  const key = position => `${position.pageCode}/${position.sectionCode}`
  const index = (positions, side) => {
    const result = new Map()
    const orders = new Set()
    for (const position of positions) {
      if (result.has(key(position))) issues.push(`${side}: duplicate ${key(position)}`)
      const orderKey = `${position.pageCode}/${position.displayOrder}`
      if (orders.has(orderKey)) issues.push(`${side}: duplicate display order ${orderKey}`)
      orders.add(orderKey)
      result.set(key(position), position)
    }
    return result
  }
  const publicIndex = index(publicPositions, 'Public')
  const adminIndex = index(adminPositions, 'Admin')
  for (const [code, position] of publicIndex) {
    const other = adminIndex.get(code)
    if (!other) { issues.push(`Missing from Admin: ${code}`); continue }
    for (const field of ['group', 'pageLabel', 'label', 'adminLabel', 'publicPurpose', 'intendedPosition', 'displayOrder', 'isUploadable']) {
      if (position[field] !== other[field]) issues.push(`${field} mismatch: ${code}`)
    }
  }
  for (const code of adminIndex.keys()) if (!publicIndex.has(code)) issues.push(`Unused Admin option: ${code}`)
  const pages = new Set([...publicPositions, ...adminPositions].map(position => position.pageCode))
  for (const page of pages) {
    if (publicPositions.filter(position => position.pageCode === page).length !== adminPositions.filter(position => position.pageCode === page).length) issues.push(`Image count mismatch: ${page}`)
  }
  return issues
}
