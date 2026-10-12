# ATC Services — UI/UX audit and alignment brief

Date: 11 October 2026  
Page: http://localhost:8000/services.html  
Reference: current local homepage, http://localhost:8000/index.html

## Recommendation

Align Services with the homepage's **three service pillars: Engineering & Construction, Engineering Consultancy, and Trading & Procurement**. Within Engineering & Construction, show the same eight service categories and working destinations. Consultancy and procurement should remain distinct pillars rather than inflate the construction-sector count.

Retain the orange/charcoal identity, typography, shared logo and service-specific inquiries. Fix the mobile hero, missing destinations and inquiry handoff before expanding the visual design. The current page contains useful scope descriptions, but its catalogue has fallen behind the homepage.

Audience: project owners, procurement teams, consultants and developers. Intended journey: find the relevant service → understand scope and deliverables → review relevant evidence → make a contextual inquiry.

## Scope and method

Used the UI UX Designer audit approach from the earlier report, supplemented by UIAudit technical checks. Inspected local HTML/CSS/JavaScript and rendered the page in headless Microsoft Edge at 1440 × 1000, 768 × 844, 390 × 844 and 360 × 844. Captured each existing service section, inspected child-element bounds, checked images and navigated all eight service inquiry URLs without submitting any forms.

The current local homepage is the content reference; its uncommitted edits were preserved. This report does not claim parity with GitHub. No website implementation files were changed. Scores are reviewer judgments, not user-testing results or accessibility certification. The Impeccable context engine could not initialize because its cache location was unavailable; its bundled automated detector was therefore not run. No PRODUCT.md or DESIGN.md was found in the project file inventory. Findings below come from source and browser evidence.

## Implementation integrity verdict

**Fail on cross-page consistency; retain the existing visual foundation.** Two homepage destinations are absent, service numbers disagree within Services, and two inquiry categories cannot be carried into the contact form. These are verified implementation defects, not detector findings.

## Audit scorecard

| Dimension | Score / 4 | Evidence |
|---|---:|---|
| Accessibility | 2 | Semantic links and labelled navigation exist; normal-size service text has insufficient contrast on white and mobile content is clipped. |
| Performance | 2 | Eight service images use lazy loading, but the shared 1254px logo transfers approximately 1.22 MB for a small header mark. No field performance measurements taken. |
| Responsive design | 1 | Main hero content extends to x≈533px on both 360px and 390px screens; hidden overflow conceals it. Desktop and 768px bounds checks found no overflow. |
| Theming | 2 | Shared tokens and an accessible button token exist; hero text treatment and hard-coded panel colors remain inconsistent. A user-selectable dark theme is not required for this site. |
| Implementation integrity | 1 | Two missing anchors, inconsistent numbering, missing trading navigation and lost inquiry selections. |
| **Total** | **8/20** | **Poor — substantial repair needed in the affected areas.** |

Issue totals: **1 P0, 5 P1, 5 P2, 0 P3**. The P0 is a downstream inquiry-delivery dependency discovered during the Services journey, not an outage of the Services page itself.

## Homepage-to-Services alignment matrix

Use these ten customer-facing entries, grouped under the three pillars. Keep the eight construction entries in homepage order.

| Homepage service | Required destination | Current Services state | Required alignment |
|---|---|---|---|
| Design & Engineering | `#design` | Present; architectural, structural, MEP and infrastructure scope. | Retain scope; use the same label in overview and detail. |
| Civil & Infrastructure | `#civil` | Present as Civil & Infrastructure Construction. | Retain detailed heading if useful; standardize overview label. |
| Electrical, Power & Mechanical | `#electrical` | Detailed heading includes Mechanical; overview says Electrical & Power. Some oil/gas work is buried here. | Add Mechanical to overview; distinguish general mechanical work from dedicated oil/gas scope. |
| Finishing Works | `#finishing` | Present with fit-out, facades, joinery and specialist finishes. | Retain; reconcile homepage-specific acoustic ceiling/curtain wall wording with approved scope. |
| Security, Smart & IT | `#security` | Detailed section includes IT; overview says Security & Smart. | Include IT consistently and preserve BMS, access, CCTV and network scope. |
| Defense & Operations | `#defense` | Present, combined with industrial maintenance. | Keep defense-facility construction, resilience and facility operations here; move general factory maintenance into its own section. |
| Oil, Gas & Petroleum | `#oil-gas` | **Destination missing.** Some fuel systems/depot work appears under Electrical. | Add a dedicated section matching the homepage's refineries, fuel retail, tanks, piping and hazardous-area systems; publish only approved scope. |
| Industrial & Factory Maintenance | `#industrial-maintenance` | **Destination missing.** Partial AMC/PPM content is inside Defense. | Create its own section covering the homepage's preventive/corrective maintenance, shutdowns, overhauls and AMC scope. |
| Engineering Consultancy & Advisory | `#consultancy` | Present as Engineering Consultancy & Technical Advisory; listed first in overview but seventh in detail. | Separate pillar with PMC, BIM, value engineering and QA/QC; use consistent naming. |
| Trading & Technical Procurement | `#trading` | Detail section exists, but overview and footer division list omit it. Homepage sends visitors directly to `contact.html?subject=trading`. | Add visible overview navigation and include industrial PPE from homepage scope if approved. Give visitors a Services destination and retain a separate quotation action. |

