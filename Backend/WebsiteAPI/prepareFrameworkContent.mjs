// Run explicitly: node Backend/WebsiteAPI/prepareFrameworkContent.mjs [--apply]
// Database content remains the only production copy. This is a migration source,
// never imported into React or executed during normal server startup.
// References: https://www.sivaraj.co.in/infrastructure/{knitting,weaving,garmenting}
const pages = {
  KNITTING: [
    ['PAGE_HERO', 'Knitting', 'Knitting is conversion of the material into knitted fabric which is then used to make T-shirts, inners and more.'],
    ['INTRODUCTION', 'From Material to Knitted Fabric', 'Knitting is conversion of the material into knitted fabric which is then used to make T-shirts, inners and more.\n\nThe knitting unit is equipped with 270 modern knitting machines and produces an A to Z list of knitted fabrics that include Single Jersey, Rib, Interlock, Fleece, Terry and more.\n\nThe hi-leg machines used have the capacity to produce higher roll weight of up to 200 kgs.'],
    ['PRODUCT_CAPABILITY', 'Fabric Capabilities', 'Single Jersey, Interlock & Rib Fabrics are available.\n\nProduction capacity: 50–60 tons per day.\nDiameter: From 18″ to 32″.\nGauge: From 18″ to 28″.'],
    ['TECHNOLOGY', 'Knitting Technology', '216 Pailung Circular Knitting Machines.\n32 open-width machines are available.\nHigh-leg machines are available with 200 kg capacity.'],
    ['QUALITY_CONTROL', 'Organic Certification', 'GOTS – Organic Certified Unit.'],
  ],
  WEAVING: [
    ['PAGE_HERO', 'Weaving', 'Weaving Capacity | Weaving Preparatory'],
    ['INTRODUCTION', 'Weaving and Preparation', 'Toyota Jat 710 – 340 cm – 146 machines.\nPicanol Omniplus 2R – 340 cm – 24 machines.\nToyota Jat 710 – 190 cm – 60 machines.\n\nWeaving preparatory:\nBenninger – Direct Warping – 3 machines.\nSectional Warping – 1 machine.\nBenninger Sizing – 1 machine.\nKarl Mayer Sizing – 1 machine.'],
    ['WARPING', 'Warping', 'The warping section is equipped with a state-of-the-art Benninger Warping Machine which can produce up to 2 lakh metres per day. That’s 73 million metres per annum. Sectional weaving facility is also made available.'],
    ['SIZING', 'Sizing', 'Sizing is a protective process and rightly called the heart of the weaving stage. Advanced Benninger and Karlmayer sizing machines with Pleva attachment are used in this critical stage to ensure quality demands are met. Auto-creel facilities are then used to further reinforce quality.\n\nThe section has the capacity to produce 2 lakh metres of sized beams per day.'],
    ['LOOM_WEAVING', 'Loom Weaving', 'The looms section is equipped with 230 cutting-edge wider-width and narrow-width machines. State-of-the-art Toyota and Picanol looms with Dobby and Cam with e-shed facilities power the production of 75,000 metres per day.\n\nThe facility produces an extensive count ranging from 10x10s to 100x120s and thread count ranging from 150 to 1500. The loom section is safeguarded with 24/7 online and offline quality checking to ensure flawless output.'],
    ['QUALITY_CONTROL', 'Inspection', 'Aside from the numerous quality checks carried out at various stages, every inch of the fabric is physically inspected before the product reaches the customers.\n\n25 inspection machines are attached to centralized exclusive software to analyze the cause of defects and take preventive action. Inspection is carried out under the American 4-point system (24 points per 100 linear metres), and up to 1 lakh metres is inspected per day.'],
    ['PACKING', 'Packing', 'Roll packing, bale packing or pallet packing is facilitated for local supply as well as export, based on the needs of the customers.'],
  ],
  GARMENTING: [
    ['PAGE_HERO', 'Garmenting', '150 Stitching Machines | 1000 Pieces Per Day | 200 Workers'],
    ['INTRODUCTION', 'Garment Manufacturing', '150 stitching machines.\n1,000 pieces per day.\n200 workers.'],
    ['MENS_APPAREL', 'Men’s Apparel', 'White Shirts\nFabric category: Pure white, Linen, Mono Cotton, VIP White, Pearl White, Dobby, Starch white etc.\nStyle: Full Sleeve, Half Sleeve, Regular Fit.\n\nFormal Shirts – Solid, Checked, Striped Shirts\nFabric category: 100% cotton, Filafil, Chambray, Linen, Dobby, Twill, Slub etc.\nStyle: Full Sleeve, Half Sleeve, Regular Fit.\n\nSolid Trousers\nFabric category: 100% cotton, satin, dobby, twill, drill, stretch, corduroy etc.\nStyle: Slim fit, Regular fit.\n\nDenim Trousers\nFabric category: Denim, faded, stretch, torn etc.\nStyle: Slim fit, Pencil fit, Ankle fit etc.\n\nCasual Solid Shirts, Plain Shirts, Checked Shirts, Printed Shirts\nFabric category: 100% cotton, Filafil, Chambray, Linen, Dobby, Twill, Slub etc.\nStyle: Full Sleeve, Half Sleeve, Slim Fit.'],
    ['UNDER_GARMENTS', 'Under Garments and Casualwear', 'Men’s Vests, Briefs\nFabric category: 100% cotton, Jersey, Single rib, Drop needle rib, Interlock, Derby rib, Melange fabric etc.\nVest style: RN, RNS, Color vest, Gym vest.\nBrief style: IE, OE, Contrast OE.\n\nWomen’s Slips, Panties\nFabric category: 100% cotton, Jersey, Cotton modal, Cotton Viscose Micro modal, Lycra jersey etc.\nPanties style: Plain IE, Plain OE, Printed IE, Printed OE.\nSlips style: Adjustable, Lace, Folding etc.\n\nChennis Boys’ Innerwear (vest, brief and trunk)\nFabric category: 100% cotton, Jersey, Single rib etc.\nStyle: White, Color Vest, OE, IE (Plain and Printed) Brief and Trunk.\n\nChennis Girls’ Innerwear\nFabric category: 100% cotton, Jersey, Cotton modal, Interlock etc.\nStyle: Folding Slips, Plain, Printed Panties.\n\nMen’s T-shirts\nFabric category: 100% cotton, Jersey, Airtex, Interlock, Single rib, Super Poly etc.\nStyle: Round neck, V neck, Polo, Printed etc.\n\nMen’s Shorts & Track\nFabric category: 100% cotton, Jersey, Loop knit, Melange etc.\nStyle: Boxer Shorts, Capri, Full Track etc.\n\nWomen’s Yoga Shorts & Leggings\nFabric category: 100% cotton, Jersey, Cotton modal, Cotton Viscose, Lycra jersey etc.\n\nBaby Boy T-shirts, Girl T-shirts, Junior Boy T-shirts, Junior Girl T-shirts\nFabric category: 100% cotton, Jersey, Interlock, Melange etc.\nStyle: Half sleeve with shorts, Half sleeve with Bloomer, Full sleeve with pant, Sleeveless with shorts, Half sleeve, Full sleeve with Shorts, Pants, printed, embroidery etc.'],
    ['TRADITIONAL_WEAR', 'Traditional and Party Wear', 'Men’s Dhotis, Pocket Dhotis (Velcro Fit)\nFabric category: 100% cotton.\nStyle: 2 m, 4 m, Small Border, Big Border, Fancy Border, Jari (Gold & Silver) Border, Cream Dhoti.\n\nMen’s Wedding Set, Party Wear Shirts\nFabric category: 100% cotton, Art Silk.\nStyle: 2 in 1 (Shirt fabric & Dhoti), 3 in 1 (Shirt fabric, Dhoti & Towel), Jari Border Dhoti (White and Cream color).\nFabric category: Art silk, Khadi silk.\nStyle: Full Sleeve, Half Sleeve, Regular Fit.\n\nJunior Party Wear Shirts\nFabric category: Art silk.\nStyle: Half Sleeve, Regular Fit Shirt with Velcro Dhoti.'],
  ],
}

