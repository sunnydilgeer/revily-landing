'use client'

import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { Working } from '../../maths/step-chain/working'
import type { ChainStep } from '../../maths/step-chain/StepChain'
import { PictureStep } from '../../written-methods/tutor/NumberSenseWorkedExample'
import type { MethodStep } from '../../written-methods/tutor/methodWorking'
import { columnValue, placeDigits, type PlaceChart, type PlaceLine, type PlaceWorking } from './placeWorking'
import '../../written-methods/tutor/NumberSenseLesson.css'

/** The place-value chart: column values on top (when labelled), each digit underneath, the point in its own column. */
function Chart({ chart }: { chart: PlaceChart }) {
  const digits = placeDigits(chart.value)
  const shown = (i: number) => !chart.building || chart.placed?.includes(i)
  const spoken = digits.map((d, i) => shown(i) ? `${d.digit} in the ${columnValue(d.power)} column` : `${columnValue(d.power)} column empty`).join(', ')
  const cells = digits.flatMap((d, i) => [
    ...(d.power === -1 ? [{ point: true, i: -1, d }] : []),
    { point: false, i, d },
  ])
  return <table className={`pv-chart${chart.answer ? ' is-answer' : ''}`} aria-label={`Place-value chart: ${spoken}${chart.answer ? `. The answer: ${chart.value}` : ''}`}>
    {chart.labels && <thead><tr>{cells.map(({ point, i, d }) => point ? <th key="point" aria-hidden="true" /> : <th key={i} scope="col" className={i === chart.boxed ? 'is-f0 is-on' : ''}>{columnValue(d.power)}</th>)}</tr></thead>}
    <tbody><tr>{cells.map(({ point, i, d }) => point
      ? <td key="point" className="pv-chart__point">.</td>
      : <td key={i} className={[i === chart.boxed && 'is-boxed', chart.zeros?.includes(i) && 'is-zero', chart.building && !shown(i) && 'is-empty'].filter(Boolean).join(' ')}>{shown(i) ? d.digit : ''}</td>)}</tr></tbody>
  </table>
}

function Lines({ lines }: { lines: PlaceLine[] }) {
  return <ul className="ns-term-groups pv-lines" aria-label={lines.map(line => `${line.parts.map(part => part.text).join(' ')}${line.result ? ` gives ${line.result}` : ''}`).join('. ')}>
    {lines.map((line, i) => <li key={i} aria-hidden="true">
      <span className="pv-lines__parts">{line.parts.map((part, j) => <span key={j} className={part.family !== undefined ? `is-f${part.family}` : undefined}>{part.text}</span>)}</span>
      {line.result !== undefined && <><span>{line.answer ? '=' : '→'}</span><strong className={line.answer ? 'pv-answer' : undefined}>{line.result}</strong></>}
    </li>)}
  </ul>
}

/**
 * A place-value working, one move a step (src/features/EXPLANATIONS.md): the plain number first, then the step's heading
 * under the chart and above the lines it adds. The last move's result is the green answer; nothing repeats it.
 */
export function PlaceWorkingExample({ working }: { working: PlaceWorking }) {
  const chain: ChainStep[] = [{ line: 'question' }, ...working.steps.map(step => ({ line: step.title, op: step.title, why: step.instruction }))]
  const given = working.given && <p className="pv-given">{working.given.join(', ')}</p>
  const picture = (revealed: number) => {
    const step = working.steps[revealed - 2]
    if (!step) return <div className="ns-visual pv-working">{given}<Chart chart={working.opening} /></div>
    return <div className="ns-visual pv-working" key={revealed}>
      <PictureStep step={{ title: step.title, instruction: step.instruction, operation: '', equation: '', frame: {} } as MethodStep}>{heading => <>
        {given}
        <Chart chart={step.chart} />
        <Working>
          {heading}
          {step.lines && <Lines lines={step.lines} />}
          {step.words && <p className="pv-answer pv-words">{step.words}</p>}
        </Working>
      </>}</PictureStep>
    </div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly />
}

