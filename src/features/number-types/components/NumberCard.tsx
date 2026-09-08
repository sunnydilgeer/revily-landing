type NumberCardProps = {
  label: string
  detail?: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function NumberCard({ label, detail, selected = false, disabled = false, onClick }: NumberCardProps) {
  return (
    <button
      type="button"
      className={`number-card${selected ? ' number-card--selected' : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="number-card__value">{label}</span>
      {detail && <span className="number-card__detail">{detail}</span>}
      <span className="number-card__check" aria-hidden="true">{selected ? '✓' : ''}</span>
    </button>
  )
}
