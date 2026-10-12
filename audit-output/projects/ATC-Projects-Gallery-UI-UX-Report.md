# ATC Projects & Gallery — audit and implementation brief

Date: 11 October 2026  
Page reviewed: http://localhost:8000/projects.html  
Scope: current Projects page, its relationship to the homepage catalogue, and a proposed integrated gallery.

## Recommendation

Build this page around **a professional project catalogue followed by a project-linked photo gallery**. Visitors should be able to compare relevant work, understand ATC's actual contribution, inspect supporting photographs and discuss a similar project.

Keep the orange/charcoal identity and typography. Replace the duplicated showcase, oversized technical diagram and inconsistent card hierarchy with a shorter introduction, consistent project cards and clear project details. The main prerequisite is to reconcile project data: Projects currently uses a different, older catalogue from the homepage.

This deliverable is an audit and implementation brief. Website code was not changed. Existing local edits were preserved.

## Review method

Used the same UI UX Designer audit format as earlier: scorecard, severity/effort findings, proposed structure and quick wins. Reviewed `projects.html`, `css/pages/projects.css`, shared components, `js/projects.js`, `data/projects.json`, and the homepage's `data/clients-projects.js` and renderer.

Rendered in headless Microsoft Edge at 1440 × 1000, 768 × 844, 390 × 844 and 360 × 844. Checked project loading, scope filters, keyboard sector selection, modal focus, Escape, empty-state reset and loaded images. Ratings are qualitative, not user-research results. Claims, contracts and photo provenance were not independently verified.

## Scorecard

| Area | Assessment |
|---|---|
| Brand and visual identity | Good foundation; retain palette, fonts and shared logo. |
| Project accuracy and consistency | Major correction required: two competing datasets and conflicting scopes. |
| Professional project presentation | Useful sector/location fields exist; delivery role, status, dates and evidence need clearer treatment. |
| Project discovery | Filters work, but three hierarchy levels are excessive for eight current records. |
| Gallery | Not implemented: each record has only one image and no gallery metadata or image-viewing workflow. |
| Responsive layout | No out-of-viewport main-content bounds detected at the four tested widths. Mobile page is long. |
| Keyboard accessibility | Major defects in dialog focus and filter focus/state. |
| Trust and inquiry | Contextual inquiry exists; project attribution, imagery and unsupported headline metrics need attention. |

## Priority findings

Severity: **P1 major** = repair before publication; **P2 moderate** = address in the next implementation pass. No page outage was observed. Gallery absence is a requested feature gap, not a broken existing feature.

