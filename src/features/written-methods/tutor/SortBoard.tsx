'use client'

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import './AngleBoard.css'

/*
 * The sort board (Probability and statistics, Brilliant-style sweep): drag tiles, or tap a tile and then where it
 * goes, into the regions of a Venn diagram or into named bins (qualitative or quantitative, a good question or a
 * faulty one). The answer is built, not picked.
 *
 * - On a teaching screen it is a play screen: a tile dropped in the right place stays there and turns green; one in
 *   the wrong place goes back to the tray and says why.
 * - On a question it is the answer: place every tile, then Check. The answer is where each tile went, in order
 *   (`sortAnswer`), and a wrong one is explained by the first tile out of place (`sortMistake`).
 *
 * A tile's place is also chosen with the buttons that appear under the board once a tile is picked up, so it works
 * with a keyboard or a screen reader, and on a phone without dragging.
 */

/** A tile: its words, where it belongs (a Venn region or a bin's id), and why, said when it is put elsewhere. */
export type SortTile = { label: string; to: string; why?: string }
export type VennPlace = 'onlyA' | 'both' | 'onlyB' | 'outside'
export type SortBoardSpec =
  | { kind: 'venn'; names: [string, string]; tiles: SortTile[] }
  | { kind: 'bins'; bins: { id: string; label: string }[]; tiles: SortTile[] }

export const sortAnswer = (spec: SortBoardSpec) => spec.tiles.map(tile => tile.to).join(',')

/** The places a tile can go, with their names. */
export function sortPlaces(spec: SortBoardSpec): { id: string; label: string }[] {
  if (spec.kind === 'bins') return spec.bins
  const [a, b] = spec.names
  return [{ id: 'onlyA', label: `${a} only` }, { id: 'both', label: 'Both' }, { id: 'onlyB', label: `${b} only` }, { id: 'outside', label: 'Neither' }]
}

/** Why a sorting is wrong: the first tile out of place, and where it belongs. */
export function sortMistake(spec: SortBoardSpec, response: string): string | null {
  const given = response.split(',')
  const places = sortPlaces(spec)
  const wrong = spec.tiles.find((tile, k) => given[k] !== tile.to)
  if (!wrong) return null
  const where = places.find(place => place.id === wrong.to)?.label ?? wrong.to
  return `${wrong.label} belongs in ${where === 'Both' ? 'both' : where === 'Neither' ? 'neither circle' : where}.${wrong.why ? ` ${wrong.why}` : ''}`
}

/* The Venn diagram, in the board's own pixels: the rectangle, and circles A and B. */
const W = 320, H = 210
const RECT = { x0: 8, y0: 8, x1: 312, y1: 202 }
const A = { x: 122, y: 108 }, B = { x: 198, y: 108 }, R = 74
const SLOTS: Record<VennPlace, [number, number][]> = {
  onlyA: [[72, 82], [100, 82], [66, 108], [96, 108], [72, 134], [100, 134]],
  both: [[148, 92], [172, 92], [148, 118], [172, 118], [160, 66], [160, 146]],
  onlyB: [[220, 82], [248, 82], [224, 108], [254, 108], [220, 134], [248, 134]],
  outside: [[160, 22], [290, 60], [290, 105], [290, 150], [290, 186], [30, 60], [30, 105], [30, 150], [30, 186], [100, 192], [220, 192]],
}
function vennPlace(x: number, y: number): VennPlace | null {
  if (x < RECT.x0 || x > RECT.x1 || y < RECT.y0 || y > RECT.y1) return null
  const inA = Math.hypot(x - A.x, y - A.y) < R, inB = Math.hypot(x - B.x, y - B.y) < R
  return inA && inB ? 'both' : inA ? 'onlyA' : inB ? 'onlyB' : 'outside'
}
const chipWidth = (label: string) => Math.max(26, label.length * 8 + 12)

type Drag = { tile: number; x0: number; y0: number; x: number; y: number; moved: boolean }

