import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Chemistry C4 (Chemistry Lesson 22): acids, alkalis and pH. Original, code-native schematics; not to scale.
 * Focus ids start with 'acid-'.
 *
 * Colour code: the pH scale uses the universal-indicator colours (red, orange, yellow, green at 7, blue, purple).
 * Positive ions (H⁺) use the coral proton tint and negative ions (OH⁻) the electron-blue tint, as in the ions lessons.
 * Water molecules are a red oxygen with two small white hydrogens. Ink, greys and panels come from `atomPalette`.
 * Assessment views hide the words acidic, alkaline, neutral and any pH reading that would give the answer away.
 */
const { ink, muted, panelFill, panelLine, protonFill, protonLine, electronFill, electronLine } = atomPalette
const good = '#3f8a5f', goodSoft = '#e3f3e8', amber = '#d98a1c', amberSoft = '#fdf0dc', amberInk = '#8a5a14'
const liquid = '#e4f1f8', glass = '#8fb0c4'

// Universal-indicator colour for each whole-number pH from 0 to 14.
const UI = ['#b8322a', '#c9422b', '#d9552b', '#e8752f', '#f0952f', '#f2b53a', '#efd340', '#8fb86a', '#5f9fb0', '#5a86b5', '#5b6cad', '#7458a6', '#84509f', '#914a98', '#9e4390']
const X0 = 20, CW = 500 / 15
const cx = (ph: number) => X0 + (ph + 0.5) * CW

function Diagram({ title, children, viewBox = '0 0 540 300', schematic = true }: { title: string; children: ReactNode; viewBox?: string; schematic?: boolean }) {
  const id = useId()
  return <div className="science-bio-model"><svg viewBox={viewBox} role="img" aria-labelledby={id}><title id={id}>{schematic ? `${title} Original schematic, not to scale.` : title}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}

// ---------- The pH scale strip ----------
function Strip({ y, h = 38 }: { y: number; h?: number }) {
  return <g>
    {UI.map((c, i) => <rect key={i} x={X0 + i * CW} y={y} width={CW + 0.6} height={h} fill={c} />)}
    <rect x={X0} y={y} width={500} height={h} rx="6" fill="none" stroke={ink} strokeWidth="1.8" />
    {UI.map((_, i) => <text key={i} x={cx(i)} y={y + h + 19} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{i}</text>)}
  </g>
}
function Arr({ x1, x2, y, colour }: { x1: number; x2: number; y: number; colour: string }) {
  const d = x2 > x1 ? -1 : 1
  return <g stroke={colour} fill={colour}><path d={`M${x1} ${y}H${x2}`} strokeWidth="3" /><path d={`M${x2} ${y}l${d * 11} -7v14z`} strokeWidth="1" /></g>
}
function Stem({ x, y1, y2, dot }: { x: number; y1: number; y2: number; dot?: 'top' | 'bottom' }) {
  return <g><path d={`M${x} ${y1}V${y2}`} stroke={ink} strokeWidth="1.8" />{dot && <circle cx={x} cy={dot === 'top' ? y1 : y2} r="3.5" fill={ink} />}</g>
}

