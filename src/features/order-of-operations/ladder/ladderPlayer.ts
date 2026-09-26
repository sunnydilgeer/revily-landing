// @ts-nocheck
/*
 * BIDMAS ladder player: animated lesson on a 16:9 stage with a seekable timeline, captions,
 * speed, part chips, a four-question "Your turn" and "Try your own".
 *
 * Ported with minimal changes from the Revily lesson prototype (a single imperative script), so
 * it is mounted into a container rather than rewritten as React. Changes from the prototype:
 * elements are looked up inside the container, styles are scoped to .lp, the rule-based stepper
 * lives in ./bidmasStepper, the photo reader is removed (it needs a server with logins, limits
 * and photo deletion first), and mountLadderPlayer returns a clean-up function.
 * Type checking is off for this file only; the maths is tested in scripts/verify-bidmas-stepper.cjs.
 */
import { solve, SumError } from './bidmasStepper'

export const LADDER_MARKUP = "<div class=\"page\">\n\n  <div class=\"wrap\" id=\"wrap\">\n    <div class=\"stage\" id=\"stage\" aria-hidden=\"true\"></div>\n    <div class=\"caption\" id=\"caption\" aria-live=\"polite\"></div>\n    <div class=\"overlay\" id=\"overlay\"></div>\n  </div>\n\n  <div class=\"scrub\">\n    <span class=\"time\" id=\"tNow\">0:00</span>\n    <div class=\"track\">\n      <div class=\"ticks\" id=\"ticks\" aria-hidden=\"true\"></div>\n      <input type=\"range\" id=\"seek\" min=\"0\" max=\"1000\" step=\"100\" value=\"0\" aria-label=\"Lesson position\">\n    </div>\n    <span class=\"time\" id=\"tTot\">0:00</span>\n  </div>\n\n\n  <div class=\"controls\">\n    <button class=\"ctl play\" id=\"btnPlay\" type=\"button\"></button>\n    <button class=\"ctl\" id=\"btnPrev\" type=\"button\" aria-label=\"Previous part\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M6 5h2v14H6zM20 5v14L9 12z\"/></svg></button>\n    <button class=\"ctl\" id=\"btnReplay\" type=\"button\" aria-label=\"Replay this part\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M4 12a8 8 0 1 0 2.4-5.7\"/><path d=\"M4 4v5h5\"/></svg></button>\n    <button class=\"ctl\" id=\"btnNext\" type=\"button\" aria-label=\"Next part\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M16 5h2v14h-2zM4 5v14l11-7z\"/></svg></button>\n    <span class=\"spacer\"></span>\n    <button class=\"ctl cc\" id=\"btnCC\" type=\"button\" aria-pressed=\"true\"><b>CC</b><span class=\"lbl\" id=\"ccLbl\">Captions on</span></button>\n    <button class=\"ctl\" id=\"btnSpeed\" type=\"button\" aria-label=\"Change speed\"><span class=\"lbl\">Speed </span>1×</button>\n  </div>\n\n  <nav class=\"chips\" id=\"chips\" aria-label=\"Lesson parts\"></nav>\n\n  <section class=\"try\" aria-labelledby=\"tryH\">\n    <div class=\"try-head\">\n      <h2 id=\"tryH\">Try your own sum</h2>\n      <p>Type any BIDMAS sum and watch it worked out step by step on the ladder.</p>\n    </div>\n    <form class=\"try-row\" id=\"tryForm\" autocomplete=\"off\">\n      <label class=\"sr\" for=\"tryInput\">Your sum</label>\n      <input id=\"tryInput\" type=\"text\" spellcheck=\"false\" autocapitalize=\"off\" placeholder=\"e.g. (8 − 2) × 3² ÷ 6\">\n      <button class=\"ctl play\" type=\"submit\">Show me the steps</button>\n    </form>\n    <div class=\"keys\" aria-label=\"Maths keys\">\n      <button class=\"ctl key\" type=\"button\" data-k=\"×\" aria-label=\"times\">×</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"÷\" aria-label=\"divide\">÷</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"+\" aria-label=\"plus\">+</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"−\" aria-label=\"minus\">−</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"(\" aria-label=\"open bracket\">(</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\")\" aria-label=\"close bracket\">)</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"²\" aria-label=\"squared\">x²</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"³\" aria-label=\"cubed\">x³</button>\n      <button class=\"ctl key\" type=\"button\" data-k=\"√\" aria-label=\"square root\">√</button>\n    </div>\n    <div class=\"examples\"><span>Try</span>\n      <button class=\"ex-btn\" type=\"button\">20 ÷ 4 × 5</button>\n      <button class=\"ex-btn\" type=\"button\">(2 + 3)² − 4 × 2</button>\n      <button class=\"ex-btn\" type=\"button\">√16 + 3 × (7 − 5)</button>\n      <button class=\"ex-btn\" type=\"button\">18 − 12 ÷ 4 + 1</button>\n    </div>\n    <p class=\"try-msg\" id=\"tryMsg\" aria-live=\"polite\"></p>\n  </section>\n\n</div>"

export function mountLadderPlayer(root) {
root.innerHTML = LADDER_MARKUP;
const $ = id => root.querySelector('#' + id);

let STAGE = $('stage');
const REAL = STAGE;
const WRAP = $('wrap');
const CAP = $('caption');
const OV = $('overlay');

/* ---------- scaling ---------- */
function fit(){ REAL.style.transform = `scale(${WRAP.clientWidth/1280})`; }
const ro = new ResizeObserver(fit); ro.observe(WRAP); fit();

/* ---------- data ---------- */
const ORDER = ['B','I','DM','AS'];
const R = {
  B:{name:'Brackets', sub:'do ( ) first', n:'1st'},
  I:{name:'Indices', sub:'powers & roots', n:'2nd'},
  DM:{name:'Divide & Multiply', sub:'equal: left to right', n:'3rd'},
  AS:{name:'Add & Subtract', sub:'equal: left to right', n:'4th'}
};
const RUNG = {B:'B',I:'I',D:'DM',M:'DM',A:'AS',S:'AS'};
const OPS = new Set(['+','−','×','÷','(',')']);

/* ---------- engine ----------
   Every scene is a script. Time only moves inside wait() and say(), so a scene can be
   fast-forwarded to any moment by replaying it with the waits skipped. The slider uses this. */
let runId = 0, playing = false, started = false, speed = 1, cur = 0, dragging = false, active = null;
const CANCEL = {cancel:true};
const answers = {};
const sleep = ms => new Promise(r=>setTimeout(r,ms));
function check(R){ if(!R.measure && R.id!==runId) throw CANCEL; }

function endFast(R){
  if (!R.fast) return;
  R.fast = false;
  if (R.measure) return;
  STAGE.querySelectorAll('*').forEach(e=>e.classList.add('ff'));
  STAGE.classList.remove('instant');
}
async function wait(ms, R){
  check(R);
  if (R.fast){
    if (R.t + ms <= R.target){ R.t += ms; return; }
    ms = R.t + ms - R.target; R.t = R.target; endFast(R); tick(R);
  }
  let left = ms, last = performance.now();
  while(left > 0){
    await sleep(Math.min(50, Math.max(10,left)));
    check(R);
    const now = performance.now();
    if (playing && !dragging){ const d = Math.min(left, (now-last)*speed); left -= d; R.t += d; }
    last = now; tick(R);
  }
}

function fmt(t){ return t.replace(/\{(B|I|DM|AS):([^}]*)\}/g,'<span class="k r-$1">$2</span>'); }
function strip(t){ return t.replace(/\{(?:B|I|DM|AS):([^}]*)\}/g,'$1'); }
function setCaption(t){ CAP.classList.remove('forced'); CAP.innerHTML = fmt(t); }

