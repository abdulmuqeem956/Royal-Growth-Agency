/* ═══════════════════════════════════════════════════════════════
   ROYAL GROWTH AGENCY — script.js
   Vanilla JavaScript · No dependencies needed
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initHeroLoad();
  initFilmTicker();
  initScrollReveal();
  initStatCounters();
  initGlassCardGlow();

});

// ═══════════════════════════════════════════════════════════════
// 1. NAVBAR — scroll frost effect + hamburger toggle
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll frost
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Close mobile menu (called from HTML onclick)
function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Make closeMobileMenu global so HTML onclick can reach it
window.closeMobileMenu = closeMobileMenu;

// ═══════════════════════════════════════════════════════════════
// 2. HERO LOAD ANIMATION
// ═══════════════════════════════════════════════════════════════
function initHeroLoad() {
  const hero = document.getElementById('heroContent');
  // Small delay so browser paints first
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (hero) hero.classList.add('loaded');
    }, 80);
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. FILM TICKER — infinite scrolling text strip
// ═══════════════════════════════════════════════════════════════
function initFilmTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;

  const words = ['REELS', 'SHORTS', 'BRANDS', 'CREATORS', 'CONTENT', 'VIDEOS', 'STORIES', 'EDITS'];

  // Triple the items so the seamless loop has room
  const allItems = [...words, ...words, ...words];

  allItems.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'ticker-item ' + (i % 2 === 0 ? 'gold' : 'dim');
    span.textContent = word;
    ticker.appendChild(span);
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. SCROLL REVEAL — IntersectionObserver on .reveal elements
// ═══════════════════════════════════════════════════════════════
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings in same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
          );
          const delay = siblings.indexOf(entry.target) * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════════════════════════
// 5. STAT COUNTERS — count-up animation when in view
// ═══════════════════════════════════════════════════════════════
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  statNums.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800; // ms
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(interval);
    } else {
      el.textContent = current + suffix;
    }
  }, 16);
}

// ═══════════════════════════════════════════════════════════════
// 6. GLASS CARD GLOW — per-card coloured glow on hover
// ═══════════════════════════════════════════════════════════════
function initGlassCardGlow() {
  const cards = document.querySelectorAll('.glass-card[data-glow]');

  cards.forEach(card => {
    const color = card.dataset.glow;

    card.addEventListener('mouseenter', () => {
      card.style.borderColor = color + '60';
      card.style.boxShadow = `0 0 40px ${color}30, 0 20px 60px rgba(0,0,0,0.5)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.borderColor = 'rgba(212, 175, 55, 0.15)';
      card.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 7. SMOOTH SCROLL — polyfill for older browsers
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});