type ScaleStage = 'range' | 'bands' | 'examples'
const SCALE_TITLES: Record<ScaleStage, string> = {
  range: 'The pH scale: a strip of fifteen colours numbered 0 to 14, from red at 0 through orange, yellow and green to blue and purple at 14.',
  bands: 'The pH scale from 0 to 14. Numbers below 7 are acidic, exactly 7 is neutral and numbers above 7 are alkaline. The lower the pH, the more acidic; the higher the pH, the more alkaline.',
  examples: 'The pH scale from 0 to 14 with everyday liquids marked: lemon juice at 2, vinegar at 3, normal rain at about 6, pure water at 7, hand soap at 10 and drain cleaner at 13.',
}
function Scale({ stage }: { stage: ScaleStage }) {
  if (stage === 'range') return <Diagram title={SCALE_TITLES.range} viewBox="0 0 540 190">
    <text x={X0} y={36} fontSize="17" fontWeight="700" fill={ink}>The pH scale</text>
    <Strip y={54} h={44} />
    <text x={270} y={150} textAnchor="middle" fontSize="15" fill={ink}>A number from 0 to 14 for how acidic or alkaline a solution is</text>
  </Diagram>
  if (stage === 'bands') return <Diagram title={SCALE_TITLES.bands} viewBox="0 0 540 250">
    <Strip y={26} />
    <g fill="none" strokeWidth="2.5">
      <path d={`M${X0 + 3} 96v7H${X0 + 7 * CW - 3}v-7`} stroke={protonLine} />
      <path d={`M${X0 + 7 * CW + 3} 96v7H${X0 + 8 * CW - 3}v-7`} stroke={good} />
      <path d={`M${X0 + 8 * CW + 3} 96v7H${X0 + 500 - 3}v-7`} stroke={electronLine} />
    </g>
    <g textAnchor="middle" fontWeight="700"><text x={X0 + 3.5 * CW} y={126} fontSize="16" fill={protonLine}>acidic</text><text x={X0 + 3.5 * CW} y={144} fontSize="13" fontWeight="400" fill={ink}>pH below 7</text>
      <text x={cx(7)} y={126} fontSize="16" fill={good}>neutral</text><text x={cx(7)} y={144} fontSize="13" fontWeight="400" fill={ink}>pH 7</text>
      <text x={X0 + 11.5 * CW} y={126} fontSize="16" fill={electronLine}>alkaline</text><text x={X0 + 11.5 * CW} y={144} fontSize="13" fontWeight="400" fill={ink}>pH above 7</text></g>
    <Arr x1={X0 + 7 * CW - 4} x2={X0 + 10} y={206} colour={protonLine} /><text x={X0 + 3.5 * CW} y={190} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>lower pH: more acidic</text>
    <Arr x1={X0 + 8 * CW + 4} x2={X0 + 490} y={206} colour={electronLine} /><text x={X0 + 11.5 * CW} y={190} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>higher pH: more alkaline</text>
  </Diagram>
  const above: Array<[number, string]> = [[2, 'lemon juice'], [6, 'normal rain'], [13, 'drain cleaner']]
  const below: Array<[number, string]> = [[3, 'vinegar'], [7, 'pure water'], [10, 'hand soap']]
  return <Diagram title={SCALE_TITLES.examples} viewBox="0 0 540 240">
    <Strip y={78} />
    {above.map(([p, n]) => <g key={n}><text x={cx(p)} y={40} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text><Stem x={cx(p)} y1={48} y2={78} dot="bottom" /></g>)}
    {below.map(([p, n]) => <g key={n}><Stem x={cx(p)} y1={146} y2={172} dot="top" /><text x={cx(p)} y={192} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>)}
    <text x={270} y={228} textAnchor="middle" fontSize="13" fill={muted}>pH values are approximate</text>
  </Diagram>
}