async function say(R, text, extra=0){
  check(R);
  if (!R.measure) setCaption(text);
  const words = strip(text).split(/\s+/).length;
  await wait(1000 + words*340 + extra, R);
}
function hint(R, text){ if (R.measure) return; CAP.innerHTML = `<span class="hint">${text}</span>`; CAP.classList.add('forced'); }

async function ask(R, buttons, key, correct){
  check(R);
  if (R.measure) return answers[key] ?? correct;
  if (R.fast && answers[key] != null) return answers[key];
  if (R.fast){ R.target = R.t; endFast(R); tick(R); }   // can't skip past an unanswered question
  let chosen = null;
  buttons.forEach(b=>b.addEventListener('click',()=>{ if(chosen===null) chosen=b.dataset.v; }));
  while(chosen===null){ await sleep(80); check(R); }
  const changed = answers[key] !== chosen;
  answers[key] = chosen;
  if (changed) setTimeout(remeasureQuiz, 0);
  return chosen;
}

function ctx(R){ return { w:ms=>wait(ms,R), say:(t,x)=>say(R,t,x), ask:(b,k,c)=>ask(R,b,k,c), hint:t=>hint(R,t) }; }

/* ---------- drawing helpers ---------- */
function mk(cls, html='', css='', parent=STAGE, tag='div'){
  const d=document.createElement(tag); d.className=cls; d.innerHTML=html; if(css) d.style.cssText=css; parent.appendChild(d); return d;
}
function pos(el){ let x=0,y=0; while(el && el!==STAGE){ x+=el.offsetLeft; y+=el.offsetTop; el=el.offsetParent; } return {x,y}; }
function head(eyebrow, title){ mk('head', `<div class="eyebrow">${eyebrow}</div><h2 class="ttl">${title}</h2>`); }
function marginLine(x=404){ mk('marginline','',`left:${x}px`); }
const ARROW = `<svg viewBox="0 0 34 34" width="34" height="34"><path d="M4 17h22M17 7l11 10-11 10" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function ladder({x,y,w,h,gap=16,hideLetters=false}){
  const lw = Math.round(Math.max(w*.26, h*1.28));
  const total = 4*h + 3*gap;
  mk('rail','',`left:${x-16}px;top:${y-22}px;height:${total+44}px`);
  mk('rail','',`left:${x+w+8}px;top:${y-22}px;height:${total+44}px`);
  const rungs = {};
  ORDER.forEach((k,r)=>{
    const L = k.length===2 ? `<span class="L">${k[0]}</span><span class="eq">=</span><span class="L">${k[1]}</span>` : `<span class="L">${k}</span>`;
    const d = mk(`rung r-${k}${hideLetters?' hideL':''}`,
      `<div class="rl" style="width:${lw}px">${L}</div><div class="rt"><b>${R[k].name}</b><small>${R[k].sub}</small></div><div class="rn">${R[k].n}</div><div class="stamp">none</div>`,
      `left:${x}px;top:${y+r*(h+gap)}px;width:${w}px;height:${h}px;--h:${h}px;animation-delay:${r*80}ms`);
    rungs[k]=d;
  });
  const ptr = mk('ptr', ARROW, `left:${x-58}px;top:${y+h/2-17}px;opacity:0`);
  return {
    rungs, ptr,
    reset(){ Object.values(rungs).forEach(d=>d.classList.remove('on','no','dim')); ptr.style.opacity=0; },
    point(k){ const r=ORDER.indexOf(k); ptr.style.opacity=1; ptr.style.top=(y+r*(h+gap)+h/2-17)+'px'; },
    scan(k, found){ this.point(k); Object.values(rungs).forEach(d=>d.classList.remove('on')); rungs[k].classList.add(found?'on':'no'); },
    light(k){ Object.values(rungs).forEach(d=>d.classList.remove('on')); rungs[k].classList.add('on'); this.point(k); }
  };
}
const smallLadder = () => ladder({x:64,y:156,w:316,h:92});

function tokHTML(tokens, pop=-1, letter='', ask=false){
  return tokens.map((t,i)=>`<span class="tok${OPS.has(t)?' op':''}${i===pop?' pop r-'+RUNG[letter]:''}">${t}</span>`).join('')
    + (ask ? '<span class="tok eq">=</span><span class="tok qm">?</span>' : '');
}
function Board(x=440, y=150, cls=''){
  const root = mk('board '+cls,'',`left:${x}px;top:${y}px`);
  const lines = [];
  return {
    root, lines, y,
    add(tokens, pop=-1, letter=''){
      const ln = mk('ln', `<div class="expr">${tokHTML(tokens,pop,letter,lines.length===0)}</div><div class="nt"></div>`, '', root);
      lines.push(ln); return ln;
    },
    final(tokens, letter){
      const q = lines[0] && lines[0].querySelector('.qm'); if (q){ q.textContent = tokens[0]; q.classList.add('done'); }
      const ln = mk('ln final', `<span class="anslabel">Answer</span><div class="expr">${tokHTML(tokens,0,letter)}</div>`, '', root);
      lines.push(ln); return ln;
    },
    mark(i,a,b,letter){
      const ex = lines[i].querySelector('.expr'), t = ex.querySelectorAll('.tok');
      const l = t[a].offsetLeft-4, r = t[b].offsetLeft+t[b].offsetWidth+4;
      mk('hl r-'+RUNG[letter], '', `left:${l}px;width:${r-l}px`, ex);
    },
    note(i, letter, text){
      lines[i].querySelector('.nt').innerHTML = `<div class="note"><span class="chip r-${RUNG[letter]}">${letter}</span>${text}</div>`;
    },
    bottom(){ return y + lines.length*84; },
    drop(i){ lines[i].remove(); lines.splice(i,1); },
    clear(){ root.remove(); }
  };
}

function balance(symA, symB, nameA, nameB, rung){
  const pan = (x, sym, nm) => `
    <line x1="${x}" y1="120" x2="${x-52}" y2="232" stroke="#8792AE" stroke-width="3"/>
    <line x1="${x}" y1="120" x2="${x+52}" y2="232" stroke="#8792AE" stroke-width="3"/>
    <path d="M${x-70} 232 Q${x} 292 ${x+70} 232 Z" fill="#fff" stroke="#18203B" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="${x}" cy="196" r="40" style="fill:var(--c)"/>
    <text x="${x}" y="214" text-anchor="middle" font-size="54" font-weight="700" fill="#fff" font-family="Lexend, sans-serif">${sym}</text>
    <text x="${x}" y="330" text-anchor="middle" font-size="28" font-weight="600" style="fill:var(--c)" font-family="Lexend, sans-serif">${nm}</text>`;
  return mk('bal r-'+rung, `<svg width="760" height="400" viewBox="0 0 760 400">
    <rect x="300" y="372" width="160" height="16" rx="8" fill="#18203B"/>
    <rect x="372" y="120" width="16" height="258" rx="6" fill="#18203B"/>
    <g class="beam">
      <rect x="130" y="110" width="500" height="18" rx="9" fill="#18203B"/>
      <circle cx="380" cy="119" r="14" style="fill:var(--c)"/>
      ${pan(170, symA, nameA)}${pan(590, symB, nameB)}
    </g>
  </svg>`, 'left:460px;top:150px;width:760px;height:400px');
}
function readArrow(b, w){
  return mk('readarrow', `<svg width="${w}" height="20" viewBox="0 0 ${w} 20"><path d="M4 10H${w-8}M${w-20} 2l14 8-14 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>read left to right</span>`, `left:444px;top:${b.y-26}px`);
}
function exprWidth(b, i=0){ const t=b.lines[i].querySelectorAll('.tok:not(.eq):not(.qm)'); const last=t[t.length-1]; return last.offsetLeft+last.offsetWidth; }

