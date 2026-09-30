import type { ExpandFrame } from './methodWorking'
import { Powers } from './Powers'

/** Expanding brackets as grids: side × top in every box. Empty boxes until the step that multiplies. Factorising fills the boxes first and finds the side and top. See EXPLANATIONS.md. */
export function ExpandVisual({ frame }: { frame: ExpandFrame }) {
  const label = frame.grids.map(grid => grid.cells
    ? grid.side.flatMap((side, r) => grid.top.map((top, c) => `${side} times ${top} is ${grid.cells![r][c].text}`)).join('. ')
    : `A grid with ${grid.side.join(' and ')} down the side and ${grid.top.join(' and ')} along the top`).join('. Then ')
  const described = frame.given ? frame.grids.map(grid => `A grid with ${grid.cells!.flat().map(cell => cell.text).join(', ')} in the boxes, ${grid.side.join(' and ')} down the side and ${grid.top.join(', ')} along the top`).join('. ') : label
  return <div className="ns-expand" role="img" aria-label={`${described.replace(/\?/g, 'a gap')}.`}>
    {frame.grids.map((grid, g) => <table key={g} className="ns-expand__grid" aria-hidden="true"><tbody>
      <tr><th className="ns-expand__corner">×</th>{grid.top.map((top, c) => <th key={c} scope="col"><Powers text={top} /></th>)}</tr>
      {grid.side.map((side, r) => <tr key={r}><th scope="row"><Powers text={side} /></th>{grid.top.map((_, c) => {
        const cell = grid.cells?.[r][c]
        return <td key={c} className={cell?.family !== undefined ? `is-f${cell.family % 4}` : undefined}>{cell ? <Powers text={cell.text} /> : ''}</td>
      })}</tr>)}
    </tbody></table>)}
  </div>
}
