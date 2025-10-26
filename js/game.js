(() => {
const cvs = document.getElementById('spaceGame');
if (!cvs) return;
const ctx = cvs.getContext('2d');
const overlay = document.getElementById('gameOverlay');


// World constants
const G = 0.35, THRUST = -6, GAP = 130, SPEED = 2.2, STAR_COUNT = 120;
let running = false, started = false, score = 0, best = +localStorage.getItem('mk_best')||0;
const ship = { x: 240, y: 270, vy: 0, w: 28, h: 18 };
const pipes = [];
const stars = Array.from({length:STAR_COUNT}, () => ({ x: Math.random()*960, y: Math.random()*540, s: 1+Math.floor(Math.random()*2) }));


function reset(){ ship.y = 270; ship.vy = 0; pipes.length = 0; score = 0; spawnPipe(1000); cover('MkhkAsg Adventure','Press / Tap to Start'); }
function spawnPipe(startX = 960){ const top = 60 + Math.random()* (540 - 120 - GAP); pipes.push({ x: startX, top: Math.floor(top) }); }


function tap(){ if(!started){ started = true; running = true; overlay.style.display='none'; pipes.length=0; score=0; ship.y=270; ship.vy=0; spawnPipe(1000); return; } if(!running) return; ship.vy = THRUST; }


cvs.addEventListener('mousedown', tap);
cvs.addEventListener('touchstart', e=>{ e.preventDefault(); tap(); }, {passive:false});
window.addEventListener('keydown', e=>{ if(e.code==='Space' || e.code==='ArrowUp') tap(); });


function pxRect(x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(x|0,y|0,w|0,h|0); }
function drawShip(){
const x = ship.x|0, y = ship.y|0;
// saucer base
pxRect(x-14, y-4, 28, 8, '#cfd3da'); // hull
pxRect(x-12, y+4, 24, 3, '#9aa7b5'); // belly shadow
// windows
pxRect(x-8, y-1, 4, 3, '#0af');
pxRect(x-2, y-1, 4, 3, '#0af');
pxRect(x+4, y-1, 4, 3, '#0af');
// glass dome
pxRect(x-6, y-9, 12, 6, '#e6fbff');
if (ship.vy < 0){ pxRect(x-3, y+7, 6, 2, '#ffe066'); pxRect(x-2, y+9, 4, 2, '#ff9b3d'); }
}
function drawStars(){ ctx.fillStyle = '#000'; ctx.fillRect(0,0,960,540); ctx.fillStyle = '#fff'; for (const st of stars){ ctx.fillRect(st.x|0, st.y|0, st.s, st.s); st.x -= SPEED * (0.3 + st.s*0.1); if (st.x < -2){ st.x = 960 + Math.random()*60; st.y = Math.random()*540; } } }
function drawPipe(p){ const x = p.x|0; const topH = p.top|0; const botY = (p.top + GAP)|0; const botH = (540 - botY)|0; for (let i=0;i<topH;i+=8){ ctx.fillStyle = i%16? '#b3b3b3':'#9a9a9a'; ctx.fillRect(x, i, 40, 8); } for (let j=botY;j<540;j+=8){ ctx.fillStyle = j%16? '#b3b3b3':'#9a9a9a'; ctx.fillRect(x, j, 40, 8); } ctx.fillStyle = '#ff3344'; ctx.fillRect(x-1, topH-1, 42, 2); ctx.fillRect(x-1, botY-1, 42, 2); }
function collide(){ for (const p of pipes){ if (ship.x+ship.w/2 > p.x && ship.x-ship.w/2 < p.x+40){ if (ship.y-ship.h/2 < p.top || ship.y+ship.h/2 > p.top+GAP) return true; } } return (ship.y < 10 || ship.y > 530); }
function update(){ ship.vy += G; ship.y += ship.vy; if (pipes.length === 0 || pipes[pipes.length-1].x < 960-260) spawnPipe(); for (const p of pipes){ p.x -= SPEED; } if (pipes[0] && pipes[0].x < -60) pipes.shift(); for (const p of pipes){ if (!p.passed && ship.x > p.x+40){ p.passed = true; score++; } }
if (collide()){ running = false; best = Math.max(best, score); localStorage.setItem('mk_best', best); cover('Game Over',`Score: ${score} • Best: ${best}<br/>Press / Tap to retry`); started = false; } }
function draw(){ drawStars(); for (const p of pipes) drawPipe(p); drawShip(); ctx.fillStyle = '#fff'; ctx.font = '16px "Press Start 2P", monospace'; ctx.textAlign = 'left'; ctx.fillText(`SCORE ${String(score).padStart(2,'0')}`, 16, 28); }
function loop(){ if (running) update(); draw(); requestAnimationFrame(loop); }
function cover(title, sub){ overlay.style.display='grid'; overlay.innerHTML = `<div class="cover"><div class="cover-title">${title}</div><div class="cover-sub">${sub}</div></div>`; }
cover('MkhkAsg Adventure','Press / Tap to Start');
loop();
})();
