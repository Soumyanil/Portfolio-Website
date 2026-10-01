/* ================================================
   PORTFOLIO JS – Interactive Engine
   Soumyanil Pal Choudhary | 2025
   ================================================ */

'use strict';

// ── Custom Cursor ──────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Hover effect on interactive elements
const hoverables = 'a, button, .skill-card, .cert-card, .project-card, input, textarea, .nav-link, .about-tag';
document.querySelectorAll(hoverables).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ── Canvas Particles ───────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const COLORS = ['rgba(56,189,248,', 'rgba(168,85,247,', 'rgba(129,140,248,', 'rgba(52,211,153,'];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function createParticle() {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = Math.random() * 2 + 0.5;
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size,
    color,
    alpha: Math.random() * 0.5 + 0.1,
    alphaDir: (Math.random() - 0.5) * 0.004,
  };
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 18000);
  particles = Array.from({ length: count }, createParticle);
}
initParticles();

function connectParticles() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.07;
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha += p.alphaDir;
    if (p.alpha > 0.6 || p.alpha < 0.05) p.alphaDir *= -1;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color + p.alpha.toFixed(2) + ')';
    ctx.fill();
  });
  connectParticles();
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── Typing Effect ──────────────────────────────────
const roles = [
  'scalable Java apps',
  'Spring Boot APIs',
  'MySQL databases',
  'full stack solutions',
  'clean, efficient code'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = roles[roleIndex];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, --charIndex);
  } else {
    typedEl.textContent = current.slice(0, ++charIndex);
  }

  let delay = isDeleting ? 50 : 100;
  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

// ── Navbar Scroll ──────────────────────────────────
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Scrolled class
  navbar.classList.toggle('scrolled', scrollY > 30);

  // Scroll-to-top visibility
  scrollTopBtn.classList.toggle('visible', scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 90;
    if (scrollY >= top) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}, { passive: true });

// Scroll to top
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Hamburger Menu ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu on link click
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// ── Skills Tabs ───────────────────────────────────
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skills-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.skills-panel[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger bar animations
      panel.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = '0';
        setTimeout(() => { fill.style.width = fill.style.getPropertyValue('--pct') || getComputedStyle(fill).getPropertyValue('--pct'); }, 50);
      });
    }
  });
});

// ── Intersection Observer – Scroll Reveals ────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add reveal class to elements
[
  '.about-grid',
  '.skills-tabs',
  '.skills-panels',
  '.timeline-item',
  '.certs-section',
  '.project-card',
  '.edu-item',
  '.achievements-wrap',
  '.contact-grid',
  '.cert-card',
  '.ach-card',
  '.stat-card',
].forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
  });
});

// Edu score bars – trigger when card in view
const eduObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.edu-card').forEach(c => eduObserver.observe(c));

// ── Skill bar fill (active panel on load) ─────────
function triggerActivePanelBars() {
  const activePanel = document.querySelector('.skills-panel.active');
  if (activePanel) {
    activePanel.querySelectorAll('.skill-fill').forEach(fill => {
      const pct = fill.style.cssText.match(/--pct:\s*([\d.]+%)/)?.[1];

      if (pct) {
        fill.style.setProperty('--pct', pct);
        setTimeout(() => { fill.style.width = pct; }, 600);
      }
    });
  }
}

const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) triggerActivePanelBars();
}, { threshold: 0.2 });
skillsSection && skillsObserver.observe(skillsSection);

// ── Contact Form (Mailto fallback + UI feedback) ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm && contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('nameInput').value.trim();
  const email   = document.getElementById('emailInput').value.trim();
  const subject = document.getElementById('subjectInput').value.trim() || 'Portfolio Contact';
  const msg     = document.getElementById('msgInput').value.trim();

  const body = `Hi Soumyanil,%0A%0AMy name is ${encodeURIComponent(name)} (${encodeURIComponent(email)}).%0A%0A${encodeURIComponent(msg)}`;
  const mailtoLink = `mailto:palsoumyanil1@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

  window.location.href = mailtoLink;

  formSuccess.classList.add('show');
  contactForm.reset();
  setTimeout(() => formSuccess.classList.remove('show'), 6000);
});

// ── Code window on-hover glow effect ─────────────
const codeWin = document.querySelector('.code-window');
if (codeWin) {
  codeWin.addEventListener('mousemove', e => {
    const rect = codeWin.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    codeWin.style.setProperty('--mouse-x', x + '%');
    codeWin.style.setProperty('--mouse-y', y + '%');
  });
}

// ── Project Card Tilt ─────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
  });
});

// ── Smooth anchor scroll with offset ──────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Stats counter animation ───────────────────────
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const duration = 1200;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Number.isInteger(target) ? Math.floor(current) + suffix : current.toFixed(2) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const numEl = card.querySelector('.stat-num');
      const subEl = card.querySelector('.stat-sub');
      if (!numEl || card.dataset.counted) return;
      card.dataset.counted = '1';
      const id = card.id;
      if (id === 'statMca')  animateCounter(numEl, 86.62, subEl.textContent);
      if (id === 'statProj') animateCounter(numEl, 3,     subEl.textContent);
      if (id === 'statCert') animateCounter(numEl, 4,     subEl.textContent);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(c => statsObserver.observe(c));

// ── Launch console easter egg ─────────────────────
console.log(`
%c╔═══════════════════════════════════════════╗
║   Hey! You found the developer mode 👀    ║
║   I'm Soumyanil – let's build something   ║
║   amazing together!                       ║
║   📧 palsoumyanil1@gmail.com              ║
╚═══════════════════════════════════════════╝
`, 'color: #38bdf8; font-family: monospace; font-size: 12px;');
