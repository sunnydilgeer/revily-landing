'use client'

import { useEffect, useState } from 'react'
import {
  RUNG_COMPLETE_EVENT, STUDY_LOG_EVENT, addStudySeconds, dayKey, lastSevenDays, readDailyGoal, readStudyLog,
  recordRungComplete, streakFrom, type StudyLog,
} from './studyLog'

const TICK_SECONDS = 15
const IDLE_AFTER_MS = 2 * 60 * 1000

/** Counts active study time while `active` is true (a lesson is open). */
export function useStudyTimer(active: boolean) {
  useEffect(() => {
    if (!active) return
    let lastInput = Date.now()
    const touch = () => { lastInput = Date.now() }
    const events = ['pointerdown', 'keydown', 'input', 'scroll'] as const
    events.forEach(name => window.addEventListener(name, touch, { passive: true }))
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInput < IDLE_AFTER_MS) addStudySeconds(TICK_SECONDS)
    }, TICK_SECONDS * 1000)
    return () => {
      window.clearInterval(timer)
      events.forEach(name => window.removeEventListener(name, touch))
    }
  }, [active])

  useEffect(() => {
    const onRung = () => recordRungComplete()
    window.addEventListener(RUNG_COMPLETE_EVENT, onRung)
    return () => window.removeEventListener(RUNG_COMPLETE_EVENT, onRung)
  }, [])
}

export type StudySummary = { goal: number; minutesToday: number; rungsToday: number; streak: number; week: ReturnType<typeof lastSevenDays> }

function summarise(log: StudyLog): StudySummary {
  const today = log[dayKey()]
  return {
    goal: readDailyGoal(),
    minutesToday: Math.floor((today?.seconds ?? 0) / 60),
    rungsToday: today?.rungs ?? 0,
    streak: streakFrom(log),
    week: lastSevenDays(log),
  }
}

const EMPTY: StudySummary = { goal: 20, minutesToday: 0, rungsToday: 0, streak: 0, week: [] }

/** Live summary of today's study, streak and goal; updates when anything is logged. */
export function useStudySummary() {
  const [summary, setSummary] = useState<StudySummary>(EMPTY)
  useEffect(() => {
    const refresh = () => setSummary(summarise(readStudyLog()))
    refresh()
    window.addEventListener(STUDY_LOG_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(STUDY_LOG_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])
  return summary
}
