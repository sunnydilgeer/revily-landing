'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  MATHS_NAVIGATE_EVENT,
  readMathsProgress,
  saveMathsProgress,
} from '../maths/lessonProgress'
import { checkAnswer, formatAcceptedAnswer } from './lessonMath'
import type { FeedbackDefinition, LessonDefinition, MicroSkillId, MicroSkillProgress, StateAttempt } from './types'

type FeedbackState = FeedbackDefinition & { correct: boolean; correctAnswer?: string }

export function useLessonEngine(lesson: LessonDefinition) {
  const [currentId, setCurrentId] = useState(lesson.states[0].id)
  const [history, setHistory] = useState<string[]>([])
  const [selection, setSelection] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [quotientValue, setQuotientValue] = useState('')
  const [remainderValue, setRemainderValue] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [pendingTarget, setPendingTarget] = useState<string | null>(null)
  const [attempts, setAttempts] = useState<Record<string, StateAttempt>>({})
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({})
  const [lessonState, setLessonState] = useState<Record<string, boolean | number | string>>({})
  const [completed, setCompleted] = useState(false)
  const [furthestStateIndex, setFurthestStateIndex] = useState(0)
  const [progressHydrated, setProgressHydrated] = useState(false)

  const stateIndex = Math.max(0, lesson.states.findIndex((state) => state.id === currentId))
  const state = lesson.states[stateIndex]

  useEffect(() => {
    const saved = readMathsProgress()[lesson.id]
    const savedIndex = saved
      ? lesson.states.findIndex(candidate => candidate.id === saved.currentStateId)
      : -1
    if (saved && savedIndex >= 0) {
      const furthestIndex = Math.min(
        lesson.states.length - 1,
        Math.max(savedIndex, saved.furthestStateIndex),
      )
      setCurrentId(saved.currentStateId)
      setHistory(lesson.states.slice(0, savedIndex).map(candidate => candidate.id))
      setFurthestStateIndex(furthestIndex)
      setCompleted(saved.completed)
    }
    setProgressHydrated(true)
  }, [lesson])

  function resetResponse() {
    setSelection([])
    setInputValue('')
    setQuotientValue('')
    setRemainderValue('')
    setFeedback(null)
    setPendingTarget(null)
  }

  function goTo(targetId: string) {
    const targetIndex = lesson.states.findIndex((candidate) => candidate.id === targetId)
    if (targetIndex < 0) return
    setHistory((items) => [...items, currentId])
    setCurrentId(targetId)
    setFurthestStateIndex((current) => Math.max(current, targetIndex))
    resetResponse()
  }

  function navigateToReached(targetId: string) {
    const targetIndex = lesson.states.findIndex((candidate) => candidate.id === targetId)
    // Rungs are open: any screen can be reached. Jumping doesn't move the furthest-reached marker.
    if (targetIndex < 0 || targetId === currentId) return
    setHistory((items) => [...items, currentId])
    setCurrentId(targetId)
    setCompleted(false)
    resetResponse()
  }

  useEffect(() => {
    function handleNavigation(event: Event) {
      const detail = (event as CustomEvent<{ lessonId: string; stateId: string }>).detail
      if (detail?.lessonId !== lesson.id) return
      const targetIndex = lesson.states.findIndex(candidate => candidate.id === detail.stateId)
      if (targetIndex < 0 || detail.stateId === currentId) return
      setHistory(items => [...items, currentId])
      setCurrentId(detail.stateId)
      setCompleted(false)
      setSelection([])
      setInputValue('')
      setQuotientValue('')
      setRemainderValue('')
      setFeedback(null)
      setPendingTarget(null)
    }
    window.addEventListener(MATHS_NAVIGATE_EVENT, handleNavigation)
    return () => window.removeEventListener(MATHS_NAVIGATE_EVENT, handleNavigation)
  }, [currentId, furthestStateIndex, lesson])

  useEffect(() => {
    if (!progressHydrated) return
    saveMathsProgress({
      lessonId: lesson.id,
      currentStateId: state.id,
      currentStateIndex: stateIndex,
      furthestStateIndex,
      totalStates: lesson.states.length,
      currentSectionId: state.microSkillId,
      completed,
    })
  }, [completed, furthestStateIndex, lesson, progressHydrated, state.id, state.microSkillId, stateIndex])

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
        [state.id]: { attempts: 1, correct: true, correctFirstTry: true, usedHint: false, misconceptionIdsTriggered: [] },
      }))
      if (state.stateUpdate) setLessonState((current) => ({ ...current, ...state.stateUpdate }))
    }
    const target = state.transition.onComplete ?? lesson.states[stateIndex + 1]?.id
    if (target) goTo(target)
    else if (stateIndex === lesson.states.length - 1) setCompleted(true)
  }

  function gradeSelection(selectedIds: string[]) {
    const response = state.interaction.type === 'numericInput' || state.interaction.type === 'fractionInput'
      ? inputValue
      : state.interaction.type === 'quotientRemainderInput'
        ? { quotient: quotientValue, remainder: remainderValue }
      : state.interaction.type === 'order'
        ? (selectedIds.length > 0 ? selectedIds : state.interaction.initialOrder ?? [])
      : state.interaction.type === 'select'
        ? selectedIds[0]
        : selectedIds
    const correct = checkAnswer(state.interaction, response)
    const previous = attempts[state.id]
    const nextAttemptCount = (previous?.attempts ?? 0) + 1
    const selectedOption = state.interaction.type === 'select'
      ? state.interaction.options?.find((option) => option.id === selectedIds[0])
      : undefined
    const triggeredMisconception = correct ? undefined : selectedOption?.misconceptionId ?? state.analytics?.misconceptionId
    const misconceptionIdsTriggered = [
      ...(previous?.misconceptionIdsTriggered ?? []),
      ...(triggeredMisconception ? [triggeredMisconception] : []),
    ]
    setAttempts((current) => ({
      ...current,
      [state.id]: {
        attempts: nextAttemptCount,
        correct: previous?.correct || correct,
        correctFirstTry: previous?.correctFirstTry || (correct && nextAttemptCount === 1),
        usedHint: previous?.usedHint || Boolean(hintsUsed[state.id]),
        misconceptionIdsTriggered: [...new Set(misconceptionIdsTriggered)],
      },
    }))
    const definition = correct ? state.feedback?.correct : state.feedback?.incorrect
    setFeedback({
      correct,
      message: !correct && selectedOption?.feedback
        ? selectedOption.feedback
        : definition?.message ?? (correct ? 'Correct.' : 'Here’s the answer.'),
      workedExplanation: definition?.workedExplanation,
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

  function submit() {
    gradeSelection(selection)
  }

  function submitSelection(ids: string[]) {
    if (feedback || state.interaction.type !== 'select') return
    setSelection(ids)
    gradeSelection(ids)
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
    setHintsUsed({})
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

  function setOrder(ids: string[]) {
    if (feedback || state.interaction.type !== 'order') return
    setSelection(ids)
  }

  function markHintUsed() {
    setHintsUsed((current) => ({ ...current, [state.id]: true }))
  }

  const progress = useMemo(() => deriveProgress(lesson, attempts), [lesson, attempts])
  const coreStateIds = new Set(lesson.states.filter((candidate) => candidate.phase !== 'repair').map((candidate) => candidate.id))
  const percentComplete = Math.round((Object.entries(attempts).filter(([id, attempt]) => coreStateIds.has(id) && attempt.correct).length / coreStateIds.size) * 100)

  return {
    state,
    stateIndex,
    furthestStateIndex,
    selection,
    inputValue,
    quotientValue,
    remainderValue,
    feedback,
    attempts,
    lessonState,
    progress,
    percentComplete,
    completed,
    canGoBack: history.length > 0,
    setInputValue,
    setQuotientValue,
    setRemainderValue,
    toggleOption,
    setOrder,
    markHintUsed,
    submit,
    submitSelection,
    navigateToReached,
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
      misconceptionIdsTriggered: [...new Set(attempted.flatMap((item) =>
        attempts[item.id].misconceptionIdsTriggered
        ?? (attempts[item.id].usedHint && item.analytics?.misconceptionId ? [item.analytics.misconceptionId] : []),
      ))],
      independentItemsCorrect: independentCorrect,
      masteryStatus,
    }
  })
}
