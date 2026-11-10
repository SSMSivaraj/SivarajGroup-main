# Know Us Better implementation report

Reviewed on 29 October 2026. Local implementation only; no publication, uploads, SQL writes, new tables, new API routes or added packages.

## Authoritative pages reviewed

- [Company Profile](https://www.sivaraj.co.in/company-profile)
- [Management Team](https://www.sivaraj.co.in/management-team)
- [CSR](https://www.sivaraj.co.in/csr)
- [Global Presence](https://www.sivaraj.co.in/global-presence)
- [Brands](https://www.sivaraj.co.in/brands), for Chennis content only

The browser retrieval service intermittently failed for CSR and Global Presence. Direct HTTPS retrieval from `https://sivaraj.co.in/<slug>/` succeeded for all five. The reference snapshot is `know-us-better-reference/verified-content.json`. It includes all textual company, management and CSR sections, the global statement, and the published map's 61 active country/territory markers and coordinates. Full website HTML, tracking scripts and API keys are not retained.

## Existing files inspected

- `Frontend/my-app/src/App.jsx`, `main.jsx`, `index.css`, `vite.config.js`, `package.json`
- `src/Components/SiteHeader/SiteHeader.jsx`, `src/layouts/PublicLayout/PublicLayout.jsx`
- All four original Know Us Better page components and `InnerPage.jsx`
- `SpinningPage.jsx`, `BrandsPage.jsx`, `Framework/FrameworkPage.jsx`, `Framework/frameworkImages.js`
- `WelcomeWayPage/WelcomeWayPage.jsx` and its first leadership photograph
- `AdminPage/AdminPages.jsx` and its existing section configuration, metadata preview, authentication and upload calls
- `Backend/WebsiteAPI/websiteRoutes.js`, including content and image retrieval and upload validation; `Backend/server.js`
- Existing `WebsiteImageSource/Framework/HomeTextiles` storage convention

Existing content/image helpers live inside `InnerPage.jsx`, `CompanyProfilePage.jsx` and `FrameworkPage.jsx`; they are not a shared standalone service. The new helpers apply the same API contracts solely to the four requested pages. They support both existing API base environment names and relative `/api` URLs through the unchanged Vite proxy.

Read-only requests to the running backend returned HTTP 200 and empty active content/image arrays for COMPANY_PROFILE, MANAGEMENT_TEAM, CSR and GLOBAL_PRESENCE; BRANDS was also empty. No verified database content was overwritten. Future database rows remain visible, including legacy or additional section codes. When a database replacement differs from an original section, the published source wording remains visibly available below it rather than being discarded.

## Routes and navigation

The existing router already declares these routes exactly once; no route or header edits were necessary:

1. `/know-us-better/company-profile`
2. `/know-us-better/management-team`
3. `/know-us-better/csr`
4. `/know-us-better/global-presence`

The existing dropdown contains those pages in that order. The existing `/know-us-better` redirect is retained. Related navigation on each new page links to the other three. The verified Chennis destination is `/enlightenment/brands`, backed by `BrandsPage.jsx`. That page is unchanged.

## Old → existing new → final mapping

| Old section | Previous new-page state | Final section | Relevant image / gap |
| --- | --- | --- | --- |
| Company: Legacy of Excellence, first paragraph | Generic journey and undated synthetic milestones | LEGACY; original heritage paragraph | LEGACY; approved photograph needed; no invented timeline |
| Company: remaining Legacy description | Short WHO_WE_ARE summary | INTRODUCTION; full group membership, manufacturing-unit count, diversified interests, experience and portfolios | INTRODUCTION; approved facility photo needed |
| Four product portfolios | Generic capability cards | INTEGRATED_CAPABILITIES; four editorial portfolio labels | INTEGRATED_CAPABILITIES; approved products photo needed |
| Renowned Business House | Short generic global text | MANUFACTURING_STRENGTH; complete factory, headquarters, office and export description; also shown under Global INDIA_PRESENCE | Approved company photographs needed |
| Perfection in Quality | Abbreviated/general copy | QUALITY_COMMITMENT; complete original paragraph | Approved quality-review photo needed |
| Spectacular Growth | Generic growth journey | COMPANY_HIGHLIGHT; full original text including the old revenue target | Approved operations photo; source target explicitly identified as undated |
| Vision, Mission, Core Value | Shortened fallbacks | Three philosophy cards with full wording | No image required for readable text |
| Management introduction | One-sentence generic introduction | LEADERSHIP_INTRODUCTION; full strategy/operations paragraph | Approved non-personal operations photograph needed |
| Shri.K.Sivaraj / Managing Director | No fallback biography | MANAGING_DIRECTOR; complete biography | Hero reuses Welcome Way asset; separate approved profile image optional |
| Subrata Pal / CEO – Apparel & Brand | Database-only members | Management card; complete biography | Text cards; no substituted portraits |
| Sanjay Drolia / President – Weaving | Database-only members | Management card; both original paragraphs | Old image filename says `karnan-ssm.jpg`; identity not inferred from filename; no portrait reused |
| Sendurgani / GM – Operation Weaving | Database-only members | Management card; both original paragraphs | No portrait invented |
| Moorthy / GM – Operation Spinning | Database-only members | Management card; full biography, machinery references and historical figures | No portrait invented |
| Management message | Generic invented message-like copy | No default message; LEADERSHIP_MESSAGE only when supplied by existing database content | No manufactured quotation |
| CSR trust introduction | Generic social-commitment sentence | CSR_INTRODUCTION; complete original trust paragraph | Approved community photo needed |
| Marriage Hall | Short generic community summary | COMMUNITY; complete original paragraph and Tirupur reference | Use actual approved hall photograph |
| SSM School | Short generic education summary | EDUCATION; complete beneficiary description | Use actual approved school photograph |
| Rain Water Harvesting | Short environment summary | ENVIRONMENT / Rain Water Harvesting; complete original paragraph | Approved harvesting image if desired; text fully accessible |
| Wind Mill | Numerical and historical details omitted | ENVIRONMENT / Wind Mill; complete original text including 2005, turbines, capacity and power share | Historical figures identified as published-profile figures |
| Tree Plantation | Short environment summary | ENVIRONMENT / Tree Plantation; complete original paragraph | Generated sapling-care illustration available |
| Free Food Distribution | Generic reference inside COMMUNITY | Dedicated titled section using CSR_GALLERY_PRIMARY | Source has a title and photograph, no explanatory paragraph; no beneficiaries or quantities invented |
| CSR healthcare | Unsupported generic placeholder | No default health section | HEALTH_WELLBEING slot retained for future verified database content |
| Employee welfare | No distinct verified old-site section | School beneficiaries retained in education; no extra unsupported programme | EMPLOYEE_WELFARE reserved, content-dependent |
| Global introduction | Generic international-relations statement | GLOBAL_INTRODUCTION; original statement of exports to 60 countries across five continents | Generated textile/logistics illustration available |
| Global interactive Google map | Generic WORLD_MAP placeholder | MARKET_MAP; code-rendered longitude/latitude map, selection control and always-visible complete market list | Published coordinates; no invented country borders or office locations |
| Chennis | Missing from Global Presence | Explore Chennis feature using verified brand summary and existing internal route | Approved brand photograph absent; no invented logo or launch date |
| Global capabilities | Generic export partnership text | Four verified textile product portfolios | Generated yarn/fabric/garment illustration available |

## Content retained unchanged

All nonempty paragraphs from the original Company Profile, Management Team and CSR pages are retained word for word in the source fallback, with HTML entities decoded and whitespace normalized. Company Legacy is divided between introduction and legacy without removing either paragraph. All five management names and designations are retained. All six CSR activity titles remain visible, including Free Food Distribution, which originally has no body text. All six original core values are retained. The Global Presence export statement and all 61 published active map markers are retained.

Only market-label spelling is normalized: `Netherland` → `Netherlands`, `Srilanka` → `Sri Lanka`, `Newzealand` → `New Zealand`. Original labels and exact coordinates remain in the snapshot. `Swaziland`, `Korea`, `Hong Kong`, `Macao` and `Taiwan` remain as published market labels; no new political or office-location claims are made. India is a domestic marker, alongside 60 other markers. The Company Profile says **more than 60** countries while Global Presence says **60**; each original statement is retained in its original context rather than silently reconciled.

Historical source figures are not recalculated or presented as new 2026 facts. The company's undated two-year revenue target remains readable with an explicit source note. Management tenure, CSR wind-power figures and all other historical quantitative statements remain attributed to the published profile.

## Management hero exception

The first Welcome Way slide imports `src/assets/slideshow/leadership.jpeg`, labelled Leadership, and displays it with `objectFit: contain`. Management Team imports that exact existing asset, with eager loading and high fetch priority, preserving its portrait composition. It has no page_code or section_code: this particular Welcome Way image is **not database-backed**. `WELCOME_WAY/FABRIC_ROLLS` is the second slide and is not the MD photograph.

No binary was copied, uploaded, replaced or changed for the MD image. The explicit hero-reuse request takes precedence over the general database-only-image requirement for this one image. All other public page photographs use the existing database API. MANAGEMENT_TEAM/PAGE_HERO remains in Admin configuration as requested but deliberately does not override the shared Welcome Way hero reference.

## Image and Admin behaviour

All 33 requested image section codes are configured. Company Profile's existing legacy Admin entries are also retained. SPINNING, KNITTING, WEAVING and GARMENTING configurations are unchanged. Admin markup, layout, roles, authentication, upload implementation and 600 KB validation are unchanged. No removed planning section was added.

Photo URLs use `GET /api/website/page-images/:pageCode/:sectionCode`; metadata comes from the existing page image listing endpoint. Hero images load eagerly with high priority; supporting photos load lazily. Missing supporting images show a compact ivory placeholder; missing hero photographs leave a compact ivory title section. Page/section identifiers are logged only in development. Public visitors see no technical error messages. Content uses `GET /api/website/page-content/:pageCode` and the existing `NW_WebsitePageContent` table contract.

The map is rendered in code, so MARKET_MAP does not require a bitmap. Reserved Management Team, health, welfare and international supporting sections do not assert unsupported activities merely because an image slot exists. See `know-us-better-image-uploads.md` for every slot and the generated asset/prompt manifest.

## Files modified

- `Frontend/my-app/src/pages/KnowUsBetter/CompanyProfilePage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/ManagementTeamPage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/CSRPage.jsx`
- `Frontend/my-app/src/pages/KnowUsBetter/GlobalPresencePage.jsx`
- `Frontend/my-app/src/pages/AdminPage/AdminPages.jsx` — import and section configuration only

## Files created

- `src/pages/KnowUsBetter/KnowUsBetterShared.jsx`
- `src/pages/KnowUsBetter/KnowUsBetter.module.css` — scoped styles, no global changes
- `src/pages/KnowUsBetter/useWebsitePage.js`
- `src/pages/KnowUsBetter/knowUsBetterImages.js`
- `src/pages/KnowUsBetter/verifiedContent.js`
- `docs/know-us-better-reference/verified-content.json`
- `docs/verify-know-us-better.mjs`
- This report and `docs/know-us-better-image-uploads.md`
- `WebsiteImageSource/KnowUsBetter/README.md`, three original PNGs and three optimized JPEGs listed in the upload guide. This source-image tree is ignored by the project's pre-existing `.gitignore`; the assets are saved locally and have not been staged.

## Verification and limits

- `npm run lint`: PASS after correcting the new shared hook's Fast Refresh export boundary.
- `node docs/verify-know-us-better.mjs`: PASS. Uses existing installed tooling to render the four page components inside a router without starting a server. Verifies one h1 per page, every original source paragraph, all management names/designations, all market labels, exact leadership asset reference, Chennis destination, database override retention, requested image-slot counts and JPEG byte limits.
- `npm run build`: NOT VERIFIED. Vite was blocked by `spawn EPERM` during config loading. The requested outside-sandbox retry was declined; no alternate production build was attempted.
- Routes and dropdown order: confirmed by source inspection. Component rendering: passes. Actual browser direct entry, route refresh, dropdown keyboard interaction, image-error transitions and mobile/tablet overflow: NOT VERIFIED in a browser. Scoped responsive Bootstrap layouts and breakpoints are implemented, but visual/browser checks remain outstanding.
- Backend read-only content/image API checks: HTTP 200, empty active arrays. No authenticated upload performed.
- Diff scope: only the four existing public page components and Admin image configuration modified. All other original staged files were preserved. Header, footer, global CSS, Welcome Way and its MD binary, Enlightenment, Goods, Framework, backend, authentication and package inputs are unchanged.

## Unverified information intentionally not added

No new dates, capacities, awards, certifications, customers, export markets, portraits or CSR impact totals. No standalone healthcare programme or unsupported employee-welfare programme. No manufactured MD message. No exact office location inferred from country coordinates. No current 2026 claim inferred from an old figure. The Brands page says Chennis launched in 2011 while older news snippets mention 2009; the Global Presence feature omits the disputed launch date. No Chennis international presence is inferred from textile export markers.
