# Framework and page navigation changes

The existing repository was updated locally. No deployment, database migration, image upload, or database deletion was performed. Existing staged work was preserved. Header, Footer, route definitions, authentication, verified editorial copy, and non-Framework hero layouts were retained.

## Files modified

- `Frontend/my-app/src/pages/AdminPage/AdminPages.jsx`
- `Frontend/my-app/src/pages/Framework/FrameworkPage.jsx`
- `Frontend/my-app/src/pages/Framework/FrameworkPage.module.css`
- `Frontend/my-app/src/pages/Framework/frameworkImages.js`
- `Frontend/my-app/src/pages/KnowUsBetter/HomeTextilesPage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/InnerPage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/InnerPage.module.css`
- `Frontend/my-app/src/pages/KnowUsBetter/KnowUsBetterShared.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/SpinningPage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/useWebsitePage.js`
- `docs/verify-current-routes.mjs` (replace an obsolete source-string assertion with a configuration assertion)

## Files created

- `Frontend/my-app/src/Components/Navigation/PageGroupTabs.jsx`
- `Frontend/my-app/src/Components/Navigation/SectionNavigator.jsx`
- `Frontend/my-app/src/Components/Navigation/Navigation.module.css`
- `Frontend/my-app/src/Components/PageHero/FrameworkSplitHero.jsx`
- `Frontend/my-app/src/Components/PageHero/FrameworkSplitHero.module.css`
- `Frontend/my-app/src/pages/AdminPage/imageConfiguration.js`
- `Frontend/my-app/src/pages/Framework/frameworkImageContext.js`
- `Frontend/my-app/src/pages/Framework/validateImagePositions.js`
- `Backend/WebsiteAPI/frameworkHero.test.mjs`
- `docs/verify-framework-navigation.mjs`
- `docs/verify-framework-interactions.mjs`
- This report.

## Home Textiles removals and database handling

Removed the complete sections, fallback entries, section-navigation links, and Admin positions for:

| Heading | Exact page code | Exact section code |
| --- | --- | --- |
| Explore Home Textile Requirements | HOME_TEXTILES | PRODUCT_CAPABILITIES |
| Begin With the Right Material | HOME_TEXTILES | MATERIALS |

The extra database-content renderer also excludes these exact codes, preventing old content rows from restoring the sections. Existing image rows are not deleted. These pairs are now unused if they exist in the live database. The checked-in `docs/current-image-reference.json` snapshot contains only `HOME_TEXTILES/PAGE_HERO`, so it does not establish that either removed image row currently exists. Live database state was not queried.

Optional, separately reviewed cleanup query (not executed; bind these exact values):

```sql
-- @exactPageCode = 'HOME_TEXTILES'
-- @exactSectionCode1 = 'PRODUCT_CAPABILITIES'
-- @exactSectionCode2 = 'MATERIALS'
DELETE FROM dbo.NW_WebsitePageImages
WHERE page_code = @exactPageCode
  AND section_code IN (@exactSectionCode1, @exactSectionCode2);
```

## Shared navigation and heroes

`PageGroupTabs` reuses the Enlightenment/Goods/Credentials visual treatment for all five groups, using `NavLink` and existing routes. Active tabs scroll horizontally into view on narrow layouts. Existing `ScrollToTop` retains route-top and hash handling.

`SectionNavigator` replaces both Framework and Spinning process-link implementations. It provides numbered pills, active observation, comfortable touch targets, scroll snap on mobile, native anchor keyboard activation, focus transfer, sticky-header offset, reduced-motion handling, and history-preserving hashes. Existing process aliases that target the same stage are retained.

`FrameworkSplitHero` is used only by the five Framework pages. It uses a 3:1 grid above 767px and two vertically stacked panels below that breakpoint. Both panels retain minimum heights, cover cropping, meaningful alternatives, and independent failure handling. Text remains on the primary panel. The secondary has a separator and a neutral fallback; it never copies the primary.

Primary lookup prefers active `PAGE_HERO_1` metadata; absent primary metadata uses legacy `PAGE_HERO`. A failed primary image request can also retry the legacy image. Admin writes only to `PAGE_HERO_1`/`PAGE_HERO_2`. No records were renamed. Consequently, deleting a primary while a legacy image remains can reveal that legacy fallback; this is intentional compatibility behavior.

## Complete Framework public/Admin position comparison

Both consumers use `frameworkImageSections` and `frameworkImagePositions`. Shared position metadata includes group, page label/code, section code, display label, intended position, and display order. Orders are the following list positions, starting at 1. `PAGE_HERO_1` is labelled `Page Hero - Primary (75%)`; `PAGE_HERO_2` is labelled `Page Hero - Secondary (25%)`.

