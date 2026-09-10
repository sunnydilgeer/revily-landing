function normalize(value: string, wholeLength: number, fractionLength: number) {
  const [whole, fraction = ''] = value.split('.')
  return `${whole.padStart(wholeLength, '0')}.${fraction.padEnd(fractionLength, '0')}`
}

export function DecimalComparison({ values, optionIds, relation, revealResultOnAnswer = true, revealed, selected = [], onSelect }: {
  values: [string, string]
  optionIds?: [string, string]
  relation?: '<' | '>' | '='
  revealResultOnAnswer?: boolean
  revealed: boolean
  selected?: string[]
  onSelect?: (id: string) => void
}) {
  const parts = values.map((value) => value.split('.'))
  const wholeLength = Math.max(...parts.map(([whole]) => whole.length))
  const fractionLength = Math.max(...parts.map(([, fraction = '']) => fraction.length))
  const normalized = values.map((value) => normalize(value, wholeLength, fractionLength)) as [string, string]
  const comparable = normalized.map((value) => value.replace('.', ''))
  const difference = [...comparable[0]].findIndex((digit, index) => digit !== comparable[1][index])
  const showResult = Boolean(revealed && revealResultOnAnswer && relation)

  return <figure className="decimal-comparison">
    {optionIds && <div className="decimal-comparison__choices" role="group" aria-label="Choose the greater number">{values.map((value, index) => <button key={value} type="button" aria-pressed={selected.includes(optionIds[index])} disabled={revealed} className={selected.includes(optionIds[index]) ? 'is-selected' : ''} onClick={() => onSelect?.(optionIds[index])}>{value}</button>)}</div>}
    <div className="decimal-comparison__scroller"><table>
      <caption className="sr-only">The decimals aligned by place value{showResult ? `; ${values[0]} ${relation} ${values[1]}` : ''}.</caption>
      <tbody>{normalized.map((value, row) => <tr key={values[row]}><th scope="row">{values[row]}</th>{[...value].map((character, index) => {
        const cellIndex = index > wholeLength ? index - 1 : index
        return character === '.' ? <td key={index} className="is-point" aria-label="decimal point">.</td> : <td key={index} className={showResult && cellIndex === difference ? 'is-first-difference' : ''}>{character}</td>
      })}</tr>)}</tbody>
    </table></div>
    {showResult && <figcaption className="decimal-comparison__result">{values[0]} <strong>{relation}</strong> {values[1]}<span>The first unequal place decides.</span></figcaption>}
  </figure>
}
