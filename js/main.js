/* main.js — Shared logic: navbar, mobile menu, IntersectionObserver, active links */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour & Header height sync ──────── */
  const navbar = document.getElementById('navbar');
  const updateHeaderHeight = () => {
    if (navbar) {
      const h = navbar.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
      }
    }
  };

  if (navbar) {
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight, { passive: true });
    window.addEventListener('load', updateHeaderHeight, { passive: true });

    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Snap Section Active Observer (middle 30% viewport) ─── */
  const snapSections = document.querySelectorAll('.snap-section');
  if (snapSections.length > 0 && 'IntersectionObserver' in window) {
    const snapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, {
      rootMargin: '-35% 0px -35% 0px'
    });
    snapSections.forEach(s => snapObserver.observe(s));
  }

  /* ── Mobile hamburger ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Active nav link ────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Generic IntersectionObserver for .fade-up ──────────── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  /* ── Animated divider draw-in ───────────────────────────── */
  const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        dividerObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.divider--animated').forEach(el => dividerObserver.observe(el));

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Reveal .org-chart & Branch Connectors ──────────────── */
  const orgObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        orgObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.org-chart').forEach(el => orgObserver.observe(el));

  /* ── Interactive Org Cards (Mobile Tap & Keyboard Toggle) ── */
  const orgCards = document.querySelectorAll('.org-card');
  if (orgCards.length > 0) {
    orgCards.forEach(card => {
      const toggleOrgCard = () => {
        const isExpanded = card.classList.toggle('is-expanded');
        card.setAttribute('aria-expanded', String(isExpanded));
      };

      card.addEventListener('click', () => { toggleOrgCard(); });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleOrgCard();
        }
      });
    });
  }

  /* ── Service Carousels Controller ───────────────────────── */
  function initServiceCarousels() {
    const carousels = document.querySelectorAll('[data-service-carousel]');
    if (!carousels.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    carousels.forEach((carousel) => {
      const track = carousel.querySelector('.service-carousel__track');
      if (!track) return;

      const cards = Array.from(track.children);
      if (cards.length <= 1) return;

      const prevBtn = carousel.querySelector('.carousel-btn--prev');
      const nextBtn = carousel.querySelector('.carousel-btn--next');
      const dotsWrap = carousel.querySelector('.carousel-dots');
      const counter = carousel.querySelector('.carousel-counter');

      let currentIndex = 0;
      let autoplayTimer = null;
      const AUTOPLAY_INTERVAL = 4500;

      function getVisibleCount() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 992) return 2;
        return 3;
      }

      function getMaxIndex() {
        const visible = getVisibleCount();
        return Math.max(0, cards.length - visible);
      }

      function buildDots() {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        const maxIndex = getMaxIndex();
        const dotCount = maxIndex + 1;

        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('button');
          dot.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.setAttribute('type', 'button');
          dot.addEventListener('click', () => {
            goToIndex(i);
            startAutoplay();
          });
          dotsWrap.appendChild(dot);
        }
      }

      function updateCounter() {
        if (!counter) return;
        const cur = String(currentIndex + 1).padStart(2, '0');
        const tot = String(cards.length).padStart(2, '0');
        counter.textContent = `${cur} / ${tot}`;
      }

      function updateDots() {
        if (!dotsWrap) return;
        const dots = dotsWrap.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }

      function goToIndex(index) {
        const maxIndex = getMaxIndex();
        if (index > maxIndex) {
          currentIndex = 0;
        } else if (index < 0) {
          currentIndex = maxIndex;
        } else {
          currentIndex = index;
        }

        if (cards[0]) {
          const cardWidth = cards[0].getBoundingClientRect().width;
          const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
          const moveX = currentIndex * (cardWidth + gap);
          track.style.transform = `translateX(-${moveX}px)`;
        }

        updateDots();
        updateCounter();
      }

      function nextSlide() {
        goToIndex(currentIndex + 1);
      }

      function prevSlide() {
        goToIndex(currentIndex - 1);
      }

      function startAutoplay() {
        stopAutoplay();
        if (!prefersReduced) {
          autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
        }
      }

      function stopAutoplay() {
        if (autoplayTimer) {
          clearInterval(autoplayTimer);
          autoplayTimer = null;
        }
      }

      // Event listeners
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          startAutoplay();
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          startAutoplay();
        });
      }

      // Pause on hover, focus, touch
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      carousel.addEventListener('focusin', stopAutoplay);
      carousel.addEventListener('focusout', startAutoplay);
      carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
      carousel.addEventListener('touchend', startAutoplay, { passive: true });

      // Keyboard navigation
      carousel.setAttribute('tabindex', '0');
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          startAutoplay();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          startAutoplay();
        }
      });

      // Touch swipe support
      let startX = 0;
      carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) nextSlide();
          else prevSlide();
          startAutoplay();
        }
      }, { passive: true });

      // Window resize handler
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          buildDots();
          goToIndex(currentIndex);
        }, 100);
      });

      // Initialize carousel
      buildDots();
      goToIndex(0);
      startAutoplay();
    });
  }

  /* ── Homepage Services Carousel Controller ───────────────── */
  function initHomeServicesCarousel() {
    const track = document.getElementById('services-carousel-track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.division-card'));
    if (!cards.length) return;

    const prevBtn = document.getElementById('services-prev-btn');
    const nextBtn = document.getElementById('services-next-btn');
    const playpauseBtn = document.getElementById('services-playpause-btn');
    const dotsWrap = document.getElementById('services-dots');
    const section = document.getElementById('construction-services');

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const AUTOPLAY_INTERVAL = 4000;
    let currentIndex = 0;
    let autoplayTimer = null;
    let resumeTimeout = null;
    let isInteracting = false;
    let isUserPaused = false;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1024) return 2;
      return 4;
    }

    function getMaxIndex() {
      const visible = getVisibleCount();
      return Math.max(0, cards.length - visible);
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const maxIndex = getMaxIndex();
      const dotCount = maxIndex + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'services-dot' + (i === currentIndex ? ' is-active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('type', 'button');
        dot.addEventListener('click', () => {
          goToIndex(i);
          scheduleAutoplay();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      const dots = dotsWrap.querySelectorAll('.services-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }

    function goToIndex(index) {
      const maxIndex = getMaxIndex();
      if (index > maxIndex) {
        currentIndex = 0;
      } else if (index < 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex = index;
      }

      if (cards[currentIndex]) {
        const targetLeft = cards[currentIndex].offsetLeft - track.offsetLeft;
        track.scrollTo({
          left: targetLeft,
          behavior: prefersReduced ? 'auto' : 'smooth'
        });
      }

      updateDots();
    }

    function nextSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex >= maxIndex) {
        goToIndex(0);
      } else {
        goToIndex(currentIndex + 1);
      }
    }

    function prevSlide() {
      const maxIndex = getMaxIndex();
      if (currentIndex <= 0) {
        goToIndex(maxIndex);
      } else {
        goToIndex(currentIndex - 1);
      }
    }

    function startAutoplay() {
      stopAutoplay();
      clearTimeout(resumeTimeout);
      if (!isInteracting && !isUserPaused && !document.hidden) {
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
      }
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function scheduleAutoplay(delay = 0) {
      clearTimeout(resumeTimeout);
      if (delay > 0) {
        resumeTimeout = setTimeout(() => {
          startAutoplay();
        }, delay);
      } else {
        startAutoplay();
      }
    }

    // Play/Pause button toggle
    if (playpauseBtn) {
      const iconPause = playpauseBtn.querySelector('.icon-pause');
      const iconPlay = playpauseBtn.querySelector('.icon-play');

      playpauseBtn.addEventListener('click', () => {
        isUserPaused = !isUserPaused;
        playpauseBtn.setAttribute('aria-pressed', isUserPaused ? 'true' : 'false');
        playpauseBtn.setAttribute('title', isUserPaused ? 'Resume auto-scroll' : 'Pause auto-scroll');
        playpauseBtn.setAttribute('aria-label', isUserPaused ? 'Resume auto-scroll' : 'Pause auto-scroll');
        if (iconPause && iconPlay) {
          iconPause.style.display = isUserPaused ? 'none' : 'block';
          iconPlay.style.display = isUserPaused ? 'block' : 'none';
        }
        if (isUserPaused) {
          stopAutoplay();
        } else {
          startAutoplay();
        }
      });
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        scheduleAutoplay();
      }
    });

    // Pause only while pointer is over track or card inside has keyboard focus
    track.addEventListener('mouseenter', () => {
      isInteracting = true;
      stopAutoplay();
    });
    track.addEventListener('mouseleave', () => {
      isInteracting = false;
      scheduleAutoplay(1000);
    });
    track.addEventListener('focusin', () => {
      isInteracting = true;
      stopAutoplay();
    });
    track.addEventListener('focusout', () => {
      isInteracting = false;
      scheduleAutoplay(1000);
    });
    track.addEventListener('touchstart', () => {
      isInteracting = true;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener('touchend', () => {
      isInteracting = false;
      scheduleAutoplay(1000);
    }, { passive: true });

    // Sync active index on manual scroll
    let scrollDebounce;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(() => {
        const scrollLeft = track.scrollLeft;
        let closestIndex = 0;
        let minDiff = Infinity;
        cards.forEach((card, idx) => {
          const diff = Math.abs((card.offsetLeft - track.offsetLeft) - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(closestIndex, maxIndex);
        updateDots();
      }, 60);
    }, { passive: true });

    // Buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        scheduleAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        scheduleAutoplay();
      });
    }

    // Keyboard navigation on track
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        scheduleAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        scheduleAutoplay();
      }
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildDots();
        goToIndex(currentIndex);
      }, 100);
    });

    // Handle Hero Service Anchor Clicks and Hash on Load
    function scrollToSlide(slideId) {
      const slideEl = document.getElementById(slideId);
      if (!slideEl || !section) return;
      const slideIdx = cards.indexOf(slideEl);
      if (slideIdx !== -1) {
        goToIndex(slideIdx);
      }
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = section.getBoundingClientRect().top + window.scrollY - offset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    document.querySelectorAll('a[href="#consultancy"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#consultancy');
        scrollToSlide('consultancy');
        scheduleAutoplay();
      });
    });

    document.querySelectorAll('a[href="#trading"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, '', '#trading');
        scrollToSlide('trading');
        scheduleAutoplay();
      });
    });

    // Check hash on page load
    const currentHash = window.location.hash;
    if (currentHash === '#consultancy' || currentHash === '#trading') {
      setTimeout(() => {
        scrollToSlide(currentHash.slice(1));
      }, 350);
    }

    buildDots();
    goToIndex(0);
    startAutoplay();
  }

  /* ── Service Capability Cards Accordion & Toggle All ───── */
  function initServiceCards() {
    const sections = document.querySelectorAll('.division-section');
    if (!sections.length) return;

    sections.forEach(section => {
      const cards = section.querySelectorAll('.svc-card');
      const toggleAllBtn = section.querySelector('.division__toggle-all');

      function updateToggleAllState() {
        if (!toggleAllBtn) return;
        const allOpen = Array.from(cards).every(c => c.classList.contains('is-open'));
        const textEl = toggleAllBtn.querySelector('.division__toggle-all-text');
        const iconEl = toggleAllBtn.querySelector('.division__toggle-all-icon');
        if (allOpen) {
          toggleAllBtn.setAttribute('aria-expanded', 'true');
          if (textEl) textEl.textContent = 'Collapse all';
          if (iconEl) iconEl.textContent = '↑';
        } else {
          toggleAllBtn.setAttribute('aria-expanded', 'false');
          if (textEl) textEl.textContent = 'Expand all';
          if (iconEl) iconEl.textContent = '↓';
        }
      }

      cards.forEach(card => {
        const btn = card.querySelector('.svc-card__header');
        const body = card.querySelector('.svc-card__body-wrap');
        if (!btn || !body) return;

        // Ensure initially collapsed
        btn.setAttribute('aria-expanded', 'false');
        card.classList.remove('is-open');
        body.setAttribute('inert', '');

        btn.addEventListener('click', () => {
          const isOpen = card.classList.toggle('is-open');
          btn.setAttribute('aria-expanded', String(isOpen));
          if (isOpen) {
            body.removeAttribute('inert');
          } else {
            body.setAttribute('inert', '');
          }
          updateToggleAllState();
        });
      });

      if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
          const anyClosed = Array.from(cards).some(c => !c.classList.contains('is-open'));
          const shouldOpen = anyClosed;
          cards.forEach(card => {
            const btn = card.querySelector('.svc-card__header');
            const body = card.querySelector('.svc-card__body-wrap');
            card.classList.toggle('is-open', shouldOpen);
            if (btn) btn.setAttribute('aria-expanded', String(shouldOpen));
            if (body) {
              if (shouldOpen) {
                body.removeAttribute('inert');
              } else {
                body.setAttribute('inert', '');
              }
            }
          });
          updateToggleAllState();
        });
      }
    });
  }

  // Initialize carousels & service cards on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initServiceCarousels();
      initHomeServicesCarousel();
      initServiceCards();
    });
  } else {
    initServiceCarousels();
    initHomeServicesCarousel();
    initServiceCards();
  }

})();

