import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { nucModelFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.1.3 Developing the model of the atom (plum pudding, alpha scattering, nuclear model, Bohr, protons, neutrons), as on the supplied revision page' }
const skill = 'P-NUCMODEL'
const early = author(skill, ['6.4.1.3'], ['aqa-physics'])
const scatter = author(skill, ['6.4.1.3'], ['aqa-physics'])
const later = author(skill, ['6.4.1.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const nucModelSections = [
  { id: 'P31-01', label: 'Start here', detail: 'Why do models change?' },
  { id: 'P31-02', label: 'What did scientists first think?', detail: 'Solid spheres, electrons, plum pudding' },
  { id: 'P31-05', label: 'What did the gold foil show?', detail: 'Alpha scattering and the nucleus' },
  { id: 'P31-08', label: 'What came next?', detail: 'Bohr, protons and neutrons' },
  { id: 'P31-11', label: 'On your own', detail: 'Evidence and models' },
]

const states: ScienceState[] = [
  { ...early.choice('P31-01', 'Scientists once thought atoms were solid spheres. Why did that idea change?', ['Scientists got bored of it', 'Atoms changed their shape', 'New evidence did not fit the old idea', 'A new book was printed'], 2, 'Think about what scientists collect when they do experiments.', ['Scientists test ideas with experiments.', 'When new evidence does not fit an idea, the idea is changed.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(early, 'P31-02', 'What did scientists first think?'),
  early.choice('P31-03', 'In the plum pudding model, what are the electrons like?', ['Scattered through a ball of positive charge', 'Orbiting a tiny nucleus', 'Packed together in the centre', 'Joined to protons and neutrons'], 0, 'Think of currants in a pudding.', ['The plum pudding model is a ball of positive charge.', 'The electrons are scattered through the ball.'], 'recall'),
  early.choice('P31-04', 'Which small, negatively charged particles led scientists to the plum pudding model?', ['Protons', 'Neutrons', 'Alpha particles', 'Electrons'], 3, 'Which particle has a negative charge?', ['Electrons are tiny and negatively charged.', 'Finding them showed atoms are not solid spheres, so a new model was needed.']),
  t(scatter, 'P31-05', 'What did the gold foil show?'),
  scatter.choice('P31-06', 'What did the plum pudding model predict most alpha particles would do in the gold foil experiment?', ['Bounce straight back', 'Pass straight through, or bend only slightly', 'Stop inside the foil', 'Turn into electrons'], 1, 'The old model has no dense part to hit.', ['In the plum pudding model, nothing is dense.', 'So most alpha particles should pass straight through, or bend only slightly.']),
  scatter.choice('P31-07', 'A tiny number of alpha particles bounced straight back. What did this suggest?', ['The atom is mostly empty space', 'The electrons are very heavy', 'Most of the mass is in a tiny nucleus', 'The foil was too thin'], 2, 'Something very small and heavy must have been in the way.', ['Bouncing back suggests the particles hit something very small.', 'So most of the mass of the atom is in a tiny nucleus.'], 'dataInterpretation'),
  t(later, 'P31-08', 'What came next?'),
  later.choice('P31-09', 'In Bohr\'s model, where are the electrons?', ['In energy levels at fixed distances from the nucleus', 'Scattered through a ball of positive charge', 'Inside the nucleus', 'Anywhere, at any distance'], 0, 'Bohr improved the nuclear model.', ['Electrons orbit the nucleus in energy levels.', 'Each energy level is at a fixed distance from the nucleus.'], 'recall'),
  later.choice('P31-10', 'Which order shows when the particles were found, first to last?', ['Neutrons, protons, electrons', 'Protons, electrons, neutrons', 'Electrons, neutrons, protons', 'Electrons, protons, neutrons'], 3, 'Electrons came first, and neutrons came last.', ['Electrons were found first, before the plum pudding model.', 'Protons were named after the nucleus was divided, and Chadwick found neutrons last.'], 'recall'),
  later.choice('P31-11', 'A new experiment gives results that the current model cannot explain. What do scientists do?', ['Ignore the results', 'Change or replace the model', 'Stop using models', 'Repeat only the old experiments'], 1, 'Think about how the plum pudding model ended.', ['Evidence that does not fit means the model is wrong or incomplete.', 'So scientists change or replace the model.'], 'understanding', true),
  scatter.choice('P31-12', 'The diagram shows most alpha particles passing straight through the foil. Which conclusion does this support?', ['The atom is a solid ball', 'The nucleus is large', 'Most of the atom is empty space', 'The foil is made of electrons'], 2, 'If particles go straight through, what is in their way?', ['Most particles went straight through the foil.', 'So most of the atom is empty space.'], 'dataInterpretation', true, 'nucmodel-q-scatter'),
  scatter.choice('P31-13', 'Some positive alpha particles were deflected at large angles. What does this show about the nucleus?', ['It is positively charged', 'It is negatively charged', 'It has no charge', 'It is spread through the whole atom'], 0, 'Like charges repel each other.', ['A positive alpha particle is pushed away by something positive.', 'So the nucleus is positively charged.'], 'application', true),
  scatter.written('P31-14', 'Explain why scientists replaced the plum pudding model with the nuclear model.', 'Say what the model predicted, what was seen, and what that showed.', 'The plum pudding model predicted that alpha particles would pass straight through gold foil, or bend only slightly. In the experiment most did pass through, but a tiny number bounced back and some were deflected at large angles. This showed that most of the atom is empty space and that there is a tiny, positive nucleus. The plum pudding model could not explain this, so it was replaced.', ['Says the old model predicted straight through or slight change of direction.', 'Says a few particles were deflected at large angles or bounced back.', 'Links this to a tiny, positively charged nucleus, or mostly empty space.', 'Says the old model could not explain the results, so it was replaced.'], ['Saying the scientists simply preferred a new idea.', 'Saying the gold foil experiment discovered electrons.']),
]

export const lessonP31: ScienceLesson = {
  id: 'P-ATM-031-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Developing the model of the atom', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
