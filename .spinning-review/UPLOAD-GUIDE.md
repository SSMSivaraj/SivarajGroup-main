# Spinning page implementation and upload handoff

Only application file changed for this task: `Frontend/my-app/src/pages/KnowUsBetter/SpinningPage.jsx`.
`App.jsx` is the existing route owner; there is no `WebRoutes.jsx`. Existing `/framework/spinning` route and Framework/Spinning NavLink active-state logic already match the requirement. Header, PublicLayout, footer, CSS, backend, database and all other pages were left unchanged by this task. Earlier homepage portrait work is retained.

## API availability

No backend was reachable on localhost ports 46641, 3003 or 3002 during verification. The frontend address on 5173 returned 502 for the content request. `Backend/.env` has no PORT assignment; `Backend/server.js` defaults to **46641**. Vite currently proxies `/api` to **3003**, which differs from that default. No environment or proxy settings were changed. Therefore a running backend port cannot be certified. The exact URLs below use the server's configured default, `http://localhost:46641`. If the backend is launched with a PORT environment override, substitute that actual port. Either configure the existing VITE_API_URL to the reachable backend or run the backend on the existing proxy's port; this is an environment assumption, not a code change made here.

Content: `GET http://localhost:46641/api/website/page-content/SPINNING`
Image metadata: `GET http://localhost:46641/api/website/page-images/SPINNING`
Every image GET uses the same URL as its PUT below.

## Postman

Method: PUT. Body > form-data:

- `image`: File (optimised WebP, maximum 614400 bytes)
- `altText`: Text (describe the pictured process; do not use the filename)
- `displayOrder`: Text (use the order below)
- `updatedBy`: Text (your actual editor identity)

Do not manually set multipart Content-Type. Existing backend upload access rules still apply. No uploads were attempted or completed. All 17 image slots below still need upload/replacement after reviewing existing image metadata.

| Order | page_code | section_code | Inspected source photograph | Original bytes | Exact PUT URL |
|---|---|---|---|---:|---|
| 1 | SPINNING | PAGE_HERO | Spinning & Link Coner - Path.jpg | 681520 | http://localhost:46641/api/website/page-images/SPINNING/PAGE_HERO |
| 2 | SPINNING | INTRODUCTION | Spinning 1.jpg | 646984 | http://localhost:46641/api/website/page-images/SPINNING/INTRODUCTION |
| 3 | SPINNING | BLOW_ROOM_PRIMARY | Blow Room.jpg | 307623 | http://localhost:46641/api/website/page-images/SPINNING/BLOW_ROOM_PRIMARY |
| 4 | SPINNING | BLOW_ROOM_SECONDARY | Blow Room1.jpg | 456351 | http://localhost:46641/api/website/page-images/SPINNING/BLOW_ROOM_SECONDARY |
| 5 | SPINNING | BALE_TRANSPORT | BTS.jpg | 471055 | http://localhost:46641/api/website/page-images/SPINNING/BALE_TRANSPORT |
| 6 | SPINNING | CARDING | Carding.jpg | 429964 | http://localhost:46641/api/website/page-images/SPINNING/CARDING |
| 7 | SPINNING | COMBER | Comber.jpg | 359133 | http://localhost:46641/api/website/page-images/SPINNING/COMBER |
| 8 | SPINNING | DRAW_FRAME | OE - Draw Frame.jpg | 505684 | http://localhost:46641/api/website/page-images/SPINNING/DRAW_FRAME |
| 9 | SPINNING | SIMPLEX | Simplex.jpg | 687886 | http://localhost:46641/api/website/page-images/SPINNING/SIMPLEX |
| 10 | SPINNING | RING_SPINNING | Spinning Frame.jpg | 510724 | http://localhost:46641/api/website/page-images/SPINNING/RING_SPINNING |
| 11 | SPINNING | LINK_CONER_PRIMARY | Link Coner1.jpg | 415552 | http://localhost:46641/api/website/page-images/SPINNING/LINK_CONER_PRIMARY |
| 12 | SPINNING | LINK_CONER_SECONDARY | Link Coner2.jpg | 654600 | http://localhost:46641/api/website/page-images/SPINNING/LINK_CONER_SECONDARY |
| 13 | SPINNING | YARN_CONDITIONING | YCP.jpg | 293665 | http://localhost:46641/api/website/page-images/SPINNING/YARN_CONDITIONING |
| 14 | SPINNING | OE_BLOW_ROOM | OE - Blow Room.jpg | 586529 | http://localhost:46641/api/website/page-images/SPINNING/OE_BLOW_ROOM |
| 15 | SPINNING | OE_DRAW_FRAME | OE - Draw Frame.jpg | 505684 | http://localhost:46641/api/website/page-images/SPINNING/OE_DRAW_FRAME |
| 16 | SPINNING | OE_WINDING | OE - Winding 2.jpg | 499332 | http://localhost:46641/api/website/page-images/SPINNING/OE_WINDING |
| 17 | SPINNING | ENQUIRY_BANNER | Spinning 1.jpg | 646984 | http://localhost:46641/api/website/page-images/SPINNING/ENQUIRY_BANNER |

