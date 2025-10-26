/* ---------- DATA ---------- */
const slides = [
'Logo Budak Butter_v2-01.jpg',
'Hafiy Johari 0.5081994_PatternOnly-01.png',
'Hafiy Johari Concept Logo Compilation-01.png',
'20240807_Random Comp_v1-01.jpg'
].map(n => `assets/${n}`);


const projects = [
{ title:'Budak Butter — Packaging', subtitle:'Logo options and pack mockups', image:'Logo Budak Butter_v2-01.jpg', tags:['Branding','Packaging'], link:'#', year:2024 },
{ title:'Personal Pattern', subtitle:'Vector repeat — skull gas mask', image:'Hafiy Johari 0.5081994_PatternOnly-01.png', tags:['Pattern','Illustration'], link:'#', year:2023 },
{ title:'Logo Compilation', subtitle:'Marks & symbols exploration', image:'Hafiy Johari Concept Logo Compilation-01.png', tags:['Identity'], link:'#', year:2022 }
];


/* ---------- SLIDESHOW ---------- */
const track = document.getElementById('track');
const dots = document.getElementById('dots');
let idx = 0, timer;
slides.forEach((src, i) => {
const s = document.createElement('div');
s.className = 'slide';
s.innerHTML = `<img src="${src}" alt="Featured ${i+1}" data-lightbox="${src}">`;
track.appendChild(s);
const d = document.createElement('button');
d.className = 'dot' + (i===0?' active':'');
d.addEventListener('click', ()=>go(i));
dots.appendChild(d);
});
function go(i){ idx = (i + slides.length) % slides.length; track.style.transform = `translateX(${-idx*100}%)`; [...dots.children].forEach((el,j)=> el.classList.toggle('active', j===idx)); }
function next(){ go(idx+1); }
function prev(){ go(idx-1); }
document.getElementById('next').onclick = next;
document.getElementById('prev').onclick = prev;
function start(){ timer = setInterval(next, 4000); }
function stop(){ clearInterval(timer); }
document.getElementById('slider').addEventListener('mouseenter', stop);
document.getElementById('slider').addEventListener('mouseleave', start);
start();


/* ---------- GRID ---------- */
const grid = document.getElementById('grid');
const count = document.getElementById('count');
function cardTemplate(p){
const src = `assets/${p.image}`;
const t = document.createElement('article');
t.className='card';
t.innerHTML = `
<a href="${p.link || '#'}">
<div class="thumb">
<img src="${src}" alt="${p.title}" data-lightbox="${src}">
<div class="pillwrap">${(p.tags||[]).map(tag=>`<span class='pill'>${tag}</span>`).join('')}</div>
</div>
<div class="body">
<div class="meta"><span>${p.year||''}</span></div>
<h3>${p.title}</h3>
<div class="sub">${p.subtitle||''}</div>
</div>
</a>`;
t.addEventListener('mousemove', (e)=>{
const r = t.getBoundingClientRect();
const x = (e.clientX - r.left) / r.width - .5;
const y = (e.clientY - r.top) / r.height - .5;
t.style.transform = `rotateX(${-y*2}deg) rotateY(${x*2}deg) translateY(-2px)`;
});
t.addEventListener('mouseleave', ()=>{ t.style.transform='translateY(0)'; });
return t;
}
projects.forEach(p=> grid.appendChild(cardTemplate(p)));
count.textContent = projects.length;


/* ---------- LIGHTBOX ---------- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
let lbList = slides.slice();
let lbIndex = 0;
function openLB(src, list){ lbList = list || slides; lbIndex = lbList.indexOf(src); if (lbIndex < 0) lbIndex = 0; lbImg.src = lbList[lbIndex]; lb.classList.add('show'); lb.setAttribute('aria-hidden','false'); }
function closeLB(){ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }
function lbGo(delta){ lbIndex = (lbIndex + delta + lbList.length) % lbList.length; lbImg.src = lbList[lbIndex]; }
lbClose.addEventListener('click', (e)=>{ e.stopPropagation(); closeLB(); });
lb.addEventListener('click', (e)=>{ if(e.target === lb) closeLB(); });
lbPrev.onclick = ()=>lbGo(-1);
lbNext.onclick = ()=>lbGo(1);
document.addEventListener('keydown', e=>{ if(!lb.classList.contains('show')) return; if(e.key==='Escape') closeLB(); if(e.key==='ArrowRight') lbGo(1); if(e.key==='ArrowLeft') lbGo(1*-1); });
document.addEventListener('click', e=>{ const el = e.target.closest('[data-lightbox]'); if(!el) return; e.preventDefault(); const src = el.getAttribute('data-lightbox'); const gridImgs = [...document.querySelectorAll('#grid .thumb img')].map(i => i.getAttribute('data-lightbox')); const list = el.closest('#grid') ? gridImgs : slides; openLB(src, list); });


/* ---------- SCROLL REVEAL ---------- */
const ro = new IntersectionObserver(entries=>{ entries.forEach(el=>{ if(el.isIntersecting){ el.target.classList.add('show'); ro.unobserve(el.target); } }); }, {threshold:.08});
document.querySelectorAll('.reveal').forEach(n=>ro.observe(n));


/* ---------- THEME TOGGLE ---------- */
const rootEl = document.documentElement;
const toggle = document.getElementById('themeToggle');
const toggle2 = document.getElementById('themeToggle2');
function applyTheme(mode){ rootEl.setAttribute('data-theme', mode); localStorage.setItem('theme', mode); const label = mode === 'dark' ? '🌙 Dark' : '🌤️ Light'; if (toggle) toggle.textContent = label; if (toggle2) toggle2.textContent = label; }
applyTheme(localStorage.getItem('theme') || 'dark');
function flipTheme(){ applyTheme(rootEl.getAttribute('data-theme')==='dark'?'light':'dark'); }
toggle?.addEventListener('click', flipTheme);
toggle2?.addEventListener('click', flipTheme);
