# Know Us Better image upload guide

Use the unchanged protected `/admin/website-images` uploader. No images have been uploaded automatically. All four pages' active image lists were empty when checked. The public pages use database image URLs, with the explicitly requested shared Welcome Way MD hero exception.

## Generated assets ready for manual upload

Paths are relative to `WebsiteImageSource/KnowUsBetter/`. JPEGs are upload-ready; PNG originals are source files only. Every JPEG is below 614400 bytes. These images illustrate subjects; they are not photographs of documented company activities or facilities. Use the suggested alt text to identify that distinction. The generated files contain no text, logos, identifiable faces, country labels or management portraits.

| Page / section | JPEG filename | Bytes | Alt text |
| --- | --- | ---: | --- |
| CSR / ENVIRONMENT | `CSR/csr-sapling-care.jpg` | 391102 | Illustrative image of anonymous adults tending a sapling in reddish soil |
| GLOBAL_PRESENCE / PAGE_HERO | `GlobalPresence/global-textile-logistics.jpg` | 323445 | Illustrative textile and garment packing scene with shipping containers in the background |
| GLOBAL_PRESENCE / GLOBAL_CAPABILITIES | `GlobalPresence/global-textile-capabilities.jpg` | 388415 | Illustrative arrangement of cotton yarn cones, folded fabrics, garments and blank packaging |

Originals use the same filenames with `-original.png`. The sapling image can also be considered for CSR/PAGE_HERO or CSR_GALLERY_SECONDARY after editorial approval, without representing it as documentary evidence. Do not use it for a school, marriage hall or food-distribution event.

No approved Chennis photograph or logo was found in the existing source assets or active BRANDS database image list. Supply an approved photograph for GLOBAL_PRESENCE/CHENNIS_BRAND; no unofficial logo was created. MARKET_MAP is an accessible code-rendered coordinate map and does not need a generated geographical bitmap.

## Image-to-section requirements

For each row: supporting photo recommendation is **4:3 / 1200×900**, unless a different ratio is stated. Hero recommendation is **16:9 / 1920×1080**. Enquiry banner recommendation is **16:7 / 1600×700**. Optimize every upload below 614400 bytes. Use only genuine approved company images when the subject identifies an actual place or person.

