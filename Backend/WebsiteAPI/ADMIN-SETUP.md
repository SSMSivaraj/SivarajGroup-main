# Website image administrator setup

No tables or migrations are executed by the application. Reuses SVSM_IT.dbo.NW_WebsiteAdminUsers (already created by you) and SVSM_IT.dbo.NW_WebsitePageImages. The admin table must have the fields and allowed roles from your supplied specification; admin_user_id must be an integer identity. username should have a unique constraint. Existing image (page_code, section_code) uniqueness is retained.

## Backend environment

Add these entries to **Backend/.env**, keeping actual secrets private:

```
WEBSITE_ADMIN_JWT_SECRET=<random secret of at least 32 bytes>
WEBSITE_ADMIN_TOKEN_EXPIRES_IN=8h
WEBSITE_FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Generate a random secret locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"` and paste the output into Backend/.env. Never paste it into chat or source control. Restart the backend after changes. Production requires HTTPS, NODE_ENV=production and WEBSITE_FRONTEND_ORIGIN set to the exact HTTPS frontend origin. A comma-separated origin list is supported for explicitly permitted development hosts; never use a wildcard.

The server currently defaults to port 46641 and the Vite proxy currently targets 3003. Choose one reachable backend port consistently. For direct cross-port access, set **Frontend/my-app/.env.local** (Vite's actual root, not Frontend/.env) to:

```
VITE_API_BASE_URL=http://localhost:46641
```

Replace 46641 with the backend port actually in use. Use the same hostname on both ends (localhost with localhost, or 127.0.0.1 with 127.0.0.1) for SameSite cookies. Set WEBSITE_FRONTEND_ORIGIN accordingly. If the existing Vite proxy is correctly pointed at the backend, leaving VITE_API_BASE_URL empty uses that proxy. Existing environment files were not changed by this task. No secret values were generated or stored automatically.

## Create the first account manually

From Backend, run:

```
node WebsiteAPI/createWebsiteAdmin.mjs
```

Enter your chosen username, display name, allowed role (SUPER_ADMIN for your initial administrator) and password at the prompts. Password entry is masked, is hashed using bcrypt cost 12, and is never printed or placed on the command line. There are no default credentials and no public registration endpoint. This manually invoked tool inserts only into the existing table, never alters tables and never overwrites existing users. Existing accounts with bcrypt password_hash and an allowed active role can log in without this step. No further schema SQL is provided or run automatically.

## Open the administration UI

- /admin/login
- /admin/website-images

These routes are outside PublicLayout and absent from public navigation. Login is an HttpOnly cookie, SameSite=Lax, Secure in production, scoped to /api/website. JWTs are not returned to the browser as JSON or stored in localStorage. Active status, role and password changes are checked against the table on authenticated requests. Logout clears the browser cookie; copied tokens otherwise remain valid until expiry unless the account is disabled or password changes.

Roles: SUPER_ADMIN and CONTENT_ADMIN can edit; CONTENT_VIEWER can view metadata only. Login throttling allows 10 attempts per remote address per 15-minute window. This limiter is per process; scale-out deployments should configure shared edge/proxy throttling. An inactive image has no public thumbnail until reactivated, because the existing public image GET deliberately returns active rows only. Replacement activates its image, as the existing upload behavior does.

## API

- POST /api/website/admin/login — JSON username/password; sets cookie
- POST /api/website/admin/logout — clears cookie
- GET /api/website/admin/me — authenticated identity only
- GET /api/website/admin/page-images?pageCode=SPINNING&isActive=true — authenticated metadata, optional filters
- PATCH /api/website/admin/page-images/:imageId/status — editor only; JSON isActive Boolean
- PUT /api/website/page-images/:pageCode/:sectionCode — editor only; FormData image, altText, displayOrder
- GET /api/website/page-images/:pageCode/:sectionCode — remains public, active image binary only

Use credentials: include for authentication/admin/upload fetch calls. Do not set multipart Content-Type manually. Browser writes check the configured Origin; existing nonbrowser clients must also supply the login cookie. updatedBy supplied by a client is ignored for image writes; identity is read from the authenticated account. Existing content editing endpoints retain their pre-existing local development restriction and were not redesigned in this image-only task.

## Files and scope

Created: Frontend/my-app/src/pages/AdminPage/AdminPages.jsx; Backend/WebsiteAPI/createWebsiteAdmin.mjs; this setup document; backend administrator tests.
Modified: Frontend/my-app/src/App.jsx; Backend/WebsiteAPI/websiteRoutes.js; Backend/server.js (credentialled exact-origin CORS); Backend/package.json and package-lock.json.
Installed: bcryptjs, jsonwebtoken, cookie-parser. No new backend route file, CSS, tables, database image uploads or public page/design changes.

## Validation results

Frontend lint passed (`npm run lint`). Production build passed (`npm run build`, outside the sandbox because Vite subprocesses were blocked inside it). Backend syntax checks passed for server.js, websiteRoutes.js and createWebsiteAdmin.mjs. Run the backend tests with `node WebsiteAPI/websiteAdmin.test.mjs` from Backend: nine tests passed using a mocked SQL pool and ephemeral local HTTP server. They cover public image access, unauthenticated write rejection, generic invalid login, HttpOnly cookie login and safe identity, viewer restrictions, origin and parameter validation, size/signature rejection, trusted audit identity, status visibility, logout cookie clearing and password-change token invalidation.

Vite returned 200 for /admin/login, /admin/website-images, the new admin module and /framework/spinning. This confirms source serving and SPA route fallback, not rendered-browser interaction. The actual SVSM_IT schema, live login, live existing-row replacement/uniqueness, image propagation and real browser cookie flow still require verification after local secret/account/origin setup. No production or live database writes were performed. Existing public layouts/pages/header/footer were not edited.
