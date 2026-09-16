import { useState } from 'react'
import type { IntegerValueVisualDefinition } from '../types'

type ConceptProps = Extract<IntegerValueVisualDefinition['props'], { kind: 'concept' }> & { revealed: boolean }

function CounterGrid({ total, columns, capacity = total }: { total: number; columns: number; capacity?: number }) {
  return <div className="d-concept-array" style={{ '--d-array-columns': columns } as React.CSSProperties} aria-hidden="true">
    {Array.from({ length: capacity }, (_, index) => <span className={index < total ? '' : 'is-empty'} key={index} />)}
  </div>
}

function Tabs({ options, active, onChange, label }: { options: string[]; active: number; onChange: (index: number) => void; label: string }) {
  return <div className="d-presets" role="group" aria-label={label}>{options.map((option, index) => <button type="button" aria-pressed={active === index} key={option} onClick={() => onChange(index)}>{option}</button>)}</div>
}

function ChipRow({ values, common = [] }: { values: number[]; common?: number[] }) {
  return <div className="d-chip-row">{values.map(value => <span className={common.includes(value) ? 'is-common' : ''} key={value}>{value}</span>)}</div>
}

function ConceptLines({ lines }: { lines: string[] }) {
  return <div className="d-concept-lines">{lines.map(line => <p className="d-concept-result" key={line}>{line}</p>)}</div>
}

function SquareArrays() {
  const [index, setIndex] = useState(0)
  const total = index === 0 ? 9 : 8
  return <>
    <Tabs options={['9 counters', '8 counters']} active={index} onChange={setIndex} label="Choose a number of counters" />
    <div className="d-concept-centre"><CounterGrid total={total} columns={3} capacity={9} /></div>
    <p className="d-concept-result">{total === 9 ? '3 × 3 = 9. 9 is a square number.' : '8 cannot be made by multiplying a whole number by itself.'}</p>
  </>
}

function CubeLayers() {
  const [layers, setLayers] = useState(1)
  return <>
    <div className="d-cube-stack" aria-label={`${layers} of 2 layers, with 4 cubes in each layer`}>
      {Array.from({ length: 2 }, (_, layer) => <div className={`d-cube-layer${layer < layers ? ' is-filled' : ''}`} key={layer}><CounterGrid total={layer < layers ? 4 : 0} columns={2} capacity={4} /></div>)}
    </div>
    <p className="d-concept-result">{layers === 1 ? 'One 2 × 2 layer' : '2 × 2 × 2 = 8. 8 is a cube number.'}</p>
    <button className="d-demo-action" type="button" onClick={() => setLayers(layers === 2 ? 1 : 2)}>{layers === 2 ? 'Remove the second layer' : 'Add the second layer'}</button>
  </>
}

function FractionDecimal() {
  const [step, setStep] = useState(0)
  return <>
    <div className="d-fraction-strip" aria-label="Five of eight equal parts shaded">{Array.from({ length: 8 }, (_, index) => <span className={index < 5 ? 'is-filled' : ''} key={index} />)}</div>
    <p className="d-concept-result">{step === 0 ? '5 of 8 equal parts = 5/8' : step === 1 ? 'The fraction bar means divide: 5 ÷ 8' : '5/8 = 5 ÷ 8 = 0.625 → rational'}</p>
    <button className="d-demo-action" type="button" onClick={() => setStep(step === 2 ? 0 : step + 1)}>{step === 2 ? 'Replay' : step === 0 ? 'Turn it into division' : 'Show the decimal'}</button>
  </>
}

function RationalForms() {
  const [index, setIndex] = useState(0)
  const examples = [
    { tab: '1/3', value: '1/3 = 0.333333…', note: 'The 3 repeats forever, but 1/3 is an exact fraction.' },
    { tab: '4', value: '4 = 4/1', note: 'Every integer can be written over 1.' },
    { tab: '−2', value: '−2 = −2/1', note: 'Negative integers are rational too.' },
  ]
  const example = examples[index]
  return <>
    <Tabs options={examples.map(item => item.tab)} active={index} onChange={setIndex} label="Choose a rational-number form" />
    <div className="d-concept-expression">{example.value}</div>
    <p className="d-concept-result">{example.note}</p>
  </>
}

function RootJourney() {
  const [step, setStep] = useState(0)
  const lines = step === 0
    ? ['4 squared is 16.', '5 squared is 25.']
    : step === 1
      ? ['√20 = 4.472…', 'Therefore, √20 is between 4 and 5.']
      : ['√20 = 4.47213595…', 'The decimal does not stop.', 'The decimal does not repeat.']
  return <>
    <div className="d-root-squares" aria-label="Compare square areas 16, 20 and 25"><span>4²<br /><strong>16</strong></span><span className="is-middle">20</span><span>5²<br /><strong>25</strong></span></div>
    {step >= 1 && <div className="d-root-line" aria-label="Square root of 20 lies between 4 and 5"><span>4</span><i><b style={{ left: `${(Math.sqrt(20) - 4) * 100}%` }}>√20</b></i><span>5</span></div>}
    <ConceptLines lines={lines} />
    <button className="d-demo-action" type="button" onClick={() => setStep(step === 2 ? 0 : step + 1)}>{step === 2 ? 'Replay' : step === 0 ? 'Place the root' : 'Reveal more digits'}</button>
  </>
}

function RootCompare() {
  const [index, setIndex] = useState(0)
  const exact = index === 0
  return <>
    <Tabs options={['√16', '√20']} active={index} onChange={setIndex} label="Compare exact and non-exact roots" />
    <div className="d-concept-expression">{exact ? '√16 = 4' : '√20 = 4.47213595…'}</div>
    <p className="d-concept-result">{exact ? '16 is a square number, so the root is exact and rational.' : '20 is not a square number. The decimal never terminates or repeats, so it is irrational.'}</p>
  </>
}

