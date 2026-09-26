/*
 * The sections of each Science lesson: the id of the state each one starts at, in teaching order.
 * The lesson player uses them for its contents menu; the curriculum uses them as progress pips.
 */
import type { LessonNumber } from './lessonNavigation'
import { microscopySections } from './lesson-2/lesson'
import { practicalSections } from './lesson-3/lesson'
import { specialisationSections } from './lesson-4/lesson'
import { divisionSections } from './lesson-5/lesson'
import { transportSections } from './lesson-6/lesson'
import { organisationSections } from './lesson-7/lesson'
import { enzymeSections } from './lesson-8/lesson'
import { digestionSections } from './lesson-9/lesson'
import { lungsSections } from './lesson-10/lesson'
import { heartSections } from './lesson-11/lesson'
import { vesselsSections } from './lesson-12/lesson'
import { bloodSections } from './lesson-13/lesson'
import { cardiovascularSections } from './lesson-14/lesson'
import { healthSections } from './lesson-15/lesson'
import { riskCancerSections } from './lesson-16/lesson'
import { plantTissueSections } from './lesson-17/lesson'
import { plantTransportSections } from './lesson-18/lesson'
import { pathogenSections } from './lesson-19/lesson'
import { humanDiseaseSections } from './lesson-20/lesson'
import { plantMalariaSections } from './lesson-21/lesson'
import { defenceSections } from './lesson-22/lesson'
import { vaccinationSections } from './lesson-23/lesson'
import { medicineSections } from './lesson-24/lesson'
import { drugTestingSections } from './lesson-25/lesson'
import { photosynthesisSections } from './lesson-26/lesson'

export type ScienceSection = { id: string; label: string; detail?: string }

const cellsSections = [
  { id: 'B1-01', label: 'Start here', detail: 'Your starting knowledge' },
  { id: 'B1-02', label: 'Animal cells', detail: 'Meet the cell and explore its parts' },
  { id: 'B1-05', label: 'Animal cells: energy and proteins', detail: 'Mitochondria and ribosomes' },
  { id: 'B1-10', label: 'Models and observations', detail: 'A first practical connection' },
  { id: 'B1-24', label: 'Plant cells', detail: 'Meet the cell and explore its parts' },
  { id: 'B1-42', label: 'Plant cells: more jobs', detail: 'Energy, proteins, support and food' },
  { id: 'B1-41', label: 'Compare animal and plant cells', detail: 'Observe similarities and differences' },
  { id: 'B1-27', label: 'Bacterial cells', detail: 'Meet the cell, DNA loop and plasmids' },
  { id: 'B1-22', label: 'Names for the cells', detail: 'Eukaryotic and prokaryotic' },
  { id: 'B1-29', label: 'Cell sizes and area', detail: 'Units, standard form and estimates' },
  { id: 'B1-12', label: 'Try it yourself', detail: 'Independent checks' },
  { id: 'B1-19', label: 'Exam-style transfer', detail: 'Apply and explain' },
  { id: 'B1-32', label: 'Plant, bacterial and maths checks', detail: 'Independent checks across the new scope' },
  { id: 'B1-21', label: 'Compare two cells', detail: 'Final written task' },
]

export const scienceLessonSections: Record<LessonNumber, readonly ScienceSection[]> = { 1: cellsSections, 2: microscopySections, 3: practicalSections, 4: specialisationSections, 5: divisionSections, 6: transportSections, 7: organisationSections, 8: enzymeSections, 9: digestionSections, 10: lungsSections, 11: heartSections, 12: vesselsSections, 13: bloodSections, 14: cardiovascularSections, 15: healthSections, 16: riskCancerSections, 17: plantTissueSections, 18: plantTransportSections, 19: pathogenSections, 20: humanDiseaseSections, 21: plantMalariaSections, 22: defenceSections, 23: vaccinationSections, 24: medicineSections, 25: drugTestingSections, 26: photosynthesisSections }
