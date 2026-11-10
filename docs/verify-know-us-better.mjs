// Read-only rendering/content checks. No database writes, server or browser required.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const app = new URL('../Frontend/my-app/', import.meta.url)
const require = createRequire(new URL('package.json', app))
const { transformSync } = await import(pathToFileURL(require.resolve('rolldown/utils')))
registerHooks({
  load(url, context, next) {
    if (url.endsWith('.module.css')) return { format: 'module', source: 'export default new Proxy({}, { get: (_, key) => key })', shortCircuit: true }
    if (/\.(jpeg|png)$/.test(url)) return { format: 'module', source: `export default ${JSON.stringify(url)}`, shortCircuit: true }
    if (url.startsWith(new URL('src/', app).href) && /\.(jsx|js)$/.test(url)) {
      const source = fs.readFileSync(fileURLToPath(url), 'utf8').replaceAll('import.meta.env', '({})')
      const result = transformSync(fileURLToPath(url), source, { lang: url.endsWith('.jsx') ? 'jsx' : 'js', jsx: { runtime: 'automatic' } })
      assert.equal(result.errors.length, 0, JSON.stringify(result.errors))
      return { format: 'module', source: result.code, shortCircuit: true }
    }
    return next(url, context)
  },
})
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { MemoryRouter } = require('react-router-dom')
const reference = JSON.parse(fs.readFileSync(new URL('./know-us-better-reference/verified-content.json', import.meta.url)))
const folder = new URL('src/pages/KnowUsBetter/', app)
const normalise = text => text.replace(/<[^>]*>/g, ' ').replace(/&#x([a-f\d]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/\s+/g, ' ').trim()
for (const [file, source, slug] of [
  ['CompanyProfilePage', reference.company, 'company-profile'],
  ['ManagementTeamPage', reference.management, 'management-team'],
  ['CSRPage', reference.csr, 'csr'],
  ['GlobalPresencePage', [{ body_content: reference.global }], 'global-presence'],
]) {
  const { default: Page } = await import(new URL(`${file}.jsx`, folder))
  const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/know-us-better/${slug}`] }, createElement(Page)))
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: exactly one h1`)
  const text = normalise(html)
  for (const item of source) for (const paragraph of (item.body_content || '').split('\n\n').filter(Boolean)) {
    assert.ok(text.includes(normalise(paragraph)), `${file}: missing source paragraph: ${paragraph.slice(0, 80)}`)
  }
  if (file === 'ManagementTeamPage') {
    for (const person of reference.management.slice(1)) {
      assert.ok(text.includes(person.heading), person.heading)
      assert.ok(text.includes(person.subheading), person.subheading)
    }
    assert.match(html, /leadership\.jpeg/)
    assert.match(html, /fetchPriority="high"/)
  }
  if (file === 'GlobalPresencePage') {
    for (const market of reference.markets) assert.ok(text.includes(market.name), market.name)
    assert.match(html, /href="\/enlightenment\/brands"/)
  }
  console.log(`PASS ${slug}: source paragraphs retained, one h1, render succeeds`)
}
const { Content } = await import(new URL('KnowUsBetterShared.jsx', folder))
const output = normalise(renderToStaticMarkup(createElement(Content, { item: { heading: 'Database update', body_content: 'Existing approved database text' }, source: reference.management[1] })))
assert.ok(output.includes('Existing approved database text'))
assert.ok(output.includes(reference.management[1].heading))
assert.ok(output.includes(reference.management[1].subheading))
assert.ok(output.includes(normalise(reference.management[1].body_content)))
console.log('PASS database override retains original profile facts and designation')
const { knowUsBetterImageSections } = await import(new URL('knowUsBetterImages.js', folder))
assert.deepEqual(Object.values(knowUsBetterImageSections).map(sections => sections.length), [7, 5, 11, 6])
for (const name of ['CSR/csr-sapling-care', 'GlobalPresence/global-textile-logistics', 'GlobalPresence/global-textile-capabilities']) {
  const image = new URL(`../WebsiteImageSource/KnowUsBetter/${name}.jpg`, import.meta.url)
  assert.ok(fs.statSync(image).size < 614400, name)
}
console.log('PASS requested Admin slots and three JPEG upload limits')
