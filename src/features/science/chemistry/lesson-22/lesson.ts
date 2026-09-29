import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { acidFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.4.2.4 The pH scale and neutralisation; 5.4.2.2 Neutralisation of acids (acids, bases and alkalis, acid + base → salt + water), as on the supplied revision page' }
const scale = author('C-PH-SCALE', ['5.4.2.4'], ['aqa-chemistry'])
const measure = author('C-PH-MEASURE', ['5.4.2.4'], ['aqa-chemistry'])
const kinds = author('C-ACID-BASE-ALKALI', ['5.4.2.4', '5.4.2.2'], ['aqa-chemistry'])
const neut = author('C-NEUTRALISATION', ['5.4.2.4', '5.4.2.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const acidSections = [
  { id: 'C22-01', label: 'Start here', detail: 'Which everyday liquid is an acid?' },
  { id: 'C22-02', label: 'The pH scale', detail: 'Acidic, neutral and alkaline, 0 to 14' },
  { id: 'C22-05', label: 'Measuring pH', detail: 'Indicators, universal indicator and a pH probe' },
  { id: 'C22-08', label: 'Acids, bases and alkalis', detail: 'H⁺ ions, OH⁻ ions and how the words fit' },
  { id: 'C22-11', label: 'Neutralisation', detail: 'Acid + base, H⁺ + OH⁻ and the end point' },
  { id: 'C22-14', label: 'On your own', detail: 'A scale, an end point, some data and an explanation' },
]

const states: ScienceState[] = [
  { ...scale.choice('C22-01', 'Which of these everyday liquids is most likely to be an acid?', ['Lemon juice', 'Pure water', 'Soapy water'], 0, 'Which one tastes sharp and sour?', ['Lemon juice is acidic. Its pH is about 2.', 'Pure water is neutral, and soapy water is slightly alkaline.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(scale, 'C22-02', 'The pH scale'),
  scale.choice('C22-03', 'A solution has a pH of 3. What does this tell you about it?', ['It is neutral', 'It is acidic', 'It is alkaline', 'It is a strong alkali'], 1, 'Is 3 below or above 7?', ['A pH below 7 means the solution is acidic.', 'Only pH 7 is neutral, and only a pH above 7 is alkaline.']),
  scale.choice('C22-04', 'Which of these solutions is the most alkaline?', ['pH 2', 'pH 7', 'pH 12', 'pH 9'], 2, 'The higher the pH, the more alkaline.', ['Alkaline solutions have a pH above 7.', 'Of these, pH 12 is the highest, so it is the most alkaline.']),
  t(measure, 'C22-05', 'Measuring pH'),
  measure.choice('C22-06', 'A few drops of universal indicator turn a solution blue. What can you say about it?', ['It is neutral', 'It is a strong acid', 'It is slightly acidic', 'It is alkaline'], 3, 'Look at the colour chart. Where is blue?', ['On the chart, blue is at about pH 8 to 10.', 'That is above 7, so the solution is alkaline.'], 'understanding', false, 'acid-ind-universal'),
  measure.choice('C22-07', 'Why is a pH probe with a meter more accurate than universal indicator?', ['It gives the pH as a number, not just a colour to match', 'It changes the pH of the solution', 'It only works on alkaline solutions', 'It shows a colour that is easier to see'], 0, 'What does the meter show?', ['A probe and meter show the pH as a number.', 'An indicator only gives a colour, which you match to a chart to estimate the pH.']),
  t(kinds, 'C22-08', 'Acids, bases and alkalis'),
  kinds.choice('C22-09', 'Which beaker contains an alkali? The circles show the ions in each solution.', ['Beaker 2, with H⁺ ions', 'Beaker 1, with OH⁻ ions', 'Both beakers', 'Neither beaker'], 1, 'Which ion do alkalis make in water?', ['A solution of an alkali contains OH⁻ ions, so beaker 1 is the alkali.', 'Beaker 2 has H⁺ ions, so it is an acid.'], 'understanding', false, 'acid-q-ions'),
  kinds.choice('C22-10', 'Copper oxide reacts with an acid but does not dissolve in water. Which word describes it?', ['An acid', 'An alkali', 'A base that is not an alkali', 'A neutral solution'], 2, 'Is it able to neutralise an acid? And does it dissolve?', ['Copper oxide neutralises acids, so it is a base.', 'An alkali is a base that dissolves in water. Copper oxide does not dissolve, so it is not an alkali.']),
  t(neut, 'C22-11', 'Neutralisation'),
  neut.choice('C22-12', 'Hydrochloric acid reacts with sodium hydroxide. Which pair of products forms?', ['Hydrogen and water', 'Salt and water', 'Acid and salt', 'A base and water'], 1, 'Complete: acid + base →', ['Acid + base → salt + water.', 'If the amounts are just right, the mixture is neutral, with a pH of 7.']),
  neut.choice('C22-13', 'Which ions react together when an acid neutralises an alkali?', ['H⁺ and OH⁻', 'H⁺ and H⁺', 'OH⁻ and OH⁻', 'H₂O and H⁺'], 0, 'Acids make one ion and alkalis make the other.', ['Acids give H⁺ ions and alkalis give OH⁻ ions.', 'They react to make water: H⁺(aq) + OH⁻(aq) → H₂O(l).']),
  scale.choice('C22-14', 'Which two numbered solutions are alkaline?', ['Solutions 1 and 2', 'Solutions 3 and 4', 'Solutions 2 and 3', 'Only solution 4'], 1, 'Which pH values are above 7?', ['Alkaline solutions have a pH above 7.', 'Solution 3 is at pH 8 and solution 4 is at pH 12, so both are alkaline. Solutions 1 and 2 are below 7.'], 'understanding', true, 'acid-q-scale'),
  neut.choice('C22-15', 'A student adds alkali to an acid with universal indicator. Which beaker shows neutralisation just complete?', ['Beaker 1', 'Beaker 2', 'Beaker 3', 'None of them'], 2, 'What colour is universal indicator at pH 7?', ['Universal indicator is green when the mixture is neutral, at pH 7.', 'Beaker 3 is green. Beaker 1 is blue, so there is too much alkali, and beaker 2 is yellow, so it is still slightly acidic.'], 'application', true, 'acid-q-titre'),
  measure.choice('C22-16', 'The table shows four solutions tested. Which conclusion do these data support?', ['Solution A is an alkali', 'Solutions B and C are both neutral', 'Solution D is the most alkaline of the four', 'Solution D is dangerous to touch'], 2, 'Compare the pH readings. Which is highest?', ['Solution D has the highest pH, 12.8, so it is the most alkaline of the four.', 'A is acidic (3.1) and only B (7.0) is neutral. The table says nothing about danger.'], 'dataInterpretation', true, 'acid-q-data'),
  neut.written('C22-17', 'An acid is neutralised by an alkali with universal indicator. Explain what happens to the ions and when to stop.', 'Name the two ions. Say what they make. Then say which colour tells her the reaction is complete.', 'The acid gives hydrogen ions, H⁺, and the alkali gives hydroxide ions, OH⁻. They react to make water: H⁺ + OH⁻ → H₂O. She adds the alkali a little at a time, and stops when the universal indicator turns green, which shows the mixture is neutral, at pH 7.', ['The acid supplies H⁺ ions and the alkali supplies OH⁻ ions.', 'H⁺ and OH⁻ react to make water, H₂O.', 'She adds the alkali gradually with universal indicator in the mixture.', 'She stops when the indicator turns green, so the pH is 7 and the mixture is neutral.'], ['Saying the acid and alkali "mix" or "disappear" with no ions named.', 'Saying she stops when the indicator turns purple or blue.', 'Naming the wrong ions, such as OH⁻ from the acid.']),
]

export const lessonC22: ScienceLesson = {
  id: 'C-CHG-022-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Acids, alkalis and pH', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
