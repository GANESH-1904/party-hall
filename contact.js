/* AURELIA – contact.js : live open/closed status, today's hours, gallery moodboard prefill */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const d = new Date(), day = d.getDay(), hr = d.getHours() + d.getMinutes() / 60;
  const hrs = n => n === 0 ? [10, 18] : [9, 21];
  const fmt = h => `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
  const [o, c] = hrs(day), open = hr >= o && hr < c;
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const live = $('#ctLive');
  if (live) {
    live.textContent = open ? `Open now · closes ${fmt(c)}` : 'Closed now · back soon';
    ['ctDot', 'ctDot2'].forEach(id => { const e = document.getElementById(id); if (e) e.classList.toggle('open', open); });
    $('#ctState').textContent = open ? 'We’re open' : 'We’re closed';
    let nextDay = day, nextOpen = o;
    if (!open) { if (hr >= c) nextDay = (day + 1) % 7; nextOpen = hrs(nextDay)[0]; }
    $('#ctNext').textContent = open ? `The events desk is staffed until ${fmt(c)} today.` : `Next open: ${hr < o ? 'today' : names[nextDay]} at ${fmt(nextOpen)}. Leave a message and we will reply within one working day.`;
    const t = $(`.ct-day[data-d="${day}"]`); if (t) t.classList.add('today');
  }
  const mood = new URLSearchParams(location.search).get('mood'), msg = $('#m');
  if (mood && msg && !msg.value) msg.value = `I loved these photographs in your gallery: ${mood}. Could we talk about recreating the look?`;
})();
