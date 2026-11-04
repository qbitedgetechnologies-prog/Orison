/* Lightweight conversion tracking for orisonigt.com
 *
 * No cookies and no third-party requests are made unless GA4_ID is set below.
 * Events are always pushed to window.dataLayer, so they work with Tag Manager,
 * GA4, Plausible or any other tag manager that reads the data layer.
 *
 * To enable Google Analytics 4: replace the empty string with your measurement
 * ID (for example "G-XXXXXXXXXX"), then update the Privacy Policy to mention
 * analytics cookies before going live.
 */
(function () {
  'use strict';

  var GA4_ID = ''; // e.g. 'G-XXXXXXXXXX'

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  if (GA4_ID) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  function send(event, params) {
    window.dataLayer.push(Object.assign({ event: event }, params));
    if (GA4_ID) gtag('event', event, params);
  }

  function classify(href, el) {
    if (href.indexOf('tel:') === 0) return 'phone';
    if (href.indexOf('mailto:') === 0) return 'email';
    if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp.com') !== -1) return 'whatsapp';
    if (href.indexOf('tiktok.com') !== -1) return 'tiktok';
    if (href.indexOf('instagram.com') !== -1) return 'instagram';
    if (el && el.hasAttribute('data-lang')) return 'language_switch';
    if (href.indexOf('google.com/maps') !== -1) return 'directions';
    return null;
  }

  function whatsappIntent(el) {
    var intent = el.getAttribute('data-wa-intent');
    if (intent) return intent;
    // The triage result builds its own prefilled message.
    if (el.id === 'triageWhatsApp') return 'triage';
    return 'general';
  }

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var method = classify(href, el);
    if (!method) return;
    var params = {
      method: method,
      link_url: href,
      page_location: window.location.href,
      page_language: document.documentElement.lang || 'en'
    };
    if (method === 'whatsapp') params.intent = whatsappIntent(el);
    send('contact_click', params);
  }, { passive: true });

  /* Components that own their own state (for example the repair triage
   * wizard) dispatch this event instead of pushing to the data layer, so
   * GA4 receives the same payload as everything else. */
  document.addEventListener('orison:track', function (e) {
    var detail = e.detail || {};
    if (!detail.event) return;
    send(detail.event, detail.params || {});
  });

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.matches || !form.matches('form.msg')) return;
    send('form_submit', {
      form_id: 'enquiry',
      page_location: window.location.href,
      page_language: document.documentElement.lang || 'en'
    });
  }, true);
})();
