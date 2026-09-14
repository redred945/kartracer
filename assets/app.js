(function () {

  // sticky header — becomes a floating pill once scrolled
  var bar = document.querySelector('header.bar');
  if (bar) {
    var onScroll = function () { bar.classList.toggle('is-float', window.scrollY > 60); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // burger menu (mobile)
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (b && n) {
    b.addEventListener('click', function () {
      var open = n.classList.toggle('is-open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    n.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { n.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); }
    });
  }

  // hide the "Appeler" bubble once the footer (which already shows the number) is on screen
  var fab = document.querySelector('.call-fab');
  var footerEl = document.querySelector('footer');
  if (fab && footerEl && 'IntersectionObserver' in window) {
    var fabIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { fab.classList.toggle('is-hidden', en.isIntersecting); });
    }, { rootMargin: '0px', threshold: 0 });
    fabIo.observe(footerEl);
  }

  // generic mobile slider: horizontal scroll-snap track with optional dot indicators and optional
  // auto-advance. Originally built just for .stats__grid; reused (without auto-advance) for any
  // section whose card grid collapses to a long single-column stack on phones (bento, why-grid,
  // formules, packs) — same swipe/scroll-snap mechanism, dots stay in sync with the active slide.
  var setupSlider = function (grid, opts) {
    if (!grid) return;
    opts = opts || {};
    var dotsWrap = opts.dotsSelector && grid.parentElement ? grid.parentElement.querySelector(opts.dotsSelector) : null;
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll('span')) : [];
    var setActiveDot = function (idx) {
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    };
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = function () { return window.matchMedia('(max-width: 560px)').matches; };
    var timer = null;
    var stopAuto = function () { if (timer) { clearInterval(timer); timer = null; } };
    var startAuto = function () {
      if (!opts.auto || timer || reduced || !isMobile()) return;
      timer = setInterval(function () {
        var items = grid.children;
        var w = grid.clientWidth;
        if (!items.length || !w) return;
        var idx = Math.round(grid.scrollLeft / w);
        var nextIdx = (idx + 1) % items.length;
        grid.scrollTo({ left: nextIdx * w, behavior: 'smooth' });
      }, opts.interval || 2800);
    };
    startAuto();
    var resumeTimeout;
    var pauseAuto = function () {
      stopAuto();
      if (opts.auto) { clearTimeout(resumeTimeout); resumeTimeout = setTimeout(startAuto, 4000); }
    };
    grid.addEventListener('pointerdown', pauseAuto);
    grid.addEventListener('touchstart', pauseAuto, { passive: true });
    var scrollTimeout;
    grid.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var w = grid.clientWidth;
        if (w && dots.length) setActiveDot(Math.round(grid.scrollLeft / w));
      }, 80);
    }, { passive: true });
    window.addEventListener('resize', function () { stopAuto(); startAuto(); });
  };

  // stats strip: glanceable numbers, auto-advances on its own, pauses briefly if the visitor swipes it
  setupSlider(document.querySelector('.stats__grid'), { dotsSelector: '.stats__dots', auto: true });
  // bento, why-grid, formules (heavy usages only) and packs: real content to read/compare,
  // so these swipe on demand but never auto-advance
  setupSlider(document.querySelector('.bento'), { dotsSelector: '.bento__dots' });
  Array.prototype.slice.call(document.querySelectorAll('.why-grid')).forEach(function (el) {
    setupSlider(el, { dotsSelector: '.why-grid__dots' });
  });
  Array.prototype.slice.call(document.querySelectorAll('.formules--slide')).forEach(function (el) {
    setupSlider(el, { dotsSelector: '.formules__dots' });
  });
  setupSlider(document.querySelector('.packs'), { dotsSelector: '.packs__dots' });

  // scrollspy — lights up the header nav link for the section currently in view.
  // Only meaningful on the homepage, where a few nav links point to in-page anchors;
  // on other pages every nav link points off-page so there is nothing to spy on.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.bar__nav a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var spySections = navLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (spySections.length) {
      var setActiveNav = function (id) {
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
      };
      var spyIo = new IntersectionObserver(function (entries) {
        var best = null;
        entries.forEach(function (en) {
          if (en.isIntersecting && (!best || en.intersectionRatio > best.intersectionRatio)) best = en;
        });
        if (best) setActiveNav(best.target.id);
      }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
      spySections.forEach(function (el) { spyIo.observe(el); });
    }
  }

  // animated counters — numbers count up from 0 once their stat/badge scrolls into view.
  // The final value is always the element's original text, so with reduced motion (or if
  // IntersectionObserver is missing) the page already shows the right number and nothing else runs.
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  var reduceCounters = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counters.length && !reduceCounters && 'IntersectionObserver' in window) {
    var easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
    var formatCount = function (value, decimals) {
      var s = value.toFixed(decimals);
      return decimals > 0 ? s.replace('.', ',') : s;
    };
    var runCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var decimals = el.hasAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
      var duration = 1300;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        el.textContent = formatCount(target * easeOutCubic(p), decimals);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); counterIo.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.4 });
    counters.forEach(function (el) { counterIo.observe(el); });
  }

  // highlight today's row in the opening-hours table
  var hoursTable = document.getElementById('hoursTable');
  if (hoursTable) {
    var today = new Date().getDay(); // 0 = Sunday .. 6 = Saturday
    var row = hoursTable.querySelector('tr[data-day="' + today + '"]');
    if (row) row.classList.add('is-today');
  }

  // contact form — posts to Web3Forms once a key is set, otherwise opens the mail app
  var cform = document.getElementById('cform');
  if (cform) {
    var cstatus = document.getElementById('cformStatus');
    var val = function (name) { var el = cform.elements[name]; return el ? String(el.value || '').trim() : ''; };
    var mailtoFallback = function () {
      var body = 'Nom : ' + val('nom') +
        '\nTéléphone : ' + val('telephone') +
        '\nE-mail : ' + val('email') +
        '\nSujet : ' + val('sujet') +
        '\n\n' + val('message');
      window.location.href = 'mailto:contact@kartracer.fr?subject=' +
        encodeURIComponent('Demande via kartracer.fr') +
        '&body=' + encodeURIComponent(body);
    };
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof cform.reportValidity === 'function' && !cform.reportValidity()) return;
      var key = val('access_key');
      if (!key || key.indexOf('VOTRE_CLE') !== -1) { mailtoFallback(); return; }
      if (cstatus) { cstatus.className = 'cform__status'; cstatus.textContent = 'Envoi en cours…'; }
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(cform)
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.success) throw new Error('fail');
        cform.reset();
        if (cstatus) { cstatus.className = 'cform__status is-ok'; cstatus.textContent = 'Merci, votre demande est bien partie. On vous recontacte très vite.'; }
      }).catch(function () {
        if (cstatus) { cstatus.className = 'cform__status is-err'; cstatus.textContent = 'L’envoi automatique a échoué — on ouvre votre messagerie pour envoyer la demande.'; }
        setTimeout(mailtoFallback, 1200);
      });
    });
  }

  // reveal-on-scroll
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var showAll = function () { items.forEach(function (el) { el.classList.add('in'); }); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window) || !items.length) { showAll(); return; }

  document.documentElement.classList.add('reveal-on');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) { el.classList.add('in'); }
    else { io.observe(el); }
  });
  window.addEventListener('load', function () { setTimeout(showAll, 1400); });
})();
