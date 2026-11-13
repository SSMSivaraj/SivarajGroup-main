// Display labels are independent of existing routes and internal group keys.
export const navigationGroups = [
  {
    "key": "Welcome Way",
    "label": "Welcome Way",
    "path": "/",
    "displayOrder": 1,
    "children": []
  },
  {
    "key": "Know Us Better",
    "label": "Know Us Better",
    "path": "/know-us-better",
    "displayOrder": 2,
    "children": [
      {
        "label": "Company Profile",
        "path": "/know-us-better/company-profile"
      },
      {
        "label": "Management Team",
        "path": "/know-us-better/management-team"
      },
      {
        "label": "CSR",
        "path": "/know-us-better/csr"
      },
      {
        "label": "Global Presence",
        "path": "/know-us-better/global-presence"
      }
    ]
  },
  {
    "key": "Goods",
    "label": "Products",
    "path": "/goods",
    "displayOrder": 3,
    "children": [
      {
        "label": "Cotton Yarn",
        "path": "/goods/cotton-yarn"
      },
      {
        "label": "Knitted Fabrics",
        "path": "/goods/knitted-fabrics"
      },
      {
        "label": "Woven Fabrics",
        "path": "/goods/woven-fabrics"
      },
      {
        "label": "Garments",
        "path": "/goods/garments"
      }
    ]
  },
  {
    "key": "Framework",
    "label": "Framework",
    "path": "/framework",
    "displayOrder": 4,
    "children": [
      {
        "label": "Spinning",
        "path": "/framework/spinning"
      },
      {
        "label": "Knitting",
        "path": "/framework/knitting"
      },
      {
        "label": "Weaving",
        "path": "/framework/weaving"
      },
      {
        "label": "Garmenting",
        "path": "/framework/garmenting"
      },
      {
        "label": "Home Textiles",
        "path": "/framework/home-textiles"
      }
    ]
  },
  {
    "key": "Enlightenment",
    "label": "Enlightenment",
    "path": "/enlightenment",
    "displayOrder": 5,
    "children": [
      {
        "label": "Textile",
        "path": "/enlightenment/textile"
      },
      {
        "label": "Education",
        "path": "/enlightenment/education"
      },
      {
        "label": "Natural Energy",
        "path": "/enlightenment/natural-energy"
      },
      {
        "label": "Brands",
        "path": "/enlightenment/brands"
      }
    ]
  },
  {
    "key": "Credentials",
    "label": "Quality",
    "path": "/credentials",
    "displayOrder": 6,
    "children": [
      {
        "label": "Certifications",
        "path": "/credentials/certifications"
      },
      {
        "label": "Rewards",
        "path": "/credentials/rewards"
      }
    ]
  },
  {
    "key": "Logo Marquee",
    "label": "Logo Marquee",
    "path": "/logo-marquee",
    "displayOrder": 7,
    "children": []
  }
]

export const navigationGroup = key => navigationGroups.find(group => group.key === key || group.label === key)
export const navigationLabel = key => navigationGroup(key)?.label || key
