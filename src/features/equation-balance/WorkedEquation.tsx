import type { CSSProperties } from 'react'
import type { WorkingLine } from './equalityLesson'
import './WorkedEquation.css'

function WorkedEquation({ lines }: { lines: WorkingLine[] }) {
  return (
    <ol className="worked-equation" aria-label="Worked solution">
      {lines.map((line, index) => (
        <li
          className={line.accent ? 'worked-equation__line worked-equation__line--accent' : 'worked-equation__line'}
          key={line.equation}
          style={{ '--line-index': index } as CSSProperties}
        >
          <span className="worked-equation__math" aria-label={line.equation}>
            {line.parts
              ? line.parts.map((part, partIndex) => {
                  const classes = [
                    'worked-equation__part',
                    part.change && `worked-equation__part--${part.change}`,
                    part.cancelled && 'worked-equation__part--cancelled',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <span
                      aria-hidden="true"
                      className={classes}
                      key={`${part.text}-${partIndex}`}
                    >
                      {part.text}
                    </span>
                  )
                })
              : line.equation}
          </span>
          <span className="worked-equation__note">{line.note}</span>
        </li>
      ))}
    </ol>
  )
}

export default WorkedEquation
