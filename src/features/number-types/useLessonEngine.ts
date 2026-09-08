'use client'

import { useMemo, useState } from 'react'
import { checkAnswer, formatAcceptedAnswer } from './lessonMath'
import type { FeedbackDefinition, LessonDefinition, MicroSkillId, MicroSkillProgress, StateAttempt } from './types'

type FeedbackState = FeedbackDefinition & { correct: boolean; correctAnswer?: string }

export function useLessonEngine(lesson: LessonDefinition) {
  const [currentId, setCurrentId] = useState(lesson.states[0].id)
  const [history, setHistory] = useState<string[]>([])
  const [selection, setSelection] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [pendingTarget, setPendingTarget] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<Record<string, StateAttempt>>({})
  const [lessonState, setLessonState] = useState<Record<string, boolean | number | string>>({})
  const [completed, setCompleted] = useState(false)

  const stateIndex = Math.max(0, lesson.states.findIndex((state) => state.id === currentId))
  const state = lesson.states[stateIndex]

  function resetResponse() {
    setSelection([])
    setInputValue('')
    setFeedback(null)
    setPendingTarget(null)
  }

  function goTo(targetId: string) {
    if (!lesson.states.some((candidate) => candidate.id === targetId)) return
    setHistory((items) => [...items, currentId])
    setCurrentId(targetId)
    resetResponse()
  }

  function continueLesson() {
    if (completed) {
      restart()
      return
    }
    if (pendingTarget) {
      goTo(pendingTarget)
      return
    }
    if (state.interaction.type === 'continue') {
      setAttempts((current) => ({
        ...current,
        [state.id]: { attempts: 1, correct: true, correctFirstTry: true, usedHint: false },
      }))
      if (state.stateUpdate) setLessonState((current) => ({ ...current, ...state.stateUpdate }))
    }
    const target = state.transition.onComplete ?? lesson.states[stateIndex + 1]?.id
    if (target) goTo(target)
  }

  function submit() {
    const response = state.interaction.type === 'numericInput'
      ? inputValue
      : state.interaction.type === 'select'
        ? selection[0]
        : selection
    const correct = checkAnswer(state.interaction, response)
    const previous = attempts[state.id]
    const nextAttemptCount = (previous?.attempts ?? 0) + 1
    setAttempts((current) => ({
      ...current,
      [state.id]: {
        attempts: nextAttemptCount,
        correct: previous?.correct || correct,
        correctFirstTry: previous?.correctFirstTry || (correct && nextAttemptCount === 1),
        usedHint: previous?.usedHint || !correct || state.phase === 'repair',
      },
    }))
    const definition = correct ? state.feedback?.correct : state.feedback?.incorrect
    setFeedback({
      correct,
      message: definition?.message ?? (correct ? 'Correct.' : 'Here’s the answer.'),
      evidence: definition?.evidence,
      visualAction: definition?.visualAction,
      followUpPrompt: definition?.followUpPrompt,
      correctAnswer: correct ? undefined : formatAcceptedAnswer(state.interaction),
    })
    const nextState = state.transition.onComplete ?? lesson.states[stateIndex + 1]?.id
    const target = correct
      ? state.transition.onCorrect ?? nextState
      : state.transition.onIncorrect ?? nextState
    setPendingTarget(target ?? null)
    if (correct && state.stateUpdate) setLessonState((current) => ({ ...current, ...state.stateUpdate }))
    if (!target && stateIndex === lesson.states.length - 1) setCompleted(true)
  }

  function back() {
    const previous = history.at(-1)
    if (!previous) return
    setHistory((items) => items.slice(0, -1))
    setCurrentId(previous)
    resetResponse()
    setCompleted(false)
  }

  function restart() {
    setCurrentId(lesson.states[0].id)
    setHistory([])
    setAttempts({})
    setLessonState({})
    setCompleted(false)
    resetResponse()
  }

  function toggleOption(id: string) {
    if (feedback) return
    if (state.interaction.type === 'select') {
      setSelection([id])
      return
    }
    setSelection((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }

  const progress = useMemo(() => deriveProgress(lesson, attempts), [lesson, attempts])
  const coreStateIds = new Set(lesson.states.filter((candidate) => candidate.phase !== 'repair').map((candidate) => candidate.id))
  const percentComplete = Math.round((Object.entries(attempts).filter(([id, attempt]) => coreStateIds.has(id) && attempt.correct).length / coreStateIds.size) * 100)

  return {
    state,
    stateIndex,
    selection,
    inputValue,
    feedback,
    attempts,
    lessonState,
    progress,
    percentComplete,
    completed,
    canGoBack: history.length > 0,
    setInputValue,
    toggleOption,
    submit,
    back,
    continueLesson,
  }
}

function deriveProgress(lesson: LessonDefinition, attempts: Record<string, StateAttempt>): MicroSkillProgress[] {
  const ids = [...new Set(lesson.states.map((state) => state.microSkillId))]
  return ids.map((microSkillId) => {
    const relevant = lesson.states.filter((state) => state.microSkillId === microSkillId)
    const attempted = relevant.filter((state) => attempts[state.id])
    const independentCorrect = relevant.filter((state) =>
      ['independent', 'transfer', 'mastery'].includes(state.phase) && attempts[state.id]?.correct,
    ).length
    const sensitive = relevant.filter((state) => state.analytics?.misconceptionId)
    const finalSensitiveCorrect = sensitive.length === 0 || Boolean(attempts[sensitive.at(-1)!.id]?.correct)
    const teachingComplete = relevant.filter((state) => state.phase === 'teach').every((state) => attempts[state.id]?.correct)
    const masteryStatus = attempted.length === 0
      ? 'not_started'
      : teachingComplete && independentCorrect >= Math.min(2, relevant.filter((state) => state.phase === 'independent').length) && finalSensitiveCorrect
        ? 'secure_initial'
        : 'learning'
    return {
      microSkillId: microSkillId as MicroSkillId,
      attempts: attempted.reduce((sum, item) => sum + attempts[item.id].attempts, 0),
      correctFirstTry: attempted.filter((item) => attempts[item.id].correctFirstTry).length,
      correctAfterHint: attempted.filter((item) => attempts[item.id].correct && attempts[item.id].usedHint).length,
      misconceptionIdsTriggered: [...new Set(attempted.filter((item) => attempts[item.id].usedHint).map((item) => item.analytics?.misconceptionId).filter(Boolean) as string[])],
      independentItemsCorrect: independentCorrect,
      masteryStatus,
    }
  })
}
