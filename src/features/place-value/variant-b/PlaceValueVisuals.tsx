import { useState } from 'react'
import { getPlaceValueCells } from '../components/PlaceValueChart'
import type { PlaceLessonVisual, PlaceVisual } from './variantBLesson'

const format = (value: number) => value.toLocaleString('en-GB', { maximumFractionDigits: 8 })
export function NumberDisplay({ value, highlights = [], onSelect }: { value: string; highlights?: number[]; onSelect?: (index: number) => void }) {
  let digitIndex = -1
  return <div className={`pvb-number${onSelect ? ' pvb-number--interactive' : ''}`} role={onSelect ? 'group' : 'img'} aria-label={onSelect ? `Explore the digits in ${value}` : `${value}${highlights.length ? `; marked digit positions: ${highlights.map(i => i + 1).join(', ')}, counting digits from the left` : ''}`}>
    {[...value].map((character, i) => {
      if (!/\d/.test(character)) return <span key={i} className="pvb-number__separator" aria-hidden="true">{character}</span>
      const index = ++digitIndex
      const marked = highlights.includes(index)
      return onSelect ? <button key={i} type="button" aria-label={`Digit ${character}, position ${index + 1}`} aria-pressed={marked} onClick={() => onSelect(index)}>{character}</button>
        : <span key={i} aria-hidden="true" className={marked ? 'pvb-number__marked' : ''}>{character}</span>
    })}
  </div>
}
export function ColumnGuide({ value, index }: { value: string; index: number }) {
  const cells = getPlaceValueCells(value).filter(cell => !cell.decimalPoint)
  const start = Math.max(0, Math.min(index - 1, cells.length - 3))
  const nearby = cells.slice(start, start + 3)
  return <table className="pvb-columns">
    <caption className="sr-only">Nearby columns for the marked digit in {value}</caption>
    <thead><tr>{nearby.map(cell => <th scope="col" key={cell.digitIndex}><span>{cell.place}</span><small>{format(cell.unit)}</small></th>)}</tr></thead>
    <tbody><tr>{nearby.map(cell => <td key={cell.digitIndex} className={cell.digitIndex === index ? 'is-marked' : ''}>{cell.digit}</td>)}</tr></tbody>
  </table>
}
export function AlignedNumbers({ values, highlightPlace }: { values: string[]; highlightPlace?: number }) {
  const parts = values.map(value => value.replace(/,/g, '').split('.'))
  const wholeLength = Math.max(...parts.map(([whole]) => whole.length))
  const fractionLength = Math.max(...parts.map(([, fraction = '']) => fraction.length))
  const aligned = parts.map(([whole, fraction = '']) => `${whole.padStart(wholeLength, '0')}${fractionLength ? `.${fraction.padEnd(fractionLength, '0')}` : ''}`)
  const headerCells = getPlaceValueCells(aligned[0])
  return <table className="pvb-alignment">
    <caption className="sr-only">Numbers aligned in matching place-value columns</caption>
    <thead><tr>{headerCells.map((cell, i) => <th key={i} scope="col" aria-label={cell.decimalPoint ? 'Decimal point' : cell.place} className={cell.decimalPoint ? 'is-point' : ''}>{cell.decimalPoint ? '' : format(cell.unit)}</th>)}</tr></thead>
    <tbody>{aligned.map((value, row) => <tr key={row}>{[...value].map((char, col) => {
      const cell = headerCells[col]
      const marked = !cell.decimalPoint && highlightPlace !== undefined && cell.unit === 10 ** highlightPlace
      const appended = col > wholeLength + (parts[row][1]?.length ?? 0)
      return <td key={col} className={`${cell.decimalPoint ? 'is-point' : ''}${marked ? ' is-marked' : ''}${appended ? ' is-appended' : ''}`}>{char}</td>
    })}</tr>)}</tbody>
  </table>
}
function Explorer({ value, initialIndex }: { value: string; initialIndex: number }) {
  const [selected, setSelected] = useState(initialIndex)
  const cell = getPlaceValueCells(value).find(item => item.digitIndex === selected)!
  return <>
    <NumberDisplay value={value} highlights={[selected]} onSelect={setSelected} />
    <div className="pvb-readout" aria-live="polite"><span>{cell.place}</span><strong>{cell.digit} × {format(cell.unit)} = {format(Number(cell.digit) * cell.unit)}</strong></div>
  </>
}
function Zeroes() {
  const [filled, setFilled] = useState(false)
  return <>
    <p className="pvb-equation">5,000 + 70 + 0.4</p>
    <div aria-live="polite"><AlignedNumbers values={[filled ? '5,070.4' : '5,□7□.4']} /><p className="pvb-note">{filled ? 'The zeroes hold the hundreds and ones columns.' : 'Keep a column for each empty place.'}</p></div>
    <div className="pvb-demo-controls"><button type="button" onClick={() => setFilled(value => !value)}>{filled ? 'Explore again' : 'Fill the empty places'}</button></div>
  </>
}
function Equivalent() {
  const [value, setValue] = useState('3.4')
  return <div className="pvb-equivalent">
    <NumberDisplay value={value} highlights={[0, 1]} />
    <p className="pvb-equation" aria-live="polite">3 ones + 4 tenths</p>
    <div className="pvb-demo-controls" role="group" aria-label="Equivalent decimal forms">{['3.4', '3.40', '3.400'].map(form => <button type="button" key={form} aria-pressed={form === value} onClick={() => setValue(form)}>{form}</button>)}</div>
  </div>
}
export function PlaceVisualBody({ visual }: { visual: PlaceVisual }) {
  if (visual.kind === 'number') return <><NumberDisplay value={visual.value} highlights={visual.highlights} />{visual.guideIndex !== undefined && <ColumnGuide value={visual.value} index={visual.guideIndex} />}</>
  if (visual.kind === 'compare') return <div className="pvb-pair" role="img" aria-label={`Compare ${visual.values[0]} and ${visual.values[1]}`}><span>{visual.values[0]}</span><span className="pvb-pair__gap" aria-hidden="true">?</span><span>{visual.values[1]}</span></div>
  if (visual.kind === 'alignment') return <AlignedNumbers values={visual.values} highlightPlace={visual.highlightPlace} />
  if (visual.kind === 'parts') return <div className={`pvb-parts${visual.parts.some(part => part.length > 10) ? ' pvb-parts--words' : ''}`}>{visual.parts.map((part, i) => <span key={i}>{part}</span>)}</div>
  if (visual.kind === 'direction') return <div className="pvb-direction"><span>Smallest</span><span aria-hidden="true">→</span><span>Largest</span></div>
  return <ol className="pvb-summary"><li><strong>Read the place</strong><span>Digit × column unit = value.</span></li><li><strong>Keep each column</strong><span>Use zeroes to hold empty places.</span></li><li><strong>Align, then compare</strong><span>The first different place decides.</span></li></ol>
}
function Worked({ visual }: { visual: Extract<PlaceLessonVisual, { kind: 'worked' }> }) {
  const [step, setStep] = useState(-1)
  const current = visual.steps[step]
  return <>
    <div aria-live="polite" aria-atomic="true">
      <p className="pvb-step-label">{current ? `Step ${step + 1} of ${visual.steps.length}` : 'Worked example'}</p>
      <PlaceVisualBody visual={current?.visual ?? visual.initial} />
      <p className="pvb-instruction">{current?.instruction ?? 'Follow one step at a time.'}</p>
      {current?.equation && <p className="pvb-equation">{current.equation}</p>}
    </div>
    <div className="pvb-demo-controls">
      {step < visual.steps.length - 1 && <button type="button" onClick={() => setStep(i => i + 1)}>{step === -1 ? 'Show first step' : 'Show next step'}</button>}
      {step >= 0 && <button type="button" onClick={() => setStep(-1)}>Replay example</button>}
    </div>
  </>
}
export function PlaceValueVisual({ visual }: { visual: PlaceLessonVisual }) {
  if (visual.kind === 'explore') return <Explorer value={visual.value} initialIndex={visual.initialIndex} />
  if (visual.kind === 'zeroes') return <Zeroes />
  if (visual.kind === 'equivalent') return <Equivalent />
  if (visual.kind === 'worked') return <Worked visual={visual} />
  return <PlaceVisualBody visual={visual} />
}
