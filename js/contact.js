/* contact.js — EmailJS form submission + validation */
(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  if (!form) return;

  // Pre-fill service dropdown if URL param exists (support ?service= and ?subject=)
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service') || params.get('subject');
  if (serviceParam) {
    const select = form.querySelector('#service-division');
    if (select) {
      const raw = serviceParam.trim().toLowerCase();
      const slugMap = {
        'design': 'Design & Engineering',
        'civil': 'Civil & Infrastructure',
        'electrical': 'Electrical, Power & Mechanical',
        'power': 'Electrical, Power & Mechanical',
        'mep': 'Electrical, Power & Mechanical',
        'finishing': 'Finishing Works',
        'security': 'Security, Smart & IT',
        'smart': 'Security, Smart & IT',
        'defense': 'Defense & Operations',
        'oil-gas': 'Oil, Gas & Petroleum',
        'oil': 'Oil, Gas & Petroleum',
        'gas': 'Oil, Gas & Petroleum',
        'petroleum': 'Oil, Gas & Petroleum',
        'industrial-maintenance': 'Industrial & Factory Maintenance',
        'industrial': 'Industrial & Factory Maintenance',
        'maintenance': 'Industrial & Factory Maintenance',
        'consultancy': 'Engineering Consultancy & Advisory',
        'advisory': 'Engineering Consultancy & Advisory',
        'trading': 'Trading & Technical Procurement',
        'procurement': 'Trading & Technical Procurement'
      };

      const matchedTarget = slugMap[raw];
      let matched = false;

      if (matchedTarget) {
        for (const opt of select.options) {
          if (opt.value === matchedTarget) {
            opt.selected = true;
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        for (const opt of select.options) {
          if (opt.value && (opt.value.toLowerCase().includes(raw) || raw.includes(opt.value.toLowerCase()))) {
            opt.selected = true;
            break;
          }
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

  function triggerMailtoFallback(details) {
    const subject = encodeURIComponent(`ATC Inquiry: ${details.service || 'General Project'} — ${details.company}`);
    const body = encodeURIComponent(
      `Name: ${details.name}\n` +
      `Company: ${details.company}\n` +
      `Email: ${details.email}\n` +
      `Service Division: ${details.service}\n` +
      `Project Scope: ${details.scope}\n\n` +
      `Message:\n${details.message}`
    );
    window.location.href = `mailto:info@atc-pk.com?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    showSubmitState(true);

    // Honeypot check
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value) { showSuccess(); return; }

    const inquiryData = {
      name:    form.querySelector('#name').value.trim(),
      company: form.querySelector('#company').value.trim(),
      email:   form.querySelector('#email').value.trim(),
      service: form.querySelector('#service-division').value,
      scope:   (form.querySelector('#scope') || {}).value || '',
      message: form.querySelector('#message').value.trim(),
    };

    // Check if real EmailJS service ID is configured (not placeholder)
    const isLiveService = typeof emailjs !== 'undefined' &&
      window.ATC_EMAILJS_CONFIG &&
      window.ATC_EMAILJS_CONFIG.serviceId &&
      window.ATC_EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID';

    if (isLiveService) {
      const templateParams = {
        from_name:    inquiryData.name,
        from_company: inquiryData.company,
        from_email:   inquiryData.email,
        service:      inquiryData.service,
        scope:        inquiryData.scope,
        message:      inquiryData.message,
      };

      emailjs.send(window.ATC_EMAILJS_CONFIG.serviceId, window.ATC_EMAILJS_CONFIG.templateId, templateParams)
        .then(() => { showSuccess(); })
        .catch(() => {
          showSubmitState(false);
          showError('message', 'Delivery failed. Launching direct email client fallback...');
          setTimeout(() => triggerMailtoFallback(inquiryData), 1000);
        });
    } else {
      // Netlify Forms AJAX submission (with automatic fallback to mailto)
      const formData = new FormData(form);
      if (!formData.get('form-name')) formData.append('form-name', 'contact');

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
      .then(res => {
        showSubmitState(false);
        if (res.ok) {
          showSuccess();
        } else {
          // Non-Netlify / local dev environment fallback
          triggerMailtoFallback(inquiryData);
          showSuccess();
        }
      })
      .catch(() => {
        showSubmitState(false);
        triggerMailtoFallback(inquiryData);
        showSuccess();
      });
    }
  });

})();
