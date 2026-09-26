'use client'

import { useStudyTimer } from './useStudy'
import type { Subject } from './subject'

/** Counts study minutes on pages that live outside the main app, such as the Science lesson player. */
export default function StudyTimer({ subject }: { subject: Subject }) {
  useStudyTimer(true, subject)
  return null
}
