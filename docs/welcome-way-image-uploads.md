# Welcome Way image mapping

Inspection completed before implementation: `/` renders `WelcomeWayPage` inside
`PublicLayout`. The page's only child UI is the Bootstrap Carousel. `SiteHeader`
renders `HeaderGraphics` on `/`. The footer has no images. `PageHero.module.css`
supplies only a gradient overlay, with no background image.

Before this change, Admin's `imageSlots.js` listed only `FABRIC_ROLLS` and
`HEADER_GRAPHICS`. Seven actual carousel positions were missing from Admin.

All positions below use `page_code = WELCOME_WAY` and are Admin editable.
Order follows the header, then the existing carousel sequence. Newly assigned
section codes identify existing positions; no public positions were added.

| Order | UI section / Admin label | section_code | Source before change |
| --- | --- | --- | --- |
| 1 | Graphics Clip (header above carousel) | HEADER_GRAPHICS | Image API / NW_WebsitePageImages; hidden without an active row |
| 2 | Hero slide 1 - Leadership | HERO_LEADERSHIP | src/assets/slideshow/leadership.jpeg |
| 3 | Hero slide 2 - Cotton | HERO_COTTON | src/assets/slideshow/cotton.png |
| 4 | Hero slide 3 - Spinning & OE | HERO_SPINNING_OE | src/assets/slideshow/spinning-oe.png |
| 5 | Hero slide 4 - Weaving | HERO_WEAVING | src/assets/slideshow/weaving.png |
| 6 | Hero slide 5 - Knitting | HERO_KNITTING | src/assets/slideshow/knitting.png |
| 7 | Fabric Rolls (hero slide 6 - Our Fabrics) | FABRIC_ROLLS | Image API / NW_WebsitePageImages; src/assets/slideshow/md-placeholder.png fallback |
| 8 | Hero slide 7 - Garments & POS | HERO_GARMENTS_POS | src/assets/slideshow/garments-pos.png |
| 9 | Hero slide 8 - Home Textiles | HERO_HOME_TEXTILES | src/assets/slideshow/home-textiles.png |

The shared site logo (`src/assets/sivaraj-spinning-mills-logo.png`) is global
branding, not an editable Welcome Way position. No public-folder images or CSS
background photographs are used by this page.

`welcomeWayImages.js` now owns these nine positions and the original slide data.
The public carousel, header graphic, and Admin registry consume this configuration.
Every carousel position reads `GET /api/website/page-images/WELCOME_WAY/:sectionCode`
and retains its original asset as fallback for missing, inactive, deleted, or
unavailable database images. Header visibility behavior remains unchanged.

Admin's existing authenticated PUT, preview GET, and DELETE target the selected
page/section pair. The backend already accepts these section codes; no backend,
schema, data migration, authentication, or other page changes are required.
Deleting a carousel upload restores the original fallback on the next page load.

Verification: a Node assertion check passed for all nine unique section codes,
public/Admin parity, labels, and display order. Production frontend build and
existing Admin API tests were attempted but blocked by sandbox subprocess EPERM;
outside-sandbox execution was rejected. Live MSSQL and authenticated browser
upload checks were not performed.
