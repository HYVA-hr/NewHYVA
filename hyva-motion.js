/* HYVA motion layer — additive only. No app logic, IDs or Firebase code is
   touched. Safe to remove: delete the <script> tag from the pages. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* 1. Branded splash loader (shown instantly, hidden once page is ready) */
  var splash = null, shownAt = Date.now();
  try {
    if (!reduce) {
      splash = document.createElement('div');
      splash.id = 'hy-splash';
      splash.setAttribute('aria-hidden', 'true');
      splash.innerHTML = '<div class="hy-orbit"><i></i><i></i><i></i></div>' +
        '<div class="hy-splash-text">Hire Your VA</div><div class="hy-bar"><b></b></div>';
      root.appendChild(splash);
    }
  } catch (e) {}

  function hideSplash() {
    if (!splash) return;
    var wait = Math.max(0, 650 - (Date.now() - shownAt));
    setTimeout(function () {
      splash.classList.add('hy-out');
      setTimeout(function () { if (splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 700);
    }, wait);
  }
  if (document.readyState === 'complete') hideSplash();
  else window.addEventListener('load', hideSplash);
  setTimeout(hideSplash, 3500); /* failsafe: never block the app */

  /* 2. Status-bar colour for installed PWA / mobile browsers */
  try {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', '#18251D');
  } catch (e) {}

  /* 3. Button ripple (delegated, passive — never prevents default) */
  document.addEventListener('pointerdown', function (ev) {
    try {
      var b = ev.target.closest && ev.target.closest('button, .btn-back, .cal-btn');
      if (!b || b.disabled || reduce) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'hy-ripple';
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (ev.clientX - r.left - d / 2) +
        'px;top:' + (ev.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 700);
    } catch (e) {}
  }, { passive: true });

  /* 4. Auto-style "Loading… / Fetching… / Syncing…" placeholders with a spinner.
        Only adds/removes a CSS class; text and visibility are left to the app. */
  var LOAD_RE = /^\s*(loading|fetching|syncing)\b/i;
  var SKIP = { welcomeMsg: 1, monthYearDisplay: 1, loadingOverlay: 1 };
  function tagLoading(el) {
    if (!el || el.nodeType !== 1 || SKIP[el.id]) return;
    if (!/^(P|DIV|SPAN)$/.test(el.tagName) || el.children.length) return;
    var on = LOAD_RE.test(el.textContent || '');
    if (on !== el.classList.contains('hy-loading-line')) el.classList.toggle('hy-loading-line', on);
  }
  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    tagLoading(node);
    var all = node.querySelectorAll ? node.querySelectorAll('p, div, span') : [];
    for (var i = 0; i < all.length; i++) tagLoading(all[i]);
  }

  /* 5. Busy state for submit buttons the app disables while working
        (e.g. "Creating…", "Saving…"). Cosmetic only. */
  function tagBusy(btn) {
    if (!btn.matches || !btn.matches('button.submit-btn, button.login-btn')) return;
    var busy = btn.disabled && /(ing\b|\.\.\.|…)/i.test(btn.textContent || '');
    if (busy !== btn.classList.contains('hy-busy')) btn.classList.toggle('hy-busy', busy);
  }

  function init() {
    try {
      scan(document.body);
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var mu = muts[i], t = mu.target;
          if (mu.type === 'attributes') { tagBusy(t); continue; }
          if (mu.type === 'characterData') { tagLoading(t.parentElement); var bt = t.parentElement; if (bt) tagBusy(bt); continue; }
          if (t.nodeType === 1) { tagLoading(t); tagBusy(t); }
          for (var j = 0; j < mu.addedNodes.length; j++) scan(mu.addedNodes[j]);
        }
      });
      mo.observe(document.body, { childList: true, subtree: true, characterData: true,
                                  attributes: true, attributeFilter: ['disabled'] });
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
