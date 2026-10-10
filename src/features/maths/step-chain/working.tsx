'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Every worked example has the same two parts (Sunny, 10 Oct): the diagram, which stays put, and the working, which
 * rolls like film credits (WorkedChain.tsx). A renderer draws its diagram as usual and wraps the step's heading, lines
 * and answer in <Working>; they are drawn in the worked example's working window, in the order they are written.
 * Outside a worked example (no window) the working is drawn where it stands.
 */
export const WorkingWindow = createContext<HTMLElement | null | undefined>(undefined)

export function Working({ children }: { children: ReactNode }) {
  const target = useContext(WorkingWindow)
  if (target === undefined) return <>{children}</>
  // Inside the window, a nested <Working> (a step's "why" within its board) just draws in place.
  return target ? createPortal(<WorkingWindow.Provider value={undefined}>{children}</WorkingWindow.Provider>, target) : null
}
