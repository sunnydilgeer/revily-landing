import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { homeostasisFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.5.1 Homeostasis: why conditions are kept steady; automatic control systems with receptors, coordination centres and effectors' }
const a = author('B-HOMEOSTASIS', ['4.5.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const homeostasisSections = [
  { id: 'B30-01', label: 'Start here', detail: 'What does heat do to an enzyme?' },
  { id: 'B30-02', label: 'Why keep things steady?', detail: 'Homeostasis and control systems' },
  { id: 'B30-05', label: 'What does the work?', detail: 'Receptors, coordination centres and effectors' },
  { id: 'B30-08', label: 'Too high or too low?', detail: 'Back to the optimum' },
  { id: 'B30-11', label: 'On your own', detail: 'Stimuli, a control system and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B30-01', 'An enzyme is heated far above body temperature. What happens to it?', ['It works faster and faster', 'Its shape changes and it stops working', 'It turns into glucose', 'Nothing happens to it'], 1, 'What does too much heat do to an enzyme’s active site?', ['High temperatures change the shape of an enzyme’s active site.', 'So the substrate no longer fits, and the enzyme stops working.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B30-02', 'Why keep things steady?'),
  a.choice('B30-03', 'What is homeostasis?', ['Keeping conditions in the body and cells at the right level', 'Making the body as warm as possible', 'Stopping all changes outside the body', 'Breaking down food with enzymes'], 0, 'Think about the word “steady”.', ['Conditions inside and outside the body keep changing.', 'Homeostasis keeps conditions in the body and cells at the right level as these changes happen.']),
  a.choice('B30-04', 'Why does the body keep its temperature close to 37 °C?', ['So the body never uses any energy', 'So the blood stops moving', 'So cells and their enzymes can work properly'], 2, 'What happens to enzymes if conditions are wrong?', ['Cells and their enzymes need the right conditions.', 'So keeping the temperature steady lets them work properly.']),
  t('B30-05', 'What does the work?'),
  a.choice('B30-06', 'Look at the numbered parts. Which number shows a coordination centre?', ['Number 1', 'Number 2', 'Number 3'], 1, 'Which part receives and processes the information?', ['Number 1 is a receptor in the skin, and number 3 is a muscle, an effector.', 'Number 2 is the brain, which is a coordination centre.'], 'understanding', false, 'nerve-parts-question'),
  a.choice('B30-07', 'What is the job of an effector?', ['To detect a stimulus', 'To process information', 'To produce a response', 'To store glucose'], 2, 'Effectors come last in a control system.', ['Receptors detect a stimulus, and coordination centres process the information.', 'Effectors produce the response.']),
  t('B30-08', 'Too high or too low?'),
  a.choice('B30-09', 'The amount of glucose in someone’s blood rises too high. What does their control system do?', ['Increases it even more', 'Waits until it stops rising by itself', 'Removes all the glucose from the blood', 'Decreases it back towards the optimum'], 3, 'Too high: which way must the level go?', ['If a level is too high, effectors act to decrease it.', 'So the level falls back towards the optimum.']),
  a.choice('B30-10', 'What is the optimum level?', ['The ideal level for the body’s cells', 'The highest level possible', 'The lowest level possible'], 0, 'Think about the level the control system keeps bringing things back to.', ['The control system brings a level back whenever it rises or falls.', 'It brings it back to the optimum, the ideal level for the cells.']),
  a.choice('B30-11', 'Someone sits in a hot car on a sunny day. Their body temperature starts to rise. What is the stimulus?', ['The rise in temperature', 'Their skin', 'Their brain', 'Their muscles'], 0, 'A stimulus is a change, not a body part.', ['The skin contains receptors, the brain is a coordination centre and muscles are effectors.', 'The stimulus is the change: the rise in temperature.'], 'application', true),
  a.choice('B30-12', 'Why are the body’s control systems called automatic?', ['They only work while you sleep', 'You have to decide to switch them on', 'They are controlled by machines', 'They work without you having to think about them'], 3, 'Do you choose to keep your temperature steady?', ['You do not decide to keep your temperature or water level steady.', 'Control systems work without you having to think about them, so they are automatic.'], 'understanding', true),
  a.choice('B30-13', 'The diagram shows a control system. Which number is the part that produces the response?', ['Number 1', 'Number 2', 'Number 3'], 1, 'Follow the arrows from the level. Which part acts last?', ['The arrows go from the level to part 3, which detects the change, then to part 1, the coordination centre.', 'Part 2 comes last and brings the level back, so it is the effector.'], 'understanding', true, 'nerve-loop-question'),
  a.choice('B30-14', 'The graph shows one person’s body temperature during a day. Which conclusion fits it?', ['Their temperature stayed exactly the same all day', 'Everyone’s temperature is always 37.0 °C', 'Their temperature rose and fell a little but stayed close to 37 °C', 'Their control system stopped working at midday'], 2, 'Look at how far the line moves away from 37 °C.', ['The readings went from 36.7 °C to 37.3 °C; one person cannot show what everyone’s temperature does.', 'So their temperature rose and fell a little but stayed close to 37 °C.'], 'dataInterpretation', true, 'nerve-temp-data'),
  a.written('B30-15', 'Your body temperature rises on a hot run. Describe how a control system brings it back, using receptor, coordination centre and effector.', 'Take the three parts in order, then say which way the temperature changes.', 'The rise in temperature is a stimulus. Receptors detect the rise and send information to a coordination centre, such as the brain. The coordination centre processes the information and organises a response. Effectors produce the response, which decreases the temperature back towards the optimum.', ['Receptors detect the rise in temperature, the stimulus.', 'Information goes to a coordination centre, such as the brain.', 'The coordination centre processes the information and organises a response.', 'Effectors produce a response that decreases the temperature back to the optimum.'], ['Saying effectors detect the change, or that receptors produce the response.', 'Saying the level is increased when it is too high.', 'Saying you have to decide to cool down; the control system is automatic.']),
]

export const lesson30: ScienceLesson = {
  id: 'B-HOM-030-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Homeostasis', prerequisites: ['B-ENZYMES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