// ---------- Beakers, ions and molecules ----------
function Beaker({ x, y, w, h, level, fill = liquid, children }: { x: number; y: number; w: number; h: number; level: number; fill?: string; children?: ReactNode }) {
  const r = 12, ly = y + h - level
  const body = `M${x} ${y}V${y + h - r}Q${x} ${y + h} ${x + r} ${y + h}H${x + w - r}Q${x + w} ${y + h} ${x + w} ${y + h - r}V${y}`
  return <g>
    <path d={`M${x} ${ly}H${x + w}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}Z`} fill={fill} />
    {children}
    <path d={body} fill="none" stroke={glass} strokeWidth="3" /><path d={`M${x - 6} ${y}H${x}M${x + w} ${y}H${x + w + 6}`} stroke={glass} strokeWidth="3" />
  </g>
}
function Ion({ x, y, kind }: { x: number; y: number; kind: 'h' | 'oh' }) {
  return kind === 'h'
    ? <g data-ion="H+"><circle cx={x} cy={y} r="14" fill={protonFill} stroke={protonLine} strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="white">H⁺</text></g>
    : <g data-ion="OH-"><circle cx={x} cy={y} r="17" fill={electronFill} stroke={electronLine} strokeWidth="2" /><text x={x} y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill="white">OH⁻</text></g>
}
function Water({ x, y }: { x: number; y: number }) {
  return <g data-molecule="H2O"><circle cx={x - 13} cy={y + 9} r="7" fill="#ffffff" stroke="#8d9ba6" strokeWidth="1.8" /><circle cx={x + 13} cy={y + 9} r="7" fill="#ffffff" stroke="#8d9ba6" strokeWidth="1.8" /><circle cx={x} cy={y} r="13" fill="#f2a39b" stroke="#c0625a" strokeWidth="2" /></g>
}
const ION_SPOTS: Array<[number, number]> = [[34, 30], [86, 26], [126, 44], [52, 76], [104, 84], [140, 100], [34, 112], [78, 122], [122, 124]]

function IonBeaker({ x, y, kind, n = 7, caption, sub, num }: { x: number; y: number; kind: 'h' | 'oh'; n?: number; caption?: string; sub?: string; num?: number }) {
  return <g>
    <Beaker x={x} y={y} w={170} h={176} level={150}>
      <g transform={`translate(${x} ${y + 26})`}>{ION_SPOTS.slice(0, n).map(([px, py], i) => <Ion key={i} x={px + (kind === 'oh' ? 6 : 0)} y={py + (kind === 'oh' ? 4 : 0)} kind={kind} />)}</g>
    </Beaker>
    {num !== undefined && <g><circle cx={x + 85} cy={y - 22} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x + 85} y={y - 17} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{num}</text></g>}
    {caption && <text x={x + 85} y={y + 204} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{caption}</text>}
    {sub && <text x={x + 85} y={y + 224} textAnchor="middle" fontSize="13" fill={ink}>{sub}</text>}
  </g>
}

