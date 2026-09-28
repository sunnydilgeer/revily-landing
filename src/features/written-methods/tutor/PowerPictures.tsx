import type { SquaresFrame, TilesFrame } from './methodWorking'

/** Powers as copies: every group of tiles is one power, and crossed-out tiles have cancelled. See EXPLANATIONS.md. */
export function TilesVisual({ frame }: { frame: TilesFrame }) {
  const label = frame.rows.map(row => row.groups.map(group => `${group.tiles.length} copies of ${group.tiles[0]}${group.crossed ? `, ${group.crossed} crossed out` : ''}`).join(', then ')).join(frame.over ? ', over ' : '. ')
  return <div className={`ns-tiles${frame.over ? ' is-over' : ''}`} role="img" aria-label={`${label}.${frame.note ? ` ${frame.note}.` : ''}`}>
    {frame.rows.map((row, r) => <p key={r} className="ns-tiles__row" aria-hidden="true">{row.groups.map((group, g) => <span key={g} className="ns-tiles__chunk">
      {g > 0 && <span className="ns-term-op">×</span>}
      <span className={`ns-tiles__group ${frame.plain ? 'is-plain' : `is-f${group.family % 4}`}`}>{group.tiles.map((tile, t) => <span key={t} className={`ns-tile${t < (group.crossed ?? 0) ? ' is-crossed' : ''}`}>{tile}</span>)}</span>
    </span>)}</p>)}
    {frame.note && <p className="ns-tiles__note" aria-hidden="true">{frame.note}</p>}
  </div>
}

/** A square of small squares, with the shaded part coloured: area pictures for fraction powers and square roots. */
export function SquaresVisual({ frame }: { frame: SquaresFrame }) {
  const cells = Array.from({ length: frame.rows * frame.cols }, (_, i) => Math.floor(i / frame.cols) < frame.shaded[0] && i % frame.cols < frame.shaded[1])
  return <div className="ns-squares" role="img" aria-label={frame.label}>
    <div className="ns-squares__grid" style={{ gridTemplateColumns: `repeat(${frame.cols}, 1fr)` }} aria-hidden="true">{cells.map((on, i) => <span key={i} className={on ? 'is-on' : undefined} />)}</div>
    {frame.side && <p className="ns-squares__side" aria-hidden="true">{frame.side}</p>}
  </div>
}
