'use client'

import { ChevronLeft, ChevronRight, Lightbulb, RotateCcw } from 'lucide-react'
import { useState } from 'react'

type Segment = {
  text: string
  superscript?: string
  suffix?: string
  highlight?: 'brackets' | 'indices' | 'divide' | 'multiply' | 'addition' | 'resolved' | 'subtract' | 'scan' | 'answer'
}

type WorkedStep = {
  eyebrow: string
  title: string
  explanation: string
  segments: Segment[]
  rail: 'brackets' | 'indices' | 'multiply' | 'add-sub' | 'answer'
}

const bracketsIndicesSteps: WorkedStep[] = [
  {
    eyebrow: 'Step 1 · Brackets',
    title: 'Open a calculation zone',
    explanation: 'Everything inside the brackets must be completed before the operations outside them.',
    rail: 'brackets',
    segments: [
      { text: '8 + 3 × (' },
      { text: '5', superscript: '2', suffix: ' − 21', highlight: 'brackets' },
      { text: ')' },
    ],
  },
  {
    eyebrow: 'Step 2 · Indices',
    title: 'Resolve the index',
    explanation: 'Inside the brackets, the index has the highest priority: 5² = 25.',
    rail: 'indices',
    segments: [
      { text: '8 + 3 × (' },
      { text: '5', superscript: '2', highlight: 'indices' },
      { text: ' − 21)' },
    ],
  },
  {
    eyebrow: 'Step 3 · Subtraction',
    title: 'Finish inside the brackets',
    explanation: 'The index is resolved, so complete the subtraction inside the brackets: 25 − 21 = 4.',
    rail: 'add-sub',
    segments: [
      { text: '8 + 3 × (' },
      { text: '25 − 21', highlight: 'subtract' },
      { text: ')' },
    ],
  },
  {
    eyebrow: 'Step 4 · Brackets complete',
    title: 'Collapse the finished zone',
    explanation: 'The complete bracket has become a single value: 4.',
    rail: 'brackets',
    segments: [
      { text: '8 + 3 × ' },
      { text: '(4)', highlight: 'resolved' },
    ],
  },
  {
    eyebrow: 'Step 5 · Multiplication',
    title: 'Resolve the multiplication',
    explanation: 'Multiplication has priority over the addition outside the bracket: 3 × 4 = 12.',
    rail: 'multiply',
    segments: [
      { text: '8 + ' },
      { text: '3 × 4', highlight: 'multiply' },
    ],
  },
  {
    eyebrow: 'Step 6 · Addition',
    title: 'Resolve the full expression',
    explanation: 'Now the highlight expands to the final operation: 8 + 12 = 20.',
    rail: 'add-sub',
    segments: [{ text: '8 + 12', highlight: 'addition' }],
  },
  {
    eyebrow: 'Complete',
    title: 'The expression is resolved',
    explanation: 'The structure has disappeared because no operations remain.',
    rail: 'answer',
    segments: [{ text: '20', highlight: 'answer' }],
  },
]

