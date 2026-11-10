import fs from 'node:fs'
import assert from 'node:assert/strict'
import { createRequire, registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { frameworkImageSections } from '../Frontend/my-app/src/pages/Framework/frameworkImages.js'
import { publicImagePositions } from '../Frontend/my-app/src/config/imageSlots.js'
import { adminFrameworkPositions } from '../Frontend/my-app/src/pages/AdminPage/imageConfiguration.js'
import { validateImagePositions } from '../Frontend/my-app/src/pages/Framework/validateImagePositions.js'

const publicPositions = publicImagePositions.filter(position => position.group === 'Framework')
assert.deepEqual(validateImagePositions(publicPositions, adminFrameworkPositions), [])
const sample = publicPositions[0]
assert.ok(validateImagePositions([sample], []).some(issue => issue.includes('Missing from Admin')))
assert.ok(validateImagePositions([], [sample]).some(issue => issue.includes('Unused Admin')))
assert.ok(validateImagePositions([sample, sample], [sample]).some(issue => issue.includes('duplicate')))
for (const field of ['label', 'displayOrder', 'group', 'pageLabel', 'intendedPosition']) {
  assert.ok(validateImagePositions([sample], [{ ...sample, [field]: 'wrong' }]).some(issue => issue.includes(`${field} mismatch`)))
}
assert.ok(validateImagePositions([sample], []).some(issue => issue.includes('Image count mismatch')))

const root = new URL('../Frontend/my-app/', import.meta.url)
const require = createRequire(new URL('package.json', root))
const { transformSync } = await import(pathToFileURL(require.resolve('rolldown/utils')))
const fixture = JSON.parse(fs.readFileSync(new URL('completed-content-reference.json', import.meta.url)))
registerHooks({ load(url, context, next) {
  if (url.endsWith('.module.css')) return { format:'module', source:'export default new Proxy({}, {get:(_,key)=>key})', shortCircuit:true }
  if (/\.(png|jpeg)$/.test(url)) return { format:'module', source:`export default ${JSON.stringify(url)}`, shortCircuit:true }
  if (url.endsWith('/useWebsitePage.js')) return { format:'module', source:`
    const fixture=${JSON.stringify(fixture)},positions=${JSON.stringify(frameworkImageSections)};
    export const imageUrl=(page,code)=>'/api/website/page-images/'+page+'/'+code;
    export const safeUrl=url=>typeof url==='string'&&url.startsWith('/');
    export function useWebsitePage(page) {
      const rows=fixture[page]||[];
      const images=globalThis.missingImages?{}:Object.fromEntries((positions[page]||[]).map(code=>[code,{alt_text:code,updated_at:'v1'}]));
      return {page,rows,loading:false,images,lookup:Object.fromEntries(rows.map(row=>[row.section_code,row])),get:code=>rows.find(row=>row.section_code===code)};
    }
  `, shortCircuit:true }
  if (url.startsWith(new URL('src/', root).href) && /\.(jsx|js)$/.test(url)) {
    const source = fs.readFileSync(fileURLToPath(url),'utf8').replaceAll('import.meta.env','({})')
    const result = transformSync(fileURLToPath(url), source, { lang:url.endsWith('.jsx')?'jsx':'js', jsx:{runtime:'automatic'} })
    assert.equal(result.errors.length, 0)
    return { format:'module', source:result.code, shortCircuit:true }
  }
  return next(url,context)
} })
const { createElement:h } = require('react')
const { renderToStaticMarkup:render } = require('react-dom/server')
const { MemoryRouter } = require('react-router-dom')
const { default:App } = await import(new URL('src/App.jsx', root))
for (const missing of [false,true]) {
  globalThis.missingImages = missing
  for (const [page, codes] of Object.entries(frameworkImageSections)) {
    const path = '/framework/' + page.toLowerCase().replaceAll('_','-')
    const html = render(h(MemoryRouter,{initialEntries:[path]},h(App)))
    const actual = [...html.matchAll(/data-image-position="([A-Z0-9_]+)"/g)].map(match=>match[1])
    assert.equal(new Set(actual).size, actual.length, `${page}: duplicate visible image containers`)
    assert.deepEqual([...actual].sort(), (missing ? ['PAGE_HERO_1','PAGE_HERO_2'] : [...codes]).sort(), `${page}: actual rendered positions must equal Admin when available; missing optional photos leave no cards`)
    assert.equal((html.match(/<h1\b/g)||[]).length,1)
    assert.ok(html.includes('aria-label="Framework pages"'))
    for (const match of html.matchAll(/href="#([A-Z0-9_]+)"/g)) assert.ok(html.includes(`id="${match[1]}"`), `Missing navigation target ${match[1]}`)
    if (page==='HOME_TEXTILES') for (const removed of ['Explore Home Textile Requirements','Begin With the Right Material','PRODUCT_CAPABILITIES','MATERIALS']) assert.ok(!html.includes(removed))
    console.log(`PASS ${page}: ${actual.length} public/Admin positions; images ${missing?'missing':'available'}`)
  }
}
console.log('PASS contract validation detects missing, unused, duplicate, label, order and count mismatches')
