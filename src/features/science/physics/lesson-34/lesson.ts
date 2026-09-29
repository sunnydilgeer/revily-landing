import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { nuclearRadiationFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.4.2.1 Radioactive decay and nuclear radiation (alpha, beta, gamma, neutron; ionising power, range and what stops each), as on the supplied revision page' }
const skill = 'P-RADIATION'
const decay = author(skill, ['6.4.2.1'], ['aqa-physics'])
const ionising = author(skill, ['6.4.2.1'], ['aqa-physics'])
const props = author(skill, ['6.4.2.1'], ['aqa-physics'])
const uses = author(skill, ['6.4.2.1'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const nuclearRadiationSections = [
  { id: 'P34-01', label: 'Start here', detail: 'Unstable nuclei' },
  { id: 'P34-02', label: 'What comes out of an unstable nucleus?', detail: 'Alpha, beta, gamma and neutrons' },
  { id: 'P34-05', label: 'What is ionising radiation?', detail: 'Knocking electrons off atoms' },
  { id: 'P34-07', label: 'How far does each type go?', detail: 'Range and what stops each type' },
  { id: 'P34-10', label: 'Which radiation for which job?', detail: 'Medical tracers and sterilising' },
  { id: 'P34-12', label: 'On your own', detail: 'Choose and compare' },
]

const states: ScienceState[] = [
  { ...decay.choice('P34-01', 'Some atoms have unstable nuclei. What can an unstable nucleus do?', ['Stay the same for ever', 'Absorb more electrons', 'Decay and give out radiation', 'Turn into a bigger atom'], 2, 'Think about what "unstable" means.', ['An unstable nucleus tends to change.', 'It decays and gives out radiation.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(decay, 'P34-02', 'What comes out of an unstable nucleus?'),
  decay.choice('P34-03', 'What is an alpha particle made of?', ['2 protons and 2 neutrons', 'A fast-moving electron', 'Electromagnetic radiation', '2 electrons and 2 protons'], 0, 'It comes from the nucleus, so think nuclear particles.', ['An alpha particle is 2 protons and 2 neutrons.', 'A beta particle is the fast-moving electron.'], 'recall'),
  decay.choice('P34-04', 'Which type of nuclear radiation is electromagnetic radiation, not a particle?', ['Alpha', 'Beta', 'Gamma', 'Neutron'], 2, 'It is a wave from the nucleus.', ['Gamma rays are electromagnetic radiation.', 'Alpha, beta and neutrons are particles.'], 'recall'),
  t(ionising, 'P34-05', 'What is ionising radiation?'),
  ionising.choice('P34-06', 'What does ionising radiation do to atoms?', ['Adds electrons to them', 'Adds protons to the nucleus', 'Makes them heavier', 'Knocks electrons off and makes positive ions'], 3, 'The word "ion" is the clue.', ['Ionising radiation knocks electrons off atoms.', 'An atom that loses electrons becomes a positive ion.']),
  t(props, 'P34-07', 'How far does each type go?'),
  props.choice('P34-08', 'Which type of radiation is stopped by a sheet of paper?', ['Gamma', 'Alpha', 'Beta', 'All of them'], 1, 'It is the strongest ionising type, with the shortest range.', ['Alpha particles only travel a few centimetres.', 'A sheet of paper is enough to stop them.'], 'recall'),
  props.choice('P34-09', 'Radiation passes through paper but is stopped by aluminium. Which type is it?', ['Beta', 'Alpha', 'Gamma', 'Neutron'], 0, 'It goes further than alpha but not as far as gamma.', ['Alpha is stopped by paper, so it is not alpha.', 'Gamma is not stopped by aluminium, so it is beta.'], 'dataInterpretation'),
  t(uses, 'P34-10', 'Which radiation for which job?'),
  uses.choice('P34-11', 'Which radiation is most suitable for a medical tracer?', ['Alpha', 'Beta', 'Neutron', 'Gamma'], 3, 'It must pass out of the body and do little harm.', ['A tracer must pass through the body and be weakly ionising.', 'Gamma rays do both.'], 'application'),
  uses.choice('P34-12', 'Medical equipment is sealed in packaging and sterilised with radiation. Why is alpha unsuitable?', ['It is too weakly ionising', 'It cannot pass through the packaging', 'It is not radioactive', 'It passes through everything'], 1, 'The radiation has to reach the equipment inside.', ['The radiation must pass through the packaging.', 'Alpha particles are stopped by a thin sheet, so they cannot.'], 'application', true),
  props.choice('P34-13', 'The diagram shows a detector reading with different sheets in front of a source. What type is the source?', ['Beta', 'Alpha', 'Gamma', 'Neutron'], 0, 'See which sheets reduce the reading.', ['The reading stays high with paper, so it is not alpha.', 'It falls with aluminium, so gamma is ruled out and it is beta.'], 'dataInterpretation', true, 'nrad-q-barriers'),
  ionising.choice('P34-14', 'Which list puts the radiations in order of ionising power, strongest first?', ['Gamma, beta, alpha', 'Beta, alpha, gamma', 'Alpha, beta, gamma', 'Alpha, gamma, beta'], 2, 'Alpha is stopped most easily.', ['Alpha is strongly ionising and beta is moderate.', 'Gamma is weak, so the order is alpha, beta, gamma.'], 'recall', true),
  uses.written('P34-15', 'Explain why gamma rays, not alpha particles, are used in medical tracers.', 'Think about where the radiation has to be detected and what it does on the way.', 'A medical tracer is injected and its radiation is detected outside the body, so the radiation must pass through the body. Gamma rays pass through easily but alpha particles cannot. Alpha particles are also strongly ionising and would do a lot of damage inside the body, whereas gamma rays are only weakly ionising.', ['Says the radiation has to be detected outside the body.', 'Says gamma passes through the body but alpha does not.', 'Says alpha is strongly ionising and would damage the body.', 'Says gamma is weakly ionising so does less harm.'], ['Saying gamma is stronger than alpha.', 'Saying alpha is not radioactive.']),
]

export const lessonP34: ScienceLesson = {
  id: 'P-ATM-034-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Alpha, beta and gamma radiation', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