Do not describe all ten entries as “ten construction divisions.” Recommended summary: **“Eight engineering and construction service areas, supported by consultancy and procurement.”** This is an information structure, not a claim about ATC's legal departments.

## Prioritized findings

### 1. [P0] Inquiry delivery is not production-ready

**Location:** `js/contact.js:81–95`; Services inquiry links. **Category:** implementation integrity. **Principle:** error prevention and honest status. **Effort:** medium, configuration dependent.

The destination form calls EmailJS with `YOUR_SERVICE_ID` and `YOUR_TEMPLATE_ID`; if EmailJS is unavailable, the fallback displays success without sending anything. This source-confirmed dependency could cause a Services visitor to believe an inquiry was delivered when it was not. No live submission was attempted.

**Fix:** connect a real delivery service, show success only after confirmed delivery, and retain a working email fallback. Verify successful receipt and failure handling using an authorized test inquiry before release. Suggested workflow: `/impeccable harden`.

### 2. [P1] Two homepage links have no service destination

**Location:** `index.html:300,309`; missing IDs in `services.html`. **Category:** implementation integrity. **Principle:** consistency and recognition. **Effort:** medium.

Oil, Gas & Petroleum and Industrial & Factory Maintenance link to nonexistent fragments. Visitors arrive on Services without reaching the service they selected. Related bullets elsewhere do not satisfy those links.

**Fix:** create both dedicated sections with the exact IDs, overview links, appropriate approved scope and contextual inquiry actions. Preserve existing fragment URLs. Suggested workflow: `/impeccable clarify`.

### 3. [P1] Mobile hero is visibly clipped

**Location:** `css/components.css:792` and `:916`; `services.html:36`; `css/base.css:24–27`. **Category:** responsive/accessibility. **Principle:** readable content; reflow. **Effort:** small–medium.

At 360px and 390px the hero text and drawing measure approximately 513px wide, extending from x=20 to x≈533. The heading, summary and illustration are cut off. Document scrollWidth still equals viewport width because horizontal overflow is hidden; that metric alone gives a false pass.

**Fix:** use shrinkable grid tracks such as `minmax(0,1fr)`, set `min-width:0` on grid/flex children, constrain the diagram, and allow its header labels to wrap or truncate inside a bounded container. Verify descendant bounds and 200% text sizing, not only document width. Suggested workflow: `/impeccable adapt`.

### 4. [P1] Consultancy and procurement lose the selected service

**Location:** `services.html:588,640`; `contact.html:134`; `js/contact.js:8–18`; homepage `index.html:327`. **Category:** implementation integrity. **Principle:** continuity and error prevention. **Effort:** small.

Browser navigation confirmed that six existing service links select the correct dropdown value. Consultancy and procurement both leave it blank because matching options do not exist. The homepage trading link additionally uses `subject`, while the form only reads `service`. New oil/gas and industrial categories are also absent from the dropdown.

**Fix:** define stable service IDs and one URL convention across both pages and the form; include all ten categories. Accept the existing trading URL for compatibility or update its source. Suggested workflow: `/impeccable harden`.

### 5. [P1] Essential text contrast is insufficient

**Location:** `css/pages/services.css`, `.svc-list li` and `.division__num`; `css/base.css:27`; `services.html:42–48`. **Category:** accessibility/theming. **Principle:** readability. **Effort:** small.

