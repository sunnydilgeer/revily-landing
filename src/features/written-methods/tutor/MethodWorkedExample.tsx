'use client'

import { useId, useMemo, useState, type CSSProperties } from 'react'
import { WorkedChain } from '../../maths/step-chain/WorkedChain'
import { Working } from '../../maths/step-chain/working'
import { methodChain } from './methodChain'
import type { MethodExample, MethodFrame, MethodStep, MethodWorking, WrittenLine } from './methodWorking'
import { isNumberSenseWorking, NumberSenseWorkedExample, PictureStep } from './NumberSenseWorkedExample'


/** A written method's number row: each digit in its place, coloured by what the step is doing with it. */
function digitClass(classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(' ') }

function Column({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const width = String(example.first * example.second).length
  const places = Math.max(width, String(example.first).length, String(example.second).length)
  const focus = step?.focus && 'factorPlace' in step.focus ? step.focus : undefined
  const written = frame.written
  const row = (number: string, label: string, symbol = '', options: { active?: number; family?: number; row?: 'ones' | 'tens' | 'total' } = {}) => {
    const answer = options.row && frame.answerRow === options.row
    const isNew = (place: number) => written && written.row === options.row && (place === written.place || (written.wide && place === written.place + 1))
    return <div className={`wms-number-row${answer ? ' is-answer' : ''}`} role="group" aria-label={`${label}: ${number.trim() || 'not yet written'}${answer ? ', the answer' : ''}`}>
      <span aria-hidden="true">{symbol}</span>{[...number.padStart(places, ' ')].map((digit, i) => {
        const place = places - i - 1
        return <span aria-hidden="true" className={digitClass([place === options.active && `wms-digit--focus is-f${options.family}`, !answer && isNew(place) && 'wms-digit--new'])} key={i}>{digit === ' ' ? '\u00a0' : digit}</span>
      })}
    </div>
  }
  const carries = frame.carries ?? (frame.carry ? [frame.carry] : [])
  const latest = carries.at(-1)
  const carry = (kind: 'ones' | 'tens' | 'sum') => {
    const here = carries.filter(c => c.row === kind)
    if (!here.length) return null
    return <div className="wms-carry-row" role="group" aria-label={`Carried: ${here.map(c => c.value).join(', ')}`}><span aria-hidden="true" />{Array.from({ length: places }, (_, i) => {
      const c = here.find(c => c.place === places - i - 1)
      const answer = frame.answerCarry && c === latest
      return <span aria-hidden="true" key={i}>{c ? <b className={digitClass(['wms-carry', 'boxed' in c && c.boxed && 'is-boxed', 'used' in c && c.used && 'is-used', answer && 'is-answer'])}>{c.value}</b> : '\u00a0'}</span>
    })}</div>
  }
  return <div className="wms-column" style={{ '--places': places } as CSSProperties}>
    <div className="wms-place-row" aria-label="Place-value columns"><span />{Array.from({ length: places }, (_, i) => <span key={i}>{['U', 'T', 'H', 'Th', 'TTh'][places - i - 1]}</span>)}</div>
    {row(String(example.first), 'Top number', '', { active: focus?.topPlace, family: 1 })}
    {row(String(example.second), 'Multiplier', '×', { active: focus?.factorPlace, family: 0 })}
    <div className="wms-rule" />
    {carry('ones')}{frame.ones !== undefined && row(frame.ones, 'First row', '', { row: 'ones' })}
    {carry('tens')}{frame.tens !== undefined && row(frame.tens, 'Second row', '+', { row: 'tens' })}
    {frame.total !== undefined && <>{carry('sum')}<div className="wms-rule" />{row(frame.total, 'Total', '', { row: 'total' })}</>}
  </div>
}

function Grid({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const grid = example.grid!
  const focus = step?.focus && 'cell' in step.focus ? step.focus.cell : undefined
  const [row, col] = focus?.split('-').map(Number) ?? []
  const head = (n: number, family: number, active: boolean) => frame.split ? <span className={`wms-grid-head is-f${family}${active ? ' is-active' : ''}`}>{n}</span> : <span className="wms-empty">?</span>
  return <table className="wmt-grid wms-grid" aria-label={frame.split ? 'Multiplication grid' : `Multiplication grid for ${example.first} × ${example.second}, headings not yet written`}><thead><tr><th scope="col">×</th>{grid.second.map((n, j) => <th scope="col" key={n}>{head(n, 0, j === col)}</th>)}</tr></thead><tbody>{grid.first.map((n, i) => <tr key={n}><th scope="row">{head(n, 1, i === row)}</th>{grid.second.map((m, j) => <td key={m} className={focus === `${i}-${j}` ? 'wms-cell--current' : ''} aria-label={`${n} times ${m}: ${frame.cells?.[`${i}-${j}`] ?? 'not yet written'}`}>{frame.cells?.[`${i}-${j}`] ?? <span className="wms-empty">·</span>}</td>)}</tr>)}</tbody></table>
}

/** The quotient on top of a bus stop or long division; the finished quotient (with any remainder) is the answer. */
function Quotient({ digits, frame }: { digits: string; frame: MethodFrame }) {
  const quotient = (frame.quotient ?? '').padEnd(digits.length, ' ')
  const answer = frame.answerRow === 'quotient'
  return <div className={`wms-quotient${answer ? ' is-answer' : ''}${answer && frame.remainder ? ' has-r' : ''}`} aria-label={`${answer ? 'The answer' : 'Quotient so far'}: ${quotient.trim() || 'not yet written'}${answer && frame.remainder ? ` remainder ${frame.remainder}` : ''}`}>
    <span />{[...quotient].map((d, i) => <span key={i}>{d === ' ' ? '\u00a0' : d}</span>)}
    {answer && Boolean(frame.remainder) && <span className="wms-quotient__r">r {frame.remainder}</span>}
  </div>
}

function Division({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const digits = String(example.first)
  const focus = step?.focus && 'dividendIndex' in step.focus ? step.focus.dividendIndex : undefined
  const carries = frame.busCarries ?? (frame.divisionCarry ? [frame.divisionCarry] : [])
  return <div className="wms-division" style={{ '--places': digits.length } as CSSProperties}>
    <div className="wms-division-places"><span />{[...digits].map((_, i) => <span key={i}>{['U', 'T', 'H', 'Th'][digits.length - i - 1]}</span>)}</div>
    <Quotient digits={digits} frame={frame} />
    <div className="wms-dividend"><span className="is-f0" aria-label={`Divisor ${example.second}`}>{example.second}</span><div aria-label={`Dividend ${example.first}${carries.length ? `, with ${carries.map(c => c.value).join(' and ')} carried` : ''}`}>{[...digits].map((d, i) => {
      const carried = carries.find(c => c.index === i)
      return <span className={i === focus ? 'wms-group' : ''} key={i}>{carried && <sup className={frame.carriesBoxed ? 'is-boxed' : ''}>{carried.value}</sup>}{d}</span>
    })}</div></div>
  </div>
}

function LongDivision({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  const digits = String(example.first)
  const focus = step?.focus && 'dividendIndex' in step.focus ? step.focus : undefined
  const inGroup = (i: number) => focus && focus.dividendStart !== undefined && i >= focus.dividendStart && i <= focus.dividendIndex
  return <div className="wms-division wms-long-division" style={{ '--places': digits.length } as CSSProperties}>
    <div className="wms-division-places"><span />{[...digits].map((_, i) => <span key={i}>{['U', 'T', 'H', 'Th'][digits.length - i - 1]}</span>)}</div>
    <Quotient digits={digits} frame={frame} />
    <div className="wms-dividend"><span className="is-f0" aria-label={`Divisor ${example.second}`}>{example.second}</span><div aria-label={`Dividend ${example.first}`}>{[...digits].map((d, i) => <span className={inGroup(i) ? 'wms-group' : ''} key={i}>{d}</span>)}</div></div>
    {frame.longRows?.map((row, index) => {
      const start = row.end - row.number.length + 1
      const current = index === frame.longRows!.length - 1 && focus && row.kind === 'bring-down'
      return <div className="wms-long-row" key={index} role="group" aria-label={`${row.kind === 'subtract' ? 'Subtract' : row.kind === 'bring-down' ? 'Bring down to make' : 'Difference'} ${row.number}`}>
        <span aria-hidden="true">{row.kind === 'subtract' ? '−' : '\u00a0'}</span>{[...digits].map((_, i) => <span aria-hidden="true" className={digitClass([row.kind === 'subtract' && i >= start && i <= row.end && 'wms-subtraction-digit', row.kind === 'bring-down' && i === row.end && 'wms-brought-digit', current && i >= start && i <= row.end && 'wms-group'])} key={i}>{i >= start && i <= row.end ? row.number[i - start] : '\u00a0'}</span>)}
      </div>
    })}
  </div>
}

function DecimalWorking({ frame }: { frame: MethodFrame }) {
  return <div className="wms-decimal" role="img" aria-label={`${frame.decimalRows?.join('; ') ?? 'Decimal calculation'}${frame.decimalResult ? `; result ${frame.decimalResult}` : ''}`}>
    <div className="wms-decimal-rows" aria-hidden="true">{frame.decimalRows?.map((row, index) => <span key={`${row}-${index}`}>{row}</span>)}</div>
    {frame.decimalResult && <strong aria-hidden="true">{frame.decimalResult}</strong>}
    {frame.decimalNote && <small aria-hidden="true">{frame.decimalNote}</small>}
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
    {/* The answer is the step chain's last line, so the tree does not repeat it (it stays in the label). */}
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

/** A method's own picture for one frame (used by step workings too, for factor trees, lists and Venn diagrams). */
export { WorkingDiagram as MethodPicture }
function WorkingDiagram({ example, frame, step }: { example: MethodExample; frame: MethodFrame; step?: MethodStep }) {
  if (example.method === 'column') return <Column example={example} frame={frame} step={step} />
  if (example.method === 'grid') return <Grid example={example} frame={frame} step={step} />
  if (example.method === 'long-division') return <LongDivision example={example} frame={frame} step={step} />
  if (example.method === 'division') return <Division example={example} frame={frame} step={step} />
  if (example.method === 'decimal') return <DecimalWorking frame={frame} />
  if (example.method === 'factor-tree') return <FactorTree example={example} frame={frame} />
  if (example.method === 'number-lists') return <NumberLists frame={frame} />
  return <Venn frame={frame} />
}

export function MethodWorkedExample({ visual }: { visual: MethodWorking }) {
  if (isNumberSenseWorking(visual)) return <NumberSenseWorkedExample visual={visual} />
  return isWrittenWorking(visual) ? <WrittenWorkedExample visual={visual} /> : <ArithmeticWorkedExample visual={visual} />
}

const WRITTEN: MethodExample['method'][] = ['column', 'grid', 'division', 'long-division']
const isWrittenWorking = (visual: MethodWorking) => visual.examples.every(example => WRITTEN.includes(example.method))

/** The lines a written-method step adds under its picture: "3 × 4 → 12", the carry boxed in purple. */
function WrittenLines({ lines }: { lines: WrittenLine[] }) {
  return <ul className="ns-term-groups wms-lines" aria-label={lines.map(line => `${line.parts.map(part => part.text).join(' ')}${line.result ? ` gives ${line.result}` : ''}${line.mark ? `, ${line.mark}` : ''}`).join('. ')}>{lines.map((line, i) => <li key={i} aria-hidden="true">
    <span>{line.parts.map((part, j) => <span key={j} className={digitClass([part.family !== undefined && `is-f${part.family}`, part.boxed && 'ns-shared wms-boxed'])}>{part.text}</span>)}</span>
    {line.result !== undefined && <><span>{line.answer ? '=' : '→'}</span><strong className={digitClass([line.answer && 'wms-answer', line.resultFamily !== undefined && `is-f${line.resultFamily}`])}>{line.result}</strong></>}
    {line.mark && <small className={`wms-mark${line.mark === '✓' ? ' is-ok' : ''}`}>{line.mark}</small>}
  </li>)}</ul>
}

/**
 * Grid, columns, bus stop and long division as a picture-only working (src/features/EXPLANATIONS.md): the method's own
 * layout, plain before the first step; then one move a step, its heading under the picture and above the lines that
 * show where the new numbers come from. The last move writes the answer in green, and the working stops there.
 */
function WrittenWorkedExample({ visual }: { visual: MethodWorking }) {
  const chain = useMemo(() => methodChain(visual), [visual])
  const picture = (revealed: number) => {
    const at = chain.slice(0, revealed).findLast(line => line.at)?.at ?? { example: 0, step: -1 }
    const index = at.example ?? 0, example = visual.examples[index], step = example.steps[at.step]
    const diagram = (frame: MethodFrame) => <div className="rung-worked__visual"><WorkingDiagram example={example} frame={frame} step={step} /></div>
    if (!step) {
      if (!index) return <div className="ns-visual wms-written">{diagram({})}</div>
      // A second method for the same sum starts plain, under its own name.
      const intro = chain[revealed - 1]
      return <div className="ns-visual wms-written" key={`${index}-start`}><PictureStep step={{ title: example.label, instruction: intro.why ?? '', operation: '', equation: '', frame: {} }}>{heading => <><Working>{heading}</Working>{diagram({})}</>}</PictureStep></div>
    }
    return <div className="ns-visual wms-written" key={`${index}-${at.step}`}><PictureStep step={step}>{heading => <>
      {diagram(step.frame)}
      {step.frame.answerWords && <p className="wms-answer-words">{step.frame.answerWords}</p>}
      <Working>
        {heading}
        {step.frame.lines && <WrittenLines lines={step.frame.lines} />}
      </Working>
    </>}</PictureStep></div>
  }
  return <WorkedChain steps={chain} picture={picture} pictureOnly />
}

function ArithmeticWorkedExample({ visual }: { visual: MethodWorking }) {
  const chain = useMemo(() => methodChain(visual), [visual])
  // The method's own picture (grid, columns, bus stop, factor tree…) for the latest line that has one.
  const picture = (revealed: number) => {
    const at = chain.slice(0, revealed).findLast(line => line.at)?.at ?? { example: 0, step: -1 }
    const example = visual.examples[at.example ?? 0], step = example.steps[at.step]
    return <div className="rung-worked__visual"><WorkingDiagram example={example} frame={step?.frame ?? {}} step={step} /></div>
  }
  return <WorkedChain steps={chain} picture={picture} />
}

export function AnswerMethodWorking({ visual }: { visual: MethodWorking }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  if (isNumberSenseWorking(visual)) return <div className="ns-answer-working"><button type="button" className="ns-explanation-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide explanation' : 'Show explanation'} <span aria-hidden="true">{open ? '−' : '+'}</span></button><div id={id} hidden={!open}>{open && <MethodWorkedExample visual={visual} />}</div></div>
  return <div className="wms-answer-working"><button type="button" className="lesson-secondary-action" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{open ? 'Hide step by step' : 'See this calculation step by step'}</button><div id={id} className="pvb-stage" hidden={!open}><MethodWorkedExample visual={visual} /></div></div>
}
