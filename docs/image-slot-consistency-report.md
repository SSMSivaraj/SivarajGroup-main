# Image-slot and UI consistency correction

Work stayed local. No database reads against the live server, writes, migrations, uploads, replacements, or deletions were performed. Routes, Header, Footer, backend production code, Admin authentication and layout are unchanged.

## Files modified and created

Modified production files (paths below are relative to `Frontend/my-app/src/`):

- `Components/PageHero/PageHero.jsx` and `FrameworkSplitHero.jsx`: identify existing logical image positions for validation.
- `pages/AdminPage/AdminPages.jsx` and `imageConfiguration.js`: derive all options from the public registry and exclude unsupported records from upload/replace actions.
- `pages/Framework/FrameworkPage.jsx`, `FrameworkPage.module.css`, `frameworkImages.js` and `validateImagePositions.js`: CSS-only enquiry, missing-photo collapse, Inspection slot removal and contract checks.
- `pages/KnowUsBetter/KnowUsBetterShared.jsx`, `KnowUsBetter.module.css`, `InnerPage.jsx`, `CSRPage.jsx`, `SpinningPage.jsx`, `WeavingPage.jsx`, `knowUsBetterImages.js` and `sectionConfig.js`: shared banner/hero treatment, registry-bound images, removed text-only/duplicate bindings and preserved editorial content.
- `pages/WelcomeWayPage/WelcomeWayPage.jsx`: validation attributes on the existing database-backed fabric slide; no visual change.

Created production files:

- `Frontend/my-app/src/config/imageSlots.js`
- `Frontend/my-app/src/Components/EnquiryBanner/EnquiryBanner.jsx`
- `Frontend/my-app/src/Components/EnquiryBanner/EnquiryBanner.module.css`

Updated checks: `docs/verify-current-routes.mjs`, `docs/verify-framework-navigation.mjs`, `docs/verify-know-us-better.mjs`. Created the whole-site check `docs/verify-image-slots.mjs`, the detailed `docs/image-slot-audit.json`, and this report. No backend production files were modified.

## Hero and tabs

Management Team previously had portrait-specific `contain`, narrow copy, dark-text and mobile stacking rules that diverged from the shared hero. It now retains the shared `Hero` → `PageHero` and `PageGroupTabs` structure, height, content width, heading placement, spacing, overlay and mobile shell. Only the existing portrait framing is scoped: `cover`, a right-hand image area on desktop, top-biased positioning, and full width on mobile. The original MD photograph is preserved as fallback. Database preference remains `MANAGEMENT_TEAM/PAGE_HERO`; Admin has one Page Hero option. The mild background blends the existing photograph’s white background into the hero without editing the image file.

The existing four tabs remain directly below the hero in Company Profile, Management Team, CSR and Global Presence, using NavLink, existing routes, active styling, horizontal scrolling and visible keyboard focus.

## Shared configuration and enquiry banner

`src/config/imageSlots.js` composes the existing public domain definitions into a single registry consumed by Admin and public Photo renderers. Each slot includes pageCode, sectionCode, label/adminLabel, publicPurpose, displayOrder and isUploadable. The development check compares configuration and actual page markup, detects duplicate keys/orders and label/code/count mismatches, and never renders debug output in production.

Every applicable page now uses `EnquiryBanner`, a shared CSS-only dark-green/ivory/gold shell. Existing page-specific text and CTAs are preserved. ENQUIRY_BANNER is absent from every upload list and no longer requested as an image. Existing database content with that section code continues to supply banner copy.

## Complete Admin/public mapping

There are 180 unique uploadable positions across 20 pages. Display order is the list order below, starting at 1. Optional slots render when their existing section/gallery is present; Framework optional photos disappear when missing or failed rather than showing empty cards. The two Framework hero panels retain their intentional neutral fallbacks.

