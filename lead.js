/**
 * Image Dental Care — automatic enquiry popup.
 * Opens after one second on the first page viewed in each browser tab.
 * Smooth fade/scale transitions when opening and closing.
 */
(() => {
  'use strict';

  const overlay = document.getElementById('leadOverlay');
  const form = document.getElementById('leadForm');
  if (!overlay || !form) return;

  const OPEN_DELAY_MS = 1000;
  const TRANSITION_MS = 320;
  const SESSION_KEY = 'imageDentalEnquiryShown';

  let previousFocus = null;
  let openTimer = null;
  let closeTimer = null;
  let isClosing = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function showPopup() {
    if (!overlay.hidden) return;

    clearTimeout(closeTimer);
    previousFocus = document.activeElement;
    isClosing = false;
    overlay.hidden = false;
    document.body.classList.add('lead-lock');

    // Two frames allow the browser to paint the starting state before animating.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (overlay.hidden || isClosing) return;
        overlay.classList.add('is-visible');
        overlay.querySelector('.lead-close')?.focus({ preventScroll: true });
      });
    });
  }

  function hidePopup() {
    if (overlay.hidden || isClosing) return;
    isClosing = true;
    overlay.classList.remove('is-visible');

    const finishClosing = () => {
      overlay.hidden = true;
      document.body.classList.remove('lead-lock');
      isClosing = false;
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true });
      }
    };

    clearTimeout(closeTimer);
    closeTimer = setTimeout(finishClosing, reducedMotion.matches ? 0 : TRANSITION_MS);
  }

  // Show only once per tab/session, not after each link or page navigation.
  let shouldAutoOpen = true;
  try {
    shouldAutoOpen = sessionStorage.getItem(SESSION_KEY) !== '1';
    if (shouldAutoOpen) sessionStorage.setItem(SESSION_KEY, '1');
  } catch (_) {
    // Storage can be unavailable in some privacy settings.
  }

  if (shouldAutoOpen) {
    openTimer = setTimeout(showPopup, OPEN_DELAY_MS);
  }

  overlay.querySelectorAll('[data-lead-close]').forEach((element) => {
    element.addEventListener('click', hidePopup);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) hidePopup();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const details = new FormData(form);
    const name = String(details.get('name') || '').trim();
    const phone = String(details.get('phone') || '').trim();
    const service = String(details.get('service') || '').trim();
    const status = form.querySelector('.lead-status');

    if (!/^[+0-9()\s-]{7,20}$/.test(phone)) {
      if (status) status.textContent = 'Please enter a valid phone number.';
      return;
    }

    const message = [
      'Hello Image Dental Care & Implant Centre, I would like to request an appointment.',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Dental concern: ${service}`,
      'Please contact me to confirm availability.'
    ].join('\n');

    const url = 'https://wa.me/919662165644?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener,noreferrer');
    if (status) {
      status.textContent = 'WhatsApp is ready with your details. Tap Send there. Our team will update you about your enquiry soon.';
    }
  });
})();
