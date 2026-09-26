import { lesson1 } from './lesson-1/lesson'
import { lesson2 } from './lesson-2/lesson'
import { lesson3 } from './lesson-3/lesson'
import { lesson4 } from './lesson-4/lesson'
import { lesson5 } from './lesson-5/lesson'
import { lesson6 } from './lesson-6/lesson'
import { lesson7 } from './lesson-7/lesson'
import { lesson8 } from './lesson-8/lesson'
import { lesson9 } from './lesson-9/lesson'
import { lesson10 } from './lesson-10/lesson'
import { lesson11 } from './lesson-11/lesson'
import { lesson12 } from './lesson-12/lesson'
import { lesson13 } from './lesson-13/lesson'
import { lesson14 } from './lesson-14/lesson'
import { lesson15 } from './lesson-15/lesson'
import { lesson16 } from './lesson-16/lesson'
import { lesson17 } from './lesson-17/lesson'
import { lesson18 } from './lesson-18/lesson'
import { lesson19 } from './lesson-19/lesson'
import { lesson20 } from './lesson-20/lesson'
import { lesson21 } from './lesson-21/lesson'
import { lesson22 } from './lesson-22/lesson'
import { lesson23 } from './lesson-23/lesson'
import { lesson24 } from './lesson-24/lesson'
import { lesson25 } from './lesson-25/lesson'
import { lesson26 } from './lesson-26/lesson'

export type LessonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26
export const scienceChapters = [
  { code: 'B1', title: 'Cell biology', lessonNumbers: [1, 2, 3, 4, 5, 6] },
  { code: 'B2', title: 'Organisation', lessonNumbers: [7, 8, 9, 10, 11, 12] },
  { code: 'B2b', title: 'Health and disease', lessonNumbers: [13, 14, 15, 16] },
  { code: 'B2c', title: 'Plant organisation', lessonNumbers: [17, 18] },
  { code: 'B3', title: 'Infection and response', lessonNumbers: [19, 20, 21, 22, 23, 24, 25] },
  { code: 'B4', title: 'Bioenergetics', lessonNumbers: [26] },
] as const
// The Science catalogue: 26 Biology lessons in the easier wording (formerly "Variant B").
// Lesson IDs keep their -B suffix so progress saved on testers' devices still loads.
export const scienceLessons = [
  { number: 1, title: 'Cells', detail: 'Animal, plant and bacterial cells', lesson: lesson1 },
  { number: 2, title: 'Microscopy', detail: 'Magnification, resolution and measurements', lesson: lesson2 },
  { number: 3, title: 'Practical skills', detail: 'Prepare a slide, observe and draw', lesson: lesson3 },
  { number: 4, title: 'Specialisation', detail: 'Different cells, different jobs', lesson: lesson4 },
  { number: 5, title: 'Cell division', detail: 'Chromosomes, mitosis and stem cells', lesson: lesson5 },
  { number: 6, title: 'Transport and exchange', detail: 'Diffusion, osmosis and active transport', lesson: lesson6 },
  { number: 7, title: 'Organisation', detail: 'Cells, tissues, organs and organ systems', lesson: lesson7 },
  { number: 8, title: 'Enzymes', detail: 'Catalysts, active sites, pH and reaction rates', lesson: lesson8 },
  { number: 9, title: 'Digestion and food tests', detail: 'Digestive enzymes, bile and practical tests', lesson: lesson9 },
  { number: 10, title: 'The lungs', detail: 'Airways, alveoli and gas exchange', lesson: lesson10 },
  { number: 11, title: 'Circulatory system: the heart', detail: 'Double circulation, chambers and major vessels', lesson: lesson11 },
  { number: 12, title: 'Circulatory system: blood vessels', detail: 'Arteries, veins, capillaries and flow rate', lesson: lesson12 },
  { number: 13, title: 'Blood', detail: 'Red cells, white cells, platelets and plasma', lesson: lesson13 },
  { number: 14, title: 'Cardiovascular disease', detail: 'Coronary disease and treatment choices', lesson: lesson14 },
  { number: 15, title: 'Health and disease', detail: 'Well-being, disease types and interactions', lesson: lesson15 },
  { number: 16, title: 'Risk factors and cancer', detail: 'Evidence, tumour types and non-communicable disease', lesson: lesson16 },
  { number: 17, title: 'Plant tissues and the leaf', detail: 'Plant organs, leaf layers, xylem and phloem', lesson: lesson17 },
  { number: 18, title: 'Water and food on the move', detail: 'Transpiration, stomata and translocation', lesson: lesson18 },
  { number: 19, title: 'Pathogens and how disease spreads', detail: 'Four pathogens, three routes and how to stop them', lesson: lesson19 },
  { number: 20, title: 'Diseases people pass on', detail: 'Salmonella, gonorrhoea, measles and HIV', lesson: lesson20 },
  { number: 21, title: 'Plant diseases and malaria', detail: 'TMV, rose black spot and malaria', lesson: lesson21 },
  { number: 22, title: 'How your body defends itself', detail: 'Barriers, white blood cells, antibodies and antitoxins', lesson: lesson22 },
  { number: 23, title: 'Vaccination', detail: 'Immunity, vaccines and protecting everyone', lesson: lesson23 },
  { number: 24, title: 'Medicines and where they come from', detail: 'Painkillers, antibiotics, resistance and drugs from plants', lesson: lesson24 },
  { number: 25, title: 'Testing new drugs', detail: 'Preclinical tests, clinical trials, placebos and peer review', lesson: lesson25 },
  { number: 26, title: 'Photosynthesis and what plants do with glucose', detail: 'The word equation, chloroplasts and five uses of glucose', lesson: lesson26 },
] as const
export function scienceHubHref() { return '/preview?subject=science' }
export function scienceLessonHref(number: LessonNumber, activity?: string | null) {
  return `/preview/science?lesson=${number}${activity ? '&activity=' + encodeURIComponent(activity) : ''}`
}
export function parseScienceLesson(value: string | string[] | undefined): LessonNumber | null {
  return ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26'].includes(typeof value === 'string' ? value : '') ? Number(value) as LessonNumber : null
}
