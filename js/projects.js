/* js/projects.js — Hierarchical 3-Level Drill-Down & Editorial Grid */
(function () {
  'use strict';

  let projectsData = [];
  let state = {
    scope: 'all',       // 'all' | 'international' | 'local'
    country: 'all',     // 'all' | 'Saudi Arabia' | 'Pakistan' ...
    sector: 'all'       // 'all' | 'defense' | 'industrial' | 'residential' | 'oilgas'
  };

  /* ── URL Query Sync ─────────────────────────────────────── */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const scopeParam = params.get('scope');
    const countryParam = params.get('country');
    const sectorParam = params.get('sector');

    if (scopeParam && ['all', 'international', 'local'].includes(scopeParam.toLowerCase())) {
      state.scope = scopeParam.toLowerCase();
    }
    if (countryParam) {
      state.country = countryParam;
    }
    if (sectorParam) {
      state.sector = sectorParam.toLowerCase();
    }
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (state.scope !== 'all') params.set('scope', state.scope);
    if (state.country !== 'all') params.set('country', state.country);
    if (state.sector !== 'all') params.set('sector', state.sector);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}#projects-section`
      : `${window.location.pathname}#projects-section`;

    window.history.replaceState(null, '', newUrl);
  }

  /* ── Filter Logic ───────────────────────────────────────── */
  function getFilteredProjects() {
    return projectsData.filter(p => {
      if (state.scope !== 'all' && p.scope !== state.scope) return false;
      if (state.country !== 'all' && p.country.toLowerCase() !== state.country.toLowerCase()) return false;
      if (state.sector !== 'all' && p.sector !== state.sector) return false;
      return true;
    });
  }

  /* ── Render 3-Tier Drilldown Controls ───────────────────── */
  function renderFilters() {
    // 1. Level 1: Scope Pills
    const scopePills = document.getElementById('pills-scope');
    if (scopePills) {
      scopePills.querySelectorAll('.filter-pill').forEach(btn => {
        const val = btn.dataset.val;
        btn.classList.toggle('active', val === state.scope);
      });
    }

    // 2. Level 2: Country Tier (Only if international)
    const tierCountry = document.getElementById('tier-country');
    const pillsCountry = document.getElementById('pills-country');
    if (tierCountry && pillsCountry) {
      if (state.scope === 'international') {
        tierCountry.style.display = 'flex';
        const intlProjects = projectsData.filter(p => p.scope === 'international');
        const countries = Array.from(new Set(intlProjects.map(p => p.country)));

        let html = `<button class="filter-pill ${state.country === 'all' ? 'active' : ''}" data-level="country" data-val="all">All Countries</button>`;
        countries.forEach(c => {
          const count = intlProjects.filter(p => p.country === c).length;
          const isActive = state.country.toLowerCase() === c.toLowerCase();
          html += `<button class="filter-pill ${isActive ? 'active' : ''}" data-level="country" data-val="${c}">${c} <span class="pill-count mono">(${count})</span></button>`;
        });
        pillsCountry.innerHTML = html;
      } else {
        tierCountry.style.display = 'none';
        state.country = 'all'; // reset country if not international
      }
    }

    // 3. Level 3: Sector Tier (Scoped to available projects in current scope & country)
    const tierSector = document.getElementById('tier-sector');
    const pillsSector = document.getElementById('pills-sector');
    if (tierSector && pillsSector) {
      // Find candidate pool for sectors
      const scopePool = projectsData.filter(p => {
        if (state.scope !== 'all' && p.scope !== state.scope) return false;
        if (state.country !== 'all' && p.country.toLowerCase() !== state.country.toLowerCase()) return false;
        return true;
      });

      const sectorMap = {
        'defense': 'Defense',
        'industrial': 'Industrial / Power',
        'residential': 'Residential',
        'oilgas': 'Oil & Gas'
      };

      let html = `<button class="filter-pill ${state.sector === 'all' ? 'active' : ''}" data-level="sector" data-val="all">All Sectors <span class="pill-count mono">(${scopePool.length})</span></button>`;

      Object.keys(sectorMap).forEach(secKey => {
        const count = scopePool.filter(p => p.sector === secKey).length;
        if (count > 0) {
          const isActive = state.sector === secKey;
          html += `<button class="filter-pill ${isActive ? 'active' : ''}" data-level="sector" data-val="${secKey}">${sectorMap[secKey]} <span class="pill-count mono">(${count})</span></button>`;
        }
      });

      pillsSector.innerHTML = html;
    }

    // 4. Update Breadcrumbs & Count
    renderBreadcrumb();
  }

  /* ── Breadcrumb Navigation ──────────────────────────────── */
  function renderBreadcrumb() {
    const bcContainer = document.getElementById('projects-breadcrumb');
    const countEl = document.getElementById('projects-count');
    const filtered = getFilteredProjects();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} Reference${filtered.length === 1 ? '' : 's'}`;
    }

    if (!bcContainer) return;

    let items = [
      `<span class="breadcrumb__item"><a href="#projects-section" data-bc-jump="root">Portfolio</a></span>`
    ];

    if (state.scope !== 'all') {
      const scopeLabel = state.scope === 'international' ? 'International' : 'Pakistan';
      if (state.country === 'all' && state.sector === 'all') {
        items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item current">${scopeLabel}</span>`);
      } else {
        items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item"><a href="#projects-section" data-bc-jump="scope">${scopeLabel}</a></span>`);
      }
    }

    if (state.country !== 'all' && state.scope === 'international') {
      if (state.sector === 'all') {
        items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item current">${state.country}</span>`);
      } else {
        items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item"><a href="#projects-section" data-bc-jump="country">${state.country}</a></span>`);
      }
    }

    if (state.sector !== 'all') {
      const sectorLabels = {
        'defense': 'Defense',
        'industrial': 'Industrial / Power',
        'residential': 'Residential',
        'oilgas': 'Oil & Gas'
      };
      items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item current">${sectorLabels[state.sector] || state.sector}</span>`);
    }

    if (state.scope === 'all' && state.country === 'all' && state.sector === 'all') {
      items.push(`<span class="breadcrumb__sep">›</span><span class="breadcrumb__item current">All References</span>`);
    }

    bcContainer.innerHTML = items.join('');
  }

  /* ── Render Editorial Grid & Spotlight Card ─────────────── */
  function renderGrid() {
    const spotlightSlot = document.getElementById('spotlight-slot');
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const filtered = getFilteredProjects();

    if (filtered.length === 0) {
      if (spotlightSlot) spotlightSlot.innerHTML = '';
      grid.innerHTML = `
        <div class="projects-empty fade-up is-visible">
          <div class="projects-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3>No matching projects found</h3>
          <p>We do not have indexed public references for this specific combination. Reset filters or consult our engineering desk.</p>
          <button class="btn btn--primary btn--sm" id="reset-filters-btn">View All Projects</button>
        </div>`;

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state = { scope: 'all', country: 'all', sector: 'all' };
          syncUrl();
          renderFilters();
          renderGrid();
        });
      }
      return;
    }

    // 1. Featured Spotlight Project Card (Top Project)
    const featuredProject = filtered.find(p => p.featured) || filtered[0];
    const remainingProjects = filtered.filter(p => p.id !== featuredProject.id);

    if (spotlightSlot) {
      const tagClass = `tag--${featuredProject.sector}`;
      const divs = (featuredProject.divisions || []).slice(0, 3).map(d => `<span class="division-pill">${d}</span>`).join('');
      const imageSrc = featuredProject.image || 'assests/images/atc-services-hero-single.jpg';

      spotlightSlot.innerHTML = `
        <article class="spotlight-card fade-up is-visible" data-id="${featuredProject.id}">
          <div class="spotlight-card__media">
            <img src="${imageSrc}" alt="${featuredProject.title}" class="spotlight-card__img" loading="lazy" onerror="this.style.display='none'">
            <div class="spotlight-card__scrim"></div>
            <div class="spotlight-card__media-badge mono">
              <span class="spotlight-pulse"></span> FEATURED REFERENCE
            </div>
            <span class="spotlight-card__ref mono">${featuredProject.ref}</span>
          </div>
          <div class="spotlight-card__body">
            <div class="spotlight-card__top">
              <span class="tag ${tagClass}">${featuredProject.sectorLabel}</span>
              <span class="spotlight-card__country mono">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                ${featuredProject.location}
              </span>
            </div>
            <h3 class="spotlight-card__title">${featuredProject.title}</h3>
            ${featuredProject.client ? `<div class="spotlight-card__client mono">CLIENT · <span>${featuredProject.client}</span></div>` : ''}
            <p class="spotlight-card__desc">${featuredProject.scopeDesc || featuredProject.scope}</p>
            <div class="spotlight-card__footer">
              <div class="division-pills">${divs}</div>
              <button class="btn btn--primary spotlight-card__btn" data-open-modal="${featuredProject.id}" aria-label="Open ${featuredProject.title} project dossier">
                View Dossier <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </article>`;
    }

    // 2. Remaining Editorial Grid Cards
    grid.innerHTML = '';

    remainingProjects.forEach((project, idx) => {
      const card = document.createElement('article');
      // Every 3rd card can take a wider editorial span if on desktop
      const isWide = (idx % 3 === 0 && remainingProjects.length > 2);
      card.className = `project-card ${isWide ? 'project-card--wide' : ''} fade-up is-visible`;
      card.dataset.sector = project.sector;
      card.setAttribute('data-id', project.id);

      const tagClass = `tag--${project.sector}`;
      const divs = (project.divisions || []).slice(0, 2).map(d => `<span class="division-pill">${d}</span>`).join('');
      const imageSrc = project.image || 'assests/images/atc-services-hero-single.jpg';

      card.innerHTML = `
        <div class="project-card__thumb-wrap">
          <img src="${imageSrc}" alt="${project.title}" class="project-card__thumb-img" loading="lazy" onerror="this.parentElement.classList.add('has-fallback')">
          <div class="project-card__thumb-scrim"></div>
          <span class="project-card__ref mono">${project.ref}</span>
          <div class="project-card__thumb-fallback" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(232,93,42,0.8)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
        </div>
        <div class="project-card__body">
          <div class="project-card__meta">
            <span class="tag ${tagClass}">${project.sectorLabel}</span>
            <span class="project-card__location">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              ${project.location}
            </span>
          </div>
          <h3 class="project-card__title">${project.title}</h3>
          <p class="project-card__scope">${project.scopeDesc || project.scope}</p>
          <div class="project-card__footer">
            <div class="division-pills">${divs}</div>
            <button class="btn btn--sm btn--primary" data-open-modal="${project.id}" aria-label="View ${project.title} details">
              View <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>`;

      grid.appendChild(card);
    });
  }

  /* ── Global Event Delegation ────────────────────────────── */
  function initEvents() {
    // 1. Drilldown Pill Clicks
    document.addEventListener('click', e => {
      const pill = e.target.closest('.filter-pill');
      if (pill) {
        const level = pill.dataset.level;
        const val = pill.dataset.val;

        if (level === 'scope') {
          state.scope = val;
          state.country = 'all';
          state.sector = 'all';
        } else if (level === 'country') {
          state.country = val;
          state.sector = 'all';
        } else if (level === 'sector') {
          state.sector = val;
        }

        syncUrl();
        renderFilters();
        renderGrid();
      }

      // 2. Breadcrumb Jumps
      const bc = e.target.closest('[data-bc-jump]');
      if (bc) {
        e.preventDefault();
        const jump = bc.dataset.bcJump;
        if (jump === 'root') {
          state = { scope: 'all', country: 'all', sector: 'all' };
        } else if (jump === 'scope') {
          state.country = 'all';
          state.sector = 'all';
        } else if (jump === 'country') {
          state.sector = 'all';
        }

        syncUrl();
        renderFilters();
        renderGrid();
      }

      // 3. Hero Showcase Deep-Link Cards
      const deepCard = e.target.closest('[data-deep-scope]');
      if (deepCard) {
        state.scope = deepCard.dataset.deepScope || 'all';
        state.country = deepCard.dataset.deepCountry || 'all';
        state.sector = deepCard.dataset.deepSector || 'all';

        syncUrl();
        renderFilters();
        renderGrid();

        // Smooth scroll to portfolio section
        const targetSection = document.getElementById('projects-section');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      // 4. Modal Open
      const modalTrigger = e.target.closest('[data-open-modal]');
      if (modalTrigger) {
        const id = modalTrigger.dataset.openModal;
        const project = projectsData.find(p => p.id === id);
        if (project) openModal(project);
      }
    });
  }

  /* ── Modal Dialog ───────────────────────────────────────── */
  function openModal(project) {
    const overlay = document.getElementById('project-modal');
    if (!overlay) return;

    const tagClass = `tag--${project.sector}`;
    const divs = (project.divisions || []).map(d => `<span class="division-pill">${d}</span>`).join('');
    const imageSrc = project.image || 'assests/images/atc-services-hero-single.jpg';

    overlay.querySelector('.modal__content').innerHTML = `
      <div class="modal__header">
        <div class="modal__meta">
          <span class="tag ${tagClass}">${project.sectorLabel}</span>
          <span class="mono" style="color:var(--c-steel);font-size:0.65rem;margin-left:0.75rem">${project.ref}</span>
        </div>
        <h2 style="margin-top:0.75rem;font-size:var(--text-h3);line-height:1.25">${project.title}</h2>
        <button class="modal__close" id="modal-close" aria-label="Close modal">✕</button>
      </div>
      <div class="modal__body">
        <div class="modal__media-frame" style="height:260px;border-radius:var(--r-sm);margin-bottom:1.5rem;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,0.12);background:#141418">
          <img src="${imageSrc}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover" loading="lazy">
          <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(14,14,18,0.7) 0%, transparent 60%)"></div>
          <span class="mono" style="position:absolute;bottom:0.75rem;right:0.75rem;font-size:0.6rem;color:#fff;background:rgba(0,0,0,0.7);padding:2px 8px;border-radius:2px">${project.location}</span>
        </div>
        ${project.client ? `
        <div style="margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem">
          <span class="mono" style="font-size:0.65rem;color:var(--c-orange);font-weight:700">CLIENT:</span>
          <span style="font-size:var(--text-sm);font-weight:600;color:var(--c-ink)">${project.client}</span>
        </div>` : ''}
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-brass)" stroke-width="2" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span style="font-size:var(--text-sm);color:var(--c-steel)">${project.location}</span>
        </div>
        <h4 style="margin-bottom:0.6rem;font-size:var(--text-sm);letter-spacing:0.06em;text-transform:uppercase;color:var(--c-ink)">Project Scope &amp; Delivery</h4>
        <p style="margin-bottom:1.5rem;font-size:var(--text-sm);line-height:1.6;color:var(--c-steel)">${project.scopeDesc || project.scope}</p>
        <h4 style="margin-bottom:0.6rem;font-size:var(--text-sm);letter-spacing:0.06em;text-transform:uppercase;color:var(--c-ink)">Engineering Divisions Involved</h4>
        <div class="division-pills" style="flex-wrap:wrap;gap:6px">${divs}</div>
        <div style="margin-top:2rem;padding-top:1.5rem;border-top:var(--border-thin);display:flex;justify-content:space-between;align-items:center">
          <a href="contact.html?service=${encodeURIComponent(project.divisions[0] || 'Projects')}" class="btn btn--primary">
            Inquire About Similar Specifications
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    overlay.querySelector('#modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  }

  function closeModal() {
    const overlay = document.getElementById('project-modal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Initialization ─────────────────────────────────────── */
  parseUrlParams();
  initEvents();

  fetch('data/projects.json')
    .then(r => r.json())
    .then(data => {
      projectsData = data;
      renderFilters();
      renderGrid();
    })
    .catch(err => {
      console.error('Failed to load project portfolio:', err);
      const grid = document.getElementById('projects-grid');
      if (grid) grid.innerHTML = '<p class="no-results">Portfolio failed to load. Please refresh.</p>';
    });

})();
