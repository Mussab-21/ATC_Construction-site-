/**
 * slider.js — Interactive Carousel Controller for ATC Featured Projects
 * Supports next/prev buttons, indicator pills, counter, autoplay,
 * keyboard navigation, crossfade + directional slide transition,
 * and scope list stagger animation on each slide change.
 */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.featured-slider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.featured-slide'));
  const prevBtn = slider.querySelector('#slider-prev');
  const nextBtn = slider.querySelector('#slider-next');
  const dots = Array.from(slider.querySelectorAll('.slider-dot'));
  const counter = slider.querySelector('#slider-counter');

  if (slides.length <= 1) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 6000;

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index, direction) {
    const outgoing = slides[currentIndex];
    const enterClass = direction === 'next' ? 'slide-enter-right' : 'slide-enter-left';

    // Remove active + cleanup animation classes from outgoing
    outgoing.classList.remove('active', 'slide-enter-right', 'slide-enter-left');

    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    const incoming = slides[currentIndex];

    // Remove old animation classes to allow re-trigger
    incoming.classList.remove('slide-enter-right', 'slide-enter-left');

    // Apply directional enter animation (skipped if reduced motion)
    if (!prefersReduced) {
      // Force reflow to restart animation
      void incoming.offsetWidth;
      incoming.classList.add(enterClass);
    }

    incoming.classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');

    if (counter) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(slides.length).padStart(2, '0');
      counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    // Re-trigger scope list stagger by removing/readding 'active'
    // (the CSS transitions are tied to .active on the parent)
    // Already handled since active is re-applied above.
  }

  function nextSlide() {
    goToSlide(currentIndex + 1, 'next');
  }

  function prevSlide() {
    goToSlide(currentIndex - 1, 'prev');
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

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const dir = idx > currentIndex ? 'next' : 'prev';
      goToSlide(idx, dir);
      startAutoplay();
    });
  });

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Initialize at slide 0
  goToSlide(0, 'next');
  startAutoplay();
});
