// In-process handler checks: mock SQL only, no HTTP listener or database writes.
import assert from 'node:assert/strict';
process.env.SERVERNAME = 'mock-server';
const { sql } = await import('../db.js');
const records = new Map();
let nextId = 1;
let lastQuery;
class Request {
  constructor() { this.values = {}; }
  input(name, type, value) { this.values[name] = value; return this; }
  async query(query) {
    lastQuery = query;
    const { pageCode, sectionCode } = this.values;
    const key = `${pageCode}/${sectionCode}`;
    if (query.startsWith('DELETE')) {
      assert.match(query, /WHERE page_code=@pageCode AND section_code=@sectionCode/);
      return { rowsAffected:[records.delete(key) ? 1 : 0] };
    }
    assert.match(query, /UPDATE .*WITH \(UPDLOCK, HOLDLOCK\)/);
    assert.match(query, /WHERE page_code = @pageCode\s+AND section_code = @sectionCode/);
    const previous = records.get(key);
    const row = { image_id: previous?.image_id || nextId++, page_code:pageCode, section_code:sectionCode, operation:previous?'UPDATED':'INSERTED' };
    records.set(key,row);
    return { recordset:[row] };
  }
}
sql.connect = async () => ({});
sql.Request = Request;
sql.Transaction = class { async begin() {} async commit() {} async rollback() {} };
const { default:router } = await import('./websiteRoutes.js');
const endpoint = (method, path) => router.stack.find(layer => layer.route?.path===path && layer.route.methods[method]).route.stack.at(-1).handle;
const put = endpoint('put','/page-images/:pageName/:imageKey');
const remove = endpoint('delete','/page-images/:pageCode/:sectionCode');
async function call(handler, req) {
  const res = { code:200, set(){return this}, status(code){this.code=code;return this}, json(value){this.body=value;return this} };
  await handler(req,res,error=>{throw error});
  return res;
}
const pages = ['SPINNING','KNITTING','WEAVING','GARMENTING','HOME_TEXTILES'];
for (const page of pages) for (const section of ['PAGE_HERO_1','PAGE_HERO_2']) {
  let id;
  for (let repeat=0;repeat<2;repeat++) {
    const res = await call(put,{ params:{pageName:page,imageKey:section}, websiteAdmin:{username:'test-editor'}, body:{displayOrder:'1'}, file:{buffer:Buffer.from([137,80,78,71,13,10,26,10]),originalname:'test.png'} });
    assert.equal(res.code,200);
    if (id) assert.equal(res.body.data.image_id,id);
    id=res.body.data.image_id;
  }
}
assert.equal(records.size,10);
for (const page of pages) {
  const primary=records.get(`${page}/PAGE_HERO_1`);
  const res=await call(remove,{params:{pageCode:page,sectionCode:'PAGE_HERO_2'}});
  assert.equal(res.code,200);
  assert.deepEqual(records.get(`${page}/PAGE_HERO_1`),primary);
  assert.equal(records.has(`${page}/PAGE_HERO_2`),false);
}
assert.equal(records.size,5);
await call(remove,{params:{pageCode:'SPINNING',sectionCode:'PAGE_HERO_1'}});
assert.equal(records.size,4);
assert.ok(records.has('KNITTING/PAGE_HERO_1'));
assert.equal((await call(remove,{params:{pageCode:'SPINNING',sectionCode:'PAGE_HERO_1'}})).code,404);
assert.ok(lastQuery.includes('section_code=@sectionCode'));
console.log('PASS all ten Framework hero uploads/replacements preserve identity; exact secondary and primary deletion isolation (mock SQL handlers; authentication middleware unchanged)');
