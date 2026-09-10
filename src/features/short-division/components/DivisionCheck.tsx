export function DivisionCheck({ dividend, divisor, quotient, remainder, revealOnAnswer = false, revealed }: {
  dividend: number
  divisor: number
  quotient: number
  remainder: number
  revealOnAnswer?: boolean
  revealed: boolean
}) {
  const showCheck = !revealOnAnswer || revealed
  return (
    <figure className="division-check">
      <div className="division-check__flow" aria-hidden={!showCheck}>
        <span><small>quotient</small>{showCheck ? quotient : '?'}</span>
        <b>×</b>
        <span><small>divisor</small>{showCheck ? divisor : '?'}</span>
        <b>+</b>
        <span><small>remainder</small>{showCheck ? remainder : '?'}</span>
        <b>=</b>
        <span className="division-check__dividend"><small>dividend</small>{showCheck ? dividend : '?'}</span>
      </div>
      {showCheck && <figcaption>{`(${quotient} × ${divisor}) + ${remainder} = ${dividend}, and ${remainder} < ${divisor}.`}</figcaption>}
      {!showCheck && <figcaption className="sr-only">Choose the calculation that checks the division. The completed check is hidden until submission.</figcaption>}
    </figure>
  )
}
