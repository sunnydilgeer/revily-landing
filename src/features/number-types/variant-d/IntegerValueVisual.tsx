import { useState } from 'react'
import type { IntegerValueVisualDefinition } from '../types'
import { VariantDConceptVisual } from './VariantDConceptVisual'
import './VariantD.css'

type Props = IntegerValueVisualDefinition['props'] & { revealed: boolean; answerValue?: number }
const signed = (n: number) => n < 0 ? `−${-n}` : String(n)
export function MathValue({ label }: { label: string }) {
  const fraction = label.match(/^(\d+)\/(\d+)$/)
  return fraction ? <span className="d-fraction" aria-label={`${fraction[1]} divided by ${fraction[2]}`}><span>{fraction[1]}</span><span>{fraction[2]}</span></span> : <span>{label}</span>
}
function Line({ min, max, point, label, insetLabel = false }: { min: number; max: number; point?: number; label?: string; insetLabel?: boolean }) {
  return <div className="d-line" role="img" aria-label={`Number line from ${signed(min)} to ${signed(max)}${point === undefined ? '' : `; ${label ?? signed(point)} ${Number.isInteger(point) ? 'on an integer tick' : `between ${Math.floor(point)} and ${Math.ceil(point)}`}`}`}>
    <div className="d-line__rail" />
    {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(t => <span className="d-line__tick" key={t} style={{ left: `${(t - min) / (max - min) * 100}%` }}><i /><b>{signed(t)}</b></span>)}
    {point !== undefined && <span className="d-line__point" style={{ left: `${(point - min) / (max - min) * 100}%` }}><b style={insetLabel ? { transform: `translateX(${(point - min) / (max - min) < 0.2 ? 50 : (point - min) / (max - min) > 0.8 ? -50 : 0}%)` } : undefined}>{label ?? signed(point)}</b><i /></span>}
  </div>
}
function Worked({ root = false }: { root?: boolean }) {
  const [step, setStep] = useState(0)
  const [irrational, setIrrational] = useState(false)
  const expression = root ? irrational ? '√11' : '√49' : '12/4'
  const value = root ? irrational ? Math.sqrt(11) : 7 : 3
  const evidence = root ? irrational ? '√11 = 3.316…' : '7 × 7 = 49, so √49 = 7' : '12 ÷ 4 = 3'
  return <>
    {root && <div className="d-presets" role="group" aria-label="Choose a worked square root">{[false, true].map(mode => <button type="button" aria-pressed={irrational === mode} key={String(mode)} onClick={() => { setIrrational(mode); setStep(0) }}>{mode ? '√11' : '√49'}</button>)}</div>}
    <div className="d-expression"><MathValue label={expression} /></div>
    <div className="d-worked__reveal" aria-live="polite">
      {step === 0 ? <p>{root ? 'Which number squared gives this value?' : 'The fraction bar means divide.'}</p> : <><p className="d-equation">{evidence}</p>{root && irrational && <p className="d-equation">3 squared is 9. 4 squared is 16.</p>}</>}
      {step === 2 && <><Line min={root ? irrational ? 3 : 5 : 1} max={root ? irrational ? 4 : 9 : 5} point={value} label={root && irrational ? '√11' : String(value)} /><p className="d-conclusion">{irrational && root ? '√11 is between 3 and 4, so it is a non-integer.' : `${expression} = ${value} → integer`}</p></>}
    </div>
    <button className="d-demo-action" type="button" onClick={() => setStep(step === 2 ? 0 : step + 1)}>{step === 2 ? 'Replay example' : step === 0 ? root ? 'Show the squares' : 'Show the division' : 'Place it on the line'}</button>
  </>
}
export function IntegerValueVisual(props: Props) {
  const [position, setPosition] = useState(2)
  const [form, setForm] = useState('2')
  if (props.kind === 'concept') return <VariantDConceptVisual {...props} />
  if (props.kind === 'challenge') return null
  return <figure className="d-stage">
    {props.kind === 'explorer' && <>
      <div className="d-readout" aria-live="polite"><strong>{signed(position)}</strong><span>{Number.isInteger(position) ? 'Integer · on a tick' : 'Non-integer · between ticks'}</span></div>
      <Line min={-3} max={3} point={position} />
      <label className="sr-only" htmlFor="d-point">Move the point</label><input id="d-point" className="d-slider" type="range" min={-3} max={3} step={0.5} value={position} aria-valuetext={`${signed(position)}, ${Number.isInteger(position) ? 'integer' : 'non-integer'}`} onChange={event => setPosition(Number(event.target.value))} />
      <div className="d-presets" role="group" aria-label="Try these values">{[2, 2.5, 0, -2].map(value => <button type="button" key={value} aria-pressed={position === value} onClick={() => setPosition(value)}>{signed(value)}</button>)}</div>
    </>}
    {props.kind === 'classify' && <>{props.resolution && <p className="d-equation">{props.resolution}</p>}<Line min={props.min} max={props.max} point={props.value} label={props.expression.includes('/') ? String(props.value) : props.expression} /></>}
    {props.kind === 'fractionWorked' && <Worked />}
    {props.kind === 'rootsWorked' && <Worked root />}
    {props.kind === 'fractionValue' && <><div className="d-expression"><MathValue label="20/5" /></div>{props.revealed && <p className="d-equation">20 ÷ 5 = 4</p>}</>}
    {props.kind === 'equivalentForms' && <><div className="d-presets" role="group" aria-label="Three ways to write two">{['2', '2.0', '4/2'].map(value => <button type="button" aria-pressed={form === value} key={value} onClick={() => setForm(value)}><MathValue label={value} /></button>)}</div><p className="d-equation"><MathValue label={form} /> = 2</p><Line min={0} max={4} point={2} /><figcaption>Different forms. The same position.</figcaption></>}
    {props.kind === 'squareEquation' && <><div className="d-expression">√n = 6</div>{props.revealed && <p className="d-equation">n = 6 × 6 = 36</p>}</>}
    {props.kind === 'openInterval' && <><Line min={6} max={7} insetLabel point={props.revealed ? props.answerValue ?? 6.5 : undefined} label={props.answerValue === undefined ? '6.5' : Number.isInteger(props.answerValue * 10000) ? String(props.answerValue) : 'Your value'} /><figcaption>{props.revealed ? props.answerValue === undefined ? 'One example: 6 < 6.5 < 7' : 'Your value is inside the interval.' : 'Choose a value inside the interval.'}</figcaption></>}
    {props.kind === 'midpointClaim' && <><blockquote className="d-claim"><span>Maya says</span>“The number exactly halfway between two integers is always a non-integer.”</blockquote>{props.revealed && <><p className="d-equation">(2 + 8) ÷ 2 = 5</p><Line min={2} max={8} point={5} /></>}</>}
    {props.kind === 'rootCheck' && <><div className="d-expression">√{props.radicand}</div>{props.revealed && <>{props.radicand === 81
      ? <p className="d-equation">9 × 9 = 81 → √81 = 9</p>
      : <><p className="d-equation">√20 = 4.472…</p><p className="d-equation">4 squared is 16. 5 squared is 25.</p><p className="d-equation">√20 is between 4 and 5.</p></>}
      <Line min={props.lower} max={props.upper} point={Math.sqrt(props.radicand)} label={props.radicand === 81 ? '9' : '√20'} /></>}</>}
  </figure>
}
