import { positiveMultiples } from '../lessonMath'
import type { MultipleVisual } from '../types'

export function MultipleStepper({ base, count, revealOnAnswer, revealed = true }: MultipleVisual['props'] & { revealed?: boolean }) {
  const multiples = positiveMultiples(base, count)
  if (revealOnAnswer && !revealed) {
    return (
      <figure className="multiple-stepper multiple-stepper--masked">
        <div className="multiple-stepper__track" aria-hidden="true">
          {multiples.map((_, index) => (
            <div className="multiple-step multiple-step--masked" key={index}>
              <strong>?</strong>
              <small>{base} × {index + 1}</small>
            </div>
          ))}
        </div>
        <figcaption className="sr-only">Use the first {count} entries in the {base} times table. The products are hidden until the answer is checked.</figcaption>
      </figure>
    )
  }
  return (
    <figure className="multiple-stepper">
      <div className="multiple-stepper__track" aria-hidden="true">
        {multiples.map((multiple, index) => (
          <div className="multiple-step" key={multiple}>
            {index > 0 && <span className="multiple-step__arrow">+{base} →</span>}
            <strong>{multiple}</strong>
            <small>{base} × {index + 1}</small>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">The first {count} positive multiples of {base}: {multiples.join(', ')}.</figcaption>
    </figure>
  )
}
