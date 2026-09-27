import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { inheritedDisorderFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.6.1.7 Inherited disorders: polydactyly (dominant allele) and cystic fibrosis (recessive allele); carriers, genetic diagrams and family trees; embryo screening and the economic, social and ethical issues it raises' }
const a = author('B-INHERITED-DISORDERS', ['4.6.1.7'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const inheritedDisorderSections = [
  { id: 'B40-01', label: 'Start here', detail: 'When does a recessive allele show?' },
  { id: 'B40-02', label: 'Cystic fibrosis', detail: 'A recessive allele, and carriers' },
  { id: 'B40-05', label: 'Polydactyly', detail: 'A dominant allele' },
  { id: 'B40-08', label: 'Read a family tree', detail: 'Shapes, shading and a new baby' },
  { id: 'B40-10', label: 'Embryo screening', detail: 'How it works, and arguments on both sides' },
  { id: 'B40-13', label: 'On your own', detail: 'A new family, a chance and a survey' },
]

const states: ScienceState[] = [
  { ...a.choice('B40-01', 'For an organism to show a recessive characteristic, what must its alleles be?', ['Both recessive, such as bb', 'One dominant and one recessive, such as Bb', 'Both dominant, such as BB', 'Any mix, as long as there is one recessive allele'], 0, 'You met dominant and recessive alleles when you learned about genetic diagrams.', ['A dominant allele shows even when there is only one copy.', 'So a recessive characteristic only shows when both alleles are recessive, such as bb.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B40-02', 'Cystic fibrosis'),
  a.choice('B40-03', 'Why does a carrier of cystic fibrosis not have the disorder?', ['They have no f alleles', 'Cystic fibrosis is caused by a dominant allele', 'They have one F allele, and the f allele is recessive', 'Carriers have two f alleles'], 2, 'What is a carrier’s genotype?', ['A carrier is Ff, with one of each allele.', 'The f allele is recessive, so one F allele means they do not have the disorder.']),
  a.choice('B40-04', 'Two carriers (Ff) have a child. What is the chance that the child is a carrier?', ['1 in 4 (25%)', '3 in 4 (75%)', '0 (0%)', '1 in 2 (50%)'], 3, 'Count the Ff outcomes out of four.', ['The four possible genotypes are FF, Ff, Ff and ff.', '2 of the 4 are Ff, so the chance is 2 in 4 = 1 in 2 (50%).'], 'calculation'),
  t('B40-05', 'Polydactyly'),
  a.choice('B40-06', 'Why can polydactyly be inherited from just one parent?', ['It needs two recessive alleles', 'Only carriers can pass it on', 'It is not inherited', 'It is caused by a dominant allele, so one copy is enough'], 3, 'Is the polydactyly allele dominant or recessive?', ['Polydactyly is caused by the dominant allele D.', 'One copy of a dominant allele is enough, so it can come from just one parent.']),
  a.choice('B40-07', 'Both parents have polydactyly and are Dd. What is the chance their child will not have polydactyly?', ['3 in 4 (75%)', '1 in 4 (25%)', '1 in 2 (50%)', '0 (0%)'], 1, 'Only dd does not have polydactyly. How many squares are dd?', ['The four possible genotypes are DD, Dd, Dd and dd.', 'Only dd does not have polydactyly: 1 of 4, a 1 in 4 (25%) chance.'], 'calculation'),
  t('B40-08', 'Read a family tree'),
  a.choice('B40-09', 'Look at the family tree for cystic fibrosis. Which numbered person is a carrier?', ['Person 1', 'Person 2', 'Person 3', 'Person 4'], 2, 'Use the key. What does a half-shaded shape mean?', ['Person 1 is unaffected, person 2 has cystic fibrosis and person 4 is not born yet.', 'Person 3 is half-shaded, so he is a carrier.'], 'understanding', false, 'inherit-tree-question'),
  t('B40-10', 'Embryo screening'),
  a.choice('B40-11', 'What is embryo screening?', ['Testing embryos for inherited disorders', 'Choosing a baby’s eye colour', 'Treating cystic fibrosis in adults', 'Making embryos by meiosis'], 0, 'What is being tested, and what for?', ['A cell or DNA is taken from the embryo and its genes are tested.', 'Embryo screening is testing embryos for inherited disorders.']),
  a.choice('B40-12', 'Which is an argument against embryo screening?', ['It could help stop people suffering', 'Treating disorders costs a lot of money', 'It could suggest people with genetic disorders are not wanted', 'There are laws to stop it going too far'], 2, 'Three of these are reasons people give in support of screening.', ['Stopping suffering, the cost of treatment and the laws are all given in support of screening.', 'Saying it suggests people with genetic disorders are not wanted is an argument against it.']),
  a.choice('B40-13', 'Look at this family tree for cystic fibrosis. Person 1 does not have cystic fibrosis. What is person 1’s genotype?', ['FF', 'Ff', 'ff'], 1, 'Person 3 has cystic fibrosis. Where did each of person 3’s f alleles come from?', ['Person 3 has cystic fibrosis, so is ff, with one f from each parent; person 1 does not have the disorder, so is not ff.', 'So person 1 must have one F and one f: Ff, a carrier.'], 'application', true, 'inherit-tree-question2'),
  a.choice('B40-14', 'A woman has cystic fibrosis (ff). Her partner is a carrier (Ff). What is the chance that their child will have cystic fibrosis?', ['1 in 4 (25%)', '3 in 4 (75%)', '1 in 2 (50%)', '0 (0%)'], 2, 'The woman can only pass on f. Draw the square.', ['The four possible genotypes are Ff, Ff, ff and ff.', '2 of the 4 are ff, so the chance is 1 in 2 (50%).'], 'calculation', true),
  a.choice('B40-15', 'A survey asked 200 adults in one town when embryo screening should be allowed. The chart shows the results. Which conclusion fits?', ['Everyone in the country supports embryo screening', 'In this survey, more people supported screening for serious disorders than for choosing features', 'Screening to choose eye colour is allowed by law', 'The survey proves embryo screening is right'], 1, 'Compare the two bars, and think about who was asked.', ['70% supported screening for serious disorders and 10% for choosing features, but only 200 people in one town were asked.', 'So in this survey, more people supported screening for serious disorders than for choosing features.'], 'dataInterpretation', true, 'inherit-screen-data'),
  a.written('B40-16', 'Two parents are both carriers of cystic fibrosis. Explain the chance that their child will have cystic fibrosis. Then give one argument for and one argument against embryo screening.', 'Draw the Ff × Ff cross first. Then give one point on each side.', 'Cystic fibrosis is caused by a recessive allele, so a child needs ff to have it. Each parent is Ff, so each can pass on F or f. The cross gives FF, Ff, Ff and ff, a 1 in 4 (25%) chance of cystic fibrosis. Screening could help stop people suffering. But some people say it suggests people with genetic disorders are not wanted.', ['Cystic fibrosis is caused by a recessive allele, so a child needs ff.', 'Each parent is Ff, so each can pass on F or f.', 'The cross gives FF, Ff, Ff and ff: a 1 in 4 (25%) chance of cystic fibrosis.', 'One argument for, such as it could help stop suffering, or treating disorders costs a lot.', 'One argument against, such as it suggests people with disorders are not wanted, could lead to choosing features, or is expensive.'], ['Saying cystic fibrosis is caused by a dominant allele.', 'Saying carriers have the disorder.', 'Saying a 1 in 4 chance means exactly one child in four will have it.', 'Giving arguments on only one side.']),
]

export const lesson40: ScienceLesson = {
  id: 'B-GEN-040-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Inherited disorders and embryo screening', prerequisites: ['B-GENETIC-DIAGRAMS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
