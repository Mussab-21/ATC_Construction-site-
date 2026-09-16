# ATC (Azaan Trading & Contracting Company) — Website Implementation Plan

Prepared from: `Sitemap for ATC.docx`, `Structure of website.docx`, `ATC_company_profile_.pdf`

---

## 0. Read on the brief

ATC is not a consumer brand — it's a Pakistan-based engineering/contracting firm operating in strategic collaboration with a Saudi partner (SPC‑KSA, ~200M SAR annual turnover), serving **public sector, defense, industrial, and corporate clients** (Army Welfare Trust, Herfy Foods, Crown Gulf, ROSHN, NEOM). The people who'll actually use this site are procurement officers, project managers, and facility owners deciding whether ATC is technically credible enough to shortlist. That reframes the design brief: this isn't a marketing site chasing conversions with big gradients and playful motion — it's a **capability dossier**. The job of the homepage is to establish "this company can be trusted with a substation, a military camp, or a housing mega-project" in the first screen.

I've grounded the whole direction in the one visual asset ATC already owns: the circular badge logo (navy blue + gold ring). Rather than inventing a new brand feel, the site extends that logo's language — navy, brass/gold, technical precision — into a full system built around the vocabulary ATC's own engineers use every day: **drawing sheets, elevations, dimension lines, title blocks.**

---

## 1. Design plan

### Color — "Steel & Brass" palette (6 core tokens)

| Token | Hex | Use |
|---|---|---|
| Navy Steel | `#0E2A47` | Primary — nav, footer, dark section backgrounds, headline text on light |
| Blueprint Blue | `#1B4D75` | Secondary — diagram backgrounds, hero panel, section dividers |
| Brass | `#B68D34` | Accent — CTAs, active states, key stats, dimension-line ticks (used sparingly — one accent, not a rainbow) |
| Concrete | `#EDEEEA` | Light background (cool grey-white, not the generic warm cream) |
| Ink | `#101820` | Body text on light backgrounds |
| Steel Grey | `#6B7580` | Secondary text, hairline rules, captions |

Optional 7th token, used only for safety/compliance callouts (e.g. HSE, zero-accident target): **Hazard Rust** `#A13D2B` — a single warning accent, never a primary color.

This deliberately avoids the two clichés a generated construction site usually falls into: warm cream + terracotta, or near-black + neon accent. Navy + brass reads as *engineering instrument* (blueprints, brass fittings, structural steel) rather than *decoration*.

### Type

- **Display / Headings — Archivo (Expanded weights for H1/H2, standard for H3+).** Archivo's expanded width echoes the wide stencil lettering used on drawing-sheet title blocks — it's a functional match, not a random pick.
- **Body — IBM Plex Sans.** Designed with an engineering pedigree, highly legible at small sizes, holds up in dense technical paragraphs (service descriptions, project scopes).
- **Technical accent — IBM Plex Mono**, used *only* for things that are genuinely technical data: stat callouts (200M SAR, divisions count), project reference codes, dimension-style labels on diagrams. Never used as a decorative label font — that's a generic AI-design tell we're avoiding.

Type scale (desktop): H1 56/60, H2 40/46, H3 28/34, body 17/28, caption 14/20. Line length capped ~72ch for body copy. Left-aligned throughout — this is a drawing-sheet layout, not a centered marketing layout.

### Layout concept — "Drawing Sheet"

Every major section is framed like an engineering drawing sheet: a thin 1px rule border, small corner tick marks, and a discreet bottom-right "sheet reference" (e.g. `ATC / 01–HOME / REV A`) reused as a structural motif instead of a decorative eyebrow label. Content is asymmetric and left-aligned, the way a drafter's title block sits bottom-right while the drawing occupies the rest of the sheet.

```
┌──────────────────────────────────────────────────────────┐
│ ATC        Home  About  Services  Projects  Contact   ▣   │
├──────────────────────────────────────────────────────────┤
│  ENGINEERING EXCELLENCE.        ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │
│  GLOBAL STANDARDS.               |  line-art elevation |   │
│  NATIONAL COMMITMENT.            |  of a plant/         |   │
│                                   |  substation, drawn    |   │
│  ATC delivers integrated          |  in on load, with     |   │
│  engineering & contracting        |  dimension ticks      |   │
│  services in collaboration        └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│  with SPC-KSA.                                             │
│                                                              │
│  [View projects]   [Discuss your project]                  │
│  ─────────────────────────────────────────────────────    │
│  200M SAR turnover · 9 engineering divisions · PK + KSA     │
│                                              ATC/01–HOME/A  │
└──────────────────────────────────────────────────────────┘
```