function SurdSimplify() {
  const [step, setStep] = useState(0)
  const lines = ['45 = 9 × 5', '√45 = √9 × √5', '√45 = 3√5']
  return <>
    <div className="d-surd-steps">{lines.slice(0, step + 1).map(line => <span key={line}>{line}</span>)}</div>
    {step < 2
      ? <ConceptLines lines={['Take out the square factor.']} />
      : <ConceptLines lines={['3 is a non-zero rational number.', '√5 is an irrational number.', 'Therefore, 3√5 is irrational.', 'Zero is an exception.', '0 × √5 = 0', '0 is rational.']} />}
    <button className="d-demo-action" type="button" onClick={() => setStep(step === 2 ? 0 : step + 1)}>{step === 2 ? 'Replay' : 'Show the next step'}</button>
  </>
}

function MultipleHops() {
  const [count, setCount] = useState(1)
  const values = [6, 12, 18, 24, 30]
  return <>
    <div className="d-hop-line" aria-label={`Multiples shown: ${values.slice(0, count).join(', ')}`}><span>0</span>{values.map((value, index) => <span className={index < count ? 'is-active' : ''} key={value}>{value}</span>)}</div>
    <ConceptLines lines={[
      ...values.slice(0, count).map((value, index) => `6 × ${index + 1} = ${value}`),
      ...(count === values.length ? ['The first five positive multiples of 6 are:', '6, 12, 18, 24, 30'] : []),
    ]} />
    <button className="d-demo-action" type="button" onClick={() => setCount(count === values.length ? 1 : count + 1)}>{count === values.length ? 'Start again' : 'Add another +6 hop'}</button>
  </>
}

function FactorRectangles() {
  const pairs: Array<[number, number]> = [[1, 24], [2, 12], [3, 8], [4, 6]]
  const [index, setIndex] = useState(3)
  const [rows, columns] = pairs[index]
  return <>
    <Tabs options={pairs.map(([a, b]) => `${a} × ${b}`)} active={index} onChange={setIndex} label="Choose a factor-pair rectangle" />
    <div className="d-concept-centre"><CounterGrid total={24} columns={columns} /></div>
    <p className="d-concept-result">{rows} {rows === 1 ? 'row' : 'rows'} × {columns} {columns === 1 ? 'column' : 'columns'} = 24. Both {rows} and {columns} are factors.</p>
  </>
}

function HcfCompare() {
  const common = [1, 2, 3, 6]
  return <div className="d-set-compare">
    <section><strong>Factors of 12</strong><ChipRow values={[1, 2, 3, 4, 6, 12]} common={common} /></section>
    <section><strong>Factors of 18</strong><ChipRow values={[1, 2, 3, 6, 9, 18]} common={common} /></section>
    <p className="d-concept-result">Common: 1, 2, 3, 6 → highest common factor = 6</p>
  </div>
}

function LcmCompare() {
  return <div className="d-set-compare">
    <section><strong>Multiples of 8</strong><ChipRow values={[8, 16, 24, 32]} common={[24]} /></section>
    <section><strong>Multiples of 12</strong><ChipRow values={[12, 24, 36]} common={[24]} /></section>
    <p className="d-concept-result">The first shared landing point is 24 → LCM = 24</p>
  </div>
}

function MathCard({ expression, caption, revealLines, revealed }: Extract<ConceptProps, { concept: 'mathCard' }>) {
  return <>
    <div className="d-concept-expression">{expression}</div>
    {caption && <p className="d-concept-caption">{caption}</p>}
    {revealed && revealLines?.map(line => <p className="d-concept-result" key={line}>{line}</p>)}
  </>
}

function RootInterval({ radicand, lower, upper, decimal, revealed }: Extract<ConceptProps, { concept: 'rootInterval' }>) {
  const position = (Math.sqrt(radicand) - lower) / (upper - lower) * 100
  return <>
    <div className="d-concept-expression">√{radicand}</div>
    <div className="d-root-line" aria-label={`Square root of ${radicand} lies between ${lower} and ${upper}`}><span>{lower}</span><i>{revealed && <b style={{ left: `${position}%` }}>√{radicand}</b>}</i><span>{upper}</span></div>
    {revealed && <ConceptLines lines={[
      `${lower}² = ${lower ** 2}`,
      `${upper}² = ${upper ** 2}`,
      `${radicand} is between ${lower ** 2} and ${upper ** 2}.`,
      `Therefore, √${radicand} is between ${lower} and ${upper}.`,
      ...(decimal ? [`√${radicand} = ${decimal}`, 'The decimal does not stop or repeat.', `Therefore, √${radicand} is irrational.`] : []),
    ]} />}
  </>
}

export function VariantDConceptVisual(props: ConceptProps) {
  let content: React.ReactNode
  switch (props.concept) {
    case 'squareArrays': content = <SquareArrays />; break
    case 'cubeLayers': content = <CubeLayers />; break
    case 'fractionDecimal': content = <FractionDecimal />; break
    case 'rationalForms': content = <RationalForms />; break
    case 'rootJourney': content = <RootJourney />; break
    case 'rootCompare': content = <RootCompare />; break
    case 'surdSimplify': content = <SurdSimplify />; break
    case 'multipleHops': content = <MultipleHops />; break
    case 'factorRectangles': content = <FactorRectangles />; break
    case 'hcfCompare': content = <HcfCompare />; break
    case 'lcmCompare': content = <LcmCompare />; break
    case 'mathCard': content = <MathCard {...props} />; break
    case 'rootInterval': content = <RootInterval {...props} />; break
  }
  return <figure className={`d-stage d-concept d-concept--${props.concept}`}>{content}</figure>
}
