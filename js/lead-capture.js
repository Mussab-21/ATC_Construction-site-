/**
 * js/lead-capture.js
 * Lead Capture Form & Mobile Sticky Contact Bar
 * 
 * Instructions:
 * - FORM_ENDPOINT: If empty, opens prefilled WhatsApp message. If set, POSTs via fetch.
 * - WHATSAPP_PHONE & CALL_PHONE: Owner constants with TODOs.
 */

// TODO(owner): Set form endpoint URL (e.g. Formspree, Make.com webhook, or company API) when ready.
const FORM_ENDPOINT = '';

// TODO(owner): Confirm primary verified telephone and WhatsApp number (country code + number, no spaces or + for wa.me).
const WHATSAPP_PHONE = '923000000000'; // Example: 923001234567
const CALL_PHONE = '+92510000000';

(function () {
  'use strict';

  function initLeadForm() {
    const form = document.getElementById('project-lead-form');
    if (!form) return;

    const statusEl = document.getElementById('lead-form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Pre-fill project type if URL hash or parameter contains it
    const urlParams = new URLSearchParams(window.location.search);
    const hashType = window.location.hash.includes('?type=') ? window.location.hash.split('?type=')[1] : null;
    const typeParam = urlParams.get('type') || hashType;
    if (typeParam) {
      const typeSelect = form.querySelector('#lead-project-type');
      if (typeSelect) {
        for (let opt of typeSelect.options) {
          if (opt.value.toLowerCase().includes(typeParam.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // 1. Honeypot check
      const honeypot = form.querySelector('input[name="company_website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        // Spam detected, quietly return success
        form.reset();
        if (statusEl) {
          statusEl.className = 'lead-form-status is-success';
          statusEl.textContent = 'Thank you! Your inquiry has been received.';
        }
        return;
      }

      // 2. Client-side validation
      const name = form.querySelector('#lead-name')?.value.trim();
      const phone = form.querySelector('#lead-phone')?.value.trim();
      const email = form.querySelector('#lead-email')?.value.trim();
      const projectType = form.querySelector('#lead-project-type')?.value;
      const description = form.querySelector('#lead-description')?.value.trim();

      if (!name || !phone || !projectType) {
        if (statusEl) {
          statusEl.className = 'lead-form-status is-error';
          statusEl.textContent = 'Please fill in all required fields (Full Name, Phone / WhatsApp, and What do you need).';
        }
        return;
      }

      // Optional email check
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusEl) {
          statusEl.className = 'lead-form-status is-error';
          statusEl.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      const payload = {
        name,
        phone,
        email: email || 'Not provided',
        projectType,
        description: description || 'No additional details provided',
        timestamp: new Date().toISOString()
      };

      if (FORM_ENDPOINT) {
        // Submit via POST
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending Inquiry...';
        }

        try {
          const resp = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (resp.ok) {
            form.reset();
            if (statusEl) {
              statusEl.className = 'lead-form-status is-success';
              statusEl.textContent = 'Inquiry submitted successfully! An ATC engineering director will contact you within 24 business hours.';
            }
          } else {
            throw new Error('Server responded with an error');
          }
        } catch (err) {
          if (statusEl) {
            statusEl.className = 'lead-form-status is-error';
            statusEl.textContent = 'Submission error. Please email us directly at info@atc-pk.com or message our WhatsApp desk.';
          }
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `Send Inquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
          }
        }
      } else {
        // No backend endpoint set: open prefilled WhatsApp message
        const waMsg = encodeURIComponent(
          `*New Inquiry for ATC*\n\n` +
          `*Name:* ${name}\n` +
          `*Phone:* ${phone}\n` +
          (email ? `*Email:* ${email}\n` : '') +
          `*Service Needed:* ${projectType}\n` +
          (description ? `*Message:* ${description}` : '')
        );
        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${waMsg}`;

        if (statusEl) {
          statusEl.className = 'lead-form-status is-success';
          statusEl.textContent = 'Redirecting to ATC WhatsApp Engineering Desk...';
        }

        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  function initMobileStickyBar() {
    // Only render on screens <= 768px when constants are available
    if (window.innerWidth > 768) return;

    if (document.getElementById('mobile-sticky-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'mobile-sticky-bar';
    bar.className = 'mobile-sticky-bar';
    bar.setAttribute('aria-label', 'Quick contact actions');
    bar.innerHTML = `
      <a href="tel:${CALL_PHONE}" class="sticky-action-btn sticky-action-btn--call" aria-label="Call ATC Engineering Desk">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.5 19.79 19.79 0 0 1 1 2.18 2 2 0 0 1 3 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span>Call</span>
      </a>
      <a href="https://wa.me/${WHATSAPP_PHONE}" target="_blank" rel="noopener noreferrer" class="sticky-action-btn sticky-action-btn--wa" aria-label="Message ATC on WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        <span>WhatsApp</span>
      </a>
      <a href="#inquiry-panel" class="sticky-action-btn sticky-action-btn--quote" aria-label="Request Engineering Quote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        <span>Get Quote</span>
      </a>
    `;

    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLeadForm();
      initMobileStickyBar();
    });
  } else {
    initLeadForm();
    initMobileStickyBar();
  }

  window.addEventListener('resize', () => {
    const existing = document.getElementById('mobile-sticky-bar');
    if (window.innerWidth <= 768 && !existing) {
      initMobileStickyBar();
    } else if (window.innerWidth > 768 && existing) {
      existing.remove();
    }
  });
})();
