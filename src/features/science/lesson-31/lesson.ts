import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { nervousSystemFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.5.2.1 Structure and function of the nervous system: CNS, receptors, sensory and motor neurones, effectors, synapses, reflexes and the reflex arc' }
const a = author('B-NERVOUS-SYSTEM', ['4.5.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const nervousSystemSections = [
  { id: 'B31-01', label: 'Start here', detail: 'Which part detects a stimulus?' },
  { id: 'B31-02', label: 'What is the nervous system?', detail: 'CNS, receptors, neurones and effectors' },
  { id: 'B31-05', label: 'From stimulus to response', detail: 'A goalkeeper makes a save' },
  { id: 'B31-08', label: 'Crossing the gap', detail: 'Synapses' },
  { id: 'B31-11', label: 'Why are reflexes fast?', detail: 'The reflex arc' },
  { id: 'B31-14', label: 'On your own', detail: 'New stimuli, a reflex arc and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B31-01', 'In a control system, which part detects a stimulus?', ['An effector', 'A receptor', 'A coordination centre'], 1, 'You met the three parts when you learned about homeostasis. Which one detects?', ['Receptors detect a stimulus.', 'Coordination centres organise a response, and effectors carry it out.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B31-02', 'What is the nervous system?'),
  a.choice('B31-03', 'Look at the numbered parts. Which two numbers make up the CNS?', ['1 and 2', '2 and 4', '3 and 4', '1 and 3'], 1, 'The CNS is in the head and runs down the back.', ['Number 1 is an eye, which contains receptors, and number 3 is a muscle, an effector.', 'Numbers 2 and 4 are the brain and the spinal cord, which make up the CNS.'], 'understanding', false, 'nerve-ns-question'),
  a.choice('B31-04', 'Which neurones carry impulses from the CNS to a muscle?', ['Sensory neurones', 'Receptor cells', 'Motor neurones'], 2, 'Which neurones carry impulses away from the CNS?', ['Sensory neurones carry impulses from receptors to the CNS.', 'Motor neurones carry impulses from the CNS to effectors, such as muscles.']),
  t('B31-05', 'From stimulus to response'),
  a.choice('B31-06', 'Which is the right order?', ['Stimulus → receptor → sensory neurone → CNS → motor neurone → effector', 'Stimulus → effector → motor neurone → CNS → sensory neurone → receptor', 'Stimulus → receptor → motor neurone → CNS → sensory neurone → effector'], 0, 'Which neurones lead into the CNS?', ['Receptors detect the stimulus, and sensory neurones carry impulses to the CNS.', 'Motor neurones then carry impulses from the CNS to the effector.']),
  a.choice('B31-07', 'When the goalkeeper saves the ball, what are the effectors?', ['The eyes', 'The brain', 'The sensory neurones', 'The arm muscles'], 3, 'Effectors produce the response.', ['The eyes contain receptors, and the brain is part of the CNS.', 'The arm muscles contract to produce the response, so they are the effectors.']),
  t('B31-08', 'Crossing the gap'),
  a.choice('B31-09', 'How is an impulse passed from one neurone to the next?', ['The impulse jumps across the gap as electricity', 'The two neurones join together', 'Chemicals diffuse across the gap and start a new impulse', 'Blood carries it across the gap'], 2, 'What is released into the gap?', ['At a synapse there is a tiny gap between the two neurones.', 'Chemicals diffuse across it and start a new impulse in the next neurone.']),
  a.choice('B31-10', 'What is a synapse?', ['The connection between two neurones', 'A type of receptor', 'The middle of the brain'], 0, 'Think about where one neurone meets the next.', ['A synapse is where one neurone ends and the next begins.', 'So it is the connection between two neurones, with a tiny gap.']),
  t('B31-11', 'Why are reflexes fast?'),
  a.choice('B31-12', 'What does a relay neurone do in a reflex arc?', ['Detects the stimulus', 'Carries impulses from the sensory neurone to the motor neurone', 'Contracts to move the hand', 'Releases hormones into the blood'], 1, 'Relay means passing something on.', ['Receptors detect the stimulus, and the muscle contracts.', 'The relay neurone, in the CNS, passes impulses from the sensory neurone to the motor neurone.']),
  a.choice('B31-13', 'Why is a reflex so quick?', ['It does not involve the thinking part of the brain', 'It uses only one neurone', 'Impulses travel through the blood', 'The muscle does not need impulses'], 0, 'Which part of the brain is left out?', ['A reflex arc goes through the spinal cord or a part of the brain you are not aware of.', 'No time is spent thinking about it, so the response is very quick.']),
  a.choice('B31-14', 'A cyclist hears a car horn and brakes. Which part detects the stimulus?', ['The leg muscles', 'The motor neurones', 'The spinal cord', 'The receptors in the ears'], 3, 'Which receptors detect sound?', ['The leg muscles are effectors, and the motor neurones and spinal cord carry and coordinate impulses.', 'The sound is detected by receptors in the ears.'], 'application', true),
  a.choice('B31-15', 'Look at the numbered parts of the reflex arc. Which number is the relay neurone?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 2, 'The relay neurone sits inside the spinal cord.', ['1 is the receptors, 4 is the sensory neurone and 2 is the motor neurone.', 'Number 3 is inside the spinal cord and joins the other two neurones, so it is the relay neurone.'], 'understanding', true, 'nerve-reflex-question'),
  a.choice('B31-16', 'The chart shows two response times for one person. Which conclusion fits?', ['Reflexes are always five times faster, for everyone', 'In this test, the reflex was faster than the response that needed thinking', 'Pressing the button did not use the nervous system', 'Both responses took the same time'], 1, 'Compare the two bars, and remember this is one person.', ['The blink reflex took 50 ms and pressing the button took 250 ms; one person cannot show what happens for everyone.', 'So in this test, the reflex was faster than the response that needed thinking.'], 'dataInterpretation', true, 'nerve-reflex-data'),
  a.choice('B31-17', 'A student writes: “In a reflex, you think about the danger, then your brain tells the muscle to move.” What is wrong?', ['Reflexes do not use any neurones', 'The muscle is the receptor in a reflex', 'Nothing, this is correct', 'Reflexes are automatic, so you do not think about the response'], 3, 'Do you decide to pull your hand away from a thorn?', ['A reflex does not involve the thinking part of the brain.', 'Reflexes are automatic, so you do not think about the response.'], 'understanding', true),
  a.written('B31-18', 'You step on a sharp stone with bare feet, and your foot lifts up before you think about it. Describe the path of this reflex, from stimulus to response.', 'Start at the receptors, then name each neurone in order.', 'The sharp stone is the stimulus. Receptors in the skin of the foot detect it. Impulses travel along a sensory neurone to the spinal cord. A relay neurone passes the impulses to a motor neurone. The motor neurone carries the impulses to a muscle in the leg, the effector, which contracts and lifts the foot.', ['Receptors in the skin detect the stimulus, the sharp stone.', 'A sensory neurone carries impulses to the spinal cord, part of the CNS.', 'A relay neurone passes the impulses to a motor neurone.', 'The motor neurone carries impulses to the effector, a muscle.', 'The muscle contracts and lifts the foot.'], ['Saying the thinking part of the brain decides to move the foot.', 'Putting the motor neurone before the sensory neurone.', 'Saying a receptor or a neurone moves the foot, rather than a muscle.']),
]

export const lesson31: ScienceLesson = {
  id: 'B-HOM-031-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'The nervous system and reflexes', prerequisites: ['B-HOMEOSTASIS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
