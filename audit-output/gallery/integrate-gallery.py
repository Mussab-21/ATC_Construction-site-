from pathlib import Path
p=Path('js/projects.js'); s=p.read_text(encoding='utf-8')
s=s.replace('let activeGalleryIndex = 0;', 'let curatedGalleryPhotos = [];\n  let visibleGalleryCount = 24;\n  let lightboxPhotos = [];\n  let activeGalleryIndex = 0;')
s=s.replace("    search: '',\n    galleryCategory: 'all' // 'all' | 'Civil & Structural' | 'MEP & Electrical' | 'Finishing & Interiors'", "    search: ''")
a=s.index('  function getFilteredGalleryPhotos()'); b=s.index('  /* ── Render Controls',a); s=s[:a]+s[b:]
a=s.index('    // 4. Gallery Category Pills'); b=s.index('\n  }',a); s=s[:a]+s[b:]
a=s.index('  function renderGallery()'); b=s.index('  /* ── Accessible Modal Focus',a)
s=s[:a]+'''  function renderGallery() {
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

'''+s[b:]
s=s.replace('function openLightbox(index) {\n    if (allGalleryPhotos.length === 0) return;', 'function openLightbox(index, photos = allGalleryPhotos) {\n    lightboxPhotos = photos;\n    if (lightboxPhotos.length === 0) return;')
a=s.index('  function openLightbox('); b=s.index('  function closeLightbox()',a); section=s[a:b].replace('allGalleryPhotos.length','lightboxPhotos.length').replace('allGalleryPhotos[activeGalleryIndex]','lightboxPhotos[activeGalleryIndex]')
section=section.replace('`${photo.projectTitle} · ${photo.category}`', "photo.sourceLabel || photo.projectTitle || 'Project gallery'")
section=section.replace('    if (viewProjectBtn) {\n      viewProjectBtn.onclick', '    if (viewProjectBtn) {\n      viewProjectBtn.hidden = !photo.projectId;\n      viewProjectBtn.onclick')
s=s[:a]+section+s[b:]
a=s.index('      // Gallery Category Filter click'); b=s.index('      // Clear Filters button',a)
s=s[:a]+'''      const curatedTrigger = e.target.closest('[data-curated-index]');
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

'''+s[b:]
s=s.replace('      renderGallery();\n\n      // Check initial hash', '      // Check initial hash')
pos=s.index("  fetch('data/projects.json')")
s=s[:pos]+'''  fetch('data/gallery.json')
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

'''+s[pos:]
p.write_text(s,encoding='utf-8')
p=Path('projects.html'); s=p.read_text(encoding='utf-8'); a=s.index('    <!-- Gallery Category Filters -->'); b=s.index('    <!-- Gallery Grid -->',a); s=s[:a]+s[b:]
a=s.index('    <!-- Gallery Provenance Note -->'); b=s.index('\n  </div>\n</section>',a)
s=s[:a]+'''    <div class="gallery-footer">
      <span id="gallery-count" class="mono" role="status" aria-live="polite"></span>
      <button type="button" id="gallery-load-more" class="btn btn--outline" aria-controls="gallery-grid" hidden>Show more photographs <span aria-hidden="true">↓</span></button>
    </div>'''+s[b:]
s=s.replace('PROJECT EVIDENCE','IN PICTURES').replace('Verified imagery from active site operations, structural construction, MEP installations and completed handovers.','A closer look at built spaces, considered details and work on site. Select any photograph to explore the full image.').replace('verified project photography','project imagery').replace('css/pages/projects.css?v=5','css/pages/projects.css?v=6').replace('js/projects.js','js/projects.js?v=6')
p.write_text(s,encoding='utf-8')
p=Path('css/pages/projects.css'); s=p.read_text(encoding='utf-8'); s+='''
/* Image-only collection: preserve complete compositions, including portrait photos. */
#gallery-grid {
  display: block;
  columns: 3;
  column-gap: 18px;
}
#gallery-grid .gallery-card {
  break-inside: avoid;
  margin-bottom: 18px;
  border: 0;
  border-radius: 3px;
}
#gallery-grid .gallery-card__btn { position: relative; }
#gallery-grid .gallery-card__img {
  height: auto;
  object-position: center;
  filter: none;
}
#gallery-grid .gallery-card:hover { transform: none; }
#gallery-grid .gallery-card:hover .gallery-card__img { transform: none; }
#gallery-grid .gallery-card__btn:focus-visible .gallery-card__overlay { opacity: 1; }
.gallery-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,.15);
  color: rgba(255,255,255,.65);
  font-size: .8rem;
}
.gallery-footer .btn { color: white; border-color: rgba(255,255,255,.4); }
#gallery-load-more[hidden], #lightbox-view-project[hidden], .modal-overlay[hidden] { display: none; }
@media (max-width: 1024px) { #gallery-grid { columns: 2; } }
@media (max-width: 540px) {
  #gallery-grid { columns: 1; }
  .gallery-footer { flex-direction: column; align-items: stretch; text-align: center; }
  .lightbox__info { min-width: 0; }
  .lightbox__media { min-height: 200px; padding: 12px; }
}
'''; p.write_text(s,encoding='utf-8')