| ID | Priority / effort | Finding and evidence | Impact and recommended change |
|---|---|---|---|
| 1 | P1 / Medium | Projects loads eight records from `data/projects.json`; the homepage dataset contains 16 records, 12 currently non-hidden, across three countries. Bahrain is absent from the Projects results. | Users see different company experience depending on the page. Establish one canonical approved catalogue with shared names, scope, roles, publication flags and images. |
| 2 | P1 / Small–medium | American Military Facilities and NEOM are featured on Projects, while corresponding homepage records explicitly remain hidden pending permission. Crown Gulf is also hidden on the homepage but visible here. | Publication settings are not consistently applied. Carry each record's visibility and approved public identity across the list, featured cards, detail views and gallery. Do not reveal hidden records just to fill a layout. |
| 3 | P1 / Medium, content dependent | AWT is presented as an Askari housing/commercial framework; homepage describes an AWT Investment office fit-out. Herfy is presented as industrial production facilities; homepage describes outlet maintenance/construction. ROSHAN 100-Villa in the hero conflicts with homepage ROSHN's 2,000-villa programme. | These are material scope differences. Resolve them against approved project records, distinguishing programme scale from ATC's contracted package. Do not combine contradictory descriptions. |
| 4 | P1 / Small–medium | Opening a project dialog leaves focus on the background View Dossier button. The next Tab reaches another background View button. `js/projects.js:362–418` does not move/trap/restore focus or make the background inert. | Keyboard users cannot reliably operate the dialog. Use a correctly managed native dialog or equivalent focus handling, a visible close control and focus restoration. Escape already closes the modal; retain that behavior. |
| 5 | P1 / Small | Keyboard activation of a sector filter leaves `document.activeElement` on BODY because `renderFilters()` replaces the controls. Selected pills have no `aria-pressed`. | Users lose their place and cannot determine the selected filter programmatically. Preserve focused controls, expose pressed state and announce a concise result count. See `js/projects.js:56–114,291–313`. |
| 6 | P1 / Medium, assets dependent | ROSHN's hero card uses the same finishing illustration as Services while its listing uses a community image. Herfy's listing uses a drive-through image with production-facility copy. Images have project-name alt text, but no explanatory caption/source. | Photographs cannot be assessed as evidence of the described work. Use images verified against each project and caption what is actually shown. Label renders/illustrations explicitly; do not describe an image as an actual site photo without confirmation. |
| 7 | P1 / Small | URL values are inserted into breadcrumb `innerHTML` without escaping (`js/projects.js:16–27,150–168`); arbitrary country/sector values are accepted. | A crafted URL can be interpreted as markup in a DOM rendering sink. Validate values against the catalogue and render labels with `textContent` or an escaping helper. This is a source-confirmed unsafe pattern; no exploit was executed. |
| 8 | P2 / Medium | Hero repeats four references, then the list promotes another spotlight and uses alternating wide cards. Page height is about 4,252px desktop and 8,540px at 390px. | Repetition delays comparison. Use a concise hero and a uniform grid; reserve one compact featured story only if it adds different information. |
| 9 | P2 / Small–medium | Filters use jurisdiction → country → sector, even though International currently contains only Saudi Arabia. Hero cards filter a sector rather than open the named project; Herfy and NEOM use the same filter combination. | Navigation feels less direct than the project titles imply. Use Country and Sector filters with clear labels; named project cards should open their exact project. |
| 10 | P2 / Medium | Project details repeat a single image and scope paragraph. Records have no year, delivery status, explicit ATC role or gallery array. | Buyers cannot distinguish current/completed work or direct/JV/subcontract experience. Add approved facts and a fuller case-study layout. Omit unknown dates/roles rather than invent them. |
| 11 | P2 / Small, evidence dependent | Hero/metadata mention two countries, metric bar says three; footer CTA says nine specialist divisions. “50+ completed assets” and “100% Defense & ISO Compliance” lack visible definitions or sources. | Mixed taxonomy and unexplained absolute claims reduce credibility. Align countries and service terminology with approved site content; remove or substantiate metrics. A portfolio can show selected references without claiming they total all completed projects. |
| 12 | P2 / Small | Measured filter height is 29px. Small labels use gray/orange tokens on light backgrounds; `#787F87` on white is approximately 4.05:1. | Touch controls would benefit from a 44px comfort target; 29px height alone does not establish a WCAG 2.2 AA target-size failure. Measure text colors/states and raise normal-text contrast to at least 4.5:1. |
| 13 | P2 / Medium | No gallery section, multiple-image data, captions, photo categories or image-viewing controls exist. | The requested gallery needs both a content model and an accessible viewing experience. Implement the gallery specification below using approved project media. |

## Catalogue reconciliation

Treat the newer homepage data as the starting inventory, not as independently verified business evidence. It contains owner TODOs for roles, publication permission and other facts.

| Group | Candidate entries from homepage data | Action for Projects |
|---|---|---|
| Pakistan | AWT Investment; ARY Laguna; FWO road works; FC construction; Private Clients | Reconcile the AWT identity/scope; add the other approved entries with accurate public names. Generic client groups should be labelled selected engagements unless each is a specific project. |
| Saudi Arabia | ROSHN Villas; Herfy Foods | Align scopes, project status and imagery. Preserve “under construction” for ROSHN if still approved; do not imply its entire programme is completed. |
| Bahrain | Al Sanabis 37-storey towers; Reef Island 19-storey hotel; Galali 59 villas; Salmaniya 7-storey building; Saar 31 two-storey villas | Add approved entries and country filtering. Use the public-name fallback “Private Developer” for the Al Sanabis record unless naming permission is resolved. |
| Currently hidden | Crown Gulf; Badoor Al Emar; American Military Facilities; NEOM | Preserve existing restrictions during consolidation. Reconcile narrower homepage scopes before any later publication. |
| Old-only references | Askari Commercial Complex; Oil & Gas Fuel Depot | Resolve their source and approval status before carrying them into the new catalogue. Do not silently merge them into unrelated projects. |

