import { useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import type { OperationsVisualDefinition } from './variantBLesson'
import { BidmasExpression } from './BidmasReference'

function Counters({ count, loose = false }: { count: number; loose?: boolean }) {
  return <span className={`opb-counters${loose ? ' opb-counters--loose' : ''}`} aria-label={`${count} counters`}>
    {Array.from({ length: count }, (_, i) => <i key={i} aria-hidden="true" />)}
  </span>
}
function Groups() {
  const [size, setSize] = useState(4)
  return <figure className="opb-stage">
    <div className="opb-counter-model" aria-label={`2 loose counters plus 3 groups of ${size}`}>
      <Counters count={2} loose /><span aria-hidden="true">+</span>
      <div className="opb-grouped">{[0, 1, 2].map(i => <Counters key={i} count={size} />)}</div>
    </div>
    <div className="opb-math" aria-live="polite"><MathSpan latex={`2 + \\underbrace{3 \\times ${size}}_{${3 * size}} = ${2 + 3 * size}`} display /></div>
    <figcaption>2 loose counters + 3 equal groups</figcaption>
    <div className="opb-toggles" role="group" aria-label="Counters in each group">{[2, 3, 4].map(n => <button key={n} aria-pressed={size === n} onClick={() => setSize(n)} type="button">{n} per group</button>)}</div>
  </figure>
}
function Brackets() {
  const [grouped, setGrouped] = useState(false)
  return <figure className="opb-stage">
    <div className="opb-toggles" role="group" aria-label="Compare bracket placement"><button type="button" aria-pressed={!grouped} onClick={() => setGrouped(false)}>Without brackets</button><button type="button" aria-pressed={grouped} onClick={() => setGrouped(true)}>With brackets</button></div>
    <div aria-live="polite">
      <div className="opb-math"><MathSpan latex={grouped ? '\\underbrace{(2+3)}_{5} \\times 4' : '2 + \\underbrace{3\\times4}_{12}'} display /></div>
      <p className="opb-equation">{grouped ? '5 × 4 = 20' : '2 + 12 = 14'}</p>
      <p className="opb-note">{grouped ? 'The whole sum is multiplied by 4.' : 'Only 3 is multiplied by 4.'}</p>
    </div>
  </figure>
}
function FractionGroups() {
  const [zone, setZone] = useState<'top' | 'bottom'>('top')
  return <figure className="opb-stage">
    <div className="opb-math"><MathSpan latex={zone === 'top' ? '\\frac{\\overbrace{8+4}^{12}}{5-2}' : '\\frac{8+4}{\\underbrace{5-2}_{3}}'} display /></div>
    <div className="opb-toggles" role="group" aria-label="Explore each fraction group"><button type="button" aria-pressed={zone === 'top'} onClick={() => setZone('top')}>Numerator · top</button><button type="button" aria-pressed={zone === 'bottom'} onClick={() => setZone('bottom')}>Denominator · bottom</button></div>
    <p className="opb-note" aria-live="polite">{zone === 'top' ? 'The whole top is 8 + 4 = 12.' : 'The whole bottom is 5 − 2 = 3.'}</p>
    <figcaption>Then divide: 12 ÷ 3 = 4.</figcaption>
  </figure>
}
function Worked({ visual }: { visual: Extract<OperationsVisualDefinition, { kind: 'worked' }> }) {
  const [index, setIndex] = useState(-1)
  const active = visual.steps[index]
  return <figure className="opb-stage opb-worked">
    <div aria-live="polite" aria-atomic="true">
      <p className="opb-step-label">{active ? `Step ${index + 1} of ${visual.steps.length}` : 'Worked example'}</p>
      <div className="opb-math"><MathSpan latex={active?.math ?? visual.math} display /></div>
      <p className="opb-instruction">{active?.title ?? 'Follow one calculation at a time.'}</p>
      <p className="opb-note">{active?.evidence ?? 'Use Show first step to begin.'}</p>
    </div>
    <div className="opb-toggles">
      {index < visual.steps.length - 1 && <button type="button" onClick={() => setIndex(i => i + 1)}>{index === -1 ? 'Show first step' : 'Show next step'}</button>}
      {index >= 0 && <button type="button" onClick={() => setIndex(-1)}>Replay example</button>}
    </div>
  </figure>
}
export function OperationsVisual({ visual, onConsultRule }: { visual: OperationsVisualDefinition; onConsultRule?: () => void }) {
  if (visual.kind === 'groups') return <Groups />
  if (visual.kind === 'brackets') return <Brackets />
  if (visual.kind === 'fraction') return <FractionGroups />
  if (visual.kind === 'worked') return <Worked visual={visual} />
  if (visual.kind === 'expression') return <BidmasExpression math={visual.math} caption={visual.caption} context={visual.referenceContext} onConsult={onConsultRule} />
  return <div className="opb-stage opb-priority" aria-label="BIDMAS order of operations">
    <p className="opb-step-label">BIDMAS · four priority levels</p><ol>
    <li><b className="opb-priority__letters">B</b><div><strong>Brackets</strong><span>Use these rules inside each group.</span></div></li>
    <li><b className="opb-priority__letters">I</b><div><strong>Indices</strong><span>Calculate powers.</span></div></li>
    <li><b className="opb-priority__letters">D M</b><div><strong>Division & multiplication</strong><span>Equal priority: left to right.</span></div></li>
    <li><b className="opb-priority__letters">A S</b><div><strong>Addition & subtraction</strong><span>Equal priority: left to right.</span></div></li>
  </ol></div>
}
