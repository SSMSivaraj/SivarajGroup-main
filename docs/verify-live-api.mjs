// Read-only API checks against the updated router, using an ephemeral test listener.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { getPool } from '../Backend/db.js'
import router from '../Backend/WebsiteAPI/websiteRoutes.js'
const require=createRequire(new URL('../Backend/package.json',import.meta.url))
const express=require('express')
const app=express()
app.use('/api/website',router)
const server=app.listen(0,'127.0.0.1')
await new Promise(resolve=>server.once('listening',resolve))
const base=`http://127.0.0.1:${server.address().port}/api/website`
const reference=JSON.parse(fs.readFileSync(new URL('completed-content-reference.json',import.meta.url)))
const pool=await getPool()
try {
  for(const [page,rows] of Object.entries(reference)) {
    const response=await fetch(`${base}/page-content/${page}`)
    assert.equal(response.status,200,page)
    const result=await response.json()
    for(const row of rows.filter(row=>row.is_active)) assert.ok(result.data.some(actual=>actual.section_code===row.section_code&&actual.heading===row.heading&&actual.body_content===row.body_content),page+'/'+row.section_code)
    assert.equal((await fetch(`${base}/page-images/${page}`)).status,200)
    console.log('PASS updated live API',page,result.data.length,'content rows')
  }
  for(const [page,section] of [['SPINNING','LINK_CONER'],['WEAVING','QUALITY_CONTROL']]) {
    const response=await fetch(`${base}/page-images/${page}/${section}`)
    assert.equal(response.status,404,'new slot must be empty until approved upload')
    const blocked=await fetch(`${base}/page-images/${page}/${section}`,{method:'PUT'})
    assert.equal(blocked.status,401,'existing protected upload still requires authentication')
    console.log('PASS position',page,section,'valid empty slot, protected upload')
  }
  const result=await pool.request().query('SELECT image_id,page_code,section_code,image_size_bytes,display_order,is_active FROM dbo.NW_WebsitePageImages ORDER BY page_code,section_code')
  assert.deepEqual(result.recordset,JSON.parse(fs.readFileSync(new URL('current-image-reference.json',import.meta.url))))
  console.log('PASS every pre-existing image metadata record unchanged')
  const keys=await pool.request().query(`SELECT i.name,c.name AS column_name,ic.key_ordinal FROM sys.indexes i
    JOIN sys.index_columns ic ON i.object_id=ic.object_id AND i.index_id=ic.index_id
    JOIN sys.columns c ON c.object_id=ic.object_id AND c.column_id=ic.column_id
    WHERE i.object_id=OBJECT_ID('dbo.NW_WebsitePageImages') AND i.is_unique=1 AND ic.key_ordinal>0 ORDER BY i.name,ic.key_ordinal`)
  const groups=Object.groupBy(keys.recordset,row=>row.name)
  assert.ok(Object.values(groups).some(rows=>rows.length===2&&rows.map(row=>row.column_name).includes('page_code')&&rows.map(row=>row.column_name).includes('section_code')))
  console.log('PASS existing unique page_code + section_code key retained')
  const binary=await fetch(`${base}/page-images/SPINNING/LINK_CONER_PRIMARY`)
  assert.equal(binary.status,200)
  assert.match(binary.headers.get('content-type'),/^image\//)
  console.log('PASS existing photograph binary response with image Content-Type')
} finally { server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); await pool.close() }
