/* AURELIA – gallery.js : spotlight hero, layouts, shuffle, moodboard, slideshow lightbox, tabs */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icons = () => window.lucide && window.lucide.createIcons();
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Hero: spotlight + parallax ---------- */
  const hero = $('.gl-hero');
  if (hero && !reduce) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    const him = $('img', hero); let tick = false;
    addEventListener('scroll', () => {
      if (tick || scrollY > innerHeight) return; tick = true;
      requestAnimationFrame(() => { him.style.transform = `translateY(${scrollY * .22}px)`; tick = false; });
    }, { passive: true });
  }

  const grid = $('.gl-grid'); if (!grid) return;
  const all = () => $$('.gl-item', grid);
  const visible = () => all().filter(i => !i.classList.contains('hide'));
  const total = all().length;

  /* ---------- Jump to a collection ---------- */
  const jump = f => {
    const p = $(`.pill[data-f="${f}"]`); if (p) p.click();
    setTimeout(() => $('#browse-sec').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 60);
  };
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => jump(b.dataset.jump)));

  /* ---------- Filter count (main.js toggles .hide) ---------- */
  const count = $('#glCount'), names = { wedding: 'wedding', birthday: 'birthday', party: 'party' };
  $$('.gl-bar .pill').forEach(p => p.addEventListener('click', () => setTimeout(() => {
    const f = p.dataset.f, n = visible().length;
    count.textContent = f === 'all' ? `Showing all ${total} photographs` : `Showing ${n} ${names[f]} photographs`;
  }, 0)));

  /* ---------- Layout toggle + shuffle ---------- */
  const tilt = () => all().forEach(i => i.style.setProperty('--r', (Math.random() * 9 - 4.5).toFixed(1) + 'deg'));
  tilt();
  $$('.gl-seg button').forEach(b => b.addEventListener('click', () => {
    grid.dataset.view = b.dataset.view;
    $$('.gl-seg button').forEach(x => x.setAttribute('aria-pressed', x === b));
  }));
  $('#glShuffle').addEventListener('click', () => {
    const a = all();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    a.forEach(el => grid.appendChild(el));
    tilt();
  });

  /* ---------- Moodboard (saved photos) ---------- */
  let saved = []; try { saved = JSON.parse(store.get('aur-mood') || '[]'); } catch (e) { saved = []; }
  saved = saved.filter(id => $(`.gl-item[data-id="${id}"]`, grid));
  const itemOf = id => $(`.gl-item[data-id="${id}"]`, grid);
  function renderMood() {
    $$('.gl-heart', grid).forEach(h => h.setAttribute('aria-pressed', saved.includes(h.closest('.gl-item').dataset.id)));
    const chips = $('#glChips'), go = $('#glMoodGo'), hint = $('#glMoodHint');
    chips.innerHTML = saved.map(id => `<button type="button" data-rm="${id}" aria-label="Remove ${itemOf(id).dataset.title}">${itemOf(id).dataset.title}<i data-lucide="x"></i></button>`).join('');
    hint.textContent = saved.length ? `${saved.length} saved. Tap one to remove it, or share the list with a planner.` : 'Tap the heart on any photo to start collecting ideas for your day.';
    go.hidden = !saved.length;
    go.href = saved.length ? `contact.html?mood=${encodeURIComponent(saved.map(id => itemOf(id).dataset.title).join(', '))}#visit` : 'contact.html#visit';
    store.set('aur-mood', JSON.stringify(saved));
    syncLbHeart(); icons();
  }
  const toggleSave = id => { saved = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; renderMood(); };
  grid.addEventListener('click', e => { const h = e.target.closest('.gl-heart'); if (h) toggleSave(h.closest('.gl-item').dataset.id); });
  $('#glChips').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) toggleSave(b.dataset.rm); });

  /* ---------- Lightbox with slideshow ---------- */
  const DELAY = 4000;
  let list = [], idx = 0, opener = null, startX = null, playing = false, timer = null;
  const lb = document.createElement('div');
  lb.className = 'gl-lb'; lb.hidden = true;
  lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer');
  lb.style.setProperty('--t', DELAY + 'ms');
  lb.innerHTML = `<div class="prog"><i></i></div><span class="ct" aria-live="polite"></span>
    <button class="rb cl" type="button" aria-label="Close"><i data-lucide="x"></i></button>
    <button class="nv prev" type="button" aria-label="Previous photo"><i data-lucide="chevron-left"></i></button>
    <figure><img alt=""></figure>
    <button class="nv next" type="button" aria-label="Next photo"><i data-lucide="chevron-right"></i></button>
    <div class="bar"><button class="rb pp" type="button" aria-label="Play slideshow"><i class="i-play" data-lucide="play"></i><i class="i-pause" data-lucide="pause"></i></button><div><b></b><span></span></div><button class="rb sv" type="button" aria-pressed="false" aria-label="Save to moodboard"><i data-lucide="heart"></i></button></div>`;
  document.body.appendChild(lb); icons();
  const img = $('img', lb), ttl = $('.bar b', lb), cat = $('.bar span', lb), ct = $('.ct', lb), prog = $('.prog i', lb), pp = $('.pp', lb), sv = $('.sv', lb);

  function syncLbHeart() { if (lb.hidden || !list[idx]) return; sv.setAttribute('aria-pressed', saved.includes(list[idx].dataset.id)); }
  function show(i) {
    idx = (i + list.length) % list.length;
    const t = list[idx], im = $('img', t), thumb = im.currentSrc || im.src;
    img.classList.remove('zoomed');
    img.onerror = () => { img.onerror = null; img.src = thumb; };
    img.src = thumb.replace(/w=\d+/, 'w=1600'); img.alt = im.alt;
    ttl.textContent = t.dataset.title; cat.textContent = t.dataset.label;
    ct.textContent = `${idx + 1} / ${list.length}`; syncLbHeart();
  }
  function schedule() {
    clearTimeout(timer); prog.classList.remove('run'); void prog.offsetWidth;
    if (!playing) return; prog.classList.add('run');
    timer = setTimeout(() => { show(idx + 1); schedule(); }, DELAY);
  }
  function setPlay(on) {
    playing = on; lb.classList.toggle('playing', on);
    pp.setAttribute('aria-label', on ? 'Pause slideshow' : 'Play slideshow'); schedule();
  }
  const step = d => { show(idx + d); if (playing) schedule(); };
  function open(t, autoplay) {
    list = visible(); opener = t; lb.hidden = false; document.body.style.overflow = 'hidden';
    show(list.indexOf(t)); setPlay(!!autoplay); $('.cl', lb).focus();
  }
  function close() { setPlay(false); lb.hidden = true; document.body.style.overflow = ''; img.removeAttribute('src'); opener && opener.focus(); }
  const rtl = () => document.documentElement.getAttribute('dir') === 'rtl';

  grid.addEventListener('click', e => { const o = e.target.closest('.gl-open'); if (o) open(o.closest('.gl-item')); });
  $('#glPlay').addEventListener('click', () => { const v = visible(); if (v.length) open(v[0], true); });
  $('.cl', lb).onclick = close;
  $('.prev', lb).onclick = () => step(-1);
  $('.next', lb).onclick = () => step(1);
  pp.onclick = () => setPlay(!playing);
  sv.onclick = () => toggleSave(list[idx].dataset.id);
  img.addEventListener('click', e => {
    const r = img.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    img.classList.toggle('zoomed');
  });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(rtl() ? 1 : -1);
    else if (e.key === 'ArrowRight') step(rtl() ? -1 : 1);
    else if (e.key === ' ' && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); setPlay(!playing); }
    else if (e.key === 'Tab') {
      const f = $$('button', lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  lb.addEventListener('pointerdown', e => { startX = e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (startX === null) return; const dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 70 && !img.classList.contains('zoomed')) step(dx < 0 ? 1 : -1);
  });

  renderMood();

  /* ---------- Behind the lens: expanding panels ---------- */
  const pans = $$('.gl-pan');
  const openPan = p => pans.forEach(x => { x.classList.toggle('on', x === p); x.setAttribute('aria-pressed', x === p); });
  pans.forEach(p => { p.addEventListener('click', () => openPan(p)); p.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && openPan(p)); p.addEventListener('focus', () => openPan(p)); });

  /* ---------- Seasons ---------- */
  const SEA = {
    summer:  ['Long golden hours', 'Summer evenings', 'Terrace dinners under lanterns.', 'sun'],
    monsoon: ['Rain on the roof', 'Monsoon magic', 'Cosy indoor halls with warm lighting.', 'cloud-rain'],
    festive: ['Lights everywhere', 'Festive season', 'Garlands, diyas and grand receptions.', 'sparkles'],
    winter:  ['Cool and glowing', 'Winter weddings', 'Peak wedding dates, ideal weather.', 'snowflake']
  };
  const stage = $('.gl-stage'), stabs = $$('.gl-stab');
  const pickSea = i => {
    const t = stabs[i], d = SEA[t.dataset.s];
    stabs.forEach((x, k) => { x.setAttribute('aria-selected', k === i); x.tabIndex = k === i ? 0 : -1; });
    stage.dataset.s = t.dataset.s;
    $$('.gl-sph', stage).forEach(p => p.classList.toggle('on', p.dataset.s === t.dataset.s));
    $('#glSeaTag').textContent = d[0]; $('#glSeaTitle').textContent = d[1]; $('#glSeaText').textContent = d[2];
    $('.big', stage).innerHTML = `<i data-lucide="${d[3]}"></i>`; icons();
  };
  stabs.forEach((t, i) => {
    t.addEventListener('click', () => pickSea(i));
    t.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
      e.preventDefault(); const n = (i + d + stabs.length) % stabs.length; pickSea(n); stabs[n].focus();
    });
  });

  /* ---------- Guest-story tabs ---------- */
  const tabs = $$('.gl-person');
  const pick = i => tabs.forEach((t, k) => {
    const on = k === i; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
    $('#' + t.getAttribute('aria-controls')).hidden = !on;
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pick(i));
    t.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!d) return;
      e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; pick(n); tabs[n].focus();
    });
  });
})();
