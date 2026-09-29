import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { emDangerFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.3 Dangers of electromagnetic waves (harm from UV, X-rays and gamma rays, ionising radiation, radiation dose in sieverts, 1000 mSv = 1 Sv, weighing risk and benefit), as on the supplied revision page' }
const skill = 'P-WAV-062-P'
const harm = author(skill, ['6.6.2.3'], ['aqa-physics'])
const dose = author(skill, ['6.6.2.3'], ['aqa-physics'])
const risk = author(skill, ['6.6.2.3'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const emDangerSections = [
  { id: 'P62-01', label: 'Start here', detail: 'The dental X-ray' },
  { id: 'P62-02', label: 'How can EM waves harm us?', detail: 'UV, X-rays and gamma rays' },
  { id: 'P62-05', label: 'How do we measure the risk?', detail: 'Radiation dose in sieverts and millisieverts' },
  { id: 'P62-08', label: 'Is the risk worth it?', detail: 'Benefits, risks and comparing doses' },
  { id: 'P62-12', label: 'On your own', detail: 'Units, comparing doses and explaining' },
]

const states: ScienceState[] = [
  { ...harm.choice('P62-01', 'A dental worker leaves the room while your teeth are X-rayed. Why?', ['X-rays can damage living cells if they are exposed again and again', 'X-rays are very loud', 'X-rays make the room dark', 'X-rays can only travel through walls'], 0, 'Think about what the worker is protecting themselves from, day after day.', ['X-rays can damage living cells, so a worker who is exposed often could build up a large dose.', 'For you, one X-ray is a very small risk.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(harm, 'P62-02', 'How can EM waves harm us?'),
  harm.choice('P62-03', 'Which type of EM radiation can cause sunburn and skin cancer?', ['Radio waves', 'Ultraviolet radiation', 'Microwaves', 'Visible light'], 1, 'It comes from the Sun and is beyond violet on the spectrum.', ['Ultraviolet radiation damages the surface cells of the skin.', 'Over time this can cause skin cancer.'], 'recall'),
  harm.choice('P62-04', 'What does it mean to say that X-rays and gamma rays are ionising?', ['They are very bright', 'They are very slow', 'They can knock electrons off atoms', 'They cannot enter the body'], 2, 'Ionising has to do with atoms and their electrons.', ['Ionising radiation can knock electrons off atoms.', 'In cells this can destroy the cell or mutate its genes, which can lead to cancer.']),
  t(dose, 'P62-05', 'How do we measure the risk?'),
  dose.worked('P62-06', 'Change sieverts into millisieverts', 'A scan gives a radiation dose of 0.005 Sv. What is this in mSv?', ['1 Sv = 1000 mSv.', 'Millisieverts are a smaller unit, so there are more of them. Multiply by 1000.', '0.005 × 1000 = 5 mSv.'], 'emdanger-worked-convert'),
  dose.choice('P62-07', 'A scan gives a dose of 0.008 Sv. What is this in mSv?', ['0.8 mSv', '80 mSv', '8000 mSv', '8 mSv'], 3, 'Follow the same steps: multiply by 1000 to go to the smaller unit.', ['1 Sv = 1000 mSv, so multiply by 1000.', '0.008 × 1000 = 8 mSv.'], 'calculation'),
  t(risk, 'P62-08', 'Is the risk worth it?'),
  risk.worked('P62-09', 'Compare two scan doses', 'A CT scan of the pelvis gives a dose of 6.0 mSv. A CT scan of the knee gives 2.0 mSv. How many times bigger is the pelvis dose?', ['Both doses are already in mSv, so no conversion is needed.', 'Divide the bigger dose by the smaller: 6.0 ÷ 2.0 = 3.', 'The pelvis dose is 3 times bigger, so the risk of harm is 3 times bigger.'], 'emdanger-worked-ratio'),
  risk.choice('P62-10', 'A CT scan of the abdomen gives 10 mSv. A scan of the wrist gives 2.0 mSv. How many times bigger is the abdomen dose?', ['2 times', '5 times', '8 times', '12 times'], 1, 'Divide the bigger dose by the smaller dose.', ['10 ÷ 2.0 = 5.', 'The abdomen dose is 5 times bigger, so the risk of harm is 5 times bigger.'], 'calculation'),
  risk.choice('P62-11', 'A person is X-rayed after a car accident. Why is this usually worth doing?', ['The benefit of finding injuries is greater than the small risk', 'X-rays carry no risk at all', 'Doctors do not think about risk', 'Radiation dose is measured in metres'], 0, 'People weigh up the benefits and the health risks.', ['The risk of harm from one X-ray is very small.', 'Not finding and treating an injury is a much bigger risk.'], 'understanding'),
  dose.choice('P62-12', 'A scan gives a dose of 0.012 Sv. What is this in mSv?', ['1.2 mSv', '12 mSv', '120 mSv', '12 000 mSv'], 1, 'Sieverts to millisieverts: multiply by 1000.', ['1 Sv = 1000 mSv.', '0.012 × 1000 = 12 mSv.'], 'calculation', true),
  risk.choice('P62-13', 'Use the table. How many times bigger is the dose from a spine scan than from a foot scan?', ['9 times', '15 times', '36 times', '4 times'], 3, 'Divide the spine dose by the foot dose.', ['12 ÷ 3.0 = 4.', 'The spine dose is 4 times bigger, so the risk of harm is 4 times bigger.'], 'calculation', true, 'emdanger-q-table'),
  harm.choice('P62-14', 'Which property of gamma rays and X-rays makes them dangerous to people?', ['They are visible', 'They are low frequency', 'They are ionising', 'They travel slowly'], 2, 'Think about what they can do to atoms in cells.', ['Gamma rays and X-rays are ionising radiation.', 'They can knock electrons off atoms and damage or mutate cells.'], 'recall', true),
  harm.written('P62-15', 'A patient is offered a CT scan that uses X-rays. Explain how X-rays can harm the body, and why the scan may still be worth having.', 'Cover the harm, the dose and the benefit.', 'X-rays are ionising radiation. They can knock electrons off atoms in cells, which can destroy cells or mutate genes and may lead to cancer. The risk of harm is measured by the radiation dose in sieverts. The dose from one scan is small, and the risk is outweighed by the benefit of finding and treating a health problem.', ['X-rays are ionising, so they can knock electrons off atoms.', 'This can damage or mutate cells and may lead to cancer.', 'The radiation dose (in sieverts) measures the risk of harm.', 'One scan gives a small dose, so the risk is small.', 'The benefit of finding and treating a problem is greater than the risk.'], ['Saying X-rays are completely safe.', 'Saying dose is measured in metres or joules.', 'Saying that all EM waves are equally harmful.']),
]

export const lessonP62: ScienceLesson = {
  id: 'P-WAV-062-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Dangers of electromagnetic waves', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
