// Read-only route/content rendering checks; no browser or database writes.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { primaryImagePositions } from '../Frontend/my-app/src/pages/KnowUsBetter/sectionConfig.js'
const root = new URL('../Frontend/my-app/',import.meta.url)
const require = createRequire(new URL('package.json',root))
const { transformSync } = await import(pathToFileURL(require.resolve('rolldown/utils')))
const reference = JSON.parse(fs.readFileSync(new URL('completed-content-reference.json',import.meta.url)))
registerHooks({load(url,context,next) {
  if(url.endsWith('.module.css')) return {format:'module',source:'export default new Proxy({}, {get:(_,key)=>key})',shortCircuit:true}
  if(/\.(png|jpeg)$/.test(url)) return {format:'module',source:`export default ${JSON.stringify(url)}`,shortCircuit:true}
  if(url.endsWith('/useWebsitePage.js')) return {format:'module',source:`
    const fixture=${JSON.stringify(reference)};
    const positions=${JSON.stringify(primaryImagePositions)};
    export const imageUrl=(page,code)=>'/api/website/page-images/'+page+'/'+code;
    export const safeUrl=url=>typeof url==='string'&&/^(\\/(?!\\/)|https?:\\/\\/)/.test(url);
    export function useWebsitePage(page) { const rows=fixture[page]||[];return {page,rows,loading:false,images:globalThis.testMissingImages ? {} : Object.fromEntries(Object.keys(positions[page] || {PAGE_HERO:{}}).map(code=>[code,{alt_text:code}])),lookup:Object.fromEntries(rows.map(row=>[row.section_code,row]))} }
  `,shortCircuit:true}
  if(url.startsWith(new URL('src/',root).href)&&/\.(jsx|js)$/.test(url)) {
    const source=fs.readFileSync(fileURLToPath(url),'utf8').replaceAll('import.meta.env','({})')
    const result=transformSync(fileURLToPath(url),source,{lang:url.endsWith('.jsx')?'jsx':'js',jsx:{runtime:'automatic'}})
    assert.equal(result.errors.length,0)
    return {format:'module',source:result.code,shortCircuit:true}
  }
  return next(url,context)
}})
const {createElement:h}=require('react')
const {renderToStaticMarkup:render}=require('react-dom/server')
const {MemoryRouter}=require('react-router-dom')
const {default:App}=await import(new URL('src/App.jsx',root))
const {sectionPages,sectionImageSlots}=await import(new URL('src/pages/KnowUsBetter/sectionConfig.js',root))
const clean=text=>text.replace(/<[^>]*>/g,' ').replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&gt;','>').replaceAll('&lt;','<').replace(/\s+/g,' ').trim()
for(const [code,page] of Object.entries(sectionPages)) {
  const route=`/${page.category.toLowerCase()}/${page.slug}`
  const html=render(h(MemoryRouter,{initialEntries:[route]},h(App)))
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route)
  assert.ok(html.includes(`/api/website/page-images/${code}/PAGE_HERO`),route+' database hero')
  assert.ok(html.includes('fetchPriority="high"')&&html.includes('loading="eager"'))
  for(const row of reference[code]) {
    if(row.section_code==='PAGE_HERO') continue
    assert.ok(clean(html).includes(clean(row.heading)),route+' '+row.heading)
    for(const line of row.body_content.split('\n').filter(Boolean)) {
      if(page.tables?.includes(row.section_code)&&line.includes(' — ')) {
        for(const cell of line.split(' — ')) assert.ok(clean(html).includes(clean(cell)),route+' '+cell)
      } else if(page.tables?.includes(row.section_code)&&line.includes(': ')) {
        for(const cell of line.split(': ')) assert.ok(clean(html).includes(clean(cell)),route+' '+cell)
      } else assert.ok(clean(html).includes(clean(line)),route+' '+line)
    }
  }
  assert.ok(html.includes(`${page.category} pages`))
  for(const section of Object.keys(primaryImagePositions[code])) assert.ok(html.includes(`/api/website/page-images/${code}/${section}`), `${code}/${section} public image binding`)
  for(const handle of ['@sivarajspinningmills','@chennis_mensclothing']) assert.ok(html.includes(handle))
  assert.ok(html.includes('target="_blank" rel="noopener noreferrer" aria-label="Visit Sivaraj Spinning Mills on Facebook"'))
  assert.ok(html.includes('target="_blank" rel="noopener noreferrer" aria-label="Visit Chennis Mens Clothing on Instagram"'))
  globalThis.testMissingImages = true
  const missing = render(h(MemoryRouter,{initialEntries:[route]},h(App)))
  assert.ok(!missing.includes(`/api/website/page-images/${code}/`), route+' no stale image URLs after deletion')
  assert.ok(missing.includes('Photograph coming soon'), route+' neutral fallback')
  for(const row of reference[code]) if(row.section_code !== 'PAGE_HERO') assert.ok(clean(missing).includes(clean(row.heading)), route+' text survives deletion')
  globalThis.testMissingImages = false
  console.log('PASS',route,'one h1, database hero, all retained content, related navigation')
}
for(const route of ['/framework/spinning','/framework/weaving','/framework/knitting','/framework/garmenting','/framework/home-textiles']) {
  const html=render(h(MemoryRouter,{initialEntries:[route]},h(App)))
  assert.equal((html.match(/<h1\b/g)||[]).length,1,route)
  if(route.endsWith('spinning')) assert.ok(!html.includes('photograph temporarily unavailable'))
  console.log('PASS existing route',route)
}
const {imagePositions,frameworkImageSections}=await import(new URL('src/pages/Framework/frameworkImages.js',root))
assert.equal(imagePositions.SPINNING.LINK_CONER.label,'Spinning / Link Coner')
assert.equal(imagePositions.SPINNING.LINK_CONER.displayOrder,3)
assert.equal(imagePositions.WEAVING.QUALITY_CONTROL.label,'05 / Weaving')
assert.equal(imagePositions.WEAVING.QUALITY_CONTROL.displayOrder,2)
assert.ok(!frameworkImageSections.WEAVING.includes('QUALITY_CONTROL'))
const admin=fs.readFileSync(new URL('src/pages/AdminPage/AdminPages.jsx',root),'utf8')
assert.ok(['LINK_CONER_PRIMARY', 'LINK_CONER_SECONDARY', 'LINK_CONER'].every(code => frameworkImageSections.SPINNING.includes(code)))
assert.ok(admin.includes('value={code}>{positionLabel(page, code)}'))
for(const route of ['/admin/login','/admin/website-images']) {
  const html=render(h(MemoryRouter,{initialEntries:[route]},h(App)))
  assert.ok(!html.includes('<footer') && !html.includes('@sivarajspinningmills'), route+' isolated Admin layout')
}
for(const forbidden of ['Plan your page','Image Layout & Uploads','Choose a page, then choose the position']) assert.ok(!admin.includes(forbidden))
const header=fs.readFileSync(new URL('src/Components/SiteHeader/SiteHeader.jsx',root),'utf8')
assert.ok(header.includes("'/credentials': [['Certifications', 'certifications'], ['Rewards', 'rewards']]"))
assert.ok(header.includes('onClick={closeMenu}')&&header.includes('focusFirstItemOnShow="keyboard"'))
for(const code of Object.keys(sectionPages)) assert.ok(sectionImageSlots[code].includes('PAGE_HERO'))
console.log('PASS exact position labels, original slots preserved, three dropdowns, Admin structure and image configuration')
