# Framework content mapping — before implementation

Reference pages checked on 29 October 2026:
- https://www.sivaraj.co.in/infrastructure/knitting
- https://www.sivaraj.co.in/infrastructure/weaving
- https://www.sivaraj.co.in/infrastructure/garmenting

The existing three route components use InnerPage and the existing database content API, with incomplete static fallback copy. All three content and image metadata endpoints returned empty arrays before changes. Preserve the database architecture; populate only these empty pages through an explicit preparation script, never application startup. Existing routes and dropdown order are correct.

| Old content | New database section | Supporting picture | Missing/conflicting information |
| --- | --- | --- | --- |
| Knitting introductory paragraph, 270 machines, fabric range, high-leg roll weight | INTRODUCTION | INTRODUCTION | Existing fallback omitted capacities; retain the published figures |
| 216 Pailung circular machines, 32 open-width machines, 200 kg high-leg capacity | TECHNOLOGY | KNITTING_FLOOR / TECHNOLOGY | These are distinct published figures; do not infer a breakdown of 270 |
| Fabric structures, 50–60 tons/day, diameter 18–32 inches, gauge 18–28 | PRODUCT_CAPABILITY | PRODUCT_CAPABILITY | Preserve source gauge notation, even though its unit is unclear |
| GOTS organic-certified unit | QUALITY_CONTROL | QUALITY_CONTROL | Verified as a published claim; current certificate validity was not independently established |
| Weaving machinery table | INTRODUCTION | INTRODUCTION | Counts 146 + 24 + 60 total 230; narrative also says 230, retain each specification |
| Warping, annual/day capacity, sectional facility | WARPING | WARPING | Source says “sectional weaving”; retain rather than assume a correction |
| Benninger/Karlmayer sizing, Pleva, auto-creel, capacity | SIZING | SIZING | Preserve all details |
| Loom brands, facilities, daily capacity, count and thread-count ranges | LOOM_WEAVING | LOOM_WEAVING | Existing fallback omitted all specifications |
| Physical inspection, 25 machines/software, American four-point system, daily capacity | QUALITY_CONTROL | INSPECTION_PRIMARY + INSPECTION_SECONDARY | Source's 24 points per 100 linear metres retained exactly in meaning |
| Roll, bale, pallet packing for local/export customer needs | PACKING | PACKING | No additional packing claims |
| Garmenting 150 machines / 1,000 pieces/day / 200 workers | INTRODUCTION | INTRODUCTION | Source does not confirm separate Unit 1/Unit 2 operations |
| Complete men's apparel categories, fabrics and fits | MENS_APPAREL | No unverified product image | Retain each specification visibly |
| Complete underwear, children's, T-shirt, shorts, yoga and leggings specifications | UNDER_GARMENTS | No unverified product image | Keep original abbreviations; do not expand unknown terms |
| Dhotis, wedding sets, party wear and junior party wear | TRADITIONAL_WEAR | No unverified product image | Retain fabrics, sizes, borders and set contents |
| Drawing-in and garment process stages | Image-led labels only when uploaded | Corresponding section codes | No process explanations, quality claims or sewing-unit split invented |

## Source photographs

None of the requested original photographs are present in the checkout or database. All filename assignments below are **provisional**, pending visual inspection; no photograph has been uploaded, substituted or bundled. Hero choice cannot yet be made.

| Page | Original filename | Candidate section code |
| --- | --- | --- |
| KNITTING | Knitting(1).jpg | PAGE_HERO (compare both originals first) |
| KNITTING | Knitting1.jpg | KNITTING_FLOOR or TECHNOLOGY |
| WEAVING | 1 SSM dindigul(1).png | PAGE_HERO or INTRODUCTION |
| WEAVING | 2 warpping(1).png | WARPING |
| WEAVING | 3 SIZING(1).png | SIZING |
| WEAVING | 4 DRWAING(1).png | DRAWING_IN |
| WEAVING | 5 LOOM(1).png | LOOM_WEAVING |
| WEAVING | 7 inspection stations(1).png | INSPECTION_PRIMARY |
| WEAVING | 8 inspection stations(1).png | INSPECTION_SECONDARY |
| WEAVING | 10 Packing(1).png | PACKING |
| GARMENTING | Unit 2(1).jpg / Unit 2 - Sewing 1.jpg | PAGE_HERO (compare originals first) |
| GARMENTING | Store2.jpg | FABRIC_STORE |
| GARMENTING | Fabric 1(1).jpg | FABRIC_INSPECTION |
| GARMENTING | Cutting 1(1).jpg | CUTTING |
| GARMENTING | Cut Panel Checking(1).jpg | CUT_PANEL_CHECKING |
| GARMENTING | Unit 1 -Sewing(1).jpg | SEWING_UNIT_ONE (unit identity unconfirmed) |
| GARMENTING | Unit 2 - Sewing 1.jpg | SEWING_UNIT_TWO (unit identity unconfirmed) |
| GARMENTING | Ironing & Packing1(1).jpg | IRONING_FINISHING |
| GARMENTING | Packing 1(1).jpg | PACKING |