The homepage inventory has **12 non-hidden records**, but six of their referenced image files are absent locally: FWO, FC, Private Clients, Reef Island hotel, Salmaniya building and Saar villas. Existing Projects page images all loaded; these missing assets concern migration candidates, not the current eight rendered cards. Use an honest text-only presentation or “Photos coming soon” state until suitable media exists. Never replace missing evidence with an unrelated project photo.

## Proposed page structure

1. **Compact hero:** “Projects & Gallery.” One sentence describing the portfolio, plus “Browse Projects” and “View Gallery” anchor links. Use one approved project image if available; remove the decorative CAD panel and duplicate four-card strip.
2. **Project catalogue:** search by project/location, Country and Sector filters, result count, and Clear Filters. Add Status only when enough records have confirmed status. Keep all published projects visible initially.
3. **Project details:** each card opens a stable project URL or addressable detail view with scope, role, location, status/year when known, and project photographs.
4. **Project Gallery:** a distinct photographic section with its own heading, compact project/category filters, captions, and accessible large-image viewing.
5. **Closing inquiry:** “Planning a similar project?” with Discuss Your Project and an approved contact route.
6. **Shared footer:** consistent service terminology and clickable contact details.

Suggested introduction: “Explore selected construction, engineering and maintenance projects, with details of our scope and a gallery of project imagery.” Use “site photographs” only when the gallery actually contains verified site photographs.

## Professional project-list specification

- **Grid:** three equal-width columns on large screens, two on tablets, one on phones. Consistent 3:2 image areas, aligned titles/metadata and restrained borders. Avoid arbitrary double-width cards that imply an unsupported ranking.
- **Card content:** approved project name; city/country; sector; one short scope sentence; role and status where confirmed. Action: **View Project**. Add **View Photos · N** only if approved gallery images exist.
- **Filters:** straightforward Country and Sector controls; keep search optional until useful for the published inventory. Derive options and counts from the same catalogue. Do not force users through a jurisdiction hierarchy.
- **Result states:** show “12 projects” or the actual filtered count, preserve filters on return from details, and provide a useful no-results message with Clear Filters. Distinguish load failure from a genuine empty result.
- **Project detail:** hero image, summary, client/public identity, location, sector, ATC role, delivery scope, dates/status, optional verified outcomes, gallery and related service links. Avoid a client field that implies direct appointment where the record describes a contracting partner.
- **Navigation:** stable slugs such as `awt-investment`; a copied project URL should reopen that project. Browser Back returns to the previous results and scroll position. Current `replaceState` preserves filter URLs but does not create a filter-step history or address an individual project.
- **Inquiry:** “Discuss a Similar Project.” Pass a project ID/name and service context to the contact form using a defined contract; do not rely only on the first division in an array.

With roughly a dozen published records, show the complete filtered set rather than adding pagination or infinite scrolling. Introduce Load More only when content volume warrants it.

## Gallery concept and behavior

Use an orderly **three-column photo grid**, two columns on tablets and one or two on phones depending on caption readability. Keep thumbnail ratios consistent; display the complete image in the viewer. This supports comparison and stable reading order better than a decorative collage.