Services are presented as a **schematic diagram of six connected divisions**, not a grid of rounded icon cards — it mirrors ATC's own "Organizational Structure" section in the profile PDF and avoids the generic SaaS-card look entirely.

### Principles

1. **Evidence over adjectives.** Real numbers and real client names (AWT, ROSHN, NEOM, Herfy, Crown Gulf) do the persuading — copy stays plain and factual, matching the profile document's own register.
2. **One orchestrated motion moment.** The hero's line-art elevation draws itself once on load (blueprint-plot effect). Everything else is quiet.
3. **Structure as content, not decoration.** Rules, ticks, and sheet references encode information (this is section 01, this is a diagram) rather than existing purely for style.
4. **No arrows, no ALL CAPS labels, no middle-dot meta chrome.** CTA text says exactly what happens: "View projects," "Discuss your project," "Send inquiry" — these are ATC's own sitemap CTA labels, kept verbatim.

---

## 2. Site structure — 5 primary pages, 6 service divisions

The client's sitemap doc defines 5 pages. I've reconciled the two service taxonomies you provided — `Structure of website.docx`'s 5 categories (Design works, Infrastructure design, Project Execution, Finishing works, Security & safety) and the PDF's 9 operational divisions (which also cover Oil & Gas, Defense, IT/Smart, O&M, Procurement) — into **6 service divisions** so nothing from the profile gets dropped. Flagging this as an assumption for you to confirm with the client before build.

