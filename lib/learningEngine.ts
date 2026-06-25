// lib/learningEngine.ts
//
// Leitner review scheduling, now feeding the 5-state mastery model
// (Locked/Learning/Practising/Strong/Mastered) computed in
// JourneyMap.resolveStatuses. Box drives Strong vs Mastered;
// first-attempt-area accuracy (computed in JourneyMap) drives
// Learning/Practising/Strong.
//
// Box advancement is gated on real elapsed time: a skill can only move
// to a higher box once its current due_at has actually passed. This is
// what makes "Mastered" (box >= MASTERED_MIN_BOX) trustworthy at read
// time without any further timing check — by construction, a skill
// can't reach that box without real days having passed since the
// previous box was set.

const BOX_INTERVALS_DAYS = [0, 1, 3, 7, 21]; // index = box number (1-4 used)

export const MASTERED_MIN_BOX = 3;

export function nextBox(currentBox: number, isCorrect: boolean): number {
  if (!isCorrect) return 1; // drop back to shortest interval, not zero — it's still "known"
  return Math.min(currentBox + 1, BOX_INTERVALS_DAYS.length - 1);
}

export function nextDueDate(box: number, from: Date = new Date()): Date {
  const days = BOX_INTERVALS_DAYS[box] ?? 1;
  const due = new Date(from);
  due.setDate(due.getDate() + days);
  return due;
}

// True once `dueAt` is in the past relative to `now`. Used to decide
// whether a correct review attempt represents genuine retrieval after
// the scheduled gap, vs an early repeat that shouldn't advance the box.
export function hasIntervalElapsed(dueAt: string | Date, now: Date = new Date()): boolean {
  const due = typeof dueAt === "string" ? new Date(dueAt) : dueAt;
  return due.getTime() <= now.getTime();
}