// ---------- Section: measuring pH ----------
function BeakerTrio() {
  const items: Array<[number, string, string]> = [[2, 'red', 'an acidic solution'], [7, 'green', 'a neutral solution'], [13, 'purple', 'an alkaline solution']]
  return <Diagram title="The same indicator dye added to three solutions. In an acidic solution it is red, in a neutral solution it is green and in an alkaline solution it is purple." viewBox="0 0 540 270">
    <text x={270} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>One dye, three colours</text>
    {items.map(([ph, , label], i) => {
      const x = 40 + i * 175
      return <g key={i}><Beaker x={x} y={56} w={110} h={120} level={92} fill={UI[ph]} /><text x={x + 55} y={204} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{label}</text></g>
    })}
    <text x={270} y={244} textAnchor="middle" fontSize="14" fill={ink}>An indicator is a dye that changes colour above or below a certain pH</text>
  </Diagram>
}
const GROUPS: Array<[number, number, string]> = [[0, 2, 'red'], [3, 4, 'orange'], [5, 6, 'yellow'], [7, 7, 'green'], [8, 10, 'blue'], [11, 14, 'purple']]
function Universal({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment
    ? 'A universal indicator colour chart. pH 0 to 2 is red, 3 to 4 orange, 5 to 6 yellow, 7 green, 8 to 10 blue and 11 to 14 purple.'
    : 'A universal indicator colour chart. pH 0 to 2 is red, 3 to 4 orange, 5 to 6 yellow, 7 green, 8 to 10 blue and 11 to 14 purple. Below 7 is acidic and above 7 is alkaline.'} viewBox={`0 0 540 ${assessment ? 180 : 250}`}>
    <text x={X0} y={28} fontSize="16" fontWeight="700" fill={ink}>Universal indicator</text>
    <Strip y={42} />
    {GROUPS.map(([a, b, name]) => {
      const x1 = X0 + a * CW + 3, x2 = X0 + (b + 1) * CW - 3, m = (x1 + x2) / 2
      return <g key={name}><path d={`M${x1} 110v6H${x2}v-6`} fill="none" stroke={ink} strokeWidth="2" /><text x={m} y={name === 'green' ? 160 : 138} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{name}</text></g>
    })}
    {!assessment && <g fontSize="13" fill={ink} textAnchor="middle"><text x={X0 + 3.5 * CW} y={206}>below 7: acidic</text><text x={cx(7)} y={206} fontWeight="700" fill={good}>7: neutral</text><text x={X0 + 11.5 * CW} y={206}>above 7: alkaline</text></g>}
  </Diagram>
}
function Probe() {
  return <Diagram title="Two ways to measure pH. Left: a beaker of solution with a few drops of universal indicator that has turned orange, which lets you estimate the pH from the colour. Right: a pH probe in a beaker joined to a meter that shows the pH as a number, 3.6." viewBox="0 0 540 290">
    <text x={120} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Indicator</text>
    <Beaker x={50} y={56} w={140} h={130} level={100} fill={UI[3]} />
    <text x={120} y={216} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>a colour</text>
    <text x={120} y={236} textAnchor="middle" fontSize="13" fill={ink}>estimate the pH</text>
    <path d="M270 40V250" stroke={panelLine} strokeWidth="2" strokeDasharray="4 6" />
    <text x={376} y={26} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>pH meter</text>
    <Beaker x={310} y={96} w={130} h={100} level={72} />
    <rect x={366} y={44} width={16} height={130} rx="5" fill="#c9d8e0" stroke={glass} strokeWidth="2.5" />
    <path d="M374 44V40H452" fill="none" stroke={ink} strokeWidth="2.5" />
    <rect x={452} y={14} width={68} height={92} rx="10" fill={panelFill} stroke={ink} strokeWidth="2.5" /><rect x={460} y={24} width={52} height={28} rx="4" fill="#dff0e4" stroke={good} strokeWidth="2" />
    <text x={486} y={44} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>3.6</text>
    <circle cx={474} cy={80} r="6" fill={panelLine} /><circle cx={498} cy={80} r="6" fill={panelLine} />
    <text x={410} y={228} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>a number</text>
    <text x={410} y={248} textAnchor="middle" fontSize="13" fill={ink}>more accurate</text>
  </Diagram>
}

// ---------- Section: acids, bases and alkalis ----------
function Sets({ stage }: { stage: 'base' | 'both' }) {
  const both = stage === 'both'
  return <Diagram title={both
    ? 'A set diagram. A large oval holds all the bases, which neutralise acids. A smaller oval inside it holds the alkalis, the bases that dissolve in water. Sodium hydroxide is in the alkali oval. Copper oxide is in the bases oval but outside the alkali oval.'
    : 'A large oval holds the bases, which are substances that neutralise acids. Examples: sodium hydroxide and copper oxide.'} viewBox="0 0 540 300">
    <ellipse cx="270" cy="150" rx="245" ry="128" fill="#efe9f6" stroke="#8a72ad" strokeWidth="2.5" />
    <text x="270" y="50" textAnchor="middle" fontSize="17" fontWeight="700" fill="#5a4380">bases</text>
    <text x="270" y="70" textAnchor="middle" fontSize="13" fill={ink}>neutralise acids</text>
    {both && <g><ellipse cx="350" cy="168" rx="128" ry="66" fill="#dceaf7" stroke={electronLine} strokeWidth="2.5" />
      <text x="350" y="146" textAnchor="middle" fontSize="16" fontWeight="700" fill={electronLine}>alkalis</text>
      <text x="350" y="164" textAnchor="middle" fontSize="13" fill={ink}>bases that dissolve</text><text x="350" y="180" textAnchor="middle" fontSize="13" fill={ink}>in water</text></g>}
    <text x={both ? 350 : 190} y={both ? 210 : 140} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>sodium hydroxide</text>
    <text x={both ? 132 : 350} y={both ? 168 : 140} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>copper oxide</text>
    {both && <text x="132" y="188" textAnchor="middle" fontSize="13" fill={ink}>(does not dissolve)</text>}
    {!both && <text x="270" y="200" textAnchor="middle" fontSize="13" fill={muted}>a base may or may not dissolve in water</text>}
  </Diagram>
}
function IonsQuestion({ assessment }: { assessment: boolean }) {
  return <Diagram title={assessment
    ? 'Two beakers of solution. Beaker 1 contains OH minus ions, drawn as blue circles. Beaker 2 contains H plus ions, drawn as coral circles.'
    : 'Two beakers of solution. Beaker 1 contains OH minus ions, so it is an alkali. Beaker 2 contains H plus ions, so it is an acid.'} viewBox={`0 0 540 ${assessment ? 250 : 320}`}>
    <IonBeaker x={60} y={50} kind="oh" n={6} num={1} caption={assessment ? undefined : 'alkali solution'} sub={assessment ? undefined : 'pH above 7'} />
    <IonBeaker x={310} y={50} kind="h" n={8} num={2} caption={assessment ? undefined : 'acid solution'} sub={assessment ? undefined : 'pH below 7'} />
  </Diagram>
}

