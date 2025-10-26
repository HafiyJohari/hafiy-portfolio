(function(){
const fab = document.createElement('button');
fab.className='chat-fab'; fab.textContent='💬 Chat';
document.body.appendChild(fab);


const box = document.createElement('div');
box.className='chat-box';
box.innerHTML = `
<div class="chat-head"><strong>Assistant</strong>
<button class="chip" id="chatClose">✕</button>
</div>
<div class="chat-body" id="chatBody"></div>
<div class="chat-input">
<input id="chatInput" placeholder="Ask about work, resume, email…" />
<button class="chip" id="chatSend">Send</button>
</div>`;
document.body.appendChild(box);


const body = box.querySelector('#chatBody');
const input = box.querySelector('#chatInput');


function add(type, text){
const div = document.createElement('div');
div.className = 'msg ' + type;
div.textContent = text;
body.appendChild(div);
body.scrollTop = body.scrollHeight;
}
function bot(text){ setTimeout(()=>add('bot', text), 200); }


const kb = [
{k:/\b(work|portfolio|projects?)\b/i, a:'Jump to Work → scroll or tap the “Selected Work” section.'},
{k:/\b(resume|cv)\b/i, a:'Here’s my resume (PDF): resume.pdf'},
{k:/\b(email|contact)\b/i, a:'Reach me at hafiyjohari@gmail.com or tap “Let’s talk”.'},
{k:/\b(game|ufo|adventure)\b/i, a:'MkhkAsg Adventure is down the page—tap to start, tap to thrust.'},
{k:/\b(behance)\b/i, a:'Behance: https://www.behance.net/hafiyjohari'}
];
function reply(q){ const hit = kb.find(x => x.k.test(q)); if (hit) return bot(hit.a); bot("Try: 'resume', 'work', 'contact', 'game', or 'Behance'."); }


fab.onclick = ()=>{ box.classList.add('show'); input.focus(); };
box.querySelector('#chatClose').onclick = ()=> box.classList.remove('show');
box.querySelector('#chatSend').onclick = ()=>{ const v = input.value.trim(); if(!v) return; add('me', v); input.value=''; reply(v); };
input.addEventListener('keydown', e=>{ if(e.key==='Enter') box.querySelector('#chatSend').click(); });
setTimeout(()=>bot("Hi! Ask me for ‘resume’, ‘work’, or ‘contact’."), 600);
})();
