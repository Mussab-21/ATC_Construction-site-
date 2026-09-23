/* main.js — Shared logic: navbar, mobile menu, IntersectionObserver, active links */

(function () {
  'use strict';

  /* ── Navbar scroll behaviour ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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

  // Initialize service carousels on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceCarousels);
  } else {
    initServiceCarousels();
  }

})();

