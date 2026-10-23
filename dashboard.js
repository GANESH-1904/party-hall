/* Aurelia Hall – Celebration Planner. Standalone page (no login needed). Needs images.js for photos. */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],LS=localStorage,root=document.documentElement;
root.classList.add('js');root.dir=LS.getItem('aurelia_dir')==='rtl'?'rtl':'ltr';root.dataset.theme=LS.getItem('aurelia_theme')||'dark';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* ================= data ================= */
const HALLS=[
{id:'h1',im:'hall1',name:'The Aurelia Grand Ballroom',cap:600,price:180000},
{id:'h2',im:'hall2',name:'Rose Court',cap:300,price:95000},
{id:'h3',im:'hall3',name:'The Sapphire Lounge',cap:150,price:55000},
{id:'h4',im:'hall4',name:'Marigold Terrace',cap:200,price:70000},
{id:'h5',im:'hall5',name:'The Pearl Room',cap:80,price:30000}];
const CATERING=[{id:'c1',im:'foodBuffet',name:'Classic Veg Feast (per plate)',price:650},{id:'c2',im:'pkMenu1',name:'Premium Multi-Cuisine (per plate)',price:950},{id:'c3',im:'pkMenu2',name:'Royal Non-Veg Banquet (per plate)',price:1250},{id:'c0',im:'abTable',name:'No catering (own caterer)',price:0}];
const DECOR=[{id:'d1',im:'decFloral',name:'Floral entrance & aisle',price:45000,t:'Fresh blooms, arches and a petal-strewn aisle.'},{id:'d2',im:'decStage',name:'Royal stage backdrop',price:80000,t:'Drapes, candles and a statement stage.'},{id:'d3',im:'decLights',name:'Fairy-light ceiling',price:25000,t:'A canopy of warm lights overhead.'},{id:'d4',im:'inStage',name:'DJ, sound & lighting',price:35000,t:'Full sound rig, DJ and dance-floor lights.'}];
const MENUS={c1:{s:['Paneer tikka','Veg spring rolls','Hara bhara kebab'],m:['Veg biryani with raita','Dal makhani','Mixed veg kurma','Butter naan'],d:['Gulab jamun','Fruit custard']},
c2:{s:['Mushroom galouti','Tandoori paneer','Chicken lollipop'],m:['Hyderabadi biryani','Butter chicken','Live pasta counter','Hakka noodles'],d:['Rasmalai','Chocolate brownie','Ice cream bar']},
c3:{s:['Mutton seekh kebab','Fish amritsari','Prawn koliwada'],m:['Mutton dum biryani','Chettinad chicken','Kerala fish curry','Rumali roti'],d:['Shahi tukda','Paan kulfi','Live jalebi counter']}};
const TYPES=['Wedding','Engagement','Reception','Birthday','Corporate'];
const TIMG={Wedding:'occWedding',Engagement:'occEngage',Reception:'h2Ballroom',Birthday:'occBirthday',Corporate:'occCorporate'};
/* every photo below is used once on this page (no duplicates) */
const pic=(k,w,c='')=>`<img class="ph ${c}" src="${imgUrl(k,w)}" alt="" loading="lazy" onerror="this.remove()">`;
const INSPO=[['foodCake','Cakes made to be photographed'],['featRose','Roses, candles and soft light'],['featLounge','Lounge corners for quiet moments'],['inLights','Lights that make the night sparkle'],['h2Terrace','Open-air evenings on the terrace'],['h2Cake','The sweetest finishing touch']];
const fmt=n=>'₹'+Number(n).toLocaleString('en-IN'),H=id=>HALLS.find(h=>h.id==id);
/* line-art illustrations (drawn here, so no extra photos are needed) */
const S=b=>`<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
const ART={
h1:S('<path d="M50 6v22M50 28L22 46M50 28l28 18M50 28v30M22 46v18M78 46v18M50 58v14M34 62l16 12 16-12M12 76h24M64 76h24"/><g fill="currentColor" stroke="none"><circle cx="22" cy="68" r="4"/><circle cx="78" cy="68" r="4"/><circle cx="50" cy="76" r="5"/><circle cx="34" cy="84" r="3.5"/><circle cx="66" cy="84" r="3.5"/></g>'),
h2:S('<circle cx="50" cy="46" r="30"/><circle cx="50" cy="46" r="21"/><circle cx="50" cy="46" r="12"/><path d="M50 36c9 0 10 12 0 12s-8-8-2-8"/><path d="M50 78c-6 10-18 12-28 8M50 78c6 10 18 12 28 8"/>'),
h3:S('<path d="M28 30h44l14 18-36 40L14 48z"/><path d="M14 48h72M38 30l-8 18 20 40M62 30l8 18-20 40"/>'),
h4:S('<circle cx="50" cy="52" r="16"/><path d="M50 22v8M50 74v8M20 52h8M72 52h8M29 31l6 6M71 31l-6 6M29 73l6-6M71 73l-6-6"/><path d="M10 88h80"/>'),
h5:S('<path d="M14 28c10 44 62 44 72 0"/><g fill="currentColor" stroke="none"><circle cx="19" cy="42" r="6"/><circle cx="31" cy="56" r="6"/><circle cx="46" cy="63" r="7"/><circle cx="62" cy="63" r="7"/><circle cx="75" cy="56" r="6"/><circle cx="85" cy="42" r="6"/></g>'),
c1:S('<path d="M16 54h68c0 20-14 32-34 32S16 74 16 54z"/><path d="M50 54c-12-6-14-22-2-32 12 6 14 22 2 32z"/><path d="M50 54V32"/>'),
c2:S('<circle cx="54" cy="54" r="26"/><circle cx="54" cy="54" r="15"/><path d="M14 18v24M20 18v24M26 18v24M20 42v40"/>'),
c3:S('<path d="M22 74h56M26 74c0-24 10-34 24-34s24 10 24 34"/><path d="M26 28l10 12 14-18 14 18 10-12"/><circle cx="50" cy="16" r="3"/>'),
c0:S('<circle cx="50" cy="52" r="28" stroke-dasharray="6 6"/><circle cx="50" cy="52" r="16" stroke-dasharray="4 5"/>'),
d1:S('<circle cx="50" cy="50" r="8"/><circle cx="50" cy="28" r="12"/><circle cx="72" cy="50" r="12"/><circle cx="50" cy="72" r="12"/><circle cx="28" cy="50" r="12"/>'),
d2:S('<path d="M12 12h76"/><path d="M16 12c4 30 0 56-4 78M16 12c10 22 12 52 34 78"/><path d="M84 12c-4 30 0 56 4 78M84 12c-10 22-12 52-34 78"/>'),
d3:S('<path d="M8 24c22 26 62 26 84 0"/><g fill="currentColor" stroke="none"><circle cx="22" cy="42" r="4.5"/><circle cx="38" cy="52" r="4.5"/><circle cx="52" cy="55" r="4.5"/><circle cx="66" cy="52" r="4.5"/><circle cx="80" cy="42" r="4.5"/></g>'),
d4:S('<rect x="28" y="10" width="44" height="80" rx="8"/><circle cx="50" cy="34" r="9"/><circle cx="50" cy="66" r="15"/><circle cx="50" cy="66" r="5"/>')};
/* ================= user ================= */
const me=LS.getItem('aurelia_user')||'visitor';
let users={};try{users=JSON.parse(LS.getItem('aurelia_users')||'null')||{}}catch(e){}
/* ================= dates ================= */
const pad=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,now=new Date(),today=iso(now);
const dt=s=>new Date(s+'T00:00:00'),addDays=(s,n)=>{const d=dt(s);d.setDate(d.getDate()+n);return iso(d)},diff=(a,b)=>Math.round((dt(a)-dt(b))/864e5),dim=(y,m)=>new Date(y,m+1,0).getDate();
const pretty=s=>dt(s).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),long=s=>dt(s).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),short=s=>dt(s).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
/* ================= bookings & availability ================= */
const loadB=()=>{try{return JSON.parse(LS.getItem('aurelia_bookings')||'[]')}catch(e){return[]}},saveB=b=>LS.setItem('aurelia_bookings',JSON.stringify(b)),mine=()=>me?loadB().filter(b=>b.user==me):[];
const seed=(h,s)=>{let x=0;for(const c of h+s)x=(x*31+c.charCodeAt(0))%1009;return x%4==0};
const taken=(h,s)=>seed(h,s)||loadB().some(b=>b.hall==h&&b.date==s);
const nearFree=(hid,s,n)=>{const r=[];for(let o=1;o<=60&&r.length<n*2;o++){for(const d of[addDays(s,-o),addDays(s,o)])if(d>=today&&!taken(hid,d))r.push(d)}return r.slice(0,n)};
const monthFree=(hid,y,m)=>{let f=0;for(let d=1;d<=dim(y,m);d++){const s=ds(y,m,d);if(s>=today&&!taken(hid,s))f++}return f};
const ds=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const plan=(total,date)=>{const last=addDays(date,-7),end=last<today?today:last,mid=addDays(today,Math.floor(diff(end,today)/2)),a=Math.round(total*.4),b=Math.round(total*.3);return[{amt:a,due:today,paid:false},{amt:b,due:mid,paid:false},{amt:total-a-b,due:end,paid:false}]};
/* ================= state (kept per visitor so progress is never lost) ================= */
const DK='aurelia_draft_'+me;let dr={};
try{dr=JSON.parse(LS.getItem(DK)||'null')||{}}catch(e){dr={}}
const st=Object.assign({hall:'h1',type:'Wedding',date:'',guests:100,title:'',cat:'c1',decor:[],menuSet:false,decorSet:false,budget:0},dr);
if(!H(st.hall))st.hall='h1';if(!TYPES.includes(st.type)&&st.type!=='')st.type='Wedding';if(!CATERING.some(c=>c.id==st.cat))st.cat='c1';st.decor=(st.decor||[]).filter(d=>DECOR.some(x=>x.id==d));st.guests=Math.max(10,Math.min(H(st.hall).cap,+st.guests||100));
const q=new URLSearchParams(location.search);
if(H(q.get('hall')))st.hall=q.get('hall');
if(/^\d{4}-\d{2}-\d{2}$/.test(q.get('date')||'')&&q.get('date')>=today)st.date=q.get('date');
if(st.date&&st.date<today)st.date='';
const save=()=>LS.setItem(DK,JSON.stringify(st));
const cv={y:now.getFullYear(),m:now.getMonth()};if(st.date){const d=dt(st.date);cv.y=d.getFullYear();cv.m=d.getMonth()}
function calc(){const h=H(st.hall),c=CATERING.find(x=>x.id==st.cat),dec=DECOR.filter(d=>st.decor.includes(d.id)),g=Math.max(0,+st.guests||0),cat=c.price*g,dc=dec.reduce((a,d)=>a+d.price,0);return{h,c,dec,g,cat,dc,total:h.price+cat+dc}}
const dateOk=()=>st.date&&st.date>=today&&!taken(st.hall,st.date);
/* ================= effects ================= */
let bc,bx,B=[],run=false;const pal=()=>{const s=getComputedStyle(document.documentElement);return['--secondary','--primary','--white'].map(v=>s.getPropertyValue(v).trim())};let COL=pal();
function burst(px,py,n=130){if(RM)return;if(!bc){bc=document.createElement('canvas');bc.setAttribute('aria-hidden','true');bc.className='burst';document.body.appendChild(bc);bx=bc.getContext('2d')}
bc.width=innerWidth;bc.height=innerHeight;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=4+Math.random()*9;B.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-5,s:3+Math.random()*5,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,c:COL[i%COL.length],l:1})}
if(!run){run=true;requestAnimationFrame(function f(){bx.clearRect(0,0,bc.width,bc.height);B=B.filter(p=>p.l>0);for(const p of B){p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=.011;bx.save();bx.globalAlpha=Math.max(p.l,0);bx.translate(p.x,p.y);bx.rotate(p.r);bx.fillStyle=p.c;bx.fillRect(-p.s,-p.s/2,p.s*2,p.s);bx.restore()}if(B.length)requestAnimationFrame(f);else{run=false;bx.clearRect(0,0,bc.width,bc.height)}})}}
function toast(m){const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2800)}
[['#hc1','inGala'],['#hc2','inDome'],['#hc3','featBall']].forEach(([s,k])=>{const i=$(s);i.src=imgUrl(k,520);i.onerror=()=>i.remove()});
$('#inspo').innerHTML=INSPO.map((x,i)=>`<figure class="ig i${i+1}">${pic(x[0],i==0||i==3?900:600)}<figcaption>${x[1]}</figcaption></figure>`).join('');
if(!RM){const b=document.createElement('div');b.className='balloons';b.setAttribute('aria-hidden','true');b.innerHTML='<i></i><i></i><i></i><i></i><i></i>';$('#top').appendChild(b)}
/* ambient confetti in the hero */
(function(){const c=$('#conf');if(!c||RM)return;const x=c.getContext('2d');let w,h,P=[];const rs=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight};rs();addEventListener('resize',rs);
for(let i=0;i<46;i++)P.push({x:Math.random()*w,y:Math.random()*h,s:3+Math.random()*5,v:.35+Math.random()*.9,r:Math.random()*6.28,vr:(Math.random()-.5)*.05,c:COL[i%COL.length],d:Math.random()*6.28});
(function f(){x.clearRect(0,0,w,h);for(const p of P){p.y+=p.v;p.d+=.02;p.x+=Math.sin(p.d)*.5;p.r+=p.vr;if(p.y>h+10){p.y=-10;p.x=Math.random()*w}x.save();x.globalAlpha=.75;x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s,-p.s/2,p.s*2,p.s);x.restore()}requestAnimationFrame(f)})()})();
/* ================= header ================= */
const sun='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',moon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const paintTh=()=>$('#th').innerHTML=root.dataset.theme=='dark'?sun:moon;paintTh();
$('#th').onclick=()=>{root.dataset.theme=root.dataset.theme=='dark'?'light':'dark';LS.setItem('aurelia_theme',root.dataset.theme);paintTh();COL=pal()};
/* ================= STEP 1: halls, calendar, availability ================= */
const monthName=()=>new Date(cv.y,cv.m,1).toLocaleDateString('en-IN',{month:'long'});
function drawHalls(){const n=dim(cv.y,cv.m),hq=($('#hSearch').value||'').trim().toLowerCase(),HL=HALLS.filter(h=>!hq||(h.name+' '+h.cap+' guests '+h.price).toLowerCase().includes(hq));$('#hNone').hidden=!!HL.length;
$('#halls').innerHTML=HL.map(h=>{const fr=monthFree(h.id,cv.y,cv.m);return `<button type="button" class="hall g-${h.id} ${h.id==st.hall?'on':''}" data-h="${h.id}" aria-pressed="${h.id==st.hall}"><span class="hart">${pic(h.im,520)}<span class="ico">${ART[h.id]}</span></span><span class="hmain"><b>${esc(h.name)}</b><small>Up to ${h.cap} guests</small><em>${fmt(h.price)}</em><span class="fbar"><i class="pw-${Math.round(fr/n*100)}"></i></span><small>${fr} free day${fr==1?'':'s'} in ${monthName()}</small></span>${h.id==st.hall?'<span class="rib">Selected</span>':''}</button>`}).join('')}
function drawTypes(){$('#types').innerHTML=TYPES.map(t=>`<button type="button" class="pill ${t==st.type?'on':''}" data-t="${t}" aria-pressed="${t==st.type}">${pic(TIMG[t],120,"av")}<span>${t}</span></button>`).join('')}
function drawCal(){const first=new Date(cv.y,cv.m,1).getDay(),mineD=new Set(mine().filter(b=>b.hall==st.hall).map(b=>b.date));
$('#mTitle').textContent=new Date(cv.y,cv.m,1).toLocaleDateString('en-IN',{month:'long',year:'numeric'});
$('#mPrev').disabled=cv.y==now.getFullYear()&&cv.m<=now.getMonth();
let h=['S','M','T','W','T','F','S'].map(d=>`<div class="dn">${d}</div>`).join('')+'<span></span>'.repeat(first);
for(let d=1;d<=dim(cv.y,cv.m);d++){const s=ds(cv.y,cv.m,d),past=s<today,bk=!past&&taken(st.hall,s),mi=mineD.has(s);
h+=`<button type="button" class="d ${past?'past':''} ${bk?'bk':''} ${mi?'mine':''} ${s==st.date?'sel':''} ${s==today?'td':''}" data-d="${s}" ${past?'disabled':''} aria-label="${long(s)}${past?'':bk?', booked':', free'}"><span>${d}</span>${mi?'<i>★</i>':''}</button>`}
$('#cal').innerHTML=h}
function drawRes(){const el=$('#res'),h=H(st.hall);
if(!st.date){el.innerHTML=`<span class="kicker small">Pick a day</span><h3>Tap a date on the calendar</h3><p class="mut">We will tell you straight away whether ${esc(h.name)} is free.</p>`;return}
const all=HALLS.map(x=>`<button type="button" class="chip ${taken(x.id,st.date)?'no':'ok'}" data-h="${x.id}">${taken(x.id,st.date)?'✕':'✓'} ${esc(x.name.replace('The ',''))}</button>`).join('');
if(!taken(st.hall,st.date)){el.innerHTML=`<span class="badge ok">✦ Available</span><h3>${long(st.date)}</h3><p class="mut">${esc(h.name)} is free on this day · ${fmt(h.price)} hall rental · up to ${h.cap} guests.</p><h4>This date in every hall</h4><div class="chips">${all}</div><a class="btn" href="#sec-menu">Continue to menu</a>`;return}
const n=nearFree(st.hall,st.date,4);
el.innerHTML=`<span class="badge no">✕ Already booked</span><h3>${long(st.date)}</h3><p class="mut">${esc(h.name)} is taken on this day.</p>${n.length?`<h4>Nearest free dates here</h4><div class="chips">${n.map(d=>`<button type="button" class="chip ok" data-p="${d}">${pretty(d)}</button>`).join('')}</div>`:''}<h4>This date in every hall</h4><div class="chips">${all}</div>`}
/* ================= STEP 2: menu ================= */
function drawMenu(){const g=Math.max(0,+st.guests||0);
$('#plates').innerHTML=CATERING.map(c=>`<button type="button" class="plate ${c.id==st.cat?'on':''}" data-c="${c.id}" aria-pressed="${c.id==st.cat}"><span class="pic">${pic(c.im,300)}<span class="ico">${ART[c.id]}</span></span><b>${c.name.replace(' (per plate)','')}</b><em>${c.price?fmt(c.price)+' per plate':'No charge'}</em><small>${c.price?'≈ '+fmt(c.price*g)+' for '+g+' guests':'Bring your own caterer'}</small></button>`).join('');
const c=CATERING.find(x=>x.id==st.cat),m=MENUS[st.cat],list=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
$('#menuCard').innerHTML=m?`<span class="kicker small">Today’s menu</span><h3>${c.name.replace(' (per plate)','')}</h3><div class="pr">${fmt(c.price)} per plate</div><h4>Starters</h4>${list(m.s)}<h4>Mains</h4>${list(m.m)}<h4>Desserts</h4>${list(m.d)}`:`<span class="kicker small">Your kitchen</span><h3>Own caterer</h3><p>Hall rental only. Your caterer is welcome after a quick walkthrough with our team.</p>`}
/* ================= STEP 3: decor ================= */
function drawBoard(){const xq=($('#xSearch').value||'').trim().toLowerCase(),XL=DECOR.filter(d=>!xq||(d.name+' '+d.t).toLowerCase().includes(xq));
$('#board').innerHTML=(XL.length?XL:[]).map(d=>{const on=st.decor.includes(d.id);return `<button type="button" class="tile g-${d.id} ${on?'on':''}" data-x="${d.id}" aria-pressed="${on}"><span class="tart">${pic(d.im,520)}<span class="ico">${ART[d.id]}</span></span><span class="tmain"><b>${d.name}</b><em>${fmt(d.price)}</em><small class="mut">${d.t}</small><br><span class="tg">${on?'✓ Added to your day':'Tap to add'}</span></span></button>`}).join('');
if(!XL.length)$('#board').innerHTML='<p class="mut span-all">No decor matches. Clear the search to see everything.</p>';
const t=calc();$('#decTot').innerHTML=`Decor &amp; extras: <b>${fmt(t.dc)}</b> · ${t.dec.length} item${t.dec.length==1?'':'s'}`}
/* ================= STEP 4: plan, tray, tracker ================= */
function drawPlan(){drawPlan0();drawBudget()}
function drawPlan0(){const t=calc(),ok=dateOk()&&t.g>=10&&t.g<=t.h.cap,p=ok?plan(t.total,st.date):[];
$('#planCard').innerHTML=`<div><h3>Your celebration</h3><div class="rows"><div><span>Hall</span><b>${esc(t.h.name)}</b></div><div><span>Date</span><b>${st.date?pretty(st.date):'Not chosen'}</b></div><div><span>Occasion</span><b>${esc(st.title||(st.type||'Celebration'))}</b></div><div><span>Guests</span><b>${t.g}</b></div><div><span>Hall rental</span><b>${fmt(t.h.price)}</b></div><div><span>Catering</span><b>${t.c.price?fmt(t.cat):'Own caterer'}</b></div><div><span>Decor &amp; extras</span><b>${fmt(t.dc)}</b></div></div><div class="tot"><span>Total</span><b>${fmt(t.total)}</b></div></div>
<div><h3>Three easy installments</h3>${p.length?`<div class="gifts mt14">${p.map((i,k)=>`<div class="gift"><i>${k+1}</i><span><b>${['Reserve your date','Mid-way payment','Final payment'][k]}</b><small>Due ${pretty(i.due)}</small></span><span class="amt">${fmt(i.amt)}</span></div>`).join('')}</div>`:'<p class="mut mt10">Choose an available date in step 1 and your 40 / 30 / 30 plan appears here.</p>'}
<p class="msg" id="rsMsg" role="alert"></p><button class="btn" id="reserve" type="button">Reserve &amp; pay first installment</button></div>`;
const r=$('#reserve');if(r)r.onclick=reserve}
function drawTray(){const t=calc();$('#tray').innerHTML=`<span class="tray-i"><b>${esc(t.h.name)}</b><small>${st.date?pretty(st.date):'Pick a date'} · ${t.g} guests</small></span><span class="tray-t">${fmt(t.total)}</span><a class="btn" href="#sec-pay">Review &amp; reserve</a>`}
function drawMine(){drawMine0();drawKpi();drawAlert();drawTasks();drawSteps()}
function drawMine0(){const el=$('#mine');
const bs=mine().sort((a,b)=>a.date<b.date?-1:1);
if(!bs.length){el.innerHTML='<div class="card empty"><h3>No celebrations reserved yet</h3><p>Plan your day above and reserve it with the first installment.</p><a class="btn" href="#sec-date">Find your date</a></div>';return}
el.innerHTML=bs.map(b=>{const h=H(b.hall)||{name:'Hall'},c=CATERING.find(x=>x.id==b.cat),d=diff(b.date,today),past=d<0,paid=b.inst.filter(i=>i.paid).reduce((a,i)=>a+i.amt,0),pct=Math.round(paid/b.total*100),nx=b.inst.findIndex(i=>!i.paid);
return `<div class="mc">${pct==100?'<span class="full">Fully paid</span>':''}<div class="mc-top"><div><h3>${esc(b.title||b.type+' at '+h.name)}</h3><span class="mut">${esc(h.name)} · ${long(b.date)}</span></div><b class="price">${fmt(b.total)}</b></div>
<div class="tags"><span>${b.type}</span><span>${b.guests} guests</span><span>${c?c.name.replace(' (per plate)',''):''}</span><span>${b.decor.length} decor item${b.decor.length==1?'':'s'}</span><span class="hl">${past?'Completed':d==0?'Today. Enjoy!':d+' day'+(d==1?'':'s')+' to go'}</span></div>
<div class="pbar" role="img" aria-label="${pct}% paid"><i class="pw-${pct}"></i></div><small>${fmt(paid)} paid of ${fmt(b.total)} (${pct}%)</small>
<div class="tl3">${b.inst.map((i,k)=>{const od=!i.paid&&i.due<today;return `<div class="node ${i.paid?'paid':od?'od':k==nx?'next':''}"><span class="dot">${k+1}</span><div><b>${fmt(i.amt)}</b><small>${i.paid?'Paid '+pretty(i.paidOn||i.due):(od?'Overdue since ':'Due ')+pretty(i.due)}</small>${i.paid?'<span class="paidt">✓ Paid</span>':k==nx?`<button class="btn sm" type="button" data-pay="${b.id}:${k}">Pay now</button>`:''}</div></div>`}).join('')}</div>
<div class="acts"><button class="btn ghost sm" type="button" data-rc="${b.id}">Receipt</button><button class="btn ghost sm" type="button" data-ics="${b.id}">Add to calendar</button><button class="btn ghost sm" type="button" data-wa="${b.id}">Share</button>${past?'':`<button class="btn ghost sm bad" type="button" data-cx="${b.id}">Cancel booking</button>`}</div></div>`}).join('')}
/* party clock */
function drawClock(){const el=$('#clock'),nx=mine().filter(b=>b.date>=today).sort((a,b)=>a.date<b.date?-1:1)[0];let t,lab,sub;
if(nx){t=nx.date;lab='Your next celebration';sub=`${esc(nx.title||nx.type+' at '+H(nx.hall).name)} · ${pretty(nx.date)}`}else if(st.date&&st.date>=today){t=st.date;lab='Penciled in';sub=`${esc(H(st.hall).name)} · ${pretty(st.date)} · not reserved yet`}
if(!t){el.dataset.t='';el.innerHTML='<span class="kicker">Party clock</span><h3>Your date is waiting</h3><p>Pick a day in step one and this clock starts counting down to your celebration.</p>';return}
el.dataset.t=t;el.innerHTML=`<span class="kicker">${lab}</span>${diff(t,today)==0?'<div class="today">Today. Enjoy!</div>':'<div class="cd"><div><b id="cdD">0</b><span>days</span></div><div><b id="cdH">0</b><span>hours</span></div><div><b id="cdM">0</b><span>mins</span></div><div><b id="cdS">0</b><span>secs</span></div></div>'}<p>${sub}</p>`;tick()}
function tick(){const t=$('#clock').dataset.t;if(!t||!$('#cdD'))return;let s=Math.max(0,Math.floor((dt(t)-new Date())/1000));const d=Math.floor(s/86400);s%=86400;$('#cdD').textContent=d;$('#cdH').textContent=pad(Math.floor(s/3600));$('#cdM').textContent=pad(Math.floor(s%3600/60));$('#cdS').textContent=pad(s%60)}
setInterval(tick,1000);
/* step badges */
function drawSteps(){const done={date:dateOk(),menu:st.menuSet,decor:st.decorSet,pay:mine().length>0,tools:loadG().length>0||(loadT().done||[]).length>0||st.budget>0};$$('#steps a').forEach(a=>a.classList.toggle('done',!!done[a.dataset.s]));
const n=Object.values(done).filter(Boolean).length,p=n*20;$('#ringV').setAttribute('class','v ro-'+p);$('#ringT').textContent=p+'%';$('#readyT').textContent=p+'%';
$('#readyS').textContent=['Start by choosing a hall and a date.','Great start. Now pick your menu.','Nice. Style your decor next.','Reserve to lock your date.','Almost there. Open your toolkit.','Everything is ready. Time to party!'][n]}
const renderAll=()=>{drawKpi();drawAlert();drawTasks();drawHalls();drawTypes();drawCal();drawRes();drawMenu();drawBoard();drawPlan();drawTray();drawSteps();drawClock()};
/* ================= interactions ================= */
$('#dG').value=st.guests;$('#dN').value=st.title;
const setGuests=v=>{const cap=H(st.hall).cap;st.guests=Math.max(10,Math.min(cap,Math.round(+v)||10));$('#dG').value=st.guests;gMsg();save();drawMenu();drawPlan();drawTray()};
function gMsg(){const cap=H(st.hall).cap,bf=HALLS.filter(x=>x.cap>=st.guests).sort((a,b)=>a.price-b.price)[0];$('#gMsg').innerHTML=`${esc(H(st.hall).name)} seats up to ${cap} guests`+(bf&&bf.id!=st.hall?` · <button type="button" class="lnk" data-h="${bf.id}">Best fit: ${esc(bf.name.replace('The ',''))}</button>`:'')}
$('#gMinus').onclick=()=>setGuests(st.guests-10);$('#gPlus').onclick=()=>setGuests(st.guests+10);
$('#dG').oninput=e=>{const v=+e.target.value;if(v>=1){st.guests=v;drawMenu();drawPlan();drawTray()}};$('#dG').onchange=e=>setGuests(e.target.value);
$('#dN').oninput=e=>{st.title=e.target.value.trim();save();drawPlan()};
$('#mPrev').onclick=()=>{if(--cv.m<0){cv.m=11;cv.y--}drawCal();drawHalls()};$('#mNext').onclick=()=>{if(++cv.m>11){cv.m=0;cv.y++}drawCal();drawHalls()};
document.addEventListener('click',e=>{const t=e.target.closest('[data-h],[data-t],[data-d],[data-p],[data-c],[data-x],[data-pay],[data-rc],[data-ics],[data-wa],[data-cx]');if(!t)return;const d=t.dataset;
if(d.h){st.hall=d.h;const cap=H(st.hall).cap;if(st.guests>cap){st.guests=cap;$('#dG').value=cap;toast(`Guests adjusted to ${cap} for ${H(st.hall).name}.`)}gMsg();save();renderAll();return}
if(d.t){const was=st.type==d.t;st.type=was?'':d.t;save();drawTypes();drawPlan();if(was)toast('Occasion unselected.');return}
if(d.d){const was=st.date==d.d;st.date=was?'':d.d;if(was)toast('Date unselected.');save();drawCal();drawRes();drawPlan();drawTray();drawSteps();drawClock();if(st.date&&!taken(st.hall,st.date)){const r=t.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,40)}return}
if(d.p){st.date=d.p;const x=dt(d.p);cv.y=x.getFullYear();cv.m=x.getMonth();save();drawHalls();drawCal();drawRes();drawPlan();drawTray();drawSteps();drawClock();return}
if(d.c){const was=st.cat==d.c&&d.c!='c0';st.cat=was?'c0':d.c;if(was)toast('Menu unselected. Hall only, with your own caterer.');st.menuSet=true;save();drawMenu();drawPlan();drawTray();drawSteps();return}
if(d.x){st.decor=st.decor.includes(d.x)?st.decor.filter(z=>z!=d.x):[...st.decor,d.x];st.decorSet=true;save();drawBoard();drawPlan();drawTray();drawSteps();if(st.decor.includes(d.x)){const r=t.getBoundingClientRect();burst(r.left+r.width/2,r.top+60,50)}return}
const find=id=>loadB().find(z=>z.id==id);
if(d.pay){const[id,k]=d.pay.split(':'),b=find(id);if(!b)return;const i=b.inst[+k];askPay({title:`Pay installment ${+k+1} of 3`,sub:`${b.title||b.type} · ${(H(b.hall)||{}).name||''}`,amount:i.amt,onPaid:()=>{const all=loadB(),bb=all.find(z=>z.id==id);bb.inst[+k].paid=true;bb.inst[+k].paidOn=today;saveB(all);drawMine();drawSteps();toast('Payment received. Thank you!')}});return}
if(d.rc){receipt(find(d.rc));return}if(d.ics){icsFile(find(d.ics));return}if(d.wa){waShare(find(d.wa));return}
if(d.cx&&confirm('Cancel this booking? The date will be released.')){saveB(loadB().filter(z=>z.id!=d.cx));drawMine();renderAll();toast('Booking cancelled. The date is free again.')}});
$('#hSearch').oninput=drawHalls;$('#xSearch').oninput=drawBoard;
$('#decSkip').onclick=()=>{st.decor=[];st.decorSet=true;save();drawBoard();drawPlan();drawTray();drawSteps();toast('All decor unselected.')};
$('#decAll').onclick=()=>{st.decor=DECOR.map(d=>d.id);st.decorSet=true;save();drawBoard();drawPlan();drawTray();drawSteps();toast('All decor selected.');const r=$('#decAll').getBoundingClientRect();burst(r.left+r.width/2,r.top,60)};
/* ================= payment dialog ================= */
let payCb=null;const pd=$('#payD');
function askPay(o){$('#pdT').textContent=o.title;$('#pdS').textContent=o.sub;$('#pdA').textContent=fmt(o.amount);payCb=o.onPaid;pd.showModal?pd.showModal():pd.setAttribute('open','')}
$('#pdGo').onclick=e=>{e.preventDefault();const b=e.currentTarget;b.disabled=true;b.textContent='Processing…';setTimeout(()=>{b.disabled=false;b.textContent='Pay now';pd.close('go')},900)};
pd.addEventListener('close',()=>{const cb=payCb;payCb=null;if(pd.returnValue=='go'&&cb){cb();burst(innerWidth/2,innerHeight/3)}pd.returnValue=''});
function reserve(){const t=calc(),fail=m=>{const e=$('#rsMsg');if(e)e.textContent=m};
if(!st.date)return fail('Please choose an event date in step 1.');
if(st.date<today)return fail('Please choose a future date.');
if(t.g<10||t.g>t.h.cap)return fail(`Guests must be between 10 and ${t.h.cap} for ${t.h.name}.`);
if(taken(st.hall,st.date))return fail('That date is no longer available. Please choose another.');
fail('');const p=plan(t.total,st.date),snap={hall:st.hall,date:st.date,type:st.type||'Celebration',title:st.title,guests:t.g,cat:st.cat,decor:[...st.decor],total:t.total};
askPay({title:'Pay first installment',sub:`${st.title||(st.type||'Celebration')} · ${t.h.name} · ${pretty(st.date)}`,amount:p[0].amt,onPaid:()=>{if(taken(snap.hall,snap.date))return toast('Sorry, that date was just taken.');p[0].paid=true;p[0].paidOn=today;const b=loadB();b.push({id:Date.now()+'',user:me,...snap,inst:p});saveB(b);st.date='';st.title='';$('#dN').value='';save();renderAll();drawMine();toast('Booking confirmed! Your date is held.');$('#sec-pay').querySelector('.subh').scrollIntoView({behavior:'smooth',block:'start'})}})}
/* ================= receipt, calendar file, share ================= */
function icsFile(x){const h=H(x.hall),n=addDays(x.date,1);const t=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aurelia Hall//EN','BEGIN:VEVENT','UID:'+x.id+'@aureliahall','DTSTAMP:'+today.replace(/-/g,'')+'T000000Z','DTSTART;VALUE=DATE:'+x.date.replace(/-/g,''),'DTEND;VALUE=DATE:'+n.replace(/-/g,''),'SUMMARY:'+(x.title||x.type)+' at '+h.name,'LOCATION:Aurelia Hall\\, Chengalpattu','END:VEVENT','END:VCALENDAR'].join('\r\n');
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/calendar'}));a.download='aurelia-event.ics';a.click();toast('Calendar file downloaded.')}
const waShare=x=>window.open('https://wa.me/?text='+encodeURIComponent(`Save the date! ${x.title||x.type} at ${H(x.hall).name}, ${pretty(x.date)}. ${x.guests} guests. Hosted by Aurelia Hall.`),'_blank');
function receipt(x){const h=H(x.hall),c=CATERING.find(k=>k.id==x.cat),dec=DECOR.filter(d=>x.decor.includes(d.id)),w=window.open('','_blank');if(!w)return toast('Allow pop-ups to print your receipt.');
w.document.write(`<title>Receipt</title><link rel="stylesheet" href="print.css"><body><h1>Aurelia Hall</h1><p>Booking receipt · ${pretty(today)}</p><hr><p><b>${esc(x.title||x.type)}</b><br>${h.name} · ${pretty(x.date)} · ${x.guests} guests</p><p>Catering: ${c?c.name:'None'}<br>Decor: ${dec.map(d=>d.name).join(', ')||'None'}</p><table class="t">${x.inst.map((i,k)=>`<tr><td>Installment ${k+1} · due ${pretty(i.due)}</td><td class="r">${fmt(i.amt)}</td><td>${i.paid?'Paid':'Due'}</td></tr>`).join('')}</table><h3>Total ${fmt(x.total)}</h3><script>print()<\/script>`);w.document.close()}
/* ================= step navigation highlight + reveal ================= */
const secs=['date','menu','decor','pay','tools'].map(k=>[k,$('#sec-'+k)]);
if('IntersectionObserver' in window){
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#steps a').forEach(a=>a.classList.toggle('on',a.dataset.s==e.target.id.slice(4)))}),{rootMargin:'-45% 0px -50% 0px'});secs.forEach(s=>spy.observe(s[1]));
const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>rv.observe(el))}
else $$('.reveal').forEach(el=>el.classList.add('in'));
/* ================= go ================= */

/* ================= RTL / LTR ================= */
const paintDir=()=>{const x=root.dir=='rtl';$('#rtl').setAttribute('aria-pressed',x);$('#rtlT').textContent=x?'LTR':'RTL';$('#rtl').setAttribute('aria-label',x?'Switch text direction to left-to-right':'Switch text direction to right-to-left')};paintDir();
$('#rtl').onclick=()=>{root.dir=root.dir=='rtl'?'ltr':'rtl';LS.setItem('aurelia_dir',root.dir);paintDir()};
/* ================= overview: KPIs and payment alert ================= */
const ICO={cal:'<path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8 2v4M16 2v4M3 10h18"/>',wal:'<path d="M3 7a3 3 0 0 1 3-3h13v4M3 7v11a3 3 0 0 0 3 3h14V8H6a3 3 0 0 1-3-1zM16 14h2"/>',ok:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',clk:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'};
const ic=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k]}</svg>`;
function countUp(el,to){if(RM){el.textContent=fmtN(to);return}const t0=performance.now();requestAnimationFrame(function f(t){const p=Math.min((t-t0)/900,1);el.textContent=fmtN(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f)})}
const fmtN=(n,m)=>m?'₹'+Number(n).toLocaleString('en-IN'):Number(n).toLocaleString('en-IN');
function drawKpi(){const bs=mine(),up=bs.filter(b=>b.date>=today).sort((a,b)=>a.date<b.date?-1:1),tot=bs.reduce((a,b)=>a+b.total,0),paid=bs.reduce((a,b)=>a+b.inst.filter(i=>i.paid).reduce((x,i)=>x+i.amt,0),0),due=tot-paid;
const nd=bs.flatMap(b=>b.inst.filter(i=>!i.paid).map(i=>i.due)).sort()[0];
const it=[['cal','Upcoming celebrations',up.length,0,up[0]?'Next: '+pretty(up[0].date):'Nothing booked yet'],['wal','Total booked',tot,1,bs.length+' booking'+(bs.length==1?'':'s')],['ok','Paid so far',paid,1,tot?Math.round(paid/tot*100)+'% of total':'No payments yet'],['clk','Outstanding',due,1,nd?'Next due '+pretty(nd):'All settled']];
$('#kpi').innerHTML=it.map(x=>`<div class="kp"><span class="kpi-i">${ic(x[0])}</span><span class="kpi-t"><small>${x[1]}</small><b data-to="${x[2]}" data-m="${x[3]}">${x[3]?'₹0':'0'}</b><em>${x[4]}</em></span></div>`).join('');
$$('#kpi b').forEach(b=>{const m=+b.dataset.m,to=+b.dataset.to,f=n=>m?'₹'+Number(n).toLocaleString('en-IN'):String(n);if(RM){b.textContent=f(to);return}const t0=performance.now();requestAnimationFrame(function s(t){const p=Math.min((t-t0)/900,1);b.textContent=f(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(s)})})}
function drawAlert(){const L=[];mine().forEach(b=>b.inst.forEach((i,k)=>{if(!i.paid){const d=diff(i.due,today);if(d<=7)L.push({b,i,k,d})}}));L.sort((a,b)=>a.d-b.d);const x=L[0];
$('#alert').innerHTML=x?`<div class="al ${x.d<0?'od':''}" role="status"><span class="al-i">${x.d<0?'!':'⏰'}</span><span><b>${x.d<0?'Payment overdue':'Payment due soon'}</b> · Installment ${x.k+1} of ${esc(x.b.title||x.b.type)} · ${fmt(x.i.amt)} ${x.d<0?'was due '+pretty(x.i.due):x.d==0?'is due today':'is due '+pretty(x.i.due)}</span><a class="btn sm" href="#sec-pay">Pay now</a></div>`:''}
/* ================= toolkit: budget ================= */
function drawBudget(){const t=calc(),parts=[['Hall',t.h.price],['Catering',t.cat],['Decor',t.dc]],sum=t.total||1;let acc=0;
$('#bgDonut').innerHTML=`<svg viewBox="0 0 42 42" role="img" aria-label="Cost split"><circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--line)" stroke-width="5"/>${parts.map((p,i)=>{const v=p[1]/sum*100,s=`<circle class="seg${i}" cx="21" cy="21" r="15.9" fill="none" stroke-width="5" stroke-dasharray="${v} ${100-v}" stroke-dashoffset="${25-acc}"/>`;acc+=v;return s}).join('')}</svg><div class="dc"><small>Total</small><b>${fmt(t.total)}</b></div>`;
$('#bgLeg').innerHTML=parts.map((p,i)=>`<li><i class="lg${i}"></i><span>${p[0]}</span><b>${fmt(p[1])}</b><small>${Math.round(p[1]/sum*100)}%</small></li>`).join('');
const bg=+st.budget||0,el=$('#bgS');
if(!bg){el.className='bgs';el.textContent='Enter a budget to see how your plan compares.';return}
const left=bg-t.total,pc=Math.min(100,Math.round(t.total/bg*100));
el.className='bgs '+(left<0?'over':'under');el.innerHTML=`<div class="pbar"><i class="pw-${pc}"></i></div>${left<0?`Over budget by <b>${fmt(-left)}</b>. Try a smaller hall, fewer decor items or a lighter menu.`:`<b>${fmt(left)}</b> left in your budget (${100-pc}%).`}`}
$('#bgIn').value=st.budget||'';
$('#bgIn').oninput=e=>{st.budget=Math.max(0,+e.target.value||0);save();drawBudget();drawSteps()};
/* ================= toolkit: guest list ================= */
const GK='aurelia_guests_'+me,loadG=()=>{try{return JSON.parse(LS.getItem(GK)||'[]')}catch(e){return[]}},saveG=g=>LS.setItem(GK,JSON.stringify(g));
const RS=['Invited','Confirmed','Declined'];let gSel=new Set();
function drawGuests(){const g=loadG(),q=($('#gSearch').value||'').toLowerCase(),c=n=>g.filter(x=>x.rsvp==n).length,cap=H(st.hall).cap;
$('#gStats').innerHTML=`<div><b>${g.length}</b><small>Guests</small></div><div class="gc"><b>${c('Confirmed')}</b><small>Confirmed</small></div><div><b>${c('Invited')}</b><small>Awaiting</small></div><div class="gd"><b>${c('Declined')}</b><small>Declined</small></div>`+(g.length>cap?`<p class="warn">Your list has ${g.length} names but ${esc(H(st.hall).name)} seats ${cap}.</p>`:'');
const L=g.filter(x=>x.name.toLowerCase().includes(q)||x.grp.toLowerCase().includes(q));
gSel=new Set([...gSel].filter(id=>g.some(x=>x.id==id)));const vis=L.map(x=>x.id),allOn=vis.length&&vis.every(id=>gSel.has(id));
$('#gAll').checked=!!allOn;$('#gAll').indeterminate=!allOn&&vis.some(id=>gSel.has(id));$('#gAllT').textContent=allOn?'Unselect all':'Select all';$('#gAll').disabled=!vis.length;
$('#gSelN').textContent=gSel.size?gSel.size+' selected':'';$('#gSelA').hidden=!gSel.size;
$('#gList').innerHTML=L.length?L.map(x=>`<li data-id="${x.id}" class="${gSel.has(x.id)?'sel':''}"><input type="checkbox" class="gck" data-gs="${x.id}" ${gSel.has(x.id)?'checked':''} aria-label="Select ${esc(x.name)}"><span class="gav">${esc(x.name.charAt(0).toUpperCase())}</span><span class="gn"><b>${esc(x.name)}</b><small>${esc(x.grp)}</small></span><button type="button" class="rs ${x.rsvp}" data-gr="${x.id}" aria-label="RSVP for ${esc(x.name)}: ${x.rsvp}. Tap to change">${x.rsvp}</button><button type="button" class="gx" data-gd="${x.id}" aria-label="Remove ${esc(x.name)}">✕</button></li>`).join(''):`<li class="gempty">${g.length?'No guests match your search.':'No guests yet. Add names above and tap their status to track RSVPs.'}</li>`}
$('#gAdd').onsubmit=e=>{e.preventDefault();const names=$('#gnN').value.split(/[,\n]/).map(s=>s.trim()).filter(Boolean);if(!names.length)return;const g=loadG();names.forEach((n,i)=>g.push({id:Date.now()+''+i,name:n.slice(0,40),grp:$('#gnG').value,rsvp:'Invited'}));saveG(g);$('#gnN').value='';drawGuests();drawSteps();toast(names.length+' guest'+(names.length==1?'':'s')+' added.')};
$('#gSearch').oninput=drawGuests;
$('#gList').addEventListener('change',e=>{const id=e.target.dataset.gs;if(!id)return;e.target.checked?gSel.add(id):gSel.delete(id);drawGuests()});
$('#gAll').onchange=e=>{const q=($('#gSearch').value||'').toLowerCase();loadG().filter(x=>x.name.toLowerCase().includes(q)||x.grp.toLowerCase().includes(q)).forEach(x=>e.target.checked?gSel.add(x.id):gSel.delete(x.id));drawGuests()};
$('#gSelA').onclick=e=>{const b=e.target.closest('[data-ba]');if(!b)return;const a=b.dataset.ba;if(a=='none'){gSel.clear();drawGuests();return}let g=loadG();const n=gSel.size;
if(a=='del'){if(!confirm(`Remove ${n} selected guest${n==1?'':'s'}?`))return;g=g.filter(x=>!gSel.has(x.id));gSel.clear()}else g.forEach(x=>{if(gSel.has(x.id))x.rsvp=a});saveG(g);drawGuests();drawSteps();toast(a=='del'?n+' removed.':`${n} marked ${a.toLowerCase()}.`)};
$('#gList').onclick=e=>{const a=e.target.closest('[data-gr],[data-gd]');if(!a){const li=e.target.closest('li[data-id]');if(li&&!e.target.closest('input')){gSel.has(li.dataset.id)?gSel.delete(li.dataset.id):gSel.add(li.dataset.id);drawGuests()}return}let g=loadG();if(a.dataset.gr){const x=g.find(z=>z.id==a.dataset.gr);x.rsvp=RS[(RS.indexOf(x.rsvp)+1)%3];if(x.rsvp=='Confirmed'){const r=a.getBoundingClientRect();burst(r.left+r.width/2,r.top,18)}}else g=g.filter(z=>z.id!=a.dataset.gd);saveG(g);drawGuests();drawSteps()};
$('#gUse').onclick=()=>{const n=loadG().filter(x=>x.rsvp!='Declined').length;if(!n)return toast('Add some guests first.');setGuests(n);toast(`Guest count set to ${st.guests} (declined guests excluded).`)};
$('#gCsv').onclick=()=>{const g=loadG();if(!g.length)return toast('Add some guests first.');const q=s=>'"'+String(s).replace(/"/g,'""')+'"',t='Name,Group,RSVP\r\n'+g.map(x=>[x.name,x.grp,x.rsvp].map(q).join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+t],{type:'text/csv'}));a.download='aurelia-guest-list.csv';a.click();toast('Guest list downloaded.')};
/* ================= toolkit: checklist ================= */
const TK='aurelia_tasks_'+me,loadT=()=>{try{return JSON.parse(LS.getItem(TK)||'null')||{done:[],custom:[]}}catch(e){return{done:[],custom:[]}}},saveT=t=>LS.setItem(TK,JSON.stringify(t));
const TASKS=[['t1','Reserve your hall and date',60],['t2','Taste and finalise the menu',45],['t3','Send out invitations',40],['t4','Confirm decor and theme',30],['t5','Book photographer and entertainment',30],['t6','Finalise the guest list',21],['t7','Pay the final installment',7],['t8','Walk through timings with our coordinator',3]];
function drawTasks(){const T=loadT(),nx=mine().filter(b=>b.date>=today).sort((a,b)=>a.date<b.date?-1:1)[0],ev=nx?nx.date:(st.date&&st.date>=today?st.date:'');
const all=[...TASKS.map(x=>({id:x[0],t:x[1],off:x[2]})),...T.custom.map(x=>({id:x.id,t:x.t,off:null,c:1}))];
const isDone=x=>T.done.includes(x.id)||(x.id=='t1'&&mine().length>0);
$('#tkList').innerHTML=all.map(x=>{const d=isDone(x),due=ev&&x.off!=null?addDays(ev,-x.off):'',od=!d&&due&&due<today;return `<li class="${d?'done':''}"><label class="tk"><input type="checkbox" data-tk="${x.id}" ${d?'checked':''}><span><b>${esc(x.t)}</b><small class="${od?'odt':''}">${due?(od?'Overdue · ':'Due ')+pretty(due):x.c?'Your task':ev?'':'Pick a date to see due dates'}</small></span></label>${x.c?`<button type="button" class="gx" data-td="${x.id}" aria-label="Remove task">✕</button>`:''}</li>`}).join('');
const n=all.filter(isDone).length;$('#tkBar').className='pw-'+(all.length?Math.round(n/all.length*100):0);$('#tkS').textContent=`${n} of ${all.length} done`+(ev?` · event on ${pretty(ev)}`:'')}
$('#tkList').onchange=e=>{const id=e.target.dataset.tk;if(!id)return;const T=loadT();T.done=e.target.checked?[...new Set([...T.done,id])]:T.done.filter(z=>z!=id);saveT(T);drawTasks();drawSteps();if(e.target.checked){const r=e.target.getBoundingClientRect();burst(r.left,r.top,16)}};
$('#tkList').onclick=e=>{const b=e.target.closest('[data-td]');if(!b){const li=e.target.closest('li');if(li&&!e.target.closest('label,input')){const c=li.querySelector('input');if(c){c.checked=!c.checked;c.dispatchEvent(new Event('change',{bubbles:true}))}}return}const T=loadT();T.custom=T.custom.filter(z=>z.id!=b.dataset.td);saveT(T);drawTasks()};
$('#tkAll').onclick=()=>{const T=loadT();T.done=[...TASKS.map(x=>x[0]),...T.custom.map(x=>x.id)];saveT(T);drawTasks();drawSteps();toast('All tasks selected.')};
$('#tkNone').onclick=()=>{const T=loadT();T.done=[];saveT(T);drawTasks();drawSteps();toast(mine().length?'All tasks unselected (the reservation step stays ticked because you have a booking).':'All tasks unselected.')};
$('#tkAdd').onsubmit=e=>{e.preventDefault();const v=$('#tkN').value.trim();if(!v)return;const T=loadT();T.custom.push({id:'c'+Date.now(),t:v});saveT(T);$('#tkN').value='';drawTasks()};
/* ================= compare halls, print plan, share link, back to top ================= */
function drawCmp(){const g=Math.max(1,+st.guests||1);$('#cmpS').textContent=`For ${g} guests in ${new Date(cv.y,cv.m,1).toLocaleDateString('en-IN',{month:'long'})}. Tap a hall to choose it.`;
$('#cmpT').innerHTML=`<table class="cmp"><thead><tr><th>Hall</th><th>Seats</th><th>Rental</th><th>Per guest</th><th>Free days</th><th></th></tr></thead><tbody>${HALLS.map(h=>{const fits=g<=h.cap,fr=monthFree(h.id,cv.y,cv.m);return `<tr class="${h.id==st.hall?'on':''} ${fits?'':'nf'}"><td><b>${esc(h.name)}</b></td><td>${h.cap}${fits?'':' <small class="odt">too small</small>'}</td><td>${fmt(h.price)}</td><td>${fmt(Math.round(h.price/g))}</td><td>${fr}</td><td><button type="button" class="btn sm ${h.id==st.hall?'ghost':''}" data-h="${h.id}" ${fits?'':'disabled'}>${h.id==st.hall?'Selected':'Choose'}</button></td></tr>`}).join('')}</tbody></table>`}
$('#cmpB').onclick=()=>{drawCmp();const d=$('#cmpD');d.showModal?d.showModal():d.setAttribute('open','')};
$('#cmpX').onclick=()=>$('#cmpD').close();
$('#cmpT').addEventListener('click',e=>{if(e.target.closest('[data-h]'))setTimeout(()=>$('#cmpD').close(),150)});
$('#prB').onclick=()=>{const t=calc(),w=window.open('','_blank');if(!w)return toast('Allow pop-ups to print your plan.');const p=dateOk()?plan(t.total,st.date):[],g=loadG();
w.document.write(`<title>Celebration plan</title><link rel="stylesheet" href="print.css"><body><h1>Aurelia Hall · Celebration plan</h1><p>${esc(st.title||(st.type||'Celebration'))} · prepared ${pretty(today)}</p><hr><table class="t"><tr><td>Hall</td><td class="r">${esc(t.h.name)}</td></tr><tr><td>Date</td><td class="r">${st.date?long(st.date):'Not chosen'}</td></tr><tr><td>Guests</td><td class="r">${t.g}</td></tr><tr><td>Hall rental</td><td class="r">${fmt(t.h.price)}</td></tr><tr><td>Catering (${esc(t.c.name)})</td><td class="r">${fmt(t.cat)}</td></tr><tr><td>Decor: ${esc(t.dec.map(d=>d.name).join(', ')||'None')}</td><td class="r">${fmt(t.dc)}</td></tr></table><h2>Total ${fmt(t.total)}</h2>${st.budget?`<p>Budget ${fmt(st.budget)} · ${st.budget>=t.total?fmt(st.budget-t.total)+' remaining':'over by '+fmt(t.total-st.budget)}</p>`:''}${p.length?'<h3>Installments</h3><table class="t">'+p.map((i,k)=>`<tr><td>Installment ${k+1} · due ${pretty(i.due)}</td><td class="r">${fmt(i.amt)}</td></tr>`).join('')+'</table>':''}<p>Guest list: ${g.length} names · ${g.filter(x=>x.rsvp=='Confirmed').length} confirmed</p><script>print()<\/script>`);w.document.close()};
$('#lnB').onclick=()=>{const u=new URL(location.href);u.search='';u.searchParams.set('hall',st.hall);if(st.date)u.searchParams.set('date',st.date);const s=u.toString();(navigator.clipboard?navigator.clipboard.writeText(s):Promise.reject()).then(()=>toast('Link copied. Share it with family.'),()=>prompt('Copy this link:',s))};
const up=$('#up');addEventListener('scroll',()=>up.classList.toggle('show',scrollY>700),{passive:true});up.onclick=()=>scrollTo({top:0,behavior:RM?'auto':'smooth'});
gMsg();renderAll();drawMine();drawGuests();drawBudget();
if(q.get('date')||q.get('hall'))$('#sec-date').scrollIntoView({block:'start'});
})();