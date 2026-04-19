// ==========================
// King Insulation — JS Global (IMERSIVO)
// ==========================

/** Util: Toast global */
function showToast(msg, type){
  const el = document.getElementById('globalToast');
  const body = document.getElementById('globalToastBody');
  if(!el || !body) return;
  body.textContent = msg || 'Ação concluída.';
  el.className = 'toast align-items-center border-0 ' + (type === 'error' ? 'text-bg-danger' : 'text-bg-dark');
  const toast = bootstrap.Toast.getOrCreateInstance(el, { delay: 2800 });
  toast.show();
}

// Atualiza ano no footer
(function setYear(){
  const y = new Date().getFullYear();
  document.querySelectorAll('#year').forEach(el => el.textContent = y);
})();

// Header shrink + active link
(function headerFX(){
  const header = document.getElementById('siteHeader');
  if(!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  const pageAttr = document.documentElement.getAttribute('data-page') || '';
  const map = { home:'index.html', sobre:'sobre.html', servicos:'servicos.html', projetos:'projetos.html', contato:'contato.html' };
  const current = map[pageAttr];
  if(current){
    document.querySelectorAll('.navbar .nav-link').forEach(a => {
      if(a.getAttribute('href')?.includes(current)){
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }
})();

// Scroll progress
(function scrollProgress(){
  const bar = document.querySelector('#scrollProgress span');
  if(!bar) return;
  const update = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = Math.min(100, pct) + '%';
  };
  document.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
  update();
})();

// Botão "voltar ao topo"
(function toTop(){
  const btn = document.getElementById('toTopBtn');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 300);
  }, { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
})();

// Smooth scroll com offset do header fixo para links âncora internos
(function anchorOffset(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if(!id) return;
      const target = document.getElementById(id);
      if(!target) return;
      e.preventDefault();
      const headerH = document.getElementById('siteHeader')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// Carrossel de depoimentos — autoplay suave
(function autoCarousel(){
  const el = document.querySelector('#depoCarousel');
  if(!el) return;
  new bootstrap.Carousel(el, {
    interval: 5500, ride: 'carousel', pause: 'hover', touch: true, wrap: true
  });
})();

// Modal da galeria de projetos + navegação por teclado e setas no modal
(function galleryModal(){
  const modalEl = document.getElementById('galleryModal');
  if(!modalEl) return;
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalTitle = document.getElementById('galleryModalLabel');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if(!items.length) return;
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
  let currentIndex = 0;

  function openAt(index){
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    if(!img) return;
    modalImg.src = img.src;
    modalImg.alt = img.alt || 'Projeto';
    const caption = item.getAttribute('data-caption') || img.alt || '';
    if(modalCaption) modalCaption.textContent = caption;
    if(modalTitle) modalTitle.textContent = caption;
    bsModal.show();
  }

  items.forEach((item, idx) => {
    item.addEventListener('click', (e) => { e.preventDefault(); openAt(idx); });
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openAt(idx); }
    });
  });

  modalEl.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') openAt(currentIndex + 1);
    if(e.key === 'ArrowLeft') openAt(currentIndex - 1);
  });

  // Botões Prev/Next dentro do modal
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  if(prevBtn) prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
  if(nextBtn) nextBtn.addEventListener('click', () => openAt(currentIndex + 1));
})();

// Filtros na página de projetos
(function projectFilters(){
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#galleryGrid [data-category]');
  if(!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      let visible = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        const col = card.parentElement;
        col.style.display = show ? '' : 'none';
        if(show) visible++;
      });
      // Acessibilidade: anunciar número de resultados
      const announce = document.getElementById('filterAnnounce');
      if(announce) announce.textContent = `${visible} projeto${visible !== 1 ? 's' : ''} exibido${visible !== 1 ? 's' : ''}.`;
    });
  });
})();

// Validação e envio (simulado) do formulário de contato + toast
(function contactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  // Máscara de telefone simples
  const telInput = form.querySelector('#telefone');
  if(telInput){
    telInput.addEventListener('input', () => {
      let v = telInput.value.replace(/\D/g, '').slice(0, 11);
      if(v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if(v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if(v.length) v = `(${v}`;
      telInput.value = v;
    });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    e.stopPropagation();

    if(!form.checkValidity()){
      form.classList.add('was-validated');
      const firstInvalid = form.querySelector(':invalid');
      if(firstInvalid) firstInvalid.focus();
      showToast('Por favor, corrija os campos destacados.', 'error');
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    if(btn){ btn.disabled = true; btn.textContent = 'Enviando…'; }

    // Simula latência de rede
    setTimeout(() => {
      const status = document.getElementById('formStatus');
      if(status){
        status.classList.remove('d-none');
        status.classList.add('text-success');
        status.textContent = '✓ Mensagem enviada! Entraremos em contato em breve.';
      }
      showToast('Mensagem enviada com sucesso!');

      setTimeout(() => {
        form.reset();
        form.classList.remove('was-validated');
        if(btn){ btn.disabled = false; btn.textContent = 'Enviar'; }
        if(status){ status.classList.add('d-none'); status.classList.remove('text-success'); }
      }, 3000);
    }, 900);
  }, false);
})();

// Copiar contato (e-mail/telefone)
(function copyButtons(){
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      try{
        await navigator.clipboard.writeText(value);
        showToast('Copiado: ' + value);
      } catch {
        // Fallback para ambientes sem Clipboard API
        const ta = document.createElement('textarea');
        ta.value = value; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Copiado: ' + value);
      }
    });
  });
})();

// Reveal on scroll (IntersectionObserver)
(function revealOnScroll(){
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if(!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced || !('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('revealed'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => io.observe(el));
})();

// Métricas: contadores animados com easeOutCubic
(function counters(){
  const els = document.querySelectorAll('.metric-number[data-count]');
  if(!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

  function animate(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if(prefersReduced){ el.textContent = target + suffix; return; }
    const duration = 1100;
    const start = performance.now();
    function tick(now){
      const progress = Math.min(1, (now - start) / duration);
      const val = Math.floor(easeOutCubic(progress) * target);
      el.textContent = val + suffix;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();

// Parallax sutil no hero (mousemove) — respeita prefers-reduced-motion
(function heroParallax(){
  const hero = document.querySelector('[data-parallax]');
  const bg = document.querySelector('.hero-bg');
  if(!hero || !bg) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced) return;

  let raf = null;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  function loop(){
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    bg.style.transform = `translate(${currentX * 12}px, ${currentY * 12}px) scale(1.03)`;
    const done = Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
    raf = done ? null : requestAnimationFrame(loop);
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetX = (e.clientX - rect.width / 2) / rect.width;
    targetY = (e.clientY - rect.height / 2) / rect.height;
    if(!raf) raf = requestAnimationFrame(loop);
  }, { passive:true });

  hero.addEventListener('mouseleave', () => {
    targetX = 0; targetY = 0;
    if(!raf) raf = requestAnimationFrame(loop);
  }, { passive:true });
})();

// Preloader (fecha ao carregar)
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if(pre){ setTimeout(() => pre.classList.add('hide'), 200); }
});