### 1 — Home
- **Hero**: tagline "Engineering Excellence. Global Standards. National Commitment." (ATC's own line from the profile), one-line intro, line-art elevation animation, dual CTA (View projects / Discuss your project)
- **Intro strip**: who ATC is + SPC-KSA collaboration, in 2–3 sentences
- **Services overview**: the 6-division schematic, each linking to its Services page anchor
- **Featured project**: one flagship reference (ROSHAN Villas mega project or AWT collaboration) with real scope bullets
- **Company stats**: 200M SAR turnover, divisions, countries, key clients — count-up animation on scroll (once)
- CTA: View projects

### 2 — About Us
- Who ATC is + the SPC-KSA strategic collaboration story
- Vision / Mission (verbatim from profile)
- Core values (5 values, shown as a simple list, not icon cards)
- Why choose us: Saudi engineering standards transferred to Pakistan, ISO-aligned QHSE, zero-accident target
- Organizational structure diagram (9 divisions: Civil, Electrical & Power, Mechanical & HVAC, Oil & Gas, Defense & Infrastructure, IT & Smart Systems, Procurement & Trading, Finance/HR/Admin, HSE)
- Leadership note (experienced engineers/PMs — no named bios were provided, so this stays descriptive unless the client supplies headshots/names)
- CTA: Contact us

### 3 — Services (hub page, 6 sections/anchors)
1. **Design & Engineering** — architectural, HVAC, air ducting, electrical & mechanical, firefighting, plumbing design; infrastructure design (roads/highways, bridges, water supply & drainage, power infra, telecom networks, landscaping, site development)
2. **Civil & Infrastructure Construction** — industrial/commercial buildings, warehouses & logistics, road construction, boundary walls, drainage/sewerage, renovation & structural upgrades, project execution process (procurement, QC, HSE, testing, handover)
3. **Electrical, Power & Mechanical Systems** — MV/LV distribution, transformers, RMU/substations, generators; HVAC/chillers/ventilation, industrial piping; oil, gas & petroleum infrastructure (fuel systems, pump calibration, depot maintenance)
4. **Finishing Works** — scratch-to-completion, furnishing, aluminum works, wood works, iron welding, wall finishing, safety works
5. **Security, Smart & IT Infrastructure** — face lock systems, fire alarm, CCTV, smart door locks, data center infra, access control, building automation (IoT), fiber optic networks
6. **Defense, Industrial Maintenance & Operations** — defense/military infrastructure support, factory maintenance & AMC, 24/7 technical support, trading & technical procurement

Each division section: short description, service bullet list, one supporting reference project where applicable, "Request this service" micro-CTA into the Contact form (pre-filling the inquiry-type dropdown).
- CTA: Discuss your project

### 4 — Projects
- Filterable gallery by sector: **Defense**, **Residential**, **Industrial/Power**, **Oil & Gas**
- Featured references, pulled directly from the profile: American Military Facilities (KSA), Herfy Foods, Crown Gulf, ROSHAN Villas mega project, NEOM Power Generation, Army Welfare Trust (Askari housing, commercial towers, Askari Bank outlets)
- ⚠️ **Content note**: most of these references are delivered through the Saudi partner (SPC‑KSA), while AWT appears to be ATC's own Pakistan-based ongoing work. I'd recommend labeling each project card with where it was delivered (e.g. "Delivered via SPC-KSA" vs "ATC Pakistan") so the site doesn't overstate ATC's direct track record — worth confirming with the client which projects they're comfortable presenting as their own vs. partner-delivered.
- Project detail view: category, location, scope bullets, division involved
- CTA: View project

### 5 — Contact Us
- Headline: "Let's build together"
- Contact info: Pakistan office, phone/email, and a note on the SPC-KSA partnership
- Inquiry form: name, company, service division (dropdown, matches the 6 divisions), project scope, message
- Map embed (Islamabad/Rawalpindi)
- CTA: Send inquiry

---

## 3. Motion & interaction — deliberately restrained

Per the "one orchestrated moment" principle, most of the site is still. The moments that do move all *explain* something rather than decorate it:

| Moment | Effect | Trigger |
|---|---|---|
| Hero elevation illustration | SVG line-art draws itself (stroke-dashoffset), like a drawing being plotted | Once, on page load |
| Stat counters (turnover, divisions, countries) | Count up from 0 | Once, on scroll into view |
| Org-structure diagram (About page) | Nodes and connecting lines draw in sequentially | Once, on scroll into view |
| Nav links / project filter tabs | Brass underline draws in on hover/active | User hover/click |
| Project gallery filtering | Cross-fade between filtered sets | User selects a filter |
| Contact form success | Understated checkmark stroke-draw, no confetti | Form submit success |

Everything else (service sections, cards, page transitions) is static — **no fade-and-slide-up on every section**, no shadow-lift on every hover. `prefers-reduced-motion` disables all of the above in favor of static end-states.

---

## 4. Tech stack

### Recommended (full build, with a way for ATC staff to add new projects without a developer)

- **Frontend**: Next.js (React) + Tailwind CSS, configured directly from the token table in §1 (colors/type/spacing as Tailwind theme extensions)
- **Animation**: Framer Motion for the scroll/load-triggered moments in §3; plain CSS transitions for hover states
- **Content for Projects**: a lightweight headless CMS (Sanity or Strapi) so new project references, photos, and stats can be added without touching code
- **Contact form backend**: Node/Express API route (or Next.js API route) → email via a transactional service (Resend/SendGrid), with basic spam protection (honeypot + rate limit)
- **Hosting**: Vercel (Next.js-native) or any Node-capable host

### Lighter alternative (static site, no CMS, faster/cheaper to ship)

- Plain **HTML/CSS/vanilla JS**, with project data in a single JSON file the client can hand you to edit
- **GSAP** (or plain CSS `@keyframes`/`stroke-dashoffset`) for the hero draw-in and count-up animations
- Contact form via **Formspree** or **EmailJS** — no backend needed
- Hosting: any static host (Netlify, Vercel, GitHub Pages)

Given ATC will likely add new completed projects over time, I'd lean toward the **first option** — but if budget/timeline is tight, the static version gets you the identical visual design with less infrastructure, and can be upgraded later.

---

## 5. Build sequence

1. Lock the token system (colors, type, spacing) as CSS variables / Tailwind theme — before any page is built
2. Build the hero line-art illustration + draw-in animation in isolation, test `prefers-reduced-motion` fallback
3. Build Home (uses almost every component the rest of the site needs: stat counters, division schematic, project card)
4. Build Services hub with the 6 divisions — confirm the reconciled taxonomy (§2) with the client first
5. Build About (org-structure diagram reuses the Home division-schematic component)
6. Build Projects (gallery + filter + detail view) — confirm sourcing labels (SPC-KSA vs ATC Pakistan) with client first
7. Build Contact (form + validation + success state)
8. Responsive pass (mobile-first check on the drawing-sheet frame — corner ticks and sheet references need to survive small screens without clutter)
9. Accessibility pass: color contrast on navy/brass combinations, visible keyboard focus rings, alt text for all diagrams
10. Performance pass: SVG line-art kept as inline SVG (not raster), lazy-load project gallery images

---

## Open questions for the client

- Confirm the 6-division services taxonomy in §2 (merges your two source documents + the PDF's 9 divisions)
- Which Projects entries can be shown as ATC's own delivered work vs. SPC-KSA-delivered references?
- Do you have real leadership names/photos for the About page, or should it stay descriptive?
- Do you want the CMS-backed build (Next.js) or the lighter static build?
