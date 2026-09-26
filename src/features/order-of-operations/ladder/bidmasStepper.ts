// @ts-nocheck
/*
 * BIDMAS stepper: fixed rules, no AI.
 * Reads a typed sum, checks it (with plain-English errors), then works down the ladder one job at
 * a time: innermost brackets (which follow the ladder inside too), then indices and roots, then
 * the leftmost × or ÷, then the leftmost + or −. Exact results only (up to 3 decimal places),
 * no dividing by zero, no square roots of negatives, at most 12 numbers.
 * Ported unchanged from the Revily lesson prototype; tested by scripts/verify-bidmas-stepper.cjs.
 */
export const RUNG = {B:'B',I:'I',D:'DM',M:'DM',A:'AS',S:'AS'};

/* ---------- your own sum: reader + BIDMAS stepper (plain rules, no AI) ---------- */
const SUPIN = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
const toSup = d => String(d).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
export class SumError extends Error {}
function fail(m){ throw new SumError(m); }

export function tokenize(src){
  let s = String(src || '').trim();
  s = s.replace(/=\s*\??\s*$/,'').replace(/\?\s*$/,'');
  if (!s.trim()) fail('Type a sum first.');
  s = s.replace(/\*\*/g,'^').replace(/[xX*✕✖·]/g,'×').replace(/\//g,'÷').replace(/[-–—‐]/g,'−')
       .replace(/sqrt|root/gi,'√').replace(/[\[{]/g,'(').replace(/[\]}]/g,')').replace(/,/g,'')
       .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, m => '^' + m.split('').map(c=>SUPIN[c]).join(''))
       .replace(/\s+/g,'');
  const items = [];
  const last = () => items[items.length-1];
  const atomEnd = () => { const p = last(); return p && (p.t==='n' || p.t===')' || p.t==='p'); };
  const wantAtom = () => { const p = last(); return !p || p.t==='o' || p.t==='(' || p.t==='r'; };
  const NUM = /^(\d+(\.\d+)?|\.\d+)/;
  let i = 0;
  while (i < s.length){
    const ch = s[i], rest = s.slice(i);
    let m = NUM.exec(rest);
    if (m){ if (atomEnd()) items.push({t:'o',v:'×'}); items.push({t:'n',v:parseFloat(m[0])}); i += m[0].length; continue; }
    if (ch==='−' && wantAtom()){
      const m2 = NUM.exec(s.slice(i+1));
      if (!m2) fail('A minus sign at the start needs a number straight after it, like −3.');
      items.push({t:'n',v:-parseFloat(m2[0])}); i += 1 + m2[0].length; continue;
    }
    if ('+−×÷'.includes(ch)){ items.push({t:'o',v:ch}); i++; continue; }
    if (ch==='('){ if (atomEnd()) items.push({t:'o',v:'×'}); items.push({t:'('}); i++; continue; }
    if (ch===')'){ items.push({t:')'}); i++; continue; }
    if (ch==='√'){ if (atomEnd()) items.push({t:'o',v:'×'}); items.push({t:'r'}); i++; continue; }
    if (ch==='^'){
      const m3 = /^\^\(?(\d{1,2})\)?/.exec(rest);
      if (!m3) fail('After a power sign, put a whole number, like 3^2.');
      items.push({t:'p',e:+m3[1]}); i += m3[0].length; continue;
    }
    fail(`I don't understand "${ch}". Use numbers, + − × ÷, brackets, powers and √.`);
  }
  return items;
}