| Page code | Section code | Suggested subject / alt text | Ratio / dimensions if different | Status |
| --- | --- | --- | --- | --- |
| COMPANY_PROFILE | PAGE_HERO | Sivaraj textile manufacturing floor | 16:9 / 1920×1080 | Approved upload needed |
| COMPANY_PROFILE | INTRODUCTION | Sivaraj textile manufacturing facility | | Approved upload needed |
| COMPANY_PROFILE | LEGACY | Cotton and textile manufacturing at Sivaraj | | Approved upload needed |
| COMPANY_PROFILE | MANUFACTURING_STRENGTH | Sivaraj textile production operations | | Approved upload needed |
| COMPANY_PROFILE | INTEGRATED_CAPABILITIES | Yarn, fabric and garment production | | Approved upload needed |
| COMPANY_PROFILE | QUALITY_COMMITMENT | Textile product quality inspection | | Approved upload needed |
| COMPANY_PROFILE | COMPANY_HIGHLIGHT | Sivaraj manufacturing floor | | Approved upload needed |
| COMPANY_PROFILE | ENQUIRY_BANNER | A wide textile-production detail | 16:7 / 1600×700 | Optional approved upload |
| MANAGEMENT_TEAM | PAGE_HERO | Existing Shri.K.Sivaraj leadership photograph | Existing source portrait, contained | No upload: exact `leadership.jpeg` reference reused |
| MANAGEMENT_TEAM | LEADERSHIP_INTRODUCTION | Sivaraj manufacturing operations | | Approved non-personal upload needed |
| MANAGEMENT_TEAM | MANAGING_DIRECTOR | Approved portrait of Shri.K.Sivaraj | 4:5 / 1000×1250 | Optional approved portrait; no substitute |
| MANAGEMENT_TEAM | LEADERSHIP_MESSAGE | Approved corporate operations photograph | | Reserved; no verified source message found; content required |
| MANAGEMENT_TEAM | MANAGEMENT_TEAM | Approved non-personal textile operations photograph | | Reserved; current verified member cards are text-only |
| MANAGEMENT_TEAM | LEADERSHIP_VALUES | Textile quality review and operations | | Approved upload needed |
| MANAGEMENT_TEAM | ENQUIRY_BANNER | A wide textile-production detail | 16:7 / 1600×700 | Optional approved upload |
| CSR | PAGE_HERO | Illustrative sapling care, or an approved CSR activity | 16:9 / 1920×1080 | Upload needed; generated sapling illustration available |
| CSR | CSR_INTRODUCTION | Approved charitable trust community activity | | Approved upload needed |
| CSR | COMMUNITY | The charitable trust marriage hall in Tirupur | | Actual approved hall photograph needed |
| CSR | EDUCATION | SSM School and its learning environment | | Actual approved school photograph needed |
| CSR | HEALTH_WELLBEING | Approved verified health initiative | | Reserved: source does not establish a standalone programme; requires verified content |
| CSR | ENVIRONMENT | Illustrative sapling care | | Generated JPEG ready, manual upload needed |
| CSR | EMPLOYEE_WELFARE | Approved verified employee-welfare activity | | Reserved: dedicated programme not established; requires verified content |
| CSR | CSR_GALLERY_PRIMARY | Approved photograph of free food distribution | | Actual approved activity photograph needed |
| CSR | CSR_GALLERY_SECONDARY | Supporting image of sapling care | | Generated illustration available, manual upload needed |
| CSR | ENQUIRY_BANNER | Approved community/environment detail | 16:7 / 1600×700 | Optional approved upload |
| GLOBAL_PRESENCE | PAGE_HERO | Illustrative textile packing and shipping scene | 16:9 / 1920×1080 | Generated JPEG ready, manual upload needed |
| GLOBAL_PRESENCE | GLOBAL_INTRODUCTION | Textile products prepared for international delivery | | Approved upload needed |
| GLOBAL_PRESENCE | INDIA_PRESENCE | Sivaraj manufacturing operations in India | | Actual approved facility photograph needed |
| GLOBAL_PRESENCE | INTERNATIONAL_PRESENCE | Textile export and international delivery | | Reserved, shown when verified database content exists |
| GLOBAL_PRESENCE | MARKET_MAP | Published market markers and a readable market list | Responsive SVG, viewBox 1000×440 | Implemented in code, no image upload needed |
| GLOBAL_PRESENCE | CHENNIS_BRAND | Approved Chennis apparel collection | | Approved brand photograph needed; no invented logo |
| GLOBAL_PRESENCE | GLOBAL_CAPABILITIES | Illustrative yarn, fabric and garment export preparation | | Generated JPEG ready, manual upload needed |
| GLOBAL_PRESENCE | ENQUIRY_BANNER | A wide textile-product detail | 16:7 / 1600×700 | Optional approved upload |

Legacy Company Profile slots remain available in Admin. They have not been removed or overwritten. No generated assets are imported into React, copied into Vite public, embedded as base64, or inserted into SQL.

## Final generation prompts

Built-in `image_gen.imagegen` was used. The final prompts were:

**csr-sapling-care:** Use case: photorealistic-natural. Create one wide 16:9 premium editorial supporting photograph for a Tamil Nadu textile company's CSR page, illustrating tree planting and sapling care. Close view of anonymous adult volunteers' hands gently tending a healthy young sapling in reddish soil, green established trees softly blurred behind, natural warm daylight, dignified candid documentary composition, realistic textures, forest green and warm ivory palette. No faces, no identifiable people, no children, no text, no readable signage, no logos, no watermark, no invented awards or certificates. This is an illustrative image, not evidence of a real company event. Produce a single landscape image. Save the generated image to a local file and return its local file path if supported.

**global-textile-logistics:** Use case: photorealistic-natural. One original premium corporate editorial photograph, landscape 16:9, for a textile exports website hero. Foreground neatly folded unbranded cotton fabrics and garments in ivory, forest green and muted earth colours on a clean packing table in a contemporary textile logistics space, distant softly defocused shipping containers through an open loading bay. Natural side lighting, tactile weave detail, understated professional mood, wide composition with negative space for a readable website overlay. No people, no text, no labels, no statistics, no country flags, no logos, no watermarks. Illustrative composition, no implied real company facility.

**global-textile-capabilities:** Use case: product-mockup. One original premium corporate editorial landscape 16:9 photograph for a global textile reach supporting image. Close still life of textured cotton yarn cones, folded woven fabrics and neatly folded knitted garments with simple blank kraft packaging on an ivory work surface. A clean export packing area softly blurred in background, elegant natural daylight, forest green accent and warm ivory tones, exceptionally realistic textile details. No maps, no people, no text, no shipping labels, no countries, no logos, no brand names, no watermark, no certificates. Generic illustrative textile export readiness, no claims about any actual company's facilities.