| Element | Specification |
|---|---|
| Initial gallery | Show a curated 9–12 approved images, then a Load More button if additional images exist. Do not duplicate one image to reach the target. |
| Filters | All Photos, then only populated categories such as Completed Work, Construction Progress, Interiors, MEP & Systems and Site Teams. Categories describe photo content and must not assert completion without evidence. Include a project selector when useful. |
| Thumbnail | Real button with descriptive accessible name; project name and short caption visibly beneath it. Show “Illustration” or “Render” where applicable. |
| Viewer | Large image fitted within the viewport, project name, caption, optional capture date, image counter, Previous/Next, Close and View Project actions. |
| Keyboard | Enter/Space opens; focus moves inside; Tab stays within; Left/Right navigate; Escape closes; focus returns to the exact thumbnail. Background is inert while open. |
| Touch | Controls at least 44px for comfortable operation; swipe can supplement visible arrows. Support ordinary browser zoom and avoid autoplay. |
| Navigation boundary | Clearly state whether viewing all filtered gallery images or only one project's images. Preserve the user's filter and scroll position on close. |
| Loading/error | Reserve aspect ratio; show a quiet loading state and an explicit image-load error with Retry/Next. Never count a failed thumbnail as a successfully displayed photograph. |
| Performance | Responsive thumbnail sizes, compressed WebP/AVIF where appropriate, `srcset`/`sizes`, intrinsic dimensions and lazy loading. Fetch full-size images on viewer open; preload only neighboring images. |

Each project detail should also include its own smaller gallery, sourced from the same media records. This prevents the site-wide gallery becoming an unlabelled collection disconnected from the portfolio.

## Required content model

Maintain one project collection and one related media collection. Both homepage selections and Projects should read these records.

| Record | Fields |
|---|---|
| Project | Stable ID/slug, approved public name, client/public-name fallback, relationship, country/city, sector, service IDs, approved scope, ATC role, status, dates, cover media ID, featured flag, publication status. |
| Media | Stable ID, project ID, thumbnail/full-size sources, width/height, alt text, visible caption, content category, optional capture date, photo/render/illustration type, publication approval and sort order. |
| Internal evidence | Source of project facts and image ownership/permission; keep internal notes out of public markup. |

Unknown dates and roles remain null. A hidden project must not appear through gallery filters, search, featured slots or direct detail URLs. A publicly downloadable data file is not a private store: exclude restricted material from the public payload rather than merely hiding cards in JavaScript.

## Five quick wins

1. Reconcile the two catalogues and apply publication flags everywhere.
2. Correct AWT, Herfy and ROSHN descriptions against approved source content.
3. Fix dialog focus and filter focus/selected state.
4. Replace the duplicate hero cards with a short introduction and direct Projects/Gallery links.
5. Standardize cards and add accurate captions; introduce gallery entries only as media is approved.

## What already works

- All eight current records loaded; All/International/Pakistan filters returned 8/5/3 respectively.
- An unknown-sector empty state provides View All Projects; reset restored all eight records.
- All 14 image elements in the current page loaded after scrolling; no uncaught JavaScript errors were captured.
- Escape closes the existing project dialog.
- Main content fitted the tested 360, 390, 768 and 1440px widths. The Services audit's earlier hero clipping was not reproduced on the current Projects page; shared CSS has changed since that audit.
- Semantic article cards, image lazy loading, sector/location metadata and a closing project inquiry already provide a useful foundation.

## Acceptance checks for implementation

- Homepage and Projects share project identities, scopes and visibility rules; hidden records and media are absent from public output.
- Cards represent specific projects or clearly labelled engagement groups; quantities describe ATC's actual scope rather than automatically taking credit for programme totals.
- Every published card opens its matching project; share links and Back behavior work.
- Country/sector filtering preserves keyboard focus, exposes selected state and announces updated counts.
- Project and image dialogs manage focus, keyboard navigation, close/return behavior and background interaction correctly.
- Gallery images have project associations, captions, accurate alt text and verified media types; image errors and zero-photo projects have honest states.
- Desktop/tablet/mobile, 200% text sizing, contrast, reduced motion and comfortable touch targets are verified.
- Layout does not jump when images load; full-resolution gallery media is not fetched in bulk on initial page load.
- Inquiry carries project context and is tested through the actual contact implementation in effect at release time.

## Evidence and limits

Evidence: `audit-output/projects/observations.json`, screenshots at each tested width (`*-hero.png`, `*-list.png`), `mobile-modal.png` and `desktop-modal.png`. The desktop modal screenshot captured its entry transition; no opacity defect is inferred from it. Focus defects were recorded from the active element, independently of screenshots.

Capture script: `projects-audit.cjs` in the project root. This review did not submit inquiries, verify business claims, run a full accessibility/security audit or benchmark real-user performance. Source-derived concerns and proposed gallery features are distinguished from observed browser behavior above.