function validate(items){
  let want = 'atom', opens = 0, closes = 0, nums = 0;
  items.forEach((it,k)=>{
    const nx = items[k+1];
    if (want==='atom'){
      if (it.t==='n'){ nums++; want='op'; if (it.v<0 && nx && nx.t==='p') fail('Put brackets round a negative number before a power, like (−3)².'); }
      else if (it.t==='('){ opens++; if (nx && nx.t===')') fail('You have empty brackets ( ). Put something inside them.'); }
      else if (it.t==='r'){ /* root waits for its number */ }
      else if (it.t==='o') fail(k===0 ? `A sum can't start with ${it.v}.` : `There are two signs in a row near "${it.v}". Check that part.`);
      else if (it.t===')') fail('Something is missing just before a closing bracket.');
      else fail('A power needs a number before it, like 3².');
    } else {
      if (it.t==='o') want = 'atom';
      else if (it.t===')'){ closes++; if (closes>opens) fail('You have closed a bracket that was never opened.'); }
      else if (it.t==='p'){ if (items[k-1].t==='p') fail('Two powers in a row are too tricky here. Use brackets.'); }
      else fail('Something is missing between two parts of the sum.');
    }
  });
  if (want==='atom') fail('Your sum ends with a sign. Finish it with a number.');
  if (opens!==closes) fail(`Check your brackets: you opened ${opens} but closed ${closes}.`);
  if (nums>12) fail('That sum is a bit long for the board. Try one with 12 numbers or fewer.');
  if (!items.some(it=>it.t==='o' || it.t==='p' || it.t==='r')) fail('Add at least one + − × ÷, power or √ so there is something to work out.');
}

function collapse(items){
  for (let k=0; k<items.length-2; k++){
    if (items[k].t==='(' && items[k+1].t==='n' && items[k+2].t===')'){
      items.splice(k, 3, {...items[k+1], br: items[k+1].v<0});
      k = -1;
    }
  }
  return items;
}

function numStr(v){ const r = Math.round(v*1000)/1000; return (r<0?'−':'') + String(Math.abs(r)); }
function operand(v){ return v<0 ? `(${numStr(v)})` : numStr(v); }
function exact(r){
  if (!isFinite(r)) fail('That sum does not give a number I can show.');
  if (Math.abs(r) > 1e7) fail('The numbers get too big for the board. Try smaller numbers.');
  if (Math.abs(r*1000 - Math.round(r*1000)) > 1e-6) fail('This sum gives a long decimal. Try numbers that divide exactly.');
  return Math.round(r*1e6)/1e6;
}

function show(items){
  const toks = [], map = [];
  for (let k=0; k<items.length; k++){
    const it = items[k], nx = items[k+1];
    if (it.t==='p'){ map[k] = toks.length-1; toks[toks.length-1] += `<sup>${it.e}</sup>`; continue; }
    if (it.t==='r' && nx && nx.t==='n' && !nx.br){ map[k] = map[k+1] = toks.length; toks.push('√' + numStr(nx.v)); k++; continue; }
    map[k] = toks.length;
    toks.push(it.t==='n' ? (it.br ? `(${numStr(it.v)})` : numStr(it.v)) : it.t==='o' ? it.v : it.t==='r' ? '√' : it.t);
  }
  return {toks, map};
}
const plain = toks => toks.map(t=>t.replace(/<sup>(\d+)<\/sup>/g,(m,d)=>toSup(d))).join(' ').replace(/\( /g,'(').replace(/ \)/g,')');
const OPWORD = {'×':'Multiply','÷':'Divide','+':'Add','−':'Subtract'};
const OPLETTER = {'×':'M','÷':'D','+':'A','−':'S'};