// ---------- Section: neutralisation ----------
function Box({ x, y, w, label, tone }: { x: number; y: number; w: number; label: string; tone: 'acid' | 'base' | 'salt' | 'water' }) {
  const c = { acid: ['#fbe9e6', protonLine], base: ['#efe9f6', '#8a72ad'], salt: ['#fdf0dc', amber], water: ['#dceaf7', electronLine] }[tone]
  return <g><rect x={x} y={y} width={w} height={46} rx="10" fill={c[0]} stroke={c[1]} strokeWidth="2.5" /><text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize="19" fontWeight="700" fill={ink}>{label}</text></g>
}
function Word() {
  return <Diagram title="The word equation for neutralisation: acid plus base makes a salt plus water. The products have a pH of 7, so they are neutral." viewBox="0 0 540 250">
    <text x={270} y={34} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Neutralisation</text>
    <Box x={14} y={56} w={92} label="acid" tone="acid" />
    <text x={124} y={87} fontSize="24" fontWeight="700" fill={ink}>+</text>
    <Box x={146} y={56} w={92} label="base" tone="base" />
    <path d="M252 79H286" stroke={ink} strokeWidth="3" /><path d="M294 79l-11 -7v14z" fill={ink} stroke={ink} />
    <Box x={306} y={56} w={92} label="salt" tone="salt" />
    <text x={410} y={87} fontSize="24" fontWeight="700" fill={ink}>+</text>
    <Box x={438} y={56} w={92} label="water" tone="water" />
    <text x={270} y={150} textAnchor="middle" fontSize="15" fill={ink}>The products are neutral</text>
    <rect x={225} y={166} width={90} height={38} rx="8" fill={UI[7]} stroke={ink} strokeWidth="2" /><text x={270} y={191} textAnchor="middle" fontSize="17" fontWeight="700" fill="white">pH 7</text>
  </Diagram>
}
function IonsReact() {
  return <Diagram title="A hydrogen ion, H plus, joins with a hydroxide ion, OH minus, to make one molecule of water, H2O. The equation is H plus (aq) plus OH minus (aq) gives H2O (l)." viewBox="0 0 540 260">
    <text x={270} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>What happens to the ions</text>
    <Ion x={110} y={96} kind="h" /><text x={160} y={102} textAnchor="middle" fontSize="24" fontWeight="700" fill={ink}>+</text><Ion x={214} y={96} kind="oh" />
    <path d="M256 96H314" stroke={ink} strokeWidth="3" /><path d="M314 96l-11 -7v14z" fill={ink} stroke={ink} />
    <Water x={388} y={92} />
    <text x={110} y={140} textAnchor="middle" fontSize="13" fill={ink}>hydrogen ion</text><text x={214} y={140} textAnchor="middle" fontSize="13" fill={ink}>hydroxide ion</text><text x={388} y={140} textAnchor="middle" fontSize="13" fill={ink}>water molecule</text>
    <rect x={62} y={170} width={416} height={56} rx="10" fill={goodSoft} stroke={good} strokeWidth="2.5" />
    <text x={270} y={206} textAnchor="middle" fontSize="20" fontWeight="700" fill={ink}>H⁺(aq) + OH⁻(aq) → H₂O(l)</text>
  </Diagram>
}
// Three beakers of acid with universal indicator, alkali added a little at a time.
function Titration() {
  const steps: Array<[number, string, string]> = [[1, 'acid and indicator', 'red'], [7, 'alkali added, drop by drop', 'green'], [13, 'too much alkali', 'purple']]
  return <Diagram title="Alkali is added to an acid that contains universal indicator. At the start the mixture is red. When the indicator turns green the mixture is neutral and neutralisation is complete. If more alkali is added it turns purple." viewBox="0 0 540 290">
    <text x={270} y={30} textAnchor="middle" fontSize="16" fontWeight="700" fill={ink}>Finding the end point with universal indicator</text>
    {steps.map(([ph, label, colour], i) => {
      const x = 30 + i * 180, done = i === 1
      return <g key={i}>
        <Beaker x={x} y={56} w={100} h={110} level={84} fill={UI[ph]} />
        <text x={x + 50} y={196} textAnchor="middle" fontSize="15" fontWeight="700" fill={done ? good : ink}>{colour}</text>
        <text x={x + 50} y={216} textAnchor="middle" fontSize="13" fill={ink}>{label}</text>
        {done && <text x={x + 50} y={236} textAnchor="middle" fontSize="13" fontWeight="700" fill={good}>neutral: stop here</text>}
        {i < 2 && <g><path d={`M${x + 116} 110H${x + 156}`} stroke={ink} strokeWidth="3" /><path d={`M${x + 158} 110l-10 -7v14z`} fill={ink} stroke={ink} /></g>}
      </g>
    })}
  </Diagram>
}
function TitrationQuestion({ assessment }: { assessment: boolean }) {
  const beakers: Array<[number, number]> = [[9, 1], [5, 2], [7, 3]]
  return <Diagram title={assessment
    ? 'Three beakers of the same mixture of acid, alkali and universal indicator, taken at different moments. Beaker 1 is blue, beaker 2 is yellow and beaker 3 is green.'
    : 'Three beakers of the same mixture taken at different moments. Beaker 1 is blue, beaker 2 is yellow and beaker 3 is green, so beaker 3 is neutral.'} viewBox="0 0 540 250">
    <text x={270} y={28} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>Acid, alkali and universal indicator at three moments</text>
    {beakers.map(([ph, n], i) => {
      const x = 50 + i * 165
      return <g key={n}><Beaker x={x} y={78} w={100} h={110} level={84} fill={UI[ph]} /><circle cx={x + 50} cy={56} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={x + 50} y={61} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text></g>
    })}
    {!assessment && <text x={270} y={228} textAnchor="middle" fontSize="14" fontWeight="700" fill={good}>Beaker 3 is green: neutralisation is complete</text>}
  </Diagram>
}

