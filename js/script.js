// ── THEME TOGGLE
  const root      = document.documentElement;
  const themeBtn  = document.getElementById('theme-btn');

  function isDark() {
    if (root.dataset.theme) return root.dataset.theme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(dark) {
    root.dataset.theme      = dark ? 'dark' : 'light';
    themeBtn.textContent    = dark ? '☀'   : '☾';
  }
  applyTheme(isDark());
  themeBtn.addEventListener('click', () => applyTheme(!isDark()));

  // ── CURSOR
  const cursor    = document.getElementById('cursor');
  const spotlight = document.getElementById('spotlight');

  document.addEventListener('mousemove', e => {
    cursor.style.left    = e.clientX + 'px';
    cursor.style.top     = e.clientY + 'px';
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top  = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .pill, .exp-item, .proj-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
  });

  // ── SCROLL REVEAL
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── COUNTER ANIMATION
  function animateCount(el, target, duration) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(ease * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('[data-count]').forEach((el, i) => {
        setTimeout(() => animateCount(el, parseInt(el.dataset.count), 1400), i * 120);
      });
      statsObs.disconnect();
    }
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.stats');
  if (statsEl) statsObs.observe(statsEl);

  // ── TEXT SCRAMBLE
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function scramble(el, finalText, duration) {
    const total = duration / 16;
    let frame = 0;
    const id = setInterval(() => {
      el.textContent = finalText.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        return (frame / total > i / finalText.length)
          ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      if (++frame > total) { el.textContent = finalText; clearInterval(id); }
    }, 16);
  }
  window.addEventListener('load', () => {
    setTimeout(() => scramble(document.getElementById('hero-name'), 'Max Mustermann', 900), 350);
  });

  // ── MAGNETIC BUTTON
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transition = 'transform .1s';
      btn.style.transform  = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), opacity .2s';
      btn.style.transform  = '';
    });
  });