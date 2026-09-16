/* hero-animation.js — Hero card state machine.
   Phase 1: CAD blueprint draws in, line by line (existing behaviour).
   Phase 2: holds on the completed elevation.
   Phase 3: crossfades into a live-rotating 3D model (see hero-3d.js).
   Phase 4: holds while the model rotates.
   Phase 5: crossfades back to the blueprint, which retracts and
            redraws, and the cycle repeats indefinitely.
*/
(function () {
  'use strict';

  var TIMING = {
    holdOnBlueprint: 1100,   // pause after the elevation finishes drawing
    crossfade: 650,          // fade duration each direction
    holdOn3D: 4200,          // how long the model stays visible, rotating
    retractStagger: 20,
  };

  function initHeroSVG() {
    var svg = document.getElementById('hero-elevation');
    if (!svg) return;

    var coordsEl = document.getElementById('cad-coords');
    var statusEl = document.getElementById('cad-status-text');
    var stageEl = document.getElementById('hero-stage');
    var svgWrap = document.getElementById('hero-svg-wrap');
    var threeWrap = document.getElementById('hero-3d-wrap');
    var canvas = document.getElementById('hero-3d-canvas');

    var elements = Array.prototype.slice.call(
      svg.querySelectorAll('path, line, rect, polyline, polygon, circle')
    );
    var lengths = elements.map(function (el) {
      var len = 600;
      try {
        if (el.getTotalLength) {
          len = Math.ceil(el.getTotalLength());
        } else if (el.tagName === 'line') {
          var x1 = parseFloat(el.getAttribute('x1') || 0);
          var y1 = parseFloat(el.getAttribute('y1') || 0);
          var x2 = parseFloat(el.getAttribute('x2') || 0);
          var y2 = parseFloat(el.getAttribute('y2') || 0);
          len = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
        } else if (el.tagName === 'rect') {
          var w = parseFloat(el.getAttribute('width') || 0);
          var h = parseFloat(el.getAttribute('height') || 0);
          len = Math.ceil(2 * (w + h));
        }
      } catch (e) {
        len = 600;
      }
      return Math.max(len, 20);
    });

    elements.forEach(function (el, i) {
      var len = lengths[i];
      el.style.strokeDasharray = len + ' ' + len;
      el.style.strokeDashoffset = len;
      el.style.transition = 'none';
      el.style.opacity = '1';
    });

    // Live CAD coordinate jitter — runs continuously regardless of phase.
    var coordAngle = 0;
    setInterval(function () {
      if (!coordsEl) return;
      coordAngle += 0.08;
      var x = (210 + Math.sin(coordAngle) * 45).toFixed(1);
      var y = (140 + Math.cos(coordAngle) * 35).toFixed(1);
      var elev = (12.4 + Math.sin(coordAngle * 0.5) * 1.2).toFixed(1);
      coordsEl.textContent = 'X: ' + x + ' Y: ' + y + ' | ELEV +' + elev + 'm | 1:100';
    }, 120);

    function setStatus(text) {
      if (statusEl) statusEl.textContent = text;
    }

    function drawIn(onDone) {
      setStatus('CAD RE-DRAW ACTIVE');
      elements.forEach(function (el, i) {
        var delay = i * 45;
        setTimeout(function () {
          el.style.transition = 'stroke-dashoffset 0.85s cubic-bezier(0.25, 1, 0.5, 1)';
          el.style.strokeDashoffset = '0';
        }, delay);
      });
      var totalDrawTime = elements.length * 45 + 850;
      setTimeout(function () {
        setStatus('ELEVATION COMPILED');
        svg.style.filter = 'drop-shadow(0 0 10px rgba(232, 93, 42, 0.6))';
        setTimeout(function () {
          svg.style.filter = 'drop-shadow(0 0 4px rgba(232, 93, 42, 0.2))';
        }, 500);
        if (onDone) setTimeout(onDone, TIMING.holdOnBlueprint);
      }, totalDrawTime);
    }

    function retract(onDone) {
      setStatus('SCANNING & SYNCING');
      elements.forEach(function (el, i) {
        var len = lengths[i];
        var retractDelay = i * TIMING.retractStagger;
        setTimeout(function () {
          el.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.5, 0, 0.75, 0)';
          el.style.strokeDashoffset = len;
        }, retractDelay);
      });
      var totalRetractTime = elements.length * TIMING.retractStagger + 500;
      if (onDone) setTimeout(onDone, totalRetractTime + 150);
    }

    // --- Crossfade helpers between the blueprint panel and the 3D panel ---

    function showThree(onDone) {
      if (!threeWrap || !window.ATCHero3D) {
        if (onDone) onDone();
        return;
      }
      setStatus('GENERATING 3D MODEL');
      if (stageEl) stageEl.classList.add('hero-stage--3d');
      threeWrap.classList.add('is-visible');
      svgWrap.classList.add('is-hidden');
      window.ATCHero3D.setRotating(true);
      setTimeout(function () {
        setStatus(
          window.ATCHero3D.usedPlaceholder()
            ? '3D MODEL — PLACEHOLDER'
            : '3D MODEL — LIVE VIEW'
        );
        if (onDone) setTimeout(onDone, TIMING.holdOn3D);
      }, TIMING.crossfade);
    }

    function hideThree(onDone) {
      if (!threeWrap || !window.ATCHero3D) {
        if (onDone) onDone();
        return;
      }
      threeWrap.classList.remove('is-visible');
      svgWrap.classList.remove('is-hidden');
      if (stageEl) stageEl.classList.remove('hero-stage--3d');
      setTimeout(function () {
        window.ATCHero3D.setRotating(false);
        if (onDone) onDone();
      }, TIMING.crossfade);
    }

    // --- Full cycle ---

    var isRunning = false;
    function runCycle() {
      if (isRunning) return;
      isRunning = true;
      drawIn(function () {
        showThree(function () {
          hideThree(function () {
            retract(function () {
              isRunning = false;
              runCycle();
            });
          });
        });
      });
    }

    if (window.ATCHero3D && canvas) {
      window.ATCHero3D.init(canvas).then(function () {
        setTimeout(runCycle, 200);
      });
    } else {
      // three.js failed to load (offline, blocked CDN, etc.) — the
      // blueprint keeps drawing on its own rather than the hero
      // breaking entirely.
      setTimeout(function () {
        (function loopBlueprintOnly() {
          drawIn(function () {
            retract(loopBlueprintOnly);
          });
        })();
      }, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSVG);
  } else {
    initHeroSVG();
  }
})();
