import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { rfFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.8.1.3 Chromatography (calculating Rf values, using reference substances to identify a mixture), as on the supplied revision page' }
const skill = 'C-RF-VALUES'
const meaning = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const calc = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const identify = author(skill, ['5.8.1.3'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const rfSections = [
  { id: 'C43-01', label: 'Start here', detail: 'Two inks on one strip of paper' },
  { id: 'C43-02', label: 'What is an Rf value?', detail: 'Spot distance divided by solvent distance' },
  { id: 'C43-05', label: 'How do you work one out?', detail: 'Measure, divide, round to 2 s.f.' },
  { id: 'C43-08', label: 'How do you identify a substance?', detail: 'Reference spots and matching Rf values' },
  { id: 'C43-11', label: 'On your own', detail: 'Calculating and reading chromatograms' },
]

const states: ScienceState[] = [
  { ...meaning.choice('C43-01', 'Two different inks are run on the same paper with the same solvent. What is most likely to happen?', ['Both spots stay on the baseline', 'The two inks move different distances up the paper', 'Both inks always move exactly the same distance', 'The paper moves instead of the solvent'], 1, 'Different substances are held by the paper by different amounts.', ['Different substances usually move different distances.', 'That is why chromatography can separate a mixture into spots.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(meaning, 'C43-02', 'What is an Rf value?'),
  meaning.choice('C43-03', 'Which formula gives the Rf value?', ['Distance moved by solvent ÷ distance moved by substance', 'Distance moved by substance × distance moved by solvent', 'Distance moved by substance ÷ distance moved by solvent', 'Distance moved by substance − distance moved by solvent'], 2, 'The substance distance is compared with the solvent distance.', ['Rf = distance moved by substance ÷ distance moved by solvent.', 'The spot distance goes on top.'], 'recall'),
  meaning.choice('C43-04', 'Spot X has a bigger Rf value than spot Y. What does this tell you?', ['Spot X moved further up the paper than spot Y', 'Spot X moved less far than spot Y', 'Spot X did not move at all', 'The solvent moved further for spot X'], 0, 'Larger Rf means the substance moved a greater share of the solvent distance.', ['The further a substance moves, the larger its Rf value.', 'Both spots share the same solvent front on one paper, so a bigger Rf means a bigger distance.']),
  t(calc, 'C43-05', 'How do you work one out?'),
  calc.choice('C43-06', 'A spot is 4.4 cm from the baseline. The solvent front is 7.2 cm from the baseline. What is the Rf value to 2 significant figures?', ['1.6', '0.16', '0.51', '0.61'], 3, 'Divide the spot distance by the solvent distance, then round.', ['Rf = 4.4 ÷ 7.2 = 0.6111…', 'To 2 significant figures this is 0.61.'], 'calculation'),
  calc.choice('C43-07', 'Why does an Rf value have no units?', ['It is a ratio of two distances in the same units', 'Distances cannot be measured on paper', 'It is always exactly 1', 'Units are only used for solvents'], 0, 'Think about what happens when you divide centimetres by centimetres.', ['Both distances are in the same units, so the units cancel.', 'An Rf value is just a number.'], 'recall'),
  t(identify, 'C43-08', 'How do you identify a substance?'),
  identify.choice('C43-09', 'What is a reference in chromatography?', ['A ruler for measuring the spots', 'A pure sample of a known substance run next to the mixture', 'The solvent front', 'The pencil line where the spots start'], 1, 'It is something you already know for certain.', ['A reference is a pure sample of a known substance.', 'It is run on the same paper as the mixture so the spots can be compared.']),
  identify.choice('C43-10', 'Reference spots A and B are run beside a mixture. A matches a spot in the mixture. B matches none. What is the best conclusion?', ['The mixture contains B only', 'The mixture contains neither A nor B', 'The mixture possibly contains A but probably not B', 'The mixture is a pure substance'], 2, 'A matching Rf value shows a substance could be present.', ['A has the same Rf value as a spot in the mixture, so A could be in the mixture.', 'B matches no spot, so it is probably not there.']),
  identify.choice('C43-11', 'A student wants to be more sure that a spot is the same as a reference. What should the student do?', ['Use a shorter piece of paper', 'Repeat with a different solvent and compare Rf values again', 'Leave the paper to dry for a week', 'Use the same solvent again'], 1, 'Rf values depend on the solvent used.', ['Rf values change with the solvent.', 'If they match again in a different solvent, it is likely the substances are the same.'], 'application', true),
  calc.choice('C43-12', 'On a chromatogram a spot is 2.8 cm from the baseline and the solvent front is 8.0 cm from the baseline. What is the Rf value?', ['0.35', '2.9', '0.29', '5.2'], 0, 'Spot distance on top, solvent distance underneath.', ['Rf = 2.8 ÷ 8.0 = 0.35.', 'It is already exact to 2 significant figures.'], 'calculation', true),
  identify.choice('C43-13', 'Which reference could be in the mixture, going by the numbered chromatogram?', ['Reference 1 and reference 3', 'Reference 2 only', 'Reference 2 and reference 3', 'None of the references'], 0, 'Follow each reference spot across to the mixture.', ['The mixture has spots at two heights.', 'Reference 1 and reference 3 match those two heights. Reference 2 does not.'], 'dataInterpretation', true, 'rfval-q-chromatogram'),
  identify.choice('C43-14', 'A spot in the mixture has an Rf value of 0.45 in one solvent. A reference has an Rf value of 0.45 in the same solvent. What can be said?', ['They are definitely the same substance', 'They could be the same substance', 'They cannot be the same substance', 'The solvent front was not measured'], 1, 'A match is evidence, but it is not proof by itself.', ['The same Rf value in one solvent means the substances could be the same.', 'Repeating with a different solvent would make the conclusion stronger.'], 'understanding', true),
  meaning.written('C43-15', 'Describe how you would work out an Rf value and use it to decide whether a mixture contains a known substance.', 'Measure, divide, then compare with a reference.', 'Measure the distance from the baseline to the centre of the spot, and from the baseline to the solvent front. Divide the spot distance by the solvent distance to get the Rf value, and give it to 2 significant figures. Run a pure reference sample next to the mixture. If the reference has the same Rf value as a spot in the mixture, that substance could be present. Repeating with a different solvent makes the conclusion more reliable.', ['Measure the distance moved by the spot from the baseline to its centre.', 'Measure the distance moved by the solvent to the solvent front.', 'Rf = spot distance ÷ solvent distance.', 'Run a pure reference sample next to the mixture.', 'Same Rf value as a spot in the mixture means the substance could be present.'], ['Dividing the solvent distance by the spot distance.', 'Saying the Rf value has units of cm.', 'Saying a matching Rf value proves the substance is present.']),
]

export const lessonC43: ScienceLesson = {
  id: 'C-ANA-043-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Rf values', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
