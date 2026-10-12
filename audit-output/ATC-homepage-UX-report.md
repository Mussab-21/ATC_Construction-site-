# ATC homepage UI/UX report
Date: 10 October 2026
URL: http://localhost:8000/index.html
Scope: homepage only. Inspected in headless Microsoft Edge at 1440 x 1000 and 390 x 844, with screenshots, DOM inspection and local source review. No website implementation changes were made. Ratings are qualitative design judgments, not user-testing results.

## Overall assessment
The industrial orange, charcoal palette, technical typography and blueprint animation establish a recognizable engineering identity. The homepage needs stronger evidence and clearer prioritization to help a construction buyer decide whether ATC is suitable for a project. Its first experience is a service-selection popup; project evidence appears after several long service sections.

Intended audience: project owners, developers, procurement teams and consultants. Primary journey: understand capabilities -> verify relevant experience and delivery role -> discuss a project.

## Scorecard
| Area | Assessment |
|---|---|
| Brand and visual identity | Strong foundation; retain palette and typography |
| Message clarity | Needs improvement; headline is aspirational rather than specific |
| Construction credibility | Needs improvement; clarify project imagery, roles and JV |
| Navigation and discovery | Simple main navigation, but intrusive entry and multiple carousels |
| Mobile | Main layout fits 390px; opening popup adds considerable scrolling |
| Accessibility | Confirmed keyboard-focus issue; contrast and motion need follow-up |
| Inquiry readiness | Visible CTAs, but placeholder phone and inconsistent action hierarchy |

## Prioritized findings
| Priority | Observed issue / principle | Recommended fix | Effort |
|---|---|---|---|
| Major | Entry popup obscures company introduction and asks visitors to classify their needs immediately. User control/minimalism. | Replace automatic popup with three inline service links below the hero. | Small |
| Major | With popup open, first Tab focuses the obscured ATC navigation logo. Keyboard focus is not placed inside the dialog. | Prefer removing auto-open; if retained, move focus inside, contain focus, make background inert and restore focus on close. | Small–medium |
| Major | At desktop size the page is roughly 6,563px tall; projects begin after roughly 4,683px of preceding sections. Evidence is late in the journey. | Move selected projects directly after a concise introduction/JV strip, before detailed services. | Medium |
| Major | Residential ROSHAN Villas slide shows a large commercial-looking interior; image does not clearly substantiate the villa project. Match with real world/credibility. | Use approved photographs of the actual project. Label illustrative renders explicitly. Include year, status and ATC delivery role. | Medium, assets dependent |
| Major | Rising Sun Construction JV is absent from homepage. | Add a named JV panel and attribute C1 registration specifically to Rising Sun Construction. | Small, copy dependent |
| Major | Footer phone is +92 51 000 0000 and contact values are plain text. | Replace with working details and add telephone/email links. | Small |
| Moderate | Service offerings are distributed across construction, consultancy and trading carousels with repetitive orange cards. Recognition/comparison. | Use a static six-service grid and compact secondary trading/consultancy links. Reduce repeated descriptions. | Medium |
| Moderate | Main hero headline takes five lines on desktop and four on mobile, without immediately describing the delivery offer. | Use a shorter service-led headline and one sentence identifying sectors and geography. | Small |
| Moderate | Project detail CTA says View All Projects; it loses the context of the currently selected project. | Add a project-specific case-study link, with a separate portfolio link. | Medium |
| Moderate | White text over bright orange and pale gray small text merit contrast measurement; tiny technical labels are difficult to read. | Darken orange behind white copy or use dark text. Keep essential copy at comfortable body sizes; reserve tiny monospace text for decoration. | Small |
| Minor | ATC lettering inside circular logo becomes invisible on the white scrolled header, while adjacent wordmark remains visible. | Adapt SVG text color to the header theme. | Small |
| Minor | Client/partner marquee groups multiple types of relationship under one title. | Label verified relationships clearly; keep the JV separate from client references. | Small |

## Homepage structure proposed
1. Header: ATC logo, About, Services, Projects, Discuss Your Project.
2. Hero: concise construction offer, relevant real project image/video, primary inquiry CTA and secondary View Projects.
3. JV panel: ATC + Rising Sun Construction, clear registration attribution and link to details.
4. Three selected project cards: image, location, scope, year/status and actual ATC role.
5. Core construction services in a static grid.
6. Compact consultancy and procurement overview.
7. Verified delivery evidence: project count, operating regions, safety/quality practices and client references with accurate relationship labels.
8. Closing inquiry panel: project type, location and scope invitation, working contact methods.
9. Footer: full company identity and usable contact details.

## Suggested copy
Hero: Engineering & Construction for Complex Projects
Supporting text: ATC provides civil construction, MEP, finishing and infrastructure services across Pakistan and Saudi Arabia. Confirm that geography describes ATC's actual delivery arrangements before publication.
Primary CTA: Discuss Your Project
Secondary CTA: View Projects
JV heading: Joint Venture with Rising Sun Construction
JV text: Azaan Trading & Contracting (ATC) has entered into a joint venture with Rising Sun Construction, a C1-registered construction company.
C1 belongs to Rising Sun Construction, as confirmed by the user. Do not place an unexplained C1 badge beside ATC's logo. Ongoing versus project-specific scope remains unconfirmed; describe that scope once established.

## Five quick wins
1. Remove automatic service-selection popup.
2. Add the correctly attributed Rising Sun Construction JV statement.
3. Move project evidence above detailed service listings.
4. Replace placeholder phone and make contact methods clickable.
5. Fix the scrolled logo color and shorten the hero headline.

## Verification notes
Local server returned HTTP 200 and was already running. No uncaught page JavaScript errors were captured. At 390px the document width was 390px, with no page-wide horizontal overflow in that check. Statistics animated to 6+, 50+, 2 and 15+ when scrolled into view; these are website claims, not independently verified business facts. The five project-image URLs and Herfy logo URL returned HTTP 200. Earlier unloaded-image states were not treated as broken links because lazy loading was involved. Full accessibility conformance, real-device behavior, performance benchmarking and other pages are outside this report.

Evidence screenshots: desktop-entry.png, desktop-hero.png, engineering-divisions.png, featured.png, clients.png, footer.png, mobile-entry.png, mobile-hero.png and mobile-stats.png in this folder.
