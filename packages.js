/* AURELIA – packages.js : live estimate builder (package, guests, add-ons, installments) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const form = $('#build'); if (!form) return;

  const PKG = {
    silver:   { name: 'Silver',   price: 85000,  cap: 100,  next: 'gold' },
    gold:     { name: 'Gold',     price: 240000, cap: 300,  next: 'platinum' },
    platinum: { name: 'Platinum', price: 590000, cap: 1000, next: null }
  };
  const ADD = {
    bar:   { name: 'Beverage bar', price: 250,   perGuest: true },
    cake:  { name: 'Custom cake',  price: 6500 },
    decor: { name: 'Theme decor',  price: 18000 }
  };
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const state = { pkg: 'gold', guests: 150, add: {} };

  const range = $('#pkGuests'), val = $('#pkGuestVal'), fit = $('#pkFit');
  const icons = () => window.lucide && window.lucide.createIcons();

  function setPkg(p) {
    if (!PKG[p]) return;
    state.pkg = p;
    const r = $(`input[name="pkg"][value="${p}"]`); if (r) r.checked = true;
    render();
  }

  function render() {
    const p = PKG[state.pkg], g = state.guests;
    val.innerHTML = `${g.toLocaleString('en-IN')}<small>guests</small>`;
    range.style.background = '';

    // fit message
    const best = Object.keys(PKG).find(k => g <= PKG[k].cap) || 'platinum';
    if (g <= p.cap) {
      fit.className = 'pk-fit';
      fit.innerHTML = `<i data-lucide="check-circle-2"></i><span>${p.name} hosts up to ${p.cap.toLocaleString('en-IN')} guests, so ${g.toLocaleString('en-IN')} fits comfortably.</span>`;
    } else {
      fit.className = 'pk-fit warn';
      fit.innerHTML = `<i data-lucide="alert-triangle"></i><span>${p.name} hosts up to ${p.cap.toLocaleString('en-IN')} guests. ${PKG[best].name} suits ${g.toLocaleString('en-IN')}.</span><button type="button" data-switch="${best}">Switch to ${PKG[best].name}</button>`;
    }

    // lines + totals
    const lines = [[`${p.name} package`, p.price]];
    let total = p.price;
    Object.keys(ADD).forEach(id => {
      if (!state.add[id]) return;
      const a = ADD[id], amt = a.price * (a.perGuest ? g : 1);
      lines.push([a.perGuest ? `${a.name} · ${g.toLocaleString('en-IN')} guests` : a.name, amt]);
      total += amt;
    });
    $('#pkLines').innerHTML = lines.map(l => `<div class="pk-line"><span>${l[0]}</span><b>${inr(l[1])}</b></div>`).join('');
    $('#pkTotal').textContent = inr(total);
    $('#pkI1').textContent = inr(total * .4);
    $('#pkI2').textContent = inr(total * .3);
    $('#pkI3').textContent = inr(total * .3);
    icons();
  }

  $$('input[name="pkg"]').forEach(r => r.addEventListener('change', () => setPkg(r.value)));
  range.addEventListener('input', () => { state.guests = +range.value; render(); });
  $$('.pk-add').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.id; state.add[id] = !state.add[id];
    b.setAttribute('aria-pressed', state.add[id]); render();
  }));
  fit.addEventListener('click', e => { const b = e.target.closest('[data-switch]'); if (b) setPkg(b.dataset.switch); });

  // "Customise …" buttons on the tier cards pre-select that package
  $$('[data-pkg]').forEach(a => a.addEventListener('click', () => setPkg(a.dataset.pkg)));

  render();
})();
