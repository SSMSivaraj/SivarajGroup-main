import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import express from 'express';
import bcrypt from 'bcryptjs';
import { primaryImagePositions, sectionImageSlots } from '../../Frontend/my-app/src/pages/KnowUsBetter/sectionConfig.js';

process.env.SERVERNAME = 'mock-server';
process.env.WEBSITE_ADMIN_JWT_SECRET = randomBytes(48).toString('hex');
process.env.NODE_ENV = 'development';
const { sql } = await import('../db.js');
const hash = await bcrypt.hash('test-only-password', 4);
const users = [
  { admin_user_id: 1, username: 'editor', display_name: 'Test Editor', role_code: 'CONTENT_ADMIN', password_hash: hash },
  { admin_user_id: 2, username: 'viewer', display_name: 'Test Viewer', role_code: 'CONTENT_VIEWER', password_hash: hash },
];
let savedInput;
let imageActive = true;
const deletedKeys = new Set();
let deletedInput;
let deleteCountOverride;
let rollbacks = 0;
const metadata = () => ({ image_id: 1, page_code: 'SPINNING', section_code: 'INTRODUCTION', image_name: 'test.png', image_type: 'image/png', image_size_bytes: 8, is_active: imageActive, created_by: 'original-editor' });
class MockRequest {
  constructor() { this.values = {}; }
  input(key, type, value) { this.values[key] = value; return this; }
  async query(query) {
    if (query.includes('NW_WebsiteAdminUsers')) {
      if (query.includes('UPDATE')) return { rowsAffected: [1] };
      const user = users.find(user => this.values.username ? user.username === this.values.username : user.admin_user_id === this.values.id);
      return { recordset: user ? [{ ...user }] : [] };
    }
    if (query.includes('DECLARE @operation')) {
      savedInput = this.values;
      deletedKeys.delete(`${this.values.pageCode}/${this.values.sectionCode}`);
      return { recordset: [{ ...metadata(), operation: 'UPDATED', updated_by: this.values.currentUser }] };
    }
    if (query.startsWith('DELETE FROM')) {
      assert.match(query, /WHERE page_code=@pageCode AND section_code=@sectionCode/);
      deletedInput = this.values;
      const key = `${this.values.pageCode}/${this.values.sectionCode}`;
      const count = deleteCountOverride ?? (deletedKeys.has(key) ? 0 : 1);
      if (count === 1) deletedKeys.add(key);
      return { rowsAffected: [count] };
    }
    if (query.includes('OUTPUT INSERTED')) {
      imageActive = this.values.active;
      return { recordset: [{ image_id: 1, is_active: imageActive, updated_by: this.values.user }] };
    }
    if (query.includes('image_data,')) return { recordset: imageActive && !deletedKeys.has(`${this.values.pageCode}/${this.values.sectionCode}`) ? [{ ...metadata(), image_data: Buffer.from([137,80,78,71,13,10,26,10]) }] : [] };
    return { recordset: [metadata()] };
  }
}
const pool = { request: () => new MockRequest() };
sql.connect = async () => pool;
sql.Request = MockRequest;
sql.Transaction = class { async begin() {} async commit() {} async rollback() { rollbacks++; } };
const { default: router } = await import('./websiteRoutes.js');
const app = express();
app.use(express.json()); app.use('/api/website', router);
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}/api/website`;
const call = (path, options) => fetch(base + path, options);
const json = data => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
async function login(username, password = 'test-only-password') {
  return call('/admin/login', { method: 'POST', ...json({ username, password }) });
}
await test('website image administration authorization and validation (mock SQL)', async t => {
  try {
    await t.test('public image GET remains available; unauthenticated administration and writes are denied', async () => {
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION')).status, 200);
      assert.equal((await call('/admin/me')).status, 401);
      assert.equal((await call('/admin/page-images')).status, 401);
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION', { method: 'PUT' })).status, 401);
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION', { method: 'DELETE' })).status, 401);
      assert.equal((await call('/admin/page-images/1/status', { method: 'PATCH', ...json({ isActive: false }) })).status, 401);
    });
    await t.test('invalid users and invalid passwords return the same generic error', async () => {
      const unknown = await login('unknown'); const wrong = await login('editor', 'wrong');
      assert.equal(unknown.status, 401); assert.equal(wrong.status, 401);
      assert.deepEqual(await unknown.json(), await wrong.json());
    });
    const response = await login('editor');
    const cookieHeader = response.headers.get('set-cookie');
    const cookie = cookieHeader.split(';')[0];
    await t.test('login sets HttpOnly SameSite cookie, returns safe identity, and current user works', async () => {
      assert.equal(response.status, 200); assert.match(cookieHeader, /HttpOnly/i); assert.match(cookieHeader, /SameSite=Lax/i);
      assert.equal((await response.json()).data.password_hash, undefined);
      const me = await call('/admin/me', { headers: { Cookie: cookie } });
      const identity = (await me.json()).data;
      assert.equal(identity.username, 'editor'); assert.equal(identity.password_hash, undefined);
      assert.equal(Object.keys(identity).length, 4);
    });
    const viewerResponse = await login('viewer');
    const viewerCookie = viewerResponse.headers.get('set-cookie').split(';')[0];
    await t.test('viewer can list metadata but cannot upload or toggle status', async () => {
      const list = await call('/admin/page-images', { headers: { Cookie: viewerCookie } });
      assert.equal(list.status, 200); assert.equal((await list.json()).data[0].image_data, undefined);
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION', { method: 'PUT', headers: { Cookie: viewerCookie } })).status, 403);
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION', { method: 'DELETE', headers: { Cookie: viewerCookie } })).status, 403);
      assert.equal((await call('/admin/page-images/1/status', { method: 'PATCH', ...json({ isActive: false }), headers: { 'Content-Type': 'application/json', Cookie: viewerCookie } })).status, 403);
    });
    await t.test('rejects untrusted origins, invalid filters and malformed upload codes', async () => {
      assert.equal((await call('/admin/login', { method: 'POST', ...json({ username: 'editor', password: 'test-only-password' }), headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.invalid' } })).status, 403);
      assert.equal((await call('/admin/page-images?isActive=bad', { headers: { Cookie: cookie } })).status, 400);
      assert.equal((await call('/page-images/SPINNING/BAD-code', { method: 'PUT', headers: { Cookie: cookie } })).status, 400);
    });
    await t.test('upload enforces size/signature and ignores forged audit identity', async () => {
      async function send(bytes, name = 'image.png') {
        const form = new FormData(); form.append('image', new Blob([bytes], { type: 'image/png' }), name); form.append('updatedBy', 'forged');
        return call('/page-images/SPINNING/INTRODUCTION', { method: 'PUT', headers: { Cookie: cookie }, body: form });
      }
      assert.equal((await send('not an image')).status, 400);
      assert.equal((await send(new Uint8Array(614401))).status, 413);
      const result = await send(new Uint8Array([137,80,78,71,13,10,26,10]));
      assert.equal(result.status, 200);
      const body = await result.json();
      assert.equal(body.data.updated_by, 'editor'); assert.equal(body.data.created_by, 'original-editor'); assert.equal(body.data.image_data, undefined);
      assert.equal(savedInput.currentUser, 'editor'); assert.equal(savedInput.pageCode, 'SPINNING'); assert.equal(savedInput.sectionCode, 'INTRODUCTION');
    });
    await t.test('requested image positions upload and repeat through the same replacement endpoint', async () => {
      for (const [page, section, order] of [
        ['SPINNING', 'LINK_CONER', 3], ['WEAVING', 'QUALITY_CONTROL', 2],
        ['SPINNING', 'BALE_TRANSPORT', 11], ['CSR', 'CSR_GALLERY_PRIMARY', 7], ['CSR', 'CSR_GALLERY_SECONDARY', 8],
        ...['TEXTILE', 'EDUCATION', 'NATURAL_ENERGY', 'BRANDS', 'COTTON_YARN', 'KNITTED_FABRICS', 'WOVEN_FABRICS', 'GARMENTS'].map(page => [page, 'INTRODUCTION', 1]),
        ...Object.entries(primaryImagePositions).flatMap(([page, positions]) => Object.entries(positions).map(([section, position]) => [page, section, position.displayOrder])),
      ]) {
        const identifiers = [];
        for (let repeat = 0; repeat < 2; repeat++) {
          const form = new FormData();
          form.append('image', new Blob([new Uint8Array([137,80,78,71,13,10,26,10])], { type: 'image/png' }), 'fixture.png');
          form.append('displayOrder', String(order));
          const response = await call(`/page-images/${page}/${section}`, { method: 'PUT', headers: { Cookie: cookie }, body: form });
          assert.equal(response.status, 200);
          identifiers.push((await response.json()).data.image_id);
          assert.equal(savedInput.pageCode, page);
          assert.equal(savedInput.sectionCode, section);
          assert.equal(savedInput.displayOrder, order);
        }
        assert.equal(identifiers[0], identifiers[1]);
        assert.equal((await call(`/page-images/${page}/${section}`)).status, 200);
      }
    });
    await t.test('Welcome Way graphics accepts GIF only in its protected graphics slot and preserves replacement identity', async () => {
      async function send(path, bytes, name, type, session = cookie) {
        const body = new FormData(); body.append('image', new Blob([bytes], { type }), name);
        return call(path, { method: 'PUT', headers: { Cookie: session }, body });
      }
      const path = '/page-images/WELCOME_WAY/HEADER_GRAPHICS';
      const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      assert.equal((await send(path, gif, 'journey.gif', 'image/gif', '')).status, 401);
      assert.equal((await send(path, gif, 'journey.gif', 'image/gif', viewerCookie)).status, 403);
      assert.equal((await send('/page-images/WELCOME_WAY/FABRIC_ROLLS', gif, 'journey.gif', 'image/gif')).status, 400);
      assert.equal((await send(path, '<svg onload="alert(1)"/>', 'journey.svg', 'image/svg+xml')).status, 400);
      assert.equal((await send(path, 'not a gif', 'journey.gif', 'image/gif')).status, 400);
      const ids = [];
      for (let index = 0; index < 2; index++) {
        const response = await send(path, gif, 'journey.gif', 'image/gif');
        assert.equal(response.status, 200); ids.push((await response.json()).data.image_id);
        assert.equal(savedInput.imageType, 'image/gif'); assert.equal(savedInput.pageCode, 'WELCOME_WAY'); assert.equal(savedInput.sectionCode, 'HEADER_GRAPHICS');
      }
      assert.equal(ids[0], ids[1]);
      assert.equal((await call(path, { method: 'DELETE', headers: { Cookie: cookie } })).status, 200);
      assert.equal((await call(path)).status, 404);
      assert.equal((await call('/page-images/WELCOME_WAY/FABRIC_ROLLS')).status, 200);
    });
    await t.test('primary positions have correct counts, orders and preserved matching public codes', () => {
      assert.equal(Object.keys(primaryImagePositions).length, 10);
      for (const [page, positions] of Object.entries(primaryImagePositions)) {
        assert.equal(Object.keys(positions).length, page.startsWith('CREDENTIALS_') ? 3 : 4);
        Object.entries(positions).forEach(([section, position], index) => {
          assert.ok(sectionImageSlots[page].includes(section));
          assert.equal(position.pageCode, page); assert.equal(position.sectionCode, section);
          assert.equal(position.displayOrder, index + 1); assert.ok(position.altPlaceholder);
        });
        assert.equal(new Set(sectionImageSlots[page]).size, sectionImageSlots[page].length);
      }
    });
    await t.test('delete validates origin, codes and rejects client image bodies', async () => {
      const remove = (path, options = {}) => call(path, { method: 'DELETE', headers: { Cookie: cookie }, ...options });
      assert.equal((await remove('/page-images/TEXTILE/INTRODUCTION', { headers: { Cookie: cookie, Origin: 'https://untrusted.invalid' } })).status, 403);
      for (const path of [`/page-images/${'A'.repeat(51)}/INTRODUCTION`, `/page-images/TEXTILE/${'A'.repeat(101)}`, '/page-images/TEXTILE/BAD-code', '/page-images/UNKNOWN/INTRODUCTION']) assert.equal((await remove(path)).status, 400);
      assert.equal((await remove('/page-images/TEXTILE/INTRODUCTION', { ...json({ image_data: 'forged' }), headers: { Cookie: cookie, 'Content-Type': 'application/json' } })).status, 400);
    });
    await t.test('delete removes only selected position, returns 404 on repeat, and public GET cannot cache removed data', async () => {
      const path = '/page-images/TEXTILE/INTRODUCTION';
      const response = await call(path, { method: 'DELETE', headers: { Cookie: cookie } });
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { success: true, message: 'Image deleted successfully', pageCode: 'TEXTILE', sectionCode: 'INTRODUCTION' });
      assert.deepEqual(deletedInput, { pageCode: 'TEXTILE', sectionCode: 'INTRODUCTION' });
      const missing = await call(path);
      assert.equal(missing.status, 404); assert.equal(missing.headers.get('cache-control'), 'no-store');
      assert.equal((await call('/page-images/TEXTILE/MANUFACTURING')).status, 200);
      assert.equal((await call('/page-images/EDUCATION/INTRODUCTION')).status, 200);
      assert.equal((await call(path, { method: 'DELETE', headers: { Cookie: cookie } })).status, 404);
    });
    await t.test('unexpected deletion count rolls back rather than reporting success', async () => {
      const before = rollbacks; deleteCountOverride = 2;
      try { assert.equal((await call('/page-images/TEXTILE/MANUFACTURING', { method: 'DELETE', headers: { Cookie: cookie } })).status, 500); }
      finally { deleteCountOverride = undefined; }
      assert.equal(rollbacks, before + 1);
      assert.equal((await call('/page-images/TEXTILE/MANUFACTURING')).status, 200);
    });
    await t.test('editor status changes control public visibility; logout clears cookie', async () => {
      const change = active => call('/admin/page-images/1/status', { method: 'PATCH', ...json({ isActive: active }), headers: { 'Content-Type': 'application/json', Cookie: cookie } });
      assert.equal((await change(false)).status, 200);
      assert.equal((await call('/page-images/SPINNING/INTRODUCTION')).status, 404);
      assert.equal((await change(true)).status, 200);
      const logout = await call('/admin/logout', { method: 'POST', headers: { Cookie: cookie } });
      assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie'), /website_admin=;/);
      assert.equal((await call('/admin/me')).status, 401);
    });
    await t.test('password changes invalidate existing tokens', async () => {
      users[0].password_hash = await bcrypt.hash('different-test-password', 4);
      assert.equal((await call('/admin/me', { headers: { Cookie: cookie } })).status, 401);
    });
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
});
