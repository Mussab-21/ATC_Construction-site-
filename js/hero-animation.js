/* hero-animation.js — Hero architectural video controller.
   Handles:
   1. The cinematic blueprint-to-3D video (best_atc_hero_final.mp4),
      dynamically synchronizing live CAD telemetry, status badges, and interactive controls.
   2. Seamless autoplay, pause/play toggles, and responsive display.
*/
(function () {
  'use strict';

  function initHeroVideo() {
    var video = document.getElementById('hero-blueprint-video');
    var statusEl = document.getElementById('cad-status-text');
    var coordsEl = document.getElementById('cad-coords');
    var pulseDot = document.querySelector('.hero__pulse-dot');

    if (!video) return false;

    var isPausedByUser = false;

    // Autoplay handling (ensure playback with browser policies)
    function attemptPlay() {
      video.muted = true;
      video.defaultMuted = true;
      var promise = video.play();
      if (promise !== undefined) {
        promise.catch(function () {
          var onFirstTouch = function () {
            if (!isPausedByUser) video.play();
            document.removeEventListener('click', onFirstTouch);
            document.removeEventListener('touchstart', onFirstTouch);
          };
          document.addEventListener('click', onFirstTouch);
          document.addEventListener('touchstart', onFirstTouch);
        });
      }
    }

    // Dynamic phase tracking synchronized with the cinematic video timeline
    video.addEventListener('timeupdate', function () {
      var t = video.currentTime;

      if (!statusEl || !coordsEl) return;

      if (t < 1.8) {
        // Phase 1: Architectural desk concept & schematics
        statusEl.textContent = 'ARCHITECTURAL CONCEPT';
        coordsEl.textContent = 'CONCEPT MODEL & SCHEMATICS · SITE A';
        if (pulseDot) pulseDot.style.background = '#FFA726';
      } else if (t < 4.2) {
        // Phase 2: CAD blueprint drafting & elevation
        statusEl.textContent = 'CAD ELEVATION DRAFT';
        coordsEl.textContent = 'ATC / 01-VILLA / CAD · 12.40M SPAN';
        if (pulseDot) pulseDot.style.background = '#64B5F6';
      } else if (t < 6.0) {
        // Phase 3: Morph / materialization into solid 3D
        var pct = Math.min(100, Math.round(((t - 4.2) / 1.8) * 100));
        statusEl.textContent = '3D MATERIALIZING (' + pct + '%)';
        coordsEl.textContent = 'SOLIDIFYING STRUCTURE · 3D MESH';
        if (pulseDot) pulseDot.style.background = '#E85D2A';
      } else {
        // Phase 4: Completed villa showcase
        statusEl.textContent = 'VILLA — COMPLETED VIEW';
        coordsEl.textContent = 'AZAAN TRADING & CONTRACTING | REV 01';
        if (pulseDot) pulseDot.style.background = '#00E676';
      }
    });

    // Toggle pause/play on click of stage
    var stage = document.getElementById('hero-stage');
    if (stage) {
      stage.style.cursor = 'pointer';
      stage.setAttribute('title', 'Click to Pause / Play animation');
      stage.addEventListener('click', function () {
        if (video.paused) {
          isPausedByUser = false;
          video.play();
        } else {
          isPausedByUser = true;
          video.pause();
          if (statusEl) statusEl.textContent = 'ANIMATION PAUSED';
        }
      });
    }

    attemptPlay();
    return true;
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideo);
  } else {
    initHeroVideo();
  }
})();
