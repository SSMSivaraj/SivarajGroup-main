# Image upload corrections

The requested slots already existed. Raw codes and the flat page dropdown obscured their purpose. No new page or section identifiers were needed. The existing Page dropdown now groups pages by navigation area, and existing Section options have readable labels. The form layout is unchanged.

## Exact relabeled entries

| page_code | section_code | Label | Default order |
|---|---|---|---|
| CSR | CSR_GALLERY_PRIMARY | Community Support | 7 |
| CSR | CSR_GALLERY_SECONDARY | A Closer Look — Saplings and Green Cover | 8 |
| CSR | EDUCATION | Education / A Closer Look — SSM School (shared image) | 4 |
| SPINNING | BALE_TRANSPORT | Bobbin Transport on the Production Floor | 11 |

CSR/COMMUNITY remains the marriage hall photograph. Community Support refers to the free food distribution photograph. A Closer Look also reuses EDUCATION; replacing it affects both existing school placements. Spinning LINK_CONER (Spinning / Link Coner, order 3), LINK_CONER_PRIMARY and LINK_CONER_SECONDARY remain separate options. No slots were added or deleted.

## Complete Enlightenment mapping

Each page_code below includes PAGE_HERO first and ENQUIRY_BANNER last. The following section_codes appear between them, in existing configuration order. Labels are the codes converted to title case with spaces. These lists reuse sectionImageSlots without a competing configuration.

| page_code | section_codes between hero and enquiry |
|---|---|
| TEXTILE | INTRODUCTION, GROUP_COMPANIES, RESEARCH_DEVELOPMENT, PRODUCT_PARTNERSHIP, MANUFACTURING, CUT_N_SEW, PRODUCT_PROMOTION, DISTRIBUTION |
| EDUCATION | INTRODUCTION, INSTITUTIONS, LEARNING_ENVIRONMENT, ENGINEERING_COLLEGE, EDUCATION_VISION |
| NATURAL_ENERGY | INTRODUCTION, ENERGY_INITIATIVES, RESPONSIBLE_GROWTH, PUBLISHED_HISTORY |
| BRANDS | INTRODUCTION, CHENNIS_BRAND, BRAND_PRODUCTS, BRAND_EXPERIENCE, BRAND_STORY |

## Complete Goods mapping

Each page_code includes PAGE_HERO first and ENQUIRY_BANNER last. Number ranges below include every two-digit suffix in the stated range, individually selectable in Admin. Product images correspond to database content lines in order; product names are not invented or changed.

| page_code | section_codes between hero and enquiry |
|---|---|
| COTTON_YARN | INTRODUCTION, YARN_RANGE, YARN_CAPABILITIES, APPLICATIONS, QUALITY, YARN_GALLERY, YARN_CAPABILITIES_01 through YARN_CAPABILITIES_12, YARN_GALLERY_01 through YARN_GALLERY_08 |
| KNITTED_FABRICS | INTRODUCTION, FABRIC_RANGE, KNIT_STRUCTURES, APPLICATIONS, KNIT_STRUCTURES_01 through KNIT_STRUCTURES_12 |
| WOVEN_FABRICS | INTRODUCTION, FABRIC_RANGE, WEAVE_CAPABILITIES, FABRIC_GALLERY, FABRIC_GALLERY_01 through FABRIC_GALLERY_14 |
| GARMENTS | INTRODUCTION, PRODUCT_RANGE, PRODUCT_RANGE_01 through PRODUCT_RANGE_08 |

Default display order now follows the selected slot index except the explicit overrides above and existing LINK_CONER/WEAVING overrides. The public InnerPage displays section photos only where matching content and active image metadata exist. Numbered product positions additionally require a corresponding product line. No unused suggested public sections were added.

## Files

Modified:

- Frontend/my-app/src/pages/AdminPage/AdminPages.jsx
- Frontend/my-app/src/pages/Framework/frameworkImages.js
- Frontend/my-app/src/pages/KnowUsBetter/KnowUsBetterShared.jsx
- Frontend/my-app/src/pages/KnowUsBetter/SpinningPage.jsx
- Backend/WebsiteAPI/websiteAdmin.test.mjs

Created: this report only.

Admin now supports the same VITE_API_URL fallback as the shared public hook. Shared Photo waits for metadata loading and attempts the binary URL before showing an error fallback, even when metadata is absent. Spinning explicitly shows a loading state until load/error. Stable URLs, aspect ratios, meaningful alternative text and separate error fallbacks are retained.

## Backend and database

No backend/API implementation changes. Inspected websiteRoutes.js: protected multipart PUT using the image field; signature and 600 KB validation; serializable update/insert by page_code + section_code; activation, audit fields and final public URL; no manual row_version update. Authentication remains unchanged. No database records were altered or deleted, no sample images uploaded, no SQL files, tables, packages or image assets created.

## Verification

- Lint: passed.
- Mock API tests: all 10 passed using node WebsiteAPI/websiteAdmin.test.mjs. Existing replacement coverage was extended to both CSR gallery positions, Spinning BALE_TRANSPORT and INTRODUCTION on each of the eight Enlightenment/Goods tabs. Authentication, file size/signature, activation, submitted identifiers/order and retrieval checks pass.
- These tests mock SQL and cannot establish actual database uniqueness or public rendering. CSR, Spinning, Enlightenment and Goods live uploads, replacements and browser display remain unverified.
- Build: sandbox spawn EPERM; permission to rerun outside the sandbox was rejected. No successful build is claimed.
- Official photographs: no live inventory was queried, so missing positions cannot be identified reliably. Any empty position still requires an official upload through the existing form.
