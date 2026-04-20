// ==========================
// King Insulation — Global JS
// ==========================

/** Util: Global Toast */
function showToast(msg, type) {
  const el = document.getElementById('globalToast');
  const body = document.getElementById('globalToastBody');
  if (!el || !body) return;
  body.textContent = msg || 'Done.';
  el.className = 'toast align-items-center border-0 ' + (type === 'error' ? 'text-bg-danger' : 'text-bg-dark');
  bootstrap.Toast.getOrCreateInstance(el, { delay: 2800 }).show();
}

// Update copyright year
(function setYear() {
  const y = new Date().getFullYear();
  document.querySelectorAll('#year').forEach(el => el.textContent = y);
})();

// Header shrink + active link
(function headerFX() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const pageAttr = document.documentElement.getAttribute('data-page') || '';
  const map = { home: 'index.html', about: 'about.html', services: 'services.html', projects: 'projects.html', contact: 'contact.html' };
  const current = map[pageAttr];
  if (current) {
    document.querySelectorAll('.navbar .nav-link').forEach(a => {
      if (a.getAttribute('href')?.includes(current)) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }
})();

// Scroll progress bar
(function scrollProgress() {
  const bar = document.querySelector('#scrollProgress span');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = Math.min(100, pct) + '%';
  };
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// Back to top button
(function toTop() {
  const btn = document.getElementById('toTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Smooth scroll with fixed-header offset
(function anchorOffset() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('siteHeader')?.offsetHeight || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH - 8, behavior: 'smooth' });
    });
  });
})();

// Testimonials carousel autoplay
(function autoCarousel() {
  const el = document.querySelector('#depoCarousel');
  if (!el) return;
  new bootstrap.Carousel(el, { interval: 5500, ride: 'carousel', pause: 'hover', touch: true, wrap: true });
})();

// Project gallery modal + keyboard navigation
(function galleryModal() {
  const modalEl = document.getElementById('galleryModal');
  if (!modalEl) return;
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalTitle = document.getElementById('galleryModalLabel');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    if (!img) return;
    modalImg.src = img.src;
    modalImg.alt = img.alt || 'Project';
    const caption = item.getAttribute('data-caption') || img.alt || '';
    if (modalCaption) modalCaption.textContent = caption;
    if (modalTitle) modalTitle.textContent = caption;
    bsModal.show();
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', e => { e.preventDefault(); openAt(idx); });
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAt(idx); }
    });
  });

  modalEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
  });

  document.getElementById('modalPrev')?.addEventListener('click', () => openAt(currentIndex - 1));
  document.getElementById('modalNext')?.addEventListener('click', () => openAt(currentIndex + 1));
})();

// Project filters
(function projectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#galleryGrid [data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      let visible = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.parentElement.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const announce = document.getElementById('filterAnnounce');
      if (announce) announce.textContent = `${visible} project${visible !== 1 ? 's' : ''} shown.`;
    });
  });
})();

