/* ─────────────────────────────────────────────────────────
   Kennidi — Café & Restaurant Kaprun  |  script.js
───────────────────────────────────────────────────────── */

'use strict';

/* ══════════════════════════════════════════════════════════
   1. NAVBAR — scroll behaviour + hamburger
══════════════════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ══════════════════════════════════════════════════════════
   2. SCROLL ANIMATIONS — IntersectionObserver
══════════════════════════════════════════════════════════ */
const animatedEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);

    setTimeout(() => {
      el.classList.add('in-view');
    }, delay);

    observer.unobserve(el);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

animatedEls.forEach(el => observer.observe(el));

/* ══════════════════════════════════════════════════════════
   3. MENU TABS
══════════════════════════════════════════════════════════ */
const tabs   = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active panel with fade
    panels.forEach(panel => {
      if (panel.id === `tab-${target}`) {
        panel.style.animation = 'none';
        panel.classList.add('active');
        // Trigger reflow then animate
        panel.getBoundingClientRect();
        panel.style.animation = 'tabFadeIn .3s ease forwards';
      } else {
        panel.classList.remove('active');
      }
    });
  });
});

/* ══════════════════════════════════════════════════════════
   4. RESERVATION FORM — validation + mock submit
══════════════════════════════════════════════════════════ */
const reserveForm  = document.getElementById('reserveForm');
const formSuccess  = document.getElementById('formSuccess');

// Set minimum date to today
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!reserveForm.checkValidity()) {
    reserveForm.reportValidity();
    return;
  }

  const btn = reserveForm.querySelector('.full-btn');
  const originalText = btn.textContent;

  // Loading state
  btn.disabled = true;
  btn.textContent = 'Wird gesendet …';

  // Simulate async send (replace with actual fetch to backend)
  setTimeout(() => {
    btn.style.display = 'none';
    formSuccess.hidden = false;
    reserveForm.reset();

    // Reset after 8 seconds
    setTimeout(() => {
      btn.style.display = '';
      btn.disabled = false;
      btn.textContent = originalText;
      formSuccess.hidden = true;
    }, 8000);
  }, 1200);
});

/* ══════════════════════════════════════════════════════════
   5. SMOOTH SCROLL — all internal anchor links
══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navH = navbar.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════════════════════
   6. HIGHLIGHT CARDS — staggered entrance on scroll
══════════════════════════════════════════════════════════ */
// Already handled by [data-animate] + data-delay via IntersectionObserver above.

/* ══════════════════════════════════════════════════════════
   7. ACTIVE NAV LINK — highlight section in viewport
══════════════════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach(a => {
      a.classList.toggle(
        'active-nav',
        a.getAttribute('href') === `#${entry.target.id}`
      );
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ══════════════════════════════════════════════════════════
   8. INJECT CSS KEYFRAMES for tab fade
══════════════════════════════════════════════════════════ */
const style = document.createElement('style');
style.textContent = `
  @keyframes tabFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .nav-links a.active-nav {
    color: var(--clr-primary) !important;
    font-weight: 600;
  }
`;
document.head.appendChild(style);