/* ---------- scenes ---------- */
const scenes = [
{ title:'Why a rule?', async run(c){
  head('Part 1 · The problem','One sum, two answers');
  mk('bigex', tokHTML(['3','+','4','×','2'],-1,'',true));
  await c.w(500);
  await c.say('Here is a sum. Try it in your head: 3 + 4 × 2.', 800);
  const card = (x,name,col)=>{
    const d = mk('card', `<div class="who"><span class="av" style="background:${col}">${name[0]}</span>${name}</div><div class="wk"></div><div class="ans"></div>`, `left:${x}px;top:262px;width:430px;height:360px`);
    return { line:t=>mk('', t, '', d.querySelector('.wk')), answer:t=>{ d.querySelector('.ans').innerHTML=`<span>= ${t}</span>`; } };
  };
  const sam = card(150,'Sam','#4A5A8C');
  await c.say('Sam works from left to right, like reading.');
  sam.line('3 + 4 = 7'); await c.w(900);
  sam.line('7 × 2 = 14'); await c.w(700);
  sam.answer('14');
  await c.say('Sam gets 14.');
  const priya = card(700,'Priya','#9A5B22');
  await c.say('Priya does the times first.');
  priya.line('4 × 2 = 8'); await c.w(900);
  priya.line('3 + 8 = 11'); await c.w(700);
  priya.answer('11');
  await c.say('Priya gets 11.');
  mk('qmark','?','left:600px;top:360px');
  await c.say('Same sum. Two different answers. They can\'t both be right.');
  await c.say('Maths needs one rule, so everyone gets the same answer. That rule is called {B:BIDMAS}.');
}},

{ title:'Meet BIDMAS', async run(c){
  head('Part 2 · The rule','Six letters, four steps');
  const keys=['B','I','D','M','A','S'];
  const words={B:'Brackets',I:'Indices',D:'Divide',M:'Multiply',A:'Add',S:'Subtract'};
  const syms={B:'( )',I:'3²  √9',D:'÷',M:'×',A:'+',S:'−'};
  const L=[], W={};
  keys.forEach((k,i)=>{
    const x=140+i*170;
    L.push(mk('bigL r-'+RUNG[k], k, `left:${x}px;top:175px;width:150px;height:150px;font-size:150px;`));
    W[k]=mk('wlab r-'+RUNG[k], `<div class="wd">${words[k]}</div><div class="sym">${syms[k]}</div>`, `left:${x-10}px;top:345px;width:170px;opacity:0`);
  });
  await c.w(500);
  await c.say('{B:BIDMAS} tells you what order to work out a sum in. Each letter is a job.');
  const show = ks => { keys.forEach((k,i)=>{ L[i].style.opacity = ks.includes(k)||W[k].style.opacity==='1' ? 1 : .25; }); ks.forEach(k=>W[k].style.opacity=1); };
  show(['B']); await c.say('{B:B is for Brackets.} Anything inside ( ) gets done first.');
  show(['I']); await c.say('{I:I is for Indices.} That means powers, like 3², and roots, like √9.');
  show(['D','M']); await c.say('{DM:D is for Divide, M is for Multiply.}');
  show(['A','S']); await c.say('{AS:A is for Add, S is for Subtract.}');
  L.forEach(d=>d.style.opacity=1);
  await c.say('Now here is the bit most people miss.');
  Object.values(W).forEach(d=>d.style.opacity=0);
  const lad = ladder({x:360,y:150,w:560,h:98,hideLetters:true});
  await c.w(120);
  keys.forEach((k,i)=>{
    const rk = RUNG[k], Ls = lad.rungs[rk].querySelectorAll('.L');
    const target = rk.length===2 ? Ls[k===rk[0]?0:1] : Ls[0];
    const p = pos(target), d = L[i];
    d.style.transitionDelay = (i*110)+'ms';
    d.style.left=p.x+'px'; d.style.top=p.y+'px';
    d.style.width=target.offsetWidth+'px'; d.style.height=target.offsetHeight+'px';
    d.style.fontSize=getComputedStyle(target).fontSize; d.style.color='#fff';
  });
  await c.w(1700);
  Object.values(lad.rungs).forEach(r=>r.classList.remove('hideL'));
  L.forEach(d=>d.remove());
  await c.say('{B:BIDMAS} is really a ladder with just four steps.');
  const arrow = mk('', `<svg width="60" height="470" viewBox="0 0 60 470"><path d="M30 8 V440 M12 420 L30 452 L48 420" fill="none" stroke="#18203B" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`, 'left:250px;top:130px;animation:lp-fade .5s both');
  mk('pennote','Start<br>at the<br>top','left:170px;top:140px');
  await c.say('You always start at the top step and work your way down.');
  lad.light('DM');
  await c.say('Look at step 3. {DM:D and M share the same step.} They have equal priority. Divide is not more important than multiply.', 600);
  lad.light('AS');
  await c.say('Step 4 is the same. {AS:A and S share a step.} They have equal priority too. Add is not more important than subtract.', 600);
  lad.reset();
  mk('pennote','Heard of BODMAS?<br>O = Orders = Indices.<br>Same rule!','left:960px;top:430px;width:300px');
  await c.say('You might also hear BODMAS. The O means Orders. That is just another name for Indices, so it is the same rule.');
  arrow.remove();
}},

{ title:'Equal priority', async run(c){
  head('Part 3 · Equal priority','Same step? Left to right');
  marginLine();
  const lad = smallLadder();
  await c.w(500);
  lad.light('DM');
  let bal = balance('÷','×','Divide','Multiply','DM');
  await c.say('Look at step 3. {DM:Divide and multiply} have equal priority. That means they are just as important as each other.');
  let badge = mk('equalbadge r-DM','÷ = × &nbsp;equal priority','left:660px;top:560px');
  await c.say('Put them on a balance and it stays level. Neither one is heavier, so neither one wins.');
  bal.remove(); badge.remove();
  const warn = mk('pennote','BIDMAS spells D before M.<br>That does <u>not</u> mean ÷ goes first!<br><br>They are equal, so we just<br>go left to right, like reading.','left:470px;top:200px;font-size:44px');
  await c.say('Careful! BIDMAS spells D before M, but that does NOT mean divide goes first.');
  await c.say('Because they are equal, we go left to right, just like reading a book. Whichever one you meet first, you do first.');
  warn.remove();

  let b = Board(440,190);
  b.add(['3','×','8','÷','4']);
  await c.w(300); readArrow(b, exprWidth(b));
  await c.say('Try 3 × 8 ÷ 4. Read from the left. The first job you meet is {DM:times}.');
  b.mark(0,0,2,'M'); b.note(0,'M','3 × 8 = 24');
  await c.say('So multiply goes first here. 3 × 8 = 24.');
  b.add(['24','÷','4'],0,'M'); await c.w(700);
  b.mark(1,0,2,'D'); b.note(1,'D','24 ÷ 4 = 6'); await c.w(500);
  b.final(['6'],'D');
  await c.say('Then 24 ÷ 4 = 6. Multiply went first only because it was on the left.');
  STAGE.querySelectorAll('.readarrow').forEach(e=>e.remove()); b.clear();

  b = Board(440,190);
  b.add(['20','÷','4','×','5']);
  await c.w(300); readArrow(b, exprWidth(b));
  await c.say('Now flip it: 20 ÷ 4 × 5. This time {DM:divide} is on the left, so divide goes first.');
  b.mark(0,0,2,'D'); b.note(0,'D','20 ÷ 4 = 5');
  await c.say('20 ÷ 4 = 5.');
  b.add(['5','×','5'],0,'D'); await c.w(700);
  b.mark(1,0,2,'M'); b.note(1,'M','5 × 5 = 25'); await c.w(500);
  b.final(['25'],'M');
  await c.say('Then 5 × 5 = 25.');
  let trap = mk('trap', '✗ Times first gives 20 ÷ 20 = <s>1</s>', `left:440px;top:${b.bottom()+14}px`);
  await c.say('If you did the times first, you would get 1. That is wrong! Left to right, every time.');
  STAGE.querySelectorAll('.readarrow').forEach(e=>e.remove()); b.clear(); trap.remove();

  lad.light('AS');
  bal = balance('+','−','Add','Subtract','AS');
  await c.say('Step 4 works exactly the same way. {AS:Add and subtract} have equal priority too.');
  badge = mk('equalbadge r-AS','+ = − &nbsp;equal priority','left:660px;top:560px');
  await c.say('The balance stays level. So again, we go left to right.');
  bal.remove(); badge.remove();

  b = Board(440,190);
  b.add(['10','−','3','+','2']);
  await c.w(300); readArrow(b, exprWidth(b));
  await c.say('Try 10 − 3 + 2. Read from the left. The first job you meet is {AS:minus}.');
  b.mark(0,0,2,'S'); b.note(0,'S','10 − 3 = 7');
  await c.say('So subtract goes first. 10 − 3 = 7.');
  b.add(['7','+','2'],0,'S'); await c.w(700);
  b.mark(1,0,2,'A'); b.note(1,'A','7 + 2 = 9'); await c.w(500);
  b.final(['9'],'A');
  await c.say('Then 7 + 2 = 9.');
  mk('trap', '✗ Adding first gives 10 − 5 = <s>5</s>', `left:440px;top:${b.bottom()+14}px`);
  await c.say('Adding first gives 5. Wrong! Same step means equal priority, and equal priority means left to right.');
}},

{ title:'Example 1', async run(c){
  head('Part 4 · Example 1','Sam or Priya?');
  marginLine();
  const lad = smallLadder();
  const b = Board();
  b.add(['3','+','4','×','2']);
  await c.w(500);
  await c.say('Back to Sam and Priya. Start at the top of the ladder and check each step.');
  lad.scan('B', false);
  await c.say('Step 1, {B:brackets}. Are there any? No. Move down.');
  lad.scan('I', false);
  await c.say('Step 2, {I:indices}. Any powers or roots? No. Move down.');
  lad.scan('DM', true);
  b.mark(0,2,4,'M');
  await c.say('Step 3, {DM:multiply or divide}. Yes! There is 4 × 2.');
  b.note(0,'M','4 × 2 = 8');
  b.add(['3','+','8'],2,'M');
  await c.say('4 × 2 = 8. Write a new line, and copy the rest down.');
  lad.scan('AS', true);
  b.mark(1,0,2,'A'); b.note(1,'A','3 + 8 = 11'); await c.w(500);
  b.final(['11'],'A');
  await c.say('Step 4, {AS:add}. 3 + 8 = 11.');
  lad.reset();
  mk('verdict','✓ Priya was right: 3 + 4 × 2 = 11', `left:440px;top:${b.bottom()+16}px`);
  await c.say('Priya was right. The answer is 11. Sam forgot that multiply comes before add.');
}},

{ title:'Example 2', async run(c){
  head('Part 5 · Example 2','A bigger one');
  marginLine();
  const lad = smallLadder();
  const b = Board(440,138,'tight');
  b.add(['(','5','+','3',')','×','3<sup>2</sup>','−','6','÷','3']);
  await c.w(500);
  await c.say('This looks scary. Don\'t panic. Just go down the ladder, one step at a time.');
  lad.scan('B', true);
  b.mark(0,0,4,'B');
  await c.say('Step 1: {B:brackets}. Work out the inside first.');
  b.note(0,'B','5 + 3 = 8');
  b.add(['8','×','3<sup>2</sup>','−','6','÷','3'],0,'B');
  await c.say('5 + 3 = 8. Copy everything else down exactly as it was.');
  lad.scan('I', true);
  b.mark(1,2,2,'I');
  await c.say('Step 2: {I:indices}. 3² means 3 × 3, which is 9. Not 3 × 2!');
  b.note(1,'I','3² = 3 × 3 = 9');
  b.add(['8','×','9','−','6','÷','3'],2,'I');
  await c.w(600);
  lad.scan('DM', true);
  b.mark(2,0,2,'M');
  await c.say('Step 3: {DM:multiply and divide}. There are two jobs here with equal priority, so go left to right. 8 × 9 comes first.');
  b.note(2,'M','8 × 9 = 72');
  b.add(['72','−','6','÷','3'],0,'M');
  await c.w(600);
  b.mark(3,2,4,'D');
  b.note(3,'D','6 ÷ 3 = 2');
  await c.say('Then 6 ÷ 3 = 2. The minus has to wait. It lives on step 4.');
  b.add(['72','−','2'],2,'D');
  await c.w(600);
  lad.scan('AS', true);
  b.mark(4,0,2,'S'); b.note(4,'S','72 − 2 = 70'); await c.w(500);
  b.final(['70'],'S');
  await c.say('Step 4: {AS:subtract}. 72 − 2 = 70.');
  lad.reset();
  await c.say('The answer is 70. Every line did one job, in ladder order. That is all BIDMAS is.');
}},

{ title:'Your turn', async run(c){
  head('Part 6 · Your turn','Use the ladder');
  marginLine();
  const lad = smallLadder();
  const Q = [
    { ex:['6','+','12','÷','3'], opts:['6','10','4'], ans:'10',
      steps:[['D','12 ÷ 3 = 4'],['A','6 + 4 = 10']],
      good:'{DM:Divide} is on step 3 and {AS:add} is on step 4, so 12 ÷ 3 goes first. Then 6 + 4 = 10.',
      why:{'6':'You added first. {DM:Divide} is higher up the ladder than {AS:add}, so 12 ÷ 3 goes first.','4':'You did 12 ÷ 3 = 4, then forgot to add the 6.'} },
    { ex:['18','÷','3','×','2'], opts:['3','12','6'], ans:'12',
      steps:[['D','18 ÷ 3 = 6'],['M','6 × 2 = 12']],
      good:'{DM:Divide and multiply} have equal priority, so go left to right. 18 ÷ 3 = 6, then 6 × 2 = 12.',
      why:{'3':'You multiplied first. {DM:× and ÷} have equal priority, so go left to right. 18 ÷ 3 comes first.','6':'You did 18 ÷ 3 = 6, then forgot to times by 2.'} },
    { ex:['2','×','3<sup>2</sup>'], opts:['36','18','12'], ans:'18',
      steps:[['I','3² = 3 × 3 = 9'],['M','2 × 9 = 18']],
      good:'{I:Indices} come before {DM:multiply}. 3² = 9, then 2 × 9 = 18.',
      why:{'36':'You multiplied first. {I:Indices} are step 2, so square the 3 before you multiply.','12':'3² means 3 × 3, which is 9. It does not mean 3 × 2.'} },
    { ex:['15','−','5','+','2'], opts:['8','12','22'], ans:'12',
      steps:[['S','15 − 5 = 10'],['A','10 + 2 = 12']],
      good:'{AS:Minus and plus} have equal priority, so go left to right. 15 − 5 = 10, then 10 + 2 = 12.',
      why:{'8':'You added first. {AS:Add and subtract} have equal priority, so go left to right.','22':'Check the sign. It is minus 5, not plus 5.'} }
  ];
  let score = 0;
  for (let n=0; n<Q.length; n++){
    const q = Q[n];
    lad.reset();
    const ws = mk('', '', 'left:440px;top:140px;width:800px;height:560px');
    mk('qlabel', `Question ${n+1} of ${Q.length}`, 'position:absolute;left:0;top:10px', ws);
    const qex = mk('qex', tokHTML(q.ex,-1,'',true), 'position:absolute;left:0;top:46px', ws);
    const opts = mk('opts','', 'position:absolute;left:0;top:160px', ws);
    const btns = q.opts.map((o,i)=>{ const b = mk('opt', o, `animation-delay:${i*90}ms`, opts, 'button'); b.type='button'; b.dataset.v=o; b.setAttribute('aria-label','Answer '+o); return b; });
    await c.say(n===0 ? 'Your turn. Work it out using the ladder, then tap your answer.' : 'Next one. Work it out, then tap your answer.');
    c.hint('Tap an answer on the screen to carry on.');
    const pick = await c.ask(btns, 'q'+n, q.ans);
    btns.forEach(b=>{ b.disabled=true; if(b.dataset.v===q.ans) b.classList.add('right'); else if(b.dataset.v===pick) b.classList.add('wrong'); else b.classList.add('fade'); });
    const qm = qex.querySelector('.qm'); qm.textContent = q.ans; qm.classList.add('done');
    const right = pick===q.ans; if (right) score++;
    const fb = mk('fb','', 'position:absolute;left:0;top:310px', ws);
    mk('fbmsg '+(right?'good':'bad'), right ? '✓ Correct!' : `✗ Not quite. The answer is ${q.ans}.`, '', fb);
    for (const [L,t] of q.steps){
      lad.light(RUNG[L]);
      fb.insertAdjacentHTML('beforeend', `<div class="note"><span class="chip r-${RUNG[L]}">${L}</span>${t}</div>`);
      await c.w(900);
    }
    await c.say(right ? 'Correct! ' + q.good : 'Not quite. ' + q.why[pick] + ' The answer is ' + q.ans + '.', 500);
    ws.remove();
  }
  lad.reset();
  const msg = score===Q.length ? 'Brilliant. You have got it.' : score>=Q.length-1 ? 'Nearly there. Check which step each job lives on.' : 'Watch parts 3 to 5 again, then have another go.';
  mk('', `<div class="qlabel">Your score</div><div style="font-family:var(--display);font-weight:800;font-size:150px;line-height:1.05">${score}<span style="color:var(--muted);font-size:80px"> / ${Q.length}</span></div><div class="pennote">${msg}</div>`, 'left:440px;top:170px;animation:lp-rise .5s both');
  await c.say(`You got ${score} out of ${Q.length}. ${msg}`);
}},

{ title:'Recap', async run(c){
  head('Part 7 · Recap','Climb down the ladder');
  ladder({x:96,y:150,w:470,h:100});
  await c.w(600);
  const rules = [
    'Start at the <em>top</em> of the ladder and work down.',
    'Do <em>one job</em> per line. Copy the rest down.',
    'Same step means <em>equal priority</em>. Go <em>left to right</em>.'
  ];
  const lines = [
    'Rule 1. Start at the top of the ladder and work down.',
    'Rule 2. Do one job per line, and copy the rest of the sum down.',
    'Rule 3. Jobs on the same step have equal priority, so go left to right.'
  ];
  for (let i=0;i<3;i++){
    mk('rule', `<div class="n">${i+1}</div><p>${rules[i]}</p>`, `left:640px;top:${170+i*150}px`);
    await c.say(lines[i]);
  }
  await c.say('That is {B:BIDMAS}: {B:Brackets}, {I:Indices}, {DM:Divide and Multiply}, {AS:Add and Subtract}. Four steps, every time.');
}}
];

