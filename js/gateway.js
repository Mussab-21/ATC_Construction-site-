/* gateway.js — Welcome Service Division Selection Modal */
(function () {
  'use strict';

  function initGatewayModal() {
    const modalOverlay = document.getElementById('gateway-modal');
    if (!modalOverlay) return;

    const btnClose = document.getElementById('gateway-close');
    const btnSkip = document.getElementById('gateway-skip');
    const cardConstruction = document.getElementById('gateway-opt-construction');
    const cardTrading = document.getElementById('gateway-opt-trading');

    function openModal() {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigateToSection(sectionId) {
      closeModal();
      const target = document.getElementById(sectionId);
      if (target) {
        setTimeout(() => {
          const vh = window.innerHeight;
          // Position so that ~10% of previous section is visible above, 80% current section, and 10% next section peeks below
          const peekOffset = Math.round(vh * 0.10);
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - peekOffset;
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });

          // Add highlight pulse
          target.classList.remove('section-target-glow');
          void target.offsetWidth; // trigger reflow
          target.classList.add('section-target-glow');
        }, 150);
      }
    }

    // Auto-open modal on page load
    setTimeout(openModal, 400);

    // Event listeners
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnSkip) btnSkip.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    if (cardConstruction) {
      cardConstruction.addEventListener('click', () => {
        navigateToSection('engineering-divisions');
      });
      cardConstruction.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToSection('engineering-divisions');
        }
      });
    }

    if (cardTrading) {
      cardTrading.addEventListener('click', () => {
        navigateToSection('trading-services');
      });
      cardTrading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateToSection('trading-services');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGatewayModal);
  } else {
    initGatewayModal();
  }
})();
