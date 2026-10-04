// The building blocks a lesson pack writes its slides and worksheet with. Each returns HTML; maths goes through KaTeX
// here, in Node, and a typo in the maths stops the build with the pack's own words, not a broken frame.
const katex = require('katex')

const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Inline maths in blue: m('x^2 + x = 20'). `cls` adds a class (big, grey, p for purple, good for green). */
function m(tex, cls = '') {
  try {
    return `<span class="m ${cls}">${katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })}</span>`
  } catch (error) {
    throw new Error(`Maths that KaTeX can't read: ${tex}\n${error.message}`)
  }
}
/**
 * Words with maths inside $…$, the way the slides and worksheet are usually written: t('take $20$ from both sides').
 * **bold** is bold, and ✓ and ✗ are coloured. Everything else is plain text, escaped.
 */
function t(text) {
  return String(text).split(/(\$[^$]+\$)/).map(part => part.startsWith('$') && part.endsWith('$') && part.length > 1
    ? m(part.slice(1, -1))
    : esc(part).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/✓/g, '<span class="yes">✓</span>').replace(/✗/g, '<span class="no">✗</span>')).join('')
}

/* ---------- Slides (video) ---------- */

/** A line of words under the heading. */
const line = (text, cls = '') => `<p class="line ${cls}">${t(text)}</p>`
/** Big maths on its own line. */
const big = tex => `<div class="bigline">${m(tex, 'big')}</div>`
/** A halfway result: blue pill (never green, which is only for the answer). */
const result = tex => `<div class="result">${m(tex)}</div>`
/** The answer: the green pill. Words with $maths$ allowed. */
const answer = text => `<div class="answer">${t(text)}</div>`
/** The move being done, in a pale-yellow box: the A5 board with the move written under each side. */
function board(left, sign, right, moveLeft, moveRight) {
  return `<div class="board move"><span class="l">${m(left)}</span><span>${m(sign)}</span><span class="r">${m(right)}</span>`
    + `<span class="l u p">${m(moveLeft)}</span><span></span><span class="r u p">${m(moveRight)}</span></div>`
}
/** Things side by side ("x − 4 = 0   or   x + 5 = 0"); each is HTML from these helpers or words with $maths$. */
const row = (...parts) => `<div class="row">${parts.map(part => part.startsWith('<') ? part : `<span>${t(part)}</span>`).join('')}</div>`
/** Things stacked, each with an optional note beside it: stack([['$-1 \\times 20$', 'adds to 19 ✗'], …], pick). */
function stack(rows, pick) {
  return `<div class="stack">${rows.map(([what, note = ''], i) => `<span class="${i === pick ? 'pick' : ''}">${t(what)}</span><span class="note">${t(note)}</span>`).join('')}</div>`
}
/** A column: maths with a purple note under it ("add 4 to both sides"). */
const column = (tex, note) => `<div class="col">${m(tex)}<span class="p small">${t(note)}</span></div>`
/** The "Well done!" checklist pills. */
const pill = text => `<span class="pill">${t(text)}</span>`
/** Any picture: raw SVG or HTML, passed straight through. */
const picture = html => `<div class="picture">${html}</div>`
const tick = '<span class="yes">✓</span>', cross = '<span class="no">✗</span>'

module.exports = { m, t, esc, line, big, result, answer, board, row, stack, column, pill, picture, tick, cross }
