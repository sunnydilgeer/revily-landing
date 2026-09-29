import { useId, type ReactNode } from 'react'
import { Arrow } from './InfectionVisuals'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C1b (Chemistry Lesson 7): how the periodic table was built. Original, code-native schematics.
 * Focus ids start with 'ptable-'.
 *
 * One small slice of the table is reused throughout: the columns headed by carbon, nitrogen, oxygen and fluorine,
 * rows 2–5 (C N O F / Si P S Cl / Ge As Se Br / Sn Sb Te I). Every symbol sits where it does in the real table.
 * Atomic weights are today's values, rounded to 1 decimal place.
 * Family tints: oxygen's group amber, fluorine's group (the halogens) blue, carbon's group soft grey, nitrogen's plain.
 * Coral red (the proton colour) marks what the frame is about: a misfit, a switch, a gap or a filled gap.
 * Isotopes use the Chemistry isotope greens from AtomVisuals (lighter isotope pale green, heavier dark green).
 */
const { ink, muted, protonFill, protonLine, electronLine, lightIso, lightIsoLine, darkIso, darkIsoLine, panelFill, panelLine, glow } = atomPalette
const faded = 0.3
const amberFill = '#fff4e6', amberLine = '#d9a55b', amberInk = '#8a5a14'
const blueFill = '#e4f0f9', blueLine = electronLine
const greyFill = '#eef1f3', greyLine = '#7f8c97'

type Family = 'C' | 'N' | 'O' | 'F'
const FAMILY: Record<Family, { fill: string; line: string; text: string }> = {
  C: { fill: greyFill, line: greyLine, text: ink },
  N: { fill: panelFill, line: panelLine, text: ink },
  O: { fill: amberFill, line: amberLine, text: amberInk },
  F: { fill: blueFill, line: blueLine, text: blueLine },
}
const EL: Record<string, { name: string; w: string; fam: Family }> = {
  C: { name: 'carbon', w: '12.0', fam: 'C' }, N: { name: 'nitrogen', w: '14.0', fam: 'N' }, O: { name: 'oxygen', w: '16.0', fam: 'O' }, F: { name: 'fluorine', w: '19.0', fam: 'F' },
  Si: { name: 'silicon', w: '28.1', fam: 'C' }, P: { name: 'phosphorus', w: '31.0', fam: 'N' }, S: { name: 'sulfur', w: '32.1', fam: 'O' }, Cl: { name: 'chlorine', w: '35.5', fam: 'F' },
  Ge: { name: 'germanium', w: '72.6', fam: 'C' }, As: { name: 'arsenic', w: '74.9', fam: 'N' }, Se: { name: 'selenium', w: '79.0', fam: 'O' }, Br: { name: 'bromine', w: '79.9', fam: 'F' },
  Sn: { name: 'tin', w: '118.7', fam: 'C' }, Sb: { name: 'antimony', w: '121.8', fam: 'N' }, Te: { name: 'tellurium', w: '127.6', fam: 'O' }, I: { name: 'iodine', w: '126.9', fam: 'F' },
}

