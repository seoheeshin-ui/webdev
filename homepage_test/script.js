/* ---------- Sticky nav: fades to white in proportion to scroll (100% at the end of the hero) ---------- */
(function () {
  var nav = document.querySelector('.nav');
  var hero = document.querySelector('.hero');
  if (!nav) return;
  var end = 1;
  function measure() {
    // distance at which the nav reaches the bottom edge of the hero
    end = hero ? hero.getBoundingClientRect().bottom + window.scrollY - nav.offsetHeight : 400;
    if (end < 1) end = 1;
  }
  function onScroll() {
    var p = Math.min(1, Math.max(0, window.scrollY / end));
    nav.style.setProperty('--p', p.toFixed(3));
    nav.classList.toggle('scrolled', p > 0.5);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  window.addEventListener('load', function () { measure(); onScroll(); });
  measure(); onScroll();
})();

/* ---------- Top banner marquee (md / sm): constant 25px per second ---------- */
(function () {
  var SPEED = 25; // px / s
  var track = document.querySelector('.top-banner .track');
  if (!track) return;
  var first = track.querySelector('.item');
  function update() {
    // one loop = width of one item (text + trailing gap), so seconds = px / speed
    var w = first.getBoundingClientRect().width;
    if (w > 0) track.style.setProperty('--marquee-dur', (w / SPEED).toFixed(2) + 's');
  }
  update();
  window.addEventListener('resize', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();

/* ---------- session_5: environment tabs -> card + architecture ---------- */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs .tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.env-panel'));
  var bar = document.getElementById('env-progress');
  if (!tabs.length) return;

  var current = 0;
  function select(i, focus) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p, k) {
      var on = k === i;
      p.hidden = !on;
      p.classList.remove('enter');
      if (on) { void p.offsetWidth; p.classList.add('enter'); }
    });
    current = i;
    if (bar) { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); }
    if (focus) tabs[i].focus();
  }
  if (bar) bar.addEventListener('animationend', function () { select((current + 1) % tabs.length); });
  select(0);
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, k = null;
      if (e.key === 'ArrowRight') k = (i + 1) % n;
      else if (e.key === 'ArrowLeft') k = (i - 1 + n) % n;
      else if (e.key === 'Home') k = 0;
      else if (e.key === 'End') k = n - 1;
      if (k !== null) { e.preventDefault(); select(k, true); }
    });
  });
})();

/* ---------- session_10: FAQ accordion (btn_icon toggles the answer) ---------- */
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item = btn.parentElement;
    var open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});

/* ---------- session_1-9: fade in + rise 10px when scrolled into view ---------- */
(function () {
  var secs = Array.prototype.slice.call(document.querySelectorAll('main > section:not(.hero)')).slice(0, 9);
  if (!secs.length || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  var items = [];
  secs.forEach(function (s) {
    var kids = Array.prototype.slice.call(s.children);
    // sections wrapped in a single container: reveal that container's children instead
    if (kids.length === 1 && kids[0].children.length > 1) kids = Array.prototype.slice.call(kids[0].children);
    kids.forEach(function (k) { k.classList.add('reveal'); items.push(k); });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
