'use client'

import { useId, useState, type CSSProperties } from 'react'
import { MathSpan } from '../../../../components/MathText'
import { methodProgress, type MethodExample, type MethodFrame, type MethodStep, type MethodWorking } from './methodWorking'

function Equation({ math, operation }: { math: string; operation?: string }) {
  if (operation && math.startsWith(operation)) math = `\\underline{${operation}}${math.slice(operation.length)}`
  const parts = math.split('=')
  return parts.length === 2 ? <div className="wms-equation"><MathSpan latex={parts[0]} /><span>= <MathSpan latex={parts[1]} /></span></div> : <MathSpan latex={math} />
}

function Column({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const width = String(example.first * example.second).length
  const places = Math.max(width, String(example.first).length, String(example.second).length)
  const focus = step?.focus && 'factorPlace' in step.focus ? step.focus : undefined
  const row = (number: string, label: string, symbol = '', activePlace?: number) => <div className="wms-number-row" role="group" aria-label={`${label}: ${number.trim() || 'not yet written'}`}>
    <span aria-hidden="true">{symbol}</span>{[...number.padStart(places, ' ')].map((digit, i) => <span aria-hidden="true" className={places - i - 1 === activePlace ? 'wms-digit--current' : ''} key={i}>{digit === ' ' ? '\u00a0' : digit}</span>)}
  </div>
  const carry = (kind: 'ones' | 'tens' | 'sum') => frame.carry?.row === kind ? <div className="wms-carry-row" role="group" aria-label={`Carried over: ${frame.carry.value}`}><span aria-hidden="true" />{Array.from({ length: places }, (_, i) => <span aria-hidden="true" key={i}>{places - i - 1 === frame.carry.place ? frame.carry.value : '\u00a0'}</span>)}</div> : null
  return <div className="wms-column" style={{ '--places': places } as CSSProperties}>
    <div className="wms-place-row" aria-label="Place-value columns"><span />{Array.from({ length: places }, (_, i) => <span key={i}>{['U', 'T', 'H', 'Th', 'TTh'][places - i - 1]}</span>)}</div>
    {row(String(example.first), 'Top number', '', focus?.topPlace)}
    {row(String(example.second), 'Multiplier', '×', focus?.factorPlace)}
    <div className="wms-rule" />
    {carry('ones')}{frame.ones !== undefined && row(frame.ones, 'Units partial product')}
    {carry('tens')}{frame.tens !== undefined && row(frame.tens, 'Tens partial product', '+')}
    {frame.total !== undefined && <>{carry('sum')}<div className="wms-rule" />{row(frame.total, 'Sum')}</>}
  </div>
}

function Grid({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const grid = example.grid!
  const focus = step?.focus && 'cell' in step.focus ? step.focus.cell : undefined
  return <div><table className="wmt-grid wms-grid" aria-label="Multiplication grid"><thead><tr><th scope="col">×</th>{grid.second.map(n => <th scope="col" key={n}>{n}</th>)}</tr></thead><tbody>{grid.first.map((n, i) => <tr key={n}><th scope="row">{n}</th>{grid.second.map((m, j) => <td key={m} className={focus === `${i}-${j}` ? 'wms-cell--current' : ''} aria-label={`${n} times ${m}: ${frame.cells?.[`${i}-${j}`] ?? 'not yet written'}`}>{frame.cells?.[`${i}-${j}`] ?? <span className="wms-empty">·</span>}</td>)}</tr>)}</tbody></table>{frame.total !== undefined && <p className="wms-grid-answer">{example.first} × {example.second} = {Number(frame.total).toLocaleString('en-GB')}</p>}</div>
}

function Division({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const digits = String(example.first)
  const quotient = (frame.quotient ?? '').padEnd(digits.length, ' ')
  const focus = step?.focus && 'dividendIndex' in step.focus ? step.focus.dividendIndex : undefined
  return <div className="wms-division" style={{ '--places': digits.length } as CSSProperties}>
    <div className="wms-division-places"><span />{[...digits].map((_, i) => <span key={i}>{['U', 'T', 'H', 'Th'][digits.length - i - 1]}</span>)}</div>
    <div className="wms-quotient" aria-label={`Quotient so far: ${quotient.trim() || 'not yet written'}`}><span />{[...quotient].map((d, i) => <span key={i}>{d === ' ' ? '\u00a0' : d}</span>)}</div>
    <div className="wms-dividend"><span aria-label={`Divisor ${example.second}`}>{example.second}</span><div aria-label={`Dividend ${example.first}`}>{[...digits].map((d, i) => <span className={i === focus ? 'wms-digit--current' : ''} key={i}>{frame.divisionCarry?.index === i && <sup>{frame.divisionCarry.value}</sup>}{d}</span>)}</div></div>
    {frame.remainder !== undefined && <p className="wms-remainder">Remainder {frame.remainder}</p>}
  </div>
}

function LongDivision({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const digits = String(example.first), quotient = (frame.quotient ?? '').padEnd(digits.length, ' ')
  const focus = step?.focus && 'dividendIndex' in step.focus ? step.focus : undefined
  return <div className="wms-division wms-long-division" style={{ '--places': digits.length } as CSSProperties}>
    <div className="wms-division-places"><span />{[...digits].map((_, i) => <span key={i}>{['U', 'T', 'H', 'Th'][digits.length - i - 1]}</span>)}</div>
    <div className="wms-quotient" aria-label={`Quotient so far: ${quotient.trim() || 'not yet written'}`}><span />{[...quotient].map((d, i) => <span key={i}>{d === ' ' ? '\u00a0' : d}</span>)}</div>
    <div className="wms-dividend"><span aria-label={`Divisor ${example.second}`}>{example.second}</span><div aria-label={`Dividend ${example.first}`}>{[...digits].map((d, i) => <span className={focus && i >= (focus.dividendStart ?? focus.dividendIndex) && i <= focus.dividendIndex ? 'wms-digit--current' : ''} key={i}>{d}</span>)}</div></div>
    {frame.longRows?.map((row, index) => {
      const start = row.end - row.number.length + 1
      return <div className="wms-long-row" key={index} role="group" aria-label={`${row.kind === 'subtract' ? 'Subtract' : row.kind === 'bring-down' ? 'Bring down to make' : 'Difference'} ${row.number}`}>
        <span aria-hidden="true">{row.kind === 'subtract' ? '−' : '\u00a0'}</span>{[...digits].map((_, i) => <span aria-hidden="true" className={`${row.kind === 'subtract' && i >= start && i <= row.end ? 'wms-subtraction-digit' : ''}${row.kind === 'bring-down' && i === row.end ? ' wms-brought-digit' : ''}`} key={i}>{i >= start && i <= row.end ? row.number[i - start] : '\u00a0'}</span>)}
      </div>
    })}
    {frame.remainder !== undefined && <p className="wms-remainder">Remainder {frame.remainder}</p>}
  </div>
}

function DecimalWorking({ frame }: { frame: MethodFrame }) {
  return <div className="wms-decimal" role="img" aria-label={`${frame.decimalRows?.join('; ') ?? 'Decimal calculation'}${frame.decimalResult ? `; result ${frame.decimalResult}` : ''}`}>
    <div className="wms-decimal-rows" aria-hidden="true">{frame.decimalRows?.map((row, index) => <span key={`${row}-${index}`}>{row}</span>)}</div>
    {frame.decimalResult && <strong aria-hidden="true">{frame.decimalResult}</strong>}
    {frame.decimalNote && <small aria-hidden="true">{frame.decimalNote}</small>}
  </div>
}

function RoundingWorking({ frame }: { frame: MethodFrame }) {
  const rounding = frame.rounding
  if (!rounding) return null
  const comparison = rounding.roundsUp ? `${rounding.decisionDigit} is 5 or more` : `${rounding.decisionDigit} is below 5`
  const direction = rounding.roundsUp ? 'Round up' : 'Keep it the same'
  const label = rounding.stage === 'result'
    ? `${rounding.original} rounded to ${rounding.target} is ${rounding.answer}`
    : `${rounding.original}. Keep ${rounding.kept}; decision digit ${rounding.decisionDigit}${rounding.remaining ? `; remaining digits ${rounding.remaining}` : ''}`

  return <div className={`wms-rounding wms-rounding--${rounding.stage}`} role="img" aria-label={label}>
    <div className="wms-rounding-target" aria-hidden="true"><span>Round to</span><strong>{rounding.target}</strong></div>
    {rounding.stage !== 'result' ? <>
      <div className="wms-rounding-number" aria-hidden="true">
        <span className="wms-rounding-kept"><small>Keep</small><b>{rounding.kept}</b></span>
        <i className="wms-rounding-boundary" />
        <span className="wms-rounding-decision"><small>Check next</small><b>{rounding.decisionDigit}</b></span>
        {rounding.remaining && <span className="wms-rounding-remaining"><small>Ignore</small><b>{rounding.remaining}</b></span>}
      </div>
      {rounding.stage === 'decide' && <div className={`wms-rounding-rule ${rounding.roundsUp ? 'is-up' : 'is-same'}`} aria-hidden="true">
        <span className="wms-rounding-rule__digit">{rounding.decisionDigit}</span>
        <span><small>{comparison}</small><strong>{direction}</strong></span>
        <span className="wms-rounding-rule__arrow">{rounding.roundsUp ? '↑' : '→'}</span>
      </div>}
    </> : <div className="wms-rounding-result" aria-hidden="true">
      <span>{rounding.original}</span><i>→</i><strong>{rounding.answer}</strong>
    </div>}
  </div>
}

function FactorTree({ example, frame }: { example: MethodExample; frame: MethodFrame }) {
  const markerId = `factor-tree-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const splits = new Map(frame.factorSplits?.map(split => [split.value, split]) ?? [])
  type TreeNode = { value: number; key: string; children?: [TreeNode, TreeNode]; x?: number; y?: number }
  const branch = (value: number, key: string): TreeNode => {
    const split = splits.get(value)
    return { value, key, children: split ? [branch(split.left, `${key}-l`), branch(split.right, `${key}-r`)] : undefined }
  }
  const root = branch(example.first, 'root')
  const leafCount = (node: TreeNode): number => node.children ? leafCount(node.children[0]) + leafCount(node.children[1]) : 1
  const depth = (node: TreeNode): number => node.children ? 1 + Math.max(depth(node.children[0]), depth(node.children[1])) : 0
  const leaves = leafCount(root), horizontalGap = 88, verticalGap = 88, padding = 38
  const naturalWidth = padding * 2 + Math.max(0, leaves - 1) * horizontalGap
  const viewWidth = Math.max(300, naturalWidth), offset = (viewWidth - naturalWidth) / 2
  let leafIndex = 0
  const position = (node: TreeNode, level = 0): number => {
    node.y = padding + level * verticalGap
    if (!node.children) node.x = offset + padding + leafIndex++ * horizontalGap
    else node.x = (position(node.children[0], level + 1) + position(node.children[1], level + 1)) / 2
    return node.x
  }
  position(root)
  const nodes: TreeNode[] = [], edges: Array<[TreeNode, TreeNode]> = []
  const collect = (node: TreeNode) => {
    nodes.push(node)
    node.children?.forEach(child => { edges.push([node, child]); collect(child) })
  }
  collect(root)
  const viewHeight = padding * 2 + depth(root) * verticalGap
  return <div className="wms-factor-tree" role="img" aria-label={`Factor tree for ${example.first}${frame.factorAnswer ? `. ${frame.factorAnswer}` : ''}`}>
    <svg aria-hidden="true" viewBox={`0 0 ${viewWidth} ${viewHeight}`}>
      <defs><marker id={markerId} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L6 3L0 6Z" /></marker></defs>
      {edges.map(([parent, child]) => <line key={`${parent.key}-${child.key}`} x1={parent.x} y1={(parent.y ?? 0) + 24} x2={child.x} y2={(child.y ?? 0) - 28} markerEnd={`url(#${markerId})`} />)}
      {nodes.map(node => <g className={node.children ? '' : 'is-prime'} key={node.key} transform={`translate(${node.x} ${node.y})`}><circle r="24" /><text y="0.35em" textAnchor="middle">{node.value}</text></g>)}
    </svg>
    {frame.factorAnswer && <strong aria-hidden="true"><MathSpan latex={frame.factorAnswer} /></strong>}
  </div>
}

function NumberLists({ frame }: { frame: MethodFrame }) {
  const lists = frame.numberLists
  if (!lists) return <div className="wms-list-board" />
  const common = new Set(lists.common ?? [])
  const row = (label: string, values: number[]) => <div><span>{label}</span><div>{values.map((value, index) => <b className={common.has(value) ? 'is-common' : ''} key={`${value}-${index}`}>{value}</b>)}</div></div>
  return <div className="wms-list-board" role="group" aria-label={`${lists.firstLabel}: ${lists.first.join(', ')}${lists.secondLabel ? `. ${lists.secondLabel}: ${lists.second?.join(', ')}` : ''}`}>
    {row(lists.firstLabel, lists.first)}
    {lists.secondLabel && row(lists.secondLabel, lists.second ?? [])}
    {(lists.hcf !== undefined || lists.lcm !== undefined) && <p>{lists.hcf !== undefined && <strong>HCF = {lists.hcf}</strong>}{lists.lcm !== undefined && <strong>LCM = {lists.lcm}</strong>}</p>}
  </div>
}

function Venn({ frame }: { frame: MethodFrame }) {
  const venn = frame.venn
  if (!venn) return <div className="wms-venn" />
  const chips = (values: number[]) => values.map((value, index) => <b key={`${value}-${index}`}>{value}</b>)
  return <div className="wms-venn-wrap" role="img" aria-label={`${venn.labels[0]} only: ${venn.left.join(', ') || 'none'}; shared: ${venn.middle.join(', ') || 'none'}; ${venn.labels[1]} only: ${venn.right.join(', ') || 'none'}${venn.hcf ? `; HCF ${venn.hcf}` : ''}${venn.lcm ? `; LCM ${venn.lcm}` : ''}`}>
    <div className="wms-venn" aria-hidden="true"><span className="wms-venn-label wms-venn-label--left">{venn.labels[0]}</span><span className="wms-venn-label wms-venn-label--right">{venn.labels[1]}</span><i className="wms-venn-circle wms-venn-circle--left" /><i className="wms-venn-circle wms-venn-circle--right" /><div className="wms-venn-region wms-venn-region--left">{chips(venn.left)}</div><div className="wms-venn-region wms-venn-region--middle">{chips(venn.middle)}</div><div className="wms-venn-region wms-venn-region--right">{chips(venn.right)}</div></div>
    {(venn.hcf !== undefined || venn.lcm !== undefined) && <p aria-hidden="true">{venn.hcf !== undefined && <strong>HCF = {venn.hcf}</strong>}{venn.lcm !== undefined && <strong>LCM = {venn.lcm}</strong>}</p>}
  </div>
}

function WorkingDiagram({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  if (example.method === 'column') return <Column example={example} frame={frame} step={step} />
  if (example.method === 'grid') return <Grid example={example} frame={frame} step={step} />
  if (example.method === 'long-division') return <LongDivision example={example} frame={frame} step={step} />
  if (example.method === 'division') return <Division example={example} frame={frame} step={step} />
  if (example.method === 'rounding') return <RoundingWorking frame={frame} />
  if (example.method === 'decimal') return <DecimalWorking frame={frame} />
  if (example.method === 'factor-tree') return <FactorTree example={example} frame={frame} />
  if (example.method === 'number-lists') return <NumberLists frame={frame} />
  return <Venn frame={frame} />
}

export function MethodWorkedExample({ visual }: { visual: MethodWorking }) {
  const [revealed, setRevealed] = useState(0)
  const { total, working, active, current, completed } = methodProgress(visual, revealed)
  const rounding = working[active]?.example.method === 'rounding'
  const controls = <div className="wm-controls wms-controls">
    <button type="button" className="wms-control--back" aria-label="Previous calculation step" disabled={!revealed} onClick={() => setRevealed(n => n - 1)}>← Back</button>
    <button type="button" className="wms-control--replay" aria-label="Replay calculation" disabled={!revealed} onClick={() => setRevealed(0)}>Replay</button>
    <button type="button" className="wms-control--next" aria-label="Next calculation step" disabled={revealed === total} onClick={() => setRevealed(n => n + 1)}>Next <span aria-hidden="true">→</span></button>
  </div>
  return <figure className={`wms-worked${rounding ? ' wms-worked--rounding' : ''}`} data-revealed-steps={revealed}>
    {rounding ? <div className="wms-step-progress" aria-label={revealed ? `Step ${revealed} of ${total}` : 'Ready to start'}>
      <span>{revealed ? `Step ${revealed} of ${total}` : 'Ready to start'}</span>
      <div aria-hidden="true">{Array.from({ length: total }, (_, index) => <i className={index < revealed ? 'is-complete' : index === revealed ? 'is-current' : ''} key={index} />)}</div>
    </div> : <p className="wm-step-label">{revealed ? `Step ${revealed} of ${total}` : 'Ready to start'}</p>}
    {working.map(({ example, count }, index) => index > active ? null : <div className="wms-example" key={index}>
      {working.length > 1 && <p className="wm-step-label">Example {index + 1}: {example.label}</p>}
      {example.method !== 'rounding' && <div className="wmt-original" aria-label="Original calculation"><MathSpan latex={example.expression} display /></div>}
      <WorkingDiagram example={example} frame={example.steps[count - 1]?.frame ?? {}} step={index === active ? current : undefined} />
      {index === active && <>
        {current ? <div className="wms-current" role="group" aria-label="Current calculation step" data-step-index={revealed}>
          <p className="wms-current-title">{current.title}</p>
          {example.method !== 'rounding' && <div className="wmt-math"><Equation math={current.equation} operation={current.operation} /></div>}
          <p>{current.instruction}</p>
        </div> : <p className="wms-start">Click Next to begin the working.</p>}
        {controls}
      </>}
    </div>)}
    {!rounding && completed.length > 1 && <p className="wms-history-title">Earlier working</p>}
    {!rounding && <ol className="wms-history" aria-label="Earlier calculation working">{completed.slice(0, -1).map(({ step, example, index, number }) => <li key={`${index}-${number}`}>
      <span className="wms-history-number" aria-hidden="true">{number}</span><div>
        {working.length > 1 && number === 1 && <span className="wmt-line-label">Example {index + 1}: {example.label}</span>}
        <div className="wmt-math"><Equation math={step.equation} /></div>
        <p>{step.instruction}</p>
      </div>
    </li>)}</ol>}
    <p className="sr-only" aria-live="polite">{working.flatMap(w => w.example.steps.slice(0, w.count)).at(-1)?.instruction ?? 'No calculation steps revealed.'}</p>
  </figure>
}

export function AnswerMethodWorking({ visual }: { visual: MethodWorking }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return <div className="wms-answer-working"><button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this calculation step by step'}</button><div id={id} className="pvb-stage" hidden={!open}><MethodWorkedExample visual={visual} /></div></div>
}