// Contact form validation + simulated submission
(function contactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Phone mask (US format)
  const telInput = form.querySelector('#phone');
  if (telInput) {
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 10);
      if (v.length > 6) v = `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
      else if (v.length > 3) v = `(${v.slice(0, 3)}) ${v.slice(3)}`;
      else if (v.length) v = `(${v}`;
      telInput.value = v;
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      form.querySelector(':invalid')?.focus();
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    setTimeout(() => {
      const status = document.getElementById('formStatus');
      if (status) {
        status.classList.remove('d-none');
        status.classList.add('text-success');
        status.textContent = '✓ Message sent! We will get back to you within 24 hours.';
      }
      showToast('Message sent successfully!');
      setTimeout(() => {
        form.reset();
        form.classList.remove('was-validated');
        if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
        if (status) { status.classList.add('d-none'); status.classList.remove('text-success'); }
      }, 3000);
    }, 900);
  }, false);
})();

// Copy contact info buttons
(function copyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(value);
        showToast('Copied: ' + value);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copied: ' + value);
      }
    });
  });
})();

// Reveal on scroll (IntersectionObserver)
(function revealOnScroll() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  els.forEach(el => io.observe(el));
})();

// Animated counters with easeOutCubic
(function counters() {
  const els = document.querySelectorAll('.metric-number[data-count]');
  if (!els.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animate(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.floor(easeOut(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

// Subtle hero parallax on mousemove
(function heroParallax() {
  const hero = document.querySelector('[data-parallax]');
  const bg = document.querySelector('.hero-bg');
  if (!hero || !bg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = null, targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  function loop() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    bg.style.transform = `translate(${currentX * 12}px, ${currentY * 12}px) scale(1.03)`;
    const done = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
    raf = done ? null : requestAnimationFrame(loop);
  }
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    targetX = (e.clientX - r.width / 2) / r.width;
    targetY = (e.clientY - r.height / 2) / r.height;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  hero.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
})();

// Preloader
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) setTimeout(() => pre.classList.add('hide'), 200);
});

// ==========================
// PROFESSIONAL FEATURES
// ==========================

// Announcement bar dismiss
(function announceBanner() {
  const bar = document.getElementById('announceBar');
  const btn = document.getElementById('announceClose');
  if (!bar) return;
  if (sessionStorage.getItem('announce_dismissed')) { bar.classList.add('dismissed'); return; }
  if (btn) btn.addEventListener('click', () => {
    bar.classList.add('dismissed');
    sessionStorage.setItem('announce_dismissed', '1');
  });
})();

// Cookie / Privacy banner
(function cookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('cookie_consent')) return;
  setTimeout(() => banner.classList.add('visible'), 1200);
  function dismiss(val) { localStorage.setItem('cookie_consent', val); banner.classList.remove('visible'); }
  document.getElementById('cookieAccept')?.addEventListener('click', () => dismiss('accepted'));
  document.getElementById('cookieDecline')?.addEventListener('click', () => dismiss('declined'));
})();

// Mobile sticky CTA — hides when footer is visible
(function mobileCTA() {
  const bar = document.querySelector('.mobile-cta-bar');
  if (!bar) return;
  document.body.classList.add('has-mobile-cta');
  const hideTarget = document.querySelector('.site-footer');
  if (!hideTarget) return;
  new IntersectionObserver(entries => {
    bar.classList.toggle('hide', entries[0].isIntersecting);
  }, { threshold: 0.05 }).observe(hideTarget);
})();

// Close mobile nav on link click
(function navAutoClose() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  nav.querySelectorAll('a, button:not(.navbar-toggler)').forEach(el => {
    el.addEventListener('click', () => {
      if (window.innerWidth < 992 && nav.classList.contains('show')) {
        document.querySelector('[data-bs-target="#mainNav"]')?.click();
      }
    });
  });
})();

// Hero typing effect
(function typedHero() {
  const el = document.getElementById('typedWord');
  if (!el) return;
  const words = ['homes.', 'businesses.', 'industries.', 'your project.'];
  let wi = 0, ci = 0, deleting = false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = words[0]; el.style.borderRight = 'none'; return;
  }
  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 85);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 300); return; }
      setTimeout(tick, 48);
    }
  }
  tick();
})();

// Image fade-in on load
(function imageFadeIn() {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete && img.naturalWidth > 0) { img.classList.add('img-loaded'); return; }
    img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
    img.addEventListener('error', () => img.classList.add('img-loaded'), { once: true });
  });
})();

// Character counter for message textarea
(function charCounter() {
  const ta = document.getElementById('message');
  const display = document.getElementById('messageCounter');
  if (!ta || !display) return;
  const MAX = 600;
  ta.setAttribute('maxlength', MAX);
  function update() {
    const len = ta.value.length;
    display.textContent = `${len} / ${MAX}`;
    display.className = 'char-counter' + (len >= MAX ? ' at-limit' : len >= MAX * .85 ? ' near-limit' : '');
  }
  ta.addEventListener('input', update);
  update();
})();

// Smooth page transitions
(function pageTransition() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || link.getAttribute('target') === '_blank') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 220);
    });
  });
  window.addEventListener('pageshow', () => overlay.classList.remove('active'));
})();

// Initialize Bootstrap tooltips
(function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
})();
