'use client'

import { useState } from 'react'

const wholePlaces = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions']
const decimalPlaces = ['tenths', 'hundredths', 'thousandths', 'ten-thousandths', 'hundred-thousandths']

type Cell = { digit: string; digitIndex: number; place: string; unit: number; decimalPoint?: boolean }

export function getPlaceValueCells(value: string): Cell[] {
  const normalized = value.replace(/[ ,]/g, '')
  const [whole, fraction = ''] = normalized.split('.')
  const cells: Cell[] = []
  let digitIndex = 0
  whole.split('').forEach((digit, index) => {
    const power = whole.length - index - 1
    cells.push({ digit, digitIndex, place: wholePlaces[power] ?? `10 to the power ${power}`, unit: 10 ** power })
    digitIndex += 1
  })
  if (fraction) cells.push({ digit: '.', digitIndex: -1, place: 'decimal point', unit: 0, decimalPoint: true })
  fraction.split('').forEach((digit, index) => {
    cells.push({ digit, digitIndex, place: decimalPlaces[index] ?? `10 to the power minus ${index + 1}`, unit: 10 ** -(index + 1) })
    digitIndex += 1
  })
  return cells
}

function formatCellValue(cell: Cell) {
  const amount = Number(cell.digit) * cell.unit
  if (amount >= 1) return amount.toLocaleString('en-GB')
  const places = cell.unit === 0 ? 0 : Math.max(0, Math.round(-Math.log10(cell.unit)))
  return amount.toFixed(places)
}

export function PlaceValueChart({ value, highlightIndices = [], interactive = false, initialSelectedIndex, showReadout = false, revealReadoutOnAnswer = false, hideZeroesUntilReveal = false, equation, revealedEquation, compact = false, revealed }: {
  value: string
  highlightIndices?: number[]
  interactive?: boolean
  initialSelectedIndex?: number
  showReadout?: boolean
  revealReadoutOnAnswer?: boolean
  hideZeroesUntilReveal?: boolean
  equation?: string
  revealedEquation?: string
  compact?: boolean
  revealed: boolean
}) {
  const cells = getPlaceValueCells(value)
  const firstDigit = cells.find((cell) => !cell.decimalPoint)?.digitIndex ?? 0
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex ?? highlightIndices[0] ?? firstDigit)
  const selectedCell = cells.find((cell) => cell.digitIndex === selectedIndex && !cell.decimalPoint)
  const canShowReadout = showReadout && (!revealReadoutOnAnswer || revealed)

  return (
    <figure className={`place-value-chart ${compact ? 'place-value-chart--compact' : ''}`}>
      <div className="place-value-chart__scroller" tabIndex={0} aria-label="Scrollable place-value chart">
        <table>
          <caption className="sr-only">Place-value chart for {value}. The decimal point is fixed between ones and tenths.</caption>
          <thead><tr>{cells.map((cell, index) => <th key={`${cell.place}-${index}`} scope="col" className={cell.decimalPoint ? 'place-value-chart__point' : ''}>{cell.decimalPoint ? <span aria-label="decimal point">.</span> : cell.place}</th>)}</tr></thead>
          <tbody><tr>{cells.map((cell, index) => {
            if (cell.decimalPoint) return <td key={`point-${index}`} className="place-value-chart__point" aria-label="decimal point">.</td>
            const hiddenZero = hideZeroesUntilReveal && cell.digit === '0' && !revealed
            const active = selectedIndex === cell.digitIndex && interactive
            const highlighted = highlightIndices.includes(cell.digitIndex)
            const content = hiddenZero ? <span aria-hidden="true">□</span> : cell.digit
            return <td key={`${cell.place}-${index}`} className={`${highlighted ? 'is-highlighted' : ''} ${active ? 'is-selected' : ''}`}>
              {interactive ? <button type="button" aria-pressed={active} aria-label={`Digit ${cell.digit}, ${cell.place} place`} onClick={() => setSelectedIndex(cell.digitIndex)}>{content}</button> : <span aria-label={hiddenZero ? `empty ${cell.place} column` : `digit ${cell.digit}`}>{content}</span>}
            </td>
          })}</tr></tbody>
        </table>
      </div>
      {canShowReadout && selectedCell && <div className="place-value-chart__readout" aria-live="polite">
        <span><small>Digit</small><strong>{selectedCell.digit}</strong></span>
        <span><small>Place</small><strong>{selectedCell.place}</strong></span>
        <span><small>Value</small><strong>{formatCellValue(selectedCell)}</strong></span>
      </div>}
      {(equation || (revealed && revealedEquation)) && <figcaption className="place-value-chart__equation">{revealed && revealedEquation ? revealedEquation : equation}</figcaption>}
    </figure>
  )
}
