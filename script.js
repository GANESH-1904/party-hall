const HALLS=[
{id:'h1',k:'hall1',f:'featBall',am:['AC','Stage & LED wall','Valet parking','Bridal suite'],name:'The Aurelia Grand Ballroom',cap:600,types:['Wedding','Reception','Corporate'],price:180000,d:'Crystal chandeliers, a 40-foot stage and a sprung dance floor for the biggest nights.'},
{id:'h2',k:'hall2',f:'featRose',am:['AC','Garden lawn','Bridal suite'],name:'Rose Court',cap:300,types:['Wedding','Engagement','Birthday'],price:95000,d:'A pillarless hall with warm lighting and an attached garden lawn for ceremonies.'},
{id:'h3',k:'hall3',f:'featLounge',am:['AC','Bar counter','LED wall'],name:'The Sapphire Lounge',cap:150,types:['Birthday','Corporate','Engagement'],price:55000,d:'A modern lounge with a bar counter, LED wall and private green room.'},
{id:'h4',k:'hall4',am:['Open-air','Fairy lights','Sunset views'],name:'Marigold Terrace',cap:200,types:['Wedding','Engagement','Reception'],price:70000,d:'An open-air rooftop terrace with fairy-light canopy, ideal for evening functions.'},
{id:'h5',k:'hall5',am:['AC','Projector','Private entry'],name:'The Pearl Room',cap:80,types:['Birthday','Corporate','Engagement'],price:30000,d:'An intimate room for small gatherings, baby showers and boardroom dinners.'}];
const CATERING=[{id:'c1',name:'Classic Veg Feast (per plate)',price:650},{id:'c2',name:'Premium Multi-Cuisine (per plate)',price:950},{id:'c3',name:'Royal Non-Veg Banquet (per plate)',price:1250},{id:'c0',name:'No catering (own caterer)',price:0}];
const DECOR=[{id:'d1',name:'Floral entrance & aisle',price:45000},{id:'d2',name:'Royal stage backdrop',price:80000},{id:'d3',name:'Fairy-light ceiling',price:25000},{id:'d4',name:'DJ, sound & lighting',price:35000}];
const PACKAGES=[
{name:'Silver Soiree',price:'₹1,20,000',sub:'Up to 100 guests',items:['Pearl Room or Sapphire Lounge','Classic veg menu (100 plates)','Basic floral decor','4 hours of hall access','Free parking']},
{name:'Gold Gala',price:'₹3,50,000',sub:'Up to 250 guests',hot:1,items:['Rose Court or Marigold Terrace','Premium multi-cuisine (250 plates)','Stage backdrop & fairy lights','DJ, sound & lighting','8 hours of hall access','Bridal suite']},
{name:'Platinum Royale',price:'₹7,80,000',sub:'Up to 500 guests',items:['Aurelia Grand Ballroom','Royal non-veg banquet (500 plates)','Full floral & stage decor','Live band or DJ','Valet parking & coordinator','Two rooms for guests']}];
const fmt=n=>'₹'+Number(n).toLocaleString('en-IN');