export function solve(src){
  const raw = tokenize(src);
  validate(raw);
  let items = collapse(raw);
  const q = show(items);
  const width = q.toks.reduce((s,t)=>s + t.replace(/<[^>]+>/g,'').length*21 + 8, 0);
  if (width > 520) fail('That sum is a bit long for the board. Try a shorter one.');
  const steps = [];
  let guard = 0;
  while (!(items.length===1 && items[0].t==='n')){
    if (++guard > 40) fail('That sum is too tricky for me. Try a shorter one.');
    let lo = 0, hi = items.length-1, inB = false, open = -1;
    for (let k=0; k<items.length; k++){
      if (items[k].t==='(') open = k;
      else if (items[k].t===')'){ lo = open+1; hi = k-1; inB = true; break; }
    }
    const jobs = items.slice(lo, hi+1).filter(x=>x.t==='o' || x.t==='p' || x.t==='r').length;
    let st = null;
    for (let k=lo; k<=hi && !st; k++){
      const it = items[k], nx = items[k+1];
      if (it.t==='n' && nx && nx.t==='p' && k+1<=hi){
        st = {kind:'pow', from:k, to:k+1, a:it.v, e:nx.e, r:exact(Math.pow(it.v, nx.e))};
      } else if (it.t==='r' && nx && nx.t==='n' && k+1<=hi && !(items[k+2] && items[k+2].t==='p')){
        if (nx.v < 0) fail("You can't square root a negative number at GCSE. Check that part.");
        st = {kind:'root', from:k, to:k+1, a:nx.v, r:exact(Math.sqrt(nx.v))};
        if (Math.abs(st.r*st.r - nx.v) > 1e-9) fail(`√${numStr(nx.v)} is not a whole or simple number. Try a square number like √16.`);
      }
    }
    for (const set of ['×÷','+−']){
      if (st) break;
      const count = items.slice(lo, hi+1).filter(x=>x.t==='o' && set.includes(x.v)).length;
      for (let k=lo; k<=hi; k++){
        const it = items[k];
        if (it.t==='o' && set.includes(it.v)){
          const a = items[k-1], b = items[k+1];
          if (!a || !b || a.t!=='n' || b.t!=='n') fail('I got stuck on that sum. Check it is written correctly.');
          if (it.v==='÷' && b.v===0) fail("Your sum divides by zero, which can't be done. Change that part.");
          const r = exact(it.v==='×' ? a.v*b.v : it.v==='÷' ? a.v/b.v : it.v==='+' ? a.v+b.v : a.v-b.v);
          st = {kind:'bin', from:k-1, to:k+1, a:a.v, b:b.v, op:it.v, r, count, set};
          break;
        }
      }
    }
    if (!st) fail('I got stuck on that sum. Check it is written correctly.');

    const before = show(items);
    let ha = before.map[st.from], hb = before.map[st.to];
    if (inB && st.from===lo && st.to===hi){ ha = before.map[lo-1]; hb = before.map[hi+1]; }
    const letter = inB ? 'B' : st.kind==='bin' ? OPLETTER[st.op] : 'I';
    const R = numStr(st.r);
    let noteH, noteT, how;
    if (st.kind==='bin'){
      noteH = noteT = `${numStr(st.a)} ${st.op} ${operand(st.b)} = ${R}`;
    } else if (st.kind==='pow'){
      const A = operand(st.a), rep = st.e>=2 && st.e<=4 ? Array(st.e).fill(A).join(' × ') : '';
      noteH = `${A}<sup>${st.e}</sup> = ${rep ? rep + ' = ' : ''}${R}`;
      noteT = `${A}${toSup(st.e)} = ${rep ? rep + ' = ' : ''}${R}`;
      how = rep ? `${A}${toSup(st.e)} means ${rep}, which is ${R}.` : `${A}${toSup(st.e)} = ${R}.`;
    } else {
      noteH = noteT = `√${numStr(st.a)} = ${R}`;
      how = `√${numStr(st.a)} means: what number times itself makes ${numStr(st.a)}? That is ${R}.`;
    }
    let caption;
    if (inB) caption = `{B:Brackets} first. ${jobs>1 ? 'Inside the brackets, use the ladder too. ' : ''}${noteT}.`;
    else if (st.kind!=='bin') caption = `{I:Indices} next. ${how}`;
    else {
      const rk = RUNG[OPLETTER[st.op]];
      caption = st.count>1
        ? `{${rk}:${st.set==='×÷' ? 'Multiply and divide' : 'Add and subtract'}} have equal priority, so go left to right. First: ${noteT}.`
        : `{${rk}:${OPWORD[st.op]}} next: ${noteT}.`;
    }

    const fresh = {t:'n', v:st.r, fresh:true};
    items.splice(st.from, st.to-st.from+1, fresh);
    collapse(items);
    const idx = items.findIndex(x=>x.fresh);
    delete items[idx].fresh;
    const after = show(items);
    steps.push({letter, rung:RUNG[letter], hl:[ha,hb], noteH, noteT, caption, next:after.toks, pop:after.map[idx],
      final: items.length===1 && items[0].t==='n'});
  }
  return {steps, question:q.toks, text:plain(q.toks), answer:numStr(items[0].v)};
}
/* ---------- end of stepper ---------- */