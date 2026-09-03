import { useState } from 'react'
import './EquationBalanceLesson.css'

type LessonStage = 'identify' | 'break' | 'preserve' | 'complete'
type Side = 'left' | 'right'

const STARTING_COUNT = 5

function NumberTiles({ count }: { count: number }) {
  return (
    <div className="number-tiles" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span className="number-tile" key={index}>
          1
        </span>
      ))}
    </div>
  )
}

function EquationBalanceLesson() {
  const [stage, setStage] = useState<LessonStage>('identify')
  const [leftCount, setLeftCount] = useState(STARTING_COUNT)
  const [rightCount, setRightCount] = useState(STARTING_COUNT)
  const [feedback, setFeedback] = useState(
    'Count the blocks on each side before choosing.',
  )
  const [canContinue, setCanContinue] = useState(false)
  const [leftRemoved, setLeftRemoved] = useState(false)
  const [rightRemoved, setRightRemoved] = useState(false)

  const balanceState =
    leftCount === rightCount
      ? 'balanced'
      : leftCount > rightCount
        ? 'left-heavy'
        : 'right-heavy'

  const progress =
    stage === 'identify' ? 1 : stage === 'break' ? 2 : 3

  const equationSymbol = balanceState === 'balanced' ? '=' : '≠'

  function answerEquality(answer: 'equal' | 'not-equal') {
    if (answer === 'equal') {
      setFeedback(
        'Correct. Both sides contain five blocks, so they have the same value.',
      )
      setCanContinue(true)
      return
    }

    setFeedback(
      'Not quite. Count each side again: both sides contain five blocks.',
    )
  }

  function removeForBreak(side: Side) {
    if (canContinue) {
      return
    }

    if (side === 'left') {
      setLeftCount((count) => count - 1)
    } else {
      setRightCount((count) => count - 1)
    }

    setFeedback(
      'One side changed, but the other did not. The two sides are no longer equal.',
    )
    setCanContinue(true)
  }

  function removeForPreserve(side: Side) {
    if (side === 'left' && !leftRemoved) {
      const completesAction = rightRemoved

      setLeftCount((count) => count - 1)
      setLeftRemoved(true)

      if (completesAction) {
        setStage('complete')
        setFeedback(
          'You removed one block from both sides, so equality was preserved.',
        )
      } else {
        setFeedback(
          'The balance has tilted. What matching action is needed on the right?',
        )
      }
    }

    if (side === 'right' && !rightRemoved) {
      const completesAction = leftRemoved

      setRightCount((count) => count - 1)
      setRightRemoved(true)

      if (completesAction) {
        setStage('complete')
        setFeedback(
          'You removed one block from both sides, so equality was preserved.',
        )
      } else {
        setFeedback(
          'The balance has tilted. What matching action is needed on the left?',
        )
      }
    }
  }

  function continueLesson() {
    if (stage === 'identify') {
      setStage('break')
      setFeedback('Remove one block from either side and watch what happens.')
    }

    if (stage === 'break') {
      setStage('preserve')
      setLeftCount(STARTING_COUNT)
      setRightCount(STARTING_COUNT)
      setLeftRemoved(false)
      setRightRemoved(false)
      setFeedback(
        'Remove one block from both sides to keep the balance equal.',
      )
    }

    setCanContinue(false)
  }

  function restartLesson() {
    setStage('identify')
    setLeftCount(STARTING_COUNT)
    setRightCount(STARTING_COUNT)
    setLeftRemoved(false)
    setRightRemoved(false)
    setCanContinue(false)
    setFeedback('Count the blocks on each side before choosing.')
  }

  return (
    <section className="concept-card equation-lesson">
      <div className="concept-card-header">
        <span>Equality as balance</span>
        <span className="status-pill">
          Step {progress} of 3
        </span>
      </div>

      <div
        className={`equation-preview balance-visual balance-visual--${balanceState}`}
        role="img"
        aria-label={`The left side has ${leftCount} blocks. The right side has ${rightCount} blocks. The balance is ${balanceState.replace('-', ' ')}.`}
      >
        <div className="balance-beam" />

        <div className="balance-pivot" aria-hidden="true">
          <span />
        </div>

        <div className="balance-pans">
          <div className="balance-pan balance-pan--left">
            <span className="pan-label">Left side</span>
            <NumberTiles count={leftCount} />
          </div>

          <div className="balance-pan balance-pan--right">
            <span className="pan-label">Right side</span>
            <NumberTiles count={rightCount} />
          </div>
        </div>
      </div>

      <div className="equation-readout" aria-hidden="true">
        <strong>{leftCount}</strong>
        <span>{equationSymbol}</span>
        <strong>{rightCount}</strong>
      </div>

      <div className="lesson-prompt">
        {stage === 'identify' && (
          <>
            <h2>Do both sides have the same value?</h2>

            <div className="lesson-actions">
              <button
                className="lesson-button lesson-button--primary"
                type="button"
                onClick={() => answerEquality('equal')}
              >
                Equal
              </button>

              <button
                className="lesson-button"
                type="button"
                onClick={() => answerEquality('not-equal')}
              >
                Not equal
              </button>
            </div>
          </>
        )}

        {stage === 'break' && (
          <>
            <h2>Change only one side</h2>

            <div className="lesson-actions">
              <button
                className="lesson-button"
                type="button"
                disabled={canContinue}
                onClick={() => removeForBreak('left')}
              >
                Remove 1 from left
              </button>

              <button
                className="lesson-button"
                type="button"
                disabled={canContinue}
                onClick={() => removeForBreak('right')}
              >
                Remove 1 from right
              </button>
            </div>
          </>
        )}

        {stage === 'preserve' && (
          <>
            <h2>Keep the balance equal</h2>

            <div className="lesson-actions">
              <button
                className="lesson-button"
                type="button"
                disabled={leftRemoved}
                onClick={() => removeForPreserve('left')}
              >
                {leftRemoved ? 'Removed from left' : 'Remove 1 from left'}
              </button>

              <button
                className="lesson-button"
                type="button"
                disabled={rightRemoved}
                onClick={() => removeForPreserve('right')}
              >
                {rightRemoved ? 'Removed from right' : 'Remove 1 from right'}
              </button>
            </div>
          </>
        )}

        {stage === 'complete' && (
          <>
            <h2>The balance stayed equal</h2>

            <button
              className="lesson-button"
              type="button"
              onClick={restartLesson}
            >
              Try it again
            </button>
          </>
        )}

        <p className="lesson-feedback" aria-live="polite">
          {feedback}
        </p>

        {canContinue && (
          <button
            className="lesson-continue"
            type="button"
            onClick={continueLesson}
          >
            Continue
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  )
}

export default EquationBalanceLesson