const allBidmasSteps: WorkedStep[] = [
  {
    eyebrow: 'Scan 1 · Brackets',
    title: 'Do you see any brackets?',
    explanation: 'Yes. The brackets create a calculation zone, so everything inside (4² + 3) must be completed first.',
    rail: 'brackets',
    segments: [
      { text: '72 ÷ 3 × 2 − (' },
      { text: '4', superscript: '2', suffix: ' + 3', highlight: 'brackets' },
      { text: ') + 5' },
    ],
  },
  {
    eyebrow: 'Step 1 · Indices',
    title: 'There is a weird raised number',
    explanation: 'Inside the brackets, calculate the index first: 4² means 4 × 4, which is 16.',
    rail: 'indices',
    segments: [
      { text: '72 ÷ 3 × 2 − (' },
      { text: '4', superscript: '2', highlight: 'indices' },
      { text: ' + 3) + 5' },
    ],
  },
  {
    eyebrow: 'Step 2 · Addition in brackets',
    title: 'Now calculate the bracket',
    explanation: 'The index has become 16. Finish the calculation inside the brackets: 16 + 3 = 19.',
    rail: 'add-sub',
    segments: [
      { text: '72 ÷ 3 × 2 − (' },
      { text: '16 + 3', highlight: 'addition' },
      { text: ') + 5' },
    ],
  },
  {
    eyebrow: 'Scan 2 · Indices',
    title: 'Do you see any indices now?',
    explanation: 'No. The bracket is complete and no raised powers remain. Division, multiplication, subtraction and addition are left.',
    rail: 'brackets',
    segments: [
      { text: '72 ÷ 3 × 2 − ' },
      { text: '(19)', highlight: 'resolved' },
      { text: ' + 5' },
    ],
  },
  {
    eyebrow: 'Step 3 · Division',
    title: 'Which operation comes next?',
    explanation: 'Follow the BIDMAS order. Division and multiplication share priority, so work from the left: 72 ÷ 3 = 24.',
    rail: 'multiply',
    segments: [
      { text: '' },
      { text: '72 ÷ 3', highlight: 'divide' },
      { text: ' × 2 − 19 + 5' },
    ],
  },
  {
    eyebrow: 'Step 4 · Multiplication',
    title: 'Keep moving from left to right',
    explanation: 'Multiplication is now the next equal-priority operation: 24 × 2 = 48.',
    rail: 'multiply',
    segments: [
      { text: '' },
      { text: '24 × 2', highlight: 'multiply' },
      { text: ' − 19 + 5' },
    ],
  },
  {
    eyebrow: 'Scan 3 · Addition and subtraction',
    title: 'You can see plus and minus',
    explanation: 'Addition and subtraction also share priority. Read from left to right, so the subtraction comes first.',
    rail: 'add-sub',
    segments: [{ text: '48 − 19 + 5', highlight: 'scan' }],
  },
  {
    eyebrow: 'Step 5 · Subtraction',
    title: 'Resolve the leftmost operation',
    explanation: 'Calculate 48 − 19 = 29. Keep the remaining + 5 in place.',
    rail: 'add-sub',
    segments: [
      { text: '48 − 19', highlight: 'subtract' },
      { text: ' + 5' },
    ],
  },
  {
    eyebrow: 'Step 6 · Addition',
    title: 'One final operation',
    explanation: 'Only addition remains: 29 + 5 = 34.',
    rail: 'add-sub',
    segments: [{ text: '29 + 5', highlight: 'addition' }],
  },
  {
    eyebrow: 'Complete',
    title: 'Bingo — the expression is resolved',
    explanation: 'Brackets, indices, division, multiplication, subtraction and addition have all been handled in a legal order.',
    rail: 'answer',
    segments: [{ text: '34', highlight: 'answer' }],
  },
]

const railItems = [
  { id: 'brackets', label: 'Brackets', description: 'Work inside first' },
  { id: 'indices', label: 'Indices', description: 'Powers inside the zone' },
  { id: 'multiply', label: 'Division & multiplication', description: 'Then work left to right' },
  { id: 'add-sub', label: 'Addition & subtraction', description: 'Then work left to right' },
] as const

function Expression({ segments, active }: { segments: Segment[]; active: boolean }) {
  return (
    <span className="spotlight-expression" aria-hidden="true">
      {segments.map((segment, index) => (
        <span
          className={segment.highlight ? `spotlight-token spotlight-token--${segment.highlight}${active ? ' is-active' : ''}` : undefined}
          key={`${segment.text}-${index}`}
        >
          {segment.text}{segment.superscript && <sup>{segment.superscript}</sup>}{segment.suffix}
        </span>
      ))}
    </span>
  )
}

