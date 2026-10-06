import type { CSSProperties } from 'react'
import { chartCells, ordinal, type NumberLinePicture, type OrderChartPicture } from './stepWorking'

const cls = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ')
const WHOLE = ['U', 'T', 'H', 'Th', 'TTh', 'HTh']
const DECIMAL = ['t', 'h', 'th']
/** The numbers to order in a place-value chart: points lined up, gaps dashed, the column compared tinted purple. */
export function OrderChart({ picture }: { picture: OrderChartPicture }) {
  const labelled = picture.rows.some(r => r.label)
  const heads = [...Array.from({ length: picture.whole }, (_, k) => WHOLE[picture.whole - 1 - k]), ...DECIMAL.slice(0, picture.places)]
  const point = picture.places > 0
  const labelWidth = Math.max(0, ...picture.rows.map(r => r.label?.length ?? 0)) * 8.5 + 10
  const template = `30px ${labelled ? `${Math.ceil(labelWidth)}px ` : ''}${heads.map((_, k) => `${k === picture.whole && point ? '.35em ' : ''}1.05em`).join(' ')}`
  const cells = (render: (col: number) => React.ReactNode, pointCell: React.ReactNode) => heads.flatMap((_, col) => [
    ...(point && col === picture.whole ? [<span key="p" className="oc-point">{pointCell}</span>] : []),
    <span key={col} className={cls('oc-cell', col === picture.focus && 'is-focus')}>{render(col)}</span>,
  ])
  const spoken = picture.rows.map((r, i) => `${r.label ? `${r.label} ` : ''}${r.value}${picture.ranks?.[i] ? `, ${ordinal(picture.ranks[i])}` : ''}`).join('; ')
  return <div className="oc-chart" style={{ '--oc-template': template } as CSSProperties} role="img" aria-label={spoken}>
    <div className="oc-row oc-head" aria-hidden="true"><span />{labelled && <span />}{cells(col => heads[col], '')}</div>
    {picture.rows.map((row, r) => {
      const digits = chartCells(picture, row.value)
      const rank = picture.ranks?.[r]
      const out = picture.active && !picture.active.includes(r) && rank === undefined
      return <div key={r} className={cls('oc-row', out && 'is-out', picture.pick === r && 'is-pick', picture.active?.includes(r) && 'is-active')} aria-hidden="true">
        <span className={cls('oc-rank', picture.fresh?.includes(r) && 'is-fresh')}>{rank ? ordinal(rank) : ''}</span>
        {labelled && <span className="oc-label">{row.label}</span>}
        {cells(col => { const c = digits[col]; return c ? <span className={c.added ? 'is-added' : undefined}>{c.digit}</span> : <span className="oc-gap" /> }, '.')}
      </div>
    })}
  </div>
}

const fmt = (n: number) => (n < 0 ? '−' : '') + String(Math.abs(Math.round(n * 1000) / 1000))
/** Spreads labels along one axis so none overlap, keeping each as near its own point as it can. */
function spread(points: number[], gap: number, lo: number, hi: number) {
  const order = points.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p)
  const out = order.map(o => o.p)
  for (let k = 1; k < out.length; k++) out[k] = Math.max(out[k], out[k - 1] + gap)
  const over = out.length ? out[out.length - 1] - hi : 0
  if (over > 0) for (let k = out.length - 1; k >= 0; k--) out[k] = Math.max(lo, k === out.length - 1 ? out[k] - over : Math.min(out[k], out[k + 1] - gap))
  const placed: number[] = []
  order.forEach((o, k) => { placed[o.i] = out[k] })
  return placed
}

