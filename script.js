const track = document.getElementById('projectTrack');
const cards = [...document.querySelectorAll('.project-card')];
const dotsWrap = document.getElementById('carouselDots');
const prev = document.getElementById('prevProject');
const next = document.getElementById('nextProject');
let activeIndex = 0;
let startX = 0;
let dragX = 0;
let dragging = false;

function visibleCards() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}
function maxIndex() { return Math.max(0, cards.length - visibleCards()); }
function renderCarousel() {
  activeIndex = Math.min(activeIndex, maxIndex());
  const gap = 18;
  const cardWidth = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${activeIndex * (cardWidth + gap)}px)`;
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  prev.disabled = activeIndex === 0;
  next.disabled = activeIndex >= maxIndex();
  prev.style.opacity = prev.disabled ? '.35' : '1';
  next.style.opacity = next.disabled ? '.35' : '1';
}
function buildDots() {
  dotsWrap.innerHTML = '';
  for (let i = 0; i <= maxIndex(); i++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to project group ${i + 1}`);
    dot.addEventListener('click', () => { activeIndex = i; renderCarousel(); });
    dotsWrap.appendChild(dot);
  }
}
buildDots();
prev.addEventListener('click', () => { activeIndex = Math.max(0, activeIndex - 1); renderCarousel(); });
next.addEventListener('click', () => { activeIndex = Math.min(maxIndex(), activeIndex + 1); renderCarousel(); });
track.addEventListener('pointerdown', e => { startX = e.clientX; dragX = startX; dragging = true; track.setPointerCapture(e.pointerId); });
track.addEventListener('pointermove', e => { if (dragging) dragX = e.clientX; });
track.addEventListener('pointerup', () => { if (!dragging) return; const delta = dragX - startX; if (Math.abs(delta) > 45) activeIndex = Math.max(0, Math.min(maxIndex(), activeIndex + (delta < 0 ? 1 : -1))); dragging = false; renderCarousel(); });
track.addEventListener('pointercancel', () => { dragging = false; });
window.addEventListener('resize', () => { buildDots(); renderCarousel(); });
renderCarousel();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));

const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}, { passive: true });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();
