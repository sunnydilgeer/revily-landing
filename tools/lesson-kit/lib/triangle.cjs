// A formula triangle for the lesson kit's packs (R9–R11): the top letter over the two bottom letters, × between them,
// with the letter being found covered by an amber circle.
const INK = '#17213a', BIRO = '#2443b5', AMBER = '#f5a524'
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** triangle(['d', 's', 't'], 's'): d on top, s × t below; `cover` (optional) is the letter to find. */
function triangle([top, left, right], cover) {
  const spot = { [top]: [150, 105], [left]: [105, 178], [right]: [195, 178] }
  const ring = cover ? `<circle cx="${spot[cover][0]}" cy="${spot[cover][1] - 9}" r="27" fill="${AMBER}" fill-opacity=".55"/>` : ''
  const letter = (text, [x, y]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="34" font-style="italic" font-weight="700" fill="${INK}">${esc(text)}</text>`
  return `<svg width="300" height="230" viewBox="0 0 300 230" font-family="Georgia, serif"><path d="M150 18 L282 214 L18 214 Z" fill="#eef3ff" stroke="${BIRO}" stroke-width="4" stroke-linejoin="round"/><line x1="70" y1="136" x2="230" y2="136" stroke="${BIRO}" stroke-width="3"/><line x1="150" y1="136" x2="150" y2="214" stroke="${BIRO}" stroke-width="3"/>${ring}${letter(top, spot[top])}${letter(left, spot[left])}${letter(right, spot[right])}</svg>`
}

module.exports = { triangle }
