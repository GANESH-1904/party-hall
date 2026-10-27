/* AURELIA – dashboard.js : overview, availability, booking, add-ons, payments, profile, chat */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const KEY = 'aur-dash-v2';

  /* ---------- catalogue ---------- */
  const HALLS = [
    { id: 'grand', name: 'Grand Ballroom (1,500)', short: 'Grand Ballroom', cap: 1500, price: 250000 },
    { id: 'rose', name: 'Rosewood Hall (400)', short: 'Rosewood Hall', cap: 400, price: 120000 },
    { id: 'sapph', name: 'Sapphire Terrace (200)', short: 'Sapphire Terrace', cap: 200, price: 80000 },
    { id: 'jade', name: 'Jade Boardroom Hall (120)', short: 'Jade Boardroom', cap: 120, price: 55000 },
    { id: 'gold', name: 'Gold Chamber (50)', short: 'Gold Chamber', cap: 50, price: 30000 }
  ];
  const CAT = [
    { id: 'veg', name: 'Veg feast', note: 'Per guest · 4 starters, 6 mains, 3 desserts', price: 650, perGuest: true },
    { id: 'nonveg', name: 'Non-veg feast', note: 'Per guest · includes chef specials', price: 850, perGuest: true },
    { id: 'live', name: 'Live counters', note: 'Per guest · dosa, chaat and grill', price: 450, perGuest: true },
    { id: 'cake', name: 'Custom cake', note: 'Multi-tier, designed with you', price: 6500 }
  ];
  const DEC = [
    { id: 'stage', name: 'Floral stage', note: 'Backdrop, aisle and entrance', price: 45000 },
    { id: 'light', name: 'Ambient lighting', note: 'Fairy lights and uplights', price: 18000 },
    { id: 'dj', name: 'DJ & sound', note: '6 hours with MC', price: 25000 },
    { id: 'photo', name: 'Photo booth', note: 'Props and instant prints', price: 12000 }
  ];
  const ALL = [...CAT, ...DEC];
  const INSP = [{ ...CAT[3], ic: 'cake' }, { ...DEC[0], ic: 'flower-2' }, { ...DEC[1], ic: 'lightbulb' }, { ...DEC[2], ic: 'music' }];
  const AIC = { veg: 'salad', nonveg: 'drumstick', live: 'chef-hat', cake: 'cake', stage: 'flower-2', light: 'lightbulb', dj: 'music', photo: 'camera' };
  const STEPS = [['Discover', 'search'], ['Reserve', 'calendar-check'], ['Design', 'palette'], ['Celebrate', 'sparkles']];
  const TITLES = { overview: 'Client Dashboard', availability: 'Hall Availability', book: 'Book an Event', addons: 'Catering & Decor', payments: 'Payments', settings: 'Profile & Messages' };
  const WELCOME = 'Hi there! Let me know if you’d like help choosing a decor theme.';

  /* ---------- state ---------- */
  let state = {
    booking: null, addons: {}, paid: [false, false, false], msgs: [],
    profile: { name: 'Guest User', email: 'guest@example.com', phone: '+91 90000 00000' }, seen: ''
  };
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); state = Object.assign(state, s, { profile: Object.assign(state.profile, s.profile || {}) }); } catch (e) { /* storage unavailable */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };

  /* ---------- helpers ---------- */
  const icons = () => window.lucide && window.lucide.createIcons();
  const toast = m => {
    $$('.toast').forEach(t => t.remove());
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = m;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2800);
  };
  const iso0 = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const day = s => new Date(s + 'T00:00');
  const fmt = (s, o = { dateStyle: 'long' }) => day(s).toLocaleDateString('en-IN', o);
  const todayMid = () => new Date(new Date().setHours(0, 0, 0, 0));
  const hall = id => HALLS.find(h => h.id === id) || HALLS[1];
  const guests = () => (state.booking ? +state.booking.guests : 150);
  const initials = n => (n.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2) || 'GU').toUpperCase();
  const firstName = () => state.profile.name.trim().split(/\s+/)[0] || 'there';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- totals ---------- */
  const addonTotal = () => ALL.reduce((s, a) => s + (state.addons[a.id] || 0) * a.price * (a.perGuest ? guests() : 1), 0);
  const total = () => (state.booking ? hall(state.booking.hall).price : 0) + addonTotal();
  const split = () => { const t = total(); return [t * .4, t * .3, t * .3]; };
  const paidAmt = () => split().reduce((s, v, i) => s + (state.paid[i] && state.booking ? v : 0), 0);
  /* due dates: booking now · midway between today and the event · a week before the event (never in the past) */
  const dueDates = () => {
    const today = todayMid(), ev = state.booking ? day(state.booking.date) : new Date(+today + 90 * 864e5);
    const mid = new Date(+today + Math.round((ev - today) / 2)), fin = new Date(Math.max(+ev - 7 * 864e5, +mid));
    const f = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return ['On booking', f(mid), f(fin)];
  };

  /* ---------- identity (name / initials everywhere) ---------- */
  function paintIdentity() {
    const p = state.profile;
    $$('[data-name]').forEach(n => n.textContent = p.name);
    $$('[data-initials]').forEach(n => n.textContent = initials(p.name));
    const m = $('#p-mail'); if (m) m.textContent = p.email + ' · Client account';
    const t = $('#today'); if (t) t.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  /* ---------- notifications (built from live state) ---------- */
  function notes() {
    const n = [], b = state.booking, dd = dueDates();
    if (!b) n.push(['calendar-check', 'Pick a hall and a date to start planning your celebration.']);
    else {
      n.push(['calendar-check', `${hall(b.hall).short} is reserved for ${fmt(b.date)}.`]);
      const i = state.paid.indexOf(false);
      if (i > -1) n.push(['wallet', `Installment ${i + 1} of ${inr(split()[i])} is due ${i === 0 ? 'now' : dd[i]}.`]);
      else n.push(['badge-check', 'All installments are paid. Thank you!']);
      if (!ALL.some(a => state.addons[a.id])) n.push(['sparkles', 'You haven’t chosen catering or decor yet.']);
    }
    const replies = state.msgs.filter(m => !m.me).length;
    if (replies) n.push(['message-square', `Your planner has sent ${replies} message${replies > 1 ? 's' : ''}.`]);
    return n;
  }
  const sig = () => notes().map(x => x[1]).join('|');
  function paintNotes() {
    const n = notes();
    $('#notmenu').innerHTML = n.map(([i, t]) => `<li><i data-lucide="${i}"></i><span>${esc(t)}</span></li>`).join('');
    const b = $('#nbadge'); b.textContent = n.length; b.hidden = !n.length || state.seen === sig();
  }

  /* ---------- navigation ---------- */
  const RENDER = { overview: () => renderOverview(), availability: () => renderCal(), book: () => renderBook(true), addons: () => renderAddons(), payments: () => renderPay() };
  function go(p) {
    if (!$('#p-' + p)) p = 'overview';
    $$('.panel').forEach(x => x.classList.toggle('on', x.id === 'p-' + p));
    $$('.side nav button').forEach(b => { const on = b.dataset.p === p; b.classList.toggle('on', on); on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
    $('.dtop h1').textContent = TITLES[p];
    document.title = TITLES[p] + ' | Aurelia Banquets & Celebrations';
    $('#dash').classList.remove('open');
    try { history.replaceState(null, '', '#' + p); } catch (e) { /* file:// restrictions */ }
    RENDER[p]?.(); paintNotes(); icons(); window.scrollTo(0, 0);
  }
  $$('.side nav button').forEach(b => b.addEventListener('click', () => go(b.dataset.p)));
  document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); $('#avmenu').classList.remove('show'); $('#notmenu').classList.remove('show'); } });
  $('#sidebtn').onclick = () => $('#dash').classList.toggle('open');
  $('#scrim').onclick = () => $('#dash').classList.remove('open');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#dash').classList.remove('open'); $$('.pop-menu').forEach(m => m.classList.remove('show')); } });
  $('#logout').onclick = () => { location.href = 'index.html'; };
  const menus = [['#notbtn', '#notmenu'], ['#avbtn', '#avmenu']];
  menus.forEach(([b, m]) => $(b).addEventListener('click', e => {
    e.stopPropagation(); menus.forEach(([, o]) => o !== m && $(o).classList.remove('show')); $(m).classList.toggle('show');
    if (m === '#notmenu') { state.seen = sig(); save(); paintNotes(); icons(); }
  }));
  document.addEventListener('click', e => { if (!e.target.closest('.pop-menu')) menus.forEach(([, o]) => $(o).classList.remove('show')); });

  /* ---------- overview ---------- */
  function renderOverview() {
    const parts = split(), t = total(), b = state.booking, paid = paidAmt(), pct = t ? Math.round(paid / t * 100) : 0;
    const hasCat = CAT.some(a => state.addons[a.id]), hasDec = DEC.some(a => state.addons[a.id]);
    $('#k-ev').textContent = b ? 1 : 0; $('#k-paid').textContent = inr(paid); $('#k-due').textContent = inr(t - paid);
    $('#k-add').textContent = ALL.filter(a => state.addons[a.id]).length;

    /* hero */
    $('#hero-h').textContent = `Welcome back, ${firstName()}!`;
    const cta = $('#hero-cta');
    let msg = 'Your celebration is taking shape. Pick a hall and a date to begin.', ctaGo = 'book', ctaTxt = 'Book an event';
    if (b) {
      if (!hasCat && !hasDec) { msg = `${hall(b.hall).short} is yours on ${fmt(b.date)}. Next, choose your catering and decor.`; ctaGo = 'addons'; ctaTxt = 'Choose add-ons'; }
      else if (state.paid.includes(false)) { msg = `Your plan is set. Installment ${state.paid.indexOf(false) + 1} of ${inr(parts[state.paid.indexOf(false)])} is next.`; ctaGo = 'payments'; ctaTxt = 'View payments'; }
      else { msg = 'Everything is paid and planned. All that’s left is to celebrate.'; ctaGo = 'settings'; ctaTxt = 'Message planner'; }
    }
    $('#hero-p').textContent = msg; cta.dataset.go = ctaGo; cta.innerHTML = `<i data-lucide="${{ book: 'calendar-plus', addons: 'sparkles', payments: 'wallet', settings: 'message-square' }[ctaGo]}"></i> ${ctaTxt}`;
    if (b) {
      const d = Math.round((day(b.date) - todayMid()) / 864e5);
      $('#cd-n').textContent = Math.max(d, 0); $('#cd-l').textContent = d === 1 ? 'day to your celebration' : d <= 0 ? 'It’s celebration day!' : 'days to your celebration';
      $('#cd-d').textContent = fmt(b.date);
    } else { $('#cd-n').textContent = '—'; $('#cd-l').textContent = 'Pick a date to start the countdown'; $('#cd-d').textContent = ''; }

    /* event card */
    $('#o-event').innerHTML = b
      ? `<div class="evimg"><span><b>${hall(b.hall).short}</b><small>${esc(b.type)}</small></span></div>
         <div class="sumline"><span>Date</span><b>${fmt(b.date)}</b></div>
         <div class="sumline"><span>Guests</span><b>${esc(b.guests)}</b></div>
         <div class="sumline"><span>Event total</span><b>${inr(t)}</b></div>
         <div class="sumline"><span>Status</span><span class="badge2 up">Confirmed</span></div>
         <div class="row-btns"><button class="btn btn-secondary btn-sm" type="button" data-go="book"><i data-lucide="pencil"></i> Change details</button><button class="btn btn-secondary btn-sm danger" type="button" data-cancel><i data-lucide="x-circle"></i> Cancel booking</button></div>`
      : `<div class="evimg"><span><b>No event booked yet</b><small>Your date is waiting</small></span></div><p>Check which dates are open and reserve your day.</p><div class="row-btns"><button class="btn btn-primary" type="button" data-go="availability">Check availability</button></div>`;

    /* checklist + journey */
    const items = ['Reserve your hall and date', 'Choose catering menu', 'Select decor and lighting', 'Pay the booking installment'];
    const checks = [!!b, hasCat, hasDec, !!(b && state.paid[0])];
    $('#o-check').innerHTML = items.map((t, i) => `<div class="addon"><i data-lucide="${checks[i] ? 'check-circle-2' : 'circle'}" style="color:${checks[i] ? 'var(--ok)' : 'var(--mut)'}"></i><div class="ai"><b>${t}</b></div></div>`).join('');
    const done = [true, !!b, hasCat || hasDec, !!b && state.paid.every(Boolean)], now = done.indexOf(false);
    $('#o-journey').innerHTML = STEPS.map(([n, u], i) => `<div class="jstep ${done[i] ? 'done' : i === now ? 'now' : ''}"><span class="jp"><i data-lucide="${done[i] ? 'check' : u}"></i></span><div><b>${n}</b><small>${done[i] ? 'Done' : i === now ? 'In progress' : 'Up next'}</small></div></div>`).join('');

    /* payment ring */
    const C = 2 * Math.PI * 52;
    $('#o-ring').innerHTML = `<div class="ring"><div class="rw"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6215e"/><stop offset="1" stop-color="#e0a82e"/></linearGradient></defs><circle class="rt" cx="60" cy="60" r="52"/><circle class="rf" cx="60" cy="60" r="52" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-to="${C * (1 - pct / 100)}"/></svg><div class="rc"><b>${pct}%</b><small>paid</small></div></div><div class="rleg"><div class="sumline"><span>Paid</span><b>${inr(paid)}</b></div><div class="sumline"><span>Balance</span><b>${inr(t - paid)}</b></div><div class="sumline"><span>Event total</span><b>${inr(t)}</b></div></div></div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => { const rf = $('#o-ring .rf'); if (rf) rf.style.strokeDashoffset = rf.dataset.to; }));

    /* inspiration */
    $('#o-insp').innerHTML = INSP.map(a => { const on = !!state.addons[a.id]; return `<figure class="ic"><span class="ti"><i data-lucide="${a.ic}"></i></span><b>${a.name}</b><small>${inr(a.price)}</small><button type="button" class="ibtn${on ? ' added' : ''}" data-add="${a.id}" aria-pressed="${on}" aria-label="${on ? 'Remove' : 'Add'} ${a.name}"><i data-lucide="${on ? 'check' : 'plus'}"></i></button></figure>`; }).join('');
  }
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-cancel]');
    if (c && confirm('Cancel this booking? Your add-ons and payments for it will be cleared.')) {
      state.booking = null; state.paid = [false, false, false]; state.addons = {}; save(); toast('Booking cancelled.'); lastH = null; renderOverview(); paintNotes(); icons();
    }
    const b = e.target.closest('[data-add]'); if (!b) return;
    const id = b.dataset.add; state.addons[id] = state.addons[id] ? 0 : 1; save();
    toast(state.addons[id] ? 'Added to your plan.' : 'Removed from your plan.'); renderOverview(); paintNotes(); icons();
  });

  /* ---------- availability calendar ---------- */
  let cur = new Date(); cur.setDate(1); let selDate = null;
  const sel = $('#a-hall'); sel.innerHTML = HALLS.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
  const booked = (hid, d) => { const seed = HALLS.findIndex(h => h.id === hid) + 2; return (d.getDate() * seed + d.getMonth()) % 5 === 0 || (d.getDay() === 6 && d.getDate() % 2 === 0); };
  function renderCal() {
    const h = hall(sel.value);
    $('#a-banner').innerHTML = `<span><b>${h.short}</b><small>Up to ${h.cap.toLocaleString('en-IN')} guests · from ${inr(h.price)}</small></span>`;
    $('#mlabel').textContent = cur.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const now = new Date(); $('#prev').disabled = cur.getFullYear() === now.getFullYear() && cur.getMonth() <= now.getMonth();
    const first = cur.getDay(), days = new Date(cur.getFullYear(), cur.getMonth() + 1, 0).getDate(), today = todayMid();
    let out = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="dn">${d}</div>`).join('') + '<i class="e"></i>'.repeat(first);
    for (let d = 1; d <= days; d++) {
      const dt = new Date(cur.getFullYear(), cur.getMonth(), d), iso = iso0(dt), past = dt < today, bk = booked(sel.value, dt);
      out += `<button type="button" data-d="${iso}" class="${past ? 'past' : bk ? 'bk' : 'free'}${selDate === iso ? ' sel' : ''}${+dt === +today ? ' today' : ''}" ${past || bk ? 'disabled' : ''} aria-pressed="${selDate === iso}" aria-label="${dt.toDateString()} ${bk ? 'booked' : past ? 'past' : 'available'}">${d}</button>`;
    }
    $('#cal').innerHTML = out; $('#usedate').disabled = !selDate;
    $('#usedate').textContent = selDate ? `Use ${fmt(selDate, { day: 'numeric', month: 'short' })}` : 'Use this date';
  }
  $('#cal').addEventListener('click', e => { const b = e.target.closest('button[data-d]'); if (!b || b.disabled) return; selDate = b.dataset.d; renderCal(); });
  $('#prev').onclick = () => { cur.setMonth(cur.getMonth() - 1); renderCal(); };
  $('#next').onclick = () => { cur.setMonth(cur.getMonth() + 1); renderCal(); };
  sel.onchange = () => { selDate = null; renderCal(); };
  $('#usedate').onclick = () => { $('#b-hall').value = sel.value; $('#b-date').value = selDate; lastH = null; go('book'); };

  /* ---------- booking ---------- */
  $('#b-hall').innerHTML = '<option value="">Select hall</option>' + HALLS.map(h => `<option value="${h.id}">${h.name} – from ${inr(h.price)}</option>`).join('');
  $('#b-date').min = iso0(new Date());
  let lastH = null;
  function tiles() {
    const v = $('#b-hall').value;
    $('#b-tiles').innerHTML = HALLS.map(h => `<button type="button" class="tile${v === h.id ? ' on' : ''}" data-h="${h.id}" aria-pressed="${v === h.id}"><span class="ti"><i data-lucide="building-2"></i></span><b>${h.short}</b><small>${h.cap.toLocaleString('en-IN')} guests · ${inr(h.price)}</small></button>`).join('');
    icons();
  }
  $('#b-tiles').addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (!b) return; $('#b-hall').value = b.dataset.h; $('#b-hall').dispatchEvent(new Event('input')); });
  function renderBook(prefill) {
    if (prefill && state.booking && !$('#b-date').value) { const b = state.booking; $('#b-type').value = b.type; $('#b-hall').value = b.hall; $('#b-date').value = b.date; $('#b-guests').value = b.guests; }
    const h = $('#b-hall').value, g = +$('#b-guests').value || 0, hint = $('#b-hint');
    if (lastH !== h) { lastH = h; tiles(); }
    hint.textContent = h ? `${hall(h).short} fits up to ${hall(h).cap.toLocaleString('en-IN')} guests.` : '';
    hint.classList.toggle('warn', !!h && g > hall(h).cap);
    const d = $('#b-date').value;
    $('#b-sum').innerHTML = h
      ? `<div class="evimg"><span><b>${hall(h).short}</b><small>Up to ${hall(h).cap.toLocaleString('en-IN')} guests</small></span></div><div class="sumline"><span>Date</span><b>${d ? fmt(d) : 'Not chosen'}</b></div><div class="sumline"><span>Guests</span><b>${g}</b></div><div class="sumline"><span>Hall charge</span><b>${inr(hall(h).price)}</b></div><div class="sumline tot"><span>Estimate</span><span>${inr(hall(h).price)}</span></div>`
      : '<p>Choose a hall to see your estimate.</p>';
    icons();
  }
  ['b-hall', 'b-date', 'b-guests'].forEach(i => $('#' + i).addEventListener('input', () => renderBook()));
  $('#bookform').addEventListener('submit', e => {
    e.preventDefault();
    const type = $('#b-type').value, h = $('#b-hall').value, d = $('#b-date').value, g = +$('#b-guests').value;
    if (!type || !h || !d || !(g >= 10)) { toast('Please complete every field (minimum 10 guests).'); return; }
    if (day(d) < todayMid()) { toast('Please choose a future date.'); return; }
    if (g > hall(h).cap) { toast(`${hall(h).short} fits up to ${hall(h).cap.toLocaleString('en-IN')} guests. Choose a larger hall or fewer guests.`); return; }
    if (booked(h, day(d))) { toast('That date is already booked for this hall. Try another date.'); return; }
    const changed = !state.booking || state.booking.hall !== h || state.booking.date !== d || +state.booking.guests !== g;
    state.booking = { type, hall: h, date: d, guests: String(g) };
    if (changed) state.paid = [false, false, false];
    save(); window.AureliaConfetti && window.AureliaConfetti();
    toast('Date reserved! Now pick your add-ons.'); go('addons');
  });

  /* ---------- add-ons ---------- */
  function row(a) {
    const q = state.addons[a.id] || 0;
    return `<div class="addon"><span class="athumb"><i data-lucide="${AIC[a.id]}"></i></span><div class="ai"><b>${a.name}</b><small>${a.note} · ${inr(a.price)}</small></div><div class="qty"><button type="button" data-a="${a.id}" data-s="-1" aria-label="Remove one ${a.name}">−</button><span aria-live="polite">${q}</span><button type="button" data-a="${a.id}" data-s="1" aria-label="Add one ${a.name}">+</button></div></div>`;
  }
  function renderAddons() {
    $('#ad-cat').innerHTML = CAT.map(row).join(''); $('#ad-dec').innerHTML = DEC.map(row).join('');
    const lines = ALL.filter(a => state.addons[a.id]).map(a => `<div class="sumline"><span>${a.name} × ${state.addons[a.id]}${a.perGuest ? ' × ' + guests() + ' guests' : ''}</span><b>${inr(state.addons[a.id] * a.price * (a.perGuest ? guests() : 1))}</b></div>`);
    $('#ad-sum').innerHTML = (lines.join('') || '<p>Nothing selected yet. Use + to add catering or decor.</p>') + `<div class="sumline tot"><span>Add-ons total</span><span>${inr(addonTotal())}</span></div>` +
      (state.booking ? `<div class="sumline"><span>Hall</span><b>${inr(hall(state.booking.hall).price)}</b></div><div class="sumline tot"><span>Event total</span><span>${inr(total())}</span></div>` : '<p class="hint" style="margin-top:10px">Reserve a date to add the hall charge to your total.</p>');
    icons();
  }
  ['#ad-cat', '#ad-dec'].forEach(s => $(s).addEventListener('click', e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const id = b.dataset.a; state.addons[id] = Math.max(0, Math.min(10, (state.addons[id] || 0) + +b.dataset.s)); save(); renderAddons(); paintNotes();
  }));
  $('#ad-save').onclick = () => { save(); toast('Add-ons saved to your booking.'); go('overview'); };

  /* ---------- payments ---------- */
  function renderPay() {
    const parts = split(), dd = dueDates(), t = total(), paid = paidAmt();
    $('#pm-t').textContent = inr(t); $('#pm-p').textContent = inr(paid); $('#pm-d').textContent = inr(t - paid); $('#pm-bar').style.width = (t ? paid / t * 100 : 0) + '%';
    $('#pm-body').innerHTML = !state.booking ? '<p>Book an event to see your installment plan.</p>' :
      ['40% · Booking', '30% · Midway', '30% · Final'].map((n, i) => `<div class="inst${state.paid[i] ? ' paid' : ''}"><span class="num">${state.paid[i] ? '✓' : i + 1}</span><div class="ii"><b>${n}</b><small>${i === 0 ? dd[0] : 'Due ' + dd[i]}</small></div><b class="ia">${inr(parts[i])}</b>${state.paid[i] ? '<span class="badge2 paid">Paid</span>' : `<button class="btn btn-primary btn-sm" type="button" data-pay="${i}">Pay now</button>`}</div>`).join('');
    $('#dl').hidden = !state.booking;
    icons();
  }
  $('#pm-body').addEventListener('click', e => {
    const b = e.target.closest('[data-pay]'); if (!b) return;
    state.paid[+b.dataset.pay] = true; save(); renderPay(); paintNotes(); toast('Payment recorded. Thank you!');
  });
  $('#dl').onclick = () => {
    const b = state.booking; if (!b) return;
    const lines = ['AURELIA BANQUETS & CELEBRATIONS – Event summary', '', `Client: ${state.profile.name}`, `Event: ${b.type}`, `Hall: ${hall(b.hall).short}`, `Date: ${fmt(b.date)}`, `Guests: ${b.guests}`, '',
      ...ALL.filter(a => state.addons[a.id]).map(a => `${a.name} x ${state.addons[a.id]}: ${inr(state.addons[a.id] * a.price * (a.perGuest ? guests() : 1))}`),
      '', `Event total: ${inr(total())}`, `Paid: ${inr(paidAmt())}`, `Balance: ${inr(total() - paidAmt())}`];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
    const a = document.createElement('a'); a.href = url; a.download = 'aurelia-event-summary.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
    toast('Summary downloaded.');
  };

  /* ---------- profile ---------- */
  const fillProfile = () => { $('#s-n').value = state.profile.name; $('#s-e').value = state.profile.email; $('#s-p').value = state.profile.phone; };
  fillProfile();
  /* capture phase: read the values before main.js resets the form after a valid submit */
  $('#p-settings form[data-validate]').addEventListener('submit', () => {
    const n = $('#s-n').value.trim(), m = $('#s-e').value.trim(), p = $('#s-p').value.trim();
    if (n && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m) && /^[+\d][\d\s-]{8,14}$/.test(p)) {
      state.profile = { name: n, email: m, phone: p }; save(); paintIdentity(); toast('Profile saved.');
    }
    setTimeout(fillProfile, 0);
  }, true);

  /* ---------- chat ---------- */
  const chat = $('#chat');
  function bubble(m) { const d = document.createElement('div'); d.className = 'bub' + (m.me ? ' me' : ''); d.textContent = m.t; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; }
  chat.innerHTML = ''; bubble({ t: WELCOME }); state.msgs.forEach(bubble);
  const REPLIES = ['Thanks! Your planner will reply shortly.', 'Noted. We’ll check this and get back to you today.', 'Great idea! We’ll share a few options with you.'];
  $('#chatform').addEventListener('submit', e => {
    e.preventDefault(); const i = $('#cm'), v = i.value.trim(); if (!v) return;
    const mine = { t: v, me: true }; state.msgs.push(mine); bubble(mine); i.value = ''; save();
    setTimeout(() => { const r = { t: REPLIES[state.msgs.length % REPLIES.length] }; state.msgs.push(r); save(); bubble(r); paintNotes(); icons(); }, 700);
  });

  /* ---------- start ---------- */
  paintIdentity();
  const start = (location.hash || '#overview').slice(1);
  go(start);
  setTimeout(() => { window.AureliaToggles?.bindToggles(); icons(); }, 0);
  window.addEventListener('load', () => { icons(); window.AureliaToggles?.bindToggles(); });
})();
