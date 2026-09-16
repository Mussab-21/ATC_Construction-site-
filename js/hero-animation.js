/* hero-animation.js — Hero blueprint-to-3D animation controller.
   Handles:
   1. The high-definition blueprint-to-3D turntable video (atc_blueprint_to_3d.mp4),
      dynamically synchronizing live CAD coordinates, telemetry, and status badges.
   2. SVG / Three.js fallback if the video cannot load or play.
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
      var promise = video.play();
      if (promise !== undefined) {
        promise.catch(function () {
          // Autoplay prevented; retry on first document click or touch
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

    // Dynamic phase tracking synchronized with the 5.7s video timeline
    video.addEventListener('timeupdate', function () {
      var t = video.currentTime;

      if (!statusEl || !coordsEl) return;

      if (t < 1.6) {
        // Phase 1: Scan reveal (0s - 1.6s)
        var pct = Math.min(100, Math.round((t / 1.6) * 100));
        statusEl.textContent = 'CAD SCANNING (' + pct + '%)';
        var scanX = (t / 1.6 * 420).toFixed(1);
        var scanY = (140 + Math.sin(t * 8) * 18).toFixed(1);
        coordsEl.textContent = 'X: ' + scanX + ' Y: ' + scanY + ' | CAD ELEVATION';
        if (pulseDot) pulseDot.style.background = 'var(--c-orange)';
      } else if (t < 2.5) {
        // Phase 2: Hold on compiled blueprint (1.6s - 2.5s)
        statusEl.textContent = 'ELEVATION COMPILED';
        coordsEl.textContent = 'X: 210.0 Y: 140.0 | SCALE 1:100 | DIM 12.40M';
        if (pulseDot) pulseDot.style.background = '#64B5F6';
      } else if (t < 3.3) {
        // Phase 3: Morph / crossfade dissolve into 3D (2.5s - 3.3s)
        var morphPct = Math.min(100, Math.round(((t - 2.5) / 0.8) * 100));
        statusEl.textContent = '3D MATERIALIZING (' + morphPct + '%)';
        coordsEl.textContent = 'MESH GEN | DISSOLVE ' + morphPct + '%';
        if (pulseDot) pulseDot.style.background = '#E85D2A';
      } else {
        // Phase 4: Turntable 3D rotation (3.3s - 5.7s)
        var rotProgress = (t - 3.3) / 2.4;
        var deg = Math.round(rotProgress * 360) % 360;
        statusEl.textContent = '3D MODEL — LIVE VIEW';
        coordsEl.textContent = 'ROTATION: ' + deg + '° | TURNTABLE 3D';
        if (pulseDot) pulseDot.style.background = '#00E676';
      }
    });

    // Toggle pause/play on click of stage
    var stage = document.getElementById('hero-stage');
    if (stage) {
      stage.style.cursor = 'pointer';
      stage.setAttribute('title', 'Click to Pause / Play CAD animation');
      stage.addEventListener('click', function () {
        if (video.paused) {
          isPausedByUser = false;
          video.play();
        } else {
          isPausedByUser = true;
          video.pause();
          if (statusEl) statusEl.textContent = 'CAD PAUSED';
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
