import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { wsMethodFrames as frames } from './teachingFrames'

const source = { id: 'aqa-working-scientifically', title: 'AQA 8464 Working scientifically and practical skills', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification', locator: 'WS 1.1 The development of scientific methods and models, WS 1.2 Scientific ideas over time (hypothesis, prediction, peer review, accepted theories, models), as on the supplied revision page' }
const skill = 'W-MTH-001-W'
const a = author(skill, ['WS1.1', 'WS1.2'], ['aqa-working-scientifically'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
// Puts the correct answer at a chosen position so the answer positions are spread across the lesson.
const q = (id: string, title: string, right: string, wrong: string[], pos: number, hint: string, steps: string[], dimension: Parameters<typeof a.choice>[6] = 'understanding', independent = false, visual?: string) => {
  const labels = [...wrong]; labels.splice(pos, 0, right)
  return a.choice(id, title, labels, pos, hint, steps, dimension, independent, visual)
}

export const wsMethodSections = [
  { id: 'W1-01', label: 'Start here', detail: 'Why we believe what we believe' },
  { id: 'W1-02', label: 'How is a hypothesis tested?', detail: 'Observation, hypothesis, prediction, test' },
  { id: 'W1-05', label: 'Who checks the result?', detail: 'Peer review and sharing evidence' },
  { id: 'W1-08', label: 'When is an idea accepted?', detail: 'Accepted theories and changing ideas' },
  { id: 'W1-11', label: 'What is a model?', detail: 'Spatial and computational models, and their limits' },
  { id: 'W1-14', label: 'On your own', detail: 'Order the steps, weigh evidence and describe a test' },
]

const states: ScienceState[] = [
  { ...q('W1-01', 'Long ago, many people blamed illness on bad air. What is the best reason for scientists to drop an idea like this?', 'Careful tests gave evidence that supports a better explanation', ['Most people stopped talking about it', 'A famous person disagreed with it', 'It was too old to be true'], 0, 'Think about what scientists use to decide between two explanations.', ['Scientists change their minds when evidence supports a better explanation.', 'Age, fame and popularity do not make an idea right or wrong.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('W1-02', 'How is a hypothesis tested?'),
  q('W1-03', 'Ice melts faster on a metal tray. A student thinks, "Metal transfers energy by heating faster." What is this?', 'A hypothesis', ['An observation', 'A prediction', 'A result'], 2, 'Is it something she saw, or a possible explanation for what she saw?', ['It is a possible explanation, so it is a hypothesis.', 'The observation was the ice melting faster on the metal tray.']),
  q('W1-04', 'The hypothesis is "Fertiliser makes wheat grow taller". Which is a prediction based on it?', 'Wheat given fertiliser will grow taller than wheat without it', ['Fertiliser is made of chemicals', 'Some wheat plants in the field are taller', 'Farmers use fertiliser every year'], 1, 'A prediction says what should happen in a test if the hypothesis is right.', ['The prediction can be tested: grow wheat with and without fertiliser and measure.', 'The other statements do not say what a test should show.']),
  t('W1-05', 'Who checks the result?'),
  q('W1-06', 'Why do other scientists check a new result?', 'To see whether the experiment was done sensibly and the evidence holds up', ['To make sure it matches what they already expect', 'So the first scientist can be paid', 'To hide results they do not like'], 3, 'Think about what the checking is meant to catch.', ['This checking is called peer review.', 'It is there to find mistakes and weak evidence, not to protect an idea.'], 'understanding'),
  q('W1-07', 'Three teams repeat an experiment and all get very different results from the first team. What does this suggest?', 'The first result may be wrong, so more testing is needed', ['The hypothesis is certainly true', 'Nobody should repeat experiments', 'The first team must have been cheating'], 1, 'Results that other people cannot get again are not yet trusted.', ['Repeats that disagree with the first result are new evidence.', 'It does not prove cheating, but the first result cannot be trusted yet.'], 'dataInterpretation'),
  t('W1-08', 'When is an idea accepted?'),
  q('W1-09', 'When can a hypothesis become an accepted theory?', 'When all the evidence supports it after lots of testing', ['When the first experiment gives the result expected', 'When the scientist who thought of it says so', 'When it is printed in a newspaper'], 0, 'Think about how much testing has to happen.', ['An accepted theory has survived lots of testing over many years.', 'A single result, or one person\'s opinion, is not enough.'], 'recall'),
  q('W1-10', 'New evidence shows that a hypothesis is wrong. What should scientists do?', 'Change the hypothesis or make a new one, then test again', ['Ignore the new evidence', 'Keep the hypothesis and repeat until it works', 'Stop studying that topic'], 2, 'Scientists follow the evidence.', ['Evidence against a hypothesis means it must be changed or replaced.', 'Then the new hypothesis is tested in the same way.'], 'understanding'),
  t('W1-11', 'What is a model?'),
  q('W1-12', 'A computer simulation shows how a flu virus might spread through a school. What type of model is this?', 'A computational model', ['A spatial model', 'An observation', 'A hypothesis'], 3, 'Look at how it is made, not what it is about.', ['A computational model uses a computer to simulate a complex process.', 'A spatial model shows where the parts of something are placed.']),
  q('W1-13', 'A student says his model of an atom explains everything about atoms. What is wrong with this?', 'Every model has limits, so one model cannot explain everything', ['Models can never explain anything', 'Only computers are allowed to make models', 'Models cannot be used to make predictions'], 2, 'Think about the Bohr model: useful, but not perfect.', ['All models have limits.', 'Models can explain ideas and make predictions, but they leave some things out.']),
  q('W1-14', 'A scientist writes, "Plants kept in the dark will make less starch." Which numbered box in the chain is this?', 'Box 3', ['Box 1', 'Box 2', 'Box 4'], 2, 'It says what should happen in a test.', ['The chain runs observation, hypothesis, prediction, test.', 'A statement of what should happen if the hypothesis is right is a prediction, which is box 3.'], 'understanding', true, 'wsmethod-q-chain'),
  q('W1-15', 'One team finds a medicine works. A second team repeats the test and finds no effect. What is the best next step?', 'Compare how each experiment was done, then run more tests', ['Accept the first team because it went first', 'Reject the medicine for ever', 'Choose whichever result is more exciting'], 1, 'Neither result is the final word yet.', ['Two results that disagree mean scientists need to check the methods and gather more evidence.', 'Order and excitement do not decide what is true.'], 'dataInterpretation', true),
  q('W1-16', 'An old model of the atom could not explain new experimental results. What usually happens next?', 'The model is changed to fit the new evidence', ['The results are thrown away', 'The model stays the same for ever', 'Scientists stop making models'], 3, 'Think about how the accepted atom model has changed over time.', ['New evidence that a model cannot explain leads scientists to change or replace it.', 'This is how ideas about the atom developed.'], 'application', true),
  a.written('W1-17', 'A student notices that puddles dry faster on windy days. Describe how she could use the scientific method to test an explanation.', 'Give the steps in order, from the observation to what happens to the evidence.', 'The observation is that puddles dry faster on windy days. Her hypothesis could be that wind carries the water away faster. The prediction is that a dish of water in front of a fan will dry faster than one with no fan. She tests this fairly, measuring how much water is left after the same time. She shares her results so others can check and repeat them. If the evidence supports the hypothesis it may be accepted. If not, she changes it or makes a new one.', ['A clear observation.', 'A possible explanation stated as a hypothesis.', 'A prediction that can be tested.', 'An experiment described, with the result used as evidence.', 'Other scientists check or repeat the work (peer review).', 'The hypothesis is accepted, changed or replaced depending on the evidence.'], ['Saying an experiment proves the hypothesis for certain.', 'Writing a prediction that cannot be tested.', 'Leaving out how the evidence is used.']),
]

export const lessonW1: ScienceLesson = {
  id: skill, contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'skills',
  title: 'The scientific method', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
