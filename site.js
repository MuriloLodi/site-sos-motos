// SOS Motos — comportamento do site
// Para trocar o contato, mude só estas duas linhas: todos os botões do site usam elas.
const WHATSAPP = '5545999428969'; // DDI + DDD + número, só dígitos
const TELEFONE = '+5545999428969';
const MENSAGEM = 'Olá, Tatá! Preciso de guincho para minha moto. Minha localização:';

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // todos os links de WhatsApp e telefone a partir de um lugar só
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGEM)}`;
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = wa;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tel]').forEach((a) => { a.href = `tel:${TELEFONE}`; });

  // entrada do hero
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));

  // cabeçalho mais sólido depois de rolar
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // menu do celular
  const burger = document.querySelector('.header__burger');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // elementos que aparecem ao rolar, com um pequeno escalonamento entre irmãos
  const items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const siblings = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  }

  // a linha entre os passos se desenha quando a lista entra na tela
  const steps = document.querySelector('.steps');
  if (steps && !reduce && 'IntersectionObserver' in window) {
    steps.style.setProperty('--line', '0');
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      steps.style.setProperty('--line', '1');
      io.disconnect();
    }, { threshold: 0.3 });
    io.observe(steps);
  }

  // link do menu marcado conforme a seção na tela
  const links = [...document.querySelectorAll('.header__nav a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // balão do WhatsApp flutuante: aparece depois de 4 s e some depois de 8 s
  const float = document.querySelector('.wa-float');
  if (float) {
    setTimeout(() => float.classList.add('is-talking'), 4000);
    setTimeout(() => float.classList.remove('is-talking'), 12000);
  }
})();
