import { useId, useState } from 'react'
import { MathSpan } from '../../../../components/MathText'
import { bidmasRules, bidmasRuleNote, highlightBidmas, type BidmasContext, type BidmasRule } from './bidmasRules'

export function BidmasExpression({ math, caption, context, onConsult }: {
  math: string
  caption?: string
  context?: BidmasContext
  onConsult?: () => void
}) {
  const [selected, setSelected] = useState<BidmasRule | null>(null)
  const [hintOpen, setHintOpen] = useState(false)
  const noteId = useId()
  const panelId = `${noteId}-hint`
  const activeRule = bidmasRules.find(rule => rule.id === selected)
  return <figure className="opb-stage opb-question-stage">
    <div className="opb-math"><MathSpan latex={highlightBidmas(math, hintOpen ? selected : null, context)} display /></div>
    {caption && <figcaption>{caption}</figcaption>}
    <button className="opb-hint-toggle" type="button" aria-expanded={hintOpen} aria-controls={panelId} onClick={() => {
      setHintOpen(open => !open)
      if (!hintOpen) onConsult?.()
    }}>{hintOpen ? 'Hide hint' : 'Hint'} <span aria-hidden="true">{hintOpen ? '−' : '+'}</span></button>
    <div className="opb-reference" id={panelId} hidden={!hintOpen} aria-label="BIDMAS reference">
      <div className="opb-reference__label"><strong>BIDMAS</strong><span>Tap a rule</span></div>
      <div className="opb-reference__rules" role="group" aria-label="BIDMAS priority groups">
        {bidmasRules.map(rule => <button key={rule.id} type="button" aria-label={`${rule.letters}: ${rule.name}`} aria-pressed={selected === rule.id} aria-controls={noteId} onClick={() => {
          setSelected(previous => previous === rule.id ? null : rule.id)
        }}><strong>{rule.letters}</strong><span aria-hidden="true">{rule.symbols}</span></button>)}
      </div>
      <div className="opb-reference__note" id={noteId} aria-live="polite" aria-atomic="true">
        {activeRule && selected ? <p>{bidmasRuleNote(math, selected, context)}</p>
          : <p>Paired operations: work left to right.</p>}
      </div>
    </div>
  </figure>
}
