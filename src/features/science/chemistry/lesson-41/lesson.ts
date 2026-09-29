import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { purityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.8.1.1 Pure substances and 5.8.1.2 Formulations (chemical meaning of pure, melting and boiling point data, formulations), as on the supplied revision page' }
const skill = 'C-PURITY'
const meaning = author(skill, ['5.8.1.1'], ['aqa-chemistry'])
const points = author(skill, ['5.8.1.1'], ['aqa-chemistry'])
const form = author(skill, ['5.8.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const puritySections = [
  { id: 'C41-01', label: 'Start here', detail: 'What does "pure" mean?' },
  { id: 'C41-02', label: 'What is a pure substance?', detail: 'Everyday and chemical meanings' },
  { id: 'C41-05', label: 'How pure is it?', detail: 'Melting and boiling points' },
  { id: 'C41-08', label: 'What is a formulation?', detail: 'Mixtures with exact amounts' },
  { id: 'C41-11', label: 'On your own', detail: 'Purity tests and formulations' },
]

const states: ScienceState[] = [
  { ...meaning.choice('C41-01', 'A carton says "pure apple juice". It has nothing added, but it contains water, sugars and flavour chemicals. Is it pure in the chemist\'s sense?', ['Yes, because nothing was added', 'No, because it is a mixture of different substances', 'Yes, because it is a liquid', 'No, because it is cold'], 1, 'A chemist asks whether there is only one substance in it.', ['In everyday life, pure can mean nothing has been added.', 'A chemist means only one element or compound, so a juice with many substances is a mixture.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'C41-02', 'What is a pure substance?'),
  meaning.choice('C41-03', 'What does pure mean in chemistry?', ['Nothing has been added to it', 'It has been cleaned', 'It contains only one element or compound', 'It is found in nature'], 2, 'Think about how many different substances there are.', ['A pure substance contains only one element or only one compound.', 'It is not mixed with anything else, all the way through.'], 'recall'),
  meaning.choice('C41-04', 'Which of these is a pure substance?', ['Sea water', 'Air', 'Distilled water with nothing else in it', 'Milk'], 2, 'Three of these are mixtures of several substances.', ['Sea water, air and milk each contain several different substances, so they are mixtures.', 'Water with nothing else in it contains only one compound, so it is pure.'], 'application'),
  t(points, 'C41-05', 'How pure is it?'),
  points.choice('C41-06', 'A pure substance melts or boils at...', ['a range of temperatures', 'any temperature', 'the same temperature as every other substance', 'one specific temperature'], 3, 'Pure water always boils at the same value.', ['A chemically pure substance melts or boils at a specific temperature.', 'You can look the value up in a data book.'], 'recall'),
  points.choice('C41-07', 'Which result shows that a sample is likely to be more pure?', ['Its melting point is close to the data book value', 'Its melting point is far from the data book value', 'It melts over a wide range of temperatures', 'It is a liquid at room temperature'], 0, 'Compare your value with the pure substance.', ['The closer the measured value is to the data book value, the purer the sample.', 'A wide melting range is a sign of impurities.']),
  t(form, 'C41-08', 'What is a formulation?'),
  form.choice('C41-09', 'What is a formulation?', ['A pure element', 'A mixture made to a recipe for a particular use', 'Any mixture found in nature', 'A substance that melts at one temperature'], 1, 'Think about a recipe with exact amounts.', ['A formulation is a mixture designed for a particular use.', 'It is made by following a formula, with each part measured carefully.'], 'recall'),
  form.choice('C41-10', 'In paint, which part holds the pigment in place after painting?', ['The pigment', 'The solvent', 'The additive', 'The binder'], 3, 'Think about what makes the colour stay on the wall.', ['The pigment gives the colour and the solvent makes the paint runny.', 'The binder holds the pigment in place once the paint has been applied.'], 'application'),
  meaning.choice('C41-11', 'A sample of a compound melts between 118 °C and 124 °C. The pure compound melts at 128 °C. What does this suggest?', ['The sample is pure', 'The sample contains impurities', 'The sample is a formulation', 'The data book is wrong'], 1, 'Look at the range and at how it compares with 128 °C.', ['The sample melts across a range, not at one temperature.', 'It also melts lower than the pure value, so it contains impurities.'], 'dataInterpretation', true, 'pure-q-melting'),
  points.choice('C41-12', 'The boiling point of pure ethanol is 78 °C. Sample X boils at 78 °C and sample Y boils at 84 °C. Which is likely to be purer?', ['Sample Y', 'Sample X', 'They are equally pure', 'Neither, because both boiled'], 1, 'Which value is closer to the pure boiling point?', ['Sample X matches the pure value exactly.', 'Impurities raise the boiling point, so sample Y is less pure.'], 'application', true),
  form.choice('C41-13', 'Why are the amounts of each ingredient in a medicine tablet measured carefully?', ['So the tablet has the right properties to work as it should', 'So the tablet is a pure substance', 'So the tablet melts at a fixed temperature', 'So the ingredients react with each other'], 0, 'Think about what the exact amounts control.', ['A formulation is made from measured amounts of each part.', 'This gives the product the properties it needs to do its job.'], 'understanding', true),
  meaning.choice('C41-14', 'Which of these is a formulation?', ['Pure gold', 'Distilled water', 'A cleaning spray made from measured ingredients', 'Oxygen gas'], 2, 'Look for the mixture made to a recipe.', ['Gold, distilled water and oxygen are each one substance.', 'A cleaning spray is a mixture made from measured ingredients for a purpose, so it is a formulation.'], 'application', true),
  meaning.written('C41-15', 'A student makes a sample of a solid. Explain how the student could find out how pure it is, and what the result would show.', 'Think about melting point, data book and what impurities do.', 'The student can measure the melting point of the sample and compare it with the value for the pure substance in a data book. The closer the two values are, the purer the sample is. If the sample is impure, it will melt at a lower temperature than the pure substance and may melt across a range of temperatures.', ['Measure the melting point of the sample.', 'Compare it with the data book value for the pure substance.', 'The closer the values, the purer the sample.', 'Impurities lower the melting point.', 'Impurities can make the sample melt across a range of temperatures.'], ['Saying an impure sample melts at a higher temperature.', 'Saying a pure substance melts across a range.', 'Saying pure means nothing has been added.']),
]

export const lessonC41: ScienceLesson = {
  id: 'C-ANA-041-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Purity and formulations', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
