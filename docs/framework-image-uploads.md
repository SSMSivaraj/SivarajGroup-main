# Framework image layouts and uploads

The public layouts now reserve compact, labelled photo positions even when the database has no images. The protected Website Image Admin shows every configured slot, including empty ones, with an Upload image / Replace image button. The top Page layout selector switches between Spinning, Knitting, Weaving, Garmenting and Home Textiles (and the existing other admin pages). Table filters do not hide images from this layout overview.

Open `/admin/website-images?page=HOME_TEXTILES` and sign in with your existing editor account. If signing in resets the selection, choose Home Textiles in **Page layout**.

1. Click **Upload image** on **Bed linen**. Choose `Home Textile1.jpeg`, then **Upload / Replace**.
2. Click **Upload image** on **Kitchen and dining**. Choose `Kitchen.webp`, then **Upload / Replace**.
3. Open `/framework/home-textiles`. The bedding appears in a landscape composition; the table runner retains its portrait composition without cropping.

Both original files were visually inspected and copied unchanged to the ignored local folder `WebsiteImageSource/Framework/HomeTextiles/`. The saved `Home Textile.html` is a Google image-search page; none of its scripts, images, or text were imported or treated as instructions or company facts.

| File | Page | Section | Size | Alternative text |
| --- | --- | --- | --- | --- |
| Home Textile1.jpeg | HOME_TEXTILES | BED_LINEN | 47535 bytes | Colourful layered bedding and cushions on a white bed |
| Kitchen.webp | HOME_TEXTILES | KITCHEN_DINING | 17702 bytes | Floral table runner on a wooden dining table with chairs and tableware |

The slot buttons prefill these alternative descriptions and guide the file choice. Both originals are below the unchanged 614400-byte limit. They are illustrative home-textile references, not evidence of Sivaraj product specifications. The wide hero and introduction slots remain available for additional photographs; the two modest-resolution originals are not automatically stretched across a full-width hero.

No image data was bundled into React, placed in `public`, or served from WebsiteImageSource. Actual database insertion remains an authenticated action through the existing protected PUT image endpoint. This agent session has no signed-in administrator cookie, so the originals are prepared but **not uploaded to the database**. Authentication, backend APIs, the Spinning public page, navigation, footer and global CSS were not changed.

Home Textiles retains the existing fallback copy for materials, design, product enquiries and quality; database content takes precedence. Existing Home Textiles image section codes remain supported alongside the new BED_LINEN and KITCHEN_DINING slots.
