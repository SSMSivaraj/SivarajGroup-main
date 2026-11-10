# Image management implementation

The existing Admin already included the ten tabs and many section codes. The missing piece was an explicit set of primary positions with labels, display orders and alt-text suggestions. Public rendering also required a matching content row, leaving some uploaded positions without a visible image. Existing positions and page codes were retained rather than creating duplicate prefixed identifiers.

## Primary mapping

Each row lists section codes in display order (1 onward). The first position is always Page Hero. The existing Admin page selector groups these tabs under Enlightenment, Goods and Credentials. The section selector lists primary positions first and preserves all older positions under “Existing additional positions.” This intentionally preserves more than four total choices on tabs that already had additional positions.

| Group / tab | pageCode | sectionCodes in display order |
| --- | --- | --- |
| Enlightenment / Textile | TEXTILE | PAGE_HERO, INTRODUCTION, MANUFACTURING, DISTRIBUTION |
| Enlightenment / Education | EDUCATION | PAGE_HERO, INTRODUCTION, INSTITUTIONS, ENGINEERING_COLLEGE |
| Enlightenment / Natural Energy | NATURAL_ENERGY | PAGE_HERO, INTRODUCTION, ENERGY_INITIATIVES, RESPONSIBLE_GROWTH |
| Enlightenment / Brands | BRANDS | PAGE_HERO, INTRODUCTION, CHENNIS_BRAND, BRAND_PRODUCTS |
| Goods / Cotton Yarn | COTTON_YARN | PAGE_HERO, INTRODUCTION, YARN_CAPABILITIES, APPLICATIONS |
| Goods / Knitted Fabrics | KNITTED_FABRICS | PAGE_HERO, INTRODUCTION, FABRIC_RANGE, APPLICATIONS |
| Goods / Woven Fabrics | WOVEN_FABRICS | PAGE_HERO, INTRODUCTION, FABRIC_RANGE, FABRIC_GALLERY |
| Goods / Garments | GARMENTS | PAGE_HERO, INTRODUCTION, PRODUCT_RANGE, GARMENT_APPLICATIONS |
| Credentials / Certifications | CREDENTIALS_CERTIFICATIONS | PAGE_HERO, QUALITY_SYSTEMS, CERTIFICATION_GALLERY |
| Credentials / Rewards | CREDENTIALS_REWARDS | PAGE_HERO, INTRODUCTION, REWARD_GALLERY |

`primaryImagePositions` in `sectionConfig.js` contains every task position's group, tab label, pageCode, sectionCode, label, displayOrder and suggested alt-text placeholder. Only GARMENT_APPLICATIONS is a new section identifier; it shares the existing garment product visual area. Existing image-position configurations remain intact. No legacy misspelled Credentials route was found.

## Behavior

- Upload/replace continues through the existing protected PUT route, using its existing serializable transaction and upsert on `(page_code, section_code)`. No new upload API, table, constraint, package, SQL file or image asset was introduced.
- `DELETE /api/website/page-images/:pageCode/:sectionCode` uses the existing origin, signed Admin session and editor-role middleware. Viewers receive 403; unauthenticated callers receive 401. Codes are validated against length/format and the existing page allowlist. Request bodies are rejected.
- Hard delete removes only the exact pair in `SVSM_IT.dbo.NW_WebsitePageImages`, using parameterized SQL. The affected-row count atomically checks existence: zero returns 404; exactly one commits; any other count rolls back. No documented image-retention requirement was found. Existing reversible Activate/Deactivate actions remain available.
- Delete is shown only for an existing selected record, including inactive records. A danger button opens confirmation naming the tab and position. Cancel sends no request. A synchronous lock and disabled fieldset prevent repeated mutation requests. Success clears uploaded-file selection, replacement metadata, alt text and preview state, then refreshes metadata and reports success. Failures report an error.
- Public primary containers use the existing neutral fallback when metadata is missing. Heroes retain their existing background and text; text content is never removed with its image. Orphan primary uploads appear in the visual area without invented editorial copy. Document images with matching content are not duplicated in the document gallery.
- BLOB and metadata responses use `Cache-Control: no-store`, including missing-image responses. Public image URLs use stable updated/created timestamps. Admin mutations notify same-origin tabs through storage events. Public metadata refreshes on focus, visibility changes and every 30 seconds while visible, covering changes from another browser. Older in-flight refreshes cannot overwrite newer image state. Remote browser changes may therefore take up to the refresh interval to appear.
- The shared public Footer adds responsive text links under Follow Us, preserving all existing content. Both links use the requested accessible labels, `target="_blank"` and `rel="noopener noreferrer"`. Admin routes remain outside PublicLayout.
- Facebook: https://www.facebook.com/sivarajspinningmills — visible handle @sivarajspinningmills.
- Instagram: https://www.instagram.com/chennis_mensclothing — visible handle @chennis_mensclothing.