| Page code | Admin positions | Public positions |
| --- | ---: | ---: |
| TEXTILE | 4 | 4 |
| EDUCATION | 4 | 4 |
| NATURAL_ENERGY | 4 | 4 |
| BRANDS | 4 | 4 |
| COTTON_YARN | 24 | 24 |
| KNITTED_FABRICS | 16 | 16 |
| WOVEN_FABRICS | 18 | 18 |
| GARMENTS | 12 | 12 |
| CREDENTIALS_CERTIFICATIONS | 6 | 6 |
| CREDENTIALS_REWARDS | 3 | 3 |
| SPINNING | 18 | 18 |
| KNITTING | 7 | 7 |
| WEAVING | 10 | 10 |
| GARMENTING | 12 | 12 |
| HOME_TEXTILES | 7 | 7 |
| COMPANY_PROFILE | 7 | 7 |
| MANAGEMENT_TEAM | 5 | 5 |
| CSR | 11 | 11 |
| GLOBAL_PRESENCE | 6 | 6 |
| WELCOME_WAY | 2 | 2 |

- **TEXTILE:** PAGE_HERO, INTRODUCTION, MANUFACTURING, DISTRIBUTION.
- **EDUCATION:** PAGE_HERO, INTRODUCTION, INSTITUTIONS, ENGINEERING_COLLEGE.
- **NATURAL_ENERGY:** PAGE_HERO, INTRODUCTION, ENERGY_INITIATIVES, RESPONSIBLE_GROWTH.
- **BRANDS:** PAGE_HERO, INTRODUCTION, CHENNIS_BRAND, BRAND_PRODUCTS.
- **COTTON_YARN:** PAGE_HERO, INTRODUCTION, YARN_CAPABILITIES, APPLICATIONS, YARN_CAPABILITIES_01, YARN_CAPABILITIES_02, YARN_CAPABILITIES_03, YARN_CAPABILITIES_04, YARN_CAPABILITIES_05, YARN_CAPABILITIES_06, YARN_CAPABILITIES_07, YARN_CAPABILITIES_08, YARN_CAPABILITIES_09, YARN_CAPABILITIES_10, YARN_CAPABILITIES_11, YARN_CAPABILITIES_12, YARN_GALLERY_01, YARN_GALLERY_02, YARN_GALLERY_03, YARN_GALLERY_04, YARN_GALLERY_05, YARN_GALLERY_06, YARN_GALLERY_07, YARN_GALLERY_08.
- **KNITTED_FABRICS:** PAGE_HERO, INTRODUCTION, FABRIC_RANGE, APPLICATIONS, KNIT_STRUCTURES_01, KNIT_STRUCTURES_02, KNIT_STRUCTURES_03, KNIT_STRUCTURES_04, KNIT_STRUCTURES_05, KNIT_STRUCTURES_06, KNIT_STRUCTURES_07, KNIT_STRUCTURES_08, KNIT_STRUCTURES_09, KNIT_STRUCTURES_10, KNIT_STRUCTURES_11, KNIT_STRUCTURES_12.
- **WOVEN_FABRICS:** PAGE_HERO, INTRODUCTION, FABRIC_RANGE, FABRIC_GALLERY, FABRIC_GALLERY_01, FABRIC_GALLERY_02, FABRIC_GALLERY_03, FABRIC_GALLERY_04, FABRIC_GALLERY_05, FABRIC_GALLERY_06, FABRIC_GALLERY_07, FABRIC_GALLERY_08, FABRIC_GALLERY_09, FABRIC_GALLERY_10, FABRIC_GALLERY_11, FABRIC_GALLERY_12, FABRIC_GALLERY_13, FABRIC_GALLERY_14.
- **GARMENTS:** PAGE_HERO, INTRODUCTION, PRODUCT_RANGE, GARMENT_APPLICATIONS, PRODUCT_RANGE_01, PRODUCT_RANGE_02, PRODUCT_RANGE_03, PRODUCT_RANGE_04, PRODUCT_RANGE_05, PRODUCT_RANGE_06, PRODUCT_RANGE_07, PRODUCT_RANGE_08.
- **CREDENTIALS_CERTIFICATIONS:** PAGE_HERO, QUALITY_SYSTEMS, CERTIFICATION_GALLERY, CERTIFICATE_PRIMARY, CERTIFICATE_SECONDARY, CERTIFICATE_TERTIARY.
- **CREDENTIALS_REWARDS:** PAGE_HERO, INTRODUCTION, REWARD_GALLERY.
- **SPINNING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, BLOW_ROOM_PRIMARY, BLOW_ROOM_SECONDARY, CARDING, COMBER, DRAW_FRAME, SIMPLEX, RING_SPINNING, LINK_CONER_PRIMARY, LINK_CONER_SECONDARY, BALE_TRANSPORT, LINK_CONER, YARN_CONDITIONING, OE_BLOW_ROOM, OE_DRAW_FRAME, OE_WINDING.
- **KNITTING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, KNITTING_FLOOR, TECHNOLOGY, QUALITY_CONTROL, PRODUCT_CAPABILITY.
- **WEAVING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, WARPING, SIZING, DRAWING_IN, LOOM_WEAVING, INSPECTION_PRIMARY, INSPECTION_SECONDARY, PACKING.
- **GARMENTING:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, FABRIC_STORE, FABRIC_INSPECTION, CUTTING, CUT_PANEL_CHECKING, SEWING_UNIT_ONE, SEWING_UNIT_TWO, IRONING_FINISHING, PACKING, QUALITY_CONTROL.
- **HOME_TEXTILES:** PAGE_HERO_1, PAGE_HERO_2, INTRODUCTION, BED_LINEN, KITCHEN_DINING, DESIGN_AND_FINISHING, QUALITY.
- **COMPANY_PROFILE:** PAGE_HERO, INTRODUCTION, LEGACY, MANUFACTURING_STRENGTH, INTEGRATED_CAPABILITIES, QUALITY_COMMITMENT, COMPANY_HIGHLIGHT.
- **MANAGEMENT_TEAM:** PAGE_HERO, LEADERSHIP_INTRODUCTION, MANAGING_DIRECTOR, LEADERSHIP_MESSAGE, LEADERSHIP_VALUES.
- **CSR:** PAGE_HERO, CSR_INTRODUCTION, COMMUNITY, EDUCATION, HEALTH_WELLBEING, RAIN_WATER_HARVESTING, WIND_MILL, TREE_PLANTATION, EMPLOYEE_WELFARE, CSR_GALLERY_PRIMARY, CSR_GALLERY_SECONDARY.
- **GLOBAL_PRESENCE:** PAGE_HERO, GLOBAL_INTRODUCTION, INDIA_PRESENCE, INTERNATIONAL_PRESENCE, CHENNIS_BRAND, GLOBAL_CAPABILITIES.
- **WELCOME_WAY:** FABRIC_ROLLS, HEADER_GRAPHICS.