(function(){
const P={sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',chev:'<path d="M6 9l6 6 6-6"/>',ur:'<path d="M7 17L17 7M7 7h10v10"/>',arr:'<path d="M7 17L17 7M7 7h10v10"/>',up:'<path d="M12 19V5M5 12l7-7 7 7"/>',
pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',mail:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 7L2 7"/>',phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
ig:'<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01"/>',fb:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',yt:'<path d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.900 0-8.600.4a2.800 2.800 0 0 0-2 2A29 29 0 0 0 1 11.800a29 29 0 0 0 .4 5.300 2.800 2.800 0 0 0 2 1.900c1.700.5 8.600.5 8.600.5s6.900 0 8.600-.5a2.800 2.800 0 0 0 2-1.900 29 29 0 0 0 .4-5.300 29 29 0 0 0-.5-5.400z"/><path d="M9.800 15l5.700-3.300L9.800 8.500z"/>',tt:'<path d="M16 3v10.500a4.500 4.500 0 1 1-4.500-4.500M16 3c.3 2.500 2 4.200 5 4.500"/>',li:'<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>',wa:'<path d="M3 21l1.700-5A9 9 0 1 1 8 19.300z"/><path d="M9 9c0 3 3 6 6 6l1-2-2-1-1 .7a5 5 0 0 1-2-2l.7-1-1-2z"/>'};
const ic=(n,s=22)=>`<svg class="${n=='arr'?'arr':''}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const logo=`<svg class="logo-mark" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lgH" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--secondary)"/><stop offset="1" style="stop-color:var(--primary)"/></linearGradient></defs><circle cx="32" cy="32" r="29" fill="none" stroke="url(#lgH)" stroke-width="2.6"/><circle cx="32" cy="32" r="24.5" fill="none" class="logo-hair" stroke-width="1" stroke-dasharray="1 4.2" stroke-linecap="round"/><path d="M19.5 47.5 32 21l12.5 26.5" fill="none" stroke="url(#lgH)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 47.5V39a6 6 0 0 1 12 0v8.5" fill="none" class="logo-arc" stroke-width="2.8" stroke-linecap="round"/><path d="M32 9.5c.7 3.6 1.9 4.8 5.5 5.5-3.6.7-4.8 1.9-5.5 5.5-.7-3.600-1.900-4.800-5.500-5.500 3.600-.7 4.800-1.900 5.500-5.500z" class="logo-star"/></svg>`;
const brand=`<a class="brand" href="index.html" aria-label="Aurelia Hall home">${logo}<span><b>AURELIA</b><small>BANQUETS &amp; CELEBRATIONS</small></span></a>`;
window.toast=m=>{const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)};
const root=document.documentElement,S=localStorage;
root.dataset.theme=S.getItem('aurelia_theme')||'dark';root.dir=S.getItem('aurelia_dir')||'ltr';
if(S.getItem('aurelia_keep')==='0'&&!sessionStorage.getItem('aurelia_sess'))S.removeItem('aurelia_user');
const f=location.pathname.split('/').pop()||'index.html',on=n=>f==n?'on':'',user=S.getItem('aurelia_user');
const esc2=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));let uNm='';try{const U=JSON.parse(S.getItem('aurelia_users')||'null')||{};uNm=(U[user]&&U[user].name)||String(user||'').split('@')[0]}catch(e){uNm=String(user||'').split('@')[0]}const acct=user?`<button class="btn login ghost" id="so" type="button">Sign out</button>`:`<a class="btn login" href="login.html">Sign in</a>`;
document.getElementById('hdr').innerHTML=`<progress class="prog" id="pg" value="0" max="100"></progress><header class="site"><div class="wrap hd">${brand}
<nav class="main" id="nv"><div class="dd"><a href="index.html" class="${on('index.html')||on('home2.html')}">Home <span class="ch">${ic('chev',14)}</span></a><div class="dd-m"><a href="index.html">Home 1</a><a href="home2.html">Home 2</a></div></div>
<a href="about.html" class="${on('about.html')}">About</a><a href="halls.html" class="${on('halls.html')}">Halls</a><a href="packages.html" class="${on('packages.html')}">Packages</a><a href="gallery.html" class="${on('gallery.html')}">Gallery</a><a href="dashboard.html" class="${on('dashboard.html')}">Dashboard ${ic('ur',16)}</a></nav>
<div class="acts"><button class="ib" id="th" aria-label="Toggle light or dark theme"></button><button class="ib" id="rt" aria-label="Toggle right-to-left layout"></button>${acct}<button class="ib burger" id="bg" aria-label="Menu">${ic('menu')}</button></div></div></header>`;
const so=document.getElementById('so');if(so)so.onclick=()=>{S.removeItem('aurelia_user');sessionStorage.removeItem('aurelia_sess');location.href='index.html'};
const th=document.getElementById('th'),rt=document.getElementById('rt');
const paint=()=>{th.innerHTML=ic(root.dataset.theme=='dark'?'sun':'moon');rt.textContent=root.dir=='rtl'?'LTR':'RTL'};paint();
th.onclick=()=>{root.dataset.theme=root.dataset.theme=='dark'?'light':'dark';S.setItem('aurelia_theme',root.dataset.theme);paint()};
rt.onclick=()=>{root.dir=root.dir=='rtl'?'ltr':'rtl';S.setItem('aurelia_dir',root.dir);paint()};
document.getElementById('bg').onclick=()=>document.getElementById('nv').classList.toggle('open');
const soc=[['ig','Instagram'],['fb','Facebook'],['yt','YouTube'],['tt','TikTok'],['li','LinkedIn'],['wa','WhatsApp']].map(s=>`<a href="#" aria-label="${s[1]}">${ic(s[0],24)}</a>`).join('');
const card=(i,l,v)=>`<div class="ic-card"><div class="t">${ic(i,28)}</div><div><small>${l}</small><span>${v}</span></div></div>`;
const cta=['login.html','dashboard.html'].includes(f)?'':`<section class="cta confetti"><div class="wrap"><div><span class="tagline">Your date is waiting</span><h2>Let’s plan your grand celebration</h2><p>Pick a date, choose your menu and decor, and pay in three easy installments.</p></div><div class="bts"><a class="btn" href="dashboard.html">Check availability</a><a class="btn ghost" href="#" data-enquire>Book a visit</a></div></div></section>`;
document.getElementById('ftr').innerHTML=`${cta}<footer class="site confetti"><div class="wrap"><div class="fgrid">
<div><div class="fh">${brand}</div><p class="ftag">Where every celebration begins.</p><p class="fdesc">Five elegant halls, in-house catering and decor for weddings, birthdays and corporate evenings. By appointment, in Chengalpattu.</p><div class="soc">${soc}</div></div>
<div><div class="fh"><h4>Explore</h4></div><ul><li><a href="index.html">Home 1</a></li><li><a href="home2.html">Home 2</a></li><li><a href="about.html">About</a></li><li><a href="halls.html">Halls</a></li><li><a href="packages.html">Packages</a></li><li><a href="gallery.html">Gallery</a></li></ul></div>
<div><div class="fh"><h4>Client care</h4></div><ul><li><a href="dashboard.html">Book a date</a></li><li><a href="#" data-enquire>Book a venue visit</a></li><li><a href="login.html">Client portal</a></li><li><a href="packages.html">Add-ons</a></li><li><a href="index.html#reviews">Reviews</a></li></ul></div>
<div><div class="fh"><h4>Find the venue</h4></div><ul class="vn"><li><span class="dot" id="dt"></span><span id="st"></span></li><li>${ic('pin',18)}<span>12 Celebration Avenue, Chengalpattu, Tamil Nadu, India</span></li><li>${ic('mail',18)}<span>hello@aureliahall.example</span></li><li>${ic('phone',18)}<span>+91 98765 43210</span></li><li>${ic('clock',18)}<span>Mon–Sat 9 AM – 9 PM<br>Sun 10 AM – 6 PM</span></li></ul></div>
</div><div class="copy"><span>© ${new Date().getFullYear()} Aurelia Hall. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>
<button class="fab" id="up" aria-label="Back to top">${ic('up',24)}</button><a class="fab" id="wa" href="https://wa.me/919876543210" aria-label="Chat on WhatsApp">${ic('wa',32)}</a>`;
const d=new Date(),h=d.getHours(),sun=d.getDay()==0,open=sun?(h>=10&&h<18):(h>=9&&h<21);
document.getElementById('dt').className='dot'+(open?' on':'');document.getElementById('st').textContent=open?'Open now · closes '+(sun?'6 PM':'9 PM'):'Closed · opens Mon–Sat 9 AM';
const up=document.getElementById('up');up.onclick=()=>scrollTo({top:0,behavior:'smooth'});onscroll=()=>up.classList.toggle('show',scrollY>300);
})();
(function(){if(!document.getElementById('feat'))return;
document.getElementById('feat').innerHTML=HALLS.slice(0,3).map(h=>`<div class="card"><div class="img bg-${h.f} g-${h.id}"><span>${h.cap} guests</span></div><div class="body"><h3>${h.name}</h3><p>${h.d}</p><a class="btn sm" href="dashboard.html?hall=${h.id}">Check dates</a></div></div>`).join('')})();
(function(){if(!document.getElementById('list'))return;
const ft=document.getElementById('ft'),fc=document.getElementById('fc'),L=document.getElementById('list');
let sv=[];try{sv=JSON.parse(localStorage.getItem('aurelia_short')||'[]')}catch(e){}
const q=new URLSearchParams(location.search).get('type');if(q&&[...ft.options].some(o=>o.value==q))ft.value=q;
function draw(){const r=HALLS.filter(h=>(!ft.value||h.types.includes(ft.value))&&h.cap>=+fc.value);
L.innerHTML=r.length?r.map(h=>`<div class="card"><div class="img bg-${h.k} g-${h.id}"><button class="heart ${sv.includes(h.id)?'on':''}" data-h="${h.id}" aria-pressed="${sv.includes(h.id)}" aria-label="Save ${h.name} to shortlist">♥</button><span>Up to ${h.cap} guests</span></div><div class="body"><h3>${h.name}</h3><div>${h.types.map(t=>`<span class="tag">${t}</span>`).join('')}</div><p>${h.d}</p><div>${h.am.map(a=>`<span class="tag am">✓ ${a}</span>`).join('')}</div><div class="price">${fmt(h.price)} <small class="unit">per event</small></div><a class="btn sm" href="dashboard.html?hall=${h.id}">Check availability</a></div></div>`).join(''):'<p>No halls match these filters. Try a lower capacity or a different event type.</p>'}
L.onclick=e=>{const b=e.target.closest('.heart');if(!b)return;const id=b.dataset.h;sv=sv.includes(id)?sv.filter(x=>x!=id):[...sv,id];localStorage.setItem('aurelia_short',JSON.stringify(sv));b.classList.toggle('on',sv.includes(id));b.setAttribute('aria-pressed',sv.includes(id));toast(sv.includes(id)?'Saved to your shortlist':'Removed from your shortlist')};
ft.onchange=fc.onchange=draw;draw()})();
(function(){if(!document.getElementById('pk'))return;
document.getElementById('pk').innerHTML=PACKAGES.map(p=>`<div class="pk ${p.hot?'hot':''}"><h3>${p.name}</h3><div class="price">${p.price}</div><small>${p.sub}</small><ul>${p.items.map(i=>`<li>${i}</li>`).join('')}</ul><a class="btn" href="dashboard.html">Book this package</a></div>`).join('');
const row=a=>a.filter(x=>x.price).map(x=>`<div class="inst"><span>${x.name}</span><b>${fmt(x.price)}</b></div>`).join('');
document.getElementById('ca').innerHTML=row(CATERING);document.getElementById('de').innerHTML=row(DECOR);
})();
(function(){if(!document.getElementById('gt'))return;
const G=[['Wedding','Couple portrait session','t1',250],['Wedding','Floral lounge corner','t2',190],['Reception','Stage lights and live music','t3',210],['Reception','Dance floor energy','t4',180],['Corporate','Seated keynote evening','t5',200],['Corporate','Presentation on the big screen','t6',230],['Engagement','Candlelit engagement table','t7',180],['Birthday','Balloon-filled birthday setup','t8',240],['Birthday','Rainbow birthday cake','t9',190],['Birthday','Table balloons and sweets','t10',200]];
const cats=['All',...new Set(G.map(g=>g[0]))],gf=document.getElementById('gf'),gt=document.getElementById('gt'),lb=document.getElementById('lb'),lbi=document.getElementById('lbi');
function show(c){gt.innerHTML=G.filter(g=>c=='All'||g[0]==c).map(g=>`<button class="tile bg-${g[2]} th-${g[3]}" data-k="${g[2]}" data-c="${g[1]}">${g[1]}</button>`).join('');
gf.querySelectorAll('button').forEach(b=>b.className='btn sm'+(b.textContent==c?'':' ghost'))}
gf.innerHTML=cats.map(c=>`<button>${c}</button>`).join('');gf.onclick=e=>e.target.tagName=='BUTTON'&&show(e.target.textContent);
let cur=0;const tl=()=>[...gt.querySelectorAll('.tile')];
const openLb=i=>{const t=tl(),n=t.length;cur=(i+n)%n;lbi.className='bg-'+t[cur].dataset.k;lbi.textContent=t[cur].dataset.c+'  ·  '+(cur+1)+' / '+n;lb.classList.add('on')};
gt.onclick=e=>{const t=e.target.closest('.tile');if(t)openLb(tl().indexOf(t))};
lb.insertAdjacentHTML('beforeend','<button class="lbn p" aria-label="Previous photo">‹</button><button class="lbn n" aria-label="Next photo">›</button>');
lb.onclick=e=>{if(e.target.classList.contains('p'))openLb(cur-1);else if(e.target.classList.contains('n'))openLb(cur+1);else lb.classList.remove('on')};
document.addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key=='Escape')lb.classList.remove('on');if(e.key=='ArrowRight')openLb(cur+1);if(e.key=='ArrowLeft')openLb(cur-1)});show('All')})();
(function(){const qs=document.getElementById('qs');if(!qs)return;
const pk=document.getElementById('pk2');pk.innerHTML=PACKAGES.map(p=>`<div class="pk ${p.hot?'hot':''}"><h3>${p.name}</h3><div class="price">${p.price}</div><small>${p.sub}</small><ul>${p.items.slice(0,4).map(i=>`<li>${i}</li>`).join('')}</ul><a class="btn" href="packages.html">View package</a></div>`).join('');
qs.onsubmit=e=>{e.preventDefault();const g=+document.getElementById('qg').value,t=document.getElementById('qt').value;
const m=HALLS.filter(h=>h.cap>=g&&h.types.includes(t)).sort((a,b)=>a.price-b.price)[0];
if(!m)return toast('No hall fits that guest count and event type. Try fewer guests.');location.href='dashboard.html?hall='+m.id}})();

(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=i=>document.getElementById(i);
const td=(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})();
const pr=s=>new Date(s+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
/* ---------- hero card bars ---------- */
if($('hcH')){$('hcH').innerHTML=HALLS.map(h=>`<option value="${h.id}">${h.name}</option>`).join('');$('hcD').min=td;$('hcCheck').onsubmit=e=>{e.preventDefault();location.href=`dashboard.html?hall=${$('hcH').value}&date=${$('hcD').value}`}}
if($('hcFit')){const upd=()=>{const g=+$('hfG').value||0,t=$('hfT').value,m=HALLS.filter(h=>h.cap>=g&&h.types.includes(t)).sort((a,b)=>a.price-b.price)[0];
$('hfR').innerHTML=m?`<span><b>${m.name}</b><br><small>Up to ${m.cap} guests · from ${fmt(m.price)}</small></span><a class="btn sm" href="dashboard.html?hall=${m.id}">Check dates</a>`:'<small>No hall fits that count. Try fewer guests.</small>'};
$('hcFit').oninput=upd;$('hcFit').onsubmit=e=>e.preventDefault();upd()}
if($('hcQuick')){$('pqC').innerHTML=CATERING.filter(c=>c.price).map(c=>`<option value="${c.price}">${c.name.replace(' (per plate)','')}</option>`).join('');
const upd=()=>{const g=+$('pqG').value||0,p=+$('pqC').value;$('pqR').innerHTML=`<span><b>${fmt(g*p)}</b><br><small>catering for ${g} guests</small></span><a class="btn sm" href="#estimator">Full estimate</a>`};
$('hcQuick').oninput=upd;$('hcQuick').onsubmit=e=>e.preventDefault();upd()}
if($('hcVisit')){$('gvD').min=td;$('hcVisit').onsubmit=e=>{e.preventDefault();const a=document.createElement('a');a.href='#';a.setAttribute('data-enquire','');document.body.appendChild(a);a.click();a.remove();$('et').value=$('gvT').value;if($('gvD').value)$('edt').value=$('gvD').value}}
if($('abSt')){const d=new Date(),h=d.getHours(),sun=d.getDay()==0,open=sun?(h>=10&&h<18):(h>=9&&h<21);$('abSt').textContent=open?'Open now · closes '+(sun?'6 PM':'9 PM'):'Closed now · opens Mon–Sat 9 AM'}
if($('demoFill'))$('demoFill').onclick=()=>{$('e').value='demo@aurelia.com';$('p').value='demo123';toast('Demo login filled. Press Log in.')};
window.hcNext=()=>{if(!$('nxP'))return;let b=[];try{b=JSON.parse(localStorage.getItem('aurelia_bookings')||'[]')}catch(e){}
const me=localStorage.getItem('aurelia_user'),up=b.filter(x=>x.user==me&&x.date>=td).sort((a,c)=>a.date<c.date?-1:1)[0];
if(!up){$('nxP').textContent='No upcoming bookings yet. Pick a hall and date below to get started.';$('nxD').innerHTML='<label>Status</label><span>Nothing booked</span>';$('nxA').innerHTML='<a class="btn sm" href="#bookTop">Start booking</a>';return}
const hall=HALLS.find(h=>h.id==up.hall),dd=Math.round((new Date(up.date+'T00:00:00')-new Date(td+'T00:00:00'))/864e5);
$('nxP').textContent=up.type+' at '+hall.name;$('nxD').innerHTML='<label>Date</label><span>'+pr(up.date)+'</span>';$('nxA').innerHTML=`<span><b>${dd}</b><br><small>${dd==1?'day':'days'} to go</small></span>`};hcNext();
/* ---------- content blocks ---------- */
const REV=[['Priya & Karthik','Wedding · Grand Ballroom','The team handled 450 guests without a single hiccup. Our wedding felt effortless.'],['Rahul M.','Corporate dinner · Sapphire Lounge','Tracking every installment online meant no chasing and no confusion.'],['Divya S.','Anniversary · Marigold Terrace','The terrace at sunset made my parents’ 60th unforgettable.'],['Imran & Sana','Engagement · Rose Court','Booking the date and choosing the menu took one evening. The food was the talk of the night.'],['Meera R.','Birthday · Pearl Room','Perfect size for 60 guests. The decor team matched my theme exactly.'],['Arun K.','Product launch · Sapphire Lounge','The LED wall and sound were flawless. Our guests asked to book it again.']];
const FAQ={home:[['How far ahead should I book?','Popular wedding dates fill four to six months ahead. Weekday and off-peak dates are often available at shorter notice.'],['Can I visit before I book?','Yes. Use the Book a venue visit button, pick a date and we will call you to confirm a time.'],['Do you provide catering and decor?','Both are in-house. Choose a menu and decor add-ons in your dashboard, or bring your own caterer.'],['Can I pay in installments?','Yes. Your total is split 40/30/30 and every installment is tracked in your dashboard.']],
halls:[['What does the hall price include?','Hall rental, air-conditioning, power backup, parking, standard lighting and a coordinator. Catering and decor are add-ons.'],['Are there time limits?','Standard bookings run eight hours. Extra hours can be added on request, subject to availability.'],['Can I bring an outside decorator?','Yes, after a quick walkthrough with our team. Our in-house decor studio is also available.'],['Which hall suits 200 guests?','Marigold Terrace and Rose Court both work well. Use the Which hall fits? card at the top for a quick match.']],
packages:[['Can I customise a package?','Yes. Start from any package and add or remove catering and decor items in your dashboard.'],['Is there a menu tasting?','Every booking includes a free tasting for four people before you confirm your menu.'],['Are taxes included?','Prices shown are estimates before taxes. Your final quote lists everything clearly.'],['What if I need to change the date?','One free date change is included up to 30 days before your event, subject to availability.']],
gallery:[['Can you recreate a setup I like?','Yes. Share the photo at your decor consultation and our studio will plan and price it.'],['Can I hire my own photographer?','Yes. Outside photographers are welcome, and we can recommend trusted partners.'],['Are these photos from real events?','These are inspiration images from Unsplash. Photos from your own event can be shared after your celebration.']],
login:[['I forgot my password. What now?','This demo stores accounts in your browser. Create a new account or use the demo login shown above.'],['Is my data safe?','In this demo, everything stays in your browser. A live site would use secure server-side storage.'],['Can I change my event date?','Yes. Cancel from your dashboard to release the date and book a new one, or ask us about a free date change.'],['How do payments work?','Pay the first installment when you confirm. The next two are due before your event and tracked in your dashboard.']],
dashboard:[['How do installments work?','Your total is split into 40%, 30% and 30%. The first is paid when you confirm, and the next two fall due before your event.'],['Can I add decor after booking?','Yes. Ask our team and we will update your total and installment plan.'],['How do I get a receipt?','Use Print receipt on any booking. You can also add the date to your calendar or share it on WhatsApp.'],['What happens if I cancel?','Cancelling releases the date immediately. Our team will confirm any refund based on your payment stage.']]};
const EVE={Wedding:[['5:00 PM','Guests arrive, welcome drinks and live music'],['6:00 PM','Entrance of the couple on the stage'],['6:30 PM','Ceremony and rituals'],['8:00 PM','Dinner served at live counters'],['9:30 PM','Cake cutting and the dance floor opens'],['11:00 PM','Farewell and send-off']],Birthday:[['6:00 PM','Guests arrive, mocktails and photo booth'],['7:00 PM','Games and performances'],['8:00 PM','Cake cutting with a fairy-light backdrop'],['8:30 PM','Buffet dinner and dessert counter'],['9:30 PM','DJ and dancing'],['10:30 PM','Return gifts and goodbye']],Corporate:[['6:00 PM','Registration and networking'],['7:00 PM','Welcome note and awards'],['7:45 PM','Keynote on the LED wall'],['8:30 PM','Seated gala dinner'],['9:30 PM','Live entertainment'],['10:30 PM','Close and shuttle pick-up']]};
const IDEAS={Wedding:['idWed',['Greet guests with a floral aisle and soft lighting','Plan a golden-hour photo window before the ceremony','Match the stage backdrop to your colour palette','Keep a quiet lounge corner for elders']],Birthday:['idBday',['Pick a colour story and repeat it in balloons, cake and table linen','Add a photo corner for instant memories','Serve a dessert counter next to the cake','Schedule games before dinner while energy is high']],Corporate:['idCorp',['Seat teams across tables to encourage networking','Use the LED wall for brand messages and awards','Keep speeches short and before dinner service','Offer vegetarian and allergy-friendly options clearly marked']],Engagement:['idEng',['Use candlelight and florals for an intimate feel','Set a ring-exchange moment with a spotlight','Keep seating close so families can mingle','Plan a small dessert table for the couple']]};
const PAL=[['Royal plum & gold',[0,1,2,3,4],'Evening weddings and receptions'],['Blush & ivory',[0,1,2,3,4],'Day ceremonies and engagements'],['Emerald & champagne',[0,1,2,3,4],'Garden and terrace events'],['Sunset marigold',[0,1,2,3,4],'Haldi, mehendi and sangeet']];
const TG={"What our guests say": "Heartfelt words from our guests", "Questions, answered": "Curious? We have answers", "Trusted for every detail": "Quality you can count on", "We are here to help": "Real people, real answers", "Festive season offers": "Sparkling savings, limited time", "Best months to book": "Time your celebration", "Compare two halls": "Side by side, stage by stage", "Colour palettes to inspire your decor": "Colour your celebration", "Ideas for every occasion": "Inspiration, ready to borrow", "A sample evening at Aurelia": "From first guest to last dance", "Plan your budget": "Plan with confidence", "Entertainment and extras": "Music, memories and more", "Your shortlisted halls": "Your favourites, saved"};
const stars='★★★★★',hd=(t,l)=>`<div class="center">${TG[t]?`<span class="tagline">${TG[t]}</span>`:''}<h2>${t}</h2>${l?`<p class="lead">${l}</p>`:''}</div>`;
const tabsHtml=(names,k)=>names.map(n=>`<button class="${n==k?'on':''}" data-k="${n}">${n}</button>`).join('');
const B={
reviews:el=>{const n=+el.dataset.n||0;return `<div class="wrap">${hd('What our guests say','Real words from families and teams who celebrated with us.')}<div class="grid">${[0,1,2].map(i=>REV[(n+i)%REV.length]).map(r=>`<div class="rev"><div class="stars" aria-label="5 out of 5 stars">${stars}</div><p>“${r[2]}”</p><b>${r[0]}</b><small>${r[1]}</small></div>`).join('')}</div></div>`},
faq:el=>`<div class="wrap">${hd('Questions, answered')}<div class="faq">${FAQ[el.dataset.set].map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></div>`,
awards:()=>`<div class="wrap">${hd('Trusted for every detail')}<div class="grid c4">${[['FSSAI-licensed kitchen','Food prepared on site to licensed standards'],['Fire and safety certified','Regular audits and trained staff'],['100% power backup','Generator cover for every hall'],['4.9 guest rating','Average across 1,200+ events']].map(a=>`<div class="award"><i>✓</i><h3>${a[0]}</h3><p>${a[1]}</p></div>`).join('')}</div></div>`,
support:()=>`<div class="wrap">${hd('We are here to help','Talk to a real person about dates, menus or payments.')}<div class="grid">
<div class="panel sup"><h3>Chat on WhatsApp</h3><p>Quick answers, usually within the hour.</p><a class="btn" target="_blank" rel="noopener" href="https://wa.me/919876543210">Open chat</a></div>
<div class="panel sup"><h3>Call our team</h3><p>Daily from 9 AM to 9 PM on +91 98765 43210.</p><a class="btn" href="tel:+919876543210">Call now</a></div>
<div class="panel sup"><h3>Visit the venue</h3><p>See the halls in person and taste the menu.</p><a class="btn" href="#" data-enquire>Book a visit</a></div></div></div>`,
offers:el=>{const set=(el&&el.dataset.set)||'A';return `<div class="wrap">${hd('Festive season offers','Limited-time savings on hall rental and decor.')}<div class="offer-bar"><span>Offers end in</span><b data-cd>--</b></div><div class="grid">${[['off'+set+'1','Early-bird 5% off','Book six or more months ahead and save on the hall rental.'],['off'+set+'2','Weekday events 15% off','Monday to Thursday dates in any hall.'],['off'+set+'3','Free fairy-light ceiling','Included with every Gold and Platinum package.']].map(o=>`<div class="ev bg-${o[0]} fb-1"><h3>${o[1]}</h3><p>${o[2]}</p><a class="btn sm" href="dashboard.html">Claim this offer</a></div>`).join('')}</div></div>`},
months:()=>{const M=[['Jan',90],['Feb',85],['Mar',55],['Apr',70],['May',60],['Jun',35],['Jul',30],['Aug',40],['Sep',45],['Oct',70],['Nov',100],['Dec',95]];
return `<div class="wrap">${hd('Best months to book','Demand changes through the year. Off-peak dates are easier to get and come with the best offers.')}<div class="chart" role="img" aria-label="Booking demand by month. Highest in November and December, lowest in June and July.">${M.map((m,i)=>`<div class="bar2 ${m[1]>=85?'hi':m[1]>=55?'mid':'lo'}"><i class="h${m[1]}" title="${m[0]}: ${m[1]>=85?'peak':m[1]>=55?'moderate':'off-peak'} demand"></i><span>${m[0]}</span></div>`).join('')}</div><div class="legend2"><span class="k hi"></span>Peak<span class="k mid"></span>Moderate<span class="k lo"></span>Off-peak, best value</div></div>`},
compare:()=>`<div class="wrap">${hd('Compare two halls','Pick any two halls to see capacity, price and highlights side by side.')}<div class="cmp"><div class="cmpsel"><select id="cmA" aria-label="First hall"></select><select id="cmB" aria-label="Second hall"></select></div><div class="tw" id="cmT"></div></div></div>`,
palettes:()=>`<div class="wrap">${hd('Colour palettes to inspire your decor','Tap a palette to shortlist it for your decor consultation.')}<div class="grid c4">${PAL.map((p,i)=>`<button class="palc" data-i="${i}"><span class="sw">${p[1].map((c,j)=>`<i class="sw-${i}-${j}"></i>`).join('')}</span><b>${p[0]}</b><small>${p[2]}</small></button>`).join('')}</div></div>`,
ideas:()=>`<div class="wrap">${hd('Ideas for every occasion','A few things our planners suggest for each type of event.')}<div class="menu idea"><div class="ph"><img id="idImg" alt="Decor inspiration" loading="lazy"></div><div><div class="tabs lt" id="idT"></div><ul class="tick" id="idL"></ul><a class="btn" href="#" data-enquire>Plan this with us</a></div></div></div>`,
evening:()=>`<div class="wrap">${hd('A sample evening at Aurelia','See how a typical celebration flows from the first guest to the last dance.')}<div class="tabs lt evt" id="evT"></div><div class="tl" id="evL"></div></div>`,
budget:()=>`<div class="wrap">${hd('Plan your budget','Enter a total budget and guest count for a suggested split.')}<div class="est"><div class="panel"><label for="bT">Total budget (₹)</label><input type="number" id="bT" min="50000" step="10000" value="1000000"><label for="bG">Guests</label><input type="number" id="bG" min="10" value="150"><p class="legend" id="bN"></p></div><div class="panel" id="bO"></div></div></div>`,
extras:()=>`<div class="wrap">${hd('Entertainment and extras','Add the finishing touches that guests remember.')}<div class="grid">${[['DJ, sound & lighting','₹35,000','A full sound rig, DJ and dance-floor lighting.'],['Live band','from ₹60,000','Four to six musicians for your reception or sangeet.'],['Photo & video','from ₹40,000','Candid photography and a highlight film.'],['Mehendi artists','from ₹8,000','Per artist, for ladies’ sangeet and pre-wedding events.'],['Photo booth','₹12,000','Props, instant prints and a custom backdrop.'],['Valet parking','₹6,000','Trained valets for large guest lists.']].map(x=>`<div class="panel sup"><h3>${x[0]}</h3><div class="price">${x[1]}</div><p>${x[2]}</p><a class="btn sm ghost" href="#" data-enquire>Ask about this</a></div>`).join('')}</div></div>`,
short:()=>`<div class="wrap">${hd('Your shortlisted halls','Tap the heart on any hall to save it. Choose one here to jump straight into booking.')}<div class="shl" id="shl"></div></div>`};
const INIT={
offers:el=>{const t=el.querySelector('[data-cd]'),end=new Date(new Date().getFullYear(),11,31,23,59,59);const tick=()=>{let s=Math.max(0,Math.floor((end-new Date())/1000));const d=Math.floor(s/86400);s%=86400;t.textContent=`${d} days ${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`};tick();setInterval(tick,1000)},
months:el=>{const c=el.querySelector('.chart');if(RM||!('IntersectionObserver' in window)){c.classList.add('grown');return}new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){c.classList.add('grown');o.disconnect()}}),{threshold:.4}).observe(c)},
compare:()=>{const A=$('cmA'),Bb=$('cmB'),o=HALLS.map(h=>`<option value="${h.id}">${h.name}</option>`).join('');A.innerHTML=Bb.innerHTML=o;A.value='h1';Bb.value='h2';
const rows=[['Capacity',h=>`${h.cap} guests`],['Price per event',h=>fmt(h.price)],['Hall cost per guest',h=>fmt(Math.round(h.price/h.cap))],['Best for',h=>h.types.join(', ')],['Highlights',h=>h.am.join(', ')],['',h=>`<a class="btn sm" href="dashboard.html?hall=${h.id}">Check dates</a>`]];
const draw=()=>{const a=HALLS.find(h=>h.id==A.value),b=HALLS.find(h=>h.id==Bb.value);$('cmT').innerHTML=`<table class="tbl"><thead><tr><th></th><th>${a.name}</th><th>${b.name}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1](a)}</td><td>${r[1](b)}</td></tr>`).join('')}</tbody></table>`};A.onchange=Bb.onchange=draw;draw()},
palettes:el=>{let k=+localStorage.getItem('aurelia_palette');const mark=()=>el.querySelectorAll('.palc').forEach((b,i)=>b.classList.toggle('on',i===k));if(!isNaN(k))mark();
el.onclick=e=>{const b=e.target.closest('.palc');if(!b)return;k=+b.dataset.i;localStorage.setItem('aurelia_palette',k);mark();toast(PAL[k][0]+' saved for your decor consultation')}},
ideas:()=>{let k='Wedding';const draw=()=>{$('idT').innerHTML=tabsHtml(Object.keys(IDEAS),k);const i=$('idImg');i.onerror=()=>i.removeAttribute('src');i.src=imgUrl(IDEAS[k][0],900);$('idL').innerHTML=IDEAS[k][1].map(x=>`<li>${x}</li>`).join('')};$('idT').onclick=e=>{if(e.target.dataset.k){k=e.target.dataset.k;draw()}};draw()},
evening:()=>{let k='Wedding';const draw=()=>{$('evT').innerHTML=tabsHtml(Object.keys(EVE),k);$('evL').innerHTML=EVE[k].map(r=>`<div><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')};$('evT').onclick=e=>{if(e.target.dataset.k){k=e.target.dataset.k;draw()}};draw()},
budget:()=>{const S=[['Venue',.30],['Catering',.35],['Decor',.15],['Entertainment',.08],['Photography',.07],['Other',.05]];const draw=()=>{const t=Math.max(0,+$('bT').value||0),g=Math.max(1,+$('bG').value||1);
$('bO').innerHTML=S.map(x=>`<div class="bud"><span>${x[0]}</span><em><i class="pw-${Math.round(x[1]*250)}"></i></em><b>${fmt(Math.round(t*x[1]))}</b></div>`).join('');
const pp=t*.35/g,menu=[...CATERING].filter(c=>c.price&&c.price<=pp).sort((a,b)=>b.price-a.price)[0],hall=[...HALLS].filter(h=>h.price<=t*.30&&h.cap>=g).sort((a,b)=>b.price-a.price)[0];
$('bN').textContent=`Catering works out to about ${fmt(Math.round(pp))} per guest`+(menu?`, enough for the ${menu.name.replace(' (per plate)','')}.`:', below our lowest menu. Try a smaller guest list.')+(hall?` A good hall match: ${hall.name}.`:' No hall fits this venue budget and guest count yet.')};
$('bT').oninput=$('bG').oninput=draw;draw()},
short:()=>{let sv=[];try{sv=JSON.parse(localStorage.getItem('aurelia_short')||'[]')}catch(e){}const box=$('shl');
if(!sv.length){box.innerHTML='<a href="halls.html">Browse halls and tap the heart</a>';return}
box.innerHTML=sv.map(id=>HALLS.find(h=>h.id==id)).filter(Boolean).map(h=>`<button data-h="${h.id}">${h.name}</button>`).join('');
box.onclick=e=>{const id=e.target.dataset.h;if(!id||!$('hall'))return;$('hall').value=id;$('hall').dispatchEvent(new Event('change'));document.getElementById('bookTop').scrollIntoView({behavior:'smooth'});toast('Hall selected. Now pick a date.')}}};
document.querySelectorAll('[data-block]').forEach(el=>{const k=el.dataset.block;el.innerHTML=B[k](el);if(INIT[k])INIT[k](el)});
/* ---------- effects ---------- */
if(!RM){document.querySelectorAll('.hero,.hero2,.page-head').forEach(el=>{const b=document.createElement('div');b.className='balloons';b.setAttribute('aria-hidden','true');b.innerHTML='<i></i><i></i><i></i><i></i><i></i>';el.appendChild(b)});
}
const cel=document.createElement('button');cel.id='cel';cel.className='fab';cel.setAttribute('aria-label','Celebrate with confetti');cel.textContent='✦';document.body.appendChild(cel);
cel.onclick=()=>{[.25,.5,.75].forEach((f,i)=>setTimeout(()=>window.burst&&burst(innerWidth*f,innerHeight*.45,90),i*180));toast('Cheers! Here is to your celebration.')};
})();
(function(){
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,pal=()=>{const s=getComputedStyle(document.documentElement);return['--secondary','--primary','--white'].map(v=>s.getPropertyValue(v).trim())};let COL=pal();document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#th'))COL=pal()});
const pg=document.getElementById('pg'),hd=document.querySelector('header.site');
const sc=()=>{const m=document.documentElement.scrollHeight-innerHeight;pg.value=m>0?scrollY/m*100:0;hd.classList.toggle('stuck',scrollY>10)};
addEventListener('scroll',sc,{passive:true});sc();
/* click burst overlay */
const bc=document.createElement('canvas');bc.className='burst';document.body.appendChild(bc);
const bx=bc.getContext('2d');let B=[],run=false;const fitB=()=>{bc.width=innerWidth;bc.height=innerHeight};fitB();addEventListener('resize',fitB);
function bl(){bx.clearRect(0,0,bc.width,bc.height);B=B.filter(p=>p.l>0);for(const p of B){p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=.011;bx.save();bx.globalAlpha=Math.max(p.l,0);bx.translate(p.x,p.y);bx.rotate(p.r);bx.fillStyle=p.c;bx.fillRect(-p.s,-p.s/2,p.s*2,p.s);bx.restore()}
if(B.length)requestAnimationFrame(bl);else{run=false;bx.clearRect(0,0,bc.width,bc.height)}}
window.burst=(px,py,n=140)=>{if(RM)return;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=4+Math.random()*9;B.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,s:3+Math.random()*5,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,c:COL[i%COL.length],l:1})}if(!run){run=true;requestAnimationFrame(bl)}};
document.querySelectorAll('.arch').forEach(a=>{a.title='Click to celebrate';a.onclick=e=>burst(e.clientX,e.clientY)});
if(RM)return;
/* ambient confetti + sparkles */
document.querySelectorAll('.hero,.hero2,.cta,.page-head,.hx:not(.hx-gal),footer.site').forEach(el=>{
const c=document.createElement('canvas');c.className='fx';c.setAttribute('aria-hidden','true');el.prepend(c);
const x=c.getContext('2d'),ft=el.matches('footer'),al=ft?.35:.8,dpr=Math.min(devicePixelRatio||1,2);let w=1,h=1,P=[],vis=true;
const mk=i=>({x:Math.random()*w,y:i?Math.random()*h:-10,s:2+Math.random()*4,v:.3+Math.random()*.8,r:Math.random()*6.28,vr:(Math.random()-.5)*.06,c:COL[Math.random()*COL.length|0],t:Math.random()<.35,ph:Math.random()*6.28,dx:(Math.random()-.5)*.4});
const fit=()=>{w=el.clientWidth;h=el.clientHeight;c.width=w*dpr;c.height=h*dpr;x.setTransform(dpr,0,0,dpr,0,0);P=Array.from({length:Math.min(70,Math.round(w*h/(ft?24000:15000)))},()=>mk(true))};
new ResizeObserver(fit).observe(el);new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(el);
(function loop(t){requestAnimationFrame(loop);if(!vis)return;x.clearRect(0,0,w,h);
for(const p of P){p.y+=p.v;p.x+=p.dx+Math.sin(t/900+p.ph)*.3;p.r+=p.vr;if(p.y>h+10)Object.assign(p,mk(false));
x.save();x.translate(p.x,p.y);x.fillStyle=p.c;
if(p.t){const k=p.s*(1+Math.sin(t/300+p.ph)*.4);x.globalAlpha=al*(.6+Math.sin(t/300+p.ph)*.4);x.beginPath();x.moveTo(0,-k*1.6);x.lineTo(k*.4,-k*.4);x.lineTo(k*1.6,0);x.lineTo(k*.4,k*.4);x.lineTo(0,k*1.6);x.lineTo(-k*.4,k*.4);x.lineTo(-k*1.6,0);x.lineTo(-k*.4,-k*.4);x.closePath();x.fill()}
else{x.globalAlpha=al*.9;x.rotate(p.r);x.fillRect(-p.s,-p.s/2,p.s*2,p.s)}
x.restore()}})(0)});
/* scroll reveal */
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target;el.classList.add('in');io.unobserve(el);setTimeout(()=>el.classList.remove('rv','in','d0','d1','d2','d3','d4','d5'),1500)}}),{threshold:.12});
document.querySelectorAll('.card,.step,.ev,.pk,.feat,.quote,.split>*,.tl>div,details,.tile,.panel,section h2,.lead,.ph,.menu>*,.mapgrid>*,.lgrid>*,.rev,.sup,.award,.palc,.chart,.cmp,.offer-bar').forEach(el=>{if(el.closest('.hero,.hero2,.page-head,.cta'))return;el.classList.add('rv','d'+[...el.parentNode.children].indexOf(el)%6);io.observe(el)})}
})();

/* v7 extras: counters, slider, estimator, checklist, visit form */
(function(){const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=i=>document.getElementById(i);
const els=document.querySelectorAll('.stats b');
if(els.length){const run=el=>{const to=+el.dataset.n,dec=+(el.dataset.d||0),sf=el.dataset.s||'';if(RM){el.textContent=to.toFixed(dec)+sf;return}let t0;const step=t=>{t0=t0||t;const k=Math.min((t-t0)/1400,1);el.textContent=(to*(1-Math.pow(1-k,3))).toFixed(dec)+sf;if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);io.unobserve(e.target)}}),{threshold:.6});els.forEach(e=>io.observe(e))}
const sl=$('sl');
if(sl){const sd=[...sl.children],dots=$('dots');let i=0,tm;dots.innerHTML=sd.map((_,k)=>`<button aria-label="Review ${k+1}"></button>`).join('');
const go=n=>{i=(n+sd.length)%sd.length;sd.forEach((x,k)=>x.classList.toggle('on',k==i));[...dots.children].forEach((d,k)=>d.classList.toggle('on',k==i))};
const play=()=>{clearInterval(tm);if(!RM)tm=setInterval(()=>go(i+1),6000)};
dots.onclick=e=>{const k=[...dots.children].indexOf(e.target);if(k>-1){go(k);play()}};sl.onmouseenter=()=>clearInterval(tm);sl.onmouseleave=play;go(0);play()}
const eh=$('eh');
if(eh){eh.innerHTML=HALLS.map(h=>`<option value="${h.id}">${h.name}</option>`).join('');
$('ec').innerHTML=CATERING.map(c=>`<option value="${c.id}">${c.name}${c.price?' · '+fmt(c.price):''}</option>`).join('');
$('ed').innerHTML=DECOR.map(d=>`<label class="opt"><input type="checkbox" value="${d.id}"><span>${d.name}</span><b>${fmt(d.price)}</b></label>`).join('');
const calc=()=>{const h=HALLS.find(x=>x.id==eh.value),c=CATERING.find(x=>x.id==$('ec').value),g=Math.max(0,+$('eg').value||0),dec=DECOR.filter(d=>$('ed').querySelector(`input[value=${d.id}]`).checked);
const cat=c.price*g,dc=dec.reduce((a,d)=>a+d.price,0),tot=h.price+cat+dc;
$('em2').textContent=g>h.cap?`${h.name} seats up to ${h.cap} guests. Choose a larger hall or fewer guests.`:'';
$('er').innerHTML=[['Hall',fmt(h.price)],['Catering ('+g+' guests)',fmt(cat)],['Decor & extras',fmt(dc)]].map(r=>`<div><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')+`<div class="tot"><span>Estimated total</span><span>${fmt(tot)}</span></div><div><span>About per guest</span><span>${g?fmt(Math.round(tot/g)):'-'}</span></div>`;
$('ebook').href='dashboard.html?hall='+h.id;
$('ewa').href='https://wa.me/919876543210?text='+encodeURIComponent(`Hi Aurelia Hall, I would like a quote: ${h.name}, ${g} guests, ${c.name}${dec.length?', '+dec.map(d=>d.name).join(', '):''}. Estimate: ${fmt(tot)}.`)};
['eh','ec','eg'].forEach(i=>$(i).oninput=calc);$('ed').onchange=calc;calc()}
const cl=$('cl');
if(cl){const T=['Set your date and guest count','Visit the venue and pick a hall','Choose your menu and book a tasting','Select decor, music and lighting','Send out your invitations','Confirm installments and final guest count','Do a final walkthrough one week before'];
let done=[];try{done=JSON.parse(localStorage.getItem('aurelia_chk')||'[]')}catch(e){}
const draw=()=>{cl.innerHTML=T.map((t,k)=>`<label class="opt"><input type="checkbox" data-k="${k}" ${done.includes(k)?'checked':''}><span>${t}</span></label>`).join('');
$('cb').className='pw-'+Math.round(done.length/T.length*100);$('ct').textContent=done.length+' of '+T.length+' done'};
cl.onchange=e=>{const k=+e.target.dataset.k;done=e.target.checked?[...new Set([...done,k])]:done.filter(x=>x!=k);localStorage.setItem('aurelia_chk',JSON.stringify(done));draw();if(done.length==T.length){burst(innerWidth/2,innerHeight/2);toast('Everything is ready. Time to celebrate!')}};draw()}
/* venue visit pop-up (every page) */
const m=document.createElement('div');m.className='modal';m.id='enq';
m.innerHTML=`<div class="mbox" role="dialog" aria-modal="true" aria-labelledby="enqt"><button class="mx" aria-label="Close">×</button><h3 id="enqt">Book a venue visit</h3><p>Choose a date and we will call you to confirm a time.</p><form id="ef"><label for="en">Your name</label><input id="en" type="text" required><label for="ep">Phone number</label><input id="ep" type="text" required pattern="[0-9+ ]{8,15}" title="Enter a valid phone number"><div class="row2"><div><label for="edt">Preferred date</label><input id="edt" type="date" required></div><div><label for="et">Event type</label><select id="et"><option>Wedding</option><option>Engagement</option><option>Reception</option><option>Birthday</option><option>Corporate</option></select></div></div><button class="btn w100 mt18">Request a visit</button></form></div>`;
document.body.appendChild(m);
const close=()=>m.classList.remove('on');
document.addEventListener('click',e=>{const a=e.target.closest('[data-enquire]');if(a){e.preventDefault();$('edt').min=new Date().toISOString().slice(0,10);m.classList.add('on');$('en').focus()}else if(e.target==m||e.target.closest('.mx'))close()});
document.addEventListener('keydown',e=>{if(e.key=='Escape')close()});
$('ef').onsubmit=e=>{e.preventDefault();let q=[];try{q=JSON.parse(localStorage.getItem('aurelia_enquiries')||'[]')}catch(x){}
q.push({name:$('en').value,phone:$('ep').value,date:$('edt').value,type:$('et').value});localStorage.setItem('aurelia_enquiries',JSON.stringify(q));
const n=$('en').value;e.target.reset();close();burst(innerWidth/2,innerHeight/3);toast('Thank you, '+n+'! We will call you to confirm your visit.')};
})();