function Diagram({ title, children, viewBox = '0 0 540 320', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={titleId}><title id={titleId}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Pointer({ n, x, y, to }: { n: number; x: number; y: number; to: [number, number] }) {
  const angle = Math.atan2(to[1] - y, to[0] - x)
  return <g><path d={`M${Math.round(x + Math.cos(angle) * 13)} ${Math.round(y + Math.sin(angle) * 13)}L${to[0]} ${to[1]}`} stroke={ink} strokeWidth="1.6" /><circle cx={to[0]} cy={to[1]} r="2.8" fill={ink} />
    <circle cx={x} cy={y} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="700">{n}</text></g>
}

/** A short curved arrow that bows out to the right, used to show neighbours pointing into a gap. */
function Bend({ from, to }: { from: [number, number]; to: [number, number] }) {
  const cx = Math.max(from[0], to[0]) + 30, cy = (from[1] + to[1]) / 2
  const angle = Math.atan2(to[1] - cy, to[0] - cx), head = 10
  const pts = [to, [to[0] - head * Math.cos(angle - .5), to[1] - head * Math.sin(angle - .5)], [to[0] - head * Math.cos(angle + .5), to[1] - head * Math.sin(angle + .5)]]
  return <g><path d={`M${from[0]} ${from[1]}Q${cx} ${cy} ${to[0] + 4 * Math.cos(angle + Math.PI)} ${to[1] + 4 * Math.sin(angle + Math.PI)}`} fill="none" stroke={protonLine} strokeWidth="2.5" />
    <polygon points={pts.map(p => p.map(v => Math.round(v * 10) / 10).join(',')).join(' ')} fill={protonLine} /></g>
}

// ---------- One element tile ----------
type TileState = 'plain' | 'faded' | 'active' | 'misfit' | 'gap' | 'gapActive' | 'found'
function Tile({ x, y, w = 82, h = 58, sym, state = 'plain', weight = true, fam }: { x: number; y: number; w?: number; h?: number; sym: string; state?: TileState; weight?: boolean; fam?: Family }) {
  if (state === 'gap' || state === 'gapActive') {
    const on = state === 'gapActive'
    return <g opacity={on ? 1 : .75}>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={on ? glow : 'white'} stroke={on ? protonLine : muted} strokeWidth={on ? 2.5 : 1.8} strokeDasharray="6 5" />
      <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill={on ? protonLine : muted}>?</text>
    </g>
  }
  const el = EL[sym], f = FAMILY[fam ?? el.fam]
  const found = state === 'found', hot = state === 'active' || state === 'misfit' || found
  const small = w < 60
  return <g opacity={state === 'faded' ? faded : 1}>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={found ? glow : f.fill} stroke={hot ? protonLine : f.line} strokeWidth={hot ? 3 : 1.8} />
    <text x={x + w / 2} y={y + (weight ? h * .5 : h * .5 + 8)} textAnchor="middle" fontSize={small ? 19 : 24} fontWeight="700" fill={found ? protonLine : f.text}>{sym}</text>
    {weight && <text x={x + w / 2} y={y + h - 9} textAnchor="middle" fontSize="12" fontWeight="600" fill={ink}>{el.w}</text>}
    {state === 'misfit' && <g><circle cx={x + w - 4} cy={y + 4} r="11" fill={protonFill} stroke={protonLine} strokeWidth="1.5" /><text x={x + w - 4} y={y + 9} textAnchor="middle" fontSize="14" fontWeight="700" fill="white">!</text></g>}
  </g>
}

// ---------- The slice of the table ----------
const ROWS = [['C', 'N', 'O', 'F'], ['Si', 'P', 'S', 'Cl'], ['Ge', 'As', 'Se', 'Br'], ['Sn', 'Sb', 'Te', 'I']]
const TILE_W = 76, COL_X = (c: number) => 12 + c * 84, ROW_Y = (r: number) => 40 + r * 68
type Cell = { sym: string | null; state?: TileState; fam?: Family }
/** Draws cells[r][c] at the grid position; null sym = gap; undefined cell = nothing drawn. */
function Grid({ cells }: { cells: Array<Array<Cell | undefined>> }) {
  return <g>{cells.map((row, r) => row.map((cell, c) => {
    if (!cell) return null
    return cell.sym === null ? <Tile key={`${r}-${c}`} x={COL_X(c)} y={ROW_Y(r)} w={TILE_W} sym="" state={cell.state === 'gapActive' ? 'gapActive' : 'gap'} />
      : <Tile key={`${r}-${c}`} x={COL_X(c)} y={ROW_Y(r)} w={TILE_W} sym={cell.sym} state={cell.state} fam={cell.fam} />
  }))}</g>
}
function Notes({ x, y, lines }: { x: number; y: number; lines: Array<[string, 'b' | 'n' | 'm' | 'r' | 'blue' | 'amber']> }) {
  const fill = { b: ink, n: ink, m: muted, r: protonLine, blue: blueLine, amber: amberInk }
  let dy = 0
  return <g fontSize="14">{lines.map(([text, kind], i) => {
    const gap = text === '' ? 10 : 18
    const el = text === '' ? null : <text key={i} x={x} y={y + dy} fontWeight={kind === 'n' || kind === 'm' ? 400 : 700} fontSize={kind === 'm' ? 13 : 14} fill={fill[kind]}>{text}</text>
    dy += gap
    return el
  })}</g>
}

// ---------- Section 1: early tables, ordered by atomic weight ----------
const STRIP = ['H', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Na', 'Mg']
const STRIP_W: Record<string, string> = { H: '1.0', Li: '6.9', Be: '9.0', B: '10.8', C: '12.0', N: '14.0', O: '16.0', F: '19.0', Na: '23.0', Mg: '24.3' }
function Strip({ missing }: { missing: boolean }) {
  const slots = missing ? [...STRIP.slice(0, 8), '?', ...STRIP.slice(8)] : STRIP
  const w = 44, step = 48, x0 = (540 - (slots.length * step - 4)) / 2, y = 78
  return <Diagram viewBox="0 0 540 250" schematic={false} title={missing
    ? 'The same row of elements in order of atomic weight, with a dashed empty space between fluorine (19.0) and sodium (23.0). Neon, atomic weight 20.2, belongs there but was not found until 1898, so early tables had no place for it.'
    : 'Ten elements in a row in order of atomic weight, lightest first: hydrogen 1.0, lithium 6.9, beryllium 9.0, boron 10.8, carbon 12.0, nitrogen 14.0, oxygen 16.0, fluorine 19.0, sodium 23.0, magnesium 24.3.'}>
    <text x={x0} y={40} fontSize="15" fontWeight="700" fill={ink}>In order of atomic weight</text>
    <Arrow x1={x0 + 230} y1={35} x2={x0 + 300} y2={35} colour={ink} width={2.5} />
    <text x={x0 + 310} y={40} fontSize="14" fontWeight="700" fill={ink}>heavier</text>
    {slots.map((sym, i) => {
      const x = x0 + i * step
      if (sym === '?') return <g key={i}>
        <Tile x={x} y={y} w={w} h={60} sym="" state="gapActive" />
        <path d={`M${x + w / 2} ${y + 66}V${y + 92}`} stroke={protonLine} strokeWidth="1.6" />
      </g>
      return <g key={i}>
        <rect x={x} y={y} width={w} height={60} rx="8" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
        <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>{sym}</text>
        <text x={x + w / 2} y={y + 50} textAnchor="middle" fontSize="12" fontWeight="600" fill={ink}>{STRIP_W[sym]}</text>
      </g>
    })}
    {missing ? <g>
      <text x={270} y={196} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>neon (20.2) belongs here, but it was not found until 1898</text>
      <text x={270} y={222} textAnchor="middle" fontSize="13" fill={muted}>Nobody knew it was missing, so early tables left no space for it.</text>
    </g> : <g>
      <text x={270} y={184} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>atomic weight: how heavy an element’s atoms are</text>
      <text x={270} y={204} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>compared with other atoms</text>
      <text x={270} y={232} textAnchor="middle" fontSize="13" fill={muted}>Today it is called relative atomic mass. Values rounded.</text>
    </g>}
  </Diagram>
}

// The first tables (no carbon column): nitrogen, oxygen and fluorine columns, rows in strict weight order.
function EarlyRows({ misfit }: { misfit: boolean }) {
  const cells: Array<Array<Cell | undefined>> = [
    [{ sym: 'N' }, { sym: 'O' }, { sym: 'F' }],
    [{ sym: 'P' }, { sym: 'S' }, { sym: 'Cl' }],
    [{ sym: 'As' }, { sym: 'Se' }, { sym: 'Br' }],
  ]
  if (misfit) cells.push([{ sym: 'Sb', state: 'faded' }, { sym: 'I', state: 'misfit' }, { sym: 'Te', state: 'misfit' }])
  const gx = 272
  return <Diagram viewBox="0 0 540 320" schematic={false} title={misfit
    ? 'Part of an early table in strict order of atomic weight. The last row reads antimony 121.8, iodine 126.9, tellurium 127.6. So iodine lands in the column with oxygen, sulfur and selenium, and tellurium lands under bromine. Both are marked as being in the wrong group: iodine reacts like chlorine and bromine.'
    : 'Part of an early table: nitrogen, oxygen, fluorine; phosphorus, sulfur, chlorine; arsenic, selenium, bromine. Each row is in order of atomic weight. Elements in each column have similar properties: oxygen, sulfur and selenium are alike, and fluorine, chlorine and bromine are alike. A column like this is a group.'}>
    <text x={12} y={26} fontSize="14" fontWeight="700" fill={ink}>read each row: lighter → heavier</text>
    <Grid cells={cells} />
    {!misfit && <g>
      <Notes x={gx} y={62} lines={[['A new row starts so that', 'n'], ['similar elements line up.', 'n'], ['', 'n'], ['each column = a group', 'b'], ['', 'n'], ['oxygen, sulfur, selenium:', 'amber'], ['alike', 'amber'], ['', 'n'], ['fluorine, chlorine, bromine:', 'blue'], ['alike', 'blue']]} />
    </g>}
    {misfit && <g>
      <Notes x={gx} y={62} lines={[['In weight order:', 'b'], ['Sb 121.8, I 126.9, Te 127.6', 'n'], ['', 'n'], ['iodine lands with oxygen', 'r'], ['and sulfur: wrong group', 'r'], ['', 'n'], ['but iodine reacts like', 'blue'], ['chlorine and bromine', 'blue'], ['', 'n'], ['Iodine is drawn blue here', 'm'], ['because it belongs with them.', 'm']]} />
    </g>}
  </Diagram>
}

// ---------- Sections 2 and 3: Mendeleev's table (the 4-column slice) ----------
type MendStage = 'table' | 'switch' | 'gap' | 'predict' | 'found' | 'found-all'
function mendCells(stage: MendStage): Array<Array<Cell | undefined>> {
  const filled = stage === 'found' || stage === 'found-all'
  return ROWS.map((row, r) => row.map((sym, c): Cell => {
    if (r === 2 && c === 0) return filled ? { sym: 'Ge', state: 'found' } : { sym: null, state: stage === 'gap' || stage === 'predict' ? 'gapActive' : 'gap' }
    if (stage === 'switch') return { sym, state: sym === 'Te' || sym === 'I' ? 'active' : 'faded' }
    if (stage === 'gap') return { sym, state: 'faded' }
    if (stage === 'predict' || stage === 'found') return { sym, state: c === 0 ? (sym === 'Si' || sym === 'Sn' ? 'active' : 'plain') : 'faded' }
    return { sym }
  }))
}
const MEND_TITLES: Record<MendStage, string> = {
  table: 'A small part of Mendeleev’s 1869 table, drawn the modern way round, with atomic weights. Rows: carbon, nitrogen, oxygen, fluorine; silicon, phosphorus, sulfur, chlorine; an empty space, arsenic, selenium, bromine; tin, antimony, tellurium, iodine. Mostly in order of atomic weight.',
  switch: 'Mendeleev’s table with tellurium (127.6) and iodine (126.9) highlighted and a swap arrow between them. Tellurium is heavier but is placed first, so iodine stays in the column with chlorine and bromine.',
  gap: 'Mendeleev’s table with the empty space below silicon highlighted, marked with a question mark. It is a gap left for an element that had not been discovered yet.',
  predict: 'The gap below silicon, with arrows from silicon above it and tin below it. Mendeleev’s prediction for the missing element: atomic weight about 72, density about 5.5 grams per cubic centimetre, a dark grey solid.',
  found: 'The gap below silicon is now filled by germanium, atomic weight 72.6, discovered in 1886. It sits between silicon and tin and is like them.',
  'found-all': 'Mendeleev’s table with germanium in the space below silicon. A note lists three elements found later that each filled one of his gaps: gallium in 1875, scandium in 1879 and germanium in 1886.',
}
function Mendeleev({ stage }: { stage: MendStage }) {
  const nx = 356, gapX = COL_X(0), gapY = ROW_Y(2)
  const teX = COL_X(2), iX = COL_X(3), rowY = ROW_Y(3)
  return <Diagram viewBox="0 0 540 336" title={MEND_TITLES[stage]} schematic={false}>
    <text x={12} y={26} fontSize="14" fontWeight="700" fill={ink}>{stage === 'table' ? 'Mendeleev, 1869 (a small part)' : 'Mendeleev’s table (a small part)'}</text>
    <Grid cells={mendCells(stage)} />
    {stage === 'switch' && <g>
      <path d={`M${teX + 38} ${rowY + 62}Q${(teX + iX) / 2 + 38} ${rowY + 86} ${iX + 38} ${rowY + 62}`} fill="none" stroke={protonLine} strokeWidth="2.5" />
      <path d={`M${teX + 30} ${rowY + 70}L${teX + 38} ${rowY + 61}L${teX + 46} ${rowY + 68}M${iX + 30} ${rowY + 68}L${iX + 38} ${rowY + 61}L${iX + 46} ${rowY + 70}`} fill="none" stroke={protonLine} strokeWidth="2.5" />
    </g>}
    {stage === 'predict' && <g>
      <Bend from={[gapX + TILE_W + 2, ROW_Y(1) + 29]} to={[gapX + TILE_W + 4, gapY + 20]} />
      <Bend from={[gapX + TILE_W + 2, ROW_Y(3) + 29]} to={[gapX + TILE_W + 4, gapY + 38]} />
    </g>}
    {stage === 'table' && <Notes x={nx} y={62} lines={[['About 60 elements', 'b'], ['were known. They', 'b'], ['are mainly in order', 'b'], ['of atomic weight.', 'b'], ['', 'n'], ['Columns are groups', 'n'], ['of similar elements.', 'n'], ['', 'n'], ['? marks an empty', 'm'], ['space (more soon).', 'm']]} />}
    {stage === 'switch' && <Notes x={nx} y={62} lines={[['Tellurium 127.6 is', 'n'], ['heavier than', 'n'], ['iodine 126.9.', 'n'], ['', 'n'], ['Switched:', 'r'], ['tellurium first,', 'r'], ['so iodine stays', 'r'], ['with chlorine and', 'r'], ['bromine.', 'r']]} />}
    {stage === 'gap' && <Notes x={nx} y={62} lines={[['A gap: no known', 'r'], ['element fitted here.', 'r'], ['', 'n'], ['Mendeleev said it', 'n'], ['was for an element', 'n'], ['not yet discovered.', 'n']]} />}
    {stage === 'predict' && <g>
      <rect x={nx - 10} y={40} width={182} height={196} rx="10" fill={glow} stroke={protonLine} strokeWidth="1.5" />
      <Notes x={nx} y={64} lines={[['Predicted:', 'r'], ['', 'n'], ['atomic weight', 'n'], ['about 72', 'b'], ['', 'n'], ['density about', 'n'], ['5.5 g/cm³', 'b'], ['', 'n'], ['a dark grey solid', 'b']]} />
      <text x={nx - 4} y={262} fontSize="14" fontWeight="700" fill={protonLine}>like silicon above it</text>
      <text x={nx - 4} y={280} fontSize="14" fontWeight="700" fill={protonLine}>and tin below it</text>
    </g>}
    {stage === 'found' && <Notes x={nx} y={62} lines={[['1886:', 'r'], ['germanium', 'r'], ['is found', 'r'], ['', 'n'], ['It is like silicon', 'n'], ['and tin, so it fits', 'n'], ['the gap exactly.', 'n']]} />}
    {stage === 'found-all' && <g>
      <Notes x={nx} y={62} lines={[['Gaps filled later:', 'b'], ['', 'n'], ['gallium, 1875', 'r'], ['scandium, 1879', 'r'], ['germanium, 1886', 'r'], ['', 'n'], ['Each matched', 'n'], ['Mendeleev’s', 'n'], ['predictions.', 'n']]} />
      <text x={nx} y={262} fontSize="13" fill={muted}>(gallium and scandium</text>
      <text x={nx} y={278} fontSize="13" fill={muted}>are in other groups)</text>
    </g>}
  </Diagram>
}
function Compare() {
  const rows: Array<[string, string, string]> = [['atomic weight', 'about 72', '72.6'], ['density (g/cm³)', 'about 5.5', '5.3'], ['appearance', 'dark grey solid', 'grey-white solid'], ['fits the gap?', '–', 'yes']]
  return <Diagram viewBox="0 0 540 250" schematic={false} title="A table comparing Mendeleev’s predictions for the element below silicon with germanium, found in 1886. Atomic weight: predicted about 72, found 72.6. Density: predicted about 5.5, found 5.3 grams per cubic centimetre. Appearance: predicted dark grey solid, found grey-white solid. Germanium fits the gap.">
    <rect x={20} y={20} width={500} height={206} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <rect x={300} y={26} width={214} height={194} rx="8" fill={glow} />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={36} y={52}>property</text>
      <text x={230} y={52} textAnchor="middle">predicted</text>
      <text x={408} y={52} textAnchor="middle" fill={protonLine}>germanium (1886)</text>
    </g>
    <path d="M32 66H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([p, a, b], i) => {
      const y = 96 + i * 38
      return <g key={p} fontSize="14" fill={ink}>
        <text x={36} y={y} fontWeight="700">{p}</text>
        <text x={230} y={y} textAnchor="middle">{a}</text>
        <text x={408} y={y} textAnchor="middle" fontWeight="700" fill={protonLine}>{b}</text>
        {i < rows.length - 1 && <path d={`M32 ${y + 14}H508`} stroke={panelLine} />}
      </g>
    })}
    <text x={270} y={244} textAnchor="middle" fontSize="13" fill={muted}>The predictions were made years before germanium was found.</text>
  </Diagram>
}

