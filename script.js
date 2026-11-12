const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const links = document.getElementById('navLinks');
const dropdown = document.querySelector('.has-dropdown');
const dropBtn = dropdown.querySelector('.nav-link');

// Bayangan navbar saat di-scroll (navbar tetap menempel via position: fixed)
const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll);
onScroll();

// Menu mobile
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  links.classList.toggle('open');
});

// Dropdown Project (hover di desktop, klik di semua perangkat)
dropBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
  dropBtn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
});
if (window.matchMedia('(hover: hover) and (min-width: 901px)').matches) {
  dropdown.addEventListener('mouseenter', () => dropdown.classList.add('open'));
  dropdown.addEventListener('mouseleave', () => dropdown.classList.remove('open'));
}
document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') dropdown.classList.remove('open'); });

// Tutup menu mobile setelah klik link
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); burger.classList.remove('open'); dropdown.classList.remove('open');
}));

// Highlight menu sesuai section yang sedang dilihat
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a.nav-link[href^="#"]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => io.observe(s));

// Progress bar scroll + tombol kembali ke atas
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  if (toTop) toTop.classList.toggle('show', window.scrollY > 400);
});
if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Efek mengetik di hero
const typed = document.getElementById('typed');
if (typed) {
  const words = ['Mahasiswa Teknologi', 'Web Developer Pemula', 'Penggemar IoT'];
  let w = 0, c = 0, del = false;
  (function type() {
    typed.textContent = words[w].slice(0, c);
    if (!del && c === words[w].length) { del = true; return setTimeout(type, 1400); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(type, del ? 40 : 90);
  })();
}

// Animasi muncul saat di-scroll + hitung angka + bar keahlian
const ro = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('show');
    const num = el.querySelector('[data-count]');
    if (num) {
      const target = +num.dataset.count, suffix = num.dataset.suffix || '';
      let n = 0; const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => { n = Math.min(target, n + step); num.textContent = n + suffix; if (n >= target) clearInterval(t); }, 30);
    }
    const bar = el.querySelector('[data-level]');
    if (bar) bar.style.width = bar.dataset.level + '%';
    ro.unobserve(el);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.card, .stat, .skill, .tl-item, .about-grid > *').forEach(el => { el.classList.add('reveal'); ro.observe(el); });

// Filter project
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.filter;
  document.querySelectorAll('#project .card').forEach(card => {
    card.classList.toggle('hide', f !== 'all' && !card.dataset.cat.split(' ').includes(f));
  });
}));