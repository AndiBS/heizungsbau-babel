/* Consent-Banner + Google Consent Mode v2 + Tag Manager (lädt erst nach Zustimmung) */
(function () {
  var GTM_ID = 'GTM-NXPQMFT5';
  var KEY = 'hb_consent_v1';
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied', security_storage: 'granted',
    wait_for_update: 500
  });

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGTM() {
    if (window.__hbGtmLoaded) return;
    window.__hbGtmLoaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
    // gepufferte Events nachreichen, sobald der Container steht
    s.addEventListener('load', function () { pending.forEach(function (e) { dataLayer.push(e); }); pending = []; });
  }
  var pending = [];

  function hide() { var b = document.getElementById('hb-consent'); if (b) b.remove(); }

  function accept() { write('granted'); hide(); loadGTM(); }
  function decline() { write('denied'); hide(); }

  function banner() {
    if (document.getElementById('hb-consent')) return;
    var d = document.createElement('div');
    d.id = 'hb-consent';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Cookie-Hinweis');
    d.innerHTML =
      '<div class="hbc-box">' +
      '<p><b>Dürfen wir messen, wie unsere Website genutzt wird?</b> Wir verwenden Google Analytics nur mit Ihrer Zustimmung, um zu verstehen, welche Inhalte hilfreich sind. Ohne Zustimmung werden keine Cookies gesetzt. Details in der <a href="/datenschutz/">Datenschutzerklärung</a>.</p>' +
      '<div class="hbc-btns"><button type="button" class="hbc-accept">Zustimmen</button><button type="button" class="hbc-decline">Ablehnen</button></div>' +
      '</div>';
    document.body.appendChild(d);
    d.querySelector('.hbc-accept').addEventListener('click', accept);
    d.querySelector('.hbc-decline').addEventListener('click', decline);
  }

  // Events in den dataLayer (werden nur verarbeitet, wenn GTM geladen ist)
  function track(name, label) {
    var e = { event: name, label: label || '' };
    if (window.google_tag_manager && window.google_tag_manager[GTM_ID]) dataLayer.push(e); else pending.push(e);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('wa.me') > -1) track('whatsapp_click', (a.textContent || '').trim().slice(0, 60));
    else if (h.indexOf('tel:') === 0) track('phone_click', '');
  }, true);
  if (location.pathname.indexOf('/danke') === 0) track('anfrage_gesendet', '');

  // Link "Cookie-Einstellungen" im Footer: Banner erneut öffnen
  window.hbOpenConsent = function () { banner(); };

  var c = read();
  if (c === 'granted') loadGTM();
  else if (c !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
  }
})();
