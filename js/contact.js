/* contact.js — EmailJS form submission + validation */
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  // Pre-fill service dropdown if URL param exists
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (serviceParam) {
    const select = form.querySelector('#service-division');
    if (select) {
      for (const opt of select.options) {
        if (opt.value.toLowerCase().includes(serviceParam.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }

  function showError(fieldId, msg) {
    const el = document.getElementById(`${fieldId}-error`);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function clearErrors() {
    form.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  function validate() {
    clearErrors();
    let valid = true;

    const name = form.querySelector('#name');
    const company = form.querySelector('#company');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    if (!name.value.trim()) { showError('name', 'Name is required.'); valid = false; }
    if (!company.value.trim()) { showError('company', 'Company name is required.'); valid = false; }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError('email', 'Please enter a valid email address.'); valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 20) {
      showError('message', 'Please describe your project (at least 20 characters).'); valid = false;
    }

    return valid;
  }

  function showSuccess() {
    const successEl = document.getElementById('form-success');
    if (successEl) {
      successEl.style.display = 'block';
      const checkSvg = successEl.querySelector('.check-svg');
      if (checkSvg) setTimeout(() => checkSvg.classList.add('animate'), 100);
    }
    form.style.display = 'none';
  }

  function showSubmitState(loading) {
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      btn.disabled = loading;
      btn.textContent = loading ? 'Sending…' : 'Send Inquiry';
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    showSubmitState(true);

    // Honeypot check
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value) { showSuccess(); return; }

    // EmailJS — replace with your service/template IDs
    if (typeof emailjs !== 'undefined') {
      const templateParams = {
        from_name:    form.querySelector('#name').value.trim(),
        from_company: form.querySelector('#company').value.trim(),
        from_email:   form.querySelector('#email').value.trim(),
        service:      form.querySelector('#service-division').value,
        scope:        (form.querySelector('#scope') || {}).value || '',
        message:      form.querySelector('#message').value.trim(),
      };

      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(() => { showSuccess(); })
        .catch(() => {
          showSubmitState(false);
          showError('message', 'Failed to send. Please try emailing us directly.');
        });
    } else {
      // Fallback: just show success (dev mode)
      setTimeout(() => { showSuccess(); }, 800);
    }
  });

})();