export function SortBoard({ spec, onChange, disabled, result }: { spec: SortBoardSpec; onChange?: (value: string) => void; disabled?: boolean; result?: 'correct' | 'incorrect' }) {
  const play = !onChange
  const [place, setPlace] = useState<(string | null)[]>(() => spec.tiles.map(() => null))
  const [picked, setPicked] = useState<number | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [note, setNote] = useState('')
  const [bounce, setBounce] = useState<number | null>(null)
  const svg = useRef<SVGSVGElement>(null)
  const id = useId()
  const places = sortPlaces(spec)
  const name = (to: string) => places.find(p => p.id === to)?.label ?? to
  const done = place.filter(Boolean).length
  const checked = Boolean(result)

  const put = (tile: number, to: string | null) => {
    setPicked(null)
    if (disabled || (play && place[tile] === spec.tiles[tile].to)) return
    if (to && spec.kind === 'venn' && place[tile] !== to && place.filter(p => p === to).length >= SLOTS[to as VennPlace].length) {
      setNote(`No room in ${name(to)}. Is that the right place?`); return
    }
    if (play && to && to !== spec.tiles[tile].to) {
      // A wrong place in play: the tile goes back and says why.
      const t = spec.tiles[tile]
      setNote(`Not there. ${t.why ?? `${t.label} belongs in ${name(t.to)}.`}`)
      setBounce(tile); window.setTimeout(() => setBounce(b => b === tile ? null : b), 450)
      const next = [...place]; next[tile] = null; setPlace(next)
      return
    }
    const next = [...place]; next[tile] = to; setPlace(next)
    if (play) setNote(to ? `${spec.tiles[tile].label}: ${name(to)}. ${next.every((p, k) => p === spec.tiles[k].to) ? 'All sorted!' : ''}`.trim() : '')
    onChange?.(next.every(Boolean) ? next.join(',') : '')
  }

  const localPoint = (clientX: number, clientY: number) => {
    const m = svg.current?.getScreenCTM()
    if (!m) return null
    const q = new DOMPoint(clientX, clientY).matrixTransform(m.inverse())
    return { x: q.x, y: q.y }
  }
  /** Where a drag ends: a Venn region, a bin, the tray (null), or nowhere (undefined). */
  const target = (clientX: number, clientY: number): string | null | undefined => {
    const under = document.elementFromPoint(clientX, clientY)
    if (under?.closest('[data-sort-tray]')) return null
    const bin = under?.closest<HTMLElement>('[data-sort-bin]')
    if (bin) return bin.dataset.sortBin
    if (spec.kind === 'venn' && under?.closest('svg') === svg.current) { const p = localPoint(clientX, clientY); return p ? vennPlace(p.x, p.y) ?? undefined : undefined }
    return undefined
  }

  const grab = (tile: number) => ({
    onPointerDown: (event: PointerEvent<Element>) => {
      if (disabled || checked) return
      event.stopPropagation(); event.preventDefault()
      ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
      setDrag({ tile, x0: event.clientX, y0: event.clientY, x: event.clientX, y: event.clientY, moved: false })
    },
    onPointerMove: (event: PointerEvent<Element>) => {
      if (!drag || drag.tile !== tile) return
      const moved = drag.moved || Math.hypot(event.clientX - drag.x0, event.clientY - drag.y0) > 6
      setDrag({ ...drag, x: event.clientX, y: event.clientY, moved })
    },
    onPointerUp: (event: PointerEvent<Element>) => {
      if (!drag || drag.tile !== tile) return
      event.stopPropagation()
      setDrag(null)
      if (!drag.moved) { setPicked(picked === tile ? null : tile); return }
      const to = target(event.clientX, event.clientY)
      if (to !== undefined) put(tile, to)
    },
    onPointerCancel: () => setDrag(null),
    onKeyDown: (event: KeyboardEvent<Element>) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!disabled && !checked) setPicked(picked === tile ? null : tile) } },
  })

  const tone = (tile: number) => {
    const at = place[tile]
    if (checked && at) return at === spec.tiles[tile].to ? ' is-right' : ' is-wrong'
    if (play && at) return ' is-right'
    return ''
  }
  const chipClass = (tile: number) => `sort-board__tile${tone(tile)}${picked === tile ? ' is-picked' : ''}${drag?.tile === tile && drag.moved ? ' is-dragging' : ''}${bounce === tile ? ' is-bounce' : ''}`
  const chipLabel = (tile: number) => `${spec.tiles[tile].label}${place[tile] ? `, in ${name(place[tile]!)}` : ''}${picked === tile ? ', picked up' : ''}`

  const tray = spec.tiles.map((_, k) => k).filter(k => !place[k])
  const inPlace = (to: string) => spec.tiles.map((_, k) => k).filter(k => place[k] === to)

  return <div className={`angle-board sort-board${drag?.moved ? ' is-held' : ''}`}>
    {spec.kind === 'venn'
      ? <svg ref={svg} className="angle-board__surface sort-board__venn" viewBox={`0 0 ${W} ${H}`} aria-label={`A Venn diagram: ${spec.names[0]} and ${spec.names[1]}.`}
        onClick={event => { if (picked === null) return; const p = localPoint(event.clientX, event.clientY); const to = p && vennPlace(p.x, p.y); if (to) put(picked, to) }}>
        <rect className="sort-board__frame" x={RECT.x0} y={RECT.y0} width={RECT.x1 - RECT.x0} height={RECT.y1 - RECT.y0} rx="4" />
        <circle className="sort-board__ring" cx={A.x} cy={A.y} r={R} />
        <circle className="sort-board__ring" cx={B.x} cy={B.y} r={R} />
        <text className="sort-board__name" x={20} y={24}>ξ</text>
        <text className="sort-board__name" x={52} y={34}>{spec.names[0]}</text>
        <text className="sort-board__name" x={268} y={34}>{spec.names[1]}</text>
        {(Object.keys(SLOTS) as VennPlace[]).flatMap(region => inPlace(region).map((tile, n) => {
          const [x, y] = SLOTS[region][Math.min(n, SLOTS[region].length - 1)], w = chipWidth(spec.tiles[tile].label)
          return <g key={tile} className={`sort-board__chip ${chipClass(tile)}`} role="button" tabIndex={disabled || checked ? -1 : 0} aria-label={chipLabel(tile)} aria-pressed={picked === tile} {...grab(tile)} onClick={event => event.stopPropagation()}>
            <rect x={x - w / 2} y={y - 11} width={w} height={22} rx="6" />
            <text x={x} y={y}>{spec.tiles[tile].label}</text>
          </g>
        }))}
      </svg>
      : <div className="sort-board__bins" style={{ gridTemplateColumns: `repeat(${spec.bins.length}, minmax(0, 1fr))` }}>
        {spec.bins.map(bin => <div key={bin.id} className="sort-board__bin" data-sort-bin={bin.id} onClick={() => { if (picked !== null) put(picked, bin.id) }}>
          <span className="sort-board__bin-name">{bin.label}</span>
          {inPlace(bin.id).map(tile => <button key={tile} type="button" className={chipClass(tile)} aria-label={chipLabel(tile)} aria-pressed={picked === tile} disabled={disabled || checked} {...grab(tile)} onClick={event => event.stopPropagation()}>{spec.tiles[tile].label}</button>)}
        </div>)}
      </div>}

    <div className="sort-board__tray" data-sort-tray="" onClick={() => { if (picked !== null && place[picked]) put(picked, null) }}>
      {tray.map(tile => <button key={tile} type="button" className={chipClass(tile)} aria-label={chipLabel(tile)} aria-pressed={picked === tile} disabled={disabled || checked} {...grab(tile)} onClick={event => event.stopPropagation()}>{spec.tiles[tile].label}</button>)}
      {!tray.length && <span className="sort-board__empty">{play || checked ? 'All placed' : 'All placed. Tap one to move it.'}</span>}
    </div>

    {picked !== null && !checked && <div className="sort-board__moves" role="group" aria-label={`Put ${spec.tiles[picked].label} in`}>
      {places.map(p => <button key={p.id} type="button" className="angle-board__side" onClick={() => put(picked, p.id)}>{p.label}</button>)}
      {place[picked] && <button type="button" className="angle-board__side" onClick={() => put(picked, null)}>Back</button>}
    </div>}

    <p className="angle-board__sum sort-board__sum" id={`${id}-sum`} aria-live="polite">
      {checked ? `${place.filter((p, k) => p === spec.tiles[k].to).length} of ${spec.tiles.length} in the right place`
        : note || (picked !== null ? `${spec.tiles[picked].label}: where does it go?` : `${done} of ${spec.tiles.length} placed`)}
    </p>
    {drag?.moved && <span className="sort-board__ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">{spec.tiles[drag.tile].label}</span>}
  </div>
}