export function BidmasSpotlight({ example = 'all-bidmas', embedded = false, onComplete }: { example?: 'all-bidmas' | 'brackets-indices'; embedded?: boolean; onComplete?: () => void }) {
  const steps = example === 'all-bidmas' ? allBidmasSteps : bracketsIndicesSteps
  const [currentStep, setCurrentStep] = useState(0)
  const current = steps[currentStep]

  const advance = () => {
    const nextStep = Math.min(steps.length - 1, currentStep + 1)
    setCurrentStep(nextStep)
    if (nextStep === steps.length - 1) onComplete?.()
  }

  const demo = (
    <section className={`spotlight-demo${embedded ? ' spotlight-demo--embedded' : ''}`} aria-labelledby="spotlight-worked-title">
      <div className="spotlight-worked">
        <div className="spotlight-worked__topline">
          <div>
            <span>{current.eyebrow}</span>
            <h2 id="spotlight-worked-title">{current.title}</h2>
          </div>
          <span className="spotlight-worked__count">{currentStep + 1} / {steps.length}</span>
        </div>

        <div className="spotlight-stack" aria-live="polite">
          <p className="sr-only">
            {current.eyebrow}. {current.title}. {current.explanation}
          </p>
          {steps.slice(0, currentStep + 1).map((step, index) => (
            <div className={`spotlight-row${index === currentStep ? ' is-current' : ''}`} key={step.eyebrow}>
              <span className="spotlight-row__number" aria-hidden="true">{index + 1}</span>
              <Expression segments={step.segments} active={index === currentStep} />
            </div>
          ))}
        </div>

        <div className="spotlight-explanation">
          <Lightbulb aria-hidden="true" size={20} />
          <p>{current.explanation}</p>
        </div>

        <div className="spotlight-controls">
          <button
            type="button"
            className="spotlight-button spotlight-button--secondary"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
          >
            <ChevronLeft aria-hidden="true" size={18} /> Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button type="button" className="spotlight-button spotlight-button--primary" onClick={advance}>
              Next step <ChevronRight aria-hidden="true" size={18} />
            </button>
          ) : (
            <button type="button" className="spotlight-button spotlight-button--primary" onClick={() => setCurrentStep(0)}>
              <RotateCcw aria-hidden="true" size={17} /> Replay
            </button>
          )}
        </div>
      </div>

      <aside className="spotlight-rail" aria-label="BIDMAS progress">
        <span className="spotlight-rail__label">BIDMAS map</span>
        <div className="spotlight-rail__items">
          {railItems.map((item) => {
            const relatedSteps = steps
              .map((step, index) => step.rail === item.id ? index : -1)
              .filter((index) => index >= 0)
            const isActive = current.rail === item.id
            const isComplete = relatedSteps.length > 0 && relatedSteps.every((index) => index < currentStep)
            return (
              <div className={`spotlight-rail__item${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`} key={item.id}>
                <span aria-hidden="true">{isComplete ? '✓' : isActive ? currentStep + 1 : '·'}</span>
                <div>
                  <b>{item.label}</b>
                  <small>{item.description}</small>
                </div>
              </div>
            )
          })}
        </div>
        <p>The coloured area changes size to show exactly which part of the expression is legal to resolve.</p>
      </aside>
    </section>
  )

  if (embedded) return demo

  return (
    <main className="spotlight-page">
      <header className="spotlight-page__header">
        <div>
          <span className="spotlight-page__kicker">Lesson 2 · Interaction prototype</span>
          <h1>Follow the changing highlight</h1>
          <p>Calculate <strong>{example === 'all-bidmas' ? '72 ÷ 3 × 2 − (4² + 3) + 5' : '8 + 3 × (5² − 21)'}</strong> one legal operation at a time.</p>
        </div>
        <a href="/preview">Return to lessons</a>
      </header>

      {demo}
    </main>
  )
}

export function BidmasSpotlightPrototype() {
  return <BidmasSpotlight />
}