Exact display labels, purposes and orders are recorded in [image-slot-audit.json](image-slot-audit.json). WELCOME_WAY/HEADER_GRAPHICS is the existing shared header graphic and is verified against its unchanged component source; it was not redesigned.

## Removed options and image bindings

Removed 48 unsupported Admin options:

- **TEXTILE:** GROUP_COMPANIES, RESEARCH_DEVELOPMENT, PRODUCT_PARTNERSHIP, CUT_N_SEW, PRODUCT_PROMOTION, ENQUIRY_BANNER.
- **EDUCATION:** LEARNING_ENVIRONMENT, EDUCATION_VISION, ENQUIRY_BANNER.
- **NATURAL_ENERGY:** PUBLISHED_HISTORY, ENQUIRY_BANNER.
- **BRANDS:** BRAND_EXPERIENCE, BRAND_STORY, ENQUIRY_BANNER.
- **COTTON_YARN:** YARN_RANGE, QUALITY, YARN_GALLERY, ENQUIRY_BANNER.
- **KNITTED_FABRICS:** KNIT_STRUCTURES, ENQUIRY_BANNER.
- **WOVEN_FABRICS:** WEAVE_CAPABILITIES, ENQUIRY_BANNER.
- **GARMENTS:** ENQUIRY_BANNER.
- **CREDENTIALS_CERTIFICATIONS:** INTRODUCTION, COMPLIANCE, ENQUIRY_BANNER.
- **CREDENTIALS_REWARDS:** RECOGNITION, OEKO_TEX, GOTS, ENQUIRY_BANNER.
- **SPINNING:** ENQUIRY_BANNER.
- **KNITTING:** ENQUIRY_BANNER.
- **WEAVING:** QUALITY_CONTROL, ENQUIRY_BANNER.
- **GARMENTING:** ENQUIRY_BANNER.
- **HOME_TEXTILES:** ENQUIRY_BANNER.
- **WELCOME_WAY:** PAGE_HERO.
- **COMPANY_PROFILE:** ENQUIRY_BANNER, WHO_WE_ARE, FIBRE_TO_FASHION, GLOBAL_PRESENCE, CORPORATE_PROFILE.
- **MANAGEMENT_TEAM:** MANAGEMENT_TEAM, ENQUIRY_BANNER.
- **CSR:** ENVIRONMENT, ENQUIRY_BANNER.
- **GLOBAL_PRESENCE:** MARKET_MAP, ENQUIRY_BANNER.