// ---------- Section 4: isotopes explain the switches ----------
function Blob({ x, y, label, fill, line, text, r = 17 }: { x: number; y: number; label: string; fill: string; line: string; text: string; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={fill} stroke={line} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={text}>{label}</text></g>
}
function IsoSame() {
  return <Diagram viewBox="0 0 540 250" title="Two isotopes of chlorine: chlorine-35 with 17 protons and 18 neutrons, and chlorine-37 with 17 protons and 20 neutrons. Different masses, but the same number of protons, so the same element with the same properties. Arrows from both lead to one chlorine box in the periodic table.">
    <Blob x={90} y={70} r={30} label="35" fill={lightIso} line={lightIsoLine} text={darkIsoLine} />
    <text x={136} y={64} fontSize="14" fontWeight="700" fill={ink}>chlorine-35</text>
    <text x={136} y={82} fontSize="13" fill={ink}>17 protons, 18 neutrons</text>
    <Blob x={90} y={170} r={31} label="37" fill={darkIso} line={darkIsoLine} text="white" />
    <text x={136} y={164} fontSize="14" fontWeight="700" fill={ink}>chlorine-37</text>
    <text x={136} y={182} fontSize="13" fill={ink}>17 protons, 20 neutrons</text>
    <Arrow x1={320} y1={80} x2={392} y2={112} colour={ink} width={2.5} />
    <Arrow x1={320} y1={162} x2={392} y2={132} colour={ink} width={2.5} />
    <Tile x={404} y={90} sym="Cl" />
    <text x={445} y={174} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>one place</text>
    <text x={445} y={192} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>in the table</text>
    <text x={270} y={236} textAnchor="middle" fontSize="14" fontWeight="700" fill={darkIsoLine}>same protons → same element, same properties</text>
  </Diagram>
}
// 20 tellurium atoms in roughly natural proportions (130: 7, 128: 6, 126: 4, 125: 1, 124: 1, 122: 1; mean 127.65).
const TE = [130, 128, 126, 130, 128, 125, 130, 128, 130, 126, 124, 128, 130, 122, 128, 126, 130, 128, 126, 130]
function IsoMix() {
  const cell = (i: number, x0: number) => [x0 + (i % 5) * 44, 70 + Math.floor(i / 5) * 42] as const
  return <Diagram viewBox="0 0 540 300" title="Two samples of 20 atoms. Tellurium: most atoms are tellurium-128 or tellurium-130, with a few lighter isotopes, so its average mass is 127.6. Iodine: every atom is iodine-127, so its atomic weight is 126.9. Tellurium’s average is higher.">
    <text x={122} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={amberInk}>tellurium atoms</text>
    <rect x={14} y={42} width={218} height={180} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {TE.map((m, i) => { const [x, y] = cell(i, 36); const heavy = m >= 128; return <Blob key={i} x={x} y={y} label={String(m)} fill={heavy ? darkIso : lightIso} line={heavy ? darkIsoLine : lightIsoLine} text={heavy ? 'white' : darkIsoLine} /> })}
    <text x={122} y={246} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>mostly 128 and 130</text>
    <text x={122} y={268} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>average 127.6</text>
    <text x={418} y={30} textAnchor="middle" fontSize="15" fontWeight="700" fill={blueLine}>iodine atoms</text>
    <rect x={308} y={42} width={218} height={180} rx="12" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    {TE.map((_, i) => { const [x, y] = cell(i, 330); return <Blob key={i} x={x} y={y} label="127" fill={blueFill} line={blueLine} text={blueLine} /> })}
    <text x={418} y={246} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>all iodine-127</text>
    <text x={418} y={268} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>atomic weight 126.9</text>
    <text x={270} y={292} textAnchor="middle" fontSize="12" fill={muted}>Numbers are mass numbers. An isotope’s real mass is very slightly different.</text>
  </Diagram>
}
function IsoOrder() {
  const big = (x: number, sym: 'Te' | 'I', protons: number) => <g>
    <Tile x={x} y={30} w={100} h={78} sym={sym} />
    <text x={x + 50} y={130} textAnchor="middle" fontSize="14" fontWeight="700" fill={protonLine}>{protons} protons</text>
  </g>
  return <Diagram viewBox="0 0 540 290" schematic={false} title="Tellurium: 52 protons, atomic weight 127.6. Iodine: 53 protons, atomic weight 126.9. In order of atomic weight, iodine would come first, which puts it in the wrong group. In order of protons, tellurium comes first, which is Mendeleev’s order and keeps iodine in the right group.">
    {big(140, 'Te', 52)}
    {big(300, 'I', 53)}
    <rect x={20} y={150} width={500} height={60} rx="10" fill="#fdf0ee" stroke={protonLine} strokeWidth="1.5" />
    <text x={36} y={176} fontSize="14" fontWeight="700" fill={ink}>by atomic weight:</text>
    <text x={200} y={176} fontSize="14" fontWeight="700" fill={ink}>iodine, then tellurium</text>
    <text x={36} y={198} fontSize="13" fill={protonLine} fontWeight="700">puts iodine in the wrong group</text>
    <rect x={20} y={220} width={500} height={60} rx="10" fill="#eaf5ee" stroke={lightIsoLine} strokeWidth="1.5" />
    <text x={36} y={246} fontSize="14" fontWeight="700" fill={ink}>by protons:</text>
    <text x={200} y={246} fontSize="14" fontWeight="700" fill={ink}>tellurium, then iodine</text>
    <text x={36} y={268} fontSize="13" fill={darkIsoLine} fontWeight="700">Mendeleev’s order: iodine in the right group</text>
  </Diagram>
}
function Timeline() {
  const stops: Array<[string, string[], string]> = [
    ['early 1800s', ['ordered by', 'atomic weight;', 'not complete'], ink],
    ['1869', ['Mendeleev', 'switches some', 'and leaves gaps'], protonLine],
    ['1875–1886', ['new elements,', 'e.g. germanium,', 'fill the gaps'], protonLine],
    ['early 1900s', ['isotopes explain', 'the switches'], darkIsoLine],
  ]
  const xs = [72, 202, 334, 466]
  return <Diagram viewBox="0 0 540 220" schematic={false} title="A timeline. Early 1800s: elements ordered by atomic weight, tables not complete. 1869: Mendeleev switches some elements and leaves gaps. 1875 to 1886: new elements such as germanium fill the gaps. Early 1900s: isotopes explain the switches.">
    <path d="M30 70H510" stroke={panelLine} strokeWidth="4" />
    <Arrow x1={490} y1={70} x2={528} y2={70} colour={panelLine} width={4} />
    {stops.map(([when, lines, colour], i) => <g key={when}>
      <circle cx={xs[i]} cy={70} r="12" fill="white" stroke={colour} strokeWidth="3" />
      <text x={xs[i]} y={75} textAnchor="middle" fontSize="13" fontWeight="700" fill={colour}>{i + 1}</text>
      <text x={xs[i]} y={40} textAnchor="middle" fontSize="14" fontWeight="700" fill={colour}>{when}</text>
      {lines.map((l, j) => <text key={j} x={xs[i]} y={112 + j * 19} textAnchor="middle" fontSize="13" fill={ink}>{l}</text>)}
    </g>)}
    <text x={270} y={200} textAnchor="middle" fontSize="13" fontWeight="700" fill={muted}>Each discovery built on the one before.</text>
  </Diagram>
}

// ---------- On your own ----------
// One real group (boron's): boron, aluminium, a gap (gallium, found 1875), indium.
function GroupQuestion({ assessment }: { assessment: boolean }) {
  const x = assessment ? 229 : 150, ys = [20, 88, 156, 224]
  const syms: Array<[string, string]> = [['B', '10.8'], ['Al', '27.0'], ['', ''], ['In', '114.8']]
  return <Diagram viewBox="0 0 540 300" schematic={false} title={assessment ? 'One group of the periodic table drawn as a column of four boxes numbered 1 to 4. Boxes 1, 2 and 4 hold boron, aluminium and indium. Box 3 is an empty gap.' : 'One group of the periodic table: box 1 boron (10.8), box 2 aluminium (27.0), box 3 a gap, box 4 indium (114.8). The gap was for gallium, found in 1875, which is like aluminium and indium.'}>
    {syms.map(([sym, w], i) => sym ? <g key={i}>
      <rect x={x} y={ys[i]} width={82} height={58} rx="8" fill={panelFill} stroke={panelLine} strokeWidth="1.8" />
      <text x={x + 41} y={ys[i] + 29} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>{sym}</text>
      <text x={x + 41} y={ys[i] + 49} textAnchor="middle" fontSize="12" fontWeight="600" fill={ink}>{w}</text>
    </g> : <Tile key={i} x={x} y={ys[i]} sym="" state="gap" />)}
    {ys.map((y, i) => <Pointer key={i} n={i + 1} x={x - 50} y={y + 29} to={[x - 4, y + 29]} />)}
    {!assessment && <Notes x={290} y={60} lines={[['1 boron', 'n'], ['2 aluminium', 'n'], ['3 gap: gallium,', 'r'], ['   found in 1875', 'r'], ['4 indium', 'n'], ['', 'n'], ['Gallium is like aluminium', 'b'], ['and indium, as predicted.', 'b']]} />}
  </Diagram>
}
function GalliumData() {
  const rows: Array<[string, string, string]> = [['atomic weight', 'about 68', '69.7'], ['density (g/cm³)', 'about 5.9', '5.9']]
  return <Diagram viewBox="0 0 540 170" schematic={false} title="A data table. Atomic weight: Mendeleev predicted about 68; gallium’s is 69.7. Density in grams per cubic centimetre: predicted about 5.9; gallium’s is 5.9.">
    <text x={30} y={24} fontSize="14" fontWeight="700" fill={ink}>Mendeleev’s predictions and gallium (found 1875)</text>
    <rect x={20} y={38} width={500} height={120} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}>
      <text x={36} y={66}>property</text><text x={260} y={66} textAnchor="middle">predicted</text><text x={420} y={66} textAnchor="middle">gallium</text>
    </g>
    <path d="M32 78H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([p, a, b], i) => <g key={p} fontSize="14" fill={ink}>
      <text x={36} y={106 + i * 34}>{p}</text><text x={260} y={106 + i * 34} textAnchor="middle">{a}</text><text x={420} y={106 + i * 34} textAnchor="middle">{b}</text>
    </g>)}
  </Diagram>
}

export function PeriodicVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'ptable-weight-strip': return <Strip missing={false} />
    case 'ptable-weight-missing': return <Strip missing />
    case 'ptable-weight-rows': return <EarlyRows misfit={false} />
    case 'ptable-weight-misfit': return <EarlyRows misfit />
    case 'ptable-mend-table': return <Mendeleev stage="table" />
    case 'ptable-mend-switch': return <Mendeleev stage="switch" />
    case 'ptable-mend-gap': return <Mendeleev stage="gap" />
    case 'ptable-predict': return <Mendeleev stage="predict" />
    case 'ptable-found': return <Mendeleev stage="found" />
    case 'ptable-found-all': return <Mendeleev stage="found-all" />
    case 'ptable-compare': return <Compare />
    case 'ptable-iso-same': return <IsoSame />
    case 'ptable-iso-mix': return <IsoMix />
    case 'ptable-iso-order': return <IsoOrder />
    case 'ptable-timeline': return <Timeline />
    case 'ptable-question': return <GroupQuestion assessment={assessment} />
    case 'ptable-gallium': return <GalliumData />
    default: return <Mendeleev stage="table" />
  }
}
