/*
 * Higher-only lessons: whole lessons that only Higher students get. (Higher-only sections inside a Foundation lesson are in
 * additions.ts.) These entries are never in the subject catalogues in ../lessonNavigation.ts, so every Foundation lookup
 * (allScienceLessons, scienceLessonsFor, getScienceLesson, nextScienceLesson, parseScienceLessonRef, scienceUnits, the
 * revision decks) never sees them. The tier-aware lookups in ../tier.ts add them for Higher students only.
 *
 * Numbering: a Higher-only lesson after Lesson N has `number: N + 0.5`, so it sorts between N and N + 1 and can never clash
 * with a Foundation number, and `label: 'NH'`, which is what students see (with the Higher badge) and what the URL carries:
 * /preview/science?subject=chemistry&lesson=20H. It belongs to Lesson N's chapter. Lesson ids put an H after the number
 * (C-MOL-020H-C), so they never clash with a Foundation id.
 */
import { lessonC20H, moleSections } from '../chemistry/lesson-20h/lesson'
import { moleFrames } from '../chemistry/lesson-20h/teachingFrames'
import type { ScienceCatalogueEntry } from '../lessonNavigation'

export const higherLessons: readonly ScienceCatalogueEntry[] = [
  // Chemistry C3, between Lesson 20 (When mass seems to change) and Lesson 21 (Concentration of solutions).
  { subject: 'chemistry', number: 20.5, label: '20H', higherOnly: true, folder: '20h', title: 'Moles', detail: 'Avogadro’s constant and the number of moles', lesson: lessonC20H, sections: moleSections, frames: moleFrames },
]