Service-list text uses `#787F87` on white, approximately **4.05:1**, below the 4.5:1 criterion for normal text. The hero information strip inherits dark body text and is visibly difficult to read against the dark hero. The strip has no matching component styles in the stylesheets loaded by this page.

**Fix:** introduce explicit readable text tokens for light and dark surfaces; measure final computed colors, including overlays. Keep normal text at least 4.5:1. Do not apply the previous homepage's orange-button warning blindly: current white text on `#BA4015` computes to **5.48:1** and passes that check. Suggested workflow: `/impeccable colorize`.

### 6. [P1] Catalogue counts, numbering and discovery disagree

**Location:** `services.html:7,43,113,119–205` and section labels. **Category:** implementation integrity. **Principle:** consistency and recognition. **Effort:** small–medium.

Metadata says six divisions; hero and navigation say seven; there are eight detail sections including trading. Consultancy is DIV 01 in the overview and Division 07 in its section. Design is DIV 02 in the overview and Division 01 below. Trading is absent from the top service selector and footer division links.

**Fix:** adopt the three-pillar/eight-construction-area structure above. Update metadata, overview, diagram, section numbering and footer together; preferably remove decorative division numbers where they add no value. Suggested workflow: `/impeccable clarify`.

### 7. [P2] Very long page makes comparison and switching costly

**Location:** `services.html` repeated division sections; `.services-hero-grid`. **Category:** responsive/information architecture. **Principle:** efficiency and minimalism. **Effort:** medium.

Measured page height is about 7,708px on desktop and 12,417px at 390px. Seven full-height overview cards stack vertically on small screens, then each service repeats long bullet lists and a large image CTA. Adding two more identical sections would extend the problem.

**Fix:** use a compact grouped service index, concise summaries and three to six grouped deliverables per section. Retain accessible detail lists where needed. Offer a clear return-to-services action or a compact sticky jump menu with focus-safe offsets. Suggested workflow: `/impeccable distill`.

### 8. [P2] Shared logo is unnecessarily heavy

**Location:** `services.html:22`; `assests/logo/ATC Construction Crane Logo.png`. **Category:** performance. **Principle:** efficient access. **Effort:** small.

Browser resource timing recorded approximately 1,217,602 transferred bytes for a 1254px-wide logo displayed as a small header mark. Service images already lazy-load, so the logo is a concrete first-load optimization opportunity.

**Fix:** use an approved vector or appropriately sized optimized raster, preserve its appearance, and set dimensions. Local transfer duration is not a real-user speed benchmark. Suggested workflow: `/impeccable optimize`.

### 9. [P2] Credential-style claims lack visible supporting context

**Location:** `services.html:48,103`, consultancy and procurement scope. **Category:** implementation integrity. **Principle:** credibility and real-world clarity. **Effort:** small, evidence dependent.

“ISO 9001 / ASTM Quality,” “PK & KSA CERTIFIED,” manufacturer authorization and statutory-clearance wording are shown without identifying supporting documents, entities or scope. This audit does not establish that they are false. Decorative “SYSTEM SYNCHRONIZED” telemetry also looks like live status without explaining what it measures.

**Fix:** substantiate and precisely attribute credentials, or replace them with approved descriptions of actual processes. Remove decorative live-status language. If the Rising Sun JV supports a service, explain the delivery role and attribute its C1 registration to Rising Sun, not ATC. Do not infer new geographical authorizations from homepage market names. Suggested workflow: `/impeccable clarify`.

### 10. [P2] Service descriptions lack nearby project evidence

**Location:** all `.service-media-card` sections. **Category:** content/inquiry journey. **Principle:** support informed decisions. **Effort:** medium, assets dependent.

Images sit behind dark CTA overlays; each card mainly repeats its service title. No service-specific project link explains ATC's role, delivered scope or outcome. This is a design judgment, not a measured conversion loss.

**Fix:** attach a relevant approved project reference where available; identify location, role and scope. Label illustrative images appropriately. Keep one contextual inquiry button per section, with a readable image caption rather than repeated sales copy. Suggested workflow: `/impeccable layout`.

### 11. [P2] Contact actions and closing section are inconsistent

**Location:** `services.html:28,650–673`. **Category:** inquiry journey. **Principle:** consistency and efficiency. **Effort:** small.

