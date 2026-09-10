type Props = {
  known: { left: string; right: string; product: string }
  target: { left: string; right: string; product?: string }
  leftScale: number
  rightScale: number
  revealOnAnswer?: boolean
  revealed: boolean
}

export function MultiplicationScale({ known, target, leftScale, rightScale, revealOnAnswer = false, revealed }: Props) {
  const showProduct = !revealOnAnswer || revealed
  const totalScale = leftScale * rightScale
  return <figure className="multiplication-scale">
    <div className="multiplication-scale__equation"><span>{known.left}</span><b>×</b><span>{known.right}</span><b>=</b><strong>{known.product}</strong></div>
    <div className="multiplication-scale__arrows" aria-hidden="true"><span>× {leftScale}</span><span>× {rightScale}</span><span>× {totalScale}</span></div>
    <div className="multiplication-scale__equation multiplication-scale__equation--target"><span>{target.left}</span><b>×</b><span>{target.right}</span><b>=</b><strong>{showProduct ? target.product ?? '?' : '?'}</strong></div>
    <figcaption>The factors scale by {leftScale} and {rightScale}, so the product scales by {totalScale}.</figcaption>
  </figure>
}
