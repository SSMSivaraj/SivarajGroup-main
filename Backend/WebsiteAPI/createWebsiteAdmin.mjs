import { emitKeypressEvents } from 'node:readline';
import bcrypt from 'bcryptjs';
import { getPool, sql } from '../db.js';

// Manual operator tool only; never creates or alters database tables.
if (!process.stdin.isTTY) throw new Error('Run this command directly in an interactive terminal.');
emitKeypressEvents(process.stdin);
function prompt(label, hidden = false) {
  return new Promise((resolve, reject) => {
    let value = '';
    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    function finish() {
      process.stdin.removeListener('keypress', read);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
    }
    function read(text, key = {}) {
      if (key.ctrl && key.name === 'c') { finish(); reject(new Error('Cancelled')); return; }
      if (key.name === 'return' || key.name === 'enter') { finish(); resolve(value); return; }
      if (key.name === 'backspace') {
        if (value.length) { value = value.slice(0, -1); process.stdout.write('\b \b'); }
      } else if (text && !key.ctrl && !key.meta && !/[\x00-\x1f\x7f]/.test(text) && value.length < 200) {
        value += text;
        process.stdout.write(hidden ? '*'.repeat(text.length) : text);
      }
    }
    process.stdin.on('keypress', read);
  });
}
let pool;
try {
  const username = (await prompt('Username: ')).trim();
  const displayName = (await prompt('Display name: ')).trim();
  const role = (await prompt('Role (SUPER_ADMIN / CONTENT_ADMIN / CONTENT_VIEWER): ')).trim();
  if (!username || username.length > 100 || !displayName || displayName.length > 100 || !['SUPER_ADMIN', 'CONTENT_ADMIN', 'CONTENT_VIEWER'].includes(role)) throw new Error('Enter valid identity fields (maximum 100 characters) and an allowed role.');
  let password = await prompt('Password (12+ characters, maximum 72 UTF-8 bytes): ', true);
  let confirmation = await prompt('Confirm password: ', true);
  if (password !== confirmation || password.length < 12 || Buffer.byteLength(password) > 72) throw new Error('Passwords must match and meet the displayed length limits.');
  const hash = await bcrypt.hash(password, 12);
  password = ''; confirmation = '';
  pool = await getPool();
  const result = await pool.request().input('username', sql.NVarChar(100), username)
    .input('displayName', sql.NVarChar(100), displayName).input('hash', sql.VarChar(255), hash)
    .input('role', sql.VarChar(30), role).query(`
      SET XACT_ABORT ON;
      BEGIN TRANSACTION;
      IF NOT EXISTS (SELECT 1 FROM SVSM_IT.dbo.NW_WebsiteAdminUsers WITH (UPDLOCK, HOLDLOCK) WHERE username=@username)
      BEGIN
        INSERT INTO SVSM_IT.dbo.NW_WebsiteAdminUsers
          (username, display_name, password_hash, role_code, is_active, created_by, created_at)
        VALUES (@username, @displayName, @hash, @role, 1, 'MANUAL_SETUP', SYSDATETIME());
        SELECT 1 AS created;
      END
      ELSE SELECT 0 AS created;
      COMMIT TRANSACTION;`);
  if (!result.recordset[0]?.created) throw new Error('That username already exists; no account was changed.');
  console.log('Administrator account created. No password or hash is printed.');
} catch {
  console.error('Account was not created. Check the inputs, existing username, table schema and database connection.');
  process.exitCode = 1;
} finally {
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  if (pool) await pool.close();
}