/** A thermometer or a number line, 0 drawn across it, each value a dot with its label; the reading arrow in purple. */
export function NumberLine({ picture }: { picture: NumberLinePicture }) {
  const ticks: number[] = []
  for (let v = picture.min; v <= picture.max + 1e-9; v += picture.tick) ticks.push(Math.round(v * 1000) / 1000)
  const major = (v: number) => v === 0 || v === picture.min || v === picture.max || Math.abs(Math.round(v / (picture.tick * 2)) * picture.tick * 2 - v) < 1e-9
  const spoken = `${picture.vertical ? 'Thermometer' : 'Number line'} from ${fmt(picture.min)} to ${fmt(picture.max)}${picture.marks.length ? `, marked ${picture.marks.map(m => m.label).join(', ')}` : ''}`
  if (picture.vertical) {
    const top = 18, bottom = 262, x = 96
    const y = (v: number) => bottom - (v - picture.min) / (picture.max - picture.min) * (bottom - top)
    const labels = spread(picture.marks.map(m => y(m.value)), 19, top, bottom + 8)
    return <svg className="nl-picture is-vertical" viewBox="0 0 240 300" role="img" aria-label={spoken}>
      <rect className="nl-tube" x={x - 9} y={top - 10} width="18" height={bottom - top + 20} rx="9" />
      <circle className="nl-bulb" cx={x} cy={bottom + 22} r="14" />
      {ticks.map(v => <g key={v}>
        <line className={cls('nl-tick', v === 0 && 'is-zero')} x1={v === 0 ? x - 30 : x - 16} x2={v === 0 ? x + 30 : x - 9} y1={y(v)} y2={y(v)} />
        {major(v) && <text className={cls('nl-scale', v === 0 && 'is-zero')} x={x - 34} y={y(v) + 4} textAnchor="end">{fmt(v)}</text>}
      </g>)}
      {picture.read && <g className="nl-read"><line x1="22" x2="22" y1={picture.read === 'up' ? bottom : top} y2={picture.read === 'up' ? top + 8 : bottom - 8} /><path d={picture.read === 'up' ? `M14 ${top + 12} L22 ${top} L30 ${top + 12}` : `M14 ${bottom - 12} L22 ${bottom} L30 ${bottom - 12}`} /></g>}
      {picture.marks.map((m, i) => <g key={m.label} className={cls('nl-mark', m.boxed && 'is-boxed', m.pick && 'is-pick')}>
        <line className="nl-leader" x1={x} x2={x + 34} y1={y(m.value)} y2={labels[i]} />
        <circle cx={x} cy={y(m.value)} r="6" />
        {m.boxed && <rect x={x + 36} y={labels[i] - 11} width={m.label.length * 9 + 10} height="22" rx="6" />}
        <text x={x + 41} y={labels[i] + 5}>{m.label}</text>
      </g>)}
    </svg>
  }
  const left = 22, right = 298, base = 104
  const xAt = (v: number) => left + (v - picture.min) / (picture.max - picture.min) * (right - left)
  // Labels sit above the line, on the lowest row where they do not touch the one before.
  const ends: number[] = []
  const rows = picture.marks.map(m => ({ m, x: xAt(m.value) })).sort((a, b) => a.x - b.x).map(({ m, x }) => {
    const w = m.label.length * 8 + 10
    let row = 0
    while (ends[row] !== undefined && ends[row] > x - w / 2 - 2) row++
    ends[row] = x + w / 2
    return { m, x: Math.min(Math.max(x, left + w / 2 - 14), right - w / 2 + 14), dot: x, row, w }
  })
  return <svg className="nl-picture" viewBox="0 0 320 152" role="img" aria-label={spoken}>
    <line className="nl-axis" x1={left - 10} x2={right + 10} y1={base} y2={base} />
    {ticks.map(v => <g key={v}>
      <line className={cls('nl-tick', v === 0 && 'is-zero')} x1={xAt(v)} x2={xAt(v)} y1={base - (v === 0 ? 14 : 6)} y2={base + (v === 0 ? 14 : 6)} />
      {major(v) && <text className={cls('nl-scale', v === 0 && 'is-zero')} x={xAt(v)} y={base + 28} textAnchor="middle">{fmt(v)}</text>}
    </g>)}
    {picture.read && <g className="nl-read"><line x1={picture.read === 'right' ? left : right} x2={picture.read === 'right' ? right - 8 : left + 8} y1={base + 42} y2={base + 42} /><path d={picture.read === 'right' ? `M${right - 12} ${base + 34} L${right} ${base + 42} L${right - 12} ${base + 50}` : `M${left + 12} ${base + 34} L${left} ${base + 42} L${left + 12} ${base + 50}`} /></g>}
    {rows.map(({ m, x, dot, row, w }) => <g key={m.label} className={cls('nl-mark', m.boxed && 'is-boxed', m.pick && 'is-pick')}>
      <line className="nl-leader" x1={dot} x2={x} y1={base} y2={base - 22 - row * 24} />
      <circle cx={dot} cy={base} r="6" />
      {m.boxed && <rect x={x - w / 2} y={base - 40 - row * 24} width={w} height="22" rx="6" />}
      <text x={x} y={base - 24 - row * 24} textAnchor="middle">{m.label}</text>
    </g>)}
  </svg>
}
