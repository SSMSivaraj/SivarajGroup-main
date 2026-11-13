# Enlightenment and Goods frontend review

## Follow-up review: 12 November 2026

Re-read the supplied request, route configuration, all eight API-backed page wrappers, shared renderer, image configuration and checked-in `current-content-reference.json` before editing. Revisited the seven readable old pages; Natural Energy still returned a fetch error. The comparison below remains a snapshot comparison, not confirmation of live database content. No database query or write was made.

This turn changes only `InnerPage.jsx`, `InnerPage.module.css`, and this report. All changes already staged at the start of this turn were preserved, including Admin and navigation changes. The earlier presentation implementation described below was already present.

Additional frontend corrections: Goods specifications handle Windows line endings and skip whitespace-only rows; Enlightenment and Goods paragraphs use consistent line spacing; text columns can shrink within Bootstrap rows; specification cells use tighter padding below 576px. No copy was replaced. All eight pages retain their current API text, image bindings, routes, tabs, hero and enquiry banner. Shared Credentials rendering retains its existing line parsing and receives none of these scoped CSS rules.

Current validation: `npm run lint` passed; `node docs/verify-hero-scroll.mjs` passed; `git diff --check` passed. `npm run build` failed during Vite configuration loading with sandbox `spawn EPERM`; the user rejected the requested outside-sandbox retry. The earlier eight-page fixture result below was not rerun successfully in this follow-up. Browser testing at 1440, 1024, 768 and 375px and live direct-refresh testing remain unperformed; no browser control tool is available. Unrelated page source and global styles were not changed this turn; visual equivalence is not claimed as browser-tested.

The database review targets, missing content, conflicts and assumptions in the tables below remain unresolved intentionally under the user's frontend-only restriction. In particular, missing Textile taglines, Cotton Yarn enquiry instructions and the Garments collection link cannot be restored through frontend overrides.

Reviewed 10 November 2026. Mapping prepared before implementation. Local changes only.

## Source and route mapping

Each component below lives in `Frontend/my-app/src/pages/KnowUsBetter/` and delegates to `InnerPage`. All eight load editorial rows through `useWebsitePage` from `/api/website/page-content/{page_code}`; there are no frontend editorial definitions to update. Images use the existing page-images API independently.

| Old website reference | Existing route | Component | page_code |
| --- | --- | --- | --- |
| https://www.sivaraj.co.in/textile/ | /enlightenment/textile | TextilePage.jsx | TEXTILE |
| https://www.sivaraj.co.in/education/ | /enlightenment/education | EducationPage.jsx | EDUCATION |
| https://www.sivaraj.co.in/natural-energy/ | /enlightenment/natural-energy | NaturalEnergyPage.jsx | NATURAL_ENERGY |
| https://www.sivaraj.co.in/brands/ | /enlightenment/brands | BrandsPage.jsx | BRANDS |
| https://www.sivaraj.co.in/cotton-yarn/ | /goods/cotton-yarn | CottonYarnPage.jsx | COTTON_YARN |
| https://www.sivaraj.co.in/knitted-fabrics/ | /goods/knitted-fabrics | KnittedFabricsPage.jsx | KNITTED_FABRICS |
| https://www.sivaraj.co.in/woven-fabrics/ | /goods/woven-fabrics | WovenFabricsPage.jsx | WOVEN_FABRICS |
| https://www.sivaraj.co.in/garments/ | /goods/garments | GarmentsPage.jsx | GARMENTS |

Seven old pages were readable. Natural Energy returned cache misses / HTTP 502 on repeated URL variants; it could not be independently reverified. The old Woven Fabrics page has a compromised document title; only its textile body was considered as a reference, not that title.

## Database-controlled copy left unchanged

No content was rewritten on any page. The following existing records are editorial review targets, identified by `(page_code, section_code)` in `NW_WebsitePageContent`. The checked-in `docs/current-content-reference.json` is a reference snapshot, not proof of live database state. No live database query was run. No record IDs are assumed.