BTS shows overhead bobbin transport, not bale transport. The required BALE_TRANSPORT database key is retained, but its photograph is correctly captioned and placed with linked winding. YCP shows finished cones/packages; it is not presented as proof of conditioning equipment. The drawing photo is used as a drawing-stage illustration, without claiming it is ring-line machinery. These two database image slots intentionally share a source. Introduction and enquiry also share a source; no hidden duplicate images are rendered.

## Optimisation status

Original archive preserved unchanged in Downloads. All 24 originals extracted unchanged under `.spinning-review/originals/Spinning & OE - Photos/` for inspection. Contact sheet: `.spinning-review/contact-sheet.jpg`. These files are outside Vite's application/public asset directories and are not referenced by the page.

No processed WebP files were created, so final processed sizes are **unavailable**. Python/Pillow, sharp, cwebp, ffmpeg and ImageMagick were unavailable in the checked environment. The converter download failed within the sandbox and approval for the external download was declined. No project packages were installed. Originals exceeding 614400 bytes must not be uploaded as-is.

Remaining processing: preserve aspect ratio, use a practical maximum width (1920 hero; 1400 wide sections; 1100 standard; 800 supporting; 1600 enquiry), never stretch or enlarge unnecessarily, encode WebP at good visual quality and adjust quality/dimensions only as needed to meet <=614400 bytes. Inspect machine/yarn detail, keep approved watermarks and target roughly 200–600 KB where appropriate. Original photographs must remain unchanged.

## Images intentionally omitted

- Knitting.jpg and Knitting1.jpg: visibly knitting machinery.
- Spinning.jpg and Link Coner.jpg: embedded promotional text; clean alternatives available.
- Carding1.jpg: redundant with chosen carding photo.
- OE - Bale Plukker.jpg: redundant with chosen OE preparation photograph.
- OE - Winding.jpg and OE - Winding1.jpg: redundant with selected close view of OE yarn/package formation.
- Overall Drone Shot.jpg: less relevant to the stage-by-stage spinning story.

## Content and company review

Source: https://www.sivaraj.co.in/infrastructure/spinning/

Retained meaning: cotton inspection, trained workforce, linked winding/contamination removal, documented preparation-to-packing stages. No published capacities, spindle counts, machine models, yarn ranges or certifications are added. General manufacturing explanations are editorial fallbacks.

Database content takes priority for each heading, subheading and body when supplied. Body line breaks use whiteSpace: pre-line and no raw HTML. Content section codes: PAGE_HERO, INTRODUCTION, PROCESS_FLOW, BLOW_ROOM, CARDING, COMBER, DRAWING_SIMPLEX (optional group copy), DRAW_FRAME, SIMPLEX, RING_SPINNING, LINK_CONER, YARN_CONDITIONING, OPEN_END_SPINNING, OE_BLOW_ROOM, OE_DRAW_FRAME, OE_WINDING, QUALITY_CONTROL, ENQUIRY_BANNER.

Company review is still required for current OE facility/process details, whether YCP specifically depicts conditioning (the UI only calls it finished packages), approval of watermarks, and any future equipment, capacity, certification or traceability claims. The static process navigation retains the correct stage destinations even if database editors change descriptive copy.

## Verification

- Frontend full lint: PASS (`npm run lint`, exit 0).
- Production build: BLOCKED by Vite spawn EPERM; approval to run outside sandbox declined. No build pass claimed.
- Existing route, imports, parent navigation and active dropdown logic: confirmed by source inspection; unchanged.
- Single h1, separate Ring/OE routes through the page, lazy below-fold images, eager high-priority hero, independent onError placeholders, fixed image aspect ratios, selectable text, Router links for other pages, and Bootstrap stacking/wrapping: checked in source.
- Content request is shared across StrictMode's effect replay; no manual repeated image fetch or Base64.
- No local photo imports, carousel, new packages, CSS file, routes, backend files, SQL files or database changes.
- Live database responses, actual image availability, all-page runtime regression, direct-refresh hosting fallback and mobile rendering/overflow: NOT verified. No reachable backend/browser QA session was available; direct-refresh support also depends on the deployment server's existing SPA fallback.
- This workspace has no Git repository; change scope is based on the files written during this task, not a Git diff.