## Files

Modified:

1. `Backend/WebsiteAPI/websiteRoutes.js` — protected exact-row deletion and cache headers.
2. `Backend/WebsiteAPI/websiteAdmin.test.mjs` — upload coverage for every primary position, deletion and authorization tests.
3. `Frontend/my-app/src/pages/KnowUsBetter/sectionConfig.js` — primary position metadata; all existing slots retained.
4. `Frontend/my-app/src/pages/AdminPage/AdminPages.jsx` — existing selectors, defaults, alt suggestions, confirmation, delete and reset behavior.
5. `Frontend/my-app/src/pages/KnowUsBetter/InnerPage.jsx` — public primary position bindings and fallback containers.
6. `Frontend/my-app/src/pages/KnowUsBetter/KnowUsBetterShared.jsx` — missing-metadata fallback and stable photograph reset key.
7. `Frontend/my-app/src/pages/KnowUsBetter/useWebsitePage.js` — revision URLs, metadata refresh and stale-response protection.
8. `Frontend/my-app/src/layouts/PublicLayout/PublicLayout.jsx` — shared social links.
9. `docs/verify-current-routes.mjs` — rendering, retained content, image mapping, fallback and Footer assertions.

Created: this report only. No application components or route files were created.

## Verification and limits

- `npm run lint`: passed, no lint errors.
- `node WebsiteAPI/websiteAdmin.test.mjs` from Backend: passed, 14 tests including the parent test. SQL is mocked. Every primary position was uploaded twice through HTTP and checked for matching input identifiers and repeat image IDs. These tests cannot prove real SQL persistence or unique-constraint behavior.
- `node docs/verify-current-routes.mjs`: passed. Server-rendered checks cover all ten tabs with all 38 primary images, text preservation with images removed, neutral fallbacks, social attributes on all ten tabs, five existing Framework routes and Footer exclusion from both Admin routes. Existing primary Framework labels and legacy slots remain intact.
- Backend syntax and `git diff --check`: passed; Git prints only line-ending warnings.
- `npm run build`: blocked by sandbox `spawn EPERM` while Vite loaded its configuration. The escalation request was declined. Production build remains unverified.
- No live database image was inserted, replaced or deleted, and no destructive database operation was executed. Real database row counts, concurrent SQL behavior and real uploaded photographs remain unverified.
- Browser confirmation/cancel, repeated clicks, cross-tab refresh, error-image events and mobile appearance were implemented but not exercised in an interactive browser. Rendering assertions are not interactive browser tests.
- Both supplied social URLs failed direct web retrieval with cache-miss errors. The exact supplied URLs and handles were retained; intended-account verification is pending.
- Existing Node warning: Backend/package.json puts `type` inside dependencies rather than declaring a top-level module type. This task leaves that unrelated configuration unchanged.
- Header, routes, authentication implementation, factual content, Vite configuration and unrelated application pages were not edited.