/* ---------- poster ---------- */
function poster(){
  STAGE.innerHTML='';
  const letters=[['B','B'],['I','I'],['D','DM'],['M','DM'],['A','AS'],['S','AS']];
  letters.forEach(([l,k],i)=>mk('poster-L r-'+k, l, `left:${170+i*160}px;top:140px;width:140px;text-align:center;animation-delay:${i*70}ms`));
  mk('', '<div style="font-size:34px;font-weight:600;text-align:center">The order you work out a sum in</div>', 'left:0;width:1280px;top:370px');
  mk('', ['4 steps','6 letters','1 rule'].map(t=>`<span class="tag">${t}</span>`).join(''), 'left:0;width:1280px;top:440px;display:flex;justify-content:center;gap:14px');
}

/* ---------- timeline ---------- */
const MEAS = document.createElement('div');
MEAS.className = 'stage'; MEAS.setAttribute('aria-hidden','true');
MEAS.style.cssText = 'left:-99999px;top:0;visibility:hidden;pointer-events:none';
root.appendChild(MEAS);
const DUR = scenes.map(()=>0); let OFF = [], TOTAL = 1;
const QUIZ = scenes.findIndex(s=>s.title==='Your turn');

// Replays a scene off screen with every wait skipped, to learn how long it runs.
async function measure(i){
  const R = {measure:true, fast:true, t:0, target:Infinity};
  STAGE = MEAS; MEAS.innerHTML = '';
  try{ await scenes[i].run(ctx(R)); }catch(e){ console.error(e); }
  STAGE = REAL; MEAS.innerHTML = '';
  DUR[i] = R.t + 700;
}
function layoutTimeline(){
  OFF = []; let acc = 0;
  DUR.forEach((d,i)=>{ OFF[i]=acc; acc+=d; });
  TOTAL = acc;
  seekEl.max = Math.round(TOTAL);
  tTot.textContent = clock(TOTAL);
  ticks.innerHTML = OFF.slice(1).map(o=>`<i style="left:${(o/TOTAL*100).toFixed(3)}%"></i>`).join('');
  if (active) tick(active);
}
async function remeasureQuiz(){ await measure(QUIZ); layoutTimeline(); }