const base = (process.env.FRAMEWORK_API_BASE_URL || 'http://localhost:3003').replace(/\/$/, '')
async function request(path, options) {
  const response = await fetch(`${base}/api/website/${path}`, options)
  const result = await response.json()
  if (!response.ok || !result.success) throw new Error(`${response.status}: ${result.message || 'Request failed'}`)
  return result.data
}
const apply = process.argv.includes('--apply')
// Preflight every page. Never replace existing editorial content silently.
const existing = await Promise.all(Object.keys(pages).map(async page => [page, await request(`page-content/${page}`)]))
for (const [page, rows] of existing) {
  const conflicts = rows.filter(row => {
    const planned = pages[page].find(([code]) => code === row.section_code)
    return planned && (row.heading !== planned[1] || row.body_content !== planned[2])
  })
  if (conflicts.length) throw new Error(`${page}: existing content conflicts in ${conflicts.map(row => row.section_code).join(', ')}; resolve before applying`)
}
for (const [page, rows] of existing) {
  for (const [index, [code, heading, bodyContent]] of pages[page].entries()) {
    if (rows.some(row => row.section_code === code)) continue
    console.log(`${apply ? 'INSERT' : 'PLAN'} ${page}/${code}`)
    if (apply) await request(`page-content/${page}/${code}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heading, bodyContent, displayOrder: index * 10, isActive: true, updatedBy: 'framework-content-migration' }) })
  }
}
if (!apply) console.log('Dry run only. Re-run explicitly with --apply to populate missing content.')