All configured database image sections are currently missing, including optional introduction, quality and enquiry imagery. Upload through the existing protected Website Image Admin only after inspecting the originals. Supply descriptive alt text based on the actual photograph. Keep originals under ignored WebsiteImageSource/Framework/{Knitting,Weaving,Garmenting}. Use WebP/JPEG/PNG at most 614400 bytes. No automatic source-folder ingestion.

## Implementation and verification

Inspected: App.jsx routes, main.jsx/bootstrap entry, SiteHeader.jsx dropdowns, PublicLayout.jsx header/footer, InnerPage.jsx content/image/enquiry pattern, SpinningPage.jsx visual reference, all three original page configurations, AdminPages.jsx image upload configuration, index.css, Vite/ESLint/package configuration, Backend/server.js, websiteRoutes.js content/image/admin APIs, and repository image/file inventory.

Modified: the three existing page components, the existing admin page's pageSections configuration only, and the single added root ignore entry. Created: Framework/FrameworkPage.jsx, its scoped CSS module, this mapping, verification hashes, and Backend/WebsiteAPI/prepareFrameworkContent.mjs. Local source directories were created and ignored. No new routes or routers were needed.

The explicit migration inserted 17 content rows using the existing local content API (5 Knitting, 7 Weaving, 5 Garmenting). A subsequent dry run found no differences or pending inserts. The migration refuses conflicting existing content, is idempotent for matching rows, and is never invoked at startup. No images were uploaded and no image binaries were introduced. Content and image retrieval continue through the existing APIs. Public metadata timestamps version image URLs; metadata is fetched without caching on each page mount. Upload/admin authentication, response MIME handling and the 600 × 1024-byte limit were left intact.

Verified:
- Frontend lint passed, with no warnings.
- All three routes returned HTTP 200 for direct and repeated requests through the existing local Vite server on port 5173. Each page module and the shared renderer/CSS transformed successfully. These checks establish development-server route availability, not browser execution or production hosting rewrite configuration.
- Each content API returned its migrated rows; each image metadata API returned an empty array.
- SHA-256 comparisons confirmed SpinningPage.jsx, index.css, SiteHeader.jsx, PublicLayout.jsx, Backend/server.js and websiteRoutes.js remained byte-for-byte unchanged. Other public pages were not edited. App.jsx was not edited, so routes and dropdown destinations are unchanged.
- No imports of source-folder photographs, stock images, image binaries or base64 were added to the three pages or their renderer.

Verification limits:
- Production build failed at Vite configuration loading because the sandbox denied spawning a process (EPERM). The requested escalation was declined, so no successful new production output was generated.
- Existing dist/assets already contains images used by unrelated pages, including slideshow photographs and the common logo. It was not cleaned or replaced. Therefore a claim that the entire production output contains no images would be incorrect.
- No browser automation tool is available in this session. Visual mobile/tablet layout, runtime overflow, focus behavior, live admin replacement, actual photo descriptions and production refresh behavior have not been browser-verified. Responsive Bootstrap columns, wrapping navigation and scoped focus rules were implemented.
- No original photographs were supplied in the workspace. Filename-to-section assignments and hero selection remain provisional; actual image sizes cannot be checked. Empty image metadata renders text-led sections. Failed image requests collapse to a compact neutral message (the hero returns to a neutral text-led layout), with development-only page/section warnings.
- The old garmenting page contains product specifications and headline manufacturing figures, but no explanatory process copy, distinct sewing-unit confirmation or quality checkpoints. The requested process labels remain visible; image sections appear when corresponding verified photographs are uploaded. No missing process explanation or quality claim was invented.
- Gauge notation, source phrase “sectional weaving”, and inspection acceptance notation are retained rather than interpreted. Current operational figures and certificate validity have not been independently revalidated beyond the user-designated old website. No conflicting existing database content was found.
