/* hero-animation.js — Continuous CAD Blueprint Elevation Animation */
(function () {
  'use strict';

  function initHeroSVG() {
    const svg = document.getElementById('hero-elevation');
    if (!svg) return;

    const coordsEl = document.getElementById('cad-coords');
    const statusEl = document.getElementById('cad-status-text');

    // Collect all drawable elements
    const elements = Array.from(svg.querySelectorAll('path, line, rect, polyline, polygon, circle'));
    const lengths = elements.map(el => {
      let len = 600;
      try {
        if (el.getTotalLength) {
          len = Math.ceil(el.getTotalLength());
        } else if (el.tagName === 'line') {
          const x1 = parseFloat(el.getAttribute('x1') || 0);
          const y1 = parseFloat(el.getAttribute('y1') || 0);
          const x2 = parseFloat(el.getAttribute('x2') || 0);
          const y2 = parseFloat(el.getAttribute('y2') || 0);
          len = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
        } else if (el.tagName === 'rect') {
          const w = parseFloat(el.getAttribute('width') || 0);
          const h = parseFloat(el.getAttribute('height') || 0);
          len = Math.ceil(2 * (w + h));
        }
      } catch (e) {
        len = 600;
      }
      return Math.max(len, 20);
    });

    // Initialize elements with dasharray & offset
    elements.forEach((el, i) => {
      const len = lengths[i];
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = len;
      el.style.transition = 'none';
      el.style.opacity = '1';
    });

    let isRunning = false;

    function runAnimationCycle() {
      if (isRunning) return;
      isRunning = true;

      if (statusEl) statusEl.textContent = 'CAD RE-DRAW ACTIVE';

      // Animate draw-in sequentially with progressive stagger
      elements.forEach((el, i) => {
        const delay = (i * 45);
        setTimeout(() => {
          el.style.transition = 'stroke-dashoffset 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
          el.style.strokeDashoffset = '0';
        }, delay);
      });

      const totalDrawTime = (elements.length * 45) + 850;

      // When all elements have drawn
      setTimeout(() => {
        if (statusEl) statusEl.textContent = 'ELEVATION COMPILED';

        // Brief highlight pulse
        svg.style.filter = 'drop-shadow(0 0 10px rgba(232, 93, 42, 0.6))';
        setTimeout(() => {
          svg.style.filter = 'drop-shadow(0 0 4px rgba(232, 93, 42, 0.2))';
        }, 500);

        // Hold for 1 second (as requested: "animation should work after every 1 sec so it does not look booring")
        setTimeout(() => {
          if (statusEl) statusEl.textContent = 'SCANNING & SYNCING';

          // Gracefully cycle: smoothly retract and re-trigger draw
          elements.forEach((el, i) => {
            const len = lengths[i];
            const retractDelay = i * 20;
            setTimeout(() => {
              el.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.5, 0, 0.75, 0)';
              el.style.strokeDashoffset = len;
            }, retractDelay);
          });

          const totalRetractTime = (elements.length * 20) + 500;
          setTimeout(() => {
            isRunning = false;
            runAnimationCycle();
          }, totalRetractTime + 150);

        }, 1000); // 1-second interval!

      }, totalDrawTime);
    }

    // Live CAD Coordinate jitter effect
    let coordAngle = 0;
    setInterval(() => {
      if (!coordsEl) return;
      coordAngle += 0.08;
      const x = (210 + Math.sin(coordAngle) * 45).toFixed(1);
      const y = (140 + Math.cos(coordAngle) * 35).toFixed(1);
      const elev = (12.4 + Math.sin(coordAngle * 0.5) * 1.2).toFixed(1);
      coordsEl.textContent = `X: ${x} Y: ${y} | ELEV +${elev}m | 1:100`;
    }, 120);

    // Initial start
    setTimeout(runAnimationCycle, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSVG);
  } else {
    initHeroSVG();
  }
})();
