import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { waterTestFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.1.2 Potable water and the required practical on analysing and purifying water (pH, evaporation for dissolved solids, boiling point, distillation), as on the supplied revision page' }
const skill = 'C-WATER-TESTING'
const props = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const solids = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const other = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const distil = author(skill, ['5.10.1.2'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const waterTestSections = [
  { id: 'C54-01', label: 'Start here', detail: 'How could you tell if water is pure?' },
  { id: 'C54-02', label: 'What is pure water like?', detail: 'Three properties to check' },
  { id: 'C54-05', label: 'How do you test for dissolved solids?', detail: 'Evaporating basin and mass' },
  { id: 'C54-08', label: 'What about pH and boiling point?', detail: 'Two more checks' },
  { id: 'C54-11', label: 'How is water distilled in the lab?', detail: 'Flask, condenser, beaker' },
  { id: 'C54-14', label: 'On your own', detail: 'Results, calculations and apparatus' },
]

const states: ScienceState[] = [
  { ...props.choice('C54-01', 'You are given a sample of water and want to know if it is pure. What is the safest way to find out?', ['Taste a small amount', 'Carry out a test in the lab, such as measuring its boiling point', 'Smell it and decide', 'Ask someone else to drink it'], 1, 'Chemists test, they do not taste.', ['Tests such as boiling point and pH tell you about purity.', 'Never taste a sample in the lab.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(props, 'C54-02', 'What is pure water like?'),
  props.choice('C54-03', 'At what temperature does pure water boil?', ['0 °C', '7 °C', '100 °C', '14 °C'], 2, 'It is the boiling point you already know for water.', ['Pure water boils at 100 °C.', 'Its pH is 7 and it has no dissolved solids.'], 'recall'),
  props.choice('C54-04', 'Which pH does pure water have?', ['pH 7, which is neutral', 'pH 1, which is acidic', 'pH 14, which is alkaline', 'It changes each time you test it'], 0, 'Neutral is in the middle of the scale.', ['Pure water is neutral.', 'A neutral solution has a pH of 7.'], 'recall'),
  t(solids, 'C54-05', 'How do you test for dissolved solids?'),
  solids.choice('C54-06', 'Why must the basin be completely dry before the second mass is measured?', ['So that leftover water is not counted as solid', 'So that the basin is cold enough to hold', 'So that the solid can be dissolved again', 'So that the volume is known'], 0, 'What would extra water do to the mass?', ['Any water left in the basin would add to the mass.', 'Only dry solid left behind should be measured.']),
  solids.choice('C54-07', 'A dry basin has a mass of 38.40 g. After evaporating a water sample and cooling, its mass is 38.47 g. What is the change in mass?', ['0.07 g', '0.7 g', '76.87 g', '0.007 g'], 0, 'Second mass minus first mass.', ['Change in mass = 38.47 − 38.40.', 'That is an increase of 0.07 g, so the sample contained dissolved solids.'], 'calculation'),
  t(other, 'C54-08', 'What about pH and boiling point?'),
  other.choice('C54-09', 'Which of these can be used to measure the pH of a water sample?', ['A pH probe and meter', 'An evaporating basin', 'A condenser', 'A balance only'], 0, 'One is designed to read pH.', ['A pH probe and meter, or universal indicator, show the pH.', 'An evaporating basin is used to look for dissolved solids.'], 'recall'),
  other.choice('C54-10', 'A sample boils at 102 °C. What can you say?', ['It is pure water', 'It is not pure water', 'It has a pH of 7', 'It contains no dissolved solids'], 1, 'Compare with 100 °C.', ['Pure water boils at exactly 100 °C.', 'Boiling at 102 °C means the sample is not pure.'], 'dataInterpretation'),
  t(distil, 'C54-11', 'How is water distilled in the lab?'),
  distil.choice('C54-12', 'In distillation, what is the job of the condenser?', ['To heat the water', 'To cool steam so it turns back into liquid water', 'To dissolve the solids', 'To measure the pH'], 1, 'The steam has to turn back into water.', ['The condenser is cooled by cold water.', 'Steam cools there and condenses back into liquid water.'], 'recall'),
  distil.choice('C54-13', 'Where are the dissolved solids after water is distilled?', ['In the beaker with the pure water', 'In the condenser', 'Left behind in the flask', 'In the cold water'], 2, 'Solids do not boil away like water.', ['The dissolved solids do not boil off.', 'They stay in the flask while the pure water is collected.']),
  solids.choice('C54-14', 'A student heats a sample in an open basin until it has completely evaporated. The empty basin was 44.10 g and afterwards 44.58 g. Was the sample pure?', ['Yes, because the water boiled away', 'Yes, because the mass changed', 'No, because there was a 0.48 g increase in mass from dissolved solids', 'No, because the basin was dry'], 2, 'Work out the change in mass first.', ['44.58 − 44.10 = 0.48 g, an increase.', 'The extra mass is solid left behind, so the sample was not pure.'], 'calculation', true, 'wtest-q-basin'),
  solids.choice('C54-15', 'Another basin has a mass of 36.25 g before and 36.25 g after evaporating a sample. What does this suggest?', ['There were no dissolved solids in the sample', 'The basin was not heated', 'The sample was salty', 'The mass must be wrong'], 0, 'No change in mass means nothing was left behind.', ['The mass did not change, so no solid was left behind.', 'The sample contained no dissolved solids, which is what pure water would show.'], 'dataInterpretation', true),
  distil.choice('C54-16', 'The numbered diagram shows distillation apparatus. Which number is where the pure water is collected?', ['1, the flask', '2, the condenser', '3, the beaker at the end', '4, the Bunsen burner'], 2, 'Follow the water to the end of the apparatus.', ['The steam turns back into water in the condenser.', 'It drips into the beaker at the end, which is where the pure water is collected.'], 'application', true, 'wtest-q-apparatus'),
  distil.written('C54-17', 'Describe how you could distil a sample of impure water in the lab and collect the pure water.', 'Heat, condense, collect.', 'Put the impure water in a round-bottomed flask and heat it, for example with a Bunsen burner, until it boils and becomes steam. The steam passes into a condenser cooled by cold water, where it condenses back to liquid water. The pure water drips out of the condenser and is collected in a beaker. The dissolved solids are left behind in the flask.', ['Impure water is heated in a flask until it boils.', 'The steam passes into a condenser cooled by cold water.', 'The steam condenses back into liquid water.', 'The pure water is collected in a beaker or container.'], ['Saying all the water is boiled away in an open container.', 'Saying the solids condense with the water.', 'Saying the condenser is heated.']),
]

export const lessonC54: ScienceLesson = {
  id: 'C-RES-054-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Testing and purifying water', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
