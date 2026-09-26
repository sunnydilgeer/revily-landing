/*
 * Science revision cards: authored key facts per lesson, plus a few lesson questions that work as flashcards.
 * DRAFT: awaiting a qualified science teacher's review, like the lessons themselves.
 */

/** [front (a short question), back (the answer), note (optional: a common mix-up to avoid)] */
export type ScienceKeyFact = [front: string, back: string, note?: string]

export type ScienceFactSet = {
  /** The lesson's id, e.g. 'B-CELL-001B-B'. */
  lessonId: string
  /** Section start-state id (from the lesson's *Sections export) → the key facts that section teaches. */
  sections: Record<string, ScienceKeyFact[]>
  /** Ids of 2–4 choice questions in this lesson that still make sense as a stand-alone flashcard. */
  recall: string[]
}