// ---------- On your own ----------
function ScaleQuestion({ assessment }: { assessment: boolean }) {
  const marks: Array<[number, number]> = [[2, 1], [6, 2], [8, 3], [12, 4]]
  return <Diagram title={assessment
    ? 'The pH scale with four numbered solutions marked. Solution 1 is at pH 2, solution 2 at pH 6, solution 3 at pH 8 and solution 4 at pH 12.'
    : 'The pH scale with four numbered solutions marked. Solution 1 is at pH 2, solution 2 at pH 6, solution 3 at pH 8 and solution 4 at pH 12. Solutions 3 and 4 are above pH 7, so they are alkaline.'} viewBox={`0 0 540 ${assessment ? 150 : 190}`}>
    {marks.map(([p, n]) => <g key={n}><circle cx={cx(p)} cy={30} r="13" fill="white" stroke={ink} strokeWidth="2" /><text x={cx(p)} y={35} textAnchor="middle" fontSize="14" fontWeight="700" fill={ink}>{n}</text><Stem x={cx(p)} y1={44} y2={72} dot="bottom" /></g>)}
    <Strip y={72} />
    {!assessment && <text x={270} y={170} textAnchor="middle" fontSize="13" fill={ink}>Solutions 3 and 4 have a pH above 7</text>}
  </Diagram>
}
function DataTable() {
  const rows: Array<[string, string, number]> = [['A', '3.1', 3], ['B', '7.0', 7], ['C', '9.4', 9], ['D', '12.8', 13]]
  return <Diagram title="A table of four solutions tested with a pH probe and with universal indicator. Solution A: pH 3.1, orange. Solution B: pH 7.0, green. Solution C: pH 9.4, blue. Solution D: pH 12.8, purple." viewBox="0 0 540 250" schematic={false}>
    <text x={30} y={26} fontSize="15" fontWeight="700" fill={ink}>Four solutions tested</text>
    <rect x={20} y={40} width={500} height={196} rx="10" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <g fontSize="14" fontWeight="700" fill={ink}><text x={36} y={70}>solution</text><text x={230} y={70} textAnchor="middle">pH probe reading</text><text x={440} y={70} textAnchor="middle">indicator colour</text></g>
    <path d="M32 84H508" stroke={panelLine} strokeWidth="1.5" />
    {rows.map(([n, v, ph], i) => {
      const y = 116 + i * 34
      return <g key={n} fontSize="15" fill={ink}><text x={60} y={y} fontWeight="700" textAnchor="middle">{n}</text><text x={230} y={y} textAnchor="middle">{v}</text><rect x={410} y={y - 17} width={60} height={22} rx="6" fill={UI[ph]} stroke={ink} strokeWidth="1.5" /></g>
    })}
  </Diagram>
}

