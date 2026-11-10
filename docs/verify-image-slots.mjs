// Actual page rendering versus the shared upload registry. No server or SQL writes.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire, registerHooks } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { imageSlots, publicImagePositions } from '../Frontend/my-app/src/config/imageSlots.js'
import { adminImagePositions, pageSections } from '../Frontend/my-app/src/pages/AdminPage/imageConfiguration.js'
import { validateImagePositions } from '../Frontend/my-app/src/pages/Framework/validateImagePositions.js'

assert.deepEqual(validateImagePositions(publicImagePositions,adminImagePositions),[])
assert.ok(publicImagePositions.every(slot=>slot.sectionCode!=='ENQUIRY_BANNER'))
assert.ok(!pageSections.WEAVING.includes('QUALITY_CONTROL'))
assert.ok(!pageSections.MANAGEMENT_TEAM.includes('MANAGEMENT_TEAM'))
assert.ok(!pageSections.GLOBAL_PRESENCE.includes('MARKET_MAP'))
const sample=publicImagePositions[0], next=publicImagePositions[1]
assert.ok(validateImagePositions([sample,next],[sample,{...next,displayOrder:sample.displayOrder}]).some(issue=>issue.includes('duplicate display order')))
assert.ok(validateImagePositions([sample],[{...sample,sectionCode:'WRONG'}]).some(issue=>issue.includes('Missing from Admin')))

const root=new URL('../Frontend/my-app/',import.meta.url)
const require=createRequire(new URL('package.json',root))
const {transformSync}=await import(pathToFileURL(require.resolve('rolldown/utils')))
const fixture=JSON.parse(fs.readFileSync(new URL('completed-content-reference.json',import.meta.url)))
registerHooks({load(url,context,next){
  if(url.endsWith('.module.css')) return {format:'module',source:'export default new Proxy({}, {get:(_,key)=>key})',shortCircuit:true}
  if(/\.(jpeg|png)$/.test(url)) return {format:'module',source:`export default ${JSON.stringify(url)}`,shortCircuit:true}
  if(url.endsWith('/useWebsitePage.js')) return {format:'module',source:`
    const fixture=${JSON.stringify(fixture)}, slots=${JSON.stringify(imageSlots)};
    export const imageUrl=(page,code)=>'/api/website/page-images/'+page+'/'+code;
    export const safeUrl=url=>typeof url==='string'&&url.startsWith('/');
    export function useWebsitePage(page){
      const rows=[...(fixture[page]||[])];
      for(const section_code of ['LEADERSHIP_MESSAGE','HEALTH_WELLBEING','EMPLOYEE_WELFARE','INTERNATIONAL_PRESENCE'])rows.push({section_code,heading:'Optional published section',body_content:'Existing optional section copy'});
      const images=globalThis.noImages?{}:Object.fromEntries((slots[page]||[]).map(slot=>[slot.sectionCode,{alt_text:slot.publicPurpose,updated_at:'test'}]));
      if(!globalThis.noImages) images.ENQUIRY_BANNER={alt_text:'Must not render'};
      return {page,loading:false,rows,images,lookup:Object.fromEntries(rows.map(row=>[row.section_code,row])),get:(code,source,aliases=[])=>rows.find(row=>row.section_code===code)||aliases.map(code=>rows.find(row=>row.section_code===code)).find(Boolean)||source};
    }
  `,shortCircuit:true}
  if(url.startsWith(new URL('src/',root).href)&&/\.(jsx|js)$/.test(url)) {
    const result=transformSync(fileURLToPath(url),fs.readFileSync(fileURLToPath(url),'utf8').replaceAll('import.meta.env','({})'),{lang:url.endsWith('.jsx')?'jsx':'js',jsx:{runtime:'automatic'}})
    assert.equal(result.errors.length,0)
    return {format:'module',source:result.code,shortCircuit:true}
  }
  return next(url,context)
}})
const {createElement:h}=require('react')
const {renderToStaticMarkup:render}=require('react-dom/server')
const {MemoryRouter}=require('react-router-dom')
const {default:App}=await import(new URL('src/App.jsx',root))
const groups={'Know Us Better':'know-us-better',Framework:'framework',Enlightenment:'enlightenment',Goods:'goods',Credentials:'credentials'}
const slug=label=>label.toLowerCase().replaceAll(' ','-')
for(const [page,slots]of Object.entries(imageSlots)){
  const route=page==='WELCOME_WAY'?'/':`/${groups[slots[0].group]}/${slug(slots[0].pageLabel)}`
  for(const missing of [false,true]){
    globalThis.noImages=missing
    const html=render(h(MemoryRouter,{initialEntries:[route]},h(App)))
    const positions=[...html.matchAll(/<(?:img|section|div)\b[^>]*data-image-page="([^"]+)"[^>]*data-image-position="([^"]+)"/g)].filter(match=>match[1]===page).map(match=>match[2])
    assert.equal(new Set(positions).size,positions.length,`${page}: duplicate visible bindings`)
    assert.ok(!positions.includes('ENQUIRY_BANNER'))
    if(!missing){
      const expected=pageSections[page].filter(code=>code!=='HEADER_GRAPHICS')
      assert.deepEqual([...positions].sort(),[...expected].sort(),`${page}: Admin options versus actual page markup`)
      for(const match of html.matchAll(/<img\b[^>]*data-image-page="[^"]+"[^>]*>/g))assert.match(match[0],/alt="[^"\s][^"]*"/)
      console.log(`PASS ${page}: ${expected.length} rendered page positions${page==='WELCOME_WAY'?' + existing shared header graphic':''}`)
    }
    if(page!=='WELCOME_WAY'){
      assert.equal((html.match(/data-enquiry-banner="true"/g)||[]).length,1,`${page}: CSS-only enquiry retained`)
      assert.ok(!html.includes('/ENQUIRY_BANNER'))
    }
    if(slots[0].group==='Framework'){
      assert.ok(!html.includes('photograph temporarily unavailable'))
      if(missing)assert.deepEqual(positions.sort(),['PAGE_HERO_1','PAGE_HERO_2'])
    }
    if(slots[0].group==='Know Us Better'){
      const tabs=html.match(/<nav\b[^>]*aria-label="Know Us Better pages"[^>]*>(.*?)<\/nav>/)?.[1]
      assert.ok(tabs)
      const links=[...tabs.matchAll(/href="([^"]+)"/g)].map(match=>match[1])
      assert.deepEqual(links,['company-profile','management-team','csr','global-presence'].map(slug=>'/know-us-better/'+slug))
      assert.equal((tabs.match(/aria-current="page"/g)||[]).length,1)
    }
  }
}
const graphics=fs.readFileSync(new URL('src/Components/SiteHeader/HeaderGraphics.jsx',root),'utf8')
assert.ok(graphics.includes("row.section_code === 'HEADER_GRAPHICS'"))
console.log('PASS all page groups, exact image counts, optional/missing cases, enquiry images excluded, four Know Us Better tabs and active route; original HeaderGraphics mapping retained')
