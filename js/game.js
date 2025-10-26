// js/game.js
(() => {
  const BASE_W = 960, BASE_H = 540;       // world size (do not change)
  const cvs = document.getElementById('spaceGame');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const overlay = document.getElementById('gameOverlay');

  // ----- Responsive canvas scaling (crisp on mobile) -----
  let scale = 1, dpr = 1;
  function resizeCanvas(){
    // CSS width is the actual space on page
    const cssW = cvs.clientWidth || BASE_W;
    const cssH = cssW * (BASE_H / BASE_W);
    dpr = Math.max(1, window.devicePixelRatio || 1);

    // Set the actual pixel buffer and scale the drawing context
    cvs.width  = Math.round(cssW * dpr);
    cvs.height = Math.round(cssH * dpr);
    scale = (cssW / BASE_W) * dpr;

    // All drawing will be in BASE units, scaled up by 'scale'
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  // Initial + on resize
  resizeCanvas();
  new ResizeObserver(resizeCanvas).observe(cvs);

  // ----- World constants (physics) -----
  const G = 0.35, THRUST = -6, GAP = 130, SPEED = 2.2, STAR_COUNT = 120;

  // Slightly bigger UFO so it reads better on mobile
  const ship = { x: 240, y: 270, vy: 0, w: 36, h: 22 };

  let running = false, started = false, score = 0, best = +localStorage.getItem('mk_best')||0;
  const pipes = [];
  const stars = Array.from({length:STAR_COUNT}, () => ({
    x: Math.random()*BASE_W, y: Math.random()*BASE_H, s: 1 + Math.floor(Math.random()*2)
  }));

  function reset(){
    ship.y = 270; ship.vy = 0;
    pipes.length = 0; score = 0;
    spawnPipe(1000);
    cover('MkhkAsg Adventure','Press / Tap to Start');
  }
  function spawnPipe(startX = BASE_W){
    const top = 60 + Math.random()* (BASE_H - 120 - GAP);
    pipes.push({ x: startX, top: Math.floor(top) });
  }

  // Tap anywhere to thrust (no need to hit the ship)
  function tap(){
    if(!started){
      started = true; running = true; overlay.style.display='none';
      pipes.length=0; score=0; ship.y=270; ship.vy=0; spawnPipe(1000);
      return;
    }
    if(!running) return;
    ship.vy = THRUST;
  }
  cvs.addEventListener('mousedown', tap);
  cvs.addEventListener('touchstart', e=>{ e.preventDefault(); tap(); }, {passive:false});
  window.addEventListener('keydown', e=>{ if(e.code==='Space' || e.code==='ArrowUp') tap(); });

  // ----- Helpers -----
  function pxRect(x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(x|0,y|0,w|0,h|0); }

  function drawShip(){
    const x = ship.x|0, y = ship.y|0;
    // saucer base (bigger than before)
    pxRect(x-18, y-5, 36, 10, '#cfd3da');   // hull
    pxRect(x-16, y+5, 32, 3, '#9aa7b5');    // belly shadow
    // windows
    pxRect(x-10, y-1, 5, 3, '#0af');
    pxRect(x-3,  y-1, 5, 3, '#0af');
    pxRect(x+4,  y-1, 5, 3, '#0af');
    // glass dome
    pxRect(x-7, y-11, 14, 7, '#e6fbff');
    // flame when thrusting
    if (ship.vy < 0){
      pxRect(x-4, y+8, 8, 2, '#ffe066');
      pxRect(x-3, y+10, 6, 2, '#ff9b3d');
    }
  }
  function drawStars(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,BASE_W,BASE_H);
    ctx.fillStyle = '#fff';
    for (const st of stars){
      ctx.fillRect(st.x|0, st.y|0, st.s, st.s);
      st.x -= SPEED * (0.3 + st.s*0.1);
      if (st.x < -2){ st.x = BASE_W + Math.random()*60; st.y = Math.random()*BASE_H; }
    }
  }
  function drawPipe(p){
    const x = p.x|0; const topH = p.top|0;
    const botY = (p.top + GAP)|0; const botH = (BASE_H - botY)|0;
    for (let i=0;i<topH;i+=8){ ctx.fillStyle = i%16? '#b3b3b3':'#9a9a9a'; ctx.fillRect(x, i, 40, 8); }
    for (let j=botY;j<BASE_H;j+=8){ ctx.fillStyle = j%16? '#b3b3b3':'#9a9a9a'; ctx.fillRect(x, j, 40, 8); }
    ctx.fillStyle = '#ff3344';
    ctx.fillRect(x-1, topH-1, 42, 2);
    ctx.fillRect(x-1, botY-1, 42, 2);
  }
  function collide(){
    for (const p of pipes){
      if (ship.x+ship.w/2 > p.x && ship.x-ship.w/2 < p.x+40){
        if (ship.y-ship.h/2 < p.top || ship.y+ship.h/2 > p.top+GAP) return true;
      }
    }
    return (ship.y < 10 || ship.y > BASE_H-10);
  }

  function update(){
    ship.vy += G; ship.y += ship.vy;

    if (pipes.length === 0 || pipes[pipes.length-1].x < BASE_W-260) spawnPipe();
    for (const p of pipes){ p.x -= SPEED; }
    if (pipes[0] && pipes[0].x < -60) pipes.shift();

    for (const p of pipes){
      if (!p.passed && ship.x > p.x+40){ p.passed = true; score++; }
    }

    if (collide()){
      running = false; best = Math.max(best, score);
      localStorage.setItem('mk_best', best);
      cover('Game Over',`Score: ${score} • Best: ${best}<br/>Press / Tap to retry`);
      started = false;
    }
  }

  function draw(){
    // ensure we draw with the current transform (in case of resize mid-frame)
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    drawStars();
    for (const p of pipes) drawPipe(p);
    drawShip();

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE ${String(score).padStart(2,'0')}`, 16, 28);
  }

  function loop(){ if (running) update(); draw(); requestAnimationFrame(loop); }

  function cover(title, sub){
    overlay.style.display='grid';
    overlay.innerHTML = `
      <div class="cover">
        <div class="cover-title">${title}</div>
        <div class="cover-sub">${sub}</div>
      </div>`;
  }

  // boot
  cover('MkhkAsg Adventure','Press / Tap to Start');
  loop();

})();
