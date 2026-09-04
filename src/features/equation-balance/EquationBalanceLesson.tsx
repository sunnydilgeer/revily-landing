'use client'

import { useMemo, useState, type FormEvent } from 'react'
import EquationBalance, { type BalanceExpression } from './EquationBalance'
import WorkedEquation from './WorkedEquation'
import {
  equalityLesson,
  type LessonChoice,
  type LessonStep,
} from './equalityLesson'
import './EquationBalanceLesson.css'

type Side = 'left' | 'right'
type FeedbackTone = 'success' | 'hint'

const emptyExpression: BalanceExpression = { unitCount: 0 }

function cloneExpression(expression?: BalanceExpression): BalanceExpression {
  return { ...(expression ?? emptyExpression) }
}

function EquationBalanceLesson() {
  const [stepIndex, setStepIndex] = useState(0)
  const step = equalityLesson.steps[stepIndex]
  const [left, setLeft] = useState(() => cloneExpression(step.left))
  const [right, setRight] = useState(() => cloneExpression(step.right))
  const [leftChanged, setLeftChanged] = useState(false)
  const [rightChanged, setRightChanged] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>('hint')
  const [resolved, setResolved] = useState(step.type === 'explain')
  const [answer, setAnswer] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [workingLineCount, setWorkingLineCount] = useState(1)

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / equalityLesson.steps.length) * 100),
    [stepIndex],
  )

  function loadStep(nextIndex: number) {
    const nextStep = equalityLesson.steps[nextIndex]
    setStepIndex(nextIndex)
    setLeft(cloneExpression(nextStep.left))
    setRight(cloneExpression(nextStep.right))
    setLeftChanged(false)
    setRightChanged(false)
    setFeedback(null)
    setFeedbackTone('hint')
    setResolved(nextStep.type === 'explain')
    setAnswer('')
    setAttempts(0)
    setWorkingLineCount(1)
  }

  function continueLesson() {
    if (stepIndex < equalityLesson.steps.length - 1) {
      loadStep(stepIndex + 1)
    }
  }

  function chooseAnswer(choice: LessonChoice) {
    if (resolved) return

    setFeedback(choice.feedback)
    setFeedbackTone(choice.correct ? 'success' : 'hint')
    setAttempts((count) => count + 1)

    if (choice.correct) {
      setResolved(true)
    }
  }

  function breakBalance(side: Side, amount: number) {
    if (resolved) return

    changeSide(side, amount)
    setResolved(true)
    setFeedbackTone('hint')
    setFeedback(
      'The balance tips. One side is now worth less, so the equals sign is no longer true.',
    )
  }

  function changeSide(side: Side, amount: number) {
    const update = (current: BalanceExpression) => ({
      ...current,
      unitCount: Math.max(0, current.unitCount - amount),
    })

    if (side === 'left') {
      setLeft(update)
    } else {
      setRight(update)
    }
  }

  function makeMatchingMove(side: Side, amount: number) {
    if (side === 'left' && !leftChanged) {
      changeSide('left', amount)
      setLeftChanged(true)

      if (rightChanged) {
        completeMatchingMove()
      } else {
        setFeedbackTone('hint')
        setFeedback('One side has changed. Now take 1 from the right too.')
      }
      return
    }

    if (side === 'right' && !rightChanged) {
      changeSide('right', amount)
      setRightChanged(true)

      if (leftChanged) {
        completeMatchingMove()
      } else {
        setFeedbackTone('hint')
        setFeedback('One side has changed. Now take 1 from the left too.')
      }
    }
  }

  function completeMatchingMove() {
    setResolved(true)
    setFeedbackTone('success')
    setFeedback(
      'Both sides are worth 4. You changed them in the same way, so they are still equal.',
    )
  }

  function revealWorkingLine() {
    if (step.type !== 'worked' || resolved) return

    const nextCount = Math.min(workingLineCount + 1, step.working.length)
    setWorkingLineCount(nextCount)

    if (nextCount === step.working.length) {
      setResolved(true)
    }
  }

  function submitNumber(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step.type !== 'number' || resolved) return

    const numericAnswer = Number(answer)
    setAttempts((count) => count + 1)

    if (answer.trim() !== '' && numericAnswer === step.answer) {
      setResolved(true)
      setFeedbackTone('success')
      setFeedback(step.success)
      return
    }

    setFeedbackTone('hint')
    setFeedback(
      step.diagnostics?.[String(numericAnswer)] ??
        step.hints[Math.min(attempts, step.hints.length - 1)],
    )
  }

  function restartLesson() {
    loadStep(0)
  }

  const showBalance = step.visual && step.left && step.right

  return (
    <section
      className="concept-card equation-lesson"
      id="lesson"
      aria-labelledby="lesson-title"
    >
      <header className="concept-card-header">
        <div>
          <span className="lesson-kicker">Interactive lesson</span>
          <span id="lesson-title">{equalityLesson.title}</span>
        </div>

        <span className="status-pill">
          {stepIndex + 1} / {equalityLesson.steps.length}
        </span>
      </header>

      <div
        className="lesson-progress"
        role="progressbar"
        aria-label={`${step.label}. ${progress}% complete`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="lesson-stage" key={step.id}>
        <p className="lesson-stage-label">{step.label}</p>

        {showBalance && (
          <EquationBalance
            left={left}
            right={right}
            variableValue={step.variableValue}
          />
        )}

        {!showBalance && step.equation && step.type !== 'complete' && (
          <div
            className="equation-focus"
            aria-label={`Current equation: ${step.equation}`}
          >
            <span>{step.equation}</span>
          </div>
        )}

        <div className="lesson-prompt">
          <h2>{step.title}</h2>
          <p className="lesson-instruction">{step.instruction}</p>

          <StepActivity
            step={step}
            answer={answer}
            leftChanged={leftChanged}
            rightChanged={rightChanged}
            resolved={resolved}
            onAnswerChange={setAnswer}
            onBreak={breakBalance}
            onChoice={chooseAnswer}
            onMatchingMove={makeMatchingMove}
            onNumberSubmit={submitNumber}
            onRestart={restartLesson}
            onRevealWorking={revealWorkingLine}
            workingLineCount={workingLineCount}
          />

          {feedback && (
            <div
              className={`lesson-feedback lesson-feedback--${feedbackTone}`}
              role={feedbackTone === 'success' ? 'status' : 'alert'}
              key={`${step.id}-${attempts}-${feedback}`}
            >
              <span aria-hidden="true">{feedbackTone === 'success' ? '✓' : '→'}</span>
              <p>{feedback}</p>
            </div>
          )}

          {resolved && step.type !== 'complete' && (
            <button
              className="lesson-continue"
              type="button"
              onClick={continueLesson}
            >
              {stepIndex === 0 ? 'Start lesson' : 'Continue'}
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

type StepActivityProps = {
  step: LessonStep
  answer: string
  leftChanged: boolean
  rightChanged: boolean
  resolved: boolean
  onAnswerChange: (value: string) => void
  onBreak: (side: Side, amount: number) => void
  onChoice: (choice: LessonChoice) => void
  onMatchingMove: (side: Side, amount: number) => void
  onNumberSubmit: (event: FormEvent<HTMLFormElement>) => void
  onRestart: () => void
  onRevealWorking: () => void
  workingLineCount: number
}

function StepActivity({
  step,
  answer,
  leftChanged,
  rightChanged,
  resolved,
  onAnswerChange,
  onBreak,
  onChoice,
  onMatchingMove,
  onNumberSubmit,
  onRestart,
  onRevealWorking,
  workingLineCount,
}: StepActivityProps) {
  if (step.type === 'choice') {
    return (
      <div className="lesson-actions lesson-actions--stacked">
        {step.choices.map((choice) => (
          <button
            className="lesson-button"
            disabled={resolved}
            key={choice.id}
            onClick={() => onChoice(choice)}
            type="button"
          >
            {choice.label}
          </button>
        ))}
      </div>
    )
  }

  if (step.type === 'break') {
    return (
      <div className="lesson-actions">
        <button
          className="lesson-button"
          disabled={resolved}
          onClick={() => onBreak('left', step.amount)}
          type="button"
        >
          Remove {step.amount} from left
        </button>
        <button
          className="lesson-button"
          disabled={resolved}
          onClick={() => onBreak('right', step.amount)}
          type="button"
        >
          Remove {step.amount} from right
        </button>
      </div>
    )
  }

  if (step.type === 'matching') {
    return (
      <div className="lesson-actions">
        <MatchingButton
          amount={step.amount}
          changed={leftChanged}
          side="left"
          onMove={onMatchingMove}
        />
        <MatchingButton
          amount={step.amount}
          changed={rightChanged}
          side="right"
          onMove={onMatchingMove}
        />
      </div>
    )
  }

  if (step.type === 'worked') {
    const nextLine = step.working[workingLineCount]

    return (
      <div className="worked-example">
        <WorkedEquation lines={step.working.slice(0, workingLineCount)} />
        {!resolved && nextLine && (
          <>
            <p className="worked-prediction">
              What do you think the next line will be?
            </p>
            <button
              className="lesson-button worked-example__reveal"
              onClick={onRevealWorking}
              type="button"
            >
              {nextLine.revealLabel ?? 'Reveal the next line'}
              <span aria-hidden="true">↓</span>
            </button>
          </>
        )}
      </div>
    )
  }

  if (step.type === 'number') {
    return (
      <form className="number-answer" onSubmit={onNumberSubmit}>
        <label htmlFor={`answer-${step.id}`}>{step.suffix ?? 'Answer'}</label>
        <input
          id={`answer-${step.id}`}
          inputMode="numeric"
          pattern="-?[0-9]*"
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
          disabled={resolved}
          aria-describedby={`instruction-${step.id}`}
        />
        <button
          className="lesson-button lesson-button--primary"
          disabled={resolved || answer.trim() === ''}
          type="submit"
        >
          Check answer
        </button>
        <span className="sr-only" id={`instruction-${step.id}`}>
          Enter a number, then check your answer.
        </span>
      </form>
    )
  }

  if (step.type === 'complete') {
    return (
      <div className="lesson-complete">
        <div className="lesson-complete__badge" aria-hidden="true">
          <span>✓</span>
        </div>
        <p className="lesson-complete__rule">Do the same operation to both sides.</p>
        <ul>
          <li>Saw what the equals sign means</li>
          <li>Followed the method one line at a time</li>
          <li>Chose steps that keep both sides equal</li>
          <li>Solved equations without the balance</li>
          <li>Used the rule in a real problem</li>
        </ul>
        <button
          className="lesson-button lesson-button--primary"
          onClick={onRestart}
          type="button"
        >
          Practise again
        </button>
      </div>
    )
  }

  return null
}

function MatchingButton({
  amount,
  changed,
  side,
  onMove,
}: {
  amount: number
  changed: boolean
  side: Side
  onMove: (side: Side, amount: number) => void
}) {
  return (
    <button
      className="lesson-button"
      disabled={changed}
      onClick={() => onMove(side, amount)}
      type="button"
    >
      {changed
        ? `Subtracted ${amount} from ${side}`
        : `Subtract ${amount} from ${side}`}
    </button>
  )
}

export default EquationBalanceLesson
