/* js/projects.js — ATC Projects Portfolio & Integrated Photo Gallery */
(function () {
  'use strict';

  let projectsData = [];
  let allGalleryPhotos = []; // Extracted from projects
  let curatedGalleryPhotos = [];
  let visibleGalleryCount = 24;
  let lightboxPhotos = [];
  let activeGalleryIndex = 0;
  let lastActiveTrigger = null;

  const state = {
    country: 'all',    // 'all' | 'Pakistan' | 'Saudi Arabia' | 'Bahrain'
    sector: 'all',     // 'all' | 'commercial' | 'residential' | 'infrastructure'
    search: ''
  };

  /* ── Safe Escaping Utility (XSS Prevention) ───────────────── */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ── URL Sync ─────────────────────────────────────────────── */
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const countryParam = params.get('country');
    const sectorParam = params.get('sector');
    const searchParam = params.get('q');

    const validCountries = ['all', 'pakistan', 'saudi arabia', 'bahrain'];
    if (countryParam && validCountries.includes(countryParam.toLowerCase())) {
      state.country = countryParam === 'all' ? 'all' : (countryParam.charAt(0).toUpperCase() + countryParam.slice(1));
      if (countryParam.toLowerCase() === 'saudi arabia') state.country = 'Saudi Arabia';
    }

    const validSectors = ['all', 'commercial', 'residential', 'infrastructure'];
    if (sectorParam && validSectors.includes(sectorParam.toLowerCase())) {
      state.sector = sectorParam.toLowerCase();
    }

    if (searchParam) {
      state.search = searchParam.trim();
    }
  }

  function syncUrl() {
    const params = new URLSearchParams();
    if (state.country !== 'all') params.set('country', state.country);
    if (state.sector !== 'all') params.set('sector', state.sector);
    if (state.search) params.set('q', state.search);

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }

  /* ── Filter Logic ─────────────────────────────────────────── */
  function getFilteredProjects() {
    return projectsData.filter(p => {
      // Country match
      if (state.country !== 'all' && p.country.toLowerCase() !== state.country.toLowerCase()) {
        return false;
      }
      // Sector match
      if (state.sector !== 'all' && p.sector.toLowerCase() !== state.sector.toLowerCase()) {
        return false;
      }
      // Search match (title, client, location, scope)
      if (state.search) {
        const q = state.search.toLowerCase();
        const searchable = `${p.title} ${p.client || ''} ${p.location || ''} ${p.scopeDesc || ''} ${p.ref || ''}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }

  /* ── Render Controls ──────────────────────────────────────── */
  function renderFilters() {
    // 1. Country Pills
    const countryContainer = document.getElementById('country-pills');
    if (countryContainer) {
      countryContainer.querySelectorAll('.filter-pill').forEach(btn => {
        const val = btn.dataset.val;
        const isActive = val.toLowerCase() === state.country.toLowerCase();
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    // 2. Sector Pills
    const sectorContainer = document.getElementById('sector-pills');
    if (sectorContainer) {
      sectorContainer.querySelectorAll('.filter-pill').forEach(btn => {
        const val = btn.dataset.val;
        const isActive = val.toLowerCase() === state.sector.toLowerCase();
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    // 3. Search Input & Clear button
    const searchInput = document.getElementById('project-search');
    if (searchInput && searchInput.value !== state.search) {
      searchInput.value = state.search;
    }
    const clearBtn = document.getElementById('clear-filters-btn');
    if (clearBtn) {
      const isFiltered = state.country !== 'all' || state.sector !== 'all' || state.search !== '';
      clearBtn.style.display = isFiltered ? 'inline-flex' : 'none';
    }


  }

  /* ── Render Projects Grid ─────────────────────────────────── */
  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const countEl = document.getElementById('projects-count');
    if (!grid) return;

    const filtered = getFilteredProjects();

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} Project${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="projects-empty fade-up is-visible">
          <div class="projects-empty__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3>No matching projects found</h3>
          <p>We do not have public references matching your current filter criteria. Reset your search or consult our engineering desk.</p>
          <button type="button" class="btn btn--primary btn--sm" id="empty-reset-btn">Reset All Filters</button>
        </div>`;

      const emptyReset = document.getElementById('empty-reset-btn');
      if (emptyReset) {
        emptyReset.addEventListener('click', () => {
          state.country = 'all';
          state.sector = 'all';
          state.search = '';
          syncUrl();
          renderFilters();
          renderProjects();
        });
      }
      return;
    }

    grid.innerHTML = '';

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card fade-up is-visible';
      card.dataset.id = p.id;

      const sectorClass = `tag--${p.sector}`;
      const divisionsList = (p.divisions || []).slice(0, 2).map(d => `<span class="division-pill">${escapeHtml(d)}</span>`).join('');
      const photoCount = (p.photos && p.photos.length) || 0;

      card.innerHTML = `
        <div class="project-card__thumb-wrap">
          ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="project-card__thumb-img" loading="lazy" onerror="this.closest('.project-card__thumb-wrap').classList.add('has-fallback')">` : `<div class="project-card__thumb-fallback" style="display:flex"><div class="thumb-fallback-content"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span class="mono">Site Photography in Review</span></div></div>`}
          <div class="project-card__thumb-scrim" aria-hidden="true"></div>
          <span class="project-card__ref mono">${escapeHtml(p.ref)}</span>
          <span class="project-card__loc-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${escapeHtml(p.location)}
          </span>
        </div>
        <div class="project-card__body">
          <div class="project-card__meta">
            <span class="tag ${sectorClass}">${escapeHtml(p.sectorLabel)}</span>
            ${p.status ? `<span class="project-status mono ${p.status.toLowerCase().includes('under') ? 'status--active' : 'status--completed'}">${escapeHtml(p.status)}</span>` : ''}
          </div>
          <h3 class="project-card__title">
            <a href="#${escapeHtml(p.id)}" class="project-card__link" data-open-project="${escapeHtml(p.id)}">${escapeHtml(p.title)}</a>
          </h3>
          <div class="project-card__role mono">
            <span>CLIENT · <strong>${escapeHtml(p.client)}</strong></span>
            ${p.role ? `<span class="project-card__role-bullet">|</span><span>${escapeHtml(p.role)}</span>` : ''}
          </div>
          <p class="project-card__scope">${escapeHtml(p.scopeDesc)}</p>
          <div class="project-card__footer">
            <div class="division-pills">${divisionsList}</div>
            <div class="project-card__actions">
              ${photoCount > 0 ? `
                <button type="button" class="btn btn--outline btn--sm project-card__photos-btn" data-open-project-photos="${escapeHtml(p.id)}" aria-label="View ${photoCount} photos for ${escapeHtml(p.title)}">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  ${photoCount}
                </button>` : ''}
              <button type="button" class="btn btn--primary btn--sm" data-open-project="${escapeHtml(p.id)}" aria-label="View details for ${escapeHtml(p.title)}">
                View Project <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>`;

      grid.appendChild(card);
    });
  }

  /* ── Render Photo Gallery Grid ────────────────────────────── */
  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const shown = curatedGalleryPhotos.slice(0, visibleGalleryCount);
    grid.innerHTML = shown.map((photo, index) => `
      <div class="gallery-card">
        <button type="button" class="gallery-card__btn" data-curated-index="${index}" aria-label="View photo ${index + 1}: ${escapeHtml(photo.caption)}">
          <img src="${escapeHtml(photo.thumbnail)}" alt="${escapeHtml(photo.caption)}" class="gallery-card__img" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
          <span class="gallery-card__overlay" aria-hidden="true"><span class="gallery-card__zoom-icon">＋</span></span>
        </button>
      </div>`).join('');
    const count = document.getElementById('gallery-count');
    if (count) count.textContent = `${shown.length} of ${curatedGalleryPhotos.length} photographs`;
    const more = document.getElementById('gallery-load-more');
    if (more) more.hidden = shown.length >= curatedGalleryPhotos.length;
  }

  /* ── Accessible Modal Focus Trap Helper ───────────────────── */
  function trapFocus(modalEl) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(modalEl.querySelectorAll(focusableSelectors))
      .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    function handleTab(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    modalEl._focusHandler = handleTab;
    modalEl.addEventListener('keydown', handleTab);
  }

  function releaseFocusTrap(modalEl) {
    if (modalEl._focusHandler) {
      modalEl.removeEventListener('keydown', modalEl._focusHandler);
      delete modalEl._focusHandler;
    }
  }

  /* ── Project Details Modal ────────────────────────────────── */
  function openProjectModal(project) {
    const overlay = document.getElementById('project-modal');
    const mainContent = document.getElementById('main-content');
    if (!overlay) return;

    lastActiveTrigger = document.activeElement;

    const sectorClass = `tag--${project.sector}`;
    const divisionsHtml = (project.divisions || []).map(d => `<span class="division-pill">${escapeHtml(d)}</span>`).join('');
    
    // Project photos thumbnail strip
    let photosHtml = '';
    if (project.photos && project.photos.length > 0) {
      photosHtml = `
        <div class="modal__photos-section">
          <h4 class="modal__section-heading mono">PROJECT PHOTOGRAPHY &amp; EVIDENCE (${project.photos.length})</h4>
          <div class="modal__photos-grid">
            ${project.photos.map(ph => {
              const globalMatch = allGalleryPhotos.find(gp => gp.src === ph.src);
              const idx = globalMatch ? globalMatch.globalIndex : 0;
              return `
                <button type="button" class="modal__photo-thumb" data-lightbox-index="${idx}" aria-label="Enlarge: ${escapeHtml(ph.caption)}">
                  <img src="${escapeHtml(ph.src)}" alt="${escapeHtml(ph.caption)}" loading="lazy">
                  <span class="modal__photo-caption mono">${escapeHtml(ph.caption)}</span>
                </button>`;
            }).join('')}
          </div>
        </div>`;
    }

    const metaContainer = document.getElementById('modal-project-meta');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <span class="tag ${sectorClass}">${escapeHtml(project.sectorLabel)}</span>
        <span class="modal__ref mono">${escapeHtml(project.ref)}</span>
        <span class="modal__country mono">${escapeHtml(project.country)}</span>
      `;
    }

    const titleContainer = document.getElementById('modal-project-title');
    if (titleContainer) {
      titleContainer.textContent = project.title;
    }

    const bodyContainer = document.getElementById('modal-project-body');
    if (bodyContainer) {
      bodyContainer.innerHTML = `
        ${project.image ? `
        <div class="modal__hero-frame">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="modal__hero-img">
          <div class="modal__hero-overlay" aria-hidden="true"></div>
          <span class="modal__hero-loc mono">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${escapeHtml(project.location)}
          </span>
        </div>` : `
        <div class="modal__hero-frame has-fallback">
          <div class="modal__hero-fallback">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="mono">Site Photography in Archival Review</span>
          </div>
          <span class="modal__hero-loc mono">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
            ${escapeHtml(project.location)}
          </span>
        </div>`}

        <div class="modal__specs-grid">
          <div class="modal__spec-item">
            <span class="modal__spec-label mono">CLIENT / PARTNER</span>
            <span class="modal__spec-val">${escapeHtml(project.client)}</span>
          </div>
          <div class="modal__spec-item">
            <span class="modal__spec-label mono">ATC CONTRACT ROLE</span>
            <span class="modal__spec-val">${escapeHtml(project.role || 'Contractor')}</span>
          </div>
          <div class="modal__spec-item">
            <span class="modal__spec-label mono">PROJECT STATUS</span>
            <span class="modal__spec-val">${escapeHtml(project.status || 'Verified Reference')}</span>
          </div>
          <div class="modal__spec-item">
            <span class="modal__spec-label mono">LOCATION</span>
            <span class="modal__spec-val">${escapeHtml(project.location)}</span>
          </div>
        </div>

        <div class="modal__scope-box">
          <h4 class="modal__section-heading mono">APPROVED SCOPE &amp; DELIVERY RESPONSIBILITY</h4>
          <p id="modal-project-desc" class="modal__scope-desc">${escapeHtml(project.scopeDesc)}</p>
        </div>

        <div class="modal__divisions-box">
          <h4 class="modal__section-heading mono">INVOLVED ENGINEERING DISCIPLINES</h4>
          <div class="division-pills">${divisionsHtml}</div>
        </div>

        ${photosHtml}

        <div class="modal__footer-action">
          <a href="contact.html?service=${encodeURIComponent(project.divisions[0] || 'Engineering')}&project=${encodeURIComponent(project.title)}" class="btn btn--primary">
            Discuss a Similar Project
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>`;
    }

    overlay.removeAttribute('hidden');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.setAttribute('inert', '');

    // Set URL hash for deep-linking
    window.location.hash = project.id;

    trapFocus(overlay);
  }

  function closeProjectModal() {
    const overlay = document.getElementById('project-modal');
    const mainContent = document.getElementById('main-content');
    if (!overlay || overlay.hasAttribute('hidden')) return;

    releaseFocusTrap(overlay);
    overlay.classList.remove('open');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (mainContent) mainContent.removeAttribute('inert');

    // Remove hash without scroll jump
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (lastActiveTrigger) {
      lastActiveTrigger.focus();
      lastActiveTrigger = null;
    }
  }

  /* ── Gallery Lightbox Viewer ──────────────────────────────── */
  function openLightbox(index, photos = allGalleryPhotos) {
    lightboxPhotos = photos;
    if (lightboxPhotos.length === 0) return;
    activeGalleryIndex = Math.max(0, Math.min(index, lightboxPhotos.length - 1));

    const overlay = document.getElementById('lightbox-modal');
    const mainContent = document.getElementById('main-content');
    if (!overlay) return;

    lastActiveTrigger = document.activeElement;

    updateLightboxContent();

    overlay.removeAttribute('hidden');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.setAttribute('inert', '');

    trapFocus(overlay);
  }

  function updateLightboxContent() {
    const photo = lightboxPhotos[activeGalleryIndex];
    if (!photo) return;

    const img = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const projectEl = document.getElementById('lightbox-project');
    const counterEl = document.getElementById('lightbox-counter');
    const viewProjectBtn = document.getElementById('lightbox-view-project');

    if (img) {
      img.src = photo.src;
      img.alt = photo.caption;
    }
    if (captionEl) captionEl.textContent = photo.caption;
    if (projectEl) projectEl.textContent = photo.sourceLabel || photo.projectTitle || 'Project gallery';
    if (counterEl) counterEl.textContent = `${activeGalleryIndex + 1} of ${lightboxPhotos.length}`;

    if (viewProjectBtn) {
      viewProjectBtn.hidden = !photo.projectId;
      viewProjectBtn.onclick = () => {
        closeLightbox();
        const project = projectsData.find(p => p.id === photo.projectId);
        if (project) {
          setTimeout(() => openProjectModal(project), 100);
        }
      };
    }
  }

  function prevLightbox() {
    if (lightboxPhotos.length === 0) return;
    activeGalleryIndex = (activeGalleryIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    updateLightboxContent();
  }

  function nextLightbox() {
    if (lightboxPhotos.length === 0) return;
    activeGalleryIndex = (activeGalleryIndex + 1) % lightboxPhotos.length;
    updateLightboxContent();
  }

  function closeLightbox() {
    const overlay = document.getElementById('lightbox-modal');
    const mainContent = document.getElementById('main-content');
    if (!overlay || overlay.hasAttribute('hidden')) return;

    releaseFocusTrap(overlay);
    overlay.classList.remove('open');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (mainContent) mainContent.removeAttribute('inert');

    if (lastActiveTrigger) {
      lastActiveTrigger.focus();
      lastActiveTrigger = null;
    }
  }

  /* ── Event Listeners ──────────────────────────────────────── */
  function initEvents() {
    // 1. Delegated Filter and Card interactions
    document.addEventListener('click', e => {
      // Country Filter click
      const countryBtn = e.target.closest('[data-filter="country"]');
      if (countryBtn) {
        state.country = countryBtn.dataset.val;
        syncUrl();
        renderFilters();
        renderProjects();
        return;
      }

      // Sector Filter click
      const sectorBtn = e.target.closest('[data-filter="sector"]');
      if (sectorBtn) {
        state.sector = sectorBtn.dataset.val;
        syncUrl();
        renderFilters();
        renderProjects();
        return;
      }

      const curatedTrigger = e.target.closest('[data-curated-index]');
      if (curatedTrigger) {
        openLightbox(Number(curatedTrigger.dataset.curatedIndex), curatedGalleryPhotos);
        return;
      }
      if (e.target.closest('#gallery-load-more')) {
        const firstNewIndex = visibleGalleryCount;
        visibleGalleryCount += 24;
        renderGallery();
        document.querySelector(`[data-curated-index="${firstNewIndex}"]`)?.focus({ preventScroll: true });
        return;
      }

      // Clear Filters button
      if (e.target.closest('#clear-filters-btn')) {
        state.country = 'all';
        state.sector = 'all';
        state.search = '';
        syncUrl();
        renderFilters();
        renderProjects();
        return;
      }

      // Open Project Modal
      const openProj = e.target.closest('[data-open-project]');
      if (openProj) {
        e.preventDefault();
        const id = openProj.dataset.openProject;
        const project = projectsData.find(p => p.id === id);
        if (project) openProjectModal(project);
        return;
      }

      // Open Project Photos directly into Lightbox
      const openPhotosBtn = e.target.closest('[data-open-project-photos]');
      if (openPhotosBtn) {
        e.preventDefault();
        const id = openPhotosBtn.dataset.openProjectPhotos;
        const project = projectsData.find(p => p.id === id);
        if (project && project.photos && project.photos.length > 0) {
          const firstPhoto = project.photos[0];
          const matchIndex = allGalleryPhotos.findIndex(ph => ph.src === firstPhoto.src);
          if (matchIndex !== -1) {
            openLightbox(matchIndex);
          }
        }
        return;
      }

      // Open Lightbox by index
      const lightboxTrigger = e.target.closest('[data-lightbox-index]');
      if (lightboxTrigger) {
        e.preventDefault();
        const idx = parseInt(lightboxTrigger.dataset.lightboxIndex, 10);
        if (!isNaN(idx)) openLightbox(idx);
        return;
      }

      // Modal Close Buttons
      if (e.target.closest('#modal-close')) {
        closeProjectModal();
        return;
      }

      if (e.target.closest('#lightbox-close')) {
        closeLightbox();
        return;
      }

      // Lightbox Prev / Next
      if (e.target.closest('#lightbox-prev')) {
        prevLightbox();
        return;
      }

      if (e.target.closest('#lightbox-next')) {
        nextLightbox();
        return;
      }

      // Click outside modal content closes it
      const projectModal = document.getElementById('project-modal');
      if (e.target === projectModal) {
        closeProjectModal();
        return;
      }

      const lightboxModal = document.getElementById('lightbox-modal');
      if (e.target === lightboxModal) {
        closeLightbox();
        return;
      }
    });

    // 2. Search Input Handling (with debounce)
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          state.search = searchInput.value.trim();
          syncUrl();
          renderFilters();
          renderProjects();
        }, 250);
      });
    }

    // 3. Keyboard Navigation (Escape, ArrowLeft, ArrowRight)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const lightboxModal = document.getElementById('lightbox-modal');
        if (lightboxModal && !lightboxModal.hasAttribute('hidden')) {
          closeLightbox();
          return;
        }
        const projectModal = document.getElementById('project-modal');
        if (projectModal && !projectModal.hasAttribute('hidden')) {
          closeProjectModal();
          return;
        }
      }

      const lightboxModal = document.getElementById('lightbox-modal');
      if (lightboxModal && !lightboxModal.hasAttribute('hidden')) {
        if (e.key === 'ArrowLeft') prevLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
      }
    });

    // 4. Hashchange Listener (Supports Browser Back & direct deep-linking)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        closeProjectModal();
        return;
      }
      const project = projectsData.find(p => p.id === hash);
      if (project) {
        openProjectModal(project);
      }
    });
  }

  /* ── Initialization ───────────────────────────────────────── */
  parseUrlParams();
  initEvents();

  fetch('data/gallery.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(photos => {
      curatedGalleryPhotos = photos;
      renderGallery();
    })
    .catch(() => {
      document.getElementById('gallery-grid').innerHTML = '<p>Unable to load photographs. Please refresh the page to try again.</p>';
      document.getElementById('gallery-load-more').hidden = true;
    });

  fetch('data/projects.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      projectsData = data;

      // Flatten gallery photos
      let gIndex = 0;
      allGalleryPhotos = [];
      projectsData.forEach(p => {
        if (p.photos && p.photos.length > 0) {
          p.photos.forEach(ph => {
            allGalleryPhotos.push({
              globalIndex: gIndex++,
              src: ph.src,
              caption: ph.caption,
              category: ph.category,
              type: ph.type || 'Site Photograph',
              projectId: p.id,
              projectTitle: p.title
            });
          });
        }
      });

      renderFilters();
      renderProjects();
      // Check initial hash deep-link
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const matchingProject = projectsData.find(p => p.id === hash);
        if (matchingProject) {
          openProjectModal(matchingProject);
        }
      }
    })
    .catch(err => {
      console.error('Failed to load projects data:', err);
      const grid = document.getElementById('projects-grid');
      if (grid) {
        grid.innerHTML = '<p class="projects-empty">Unable to load project portfolio. Please check network connection and refresh.</p>';
      }
    });

})();
