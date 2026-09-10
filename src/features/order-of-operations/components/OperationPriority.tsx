import { MathSpan } from '../../../../components/MathText'

const rows = [
  { letter: 'B', meaning: 'Brackets', example: '(4+1)' },
  { letter: 'I', meaning: 'Indices', example: '3^2' },
  { letter: 'DM', meaning: 'Divide or multiply, left to right', example: '24\\div6\\times2' },
  { letter: 'AS', meaning: 'Add or subtract, left to right', example: '10-6+2' },
]

export function OperationPriority({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={`operation-priority${compact ? ' operation-priority--compact' : ''}`}>
      <table>
        <thead>
          <tr><th scope="col">Letter</th><th scope="col">Meaning</th><th scope="col">Example</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.letter}>
              <th scope="row"><span>{row.letter}</span></th>
              <td>{row.meaning}</td>
              <td><MathSpan latex={row.example} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="sr-only">
        Brackets, then indices. Division and multiplication have equal priority and are evaluated left to right.
        Addition and subtraction have equal priority and are evaluated left to right.
      </figcaption>
    </figure>
  )
}
