/* AURELIA – main.js
   Shared header/footer, theme, RTL, filters, lightbox, validation, effects. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  const root = document.documentElement;
  const icons = () => window.lucide && window.lucide.createIcons();

  /* ---------- Brand logo (inline SVG so it works offline) ---------- */
  const MARK = `<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="aug" gradientUnits="userSpaceOnUse" x1="8" y1="6" x2="56" y2="58"><stop offset="0" stop-color="#ffd978"/><stop offset=".55" stop-color="#f2a93b"/><stop offset="1" stop-color="#ff4f86"/></linearGradient></defs><rect x="2" y="2" width="60" height="60" rx="19" fill="#2a0f22"/><rect x="2" y="2" width="60" height="60" rx="19" fill="none" stroke="url(#aug)" stroke-width="1.6" opacity=".7"/><path d="M17 51V31a15 15 0 0 1 30 0v20" fill="none" stroke="url(#aug)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.5 51V32.5a6.5 6.5 0 0 1 13 0V51" fill="none" stroke="url(#aug)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.5 43h13" stroke="url(#aug)" stroke-width="2.4" stroke-linecap="round"/><path d="M12 51h40" stroke="url(#aug)" stroke-width="3" stroke-linecap="round"/><path d="M32 5.5l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="url(#aug)"/><circle cx="47.5" cy="14" r="1.6" fill="#ffd978"/><circle cx="16.5" cy="15" r="1.2" fill="#ffd978"/></svg>`;
  const brand = (href = 'index.html') => `<a class="brand" href="${href}" aria-label="Aurelia Banquets &amp; Celebrations – home">${MARK}<span class="brand-text"><b>AURELIA</b><small>BANQUETS &amp; CELEBRATIONS</small></span></a>`;
  window.AureliaBrand = brand;

  /* ---------- Theme + RTL ---------- */
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach(b => {
      b.innerHTML = `<i data-lucide="${t === 'dark' ? 'sun' : 'moon'}"></i>`;
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    icons();
  }
  function applyDir(d) {
    root.setAttribute('dir', d);
    $$('[data-rtl-toggle]').forEach(b => { b.textContent = d === 'rtl' ? 'LTR' : 'RTL'; b.setAttribute('aria-label', 'Switch text direction'); });
  }
  function bindToggles() {
    $$('[data-theme-toggle]').forEach(b => b.onclick = () => { const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; store.set('aur-theme', t); applyTheme(t); });
    $$('[data-rtl-toggle]').forEach(b => b.onclick = () => { const d = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl'; store.set('aur-dir', d); applyDir(d); });
  }
  window.AureliaToggles = { bindToggles, applyTheme, applyDir };
  const toolBtns = `<button class="ibtn" data-theme-toggle type="button"></button><button class="ibtn" data-rtl-toggle type="button">RTL</button>`;

  /* ---------- Header / Footer ---------- */
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const on = (...f) => f.includes(file) ? 'on' : '';
  function buildHeader() {
    const h = $('#site-header'); if (!h) return;
    h.outerHTML = `<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="in">${brand()}
<nav class="nav" id="nav" aria-label="Main"><ul>
<li class="has-sub"><button class="sub-t ${on('index.html', 'home2.html', '')}" type="button" aria-haspopup="true" aria-expanded="false">Home <i data-lucide="chevron-down"></i></button><div class="sub"><a href="index.html">Home 1 · Classic</a><a href="home2.html">Home 2 · Premium</a></div></li>
<li><a class="${on('about.html')}" href="about.html">About</a></li>
<li><a class="${on('services.html')}" href="services.html">Services</a></li>
<li><a class="${on('halls.html')}" href="halls.html">Halls</a></li>
<li><a class="${on('packages.html')}" href="packages.html">Packages</a></li>
<li><a class="${on('gallery.html')}" href="gallery.html">Gallery</a></li>
<li><a class="${on('contact.html')}" href="contact.html">Contact</a></li>
<li><a class="${on('dashboard.html')}" href="dashboard.html">Dashboard</a></li></ul>
<div class="m-tools">${toolBtns}</div></nav>
<div class="tools">${toolBtns}<a class="btn btn-primary" href="login.html">Sign in</a><button class="ibtn menu-btn" type="button" aria-label="Open menu" aria-controls="nav"><i data-lucide="menu"></i></button></div></div></header>`;
    const sub = $('.has-sub'), st = $('.sub-t', sub);
    st.addEventListener('click', () => { const o = sub.classList.toggle('open'); st.setAttribute('aria-expanded', o); });
    $('.menu-btn').addEventListener('click', e => {
      const o = document.body.classList.toggle('nav-open');
      e.currentTarget.innerHTML = `<i data-lucide="${o ? 'x' : 'menu'}"></i>`; icons();
    });
  }
  const WA = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88M20.46 3.49A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42"/></svg>`;
  const tiktok = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.6V9a7.3 7.3 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5z"/></svg>`;
  const soc = (l, i) => `<a href="#" aria-label="${l}"><i data-lucide="${i}"></i></a>`;
  function hoursStatus() {
    const d = new Date(), day = d.getDay(), hr = d.getHours() + d.getMinutes() / 60;
    const [o, c] = day === 0 ? [10, 18] : [9, 21];
    if (hr >= o && hr < c) return { open: true, t: `Open now · closes ${c > 12 ? c - 12 : c} ${c >= 12 ? 'PM' : 'AM'}` };
    return { open: false, t: 'Closed · opens Mon–Sat 9 AM' };
  }
  function buildFooter() {
    const f = $('#site-footer'); if (!f) return;
    const s = hoursStatus();
    f.outerHTML = `<section class="fband" aria-label="Book a visit"><div class="container"><div><span class="script">Your date is waiting.</span><h2>Let’s plan something unforgettable</h2></div><div class="row-btns on-dark" style="margin:0"><a class="btn btn-primary" href="contact.html#visit">Book a venue visit</a><a class="btn btn-secondary" href="tel:+919876543210"><i data-lucide="phone"></i> Call us</a></div></div></section>
<footer class="ftr"><div class="container fgrid"><div>${brand()}<span class="script">Where every celebration begins.</span><p>Five elegant halls, in-house catering and decor for weddings, birthdays and corporate evenings. By appointment, in Chengalpattu.</p>
<div class="soc">${soc('Instagram', 'instagram')}${soc('Facebook', 'facebook')}${soc('YouTube', 'youtube')}<a href="#" aria-label="TikTok">${tiktok}</a>${soc('LinkedIn', 'linkedin')}<a href="https://wa.me/919876543210" aria-label="WhatsApp" target="_blank" rel="noopener">${WA}</a></div></div>
<div><h4>Explore</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li><li><a href="services.html">Services</a></li><li><a href="halls.html">Halls</a></li><li><a href="packages.html">Packages</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="contact.html">Contact</a></li></ul></div>
<div><h4>Client Care</h4><ul><li><a href="dashboard.html#availability">Book a date</a></li><li><a href="contact.html#visit">Book a venue visit</a></li><li><a href="login.html">Client portal</a></li><li><a href="packages.html#addons">Add-ons</a></li><li><a href="index.html#reviews">Reviews</a></li></ul></div>
<div><h4>Find the Venue</h4><ul class="ctc"><li><span class="dot ${s.open ? 'open' : ''}"></span><span>${s.t}</span></li><li><i data-lucide="map-pin"></i><span>12 Celebration Avenue, Chengalpattu, Tamil Nadu, India</span></li><li><i data-lucide="mail"></i><a href="mailto:hello@aureliahall.example">hello@aureliahall.example</a></li><li><i data-lucide="phone"></i><a href="tel:+919876543210">+91 98765 43210</a></li><li><i data-lucide="clock"></i><span>Mon–Sat 9 AM – 9 PM · Sun 10 AM – 6 PM</span></li></ul></div></div>
<div class="fbot"><div class="container"><span>© <span id="yr"></span> Aurelia Hall. All rights reserved.</span><span><a href="#">Privacy</a><a href="#">Terms</a></span></div></div></footer>
<button class="fab top" type="button" aria-label="Back to top"><i data-lucide="arrow-up"></i></button>
<button class="fab sp" type="button" aria-label="Celebrate with confetti"><i data-lucide="sparkles"></i></button>
<a class="fab wa" href="https://wa.me/919876543210" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA}</a>`;
    $('#yr').textContent = new Date().getFullYear();
    const top = $('.fab.top');
    top.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500), { passive: true });
    $('.fab.sp').onclick = confetti;
  }
  function confetti() {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const cols = ['#d6215e', '#e0a82e', '#f9a8c9', '#fff', '#8a5a0b'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('i'); p.className = 'cf';
      p.style.cssText = `left:${Math.random() * 100}vw;background:${cols[i % 5]};animation-delay:${Math.random() * .8}s;animation-duration:${1.8 + Math.random() * 1.6}s;border-radius:${i % 3 ? '2px' : '50%'}`;
      document.body.appendChild(p); setTimeout(() => p.remove(), 4200);
    }
  }
  window.AureliaConfetti = confetti;

  /* ---------- Images from Unsplash (data-u = photo id) ---------- */
  function loadImages() {
    $$('img[data-u]').forEach(img => {
      img.addEventListener('error', () => { if (img.dataset.fb && !img.src.includes(img.dataset.fb)) { img.addEventListener('error', () => img.parentElement.classList.add('img-fail'), { once: true }); img.src = img.dataset.fb; } else img.parentElement.classList.add('img-fail'); }, { once: true });
      img.src = `https://images.unsplash.com/photo-${img.dataset.u}?auto=format&fit=crop&w=${img.dataset.w || 900}&q=70`;
    });
  }

  /* ---------- Reveal, counters ---------- */
  function effects() {
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; e.target.classList.add('in'); io.unobserve(e.target);
      if (e.target.dataset.count) count(e.target);
    }), { threshold: .15 }) : null;
    $$('.rv,[data-count]').forEach(el => io ? io.observe(el) : (el.classList.add('in'), el.dataset.count && count(el)));
    function count(el) {
      const end = +el.dataset.count, suf = el.dataset.suf || '', t0 = performance.now();
      (function tick(t) { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * k).toLocaleString('en-IN') + suf; if (k < 1) requestAnimationFrame(tick); })(t0);
    }
  }

  /* ---------- Filters (halls, gallery) ---------- */
  function filters() {
    $$('[data-filters]').forEach(box => {
      const state = {}, items = $$('.fitem', document);
      $$('.pill', box).forEach(b => b.addEventListener('click', () => {
        const g = b.dataset.g; state[g] = b.dataset.f;
        $$(`.pill[data-g="${g}"]`, box).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
        let shown = 0;
        items.forEach(it => {
          const ok = Object.entries(state).every(([k, v]) => v === 'all' || (it.dataset[k] || '').split(' ').includes(v));
          it.classList.toggle('hide', !ok); if (ok) shown++;
        });
        const e = $('#empty'); if (e) e.hidden = shown > 0;
      }));
    });
  }
  function lightbox() {
    $$('[data-lightbox]').forEach(el => el.addEventListener('click', () => {
      const im = $('img', el); if (!im || !im.src) return;
      const lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-label', 'Image preview');
      lb.innerHTML = `<button class="ibtn" aria-label="Close"><i data-lucide="x"></i></button><img src="${im.src.replace(/w=\d+/, 'w=1600')}" alt="${im.alt}">`;
      document.body.appendChild(lb); icons();
      const close = () => { lb.remove(); document.removeEventListener('keydown', esc); };
      const esc = e => e.key === 'Escape' && close();
      lb.addEventListener('click', close); document.addEventListener('keydown', esc); $('button', lb).focus();
    }));
  }

  /* ---------- Form validation ---------- */
  function validators() {
    $$('[data-eye]').forEach(b => b.addEventListener('click', () => {
      const i = $('input', b.parentElement), show = i.type === 'password';
      i.type = show ? 'text' : 'password'; b.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}"></i>`; b.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); icons();
    }));
    $$('form[data-validate]').forEach(form => {
      form.noValidate = true;
      const check = inp => {
        const w = inp.closest('.fld'); if (!w) return true;
        const v = inp.value.trim(); let m = '';
        if (inp.required && !v) m = 'This field is required.';
        else if (inp.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Enter a valid email, e.g. name@example.com.';
        else if (inp.type === 'tel' && v && !/^[+\d][\d\s-]{8,14}$/.test(v)) m = 'Enter a valid phone number with 9–15 digits.';
        else if (inp.minLength > 0 && v && v.length < inp.minLength) m = `Use at least ${inp.minLength} characters.`;
        else if (inp.dataset.match && v !== $(inp.dataset.match, form).value) m = 'Passwords do not match.';
        else if (inp.type === 'checkbox' && inp.required && !inp.checked) m = 'Please accept to continue.';
        w.classList.toggle('bad', !!m); const e = $('.err', w); if (e) e.textContent = m; inp.setAttribute('aria-invalid', !!m);
        return !m;
      };
      $$('input,select,textarea', form).forEach(i => { i.addEventListener('blur', () => check(i)); i.addEventListener('input', () => i.closest('.fld')?.classList.contains('bad') && check(i)); });
      form.addEventListener('submit', e => {
        e.preventDefault();
        const bad = $$('input,select,textarea', form).filter(i => !check(i));
        if (bad.length) { bad[0].focus(); return; }
        const ok = $('.ok-msg', form); if (ok) ok.classList.add('show');
        if (form.dataset.redirect) setTimeout(() => location.href = form.dataset.redirect, 700); else { form.reset(); confetti(); }
      });
    });
  }

  /* ---------- Hall finder (guest-count slider) ---------- */
  function hallFinder() {
    const r = $('#guestRange'); if (!r) return;
    const halls = [[50, 'Gold Chamber', 'private dinners and anniversaries', '₹30,000'], [120, 'Jade Boardroom Hall', 'corporate launches and small receptions', '₹55,000'], [200, 'Sapphire Terrace', 'sangeet nights and evening receptions', '₹80,000'], [400, 'Rosewood Hall', 'engagements, birthdays and seated dinners', '₹1,20,000'], [1500, 'Grand Ballroom', 'grand weddings and galas', '₹2,50,000']];
    const upd = () => {
      const g = +r.value, h = halls.find(x => g <= x[0]) || halls[4];
      $('#guestVal').textContent = g.toLocaleString('en-IN');
      $('#hallName').textContent = h[1]; $('#hallNote').textContent = `Best for ${h[2]}. Starts from ${h[3]}.`;
    };
    r.addEventListener('input', upd); upd();
  }

  /* ---------- Init ---------- */
  const bare = document.body.classList.contains('bare');
  if (!bare) { buildHeader(); buildFooter(); }
  const t = store.get('aur-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  applyTheme(t); applyDir(store.get('aur-dir') || 'ltr'); bindToggles();
  loadImages(); effects(); filters(); hallFinder(); lightbox(); validators(); icons();
  if (location.hash) setTimeout(() => { const el = $(location.hash); el && el.scrollIntoView(); }, 300);
})();
