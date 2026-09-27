import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-HOM-031-B',
  sections: {
    'B31-02': [
      ['What makes up the central nervous system (CNS)?', 'The brain and the spinal cord.'],
      ['What do sensory and motor neurones do?', 'Sensory neurones carry electrical impulses from receptors to the CNS. Motor neurones carry impulses from the CNS to effectors.', 'Sensory = towards the CNS; motor = away from it.'],
      ['What are the two types of effector?', 'Muscles, which contract, and glands, which release hormones.'],
    ],
    'B31-05': [
      ['What is the pathway from stimulus to response?', 'Stimulus → receptor → sensory neurone → CNS → motor neurone → effector → response.'],
      ['What does the CNS do in a response?', 'It is a coordination centre. It receives information from receptors and coordinates a response, which effectors carry out.'],
    ],
    'B31-08': [
      ['What is a synapse?', 'The connection between two neurones. There is a tiny gap between them.'],
      ['How does an impulse cross a synapse?', 'Chemicals are released and diffuse across the gap. They set off a new electrical impulse in the next neurone.', 'The impulse does not jump across the gap as electricity.'],
    ],
    'B31-11': [
      ['What is a reflex?', 'A fast, automatic response that does not involve the thinking part of the brain. Reflexes help prevent injury.'],
      ['What is the path of a reflex arc?', 'Receptor → sensory neurone → relay neurone → motor neurone → effector. It passes through the spinal cord or an unconscious part of the brain.'],
      ['What does a relay neurone do?', 'It connects the sensory neurone to the motor neurone, inside the CNS.'],
    ],
  },
  recall: ['B31-04', 'B31-06', 'B31-09', 'B31-12'],
}
