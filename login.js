/* Aurelia Hall – celebratory login. Signs in / creates accounts (stored in this browser) then opens the planner. */
(function(){
const $=s=>document.querySelector(s),LS=localStorage,root=document.documentElement;
root.dataset.theme=LS.getItem('aurelia_theme')||'dark';
root.dir=LS.getItem('aurelia_dir')==='rtl'?'rtl':'ltr';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* after signing in we always open the home page (this page is standalone) */
const NEXT='index.html';
/* already signed in -> straight to the planner */
if(LS.getItem('aurelia_user')&&!(LS.getItem('aurelia_keep')==='0'&&!sessionStorage.getItem('aurelia_sess'))){location.replace(NEXT);return}
/* images */
[['#pi1','idWed'],['#pi2','idBday'],['#pi3','idEng']].forEach(([s,k])=>{const i=$(s);i.src=imgUrl(k,420);i.onerror=()=>i.classList.add('off')});
/* balloons */
if(!RM)$('.balloons').innerHTML='<i></i><i></i><i></i><i></i><i></i>';
/* theme toggle */
const sun='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',moon='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const paintTh=()=>$('#th').innerHTML=root.dataset.theme=='dark'?sun:moon;paintTh();
$('#th').onclick=()=>{root.dataset.theme=root.dataset.theme=='dark'?'light':'dark';LS.setItem('aurelia_theme',root.dataset.theme);paintTh();COL=pal()};
/* RTL / LTR switch */
const paintDir=()=>{const r=root.dir=='rtl';$('#rtl').setAttribute('aria-pressed',r);$('#rtlT').textContent=r?'LTR':'RTL';$('#rtl').setAttribute('aria-label',r?'Switch text direction to left-to-right':'Switch text direction to right-to-left')};paintDir();
$('#rtl').onclick=()=>{root.dir=root.dir=='rtl'?'ltr':'rtl';LS.setItem('aurelia_dir',root.dir);paintDir()};
/* testimonials */
const Q=[['The team handled 450 guests without a single hiccup. Our wedding felt effortless.','Priya & Karthik','Wedding · Grand Ballroom'],['Tracking every installment online meant no chasing and no confusion.','Rahul M.','Corporate dinner · Sapphire Lounge'],['The terrace at sunset made my parents’ 60th unforgettable.','Divya S.','Anniversary · Marigold Terrace'],['Booking the date and choosing the menu took one evening.','Imran & Sana','Engagement · Rose Court']];
let qi=0,qt;const qEl=$('#quote'),qD=$('#qDots');
qD.innerHTML=Q.map((_,i)=>`<button type="button" aria-label="Review ${i+1}"></button>`).join('');
function showQ(i,anim=true){qi=i;const f=()=>{const q=Q[i];qEl.innerHTML=`<p>“${q[0]}”</p><b>${q[1]}</b><small>${q[2]}</small>`;[...qD.children].forEach((d,k)=>d.classList.toggle('on',k==i));qEl.classList.remove('out')};if(anim&&!RM){qEl.classList.add('out');setTimeout(f,350)}else f()}
[...qD.children].forEach((d,i)=>d.onclick=()=>{showQ(i);clearInterval(qt);qt=setInterval(()=>showQ((qi+1)%Q.length),6000)});
showQ(0,false);if(!RM)qt=setInterval(()=>showQ((qi+1)%Q.length),6000);
/* rotating word + counters */
const W=['wedding','birthday','engagement','reception','celebration'];let wi=0;
if(!RM)setInterval(()=>{const r=$('#rot');r.classList.add('out');setTimeout(()=>{wi=(wi+1)%W.length;r.textContent=W[wi];r.classList.remove('out')},400)},2600);
document.querySelectorAll('[data-n]').forEach(b=>{const n=+b.dataset.n;if(RM){b.textContent=n;return}let t0=null;requestAnimationFrame(function f(t){t0=t0||t;const p=Math.min((t-t0)/1400,1);b.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})});
/* confetti */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[],run=false;const pal=()=>{const s=getComputedStyle(document.documentElement);return['--secondary','--primary','--white'].map(v=>s.getPropertyValue(v).trim())};let COL=pal();
function burst(x,y,n=160){if(RM)return;cv.width=innerWidth;cv.height=innerHeight;for(let i=0;i<n;i++){const a=Math.random()*6.28,v=4+Math.random()*10;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-6,s:3+Math.random()*5,r:Math.random()*6.28,vr:(Math.random()-.5)*.4,c:COL[i%COL.length],l:1})}
if(!run){run=true;requestAnimationFrame(function f(){cx.clearRect(0,0,cv.width,cv.height);P=P.filter(p=>p.l>0);for(const p of P){p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=.011;cx.save();cx.globalAlpha=Math.max(p.l,0);cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s,-p.s/2,p.s*2,p.s);cx.restore()}if(P.length)requestAnimationFrame(f);else{run=false;cx.clearRect(0,0,cv.width,cv.height)}})}}
function toast(m){const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
/* accounts */
const users=()=>{try{return JSON.parse(LS.getItem('aurelia_users')||'null')||{'demo@aurelia.com':{name:'Demo Client',pw:'demo123'}}}catch(e){return{'demo@aurelia.com':{name:'Demo Client',pw:'demo123'}}}};
const saveU=u=>LS.setItem('aurelia_users',JSON.stringify(u));
const validEmail=e=>/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const msg=(m,ok)=>{const e=$('#lgM');e.textContent=m;e.classList.toggle('ok',!!ok)};
const fail=(m,field)=>{msg(m);[$('#lgE'),$('#lgP'),$('#lgN')].forEach(i=>i.classList.remove('bad'));if(field)field.classList.add('bad');const c=$('#lgCard');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');if(field)field.focus()};
/* sign in / create account tabs */
let up=false;
function mode(s){up=s;$('.tabs').classList.toggle('up',s);$('#tabIn').setAttribute('aria-selected',!s);$('#tabUp').setAttribute('aria-selected',s);$('#nmW').hidden=!s;$('#meter').hidden=!s;$('#upX').hidden=!s;$('#termsW').hidden=!s;
$('#lgH').innerHTML=s?'Join the <em>party</em>':'Let’s <em>celebrate</em>';$('#lgK').textContent=s?'Create your account':'Welcome back';$('.bt').textContent=s?'Create account':'Sign in';
$('#lgP').autocomplete=s?'new-password':'current-password';$('#demoHint').hidden=s;msg('');[$('#lgE'),$('#lgP'),$('#lgN')].forEach(i=>i.classList.remove('bad'))}
$('#tabIn').onclick=()=>mode(false);$('#tabUp').onclick=()=>mode(true);
/* password: show/hide, caps lock, strength */
const eyeO='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',eyeC='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A10.7 10.7 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22"/></svg>';
$('#eye').innerHTML=eyeO;
$('#eye').onclick=()=>{const p=$('#lgP'),s=p.type=='password';p.type=s?'text':'password';$('#eye').innerHTML=s?eyeC:eyeO;$('#eye').setAttribute('aria-pressed',s);$('#eye').setAttribute('aria-label',s?'Hide password':'Show password')};
$('#lgP').addEventListener('keyup',e=>{$('#caps').hidden=!(e.getModifierState&&e.getModifierState('CapsLock'))});
$('#lgP').addEventListener('blur',()=>$('#caps').hidden=true);
$('#lgP').addEventListener('input',e=>{const v=e.target.value;let s=0;if(v.length>=6)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v)||v.length>=12)s++;if(!v)s=0;$('#meter').dataset.s=s;$('#meterT').textContent=['Password strength','Weak','Okay','Good','Strong'][s]});
/* demo */
$('#lgD').onclick=()=>{mode(false);$('#lgE').value='demo@aurelia.com';$('#lgP').value='demo123';[$('#lgE'),$('#lgP')].forEach(i=>i.dispatchEvent(new Event('input')));toast('Demo details filled in. Press Sign in.')};
/* simple lock after 5 wrong passwords */
let bad=0,lockUntil=0;
function lockTick(){const b=$('#lgGo');if(Date.now()>=lockUntil){b.disabled=false;$('.bt').textContent=up?'Create account':'Sign in';msg('');return}b.disabled=true;$('.bt').textContent=`Locked ${Math.ceil((lockUntil-Date.now())/1000)}s`;setTimeout(lockTick,500)}
/* submit */
$('#lgForm').onsubmit=e=>{e.preventDefault();
const em=$('#lgE').value.trim().toLowerCase(),pw=$('#lgP').value,u=users();
if(Date.now()<lockUntil)return fail(`Too many attempts. Try again in ${Math.ceil((lockUntil-Date.now())/1000)}s.`);
if(up&&!$('#lgN').value.trim())return fail('Please tell us your name.',$('#lgN'));
if(!validEmail(em))return fail('Please enter a valid email address.',$('#lgE'));
if(pw.length<4)return fail('Password must be at least 4 characters.',$('#lgP'));
if(up){if(u[em])return fail('This email is already registered. Please sign in.',$('#lgE'));
if(!$('#lgA').checked)return fail('Please accept the booking terms to continue.');
u[em]={name:$('#lgN').value.trim(),pw,phone:$('#lgT').value.trim(),occasion:(document.querySelector('input[name=occ]:checked')||{}).value||'',joined:Date.now()};saveU(u)}
else if(!u[em]||u[em].pw!==pw){if(++bad>=5){lockUntil=Date.now()+30000;bad=0;lockTick();return fail('Too many attempts. Please wait 30 seconds.')}return fail(`Email or password is incorrect. ${5-bad} attempt${5-bad==1?'':'s'} left.`,$('#lgP'))}
bad=0;
saveU(u);LS.setItem('aurelia_user',em);LS.setItem('aurelia_keep',$('#lgR').checked?'1':'0');sessionStorage.setItem('aurelia_sess','1');
const b=$('#lgGo');b.disabled=true;b.classList.add('load');msg(up?'Account created. Opening your planner…':'Signed in. Opening your planner…',true);
const r=b.getBoundingClientRect();burst(r.left+r.width/2,r.top,170);
setTimeout(()=>{location.href=NEXT},1300)};
/* forgot password (demo: resets the password stored in this browser) */
const fg=$('#fgM');
$('#fgB').onclick=()=>{$('#viewMain').hidden=true;$('#viewForgot').hidden=false;$('#fgE').value=$('#lgE').value;$('#fgE').dispatchEvent(new Event('input'));fg.textContent=''};
$('#fgBack').onclick=()=>{$('#viewForgot').hidden=true;$('#viewMain').hidden=false};
$('#fgForm').onsubmit=e=>{e.preventDefault();const em=$('#fgE').value.trim().toLowerCase(),pw=$('#fgP').value,u=users();fg.classList.remove('ok');
if(!validEmail(em))return fg.textContent='Please enter a valid email address.';
if(!u[em])return fg.textContent='We could not find an account with that email.';
if(pw.length<4)return fg.textContent='New password must be at least 4 characters.';
u[em].pw=pw;saveU(u);toast('Password updated. Please sign in.');$('#fgBack').click();$('#lgE').value=em;$('#lgP').value='';$('#lgE').dispatchEvent(new Event('input'));$('#lgP').focus()};
})();
