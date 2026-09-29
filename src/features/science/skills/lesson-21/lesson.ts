import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsSampleFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 2.5 (sampling), AT 4 (quadrats and sampling techniques), as on the supplied revision page' }
const skill = 'W-PRC-021-W'
const a = author(skill, ['WS 2.5', 'AT 4'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const wsSampleSections = [
  { id: 'W21-01', label: 'Start here', detail: 'Counting a whole field' },
  { id: 'W21-02', label: 'Why do you take a sample?', detail: 'Populations, samples and random choice' },
  { id: 'W21-05', label: 'How do you sample a field at random?', detail: 'Grids, coordinates and bias' },
  { id: 'W21-08', label: 'How do you sample people at random?', detail: 'Records, numbers and a generator' },
  { id: 'W21-11', label: 'On your own', detail: 'Fair samples' },
]

const states: ScienceState[] = [
  { ...a.choice('W21-01', 'You want the average number of daisies per square metre in a big field. What should you do?', ['Count every daisy in the field', 'Study only the patch next to the gate', 'Count daisies in several small squares chosen across the field', 'Guess from the first patch you see'], 2, 'You cannot count everything, but you still want a fair picture.', ['Counting small squares spread across the field gives a fair picture.', 'Counting every daisy would take far too long.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W21-02', 'Why do you take a sample?'),
  a.choice('W21-03', 'Why do scientists take a sample instead of studying a whole population?', ['It is usually not possible to study every single one', 'Samples always give exact results', 'Populations are always too small', 'Samples never need counting'], 0, 'Think about how big a population can be.', ['A population is usually far too big to study every member.', 'So a sample is studied and used to draw conclusions.'], 'understanding'),
  a.choice('W21-04', 'What must a sample do to be useful?', ['Be as small as possible', 'Come from one easy place', 'Be picked to match what you expect', 'Represent the whole population'], 3, 'You want to say something about everybody, not just the sample.', ['A sample is used to draw conclusions about the whole population.', 'So it must represent the whole population.'], 'recall'),
  t('W21-05', 'How do you sample a field at random?'),
  a.choice('W21-06', 'A student wants to place quadrats at random. Which method is right?', ['Place them where the plants look thickest', 'Use a random number generator to choose coordinates on a grid', 'Place them in a row along the path', 'Place them only in the shade'], 1, 'Nobody should choose the spots by hand.', ['Random numbers give each square an equal chance.', 'Choosing the spots by hand would let the student’s choice affect the result.'], 'application'),
  a.choice('W21-07', 'A student samples only one corner of a field. What is the problem?', ['The results may be biased and not represent the whole field', 'The quadrat will break', 'It takes too long', 'It gives too many results'], 0, 'One corner may be different from the rest.', ['One corner may have more or fewer plants than the rest of the field.', 'So the sample is biased and gives a poor picture of the whole field.'], 'understanding'),
  t('W21-08', 'How do you sample people at random?'),
  a.choice('W21-09', 'A hospital has records of 5000 patients. Which is a random way to pick 200 of them?', ['Choose the first 200 in the list', 'Pick the 200 who volunteer', 'Number every patient and use a random number generator to pick 200', 'Choose the 200 who live nearest the hospital'], 2, 'Every patient needs the same chance of being chosen.', ['Numbering every patient and using a random number generator gives everyone the same chance.', 'The other methods favour some patients over others.'], 'application'),
  a.choice('W21-10', 'Why is a random sample of people better than choosing the people who live nearby?', ['Random numbers are quicker to type', 'Nearby people may not represent the whole population', 'Nearby people are always healthier', 'Random numbers cost more'], 1, 'Think about whether nearby people are like everybody else.', ['People who live nearby may be different from the rest of the population.', 'A random sample gives everybody an equal chance, so it is fairer.'], 'understanding'),
  a.choice('W21-11', 'A school has 600 pupils. A student wants a random sample of 30 to ask about sleep. Which is best?', ['Ask her 30 friends', 'Ask the first 30 in the canteen queue', 'Ask 30 pupils from Year 7 only', 'Give every pupil a number and pick 30 using random numbers'], 3, 'Everyone in the school must have the same chance.', ['Numbering every pupil and using random numbers gives everyone an equal chance.', 'Friends, a queue or one year group are not random.'], 'application', true),
  a.choice('W21-12', 'A student counts daisies in three squares next to the gate and says the whole field has that many. What is wrong?', ['Three is too many squares', 'Daisies cannot be counted', 'The squares were not random, so they may not represent the field', 'The gate is too far away'], 2, 'Where did the squares come from?', ['The squares were all next to the gate, so they were not chosen at random.', 'They may not represent the whole field.'], 'practicalReasoning', true),
  a.choice('W21-13', 'Look at the two grids, with each dark square a quadrat. Which grid shows random sampling?', ['Grid 1', 'Grid 2', 'Both grids', 'Neither grid'], 1, 'Look for squares spread all over the field.', ['Grid 2 has squares spread all over the field, so each part has a chance of being sampled.', 'Grid 1 only covers one corner, so it would be biased.'], 'dataInterpretation', true, 'wssample-q-grids'),
  a.written('W21-14', 'Explain how to take a random sample of daisies in a field, and why it must be random.', 'Think about the grid, the numbers and bias.', 'I would divide the field into a grid and number the sides. I would use a random number generator to choose pairs of coordinates, such as (2, 7). I would put a quadrat at each pair of coordinates and count the daisies inside it. The sample must be random so that it is not biased. A random sample represents the whole field, so I can use it to draw conclusions about all the daisies.', ['Divide the field into a grid and number the sides.', 'Use a random number generator to pick coordinates.', 'Place a quadrat at each coordinate and count the plants.', 'A random sample is not biased.', 'It represents the whole population, so conclusions can be drawn about it.'], ['Choosing the spots by hand.', 'Sampling only one area of the field.', 'Saying random means careless.']),
]

export const lessonW21: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'Random sampling', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