Header uses “Get in Touch” rather than the homepage's “Discuss Your Project.” The page ends after procurement without a general multi-service inquiry panel. Footer email is plain text, requiring visitors to copy it.

**Fix:** standardize the general CTA, add a compact closing inquiry panel and make the approved email a `mailto:` link. Keep specific service inquiry labels where they convey context. Suggested workflow: `/impeccable clarify`.

## Proposed page structure

1. **Hero:** “Engineering, Construction & Project Services.” Short introduction and “Discuss Your Project” / “Browse Services” actions. Keep the industrial visual language, but make service selection more prominent than the diagram.
2. **Three-pillar overview:** Engineering & Construction; Engineering Consultancy; Trading & Procurement.
3. **Eight construction service areas:** compact index and detail sections in homepage order, including the two missing destinations. Each section: summary, key scope, deliverables, approved evidence and inquiry action.
4. **Engineering Consultancy & Advisory:** distinct section for advisory deliverables and responsibilities; avoid duplicating design execution scope.
5. **Trading & Technical Procurement:** distinct equipment/material categories, quotation requirements and approved supply arrangements.
6. **Delivery approach:** brief scope review → planning/design → execution/supply → testing/handover, only where these accurately describe the engagement. Consultancy-only and supply-only work should not imply full construction delivery.
7. **Closing inquiry and shared footer:** project type, location and required scope; working contact routes.

Suggested introduction: “Explore ATC's engineering and construction services, technical consultancy, and project procurement. Find the support your project needs, from design and construction to specialist systems and maintenance.”

Do not add unsupported equipment capacities, certifications, geographic offices, response commitments or project metrics while expanding scope.

## Five quick wins

1. Correct mobile hero sizing and verify all text remains visible.
2. Add the two missing service destinations with approved scope.
3. Add trading to the service index and reconcile labels/counts.
4. Fix contact preselection for every category; separately resolve delivery configuration before release.
5. Correct light-surface text contrast and the dark hero information strip.

## Positive findings to preserve

- Clear engineering identity, consistent logo and readable major section headings on desktop.
- Existing sections contain concrete scope items rather than only slogans.
- Eight service images use lazy loading; all ten image elements loaded after scrolling through the page.
- Six of eight existing contextual inquiry URLs preserve the service selection correctly.
- No uncaught JavaScript errors were captured during this audit.
- Mobile menu opened and its button changed `aria-expanded` to `true`.
- Current primary button color passes the measured normal-text contrast check.

## Implementation sequence and acceptance checks

First resolve inquiry delivery and service IDs. Then repair hero reflow and contrast. Next align the catalogue and navigation, shorten repeated sections, and add approved evidence. Finish with `/impeccable polish`, then re-run `/impeccable audit`. The fixes can be undertaken individually or together.

- Every homepage service reaches a visible, correctly named Services section, including `#oil-gas` and `#industrial-maintenance`.
- Three pillars and eight construction categories are consistent across metadata, overview, detail, contact options and footer.
- All ten service inquiry categories select correctly; legacy trading links are handled.
- Success appears only after confirmed inquiry delivery; failure exposes a usable recovery route.
- At 360, 390, 768 and 1440px, hero descendants remain within the viewport. Check 200% text scaling and keyboard focus as a separate acceptance pass.
- Light/dark text, hover and focus states meet measured contrast targets; use comfortably readable overview labels.
- Navigation works with keyboard and touch, anchor headings clear the fixed header, and no essential content depends on hover or animation.
- Verify reduced-motion behavior deliberately. Current shared CSS includes a global 0.01ms override; source presence alone is not proof of a complete motion experience.
- Project images and credentials have approved sources and accurate attribution.

## Evidence and limitations

Evidence folder: `audit-output/services/`. Browser observations: `observations.json`. Reproducible capture script: `services-audit.cjs` at project root. Screenshots: `1440-hero.png`, `768-hero.png`, `390-hero.png`, `360-hero.png`, all eight existing section-name PNGs, `mobile-design.png`, and `mobile-menu.png`.

This review covers Services plus its immediate homepage/contact handoff. No backend submission, full screen-reader audit, real-device testing, Lighthouse/field performance benchmark or business credential verification was performed. The service-list contrast calculation uses the stylesheet's solid colors; gradient/overlay combinations require individual measurement during remediation. The contact-delivery finding is source evidence, not a tested delivery failure. Existing unrelated workspace edits were preserved.
