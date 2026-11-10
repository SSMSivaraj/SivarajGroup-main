// Explicit insert-only content additions. No server-startup import; no image writes.
import fs from 'node:fs'
import { getPool, sql } from '../db.js'
export const additions = [
  ['CREDENTIALS_REWARDS','OEKO_TEX','OEKO-TEX – Eco-Friendly','The old Awards page records endorsement by the International OEKO-TEX Association for avoiding harmful chemical substances during yarn production. This published recognition is historical; current certificate scope and validity must be confirmed.',21],
  ['CREDENTIALS_REWARDS','GOTS','GOTS – Organic Cotton','The old Awards page records certification by the Global Organic Textile Standard (GOTS) for producing yarn from organic fibres. This historical reference does not establish current certificate validity.',22],
  ['COTTON_YARN','YARN_GALLERY','From the yarn product gallery','Gassed Mercerized Yarn\nBamboo Yarn\nDyed Yarn\nPolyester Cotton\nZero Twist Yarn\nSoya Cotton Yarn\nModal Yarn\nMelange Yarn',35],
  ['WOVEN_FABRICS','FABRIC_GALLERY','From the woven-fabric gallery','Chambrey\nCorduroy\nDenim\nFlannel\nPinpoint Oxford\nOxford\nRoyal Oxford\nHerringbone\nKhadi Fabric\nCrepe\nDobby\nGabardine\nMelange\nPoplin',35],
  ['NATURAL_ENERGY','PUBLISHED_HISTORY','The published wind-farming history','The Natural Energy page dates the start of wind farming with 100 windmills to 2000. The old CSR page instead gives 2005. Both are retained as source statements; the start year requires confirmation.',25],
]
const apply = process.argv.includes('--apply')
const pool = await getPool()
try {
  const transaction = new sql.Transaction(pool)
  await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE)
  try {
    for(const [page,section,heading,body,order] of additions) {
      const request = new sql.Request(transaction).input('page',sql.VarChar(50),page).input('section',sql.VarChar(100),section)
      const existing = await request.query('SELECT content_id FROM dbo.NW_WebsitePageContent WITH (UPDLOCK,HOLDLOCK) WHERE page_code=@page AND section_code=@section')
      if(existing.recordset.length) { console.log('PRESERVE',page,section); continue }
      console.log(apply ? 'INSERT' : 'PLAN',page,section)
      if(apply) await request.input('heading',sql.NVarChar(500),heading).input('body',sql.NVarChar(sql.MAX),body).input('order',sql.Int,order).query(`INSERT INTO dbo.NW_WebsitePageContent
        (page_code,section_code,heading,body_content,display_order,is_active,created_by)
        VALUES (@page,@section,@heading,@body,@order,1,'section-content-completion')`)
    }
    if(apply) await transaction.commit()
    else await transaction.rollback()
  } catch(error) { await transaction.rollback(); throw error }
  const reference = JSON.parse(fs.readFileSync(new URL('../../docs/current-content-reference.json',import.meta.url)))
  const rows = await pool.request().query('SELECT page_code,section_code,heading,subheading,body_content,button_text,button_url,display_order,is_active FROM dbo.NW_WebsitePageContent ORDER BY page_code,display_order,content_id')
  const current = Object.fromEntries(Object.keys(reference).map(code => [code, rows.recordset.filter(row=>row.page_code===code)]))
  for(const [page,records] of Object.entries(reference)) for(const row of records) {
    const after=current[page].find(item=>item.section_code===row.section_code)
    if(JSON.stringify(after)!==JSON.stringify(row)) throw Error('Existing content changed: '+page+'/'+row.section_code)
  }
  fs.writeFileSync(new URL('../../docs/completed-content-reference.json',import.meta.url),JSON.stringify(current,null,2))
  console.log('PASS: all pre-existing content records unchanged')
} finally { await pool.close() }