Weaving’s Inspection retains its heading/content and INSPECTION_PRIMARY/INSPECTION_SECONDARY; only the third QUALITY_CONTROL image is removed. Generic text-only InnerPage sections no longer acquire images merely because arbitrary metadata exists. Existing intended primary, product and document image containers remain. No new public images were added to justify Admin options.

The duplicate CSR EDUCATION gallery photograph was removed; its SSM School caption and the original Education image/content remain. CSR/ENVIRONMENT remains a read-only legacy fallback for TREE_PLANTATION, with one canonical upload position. Content-only MANAGEMENT_TEAM and MARKET_MAP have no upload options. Company Profile aliases that are only read as text were removed from uploads.

Spinning’s LINK_CONER and BALE_TRANSPORT are retained as valid optional upload positions because both have real image containers in the existing final layout. They no longer render placeholder messages, figures or empty supplementary columns when metadata is missing. Real uploaded images remain usable. Main process photos likewise disappear on failure; verified process text remains. Framework pending sections retain their text/navigation targets without empty image cards.

Global Presence’s actual JSX has six valid image positions, including conditional INTERNATIONAL_PRESENCE, CHENNIS_BRAND and GLOBAL_CAPABILITIES. These were retained, contrary to the three-position example, because the request explicitly requires actual JSX as the source of truth. MARKET_MAP is text/SVG only and was removed from uploads.

## Database review (no deletion)

The checked-in snapshot identifies these now-unused rows; live existence is unverified:

- GARMENTING/ENQUIRY_BANNER
- KNITTING/ENQUIRY_BANNER

Legacy Framework PAGE_HERO and CSR/ENVIRONMENT are still read by compatibility fallbacks and are not classified as unused. Review the removed pairs using this optional SELECT; it has not been executed:

