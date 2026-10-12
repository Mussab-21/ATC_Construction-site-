# ATC About Us — UI/UX audit and change brief

Date: 10 October 2026
Reviewed GitHub main commit: 3d697761d47444a81c49c5edf899ea396c4b0d09
Repository: https://github.com/Mussab-21/ATC_Construction-site-
Page inspected: http://localhost:8000/about.html

## Scope and method
Reviewed the latest commit file list and current homepage/About HTML, then rendered About Us in Microsoft Edge at 1440 x 1000 and 390 x 844. Local About HTML, homepage HTML, About stylesheet, shared styles and main JavaScript matched GitHub blob hashes after normalizing line endings. This is a focused About Us audit, informed by the homepage changes, not a full audit of every modified file. Business credentials and project claims have not been independently verified. No website code was changed.

## Recommendation
Retain the industrial orange/charcoal identity, typography, clear headings and shared logo. Rework About Us around company identity, verifiable experience, the Rising Sun Construction JV, regional delivery arrangements and accountable people. Fix responsive and interaction defects before adding new effects.

The homepage now introduces three service pillars, eight sectors, Pakistan/Saudi Arabia/Bahrain, the JV credential panel, updated client/project content and an inquiry section. About Us received logo/footer edits but retains its older two-country, nine-division story. It should explain and substantiate the homepage rather than repeat its sales/service catalogue.

## Qualitative scorecard
| Area | Assessment |
|---|---|
| Brand consistency | Good foundation; CTA wording and footer facts lag the homepage |
| Content consistency | Major update needed: countries, sectors/divisions, JV and references |
| Construction credibility | More evidence needed: company history, project role, leadership and registration attribution |
| Desktop layout | Generally clear, but Core Values cards have zero internal padding |
| Mobile layout | Major defect: hero content and metrics are clipped |
| Accessibility | Core Values visible/announced expansion state is inconsistent |
| Inquiry journey | Usable end CTA; add an earlier contextual action and profile access |

## Priority issues
| Severity | Finding and evidence | Change needed | Effort |
|---|---|---|---|
| Major | At 390px, hero content, stats and diagram measure about 562px wide and extend to x=582. Page-level overflow is hidden, so the clipped content is not revealed by a document-width test. | Give grid children min-width:0; constrain media and diagram widths; use minmax(0,1fr) tracks; wrap text. Retest at 360, 390, 768 and desktop widths. | Small–medium |
| Major | About says 2 countries and Pakistan/KSA; homepage now includes Bahrain. Diagram and organization root also say dual jurisdiction. | Update every reference consistently after confirming each location's delivery/office arrangement. Do not invent a Bahrain office. | Small |
| Major | Homepage says 8 specialized sectors; About says 9 specialist/engineering divisions, including Finance/HR/Admin and HSE. | Separate customer-facing sectors from internal support functions. Use eight sectors for capability summaries; label the real internal organization separately if it is needed. | Small–medium |
| Major | About contains no Rising Sun JV explanation. | Add a dedicated partner section near the company introduction. Attribute C1 and PEC credentials to Rising Sun Construction; identify partner's precise legal name from approved documents. | Medium |
| Major | Core Values cards have computed desktop padding of 0px; numbers and headings hug the borders. | Restore 24–32px desktop and 20–24px mobile internal spacing, consistent icon placement and balanced gaps. | Small |
| Major | Core Values descriptions open on CSS focus while aria-expanded remains false; Enter does not update that state. | Prefer four static cards with visible short descriptions. If disclosure is retained, use semantic buttons and synchronize visible state, aria-expanded and keyboard/touch behavior. | Small–medium |
| Major | Hero diagram displays DOSSIER VERIFIED and a 200M SAR turnover annotation without visible supporting context. | Remove unsubstantiated badges/figures, or identify source, entity and period. Confirm whose 15+ years and 50+ projects are represented. | Small, evidence dependent |
| Moderate | Our Story is a capability pitch without a founding date, clear milestones or named leadership. | Add a short factual history and two to four verified milestones. Include named leadership/technical responsibility only with approved information. | Medium, content dependent |
| Moderate | The organization chart occupies about 1,099px on desktop; the whole mobile page is about 8,103px tall. | Replace the large decorative hierarchy with a concise operating model: project leadership, engineering/site delivery, procurement and quality/HSE support. Offer detailed organization separately if useful. | Medium |
| Moderate | Our Story, Mission/Vision, Values and Why ATC repeat similar precision, quality and delivery promises. | Shorten mission/vision; connect each differentiator to a concrete practice or project example. Remove repetition. | Medium |
| Moderate | Story image depicts two-country cooperation and has generic facilities alt text; it does not establish who or what is pictured. | Use an approved team/site image with an accurate caption, or label the visual as illustrative and describe it accurately. | Medium, asset dependent |
| Moderate | Header says Get in Touch, end CTA says Contact Us, homepage says Discuss Your Project. Footer retains +92 51 000 0000. | Standardize primary CTA to Discuss Your Project; replace placeholder details and provide tel/mailto links. Do not copy the homepage's TODO phone placeholder. | Small |
| Minor | Decorative revision codes and dense diagram labels add little to buyer decisions. | Reduce decorative labels and make operational facts readable in normal body text. | Small |

