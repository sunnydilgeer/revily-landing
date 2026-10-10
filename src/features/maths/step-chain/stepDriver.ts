'use client'

import { createContext } from 'react'

/**
 * A worked example on a lesson's teaching screen hands its "Next step" to the lesson's bottom bar, so the screen has
 * one button to press: it says "Show the first step" / "Next step" until the working is all shown, then "Continue".
 * Outside a lesson (practice, boss fights, working opened after an answer) there is no driver and the chain keeps its own button.
 */
export type StepDriver = { label: string; next: () => void }

export const StepDriverContext = createContext<((driver: StepDriver | null) => void) | null>(null)
