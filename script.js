// ============================================
// Sumreen Fatima — Developer Portfolio (Lilac theme)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Custom playful cursor ---------- */
  if (!prefersReducedMotion && !isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--active'));
    });
  }

  /* ---------- Scroll-triggered reveal ---------- */
  if (!prefersReducedMotion) {
    const revealTargets = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => observer.observe(el));

    // Stagger children inside each revealed section
    revealTargets.forEach(section => {
      const items = section.querySelectorAll('.skill-card, .project-card');
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 80}ms`;
      });
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Project card tilt on hover ---------- */
  if (!prefersReducedMotion && !isTouch) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -6;
        const rotateY = ((x / rect.width) - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------- Easter egg: click name for confetti ---------- */
  const nameBtn = document.getElementById('nameEgg');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#9B7FC4', '#C9A8E9', '#E6D9F5', '#7ED9A8', '#F4D35E'];

  function spawnConfetti(originX, originY) {
    for (let i = 0; i < 60; i++) {
      confettiPieces.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -9 - 3,
        size: Math.random() * 7 + 4,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.28,
        opacity: 1,
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(runConfetti);
    }
  }

  function runConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > canvas.height * 0.75) p.opacity -= 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    confettiPieces = confettiPieces.filter(p => p.opacity > 0 && p.y < canvas.height + 50);

    if (confettiPieces.length > 0) {
      requestAnimationFrame(runConfetti);
    } else {
      confettiRunning = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  if (nameBtn) {
    nameBtn.addEventListener('click', () => {
      const rect = nameBtn.getBoundingClientRect();
      spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

      if (!prefersReducedMotion) {
        nameBtn.classList.remove('wiggle');
        // force reflow so animation can replay on repeated clicks
        void nameBtn.offsetWidth;
        nameBtn.classList.add('wiggle');
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMenu() {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  }

  menuToggle.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  /* ---------- Contact form (Formspree) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const actionUrl = form.getAttribute('action');

    if (!actionUrl || actionUrl.includes('YOUR_FORM_ID')) {
      formNote.textContent = '⚠ Form not connected yet — see setup instructions to enable this.';
      formNote.style.color = '#C99B3D';
      return;
    }

    formNote.textContent = 'Sending…';
    formNote.style.color = 'var(--ink-muted)';

    try {
      const res = await fetch(actionUrl, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        formNote.textContent = '✓ Message sent — thank you! I\u2019ll get back to you soon.';
        formNote.style.color = '#3F9D6F';
        form.reset();
      } else {
        formNote.textContent = '⚠ Something went wrong. Please try emailing directly.';
        formNote.style.color = '#D1657A';
      }
    } catch (err) {
      formNote.textContent = '⚠ Network error. Please try emailing directly.';
      formNote.style.color = '#D1657A';
    }
  });

});