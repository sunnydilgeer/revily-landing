import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { springPracFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.5.3 Forces and elasticity, including the required practical on force and extension of a spring, and energy stored Ee = ½ke², as on the supplied revision page' }
const skill = 'P-SPRINGPRAC'
const aim = author(skill, ['6.5.3'], ['aqa-physics'])
const method = author(skill, ['6.5.3'], ['aqa-physics'])
const safety = author(skill, ['6.5.3'], ['aqa-physics'])
const results = author(skill, ['6.5.3'], ['aqa-physics'])
const energy = author(skill, ['6.5.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const springPracSections = [
  { id: 'P42-01', label: 'Start here', detail: 'Hanging masses on a spring' },
  { id: 'P42-02', label: 'What are we testing?', detail: 'Aim, apparatus and variables' },
  { id: 'P42-05', label: 'What is the method?', detail: 'Add masses, measure extension' },
  { id: 'P42-08', label: 'How do you stay safe?', detail: 'Goggles, falling masses, care' },
  { id: 'P42-10', label: 'What do you do with the results?', detail: 'Table, graph and limit' },
  { id: 'P42-12', label: 'How much energy is stored?', detail: 'Ee = ½ × k × e²' },
  { id: 'P42-14', label: 'On your own', detail: 'Calculate, read data, plan' },
]

const states: ScienceState[] = [
  { ...aim.choice('P42-01', 'You hang more and more masses from a spring. What do you expect to happen to the spring?', ['It gets shorter', 'It stays the same length', 'It gets longer', 'It disappears'], 2, 'Think about what a heavier pull does to a spring.', ['Each mass pulls on the spring with a force.', 'The more force, the longer the spring becomes.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(aim, 'P42-02', 'What are we testing?'),
  aim.choice('P42-03', 'In the springs investigation, which is the dependent variable, the one you measure?', ['The extension of the spring', 'The mass added', 'The temperature of the room', 'The length of the ruler'], 0, 'You change the force, then measure what happens.', ['You change the force by adding masses.', 'You measure the extension, so it is the dependent variable.'], 'recall'),
  aim.choice('P42-04', 'Why is a piece of tape fixed to the bottom of the spring, next to the ruler?', ['To make the spring stronger', 'To make the extension bigger', 'To stop the masses falling', 'To give a clear mark to read the length from'], 3, 'Think about reading the same point on the spring each time.', ['The tape gives a clear mark on the spring.', 'You read that mark against the ruler every time, so the readings are consistent.']),
  t(method, 'P42-05', 'What is the method?'),
  method.choice('P42-06', 'A 300 g mass hangs from the spring. What is its weight? Use g = 9.8 N/kg.', ['2940 N', '2.94 N', '0.0306 N', '30 N'], 1, 'Change grams to kilograms first, then use W = m × g.', ['300 g = 300 ÷ 1000 = 0.3 kg.', 'W = 0.3 × 9.8 = 2.94 N.'], 'calculation'),
  method.choice('P42-07', 'A spring\'s natural length is 8.0 cm. With a mass hung on it, it is 11.5 cm. What is the extension?', ['19.5 cm', '11.5 cm', '3.5 cm', '8.0 cm'], 2, 'Extension is the new length minus the natural length.', ['Extension = new length − natural length.', '11.5 cm − 8.0 cm = 3.5 cm.'], 'calculation'),
  t(safety, 'P42-08', 'How do you stay safe?'),
  safety.choice('P42-09', 'Which is a sensible safety step when hanging masses from a spring?', ['Wear goggles and put a soft tray under the masses', 'Hold the stand loosely with one hand', 'Add as many masses as you can', 'Stand with your feet under the masses'], 0, 'Think about what can fall and what can spring back.', ['Goggles protect your eyes if the spring springs back.', 'A soft tray catches masses that fall, and keeping your feet clear stops injuries.']),
  t(results, 'P42-10', 'What do you do with the results?'),
  results.choice('P42-11', 'You plot a graph of your results. Which quantity goes on the vertical axis?', ['Extension', 'Force', 'Mass in grams', 'Time'], 1, 'The graph shows force against extension.', ['A force-extension graph has force on the vertical axis.', 'Extension goes along the horizontal axis.'], 'recall'),
  t(energy, 'P42-12', 'How much energy is stored?'),
  energy.choice('P42-13', 'A spring with k = 80 N/m is stretched by 50 cm. How much energy is stored? Use Ee = ½ke².', ['20 J', '10 J', '40 J', '100 000 J'], 1, 'Change 50 cm to metres, then square it.', ['50 cm = 0.5 m, and 0.5² = 0.25.', 'Ee = ½ × 80 × 0.25 = 10 J.'], 'calculation'),
  energy.choice('P42-14', 'A spring with k = 600 N/m is stretched by 10 cm. How much energy is stored? Use Ee = ½ke².', ['30 J', '6 J', '300 J', '3 J'], 3, 'Convert cm to m first, square the extension, then half of k times it.', ['10 cm = 0.1 m, and 0.1² = 0.01.', 'Ee = ½ × 600 × 0.01 = 3 J.'], 'calculation', true),
  results.choice('P42-15', 'Forces 1 to 6 N give extensions 2, 4, 6, 8, 10 and 15 cm. Which force is past the limit?', ['1 N', '3 N', '5 N', '6 N'], 3, 'Look for where the extension stops rising by equal steps.', ['Up to 5 N, each extra newton adds 2 cm, so the extension is proportional.', 'At 6 N the extension is 15 cm, not 12 cm, so it is past the limit.'], 'dataInterpretation', true),
  method.written('P42-16', 'Describe how you would investigate how the extension of a spring depends on the force applied to it.', 'Think: set up, natural length, add a mass, wait, measure, repeat.', 'Hang a spring from a clamp next to a fixed ruler and measure its natural length with no masses on it. Work out the weight of each mass using W = m × g. Add one mass, wait for the spring to come to rest and read its new length. Find the extension by subtracting the natural length. Repeat with more masses, taking at least five readings, and wear goggles and keep feet clear of falling masses. Plot force against extension.', ['Measures the natural length of the spring with no masses on it.', 'Finds the force from the weight of each mass (W = m × g).', 'Adds masses one at a time, waiting for the spring to rest before reading its length.', 'Calculates extension as new length minus natural length.', 'Takes at least five measurements and plots force against extension.', 'Gives a safety point such as goggles or keeping feet clear of falling masses.'], ['Using the mass in grams as the force.', 'Forgetting to measure the natural length.', 'Plotting extension on the vertical axis without saying why.']),
]

export const lessonP42: ScienceLesson = {
  id: 'P-FOR-042-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Investigating springs', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
