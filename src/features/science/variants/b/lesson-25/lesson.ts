import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { drugTestingFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.9 Development of drugs: efficacy, toxicity and dose; preclinical and clinical testing; placebos, double-blind trials and peer review' }
const a = author('B-DRUG-TESTING', ['4.3.1.9'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const drugTestingSections = [
  { id: 'B25-01', label: 'Start here', detail: 'Where did aspirin come from?' },
  { id: 'B25-02', label: 'Testing in the lab', detail: 'Cells, animals, efficacy, toxicity and dosage' },
  { id: 'B25-05', label: 'Clinical trials', detail: 'Healthy volunteers, patients and the optimum dose' },
  { id: 'B25-08', label: 'A fair test', detail: 'Placebos, double-blind trials and peer review' },
  { id: 'B25-11', label: 'On your own', detail: 'Doses, reasons and trial results' },
]

const states: ScienceState[] = [
  { ...a.choice('B25-01', 'Aspirin was first made from a chemical found in which plant?', ['Foxglove', 'Willow', 'Rose'], 1, 'You met aspirin in Lesson 24.', ['Digitalis came from foxgloves.', 'Aspirin, a painkiller, was first made from a chemical found in willow.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B25-02', 'Testing in the lab'),
  a.choice('B25-03', 'In preclinical testing, what is drug M tested on first?', ['Live animals', 'Healthy volunteers', 'Patients with migraines', 'Human cells and tissues in the lab'], 3, 'Start with the smallest living parts.', ['Preclinical testing happens before any people take the drug.', 'It starts with human cells and tissues in the lab, then moves on to live animals.']),
  a.choice('B25-04', 'A test shows that high doses of drug M harm the kidneys. Which property does this tell us about?', ['Efficacy', 'Toxicity', 'Dosage'], 1, 'Is this about whether it works, how harmful it is, or how much to give?', ['Efficacy is whether the drug works, and dosage is how much to give.', 'Harm to the body is about toxicity.']),
  t('B25-05', 'Clinical trials'),
  a.choice('B25-06', 'Why do clinical trials start with healthy volunteers?', ['To check for harmful side effects while the body is working normally', 'Because healthy people get better faster', 'To find out whether the drug eases migraines'], 0, 'What does “healthy” tell you about their bodies?', ['Healthy volunteers have bodies that are working normally.', 'So trials start with them, to check for harmful side effects.']),
  a.choice('B25-07', 'Look at the numbered stages. At which stage do people first take drug M?', ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'], 2, 'Cells and animals come before people.', ['Stages 1 and 2 are cells and animals, in preclinical testing.', 'Stage 3 shows healthy volunteers, the first people to take drug M.'], 'understanding', false, 'trial-stages-question'),
  t('B25-08', 'A fair test'),
  a.choice('B25-09', 'What is a placebo?', ['A stronger dose of the drug', 'A substance that looks like the drug but does not do anything', 'A drug that has been tested on animals', 'A drug that stops side effects'], 1, 'Group 2 is compared with group 1.', ['A placebo looks like the drug, so the patients cannot tell them apart.', 'But it does not do anything.']),
  a.choice('B25-10', 'In a double-blind trial, who knows which patients got drug M before the results are gathered?', ['Only the doctors', 'Only the patients', 'Both the doctors and the patients', 'Neither the patients nor the doctors'], 3, 'Think about what “double” adds to a blind trial.', ['In a blind trial, only the patients do not know.', 'In a double-blind trial, neither the patients nor the doctors know.']),
  a.choice('B25-11', 'The chart shows results for four doses of drug M. Which is the optimum dose?', ['Dose 1', 'Dose 2', 'Dose 3', 'Dose 4'], 2, 'Look for strong relief with few side effects.', ['Dose 4 gives only a little more relief than dose 3, but many more side effects.', 'Dose 3 is the most effective dose with few side effects.'], 'application', true, 'trial-dose-question'),
  a.choice('B25-12', 'Why are new drugs tested on cells and animals before any people take them?', ['To check that they work and are not too harmful before people are put at risk', 'Because animals are cheaper to test than cells', 'So that the drug does not need a clinical trial'], 0, 'What could happen if a harmful drug went straight to people?', ['Tests on cells and animals show whether a drug works and how harmful it is.', 'So they come first, to check that it works and is not too harmful before people are put at risk.'], 'understanding', true),
  a.choice('B25-13', 'Why are many clinical trials double-blind?', ['So that nobody’s expectations can affect the results', 'So that the drug works faster', 'So that there is no need for a placebo'], 0, 'Knowing which pill someone got could change how they feel or judge the results.', ['If patients or doctors know who got drug M, their expectations could change the results.', 'In a double-blind trial nobody knows, so nobody’s expectations can affect the results.'], 'understanding', true),
  a.choice('B25-14', 'The chart shows migraine days in a double-blind trial. Which conclusion fits it?', ['Drug M cures migraines for everyone', 'The placebo had no effect at all', 'Both groups improved, but drug M reduced migraine days more', 'Drug M made migraines worse'], 2, 'Compare how far each group’s bars fell.', ['Both groups had fewer migraine days, so the placebo group improved too, and nothing shows a cure for everyone.', 'Drug M’s group fell further, from 8 to 3 days, than the placebo group, from 8 to 6.'], 'dataInterpretation', true, 'trial-results-data'),
  a.written('B25-15', 'Describe the stages a new drug goes through before doctors can use it.', 'Start in the lab and end with the published results.', 'First the drug is tested on human cells and tissues in the lab, then on live animals, to find its efficacy, toxicity and dosage. If it passes, it is tested in a clinical trial: first on healthy volunteers at a very low dose, then on patients, to find the optimum dose. Patients may be given the drug or a placebo in a double-blind trial. The results are checked by peer review before they are published.', ['Preclinical testing: cells and tissues, then live animals.', 'Efficacy, toxicity and dosage are checked.', 'Clinical trial: healthy volunteers on a very low dose, then patients.', 'Comparison with a placebo, often double-blind.', 'Peer review before the results are published.'], ['Putting people before animals, or patients before healthy volunteers.', 'Saying a placebo is a weaker dose of the drug.', 'Mixing up blind and double-blind.', 'Saying peer review is done by the company that made the drug.']),
]

export const lesson25: ScienceLesson = {
  id: 'B-INF-025-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Testing new drugs', prerequisites: ['B-MEDICINES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
