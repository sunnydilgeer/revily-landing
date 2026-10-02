import { useId, type ReactNode } from 'react'
import { atomPalette } from './AtomVisuals'

/*
 * Higher-only diagram for Chemistry Lesson 17 (AQA 8464 5.2.2.2 HT: limitations of the simple particle model).
 * Original, code-native schematic, not to scale. Focus ids start with 'hpart-'.
 * Same particle style as StateVisuals.tsx: the model particle is one plain soft-grey ball. Each column sets the model
 * (top) against what is really there (bottom). One drawing, built up a column at a time; the last frame shows all three.
 */
const { ink, muted, neutronFill, neutronLine, protonFill, protonLine, electronLine, panelFill, panelLine } = atomPalette
const faded = 0.28
const COLS = [100, 270, 440]
const TITLES = ['not solid balls', 'not all round', 'forces not shown']
type Show = 0 | 1 | 2 | 'all'

function Diagram({ title, children }: { title: string; children: ReactNode }) {
  const titleId = useId()
  return <div className="science-bio-model"><svg viewBox="0 0 540 330" role="img" aria-labelledby={titleId}><title id={titleId}>{`${title} Original schematic, not to scale.`}</title><g strokeLinejoin="round" strokeLinecap="round">{children}</g></svg></div>
}
function Ball({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return <g><circle cx={x} cy={y} r={r} fill={neutronFill} stroke={neutronLine} strokeWidth="1.8" /><circle cx={x - r * .35} cy={y - r * .35} r={r * .28} fill="white" opacity=".7" /></g>
}
// A real atom: a tiny nucleus with electrons in mostly empty space (shells drawn slightly uneven, so it feels hand-made).
function Atom({ x, y }: { x: number; y: number }) {
  return <g>
    <ellipse cx={x} cy={y} rx="34" ry="32" fill="none" stroke={electronLine} strokeWidth="1.3" strokeDasharray="3 4" />
    <ellipse cx={x} cy={y} rx="19" ry="18" fill="none" stroke={electronLine} strokeWidth="1.3" strokeDasharray="3 4" />
    <circle cx={x} cy={y} r="4.5" fill={protonFill} stroke={protonLine} strokeWidth="1.4" />
    {[[19, 0], [-19, 2], [24, -24], [-30, 14], [6, 32]].map(([dx, dy], i) => <text key={i} x={x + dx} y={y + dy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={electronLine}>×</text>)}
  </g>
}
// Real molecules come in different shapes: a bent water molecule and a straight carbon dioxide molecule.
function Shapes({ x, y }: { x: number; y: number }) {
  return <g>
    <circle cx={x - 30} cy={y - 8} r="12" fill="#f6d6d0" stroke={protonLine} strokeWidth="1.5" />
    <circle cx={x - 43} cy={y + 5} r="7.5" fill="white" stroke={muted} strokeWidth="1.4" />
    <circle cx={x - 17} cy={y + 5} r="7.5" fill="white" stroke={muted} strokeWidth="1.4" />
    <circle cx={x + 20} cy={y + 22} r="10" fill="#f6d6d0" stroke={protonLine} strokeWidth="1.5" />
    <circle cx={x + 38} cy={y + 22} r="9" fill="#dfe5ea" stroke={neutronLine} strokeWidth="1.5" />
    <circle cx={x + 56} cy={y + 22} r="10" fill="#f6d6d0" stroke={protonLine} strokeWidth="1.5" />
    <text x={x - 30} y={y + 32} textAnchor="middle" fontSize="11" fill={muted}>water</text>
    <text x={x + 38} y={y + 48} textAnchor="middle" fontSize="11" fill={muted}>carbon dioxide</text>
  </g>
}
function Forces({ x, y }: { x: number; y: number }) {
  return <g>
    <Ball x={x - 26} y={y} r={14} /><Ball x={x + 26} y={y} r={14} />
    <path d={`M${x - 9} ${y}q9 -9 18 0`} stroke={protonLine} strokeWidth="2.2" fill="none" />
    <path d={`M${x - 9} ${y + 6}q9 9 18 0`} stroke={protonLine} strokeWidth="2.2" fill="none" />
    <text x={x} y={y + 38} textAnchor="middle" fontSize="13" fontWeight="700" fill={protonLine}>how strong?</text>
  </g>
}

function Column({ i, on, assessment }: { i: 0 | 1 | 2; on: boolean; assessment: boolean }) {
  const x = COLS[i]
  return <g opacity={on ? 1 : faded}>
    <rect x={x - 78} y={52} width="156" height="250" rx="16" fill={panelFill} stroke={panelLine} strokeWidth="1.5" />
    <text x={x} y={76} textAnchor="middle" fontSize="12.5" fill={muted}>the model</text>
    {i === 0 && <Ball x={x} y={112} r={20} />}
    {i === 1 && <g><Ball x={x - 26} y={112} /><Ball x={x} y={112} /><Ball x={x + 26} y={112} /></g>}
    {i === 2 && <g><Ball x={x - 18} y={112} r={14} /><Ball x={x + 18} y={112} r={14} /></g>}
    <path d={`M${x} 146v14`} stroke={muted} strokeWidth="1.6" strokeDasharray="2 4" />
    <text x={x} y={178} textAnchor="middle" fontSize="12.5" fill={muted}>really there</text>
    {i === 0 && <Atom x={x} y={232} />}
    {i === 1 && <Shapes x={x} y={222} />}
    {i === 2 && <Forces x={x} y={218} />}
    {!assessment && <text x={x} y={322} textAnchor="middle" fontSize="15" fontWeight="700" fill={ink}>{TITLES[i]}</text>}
  </g>
}

function Limits({ show, assessment = false }: { show: Show; assessment?: boolean }) {
  return <Diagram title="Three limits of the particle model: real particles are not solid balls, are not all round, and the forces between them are not shown.">
    <text x="270" y="30" textAnchor="middle" fontSize="17" fontWeight="700" fill={ink}>Why the particle model isn’t perfect</text>
    {([0, 1, 2] as const).map(i => <Column key={i} i={i} on={show === 'all' || show === i} assessment={assessment} />)}
  </Diagram>
}

export function HigherParticleModelVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  if (focus === 'hpart-solid') return <Limits show={0} />
  if (focus === 'hpart-shape') return <Limits show={1} />
  if (focus === 'hpart-forces') return <Limits show={2} />
  if (focus === 'hpart-question') return <Limits show="all" assessment={assessment} />
  return <Limits show="all" />
}
