import type { VennDiagram as Venn } from './types'

/** Two overlapping circles of prime factors, drawn like the exam's. */
export function VennDiagram({ diagram }: { diagram: Venn }) {
  const column = (values: number[], x: number) => values.map((value, i) => <text key={i} x={x} y={105 + (i - (values.length - 1) / 2) * 26}>{value}</text>)
  const label = `Venn diagram. Only in ${diagram.left}: ${diagram.onlyLeft.join(', ')}. In both: ${diagram.both.join(', ')}. Only in ${diagram.right}: ${diagram.onlyRight.join(', ')}.`
  return <svg className="pr-venn" viewBox="0 0 320 200" role="img" aria-label={label}>
    <circle cx="122" cy="105" r="82" className="pr-venn__left" />
    <circle cx="198" cy="105" r="82" className="pr-venn__right" />
    <text x="62" y="20" className="pr-venn__label">{diagram.left}</text>
    <text x="258" y="20" className="pr-venn__label">{diagram.right}</text>
    <g className="pr-venn__values">
      {column(diagram.onlyLeft, 82)}
      {column(diagram.both, 160)}
      {column(diagram.onlyRight, 238)}
    </g>
  </svg>
}
