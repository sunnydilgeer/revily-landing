'use client'
import { useState, type CSSProperties } from 'react'
import type { Diagram, MethodVisual as Visual } from './model'

export function MethodVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'worked') return <Worked visual={visual} />
  if (visual.kind === 'groups') return <Groups />
  if (visual.kind === 'exchange') return <Exchange />
  if (visual.kind === 'area') return <Area />
  if (visual.kind === 'scale') return <Scale />
  return <StaticDiagram diagram={visual} />
}
function StaticDiagram({ diagram }: { diagram: Diagram }) {
  if (diagram.kind === 'text') return <div className="wm-statements">{diagram.lines.map((line, i) => <p key={i}>{line}</p>)}</div>
  if (diagram.kind === 'division') {
    const quotient = (diagram.quotient ?? '').padEnd(diagram.dividend.length, ' ')
    return <div className="wm-bus" role="img" aria-label={`${diagram.dividend} divided by ${diagram.divisor}. Quotient so far: ${quotient.trim() || 'not shown'}.${diagram.carry ? ` Carry ${diagram.carry.value} beside digit ${diagram.carry.index + 1}.` : ''}`} style={{ '--digits': diagram.dividend.length } as CSSProperties}>
      <span className="wm-bus__quotient" aria-hidden="true">{Array.from(quotient).map((digit, i) => <b key={i}>{digit.trim() || '\u00a0'}</b>)}</span>
      <span className="wm-bus__divisor" aria-hidden="true">{diagram.divisor}</span>
      <span className="wm-bus__dividend" aria-hidden="true">{Array.from(diagram.dividend).map((digit, i) => <b className={diagram.active === i ? 'is-active' : ''} key={i}>{diagram.carry?.index === i && <sup>{diagram.carry.value}</sup>}{digit}</b>)}</span>
    </div>
  }
  const width = Math.max(diagram.top.length + diagram.bottom.length, 4)
  const row = (value: string, label: string, prefix = '') => <div className="wm-column-row" role="group" aria-label={`${label}: ${value}`}><span aria-hidden="true">{prefix}</span>{Array.from(value.padStart(width, ' ')).map((digit, i) => <b key={i} aria-hidden="true">{digit.trim() || '\u00a0'}</b>)}</div>
  return <div className="wm-column" style={{ '--digits': width } as CSSProperties}>
    <div className="wm-column-carry" role="group" aria-label={diagram.carry ? `Carry ${diagram.carry.value} into the ${['ones', 'tens', 'hundreds', 'thousands'][diagram.carry.column]} column` : undefined}><span />{Array.from({ length: width }, (_, i) => <small key={i}>{diagram.carry && i === width - 1 - diagram.carry.column ? diagram.carry.value : '\u00a0'}</small>)}</div>
    {row(diagram.top, 'Top number')}{row(diagram.bottom, 'Bottom number', '×')}<hr />
    {diagram.ones && row(diagram.ones, 'Ones partial product')}
    {diagram.tens && row(diagram.tens, 'Tens partial product', '+')}
    {diagram.total && <><hr />{row(diagram.total, 'Total')}</>}
  </div>
}
function Worked({ visual }: { visual: Extract<Visual, { kind: 'worked' }> }) {
  const [step, setStep] = useState(0)
  const frame = step ? visual.steps[step - 1] : undefined
  return <div className="wm-worked">
    <p className="wm-step-label">{step ? `Step ${step} of ${visual.steps.length}` : 'Worked example'}</p>
    <StaticDiagram diagram={frame?.diagram ?? visual.initial} />
    <p className="wm-narration" aria-live="polite">{frame?.text ?? 'Reveal one step at a time.'}</p>
    <div className="wm-controls"><button type="button" disabled={!step} onClick={() => setStep(step - 1)}>Previous</button><button type="button" disabled={step === visual.steps.length} onClick={() => setStep(step + 1)}>Next step</button><button type="button" disabled={!step} onClick={() => setStep(0)}>Replay</button></div>
  </div>
}
function Counters({ count }: { count: number }) { return <span className="wm-counters" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} />)}</span> }
function Groups() {
  const [size, setSize] = useState(3), [count, setCount] = useState(0)
  const left = 14 - size * count
  return <div><div className="wm-controls" aria-label="Group size">{[3, 4].map(n => <button key={n} type="button" aria-pressed={size === n} onClick={() => { setSize(n); setCount(0) }}>Groups of {n}</button>)}</div>
    <div className="wm-groups" aria-label={`${count} groups of ${size}`}>{Array.from({ length: count }, (_, i) => <span className="wm-group" key={i}><Counters count={size} /></span>)}</div>
    <div className="wm-leftovers"><Counters count={left} /></div>
    <p className="wm-narration" aria-live="polite">{count} whole {count === 1 ? 'group' : 'groups'} · {left} left{left < size ? ` over. 14 ÷ ${size} = ${count} remainder ${left}.` : '.'}</p>
    <div className="wm-controls"><button type="button" disabled={left < size} onClick={() => setCount(count + 1)}>Make a group</button><button type="button" disabled={!count} onClick={() => setCount(count - 1)}>Undo group</button></div>
  </div>
}
function Exchange() {
  const [exchanged, setExchanged] = useState(false)
  return <div><div className="wm-exchange"><div><span>{exchanged ? '6 tens' : '7 tens'}</span><div className="wm-rods" aria-hidden="true">{Array.from({ length: exchanged ? 6 : 7 }, (_, i) => <i key={i} />)}</div></div><div><span>{exchanged ? '12 ones' : '2 ones'}</span><Counters count={exchanged ? 12 : 2} /></div></div>
    <p className="wm-narration" aria-live="polite">{exchanged ? '60 + 12 = 72. The total stays the same.' : '70 + 2 = 72.'}</p><div className="wm-controls"><button type="button" onClick={() => setExchanged(!exchanged)}>{exchanged ? 'Put the ten back' : 'Exchange one ten'}</button></div></div>
}
function Area() {
  const [part, setPart] = useState<10 | 2 | null>(null)
  return <div><p className="wm-step-label">14 rows × 12 columns</p><div className="wm-area"><button type="button" aria-label="10 columns 14 × 10" aria-pressed={part === 10} onClick={() => setPart(10)}>10<span className="wm-area-unit"> columns</span><span className="wm-area-product">14 × 10</span></button><button type="button" aria-label="2 columns 14 × 2" aria-pressed={part === 2} onClick={() => setPart(2)}>2<span className="wm-area-unit"> columns</span><span className="wm-area-product">14 × 2</span></button></div>
    <p className="wm-narration" aria-live="polite">{part ? `14 × ${part} = ${14 * part}. ${part === 10 ? 'The large part contains 140 squares.' : 'The small part contains 28 squares.'}` : 'Select a part of the rectangle.'}</p>
    {part && <p className="wm-narration">14 × 12 = 140 + 28 = 168</p>}
  </div>
}
function Scale() {
  const [first, setFirst] = useState(false), [second, setSecond] = useState(false)
  return <div><p className="wm-step-label">Start with 12 × 3 = 36</p><div className="wm-controls"><button type="button" aria-pressed={first} onClick={() => setFirst(!first)}>First factor ×10</button><button type="button" aria-pressed={second} onClick={() => setSecond(!second)}>Second factor ×10</button></div>
    <div className="wm-scale" aria-live="polite"><strong>{first ? 120 : 12} × {second ? 30 : 3} = {36 * (first ? 10 : 1) * (second ? 10 : 1)}</strong><p>{first && second ? 'Both factors ×10 → product ×100' : first || second ? 'One factor ×10 → product ×10' : 'Original factors → original product'}</p></div></div>
}