export function AcidVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  switch (focus) {
    case 'acid-scale-range': return <Scale stage="range" />
    case 'acid-scale-bands': return <Scale stage="bands" />
    case 'acid-scale-examples': return <Scale stage="examples" />
    case 'acid-ind-dye': return <BeakerTrio />
    case 'acid-ind-universal': return <Universal assessment={assessment} />
    case 'acid-ind-probe': return <Probe />
    case 'acid-h': return <Diagram title="A beaker of an acid solution. It contains lots of hydrogen ions, H plus, drawn as coral circles. Its pH is less than 7." viewBox="0 0 540 290"><IonBeaker x={185} y={30} kind="h" n={9} caption="acid solution" sub="H⁺ ions, pH less than 7" /></Diagram>
    case 'acid-oh': return <Diagram title="A beaker of an alkali solution. It contains lots of hydroxide ions, OH minus, drawn as blue circles. Its pH is greater than 7." viewBox="0 0 540 290"><IonBeaker x={185} y={30} kind="oh" n={7} caption="alkali solution" sub="OH⁻ ions, pH greater than 7" /></Diagram>
    case 'acid-base': return <Sets stage="base" />
    case 'acid-sets': return <Sets stage="both" />
    case 'acid-neut-word': return <Word />
    case 'acid-neut-ions': return <IonsReact />
    case 'acid-neut-indicator': return <Titration />
    case 'acid-q-ions': return <IonsQuestion assessment={assessment} />
    case 'acid-q-scale': return <ScaleQuestion assessment={assessment} />
    case 'acid-q-titre': return <TitrationQuestion assessment={assessment} />
    case 'acid-q-data': return <DataTable />
    default: return <Scale stage="bands" />
  }
}
