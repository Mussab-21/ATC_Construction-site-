/**
 * js/clients-projects.js
 * Dynamic renderer for Section 1 ("Our Clients") and Section 2 ("Our Projects")
 * Single source of truth: data/clients-projects.js
 */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(str) {
    return String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function getSectorSvg(sector) {
    const s = (sector || '').toLowerCase();
    if (s.includes('commercial') || s.includes('interior')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
        </svg>`;
    }
    if (s.includes('residential') || s.includes('villa')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>`;
    }
    if (s.includes('high-rise') || s.includes('tower') || s.includes('building')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>
        </svg>`;
    }
    if (s.includes('hotel') || s.includes('hospitality')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
          <path d="M2 21h20M10 9h4M10 13h4M10 17h4"/>
        </svg>`;
    }
    if (s.includes('infrastructure') || s.includes('road')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M4 19L8 5M16 5l4 14M12 5v14M8 12h8"/>
        </svg>`;
    }
    if (s.includes('power') || s.includes('electrical')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>`;
    }
    if (s.includes('public') || s.includes('government')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="21" x2="21" y2="21"/>
          <line x1="4" y1="10" x2="20" y2="10"/>
          <polygon points="12 3 2 10 22 10"/>
          <line x1="6" y1="10" x2="6" y2="21"/>
          <line x1="10" y1="10" x2="10" y2="21"/>
          <line x1="14" y1="10" x2="14" y2="21"/>
          <line x1="18" y1="10" x2="18" y2="21"/>
        </svg>`;
    }
    if (s.includes('defense')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>`;
    }
    if (s.includes('food') || s.includes('retail')) {
      return `
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>`;
    }
    // Default Private Sector / General
    return `
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E85D2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>`;
  }

  /* ══════════════════════════════════════════════════════════
     SECTION 1: OUR CLIENTS
     ══════════════════════════════════════════════════════════ */
  function renderClientsSection(clients) {
    const mount = document.getElementById('clients-mount');
    if (!mount) return;

    // Filter visible clients
    const visibleClients = clients.filter(c => !c.hidden);
    // Derive country tabs only if there are visible entries
    const countries = Array.from(new Set(visibleClients.map(c => c.country)));

    if (countries.length === 0) {
      mount.innerHTML = '';
      return;
    }

    let activeCountry = countries[0];

    function renderTabs() {
      return `
        <div class="clients-tabs" role="tablist" aria-label="Client regions">
          ${countries.map((country) => {
            const isSelected = country === activeCountry;
            const tabId = `client-tab-${slugify(country)}`;
            const panelId = `client-panel-${slugify(country)}`;
            return `
              <button class="clients-tab-btn ${isSelected ? 'active' : ''}"
                      role="tab"
                      id="${tabId}"
                      aria-controls="${panelId}"
                      aria-selected="${isSelected ? 'true' : 'false'}"
                      tabindex="${isSelected ? '0' : '-1'}"
                      data-country="${escapeHtml(country)}">
                ${escapeHtml(country)}
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    function renderPanels() {
      return `
        <div class="clients-panels">
          ${countries.map((country) => {
            const isSelected = country === activeCountry;
            const panelId = `client-panel-${slugify(country)}`;
            const tabId = `client-tab-${slugify(country)}`;
            const items = visibleClients.filter(c => c.country === country);
            return `
              <div class="clients-tabpanel ${isSelected ? 'active' : ''}"
                   role="tabpanel"
                   id="${panelId}"
                   aria-labelledby="${tabId}"
                   tabindex="0"
                   ${!isSelected ? 'hidden' : ''}>

                <div class="clients-grid">
                  ${items.map(c => {
                    const hasLogo = Boolean(c.logo);
                    return `
                      <div class="client-logo-tile ${hasLogo ? '' : 'is-text-wordmark'}" data-client="${escapeHtml(c.slug)}">
                        <div class="client-logo-tile__content">
                          <span class="client-wordmark">${escapeHtml(c.name)}</span>
                          ${hasLogo ? `
                            <img src="${escapeHtml(c.logo)}" alt="${escapeHtml(c.name)} logo" width="240" height="120" loading="lazy" class="client-logo-img"
                                 onload="this.classList.add('is-loaded'); const wm = this.previousElementSibling; if(wm) wm.style.display='none';"
                                 onerror="this.remove(); this.closest('.client-logo-tile').classList.add('is-text-wordmark');">
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    mount.innerHTML = renderTabs() + renderPanels();

    // Event Delegation & Keyboard navigation
    const tabList = mount.querySelector('.clients-tabs');
    const tabs = Array.from(mount.querySelectorAll('.clients-tab-btn'));
    const panels = Array.from(mount.querySelectorAll('.clients-tabpanel'));

    function selectTab(newCountry, shouldFocus = false) {
      if (newCountry === activeCountry) return;
      activeCountry = newCountry;

      tabs.forEach(tab => {
        const isSelected = tab.dataset.country === activeCountry;
        tab.classList.toggle('active', isSelected);
        tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        tab.setAttribute('tabindex', isSelected ? '0' : '-1');
        if (isSelected && shouldFocus) tab.focus();
      });

      panels.forEach(panel => {
        const isMatch = panel.id === `client-panel-${slugify(activeCountry)}`;
        if (isMatch) {
          panel.removeAttribute('hidden');
          panel.classList.add('fade-in');
          panel.classList.add('active');
        } else {
          panel.setAttribute('hidden', '');
          panel.classList.remove('fade-in');
          panel.classList.remove('active');
        }
      });
    }

    if (tabList) {
      tabList.addEventListener('click', (e) => {
        const btn = e.target.closest('.clients-tab-btn');
        if (btn) selectTab(btn.dataset.country);
      });

      tabList.addEventListener('keydown', (e) => {
        const currentIndex = tabs.findIndex(t => t.dataset.country === activeCountry);
        let nextIndex = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== null) {
          selectTab(tabs[nextIndex].dataset.country, true);
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     SECTION 2: OUR PROJECTS
     ══════════════════════════════════════════════════════════ */
  function renderProjectsSection(projects) {
    const filterMount = document.getElementById('projects-filter-mount');
    const track = document.getElementById('projects-carousel-track');
    const prevBtn = document.getElementById('projects-prev-btn');
    const nextBtn = document.getElementById('projects-next-btn');
    const playpauseBtn = document.getElementById('projects-playpause-btn');
    const counterEl = document.getElementById('projects-counter');
    const dotsEl = document.getElementById('projects-dots');
    const sectionEl = document.getElementById('projects');

    if (!track) return;

    // Filter visible projects
    const visibleProjects = projects.filter(p => !p.hidden);
    const countries = Array.from(new Set(visibleProjects.map(p => p.country)));

    let currentFilter = 'all';
    let currentIndex = 0;
    let autoScrollTimer = null;
    let tempPauseTimer = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isUserManuallyPaused = prefersReducedMotion;
    let isHovered = false;
    let isFocused = false;
    let isTouched = false;
    let isIntersecting = true;

    // 1. Render Filter Chips
    if (filterMount) {
      const filters = [
        { id: 'all', label: 'All' },
        ...countries.map(c => ({ id: c, label: c }))
      ];

      filterMount.innerHTML = `
        <div class="projects-filter-chips" role="tablist" aria-label="Filter projects by jurisdiction">
          ${filters.map(f => `
            <button class="project-filter-chip ${f.id === currentFilter ? 'active' : ''}"
                    role="tab"
                    aria-selected="${f.id === currentFilter ? 'true' : 'false'}"
                    data-filter="${escapeHtml(f.id)}">
              ${escapeHtml(f.label)}
            </button>
          `).join('')}
        </div>
      `;

      filterMount.addEventListener('click', (e) => {
        const btn = e.target.closest('.project-filter-chip');
        if (btn) {
          const filter = btn.dataset.filter;
          if (filter !== currentFilter) {
            currentFilter = filter;
            filterMount.querySelectorAll('.project-filter-chip').forEach(b => {
              const active = b.dataset.filter === currentFilter;
              b.classList.toggle('active', active);
              b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
            renderCards();
            track.scrollTo({ left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            currentIndex = 0;
            updateControls();
            restartAutoScroll();
          }
        }
      });
    }

    // 2. Visible cards count helper
    function getVisibleCount() {
      const w = window.innerWidth;
      if (w >= 1100) return 3;
      if (w >= 700) return 2;
      return 1;
    }

    function getMaxIndex(total) {
      const vis = getVisibleCount();
      return Math.max(0, total - vis);
    }

    // 3. Scroll to specific card
    function scrollToCard(idx, smooth = true) {
      const cards = track.querySelectorAll('.project-card');
      if (!cards.length) return;
      const maxIdx = getMaxIndex(cards.length);
      currentIndex = Math.max(0, Math.min(idx, maxIdx));
      const targetCard = cards[currentIndex];
      if (targetCard) {
        const behavior = (smooth && !prefersReducedMotion) ? 'smooth' : 'auto';
        track.scrollTo({
          left: targetCard.offsetLeft - track.offsetLeft,
          behavior
        });
      }
      updateControls();
    }

    function advanceNext() {
      const cards = track.querySelectorAll('.project-card');
      if (!cards.length) return;
      const maxIdx = getMaxIndex(cards.length);
      if (maxIdx === 0) return;
      const nextIdx = (currentIndex >= maxIdx) ? 0 : currentIndex + 1;
      scrollToCard(nextIdx, true);
    }

    function advancePrev() {
      const cards = track.querySelectorAll('.project-card');
      if (!cards.length) return;
      const maxIdx = getMaxIndex(cards.length);
      if (maxIdx === 0) return;
      const prevIdx = (currentIndex <= 0) ? maxIdx : currentIndex - 1;
      scrollToCard(prevIdx, true);
    }

    // 4. Auto-scroll Lifecycle
    function startAutoScroll() {
      stopAutoScroll();
      if (isUserManuallyPaused || isHovered || isFocused || isTouched || !isIntersecting || document.visibilityState === 'hidden') {
        return;
      }
      autoScrollTimer = setInterval(advanceNext, 4000);
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    function restartAutoScroll() {
      stopAutoScroll();
      if (!isUserManuallyPaused) {
        startAutoScroll();
      }
    }

    function pauseTemporarily(durationMs = 10000) {
      stopAutoScroll();
      if (tempPauseTimer) clearTimeout(tempPauseTimer);
      if (isUserManuallyPaused) return;
      tempPauseTimer = setTimeout(() => {
        startAutoScroll();
      }, durationMs);
    }

    // 5. Update UI Controls (Counter, Dots, Play/Pause Button)
    function updateControls() {
      const cards = track.querySelectorAll('.project-card');
      const total = cards.length;
      const vis = getVisibleCount();

      if (counterEl) {
        if (total === 0) {
          counterEl.textContent = '0 / 0';
        } else {
          const start = currentIndex + 1;
          const end = Math.min(currentIndex + vis, total);
          counterEl.textContent = `${start}-${end} / ${total}`;
        }
      }

      if (dotsEl) {
        const maxIdx = getMaxIndex(total);
        const dotCount = total > 0 ? (maxIdx + 1) : 0;
        if (dotsEl.children.length !== dotCount) {
          dotsEl.innerHTML = Array.from({ length: dotCount }).map((_, i) => `
            <button class="project-dot ${i === currentIndex ? 'active' : ''}" 
                    role="tab" 
                    aria-label="Go to slide ${i + 1}"
                    data-index="${i}">
            </button>
          `).join('');
        } else {
          Array.from(dotsEl.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
          });
        }
      }

      updatePlayPauseUI();
    }

    function updatePlayPauseUI() {
      if (!playpauseBtn) return;
      const pauseIcon = playpauseBtn.querySelector('.icon-pause');
      const playIcon = playpauseBtn.querySelector('.icon-play');
      if (isUserManuallyPaused) {
        playpauseBtn.setAttribute('aria-pressed', 'true');
        playpauseBtn.setAttribute('aria-label', 'Play auto-scroll');
        playpauseBtn.setAttribute('title', 'Play auto-scroll');
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = 'block';
      } else {
        playpauseBtn.setAttribute('aria-pressed', 'false');
        playpauseBtn.setAttribute('aria-label', 'Pause auto-scroll');
        playpauseBtn.setAttribute('title', 'Pause auto-scroll');
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playIcon) playIcon.style.display = 'none';
      }
    }

    // 6. Render Project Cards
    function renderCards() {
      let filtered = [];
      if (currentFilter === 'all') {
        filtered = visibleProjects.filter(p => p.featured);
      } else {
        filtered = visibleProjects.filter(p => p.country === currentFilter);
      }

      if (filtered.length === 0) {
        track.innerHTML = `<p class="projects-empty">No projects found for this region.</p>`;
        updateControls();
        return;
      }

      track.innerHTML = filtered.map((p) => {
        return `
          <!-- TODO(owner): confirm exact role and permission to display name and logo -->
          <a href="projects.html#${escapeHtml(p.slug)}" class="project-card" aria-label="${escapeHtml(p.name)} in ${escapeHtml(p.location)}">
            <div class="project-card__media">
              <div class="project-card__placeholder" aria-hidden="true">
                <div class="project-card__blueprint-grid"></div>
                <div class="project-card__placeholder-icon">
                  ${getSectorSvg(p.sector)}
                </div>
                <span class="project-card__placeholder-badge mono">Project photo coming soon</span>
              </div>

              ${p.image ? `
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)} — ${escapeHtml(p.sector)} project in ${escapeHtml(p.location)}"
                     width="600" height="338" class="project-card__img" loading="lazy"
                     onload="this.classList.add('is-loaded')"
                     onerror="this.style.display='none';">
              ` : ''}

              <div class="project-card__tags">
                <span class="project-tag project-tag--sector">${escapeHtml(p.sector)}</span>
                <span class="project-tag project-tag--country mono">${escapeHtml(p.country)}</span>
              </div>
            </div>

            <div class="project-card__body">
              <h3 class="project-card__title">${escapeHtml(p.name)}</h3>
              
              <div class="project-card__meta">
                ${p.client ? `
                  <div class="project-meta-row">
                    <span class="project-meta-key mono">CLIENT</span>
                    <span class="project-meta-val">${escapeHtml(p.client)}</span>
                  </div>
                ` : ''}
                <div class="project-meta-row">
                  <span class="project-meta-key mono">LOCATION</span>
                  <span class="project-meta-val">${escapeHtml(p.location)}</span>
                </div>
                <div class="project-meta-row">
                  <span class="project-meta-key mono">SECTOR</span>
                  <span class="project-meta-val">${escapeHtml(p.sector)}</span>
                </div>
                <div class="project-meta-row project-meta-row--scope">
                  <span class="project-meta-key mono">SCOPE</span>
                  <span class="project-meta-val project-meta-val--scope">${escapeHtml(p.scope)}</span>
                </div>
                ${p.role ? `
                  <div class="project-meta-row">
                    <span class="project-meta-key mono">COMPANY ROLE</span>
                    <span class="project-meta-val">${escapeHtml(p.role)}</span>
                  </div>
                ` : ''}
              </div>

              <div class="project-card__footer">
                <span class="project-card__link">View project details <span class="project-card__arrow" aria-hidden="true">→</span></span>
              </div>
            </div>
          </a>
        `;
      }).join('');

      updateControls();
    }

    // 7. Event Listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        advancePrev();
        pauseTemporarily(10000);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        advanceNext();
        pauseTemporarily(10000);
      });
    }

    if (playpauseBtn) {
      playpauseBtn.addEventListener('click', () => {
        isUserManuallyPaused = !isUserManuallyPaused;
        updatePlayPauseUI();
        if (isUserManuallyPaused) {
          stopAutoScroll();
        } else {
          startAutoScroll();
        }
      });
    }

    if (dotsEl) {
      dotsEl.addEventListener('click', (e) => {
        const dot = e.target.closest('.project-dot');
        if (dot && dot.dataset.index !== undefined) {
          scrollToCard(parseInt(dot.dataset.index, 10), true);
          pauseTemporarily(10000);
        }
      });
    }

    // Keyboard navigation on track
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        advancePrev();
        pauseTemporarily(10000);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        advanceNext();
        pauseTemporarily(10000);
      }
    });

    // Hover pauses auto-scroll
    track.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoScroll();
    });
    track.addEventListener('mouseleave', () => {
      isHovered = false;
      if (!isUserManuallyPaused) startAutoScroll();
    });

    // Keyboard focus inside pauses auto-scroll
    track.addEventListener('focusin', () => {
      isFocused = true;
      stopAutoScroll();
    });
    track.addEventListener('focusout', () => {
      isFocused = false;
      if (!isUserManuallyPaused) startAutoScroll();
    });

    // Touch interaction pauses auto-scroll
    track.addEventListener('touchstart', () => {
      isTouched = true;
      stopAutoScroll();
    }, { passive: true });
    track.addEventListener('touchend', () => {
      isTouched = false;
      pauseTemporarily(10000);
    }, { passive: true });
    track.addEventListener('touchcancel', () => {
      isTouched = false;
      pauseTemporarily(10000);
    }, { passive: true });

    // Track manual scrolling (swipes)
    let scrollDebounce;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const cards = track.querySelectorAll('.project-card');
        if (!cards.length) return;
        const cardWidth = cards[0].offsetWidth + 20;
        const detectedIdx = Math.round(track.scrollLeft / cardWidth);
        const maxIdx = getMaxIndex(cards.length);
        currentIndex = Math.max(0, Math.min(detectedIdx, maxIdx));
        updateControls();
      }, 50);
    }, { passive: true });

    // Browser tab visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        stopAutoScroll();
      } else if (!isUserManuallyPaused && isIntersecting && !isHovered && !isFocused && !isTouched) {
        startAutoScroll();
      }
    });

    // IntersectionObserver
    if ('IntersectionObserver' in window && sectionEl) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            if (!isUserManuallyPaused && !isHovered && !isFocused && !isTouched && document.visibilityState === 'visible') {
              startAutoScroll();
            }
          } else {
            stopAutoScroll();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(sectionEl);
    }

    // Resize recalculations
    window.addEventListener('resize', () => {
      updateControls();
    });

    // Initial render
    renderCards();
    updatePlayPauseUI();
    if (!isUserManuallyPaused) {
      startAutoScroll();
    }
  }

  /* ══════════════════════════════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════════════════════════════ */
  function init() {
    const clients = window.ATC_CLIENTS || [];
    const projects = window.ATC_PROJECTS || [];

    renderClientsSection(clients);
    renderProjectsSection(projects);
  }

  if (document.getElementById('clients-mount')) {
    init();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