```sql
WITH RemovedSlots(page_code, section_code) AS (
  SELECT page_code, section_code FROM (VALUES
    ('TEXTILE', 'GROUP_COMPANIES'),
    ('TEXTILE', 'RESEARCH_DEVELOPMENT'),
    ('TEXTILE', 'PRODUCT_PARTNERSHIP'),
    ('TEXTILE', 'CUT_N_SEW'),
    ('TEXTILE', 'PRODUCT_PROMOTION'),
    ('TEXTILE', 'ENQUIRY_BANNER'),
    ('EDUCATION', 'LEARNING_ENVIRONMENT'),
    ('EDUCATION', 'EDUCATION_VISION'),
    ('EDUCATION', 'ENQUIRY_BANNER'),
    ('NATURAL_ENERGY', 'PUBLISHED_HISTORY'),
    ('NATURAL_ENERGY', 'ENQUIRY_BANNER'),
    ('BRANDS', 'BRAND_EXPERIENCE'),
    ('BRANDS', 'BRAND_STORY'),
    ('BRANDS', 'ENQUIRY_BANNER'),
    ('COTTON_YARN', 'YARN_RANGE'),
    ('COTTON_YARN', 'QUALITY'),
    ('COTTON_YARN', 'YARN_GALLERY'),
    ('COTTON_YARN', 'ENQUIRY_BANNER'),
    ('KNITTED_FABRICS', 'KNIT_STRUCTURES'),
    ('KNITTED_FABRICS', 'ENQUIRY_BANNER'),
    ('WOVEN_FABRICS', 'WEAVE_CAPABILITIES'),
    ('WOVEN_FABRICS', 'ENQUIRY_BANNER'),
    ('GARMENTS', 'ENQUIRY_BANNER'),
    ('CREDENTIALS_CERTIFICATIONS', 'INTRODUCTION'),
    ('CREDENTIALS_CERTIFICATIONS', 'COMPLIANCE'),
    ('CREDENTIALS_CERTIFICATIONS', 'ENQUIRY_BANNER'),
    ('CREDENTIALS_REWARDS', 'RECOGNITION'),
    ('CREDENTIALS_REWARDS', 'OEKO_TEX'),
    ('CREDENTIALS_REWARDS', 'GOTS'),
    ('CREDENTIALS_REWARDS', 'ENQUIRY_BANNER'),
    ('SPINNING', 'ENQUIRY_BANNER'),
    ('KNITTING', 'ENQUIRY_BANNER'),
    ('WEAVING', 'QUALITY_CONTROL'),
    ('WEAVING', 'ENQUIRY_BANNER'),
    ('GARMENTING', 'ENQUIRY_BANNER'),
    ('HOME_TEXTILES', 'ENQUIRY_BANNER'),
    ('WELCOME_WAY', 'PAGE_HERO'),
    ('COMPANY_PROFILE', 'ENQUIRY_BANNER'),
    ('COMPANY_PROFILE', 'WHO_WE_ARE'),
    ('COMPANY_PROFILE', 'FIBRE_TO_FASHION'),
    ('COMPANY_PROFILE', 'GLOBAL_PRESENCE'),
    ('COMPANY_PROFILE', 'CORPORATE_PROFILE'),
    ('MANAGEMENT_TEAM', 'MANAGEMENT_TEAM'),
    ('MANAGEMENT_TEAM', 'ENQUIRY_BANNER'),
    ('CSR', 'ENVIRONMENT'),
    ('CSR', 'ENQUIRY_BANNER'),
    ('GLOBAL_PRESENCE', 'MARKET_MAP'),
    ('GLOBAL_PRESENCE', 'ENQUIRY_BANNER')
  ) AS slots(page_code, section_code)
)
SELECT i.image_id, i.page_code, i.section_code, i.image_name, i.is_active, i.updated_at
FROM dbo.NW_WebsitePageImages AS i
INNER JOIN RemovedSlots AS r
  ON r.page_code = i.page_code AND r.section_code = i.section_code
ORDER BY i.page_code, i.section_code;
```

The SELECT includes CSR/ENVIRONMENT for review, but that legacy row may still be serving TREE_PLANTATION and must not be considered unused solely because its upload option is removed.

## Verification

- Frontend lint: passed.
- Production build: passed with `npm run build -- --configLoader native`. The normal Vite config loader has an existing sandbox subprocess restriction; project build configuration was not changed.
- `node docs/verify-image-slots.mjs`: passed; all 20 pages, available/missing images, exact rendered/upload counts, no duplicate logical slots, enquiry images excluded, valid four-tab ordering/active routes. Header graphic verified against existing source.
- `node docs/verify-framework-navigation.mjs`: passed; all five Framework pages and missing-photo cases.
- `node docs/verify-current-routes.mjs`: passed; existing routes and retained Enlightenment/Goods/Credentials editorial content.
- `node docs/verify-hero-scroll.mjs` and `node docs/verify-framework-interactions.mjs`: passed; hero fallback and navigation callbacks.
- `node Backend/WebsiteAPI/frameworkHero.test.mjs`: passed; existing upload/delete handlers with mock SQL, no live writes or HTTP integration.
- Backend route/server syntax checks: passed. The existing MODULE_TYPELESS_PACKAGE_JSON warning is unrelated and was left unchanged.
- `node docs/verify-know-us-better.mjs`: passed; source paragraphs, one hero per page, fallback portrait, Admin counts and existing image limits. Its count assertion was updated to the deliberately reconciled counts.
- No browser automation tool is available. CSS behavior at 1440, 1024, 768 and 375px was reviewed, but real visual/overflow/keyboard checks at those widths are not claimed as passed.

## Assumptions

Existing explicit image components, configured product ranges and document galleries are intended upload positions; generic text-only database rows are not. Optional existing image positions remain uploadable even before an image is supplied. The checked-in image snapshot is evidence about prior state, not live database truth. MD cover framing follows the latest attached request, replacing the previous contain/full-portrait rule.