const seekEl = $('seek');
const tNow = $('tNow'), tTot = $('tTot');
const ticks = $('ticks');
function clock(ms){ const s = Math.max(0, Math.round(ms/1000)); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
function setSlider(g){
  seekEl.value = Math.round(g);
  seekEl.style.setProperty('--p', (g/TOTAL*100).toFixed(2)+'%');
  tNow.textContent = clock(g);
}
function tick(R){ if (R!==active || R.measure || dragging) return; setSlider(OFF[cur] + Math.min(R.t, DUR[cur])); }

function seek(g){
  g = Math.max(0, Math.min(TOTAL-50, g));
  let i = 0; while (i < scenes.length-1 && g >= OFF[i+1]) i++;
  runScene(i, g - OFF[i]);
}

/* ---------- UI ---------- */
const btnPlay = $('btnPlay');
const btnSpeed = $('btnSpeed');
const chips = $('chips');
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

function buildChips(){
  chips.innerHTML = '';
  scenes.forEach((s,i)=>{
    const b=document.createElement('button'); b.type='button'; b.className='chip-btn'; b.innerHTML=`<b>${i+1}</b>${s.title}`;
    b.addEventListener('click',()=>{ playing=true; runScene(i); });
    chips.appendChild(b);
  });
}
buildChips();
function ui(){
  btnPlay.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
  btnPlay.setAttribute('aria-label', playing?'Pause':'Play');
  REAL.classList.toggle('paused', !playing && started);
  [...chips.children].forEach((b,i)=>b.classList.toggle('cur', started && i===cur));
}
function overlay(kind){
  OV.innerHTML='';
  if (kind==='start'){
    OV.innerHTML = `<button class="bigbtn" type="button" id="ovPlay">${PLAY_ICON}Play the lesson</button>`;
    OV.querySelector('#ovPlay').onclick = ()=>{ playing=true; runScene(0); };
  } else if (kind==='end'){
    OV.innerHTML = `<button class="bigbtn" type="button" id="ovAgain">${PLAY_ICON}Watch again</button><button class="bigbtn alt" type="button" id="ovQuiz">Try the questions again</button>`;
    OV.querySelector('#ovAgain').onclick = ()=>{ playing=true; runScene(0); };
    OV.querySelector('#ovQuiz').onclick = async ()=>{ Object.keys(answers).forEach(k=>delete answers[k]); await remeasureQuiz(); playing=true; runScene(QUIZ); };
  }
}

async function runScene(i, target=0){
  const R = {id:++runId, fast:target>0, t:0, target, measure:false};
  active = R; cur = i; started = true;
  REAL.innerHTML = ''; REAL.classList.toggle('instant', R.fast);
  overlay(); ui(); tick(R);
  try{
    await scenes[i].run(ctx(R));
    await wait(700, R);
    if (i < scenes.length-1) runScene(i+1);
    else {
      endFast(R); playing=false; ui(); overlay('end'); setSlider(TOTAL);
      setCaption('That is the whole lesson. Drag the slider or pick a part to watch any bit again.');
    }
  }catch(e){ if (e!==CANCEL) console.error(e); }
}

btnPlay.addEventListener('click', ()=>{
  if (!started || OV.querySelector('#ovAgain')){ playing=true; runScene(0); return; }
  playing = !playing; ui();
});
$('btnPrev').onclick = ()=>{ playing=true; runScene(Math.max(0, started?cur-1:0)); };
$('btnNext').onclick = ()=>{ playing=true; runScene(Math.min(scenes.length-1, started?cur+1:0)); };
$('btnReplay').onclick = ()=>{ playing=true; runScene(started?cur:0); };
const btnCC = $('btnCC');
function setCC(on){
  CAP.classList.toggle('off', !on);
  btnCC.setAttribute('aria-pressed', on);
  $('ccLbl').textContent = on ? 'Captions on' : 'Captions off';
  try{ localStorage.setItem('bidmas-cc', on ? '1' : '0'); }catch(e){}
}
btnCC.onclick = ()=> setCC(btnCC.getAttribute('aria-pressed')!=='true');
let ccStart = true; try{ ccStart = localStorage.getItem('bidmas-cc')!=='0'; }catch(e){}
setCC(ccStart);
const speeds=[0.75,1,1.25];
btnSpeed.onclick = ()=>{ speed = speeds[(speeds.indexOf(speed)+1)%speeds.length]; btnSpeed.innerHTML = `<span class="lbl">Speed </span>${speed}×`; };

let seekQueued = null;
seekEl.addEventListener('input', ()=>{
  dragging = true;
  const g = +seekEl.value;
  seekEl.style.setProperty('--p', (g/TOTAL*100).toFixed(2)+'%');
  tNow.textContent = clock(g);
  if (seekQueued===null) requestAnimationFrame(()=>{ const v=seekQueued; seekQueued=null; seek(v); });
  seekQueued = g;
});
const endDrag = ()=>{ if (!dragging) return; dragging=false; if (active) tick(active); };
seekEl.addEventListener('change', endDrag);
seekEl.addEventListener('pointerup', endDrag);
seekEl.addEventListener('pointercancel', endDrag);

const onKey = e=>{
  if (/BUTTON|INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.code==='Space'){ e.preventDefault(); btnPlay.click(); }
  else if (e.code==='KeyC'){ btnCC.click(); }
  else if (e.code==='ArrowRight' || e.code==='ArrowLeft'){
    e.preventDefault();
    const now = started && active ? OFF[cur]+active.t : 0;
    seek(now + (e.code==='ArrowRight' ? 5000 : -5000));
  }
};
document.addEventListener('keydown', onKey);

/* The stepper lives in ./bidmasStepper (tested by scripts/verify-bidmas-stepper.cjs). */


function customScene(sol){
  return { title:'Try your own', async run(c){
    head('Part 8 · Your question','Try your own');
    marginLine();
    const lad = smallLadder();
    const b = Board(440,138,'tight');
    b.add(sol.question);
    b.root.style.setProperty('--ew', Math.min(580, exprWidth(b)+150)+'px');
    await c.w(500);
    await c.say(`Here is your sum: ${sol.text}. Start at the top of the ladder and work down.`);
    const skip = {
      B:'Step 1, {B:brackets}. Are there any? No. Move down.',
      I:'Step 2, {I:indices}. Any powers or roots? No. Move down.',
      DM:'Step 3, {DM:multiply or divide}. None here. Move down.'
    };
    const first = ORDER.indexOf(sol.steps[0].rung);
    for (let r=0; r<first; r++){ lad.scan(ORDER[r], false); await c.say(skip[ORDER[r]]); }
    let prev = null;
    for (const st of sol.steps){
      if (st.rung!==prev){ lad.scan(st.rung, true); prev = st.rung; }
      const li = b.lines.length-1;
      b.mark(li, st.hl[0], st.hl[1], st.letter);
      await c.w(400);
      b.note(li, st.letter, st.noteH);
      const n = b.lines[li].querySelector('.note');
      if (n && st.noteT.length > 18) n.style.fontSize = st.noteT.length > 24 ? '24px' : '28px';
      await c.say(st.caption);
      if (st.final) b.final(st.next, st.letter); else b.add(st.next, st.pop, st.letter);
      if (b.lines.length > 6) b.drop(1);
      await c.w(600);
    }
    lad.reset();
    await c.say(`So ${sol.text} = ${sol.answer}. Every line did one job, in ladder order.`);
  }};
}

/* ---------- try your own: UI ---------- */
const tryForm = $('tryForm');
const tryInput = $('tryInput');
const tryMsg = $('tryMsg');
let customIdx = -1;
function setMsg(t, kind=''){ tryMsg.textContent = t; tryMsg.className = 'try-msg ' + kind; }

async function playCustom(src){
  let sol;
  try { sol = solve(src); }
  catch(e){ if (e instanceof SumError){ setMsg(e.message, 'bad'); return; } throw e; }
  setMsg(`Playing your sum: ${sol.text} = ?`, 'good');
  const sc = customScene(sol);
  if (customIdx < 0){ customIdx = scenes.length; scenes.push(sc); DUR.push(0); }
  else scenes[customIdx] = sc;
  await measure(customIdx);
  buildChips(); layoutTimeline();
  playing = true; runScene(customIdx);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  WRAP.scrollIntoView({behavior: still ? 'auto' : 'smooth', block:'start'});
}
tryForm.addEventListener('submit', e=>{ e.preventDefault(); playCustom(tryInput.value); });
root.querySelectorAll('.key').forEach(k=>k.addEventListener('click', ()=>{
  const a = tryInput.selectionStart ?? tryInput.value.length, z = tryInput.selectionEnd ?? a;
  tryInput.setRangeText(k.dataset.k, a, z, 'end'); tryInput.focus();
}));
root.querySelectorAll('.ex-btn').forEach(x=>x.addEventListener('click', ()=>{ tryInput.value = x.textContent; playCustom(x.textContent); }));

poster(); overlay('start'); ui();
(async()=>{
  for (let i=0;i<scenes.length;i++) await measure(i);
  layoutTimeline(); setSlider(0);
})();

return () => {
  runId++;
  playing = false;
  ro.disconnect();
  document.removeEventListener('keydown', onKey);
  MEAS.remove();
  root.innerHTML = '';
};
}
