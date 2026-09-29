import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { gasTestFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.8.2.1–5.8.2.4 Testing for gases (hydrogen, oxygen, carbon dioxide, chlorine), as on the supplied revision page' }
const skill = 'C-GAS-TESTS'
const liquid = author(skill, ['5.8.2.3', '5.8.2.4'], ['aqa-chemistry'])
const splint = author(skill, ['5.8.2.1', '5.8.2.2'], ['aqa-chemistry'])
const all = author(skill, ['5.8.2.1', '5.8.2.2', '5.8.2.3', '5.8.2.4'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const gasTestSections = [
  { id: 'C44-01', label: 'Start here', detail: 'A gas is given off. Which gas is it?' },
  { id: 'C44-02', label: 'How do you test for chlorine and carbon dioxide?', detail: 'Litmus paper and limewater' },
  { id: 'C44-05', label: 'How do you test for oxygen and hydrogen?', detail: 'Glowing and lit splints' },
  { id: 'C44-08', label: 'Can you name the gas?', detail: 'All four tests together' },
  { id: 'C44-11', label: 'On your own', detail: 'Choosing tests and reading results' },
]

const states: ScienceState[] = [
  { ...all.choice('C44-01', 'A reaction gives off a colourless gas. How could you find out which gas it is?', ['Look at it closely; every gas looks different', 'Carry out a chemical test and watch for a result', 'Weigh the empty test tube', 'Smell it as hard as you can'], 1, 'Many gases are colourless, so looking is not enough.', ['Many gases are colourless and cannot be told apart by sight.', 'Each of these gases has a test with its own result.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(liquid, 'C44-02', 'How do you test for chlorine and carbon dioxide?'),
  liquid.choice('C44-03', 'What happens to damp litmus paper in chlorine?', ['It turns white', 'It turns bright orange', 'It relights', 'It stays exactly the same'], 0, 'Chlorine is a bleach.', ['Chlorine bleaches damp litmus paper.', 'The paper turns white.'], 'recall'),
  liquid.choice('C44-04', 'A gas is bubbled through limewater and the limewater stays clear. What does this show?', ['The gas is carbon dioxide', 'The gas is not carbon dioxide', 'The gas is chlorine', 'The limewater has gone off'], 1, 'Carbon dioxide would change the limewater.', ['Carbon dioxide turns limewater cloudy.', 'The limewater stayed clear, so the gas is not carbon dioxide.']),
  t(splint, 'C44-05', 'How do you test for oxygen and hydrogen?'),
  splint.choice('C44-06', 'A glowing splint is put into a test tube and bursts back into flame. Which gas is in the tube?', ['Hydrogen', 'Carbon dioxide', 'Chlorine', 'Oxygen'], 3, 'The splint relights.', ['A glowing splint relights in oxygen.', 'A squeaky pop would have meant hydrogen.']),
  splint.choice('C44-07', 'What is seen when a lit splint is held at the open end of a tube of hydrogen?', ['The splint relights', 'The splint turns white', 'A squeaky pop', 'Cloudy liquid forms'], 2, 'Think of the sound.', ['Hydrogen burns quickly and makes a squeaky pop.', 'The test uses a lit splint, not a glowing one.'], 'recall'),
  t(all, 'C44-08', 'Can you name the gas?'),
  all.choice('C44-09', 'Which test would you use to check whether a gas is chlorine?', ['Bubble it through limewater', 'Hold damp litmus paper in it', 'Put a glowing splint in it', 'Hold a lit splint at the open end'], 1, 'Think about which test gives a white paper.', ['Chlorine is tested with damp litmus paper.', 'The paper turns white.']),
  all.choice('C44-10', 'A student hears a squeaky pop from a lit splint at the top of a test tube. What is the gas?', ['Hydrogen', 'Carbon dioxide', 'Oxygen', 'Chlorine'], 0, 'The pop is the clue.', ['A squeaky pop with a lit splint means hydrogen.', 'Oxygen would relight a glowing splint.'], 'application'),
  all.choice('C44-11', 'The numbered tubes show test results. Which tube contained oxygen?', ['Tube 1', 'Tube 3', 'Tube 4', 'Tube 2'], 3, 'Look for the splint that comes back to life.', ['A glowing splint relighting shows oxygen.', 'The result in the other tubes fits different gases.'], 'dataInterpretation', true, 'gastest-q-results'),
  all.choice('C44-12', 'A gas turns limewater cloudy but does not affect a lit splint. Which gas is it?', ['Oxygen', 'Hydrogen', 'Carbon dioxide', 'Chlorine'], 2, 'Start with the limewater result.', ['Cloudy limewater shows carbon dioxide.', 'Hydrogen would have given a squeaky pop.'], 'application', true),
  all.choice('C44-13', 'Which result is correct for the gas named?', ['Chlorine: relights a glowing splint', 'Hydrogen: turns limewater cloudy', 'Oxygen: makes a squeaky pop', 'Carbon dioxide: turns limewater cloudy'], 3, 'Match the test to the gas.', ['Carbon dioxide turns limewater cloudy.', 'The other pairs have the results swapped.'], 'recall', true),
  all.choice('C44-14', 'A student writes: "The limewater went cloudy, so the gas was carbon dioxide." What is missing from a full answer?', ['What the student did to test the gas', 'The name of the teacher', 'The colour of the test tube', 'Nothing; the answer is complete'], 0, 'A full answer has a test, a result and a conclusion.', ['A full answer says the test, the observation and the conclusion.', 'The method, such as bubbling the gas through limewater, is missing.'], 'understanding', true),
  liquid.written('C44-15', 'Describe a test for oxygen and a test for carbon dioxide, and say what you would see for each.', 'Test, result, gas.', 'To test for oxygen, put a glowing splint into the gas. If it is oxygen the splint relights. To test for carbon dioxide, bubble the gas through limewater, or shake it with limewater. If it is carbon dioxide the limewater turns cloudy.', ['Oxygen: put a glowing splint in the gas.', 'The splint relights.', 'Carbon dioxide: bubble the gas through (or shake it with) limewater.', 'The limewater turns cloudy.'], ['Saying a lit splint makes oxygen relight.', 'Saying limewater turns white or orange.', 'Giving results without naming the test.']),
]

export const lessonC44: ScienceLesson = {
  id: 'C-ANA-044-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Tests for gases', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
