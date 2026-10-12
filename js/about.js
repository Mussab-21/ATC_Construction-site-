/**
 * about.js — Core Values Peek Slider Controller
 * 10 / 80 / 10 peek layout with auto-advance, keyboard navigation,
 * scroll-snap sync, dot/arrow controls, and pause-on-interaction.
 */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.values-slider');
  if (!slider) return;

  const track = slider.querySelector('.values-slider__track');
  const slides = Array.from(slider.querySelectorAll('.values-slider__slide'));
  const prevBtn = slider.querySelector('#values-prev');
  const nextBtn = slider.querySelector('#values-next');
  const dots = Array.from(slider.querySelectorAll('.values-slider__dot'));
  const playpauseBtn = slider.querySelector('#values-playpause');

  if (!track || slides.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentIndex = 0;
  let autoplayTimer = null;
  let isHovered = false;
  let isFocused = false;
  let isUserPaused = false;
  let isProgrammaticScroll = false;
  let scrollTimeout = null;

  // Calculate target scrollLeft to center a given slide in the track viewport
  function getScrollLeftForIndex(index) {
    const slide = slides[index];
    if (!slide) return 0;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const trackCenter = track.clientWidth / 2;
    return Math.max(0, slideCenter - trackCenter);
  }

  // Find index of the slide closest to the track's horizontal center
  function getClosestSlideIndex() {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;
    slides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const diff = Math.abs(slideCenter - trackCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    return closestIndex;
  }

  // Update UI classes (active slide, active dot, accessibility attributes)
  function setActiveSlide(index) {
    currentIndex = index;
    slides.forEach((slide, idx) => {
      const isActive = idx === index;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === index;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  // Scroll to target slide
  function scrollToSlide(index, instant = false) {
    if (index < 0 || index >= slides.length) return;
    const targetLeft = getScrollLeftForIndex(index);
    isProgrammaticScroll = true;
    clearTimeout(scrollTimeout);

    track.scrollTo({
      left: targetLeft,
      behavior: (instant || prefersReduced) ? 'auto' : 'smooth'
    });

    setActiveSlide(index);

    scrollTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 450);
  }

  // Synchronize on manual scroll / swipe / drag
  track.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    const closest = getClosestSlideIndex();
    if (closest !== currentIndex) {
      setActiveSlide(closest);
    }
  }, { passive: true });

  // Slide click: peeking neighbour slide scrolls to center
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      if (currentIndex !== idx) {
        scrollToSlide(idx);
      }
    });
  });

  // Next & Previous buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      scrollToSlide(prevIndex);
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollToSlide(nextIndex);
      restartAutoplay();
    });
  }

  // Dot navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      scrollToSlide(idx);
      restartAutoplay();
    });
  });

  // Keyboard navigation on track
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      scrollToSlide(prevIndex);
      restartAutoplay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollToSlide(nextIndex);
      restartAutoplay();
    }
  });

  // Autoplay management (every 5 seconds)
  function startAutoplay() {
    stopAutoplay();
    if (!prefersReduced && !isUserPaused) {
      autoplayTimer = setInterval(() => {
        if (!isHovered && !isFocused && !document.hidden && !isUserPaused) {
          const nextIndex = (currentIndex + 1) % slides.length;
          scrollToSlide(nextIndex);
        }
      }, 5000);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Play/Pause button
  if (playpauseBtn) {
    const iconPause = playpauseBtn.querySelector('.icon-pause');
    const iconPlay = playpauseBtn.querySelector('.icon-play');

    playpauseBtn.addEventListener('click', () => {
      isUserPaused = !isUserPaused;
      playpauseBtn.setAttribute('aria-pressed', String(isUserPaused));
      playpauseBtn.setAttribute('title', isUserPaused ? 'Resume slideshow' : 'Pause slideshow');
      playpauseBtn.setAttribute('aria-label', isUserPaused ? 'Resume slideshow' : 'Pause slideshow');

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

    if (prefersReduced) {
      isUserPaused = true;
      playpauseBtn.setAttribute('aria-pressed', 'true');
      if (iconPause && iconPlay) {
        iconPause.style.display = 'none';
        iconPlay.style.display = 'block';
      }
    }
  }

  // Pause on hover
  slider.addEventListener('mouseenter', () => { isHovered = true; });
  slider.addEventListener('mouseleave', () => { isHovered = false; });

  // Pause on keyboard focus
  slider.addEventListener('focusin', () => { isFocused = true; });
  slider.addEventListener('focusout', () => { isFocused = false; });

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Recenter on window resize
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      scrollToSlide(currentIndex, true);
    }, 100);
  }, { passive: true });

  // Initialize
  setActiveSlide(0);
  startAutoplay();
});
