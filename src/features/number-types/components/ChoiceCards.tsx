import type { NumberOption } from '../types'
import { NumberCard } from './NumberCard'

export function ChoiceCards({ options, selected, disabled, onToggle }: {
  options: NumberOption[]
  selected: string[]
  disabled: boolean
  onToggle: (id: string) => void
}) {
  return (
    <div className="choice-cards" role="group" aria-label="Answer choices">
      {options.map((option) => (
        <NumberCard
          key={option.id}
          label={option.label}
          detail={option.detail}
          selected={selected.includes(option.id)}
          disabled={disabled}
          onClick={() => onToggle(option.id)}
        />
      ))}
    </div>
  )
}