/* v8: photos, menu tabs, seating guide */
(function(){const $=i=>document.getElementById(i);
document.querySelectorAll('.ph[data-img]').forEach(el=>{const i=new Image();i.alt=el.dataset.alt||'';i.loading='lazy';i.decoding='async';i.onerror=()=>i.remove();i.src=imgUrl(el.dataset.img,+el.dataset.w||900);el.prepend(i)});
const st=$('seat');if(st){const r=n=>Math.round(n/10)*10;st.innerHTML='<table class="tbl"><thead><tr><th>Hall</th><th>Banquet</th><th>Theatre</th><th>Cocktail</th></tr></thead><tbody>'+HALLS.map(h=>`<tr><td>${h.name}</td><td>${h.cap}</td><td>${r(h.cap*1.25)}</td><td>${r(h.cap*1.4)}</td></tr>`).join('')+'</tbody></table>'}
const mt=$('mtabs');if(mt){const M=[{st:['Paneer tikka','Veg spring rolls','Hara bhara kebab'],mn:['Veg biryani with raita','Dal makhani','Mixed veg kurma','Butter naan'],ds:['Gulab jamun','Fruit custard']},{st:['Mushroom galouti','Tandoori paneer','Chicken lollipop'],mn:['Hyderabadi biryani','Butter chicken','Live pasta counter','Hakka noodles'],ds:['Rasmalai','Chocolate brownie','Ice cream bar']},{st:['Mutton seekh kebab','Fish amritsari','Prawn koliwada'],mn:['Mutton dum biryani','Chettinad chicken','Kerala fish curry','Rumali roti'],ds:['Shahi tukda','Paan kulfi','Live jalebi counter']}];let k=0;
const col=(t,a)=>`<div><h4>${t}</h4><ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
const draw=()=>{mt.innerHTML=M.map((m,i)=>`<button class="${i==k?'on':''}" data-i="${i}">${CATERING[i].name.replace(' (per plate)','')}</button>`).join('');
$('mbody').innerHTML=`<div class="price">${fmt(CATERING[k].price)} <small class="unit">per plate</small></div><div class="mcols">${col('Starters',M[k].st)}${col('Mains',M[k].mn)}${col('Desserts',M[k].ds)}</div>`};
mt.onclick=e=>{if(e.target.dataset.i){k=+e.target.dataset.i;draw()}};draw()}
})();