| Page code | Public count | Admin count | Result |
| --- | ---: | ---: | --- |
| SPINNING | 19 | 19 | Exact match |
| KNITTING | 8 | 8 | Exact match |
| WEAVING | 12 | 12 | Exact match |
| GARMENTING | 13 | 13 | Exact match |
| HOME_TEXTILES | 8 | 8 | Exact match |

- **SPINNING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, BLOW_ROOM_PRIMARY, BLOW_ROOM_SECONDARY, CARDING, COMBER, DRAW_FRAME, SIMPLEX, RING_SPINNING, LINK_CONER_PRIMARY, LINK_CONER_SECONDARY, BALE_TRANSPORT, LINK_CONER, YARN_CONDITIONING, OE_BLOW_ROOM, OE_DRAW_FRAME, OE_WINDING, ENQUIRY_BANNER.
- **KNITTING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, KNITTING_FLOOR, TECHNOLOGY, QUALITY_CONTROL, PRODUCT_CAPABILITY, ENQUIRY_BANNER.
- **WEAVING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, WARPING, SIZING, DRAWING_IN, LOOM_WEAVING, INSPECTION_PRIMARY, INSPECTION_SECONDARY, PACKING, QUALITY_CONTROL, ENQUIRY_BANNER.
- **GARMENTING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, FABRIC_STORE, FABRIC_INSPECTION, CUTTING, CUT_PANEL_CHECKING, SEWING_UNIT_ONE, SEWING_UNIT_TWO, IRONING_FINISHING, PACKING, QUALITY_CONTROL, ENQUIRY_BANNER.
- **HOME_TEXTILES:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, BED_LINEN, KITCHEN_DINING, DESIGN_AND_FINISHING, QUALITY, ENQUIRY_BANNER.

Rendered-page checks compare every actual Framework image container against Admin, including duplicates and missing-image cases. Additional content-only Garmenting stages no longer create unconfigured empty image placeholders. Removed/legacy Framework image positions are excluded from Admin's actionable existing-images list without deleting records. Unrelated page configurations and legacy additional positions are preserved; this change does not establish a new site-wide one-to-one guarantee for those unrelated dynamic galleries.

## Verification results and limits

- `npm run lint` in `Frontend/my-app`: passed. Baseline lint also passed.
- `npm run build -- --configLoader native`: passed. Plain `npm run build` was blocked by sandbox `spawn EPERM`; the runner loader encountered a dependency `require` error. Native loading builds successfully without changing project configuration.
- `node docs/verify-framework-navigation.mjs`: passed; exact public/Admin counts with available and missing images, removed sections, one heading, valid section targets, and validator failure cases.
- `node docs/verify-framework-interactions.mjs`: passed; primary/legacy selection, independent secondary fallback, click/focus callbacks, sticky offset, smooth/reduced scrolling, active observer, history state, and listener cleanup.
- `node docs/verify-current-routes.mjs`: passed; existing routes, retained Enlightenment/Goods/Credentials content, image configuration, Admin separation, and unchanged Header behavior.
- `node docs/verify-hero-scroll.mjs`: passed; original non-Framework hero behavior and route-top/hash handling.
- `node Backend/WebsiteAPI/frameworkHero.test.mjs`: passed; in-process existing upload/delete handlers using mock SQL. All ten Framework hero positions replace the same mock identity, secondary deletion preserves primary, primary deletion preserves other pages, and repeat deletion returns 404. These are handler checks, not live SQL or authenticated HTTP integration tests. Existing authentication middleware and backend production code are unchanged.
- The original HTTP API integration suite could not complete in the sandbox. Requests to run the plain build and original test runner outside the sandbox were declined; no elevated process was run.
- `docs/verify-know-us-better.mjs`: the four page/content checks pass; its existing CSR image-count assertion expects 10 but the unchanged CSR configuration has 13. This mismatch predates these changes. The old script stops there; later assertions were not reached.
- `git diff --check`: passed.
- Responsive CSS was inspected for 1920, 1440, 1200, 992, 768, 576, 375, and 320px: desktop/tablet grid versus mobile stacking and locally scrollable navigation are defined. No browser automation tool is available here, so visual layout, real keyboard operation, overflow, and rendered contrast at these widths still require browser verification. No visual-test pass is claimed.

Assumptions: use the existing tab styling as the common design; preserve current page codes and legacy hero records; supply no new images; keep work local; preserve unrelated legacy upload options and editorial sections.
