// Ratio bars for the lesson kit's packs, drawn like the app's (src/features/written-methods/tutor/RatioPictures.tsx):
// one block per part, each person's bar in its own colour, a name on the left, and a pill at the end for a share.
const INK = '#17213a', PURPLE = '#7c3aed', MUTED = '#5e6886'
const COLOURS = [['#fde7c2', '#b45309'], ['#dbe5ff', '#2443b5'], ['#d5f2ea', '#0f766e'], ['#f3e1fb', '#8b3fb0']]
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * bars([['Ana', 2], ['Ben', 3]], options): each bar is [name, parts]. Options: `each` writes a value in every block;
 * `rings` rings parts of a bar, [{ bar, from, to }], in purple; `tags` puts a pill after a bar, by index; `fade` greys
 * bars by index; `brace` writes words under the bars (the total).
 */
function bars(list, { each, rings = [], tags = [], fade = [], brace } = {}) {
  const block = 46, gap = 4, left = 104, top = 14, rowH = 58
  const most = Math.max(...list.map(([, parts]) => parts))
  const width = left + most * (block + gap) + 150
  const height = top + list.length * rowH + (brace ? 56 : 6)
  const parts = list.map(([name, count], i) => {
    const y = top + i * rowH, [fill, edge] = COLOURS[i % COLOURS.length], faded = fade.includes(i)
    const blocks = Array.from({ length: count }, (_, k) => {
      const x = left + k * (block + gap)
      return `<rect x="${x}" y="${y}" width="${block}" height="${block}" rx="6" fill="${faded ? '#eef0f4' : fill}" stroke="${faded ? '#c9ced8' : edge}" stroke-width="2.5"/>`
        + (each ? `<text x="${x + block / 2}" y="${y + block / 2 + 7}" text-anchor="middle" font-size="19" font-weight="700" fill="${faded ? MUTED : edge}">${esc(each)}</text>` : '')
    }).join('')
    const ring = rings.filter(r => r.bar === i).map(r => `<rect x="${left + r.from * (block + gap) - 5}" y="${y - 5}" width="${(r.to - r.from) * (block + gap) - gap + 10}" height="${block + 10}" rx="9" fill="none" stroke="${PURPLE}" stroke-width="3.5"/>`).join('')
    const tag = tags[i] === undefined ? '' : (() => {
      const x = left + count * (block + gap) + 12, w = 16 + String(tags[i]).length * 13
      return `<rect x="${x}" y="${y + 7}" width="${w}" height="32" rx="16" fill="${edge}"/><text x="${x + w / 2}" y="${y + 29}" text-anchor="middle" font-size="19" font-weight="700" fill="#fff">${esc(tags[i])}</text>`
    })()
    return `<text x="${left - 14}" y="${y + block / 2 + 7}" text-anchor="end" font-size="21" font-weight="600" fill="${faded ? MUTED : INK}">${esc(name)}</text>${blocks}${ring}${tag}`
  }).join('')
  const span = most * (block + gap) - gap, by = top + list.length * rowH
  const bracket = brace ? `<text x="${left + span / 2}" y="${by + 34}" text-anchor="middle" font-size="21" font-weight="700" fill="${INK}">${esc(brace)}</text>` : ''
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Poppins, Arial, sans-serif">${parts}${bracket}</svg>`
}

module.exports = { bars }
