import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { chromaFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.8.1.3 Chromatography (mobile and stationary phases, distribution, chromatograms), as on the supplied revision page' }
const skill = 'C-CHROMA'
const phases = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const how = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const gram = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const chromaSections = [
  { id: 'C42-01', label: 'Start here', detail: 'Ink on wet paper' },
  { id: 'C42-02', label: 'What are the two phases?', detail: 'Mobile and stationary' },
  { id: 'C42-05', label: 'Why do the spots separate?', detail: 'Solubility and distribution' },
  { id: 'C42-08', label: 'How do you read a chromatogram?', detail: 'Solvent front and spots' },
  { id: 'C42-11', label: 'On your own', detail: 'Reading and explaining results' },
]

const states: ScienceState[] = [
  { ...phases.choice('C42-01', 'A strip of paper with a black ink spot has its bottom edge dipped in water. What do you expect to see?', ['The ink stays exactly where it started', 'The water moves up and the ink spreads into different colours', 'The paper turns black all over at once', 'The ink moves down into the water'], 1, 'Think about what the water does to the paper and the ink.', ['Water soaks up the paper.', 'It carries the dyes in the ink upwards, and different dyes travel different distances.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(phases, 'C42-02', 'What are the two phases?'),
  phases.choice('C42-03', 'In paper chromatography, which is the mobile phase?', ['The paper', 'The solvent', 'The pencil line', 'The spot'], 1, 'Which one can move?', ['The mobile phase is where molecules can move.', 'In paper chromatography this is the solvent, for example water or ethanol.'], 'recall'),
  phases.choice('C42-04', 'In paper chromatography, which is the stationary phase?', ['The solvent', 'The beaker', 'The ink', 'The paper'], 3, 'Which one holds still?', ['The stationary phase is where molecules cannot move.', 'In paper chromatography this is the paper.'], 'recall'),
  t(how, 'C42-05', 'Why do the spots separate?'),
  how.choice('C42-06', 'A chemical is very soluble in the solvent. What happens to it during chromatography?', ['It stays on the pencil line', 'It moves down the paper', 'It stays still because it dissolves', 'It spends more time dissolved and moves further up'], 3, 'Only dissolved chemicals are carried by the solvent.', ['The more soluble a chemical is, the more time it spends dissolved in the solvent.', 'So it is carried further up the paper.'], 'understanding'),
  how.choice('C42-07', 'Two chemicals in a mixture end up at different heights. What is the reason?', ['The paper is heavier under one of them', 'The solvent only dissolves one of them', 'They spend different amounts of time dissolved in the solvent', 'They are the same chemical'], 2, 'Think about distribution.', ['Distribution means the time a chemical spends dissolved in the solvent.', 'Different chemicals have different distributions, so they move different distances.'], 'understanding'),
  t(gram, 'C42-08', 'How do you read a chromatogram?'),
  gram.choice('C42-09', 'A substance gives three spots on its chromatogram. What does this show about the mixture?', ['It is pure', 'It contains at least three different chemicals', 'It contains exactly three chemicals', 'It contains only one chemical'], 1, 'The number of spots is a minimum.', ['Each spot is a different chemical, so there are at least three.', 'Two chemicals could have made one spot, so there could be more than three.'], 'understanding'),
  gram.choice('C42-10', 'Two different chemicals travel the same distance up the paper. How many spots do they form?', ['One spot between them', 'Two spots', 'Three spots', 'No spots'], 0, 'They end up in the same place.', ['Chemicals that travel the same distance end up at the same height.', 'They form only one spot between them.'], 'application'),
  gram.choice('C42-11', 'Which numbered spot is the chemical that is most soluble in the solvent?', ['Spot 1', 'Spot 2', 'Spot 3'], 2, 'Which spot travelled furthest from the start line?', ['The more soluble a chemical, the further it travels up the paper.', 'Spot 3 is nearest the solvent front, so it is the most soluble.'], 'dataInterpretation', true, 'chroma-q-spots'),
  gram.choice('C42-12', 'A substance gives only one spot with each of five different solvents. What is the best conclusion?', ['It contains five chemicals', 'It is a mixture of two chemicals', 'The paper was faulty', 'It is likely to be pure'], 3, 'One spot in lots of solvents is a strong clue.', ['Getting one spot in many different solvents suggests only one chemical.', 'So the substance is likely to be pure.'], 'application', true),
  how.choice('C42-13', 'Why can two different chemicals sometimes make only one spot?', ['They travel the same distance up the paper', 'One dissolves the other', 'They are both pure', 'The solvent front stops them'], 0, 'Think about where each chemical finishes.', ['If two chemicals spend the same amount of time dissolved, they travel the same distance.', 'They then make one spot between them.'], 'understanding', true),
  gram.choice('C42-14', 'A student repeats a chromatography experiment using a different solvent. What is likely to happen?', ['The chromatogram will be exactly the same', 'The chromatogram may be different, with spots in different places', 'No solvent front will form', 'The spots will move down the paper'], 1, 'Different solvents dissolve chemicals differently.', ['A chemical may be more or less soluble in a different solvent.', 'So the spots can end up in different places, and the number of spots can change.'], 'understanding', true),
  phases.written('C42-15', 'Explain why the chemicals in a mixture separate into different spots during paper chromatography.', 'Think about the solvent, time dissolved and distance.', 'The solvent moves up the paper and carries the chemicals with it. Each chemical spends an amount of time dissolved in the solvent, which is called its distribution. The more soluble a chemical is, the more time it spends dissolved and the further it moves up the paper. Different chemicals move different distances, so they separate into different spots.', ['The solvent moves up the paper and carries the chemicals.', 'The time a chemical spends dissolved is its distribution.', 'The more soluble a chemical, the further it moves up the paper.', 'Different chemicals move different distances.', 'So they separate into different spots.'], ['Saying the paper is the mobile phase.', 'Saying the least soluble chemical moves furthest.', 'Saying every chemical moves the same distance.']),
]

export const lessonC42: ScienceLesson = {
  id: 'C-ANA-042-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'How paper chromatography works', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