| page_code | Existing section_code values to review against the old page | Review result from checked-in snapshot |
| --- | --- | --- |
| TEXTILE | INTRODUCTION, GROUP_COMPANIES, RESEARCH_DEVELOPMENT, PRODUCT_PARTNERSHIP, MANUFACTURING, CUT_N_SEW, PRODUCT_PROMOTION, DISTRIBUTION | 15 units and six supply-chain stages retained. Old stage taglines such as “Amazing Products” are absent; any restoration requires separately approved editorial updates to those stage records. |
| EDUCATION | INTRODUCTION, INSTITUTIONS, LEARNING_ENVIRONMENT, ENGINEERING_COLLEGE, EDUCATION_VISION | School locations, CBSE, SSMIET and 2011 establishment, rural education aim and ICSE intention are retained. No factual change identified. |
| NATURAL_ENERGY | INTRODUCTION, ENERGY_INITIATIVES, RESPONSIBLE_GROWTH | Existing snapshot retains captive plant location, 100 initial windmills, more than 400 later, 300 MW and 90% wind-power use. Source unavailable today; no proposed factual revision. |
| BRANDS | INTRODUCTION, CHENNIS_BRAND, BRAND_PRODUCTS, BRAND_EXPERIENCE, BRAND_STORY | 2011 launch, clothing segments, Urban/Sport/Excursion/Club and historical 2020 ambition retained. No factual change identified. |
| COTTON_YARN | INTRODUCTION, YARN_RANGE, YARN_CAPABILITIES, APPLICATIONS, QUALITY | Yarn types, blends, 10s–40s and NE 16–NE 44 retained separately. Existing snapshot lacks the old page's product-enquiry email instruction; INTRODUCTION is an existing record that could carry it after separate approval. |
| KNITTED_FABRICS | INTRODUCTION, FABRIC_RANGE, KNIT_STRUCTURES, APPLICATIONS | 17 listed fabric types, 12 gallery names and apparel application retained. No factual change identified. |
| WOVEN_FABRICS | INTRODUCTION, FABRIC_RANGE, WEAVE_CAPABILITIES | Materials, finishing processes and 14 type entries retained. Ambiguous source wording “Herringbone fabric Kashmir silk” remains intact. No reinterpretation proposed. |
| GARMENTS | INTRODUCTION, PRODUCT_RANGE | Audience, product features and eight garment categories retained. The old collection links to Chennis; a link would need a separately approved PRODUCT_RANGE button_text/button_url update, not a frontend hard-coded replacement. |

PAGE_HERO and ENQUIRY_BANNER records remain untouched on every page. No proposed update was executed. Missing source taglines and enquiry links are reported for editorial review, not treated as authorization to write records.

## Conflicts and assumptions

- Brands source says launch in 2011; the old homepage's news excerpt says 2009. Existing 2011 value and explanatory copy are preserved.
- Cotton Yarn gives 10s–40s in the general range and NE 16–NE 44 in the specification. These remain separate descriptions, not a synthesized range.
- Natural Energy snapshot records both 100% green-energy wording and 90% wind-power consumption. Retained as written; source not currently accessible for verification.
- The 2020 national-brand ambition and ICSE school intention remain historical intentions; no achievement or completion is inferred.
- Reference snapshots may differ from live database rows. No live content conflict assessment is claimed.

## Implementation and validation

Frontend files modified by this task:

- `Frontend/my-app/src/pages/KnowUsBetter/InnerPage.jsx`: scope presentation to the two affected categories; show cotton specification label/value rows and full-width descriptive lines without artificial empty-value dashes. All database text is retained.
- `Frontend/my-app/src/pages/KnowUsBetter/InnerPage.module.css`: contain section images within consistent 4:3 frames, retain their full image area, add modest corner rounding, constrain paragraph length, align catalogue entries, use two catalogue columns at tablet widths and one on mobile, and allow the specification table to fit narrow screens.

Hero, tabs, shared components, colours, fonts, enquiry banner and alternating section order are unchanged. Credentials uses the same renderer but does not receive the new class or product-table rendering.

No image files, URLs, alt text, image order, page codes, section codes, mappings, Admin upload choices, APIs or routes were changed by this task. No database operations were executed. Backend and Admin files were not edited by this task. There were already staged changes in navigation, layout, Admin and InnerPage when work began; those changes were preserved. This distinction matters when reviewing the total working-tree diff.

Validation:

- `npm run lint`: passed.
- `npm run build`: blocked by sandbox `spawn EPERM` while Vite loaded configuration. Requested outside-sandbox retry was rejected by the user. No successful production build is claimed.
- `node docs/verify-current-routes.mjs`: the four Enlightenment pages passed, then the test failed because it expects the old “Goods pages” accessible label while existing navigation now uses “Products pages.” This pre-existing label mismatch was not changed in product code.
- A temporary version of that existing rendering check, restricted to these eight pages and using the current Products label, passed all eight. It checked one H1 per page, database hero bindings, all snapshot content, primary image bindings, navigation and missing-image fallbacks. Temporary check files were removed. These are fixture-based server rendering checks, not live API/browser tests.
- `node docs/verify-hero-scroll.mjs`: passed hero states, navigation top reset, anchor handling and history restoration.
- `git diff --check`: passed.
- Browser verification at 1440, 1024, 768 and 375px was not performed. Responsive CSS was reviewed, but overlap, actual image appearance, tab usability and hero overlay visibility at those widths remain unverified. Direct URL refresh on the deployed host also remains unverified; route definitions and hosting configuration were not changed.

The authorized frontend presentation work is complete. Editorial changes remain intentionally unexecuted because all eight pages are database-controlled. No assumption was made about current capacities, certifications, historical ambitions, or live database contents.
