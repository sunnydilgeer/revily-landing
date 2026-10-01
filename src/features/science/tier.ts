/*
 * Foundation or Higher. There is one set of Science lessons. A Higher student gets every Foundation
 * screen plus the Higher-only sections in `higher/additions.ts`. A Foundation student gets the
 * catalogue exactly as authored: `forTier(entry, 'foundation')` returns the same entry object, so
 * Higher screens never reach Foundation (no hints, no section titles, no progress counts).
 *
 * A lesson with Higher sections gets its own content version ("0.2.0-higher"), which gives it its own
 * saved session. Switching tier never mixes the two sessions or makes one invalid.
 */
import { sampledRequirements } from './lessonAuthoring'
import { higherAdditions } from './higher/additions'
import type { ScienceCatalogueEntry } from './lessonNavigation'

export type ScienceTier = 'foundation' | 'higher'
export const SCIENCE_TIER_KEY = 'revily:science-tier:v1'

export function readScienceTier(): ScienceTier {
  try { return window.localStorage.getItem(SCIENCE_TIER_KEY) === 'higher' ? 'higher' : 'foundation' }
  catch { return 'foundation' }
}
export function saveScienceTier(tier: ScienceTier) {
  try { window.localStorage.setItem(SCIENCE_TIER_KEY, tier) }
  catch { /* The choice still applies on this page; it just won't be remembered. */ }
}

/** Every Higher-only screen id. */
export const higherStateIds: ReadonlySet<string> = new Set(higherAdditions.flatMap(add => add.states.map(state => state.id)))

const higherEntries = new Map<ScienceCatalogueEntry, ScienceCatalogueEntry>()

/** The lesson as a student on `tier` sees it. Foundation always gets the entry unchanged. */
export function forTier(entry: ScienceCatalogueEntry, tier: ScienceTier): ScienceCatalogueEntry {
  if (tier !== 'higher') return entry
  const adds = higherAdditions.filter(add => add.lessonId === entry.lesson.id)
  if (adds.length === 0) return entry
  const cached = higherEntries.get(entry)
  if (cached) return cached
  const states = [...entry.lesson.states]
  for (const add of adds) {
    const at = states.findIndex(state => state.id === add.before)
    if (at < 0) throw new Error(`Higher section ${add.section.id} is placed before ${add.before}, which is not in ${entry.lesson.id}`)
    states.splice(at, 0, ...add.states)
  }
  const higher: ScienceCatalogueEntry = {
    ...entry,
    lesson: { ...entry.lesson, contentVersion: `${entry.lesson.contentVersion}-higher`, states, requirements: sampledRequirements(states) },
    sections: [...entry.sections, ...adds.map(add => add.section)],
    frames: Object.assign({}, entry.frames, ...adds.map(add => add.frames)),
  }
  higherEntries.set(entry, higher)
  return higher
}
