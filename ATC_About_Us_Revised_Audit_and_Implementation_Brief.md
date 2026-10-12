# ATC — About Us Page
## Revised UI/UX Audit, Corporate Content & Developer Implementation Brief

**Prepared:** 10 October 2026  
**Project:** Azaan Trading & Contracting (ATC) website  
**Repository:** [Mussab-21/ATC_Construction-site-](https://github.com/Mussab-21/ATC_Construction-site-)  
**Target page:** `about.html`  
**Reference audit:** User-supplied *ATC About Us — UI/UX audit and change brief*, dated 10 October 2026; reportedly checked against commit `3d697761d47444a81c49c5edf899ea396c4b0d09`.

> **Status and evidence boundary:** This is a revised **audit and implementation specification**, not a claim that the site's HTML/CSS/JavaScript has been edited. The reported pixel measurements and interaction findings come from the supplied audit; they have **not** been independently retested in this revision. The GitHub source was not independently retrieved during preparation. Company registrations, turnover, completed-project totals, historical claims and partnership documentation also require verification before publication.

---

## 1. Executive decision

**Preserve ATC's black/charcoal + orange visual identity; redesign the About Us content and the hero graphic around three customer-facing core divisions.** The page should explain who ATC is, how the divisions work together, how project responsibilities are managed, and which project experience is attributable to which entity. It should reinforce the homepage, **not duplicate the Services catalogue or display unsupported corporate statistics**.

### Approved homepage positioning — preserve verbatim

**Eyebrow:** `ENGINEERING · CONSULTANCY · PROCUREMENT`  
**Main headline:** `Integrated Expertise. Complete Project Solutions.`  
**Supporting statement:**  
> Delivering integrated solutions across civil construction, infrastructure development, MEP engineering, technical consultancy, and strategic procurement — from concept to completion.

**The About page must complement this identity with different, explanatory wording.** The three division names throughout the website should be consistent:

1. **Engineering & Construction**
2. **Engineering Consultancy**
3. **Trading & Procurement**

These are **core service divisions / business pillars** for website navigation. Do not describe Finance, HR, Administration, or HSE as additional customer-facing engineering divisions. The eight sector labels on the homepage are **markets/sectors served**, not eight legal subsidiaries or independent divisions.

### Recommended About-page hero — approved direction for implementation

| Element | Replacement |
|---|---|
| Eyebrow | `WHO WE ARE` |
| H1, line 1 | `Three Core Divisions.` |
| H1, line 2, orange accent | `One Integrated Partner.` |
| Hero supporting paragraph | `Azaan Trading & Contracting (ATC) integrates engineering and construction, technical consultancy, and strategic procurement to support civil, infrastructure, MEP, industrial, and specialized projects from planning through execution and delivery.` |
| Primary button | `Discuss Your Project` → working contact/inquiry section |
| Secondary button | `Explore Our Projects` → working projects page |
| Optional tertiary text link | `View Company Profile` → approved, current and accessible PDF only |

**Why this is better:** It expresses the three pillars in plain language; feels credible to owners, developers, consultants, contractors and procurement teams; and does not repeat the exact homepage headline.

---

## 2. What is wrong with the current audit — and how this revision improves it

The supplied audit is directionally strong, especially its layout and accessibility findings, but some recommendations need tightening before a developer uses them as instructions.

| Original audit issue or weak recommendation | Improved decision |
|---|---|
| Suggested hero `Engineering Expertise. Accountable Project Delivery.` | **Replace.** It makes consultancy/procurement less visible. Use `Three Core Divisions. One Integrated Partner.` |
| Proposed two-country diagram upgrade to a three-country diagram | **Replace diagram entirely.** Show the three integrated business divisions; cover geographic project experience in its own factual section. |
| Treat `8 specialized sectors` as a replacement for `9 divisions` | **Clarify category hierarchy.** Three divisions are services; eight sectors are served industries; corporate support functions are neither. |
| Recommend a definite `Rising Sun JV` claim | **Conditional language.** Publish “joint venture” only with executed agreement and legal-name/role verification. Otherwise use “Strategic Collaboration” or omit. |
| Recommend generic founding date, milestones and leadership | **Only verified facts.** If documents are missing, use a concise capability story instead of placeholders or invented history. |
| Recommend figures such as countries, years and projects as credibility signals | **Evidence gate.** Remove figures without clearly attributable sources; do not transfer partner/SPC/Lucky 9/DSAC experience to ATC. |
| Suggested QA/HSE practices as proof | **Validate first.** Use specific procedures (ITPs, inspections, toolbox talks, handover records) only where actually in use and documented. |
| Proposed numerous long About sections | **Shorter page architecture.** Limit repeated claims, keep a tighter operating-model visual and a few evidence-backed project links. |
| Technical bug notes have no acceptance owner | **Add fix-ready recommendations and measurable pass/fail tests**, including narrow-screen child bounds and keyboard behavior. |
| Client/project references potentially combined | **Keep `Our Clients` and `Our Projects` distinct**, consistent with ATC's broader website decision. Clearly state direct client vs main contractor vs developer. |

---

## 3. Prioritized defect register

The evidence in the “Observed / reported” column is **from the supplied audit**, not newly measured.

| Priority | Observed / reported defect | Required change | Acceptance test |
|---|---|---|---|
| **P0 — Mobile** | At ~390px the hero, metrics and diagram extend to ~562px and are clipped by `overflow:hidden`. | Fix grid min-width, media constraints and mobile stacking; don't rely on hidden overflow to mask clipping. | At 360, 390, 768, 1024 and 1440px every hero child fits viewport/container; no clipped text, stats or media. |
| **P0 — Trust** | Two-country / nine-division story conflicts with new three-pillar homepage; references to Bahrain incomplete. | Switch About hero and visual to three divisions. Treat countries as separately verified project markets. | All division names match Home and Services; geographic wording is accurate. |
| **P0 — Claims** | `DOSSIER VERIFIED`, `200M SAR turnover`, `15+ years`, `50+ projects`, and legacy division counts lack visible provenance. | Remove pending signed-off evidence, or add entity owner, source and period. | No unverifiable figure or certification-style badge remains. |
| **P0 — Accessibility** | Core Values description visibility does not reliably agree with `aria-expanded`, focus and Enter behavior. | Prefer fully visible static value cards. If interactive, rebuild as semantic disclosure controls. | Readable by keyboard, touch and screen reader; visible and announced state agree. |
| **P1 — Layout** | Core Values cards reportedly have zero computed desktop padding. | Apply consistent responsive card padding and gap; ensure long strings wrap. | Text/icons do not touch borders at any target viewport. |
| **P1 — Partner attribution** | Rising Sun credentials appear on Home without suitable About explanation. | Add one compact, correctly attributed partner/collaboration block **only after approval**. | Legal name, registration category, issuing body, entity ownership, scope and project role are accurate. |
| **P1 — Conversion** | CTA varies between `Get in Touch`, `Contact Us`, `Discuss Your Project`. Footer shows placeholder phone. | Standardize to `Discuss Your Project`. Correct footer and contact methods. | Buttons and `tel:`/`mailto:` links work; no placeholder phone survives. |
| **P1 — Length** | Decorative org hierarchy consumes substantial desktop/mobile space; About repeats promises. | Replace with one compact three-pillar delivery graphic and concise operating model. | Page is scannable without losing key content; no repeated capability catalogue. |
| **P2 — Evidence** | Generic story illustration / alt text does not establish reality of depicted work. | Use an approved ATC project/team photograph with accurate caption and alt text; otherwise label conceptual artwork clearly. | No illustrative image is presented as a real ATC project. |
| **P2 — Polish** | Revision codes and engineering-sounding decorative badges distract from substance. | Reduce decoration and prioritize readable labels and real evidence. | Every prominent label has visitor-facing meaning. |
| **P2 — SEO / performance** | Not assessed in original audit. | Verify heading hierarchy, metadata, accessible links, compression and sensible image loading. | No duplicate H1, broken links, oversized assets or confusing metadata. |

**Priority definitions:** P0 = must fix before publication; P1 = high-value for next release; P2 = quality improvements. These are implementation priorities, not independently measured revenue or conversion impacts.

---

## 4. Recommended page information architecture

**Avoid adding eight long blocks after an already tall About page.** Use this concise sequence:

| Order | Section | Purpose | Preferred treatment |
|---|---|---|---|
| 1 | **Hero — Who We Are** | Establish integrated identity | Short copy, 2 CTAs, three-division graphic |
| 2 | **Our Approach** | Explain how three divisions work together | One short paragraph + 3 service-pillar cards |
| 3 | **Who We Work With / Track Record** | Give factual credibility | Small proof area, links to **separate** Clients and Projects pages |
| 4 | **Project Delivery Model** | Explain accountability and execution | 4 simple steps instead of 9-department org chart |
| 5 | **Partnership & Regional Experience** | Explain delivery arrangements and any valid JV | Compact factual cards; only verified statements |
| 6 | **Values & Commitments** | Show professional operating principles | 4 always-visible, short value cards |
| 7 | **Closing CTA** | Start commercial inquiry | `Discuss Your Project`, `Explore Our Projects` |

**Optional:** A short *Leadership* or *Our History* section may be added only when verified names/roles, dates and approved images are available. Do not create an empty placeholder section simply to make the site look large.

---

## 5. Ready-to-paste revised website copy

Copy below is **marketing/editorial positioning**, not independently verified assertions about registrations or past projects.

### 5.1 Hero / Above the fold

**Eyebrow:** `WHO WE ARE`  
**H1:**

> **Three Core Divisions.**  
> **One Integrated Partner.**

**Subheading:**

> Azaan Trading & Contracting (ATC) integrates engineering and construction, technical consultancy, and strategic procurement to support civil, infrastructure, MEP, industrial, and specialized projects from planning through execution and delivery.

**Buttons:** `Discuss Your Project` | `Explore Our Projects`

### 5.2 Our Approach

**Eyebrow:** `OUR APPROACH`  
**H2:** `Integrated Capabilities. Coordinated Delivery.`

> We combine technical insight, practical construction capability, and procurement coordination within a connected approach to project delivery. By aligning engineering requirements, execution planning, and supply-chain priorities, ATC helps clients navigate each stage of a project with greater clarity and continuity.

**Service pillar cards:**

- **Engineering & Construction** — Civil works, infrastructure, MEP systems, industrial facilities, construction management, and specialized engineering execution.
- **Engineering Consultancy** — Technical advisory, feasibility and planning support, design coordination/review, engineering assessments, and project advisory services.
- **Trading & Procurement** — Strategic sourcing, equipment and materials procurement, supplier coordination, technical compliance support, and logistics interface.

**Use only the offerings actually supported by ATC's scope and operating capacity.** These are proposed website service summaries, not a compliance or licensing determination.

### 5.3 A factual credibility section (without invented metrics)

**Eyebrow:** `PROJECT EXPERIENCE`  
**H2:** `Our Relationships. Our Work.`

> Our professional experience spans multiple project environments, including residential developments, commercial facilities, industrial works, and infrastructure-related assignments. We present our client relationships and project portfolio separately, with clear identification of the parties, scope, and role involved.

**Two distinct links (never merge into a single logo/project list):**

- **Our Clients** → logo/name gallery grouped by verified relationship and market, with approved logo rights.
- **Our Projects** → factual portfolio cards showing project title, location, scope, contracting entity, ATC/partner role, and documented status.

**Editorial caveat:** Where work was performed by a partner, associated contractor, former employer, or group company, do **not** say ATC itself delivered it unless the contractual record substantiates the claim. Use a labeled category such as `Experience Through Associated Contracting Teams` only when approved and explain the relationship.

### 5.4 Delivery model (replace decorative organization hierarchy)

**Eyebrow:** `HOW WE WORK`  
**H2:** `From Project Requirements to Coordinated Delivery.`

1. **Understand the Requirement** — Clarify project scope, constraints, standards and commercial objectives.
2. **Develop the Solution** — Align engineering input, delivery strategy, technical review and resource planning.
3. **Coordinate Execution & Supply** — Integrate construction activities, procurement interfaces and project communication.
4. **Review & Deliver** — Support inspections, progress tracking, handover and close-out according to contractual requirements.

*This communicates the intended operating model; any claim about implemented internal controls must be reviewed by operations before publication.*

### 5.5 Vision and Mission (short versions)

**Our Vision**  
> To be a trusted partner for integrated engineering, consultancy, construction, and procurement solutions.

**Our Mission**  
> To connect technical expertise, practical execution, and strategic sourcing in a coordinated approach that supports successful project delivery.

Do not add a third long “Our Philosophy” section repeating the same language.

### 5.6 Values (always-visible static cards)

- **Integrity** — Transparent communication and clear professional commitments.
- **Technical Responsibility** — Decisions informed by engineering requirements and applicable standards.
- **Collaboration** — Coordinated work across disciplines, partners, clients, and delivery teams.
- **Delivery Focus** — Attention to agreed scope, quality requirements, milestones, and handover.

These are proposed company values; leadership should approve them as genuine corporate commitments.

### 5.7 Partner/JV block — conditional publication

**If a signed joint venture agreement exists and the exact scope is approved:**

**H2:** `Project Delivery Partnerships`  
> For designated projects, ATC works through formally agreed project partnerships and joint ventures to combine complementary technical, construction, and delivery capabilities. Where applicable, Rising Sun Construction LLP participates under its own legal identity and registration credentials; specific project responsibilities are defined by the governing agreement.

**If collaboration exists but no executed JV agreement can be produced:**

**H2:** `Strategic Project Collaboration`  
> ATC works with specialist contractors and project collaborators where additional delivery capabilities are required. The identity, responsibilities, and qualifications of participating parties are established for each engagement.

**If the relationship is not formally documented:** omit the named partnership block. A website should not represent proposed or informal discussions as an executed JV.

**Non-negotiable:** PEC category **C1/E**, licence numbers, eligibility limits, incorporation date and portfolio references must be attributed to the **certificate-holding entity** and verified for currency. Do not transfer them to ATC by implication.

### 5.8 Regional experience — separate from legal offices

**H2:** `Experience Across Multiple Markets`

> Our portfolio and professional collaborations encompass project activity associated with Pakistan, Saudi Arabia, and Bahrain. The nature of each engagement — direct contracting, subcontracting, joint venture, or associated-team experience — is identified within the relevant project record.

Use this text **only if the individual project relationships can be substantiated**. For each country, maintain an internal record identifying legal entity, client, date, project and ATC relationship. Do **not** label a country as an ATC registered office or branch without registration documentation.

### 5.9 Closing CTA

**H2:** `Let's Discuss Your Project Requirements.`  
**Subheading:**
> Connect with ATC to explore engineering, construction, consultancy, and procurement solutions aligned with your project's technical and commercial needs.

**Primary CTA:** `Discuss Your Project`  
**Secondary CTA:** `Explore Our Projects`

---

## 6. Specific replacements in the current About Us hero

| Replace/remove | Use instead | Why |
|---|---|---|
| `Built on Precision. Driven by Results.` | `Three Core Divisions. One Integrated Partner.` | Fully represents the chosen corporate positioning. |
| “Multi-division engineering and contracting company…” | New hero paragraph in §5.1 | Adds consultancy and procurement. |
| `2 Countries (PK & KSA)` | Remove numeric tile unless verified; describe actual markets separately | Avoids inconsistency and false branch-office impression. |
| `9 Specialist Divisions` | `3 Core Divisions` (or three named cards) | Corporate services, not internal support teams. |
| `15+ Years Track Record` | Remove until the source, company and period are confirmed | May conflate personnel/partner history with ATC's history. |
| `50+ Delivered Projects` | Remove until approved project register establishes the claim | Avoids combining legally separate contractors' projects. |
| `DOSSIER VERIFIED` | Remove | Looks like independent verification/certification without evidence. |
| `200M SAR TURNOVER` | Remove unless exact legal entity, financial year and verified source are approved | High-risk financial claim. |
| `DUAL-JURISDICTION ARCHITECTURE` / Islamabad–Riyadh schematic | `ATC INTEGRATED DELIVERY MODEL` / three business pillars | Better explains the operating model and does not imply offices. |
| `Get in Touch` (header CTA) | `Discuss Your Project` | Consistent site-wide action. |
| Placeholder telephone in footer | Verified contact number, or remove phone field pending confirmation | A fake number damages trust. |

**Statistics recommendation:** Instead of replacing four dubious number tiles with four other unverified numbers, use **three clean division cards** or a proof strip stating only documented facts. Credibility improves when every number is defensible.

---

## 7. Right-side hero visual specification

**Remove the existing architectural-jurisdiction graphic** (country towers, revision codes, unsupported badges and revenue annotation). It is attractive but communicates geography rather than the three divisions.

### Replacement: “ATC — Integrated Delivery Model”

```text
             AZAAN TRADING & CONTRACTING
                   Integrated Partner
                            │
            ┌───────────────┼───────────────┐
            │               │               │
   ENGINEERING &     ENGINEERING      TRADING &
   CONSTRUCTION      CONSULTANCY      PROCUREMENT
            │               │               │
            └───────────────┼───────────────┘
                            │
                COMPLETE PROJECT SOLUTIONS
                   Concept → Completion
```

**Design requirements**

- Preserve ATC's charcoal background, restrained grid details, off-white text and orange accent.
- Draw the three cards **equally**, so consultancy/procurement do not appear secondary to construction.
- Use simple icons and readable text instead of fake CAD stamps or cryptic codes.
- On mobile, stack the three cards vertically and keep diagram width at 100% of its parent.
- Use accessible HTML text for all labels; decorative lines may be SVG/CSS.
- If the diagram duplicates hero text excessively, shorten it rather than adding animations.
- No `verified`, `certified`, `approved`, turnover or government-seal badge without substantiation.

### Authentic imagery alternative

If a suitable, rights-cleared project photo is available, use a **real ATC-attributable project photograph** rather than a complex abstract graphic. Caption it with project title, city, scope and ATC's exact project role. Choose either **photo** or **three-pillar graphic** as hero media; do not crowd the above-the-fold layout with both.

---

## 8. Front-end implementation notes

These are **illustrative code patterns**, not tested patches against the actual repository selectors. Map to the existing component/classes after reading `about.html`, `css/pages/about.css`, shared CSS, and `js/main.js`.

### 8.1 Eliminate clipping at narrow widths

```css
/* Adapt selectors to the project's actual class names. */
.about-hero,
.about-hero__content,
.about-hero__visual,
.about-section,
.about-grid > * {
  min-width: 0;
}

.about-hero__visual,
.about-hero img,
.about-hero svg {
  max-width: 100%;
}

.about-hero h1,
.about-hero p,
.about-card {
  overflow-wrap: break-word;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

@media (max-width: 767px) {
  .about-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .about-hero__visual {
    width: 100%;
    overflow: visible;
  }

  .about-hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
```

- Diagnose the specific overflowing child; `overflow-x:hidden` on `body` is **not** a fix.
- Check fixed `width`/`min-width`, transforms, `white-space:nowrap`, SVG viewboxes, grid intrinsic sizing, and long pseudo-element labels.
- Test the **actual child bounding rectangles**, not just `document.documentElement.scrollWidth`.
- Ensure navigation menu and CTAs are accessible on 360px devices.

### 8.2 Prefer static Core Values cards

```css
/* Generic example: edit to match actual DOM/classes. */
.about-value-card {
  padding: clamp(1.25rem, 2vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.about-value-card p {
  display: block;
  opacity: 1;
  visibility: visible;
  height: auto;
}
```

- Prefer **four short, always-visible cards**. They should not need hover, keyboard focus or JavaScript to reveal basic About-page copy.
- If expandable cards are retained instead, use real `<button>` triggers, update `aria-expanded` on every activation, connect with `aria-controls`, and synchronize pointer, Enter, Space and touch behavior. Do not rely on `:focus` alone to reveal content.

### 8.3 Site-wide CTA and contact integrity

- Keep the visible primary CTA text **`Discuss Your Project`** on Home, About and shared navigation/footer (where used).
- Route it to the correct form/section or contact page and test the actual destination.
- Replace any `+92 51 000 0000`-style placeholder with confirmed contact details, or temporarily remove that field.
- Use real `tel:` and `mailto:` links where applicable. Do not put dummy contact data in schema metadata.

### 8.4 Accessibility, SEO and media

- Exactly one clear H1 on About; subsequent sections use H2/H3 hierarchy.
- Visible `:focus-visible` styles; adequate text/button contrast; keyboard-operable navigation and CTAs.
- Honor `prefers-reduced-motion`; no important information revealed only through animation.
- Provide accurate alt text for informative photos; use empty alt text for purely decorative images.
- Appropriate page title / meta description unique to About (avoid keyword stuffing).
- Resize/encode photographs to WebP/AVIF where appropriate; lazy-load below-the-fold images, but do not delay critical hero content unnecessarily.
- Review logo display, typography and image crop at both portrait and widescreen widths.

---

## 9. Fact-check and approval ledger — required before publishing

| Claim / asset | Evidence needed | Publication rule |
|---|---|---|
| ATC legal entity / company name | Approved incorporation and trading name | Match registered identity; do not merge registrations. |
| “Three Core Divisions” | Management approval of the advertised service model | Accept as branding only if these services are actually offered. |
| Pakistan / Saudi Arabia / Bahrain | Contract/project evidence and exact delivering entity in each market | Do not imply three registered ATC offices unless true. |
| Any founding date / years operating | Registration date for named entity | Separate ATC years from senior management experience. |
| Number of completed projects | Signed-off project register with status and entity | Exclude bids, LOIs, proposed, disputed or uncompleted work from “delivered”. |
| 200M SAR turnover or similar | Entity-specific audited figures, year, publishing approval | Remove until independently supported; don't imply group turnover belongs to ATC. |
| Rising Sun Construction legal name and C1/E | Current PEC certificate and executed project/JV documentation | Attribute solely to certificate holder; verify validity and limitations. |
| Clients and logos | Contractual relationship and brand/logo permission | State direct client vs main contractor vs end developer correctly. |
| Bahrain portfolio (Lucky 9/DSAC) | Chain of attribution and rights to use photos | Do not rebrand another legal entity's portfolio as ATC direct delivery. |
| ROSHN Sedra and AWT Investment photos | Job/contract role, ownership/permission and accurate captions | Publish as ATC work only if attributable and permission is secured. |
| Team photographs / leadership | Approved names, roles, consent, current status | No invented executive bios or generic photos presented as real staff. |
| QA/QC / HSE claims | Approved procedures and project evidence | Avoid “certified”, “ISO-compliant”, or procedure claims without documentation. |
| Contact number / email / office | Company-approved current contact directory | No dummy phone or unverified office location. |

**Important distinction:** An association with a recognizable developer or end client **does not necessarily imply a direct contract**. Display developer, employer, main contractor, subcontractor and ATC/group relationship in separate fields where relevant.

---

## 10. Implementation sequence for the developer

### Phase A — Release blockers (P0)

- [ ] Reproduce and fix narrow-screen hero/stat/graphic clipping.
- [ ] Replace the legacy About hero with the approved new About copy in §5.1.
- [ ] Remove/replace unsupported figures and badges.
- [ ] Replace 9 divisions / dual-jurisdiction graphic with the three-pillar model.
- [ ] Correct Core Values accessibility; prefer static visible cards.

### Phase B — Content & credibility (P1)

- [ ] Replace lengthy/decorative organization section with the four-step operating model.
- [ ] Add clearly labeled project experience and **separate** Clients and Projects links.
- [ ] Add partner/JV section only after legal confirmation and approved copy.
- [ ] Distinguish company, leadership and associated-company experience.
- [ ] Standardize `Discuss Your Project`; fix phone/email and footer references.
- [ ] Shorten mission/vision/story to remove repeated claims.

### Phase C — Media, polish and QA (P2)

- [ ] Replace generic visuals with approved real imagery or an honest conceptual graphic.
- [ ] Optimize image crops/size and accessible labels.
- [ ] Verify mobile navigation, focus states, alt text, semantics, reduced motion and metadata.
- [ ] Complete stakeholder review and document approval of public factual statements.

**Likely code areas** (verify actual repo organization before editing):

- `about.html`: section structure, copy, links, semantics, visual/metrics markup.
- `css/pages/about.css`: responsive hero, grid, cards, diagram, mobile stacking.
- Shared CSS: navigation and button consistency, global text/overflow rules.
- `js/main.js`: disclosure logic only if interaction is retained; CTA behavior if controlled by JS.
- `index.html`, Services and Projects: check shared nomenclature, country wording, CTA, and division names rather than making unnecessary redesigns.

---

## 11. Test matrix — concrete pass/fail criteria

| Test | Viewport / method | Pass condition |
|---|---|---|
| Hero fit | 360×800, 390×844 | All text/buttons/diagram visible; no clipping or horizontal scroll required. |
| Tablet fit | 768×1024 | Column stacking and text sizes remain readable; no collisions. |
| Desktop fit | 1024×768, 1440×900/1000 | Balanced hero columns, stable card paddings, no oversized organization graphic. |
| Content hierarchy | Visual + heading outline | One H1; properly nested headings; distinct three business pillars. |
| Core Values | Mouse, touch, Tab, Enter, Space | Content consistently visible or semantic disclosure state accurate. |
| Keyboard navigation | Keyboard only | All actions reachable; focus indicator visible; no keyboard trap. |
| Reduced motion | OS emulation | Content not hidden or inaccessible when animations are reduced. |
| Real project claims | Content review | Every project has correct legal delivering party and accurate status. |
| JV credentials | Legal/management review | No C1/E or other certificate credited to ATC without ownership. |
| CTAs | Click every action | `Discuss Your Project`, `Explore Our Projects`, profile download all work. |
| Contact | Click `tel:` / `mailto:` | Valid current details; no placeholder values. |
| Visual assets | Desktop + mobile | Correct crop, no stretching, permission/attribution confirmed. |
| Sitewide consistency | Home, About, Services, Projects, footer | Identical division names and consistent corporate proposition. |

**Helpful browser-console diagnostic** (run in real browser DevTools; this is a test snippet, not website code):

```js
[...document.querySelectorAll('body *')]
  .map(el => ({ el, rect: el.getBoundingClientRect() }))
  .filter(({ rect }) => rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1))
  .map(({ el, rect }) => ({
    element: el.tagName.toLowerCase(),
    className: typeof el.className === 'string' ? el.className : '',
    left: Math.round(rect.left),
    right: Math.round(rect.right)
  }));
```

Note: decorative off-screen elements, intentional transitions and fixed positioning can appear in this diagnostic; inspect suspicious nodes rather than treating the list as an automatic failure.

---

## 12. Final design/editorial handoff

**Keep:** Industrial dark theme, orange accent, professional typography, technical personality, clean navigation.  
**Replace:** Country-centric hero diagram, nine-division claim, dubious metrics, repeated generic marketing copy, oversized organization chart.  
**Introduce:** Three-pillar identity, concise operating model, clear attribution of experience, factual partnership information, real project evidence and consistent CTA.  
**Do not add:** Fabricated performance figures, invented legal branches, unapproved client logos, inferred project ownership, empty history timelines, certification-like badges or excessive motion effects.

### Primary above-the-fold composition

```text
WHO WE ARE

Three Core Divisions.
One Integrated Partner.

Azaan Trading & Contracting (ATC) integrates engineering and
construction, technical consultancy, and strategic procurement
to support civil, infrastructure, MEP, industrial, and specialized
projects from planning through execution and delivery.

[Discuss Your Project]   [Explore Our Projects]

                             [ATC three-pillar integrated diagram]
```

**Success definition:** A first-time visitor should understand within seconds **what ATC does, how its three divisions fit together, why its track record is credible, and how to make an inquiry**—on both desktop and mobile.

---

## 13. Source, limitations and change control

- **Primary source:** User-supplied audit text, *ATC About Us — UI/UX audit and change brief*, dated 10 October 2026.
- **Audit snapshot referenced by source:** [`3d697761d47444a81c49c5edf899ea396c4b0d09`](https://github.com/Mussab-21/ATC_Construction-site-/commit/3d697761d47444a81c49c5edf899ea396c4b0d09).
- **Relevant repository URLs:** [About HTML](https://github.com/Mussab-21/ATC_Construction-site-/blob/main/about.html), [About CSS](https://github.com/Mussab-21/ATC_Construction-site-/blob/main/css/pages/about.css), [Main JS](https://github.com/Mussab-21/ATC_Construction-site-/blob/main/js/main.js), [Homepage](https://github.com/Mussab-21/ATC_Construction-site-/blob/main/index.html).
- **User-approved branding:** `ENGINEERING · CONSULTANCY · PROCUREMENT`; `Integrated Expertise. Complete Project Solutions.` and the exact homepage subheading recorded in §1.
- **Validation needed:** A fresh browser/DOM pass against the current repo, especially if newer commits exist after the reference audit snapshot; written sign-off on legal, financial, project and partnership claims.
- **Change status:** Editorial/UX specification prepared. **No changes made to GitHub or the running website.**

**Revision:** v2 — aligned to ATC's approved three-division corporate positioning.
