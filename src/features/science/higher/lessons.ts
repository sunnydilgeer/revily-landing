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
import { lessonC22H, acidStrengthSections } from '../chemistry/lesson-22h/lesson'
import { acidStrengthFrames } from '../chemistry/lesson-22h/teachingFrames'
import { lessonC25H, redoxSections } from '../chemistry/lesson-25h/lesson'
import { redoxFrames } from '../chemistry/lesson-25h/teachingFrames'
import { lessonC36H, equilibriumSections } from '../chemistry/lesson-36h/lesson'
import { equilibriumFrames } from '../chemistry/lesson-36h/teachingFrames'
import { lessonC30H, bondEnergySections } from '../chemistry/lesson-30h/lesson'
import { bondEnergyFrames } from '../chemistry/lesson-30h/teachingFrames'
import { lessonC50H, copperSections } from '../chemistry/lesson-50h/lesson'
import { copperFrames } from '../chemistry/lesson-50h/teachingFrames'
import type { ScienceCatalogueEntry } from '../lessonNavigation'

export const higherLessons: readonly ScienceCatalogueEntry[] = [
  // Chemistry C3, between Lesson 20 (When mass seems to change) and Lesson 21 (Concentration of solutions).
  { subject: 'chemistry', number: 20.5, label: '20H', higherOnly: true, folder: '20h', title: 'Moles', detail: 'Avogadro’s constant and the number of moles', lesson: lessonC20H, sections: moleSections, frames: moleFrames },
  // Chemistry C4, between Lesson 22 (Acids, alkalis and pH) and Lesson 23 (salts).
  { subject: 'chemistry', number: 22.5, label: '22H', higherOnly: true, folder: '22h', title: 'Strong and weak acids', detail: 'Ionisation, pH steps and strength versus concentration', lesson: lessonC22H, sections: acidStrengthSections, frames: acidStrengthFrames },
  // Chemistry C4, between Lesson 25 (metals with acids and water, displacement) and Lesson 26 (electrolysis).
  { subject: 'chemistry', number: 25.5, label: '25H', higherOnly: true, folder: '25h', title: 'Redox and ionic equations', detail: 'Electrons lost and gained, half equations and ionic equations', lesson: lessonC25H, sections: redoxSections, frames: redoxFrames },
  // Chemistry C5, between Lesson 30 (reaction profiles) and Lesson 31 (rates of reaction, a new chapter).
  { subject: 'chemistry', number: 30.5, label: '30H', higherOnly: true, folder: '30h', title: 'Bond energies', detail: 'Bonds broken minus bonds made', lesson: lessonC30H, sections: bondEnergySections, frames: bondEnergyFrames },
  // Chemistry C6, between Lesson 36 (reversible reactions and equilibrium) and Lesson 37 (hydrocarbons).
  { subject: 'chemistry', number: 36.5, label: '36H', higherOnly: true, folder: '36h', title: 'Le Chatelier’s principle', detail: 'How temperature, pressure and concentration move an equilibrium', lesson: lessonC36H, sections: equilibriumSections, frames: equilibriumFrames },
  // Chemistry C10, between Lesson 50 (Reuse and recycling) and Lesson 51 (Life cycle assessments).
  { subject: 'chemistry', number: 50.5, label: '50H', higherOnly: true, folder: '50h', title: 'Extracting copper', detail: 'Low-grade ores, bioleaching and phytomining', lesson: lessonC50H, sections: copperSections, frames: copperFrames },
]