Severity refers to usability and credibility impact, not measured conversion loss. No critical outage was found.

## Proposed About Us structure
1. Company introduction: About Azaan Trading & Contracting; short factual summary; Discuss Your Project and View Company Profile actions.
2. Verified company facts: confirmed history, operating markets and relevant project experience. Distinguish company experience from leadership or JV partner experience.
3. Our story: concise history, real milestones and an approved photograph with a meaningful caption.
4. Rising Sun Construction JV: both identities, Pakistan scope, agreed roles, credential ownership and approved registration details.
5. Where we operate: Pakistan, Saudi Arabia and Bahrain, with accurate descriptions of direct operations, projects or partner arrangements.
6. How we deliver: a concise accountable operating model and named leadership if available.
7. Quality, safety and values: concrete procedures such as inspections, toolbox talks, QA checks and handover documentation; use only confirmed practices.
8. Evidence and next step: a small number of relevant project links, an approved company profile and Discuss Your Project.

Keep the eight-sector catalogue on Services/Home; link to it from About. Use a simple readable map or authentic team image instead of the decorative dual-jurisdiction diagram. The company profile button must point to the approved current file, not whichever PDF is easiest to find.

## Suggested copy
Hero heading: Engineering Expertise. Accountable Project Delivery.
Intro draft: Azaan Trading & Contracting (ATC) brings together engineering, construction, consultancy and procurement capabilities to support projects across Pakistan, Saudi Arabia and Bahrain.
Use the regional wording only after confirming the nature of ATC's activity in each market.

JV heading: Our Joint Venture with Rising Sun Construction
JV draft: ATC has entered into a joint venture with Rising Sun Construction, a C1-registered construction company. The C1 registration is held by Rising Sun Construction.
Add the agreed scope and responsibilities when confirmed. The homepage uses Rising Sun Construction LLP and displays licence 813, category C1/E and a cost limit; those are existing website claims, not independently verified findings of this audit. Confirm the legal name, certificate wording, validity and publication-ready details before repeating them. Do not attribute the partner's founding date or credentials to ATC.

## Five quick wins
1. Fix the mobile hero clipping.
2. Align geography and clarify eight sectors versus internal departments.
3. Add the correctly attributed Rising Sun JV section.
4. Fix Core Values padding and disclosure behavior.
5. Unify CTA wording and replace the placeholder phone.

## Implementation sequence
First fix responsive layout, values interaction and visible factual inconsistencies. Next revise the story/JV/regions content and simplify the organization chart. Finally add approved photography, company profile access and a few relevant project links. Avoid adding new sections without shortening the repeated existing content.

## Acceptance checks
- All hero text, statistics and graphics fit at 360px, 390px, 768px and 1440px; inspect child bounds, not only page scroll width.
- Core Values remain readable without hover; any disclosures work by pointer, Enter and Space, with correct announced state.
- Shared header/footer, primary CTA and regional wording agree with approved site-wide content.
- C1 is explicitly attributed to Rising Sun Construction and JV scope is accurately described.
- Company metrics and leadership/project roles have an identified owner and source.
- Links to projects, contact and the company profile work.
- Inspect contrast, visible focus and reduced-motion behavior before release; this audit is not a full accessibility certification.

## Verification and evidence
All three About page image elements loaded in the browser check. No uncaught page JavaScript errors were observed. Organization-card Enter activation changed aria-expanded to true; the Core Values state defect is separate. Screenshots in this folder: desktop-hero.png, story.png, vision.png, values.png, why.png, structure.png, about-cta.png, mobile-hero-confirmed.png and mobile-structure.png. Some screenshots include entry animations mid-transition; severity findings do not rely on those transient opacity states.

Sources:
- https://github.com/Mussab-21/ATC_Construction-site-/commit/3d697761d47444a81c49c5edf899ea396c4b0d09
- https://github.com/Mussab-21/ATC_Construction-site-/blob/main/index.html
- https://github.com/Mussab-21/ATC_Construction-site-/blob/main/about.html
- https://github.com/Mussab-21/ATC_Construction-site-/blob/main/css/pages/about.css
- https://github.com/Mussab-21/ATC_Construction-site-/blob/main/js/main.js
