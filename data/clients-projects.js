/**
 * data/clients-projects.js — Single Source of Truth for ATC Clients & Projects
 * 
 * Context:
 * - ATC delivers engineering and construction works across Pakistan, Saudi Arabia and Bahrain.
 * - Rising Sun Construction LLP is ATC's Pakistani joint venture partner (PEC C1).
 * - C1/PEC registration belongs to Rising Sun Construction LLP only; never attach it to ATC.
 * - jv: false for all for now.
 */

// TODO(owner): confirm exact role (main contractor / JV partner / subcontractor), status/year, and permission to display name and logo for each entry below.
// TODO(owner): Low-resolution logo files needing higher-resolution replacement:
//   - ary-laguna.png (source artwork 136x72px)
//   - sanabis.png (source artwork 128x152px)
//   - ahcc.png (source artwork 138x148px)
//   - almoayyed.png (source artwork 208x192px)
// TODO(owner): Missing client logos to confirm / add:
//   - Badoor Al Emar Co. (Saudi Arabia)
//   - Dr. Bashar Ahmadi (Bahrain - Private Developer fallback)
//   (Private Clients and U.S. Military Base never get logo files)

const projects = [
  /* ══════════════════════════════════════════════════════════
     PAKISTAN
     ══════════════════════════════════════════════════════════ */
  {
    slug: 'awt-investment',
    name: 'AWT Investment',
    client: 'AWT Investment',
    relationship: 'Client',
    country: 'Pakistan',
    location: 'DHA-II, Islamabad',
    sector: 'Commercial Interiors',
    scope: 'Turnkey office delivery: interior finishing and furnishing, automation, IT networking and UPS power backup, handed over key-ready.',
    role: 'Turnkey contractor',
    status: null,
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Illuminated AWT Investments Facade at Dusk.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'ary-laguna',
    name: 'ARY Laguna',
    client: 'ARY Laguna / DHA Gujranwala',
    relationship: 'Client',
    country: 'Pakistan',
    location: 'DHA Gujranwala',
    sector: 'Residential',
    scope: 'Villa construction from foundation to key handover. Planned scale: 1,500 villas.',
    role: 'Construction contractor',
    status: null,
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Aerial Lagoon Luxury Community.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'fwo-balochistan',
    name: 'FWO',
    client: 'FWO',
    relationship: 'Client',
    country: 'Pakistan',
    location: 'Balochistan',
    sector: 'Infrastructure',
    scope: 'Road works.',
    role: 'Construction contractor',
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/fwo-balochistan.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'fc-balochistan',
    name: 'FC',
    client: 'FC',
    relationship: 'Client',
    country: 'Pakistan',
    location: 'Balochistan',
    sector: 'Public Sector',
    scope: 'Construction projects.',
    role: 'Construction contractor',
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/fc-balochistan.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'private-clients-pk',
    name: 'Private Clients',
    client: 'Private Clients',
    relationship: 'Client',
    country: 'Pakistan',
    location: 'Pakistan',
    sector: 'Private Sector',
    scope: 'Construction works for private clients.',
    role: 'Construction contractor',
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/private-clients-pk.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },

  /* ══════════════════════════════════════════════════════════
     SAUDI ARABIA
     ══════════════════════════════════════════════════════════ */
  {
    slug: 'roshn-villas',
    name: 'ROSHN Villas',
    client: 'ROSHN Group',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Riyadh',
    sector: 'Residential',
    scope: 'Villa construction programme: 2,000 villas under construction.',
    role: 'Construction contractor',
    status: 'Under construction',
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Golden-Hour ROSHN Community Development.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'herfy-foods',
    name: 'Herfy Foods',
    client: 'Herfy Foods',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Kingdom-wide',
    sector: 'Food Retail Facilities',
    scope: 'Maintenance, renovation, new construction and hood-cleaning contracts across 400+ outlets, including HVAC, chiller and exhaust system maintenance.',
    role: 'Facilities & construction contractor',
    status: null,
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Herfy Drive-Thru at Twilight.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'crown-gulf',
    name: 'Crown Gulf Co.',
    client: 'Crown Gulf Co.',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Saudi Arabia',
    sector: 'Electrical Infrastructure',
    scope: 'Transformer and RMU installation and testing.',
    role: null,
    status: null,
    featured: false,
    hidden: true, // hidden: true so no card shows on homepage
    jv: false,
    image: 'assests/projects/crown-gulf.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'badoor-al-emar',
    name: 'Badoor Al Emar Co.',
    client: 'Badoor Al Emar Co.',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Saudi Arabia',
    sector: 'Power Projects',
    scope: 'Medium-voltage power and civil support works.',
    role: null,
    status: null,
    featured: false,
    hidden: true, // hidden: true so no card shows on homepage
    jv: false,
    image: 'assests/projects/badoor-al-emar.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'american-military-ksa',
    name: 'American Military Facilities, KSA (Confidential)',
    client: 'American Military Facilities',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Saudi Arabia',
    sector: 'Defense',
    scope: 'Electrical, HVAC and facility maintenance; camp infrastructure and power systems.',
    role: null,
    status: null,
    featured: false,
    hidden: true, // TODO(owner): hidden until confirmed written permission; no base name, no site details
    jv: false,
    image: 'assests/projects/american-military-ksa.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'neom-support',
    name: 'NEOM',
    client: 'NEOM',
    relationship: 'Client',
    country: 'Saudi Arabia',
    location: 'Saudi Arabia',
    sector: 'Power Generation',
    scope: 'Technical participation: substation and transformer support services.',
    role: null,
    status: null,
    featured: false,
    hidden: true, // TODO(owner): hidden until confirmed permission
    jv: false,
    image: 'assests/projects/neom-support.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },

  /* ══════════════════════════════════════════════════════════
     BAHRAIN
     ══════════════════════════════════════════════════════════ */
  {
    slug: 'bh-al-sanabis-towers',
    name: '37-Storey High-Rise Towers',
    client: 'Dr. Bashar Ahmadi', // TODO(owner): consent to name individual; fallback "Private Developer"
    publicName: 'Private Developer',
    relationship: 'Client',
    country: 'Bahrain',
    location: 'Al Sanabis, Bahrain',
    sector: 'High-Rise Development',
    scope: '37-storey high-rise towers.',
    role: null, // role null -> COMPANY ROLE row hidden until owner supplies it
    status: null,
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Sunset Waterfront Skyline with Twin Towers.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'bh-reef-island-hotel',
    name: '19-Storey Hotel Development',
    client: 'Al-Ghanah',
    relationship: 'Client',
    country: 'Bahrain',
    location: 'Reef Island, Bahrain',
    sector: 'Hospitality',
    scope: '19-storey hotel development.',
    role: null,
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/bh-reef-island-hotel.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'bh-galali-villas',
    name: '59-Villa Residential Development',
    client: 'Al Hedaya Contracting',
    relationship: 'Contracting partner',
    country: 'Bahrain',
    location: 'Galali, Bahrain',
    sector: 'Residential',
    scope: '59-villa residential development.',
    role: null,
    status: null,
    featured: true,
    hidden: false,
    jv: false,
    image: 'assests/Golden-Hour Arabian Villa Exterior.png'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'bh-salmaniya-building',
    name: '7-Storey Building Development',
    client: 'Al Moayyed Contracting',
    relationship: 'Contracting partner',
    country: 'Bahrain',
    location: 'Salmaniya, Bahrain',
    sector: 'Building Development',
    scope: '7-storey building development.',
    role: null,
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/bh-salmaniya-building.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  },
  {
    slug: 'bh-saar-villas',
    name: '31 Two-Storey Villas',
    client: 'Ewan Real Estate',
    relationship: 'Client',
    country: 'Bahrain',
    location: 'Saar, Bahrain',
    sector: 'Residential',
    scope: '31 two-storey villas.',
    role: null,
    status: null,
    featured: false,
    hidden: false,
    jv: false,
    image: 'assests/projects/bh-saar-villas.jpg'
    // TODO(owner): confirm exact role and permission to display name and logo
  }
];

const clients = [
  /* ── PAKISTAN CLIENTS ──────────────────────────────────── */
  {
    slug: 'awt-investment',
    name: 'AWT Investment',
    country: 'Pakistan',
    relationship: 'Client',
    logo: 'assests/clients/awt-investment.png',
    hidden: false
  },
  {
    slug: 'ary-laguna',
    name: 'ARY Laguna',
    country: 'Pakistan',
    relationship: 'Client',
    logo: 'assests/clients/ary-laguna.png',
    hidden: false
  },
  {
    slug: 'fwo-balochistan',
    name: 'FWO',
    country: 'Pakistan',
    relationship: 'Client',
    logo: 'assests/clients/fwo-balochistan.png',
    hidden: false
  },
  {
    slug: 'fc-balochistan',
    name: 'FC Balochistan',
    country: 'Pakistan',
    relationship: 'Client',
    logo: 'assests/clients/fc-balochistan.png',
    hidden: false
  },
  {
    slug: 'private-clients-pk',
    name: 'Private Clients',
    country: 'Pakistan',
    relationship: 'Client',
    logo: null, // Private clients never get a logo (clean wordmark tile only)
    hidden: false
  },

  /* ── SAUDI ARABIA CLIENTS (Exactly 3 tiles) ──────────────── */
  {
    slug: 'roshn-villas',
    name: 'ROSHN',
    country: 'Saudi Arabia',
    relationship: 'Client',
    logo: 'assests/clients/roshn-villas.png',
    hidden: false
  },
  {
    slug: 'herfy-foods',
    name: 'Herfy Foods',
    country: 'Saudi Arabia',
    relationship: 'Client',
    logo: 'assests/clients/herfy-foods.svg',
    hidden: false
  },
  {
    slug: 'american-military-ksa',
    name: 'American Military Facilities, KSA',
    country: 'Saudi Arabia',
    relationship: 'Client',
    logo: 'assests/clients/american-military-ksa.png',
    hidden: false // hidden: false for client tile only
  },

  /* ── BAHRAIN CLIENTS ───────────────────────────────────── */
  {
    slug: 'bh-al-sanabis-towers',
    name: 'Sanabis',
    country: 'Bahrain',
    relationship: 'Client',
    logo: 'assests/clients/sanabis.png',
    hidden: false
  },
  {
    slug: 'bh-reef-island-hotel',
    name: 'Al Ghanah Group',
    country: 'Bahrain',
    relationship: 'Client',
    logo: 'assests/clients/al-ghanah.png',
    hidden: false
  },
  {
    slug: 'bh-galali-villas',
    name: 'AHCC',
    country: 'Bahrain',
    relationship: 'Contracting partner',
    logo: 'assests/clients/ahcc.png',
    hidden: false
  },
  {
    slug: 'bh-salmaniya-building',
    name: 'Almoayyed International Group',
    country: 'Bahrain',
    relationship: 'Contracting partner',
    logo: 'assests/clients/almoayyed.png',
    hidden: false
  },
  {
    slug: 'bh-saar-villas',
    name: 'Ewan',
    country: 'Bahrain',
    relationship: 'Client',
    logo: 'assests/clients/ewan.png',
    hidden: false
  }
];

if (typeof window !== 'undefined') {
  window.ATC_PROJECTS = projects;
  window.ATC_CLIENTS = clients;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects, clients };
}
