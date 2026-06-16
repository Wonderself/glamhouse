/* MYGLAMHOUSE — Modern Edition · interactions */
(function () {
  'use strict';

  /* ---- Nav: solid on scroll ---- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('solid', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Burger + mobile menu ---- */
  const burger = document.querySelector('.burger');
  const mobile = document.querySelector('.mobile-menu');
  if (burger && mobile) {
    const toggle = (open) => {
      burger.classList.toggle('open', open);
      mobile.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => toggle(!mobile.classList.contains('open')));
    mobile.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
  }

  /* ---- Scroll reveal ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---- Counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const dur = 1500;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---- Progress bars (animate width when visible) ---- */
  const bars = document.querySelectorAll('.progress__fill[data-pct]');
  if ('IntersectionObserver' in window && bars.length) {
    const bio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.style.width = e.target.dataset.pct + '%';
          bio.unobserve(e.target);
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((el) => {
      el.style.width = '0%';
      bio.observe(el);
    });
  }

  /* ---- Loader intro ---- */
  const loader = document.getElementById('loader');
  if (loader) {
    const pct = loader.querySelector('[data-loader]');
    const bar = loader.querySelector('.loader__bar i');
    let v = 0;
    const iv = setInterval(() => {
      v += Math.max(1, Math.round((100 - v) * 0.12));
      if (v >= 100) { v = 100; clearInterval(iv); setTimeout(() => loader.classList.add('done'), 350); }
      if (pct) pct.textContent = v + '%';
      if (bar) bar.style.right = (100 - v) + '%';
    }, 90);
    // failsafe
    setTimeout(() => loader.classList.add('done'), 4200);
  }

  /* ---- Tabs ---- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = group.querySelectorAll('.tab');
    const panels = group.querySelectorAll('.tab-panel');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = group.querySelector('#' + tab.dataset.target);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* ---- Lightbox ---- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    document.querySelectorAll('.zoomable').forEach((el) => {
      el.addEventListener('click', () => {
        img.src = el.currentSrc || el.src;
        lb.classList.add('open');
      });
    });
    const close = () => lb.classList.remove('open');
    lb.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ---- Locale clock (vibe sutera) ---- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const tick = () => {
      const t = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      clock.textContent = 'FR · ' + t;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---- Forms: graceful fake submit ---- */
  document.querySelectorAll('form[data-fake]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit], button:not([type])');
      if (btn) {
        const old = btn.textContent;
        btn.textContent = 'Envoyé ✓';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = old; btn.disabled = false; form.reset(); }, 2600);
      }
    });
  });
})();
