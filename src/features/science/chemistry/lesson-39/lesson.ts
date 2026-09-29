import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { fractionFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.7.1.2 Fractional distillation of crude oil into fractions of hydrocarbons with similar boiling points, as on the supplied revision page' }
const skill = 'C-FRACTIONAL-DISTILLATION'
const column = author(skill, ['5.7.1.2'], ['aqa-chemistry'])
const why = author(skill, ['5.7.1.2'], ['aqa-chemistry'])
const fractions = author(skill, ['5.7.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const fractionSections = [
  { id: 'C39-01', label: 'Start here', detail: 'Why crude oil cannot go in a fuel tank' },
  { id: 'C39-02', label: 'How does the column work?', detail: 'Heat the oil, then cool it as it rises' },
  { id: 'C39-05', label: 'Why do the fractions separate?', detail: 'Chain length and boiling point' },
  { id: 'C39-08', label: 'What comes out?', detail: 'The main fractions and their uses' },
  { id: 'C39-11', label: 'On your own', detail: 'Reading the column and explaining it' },
]

const states: ScienceState[] = [
  { ...column.choice('C39-01', 'You cannot pour crude oil straight into a car. What is the main reason?', ['It is a solid at room temperature', 'It is a mixture of many hydrocarbons that have to be separated first', 'It is only one hydrocarbon, and too thick', 'It contains no hydrocarbons at all'], 1, 'Think about what crude oil is made of.', ['Crude oil is a mixture of lots of different hydrocarbons.', 'They have different properties, so they are separated before they are used.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(column, 'C39-02', 'How does the column work?'),
  column.choice('C39-03', 'Which part of the fractionating column is the hottest?', ['The top', 'The middle', 'The bottom', 'It is the same temperature all the way up'], 2, 'The hot vapours enter near the bottom, and it gets cooler as you go up.', ['The column is very hot at the bottom.', 'It gets cooler towards the top.'], 'recall'),
  column.choice('C39-04', 'What is a fraction in fractional distillation?', ['A group of hydrocarbons with similar boiling points, collected together', 'A single pure hydrocarbon', 'A gas that escapes from the column', 'A part of the column that is cooled'], 0, 'The crude oil is split into parts.', ['A fraction is one part of the crude oil.', 'It is a mixture of hydrocarbons with similar boiling points.']),
  t(why, 'C39-05', 'Why do the fractions separate?'),
  why.choice('C39-06', 'A hydrocarbon has short molecules and a low boiling point. Where does it condense?', ['Near the bottom, where it is very hot', 'It never condenses', 'In the middle, always', 'Near the top, where it is cool'], 3, 'A gas only condenses when it is cooler than its boiling point.', ['A low boiling point means it stays a gas until it is cool.', 'It is cool only near the top of the column.']),
  why.choice('C39-07', 'Why do hydrocarbons with long molecules leave the column near the bottom?', ['They are lighter than the others', 'Their high boiling points mean they condense while it is still hot', 'They evaporate first', 'They do not enter the column'], 1, 'Long chain, high boiling point.', ['Long molecules have high boiling points.', 'They turn back to liquid early, low down, where the column is still hot.'], 'understanding'),
  t(fractions, 'C39-08', 'What comes out?'),
  fractions.choice('C39-09', 'Which fraction has the shortest molecules?', ['LPG', 'Petrol', 'Diesel oil', 'Bitumen'], 0, 'It leaves from the very top.', ['LPG comes out at the top of the column.', 'It has about 3 carbon atoms per molecule, the fewest of the main fractions.'], 'recall'),
  fractions.choice('C39-10', 'Which list is in order from the top of the column downwards?', ['Diesel oil, kerosene, petrol', 'Kerosene, petrol, diesel oil', 'Petrol, kerosene, diesel oil', 'Diesel oil, petrol, kerosene'], 2, 'Shortest molecules are at the top.', ['Petrol has the shortest molecules of the three, so it is highest.', 'Kerosene is next and diesel oil is lowest.']),
  column.choice('C39-11', 'The diagram shows a fractionating column with four numbered outlets. Which outlet collects the fraction with the lowest boiling points?', ['Outlet 1', 'Outlet 2', 'Outlet 4', 'Outlet 3'], 3, 'The lowest boiling points condense in the coolest part.', ['Outlet 3 is at the top, where it is coolest.', 'Only hydrocarbons with low boiling points are still vapour that high up.'], 'understanding', true, 'frac-q-column'),
  why.choice('C39-12', 'Three fractions boil at about 30 °C (X), 180 °C (Y) and 350 °C (Z). Which leaves highest up the column?', ['Z', 'X', 'Y', 'They all leave at the same height'], 1, 'Lowest boiling point, highest up.', ['X has the lowest boiling point, so it condenses only where it is coolest.', 'That is nearest the top of the column.'], 'dataInterpretation', true),
  why.choice('C39-13', 'Why do short-chain hydrocarbons reach the top of the column before they condense?', ['Their low boiling points keep them as gases until it is cool', 'They are heavier than long chains', 'They react with the air', 'They are not hydrocarbons'], 0, 'Boiling point decides where a gas turns into a liquid.', ['Short chains have low boiling points.', 'So they stay as gases until they reach the cool top.'], 'understanding', true),
  fractions.choice('C39-14', 'A fraction has about 30 carbon atoms per molecule. Compared with diesel oil (about 20), where does it leave?', ['Higher up, because it has a lower boiling point', 'At the same height as diesel oil', 'Lower down, because it has a higher boiling point', 'It cannot be separated'], 2, 'More carbon atoms means a longer chain.', ['A longer chain has a higher boiling point.', 'So it condenses earlier, lower down the column.'], 'application', true),
  column.written('C39-15', 'Explain why the fraction with about 40 carbon atoms leaves near the bottom of the column but LPG leaves at the top.', 'Chain length, boiling point, then temperature in the column.', 'The molecules with about 40 carbon atoms are long, so they have high boiling points. They condense while the column is still hot, so they leave near the bottom. LPG molecules are short, so they have low boiling points. They stay as gases until they reach the cool top of the column.', ['Long molecules (about 40 carbons) have high boiling points.', 'They condense near the bottom, where the column is still hot.', 'LPG molecules are short and have low boiling points.', 'LPG stays a gas until the cool top of the column, where it condenses.', 'The temperature of the column falls going up.'], ['Saying the long molecules evaporate first.', 'Saying the fractions are separated by their colour or thickness only.', 'Saying the bottom of the column is cool.']),
]

export const lessonC39: ScienceLesson = {
  id: 'C-ORG-039-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Fractional distillation', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
