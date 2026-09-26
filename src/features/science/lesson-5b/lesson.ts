import type { ScienceLesson, ScienceState } from '../types'
import { author, biologySource, sampledRequirements } from '../lessonAuthoring'
import { stemCellFrames as frames } from './teachingFrames'

// Split from lesson 5: B5-14…B5-23 and B5-27…B5-30 keep their ids; new screens are B5-34 upward.
const a = author('B-STEM-CELLS', ['4.1.2.3'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const stemCellSections = [
  { id: 'B5-34', label: 'Start here', detail: 'What does mitosis make?' },
  { id: 'B5-14', label: 'What is a stem cell?', detail: 'Divide or differentiate' },
  { id: 'B5-16', label: 'Where are stem cells found?', detail: 'Embryos, bone marrow and meristems' },
  { id: 'B5-18', label: 'Clone a plant', detail: 'Meristems, rare species and crops' },
  { id: 'B5-20', label: 'Could stem cells treat patients?', detail: 'Benefits, risks and ethics' },
  { id: 'B5-35', label: 'Does the treatment work?', detail: 'Judging trial evidence' },
  { id: 'B5-36', label: 'On your own', detail: 'Apply, judge and evaluate' },
]

const states: ScienceState[] = [
  { ...a.choice('B5-34', 'A skin cell divides by mitosis. What are the two new cells like?', ['Each has half the parent cell’s DNA', 'Genetically identical to the parent cell', 'Two different types of cell'], 1, 'Did each new cell get half a set or a complete set of chromosomes?', ['Each daughter cell gets one complete set of chromosomes.', 'So the two new cells are genetically identical to the parent cell.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B5-14', 'What is a stem cell?'),
  a.choice('B5-15', 'Which example shows a stem cell differentiating, rather than making more stem cells?', ['One stem cell divides into two stem cells', 'A stem cell becomes a specialised nerve cell', 'A stem cell copies its DNA'], 1, 'Which change gives the cell one job?', ['Differentiating changes a stem cell into a specialised cell with one job.', 'So becoming a nerve cell is differentiation; dividing into more stem cells is not.']),
  t('B5-16', 'Where are stem cells found?'),
  a.choice('B5-17', 'How do embryonic and adult bone-marrow stem cells compare?', ['All adult body cells can form any human cell type', 'Bone-marrow stem cells can form more types than embryonic stem cells', 'Embryonic stem cells can form more cell types than bone-marrow stem cells'], 2, 'Which one can form most human cell types?', ['Embryonic stem cells can form most types of human cell.', 'So bone-marrow stem cells, which form a smaller range including blood cells, form fewer types.']),
  a.choice('B5-27', 'Which stem-cell source can form any type of plant cell throughout a plant’s life?', ['Human bone marrow', 'Meristem tissue', 'A mature leaf cell'], 1, 'Where does a plant keep its stem cells?', ['Meristems at root and shoot tips contain plant stem cells.', 'So meristem cells can form any plant cell type, all through the plant’s life.'], 'recall'),
  t('B5-18', 'Clone a plant'),
  a.choice('B5-19', 'Why clone a rare plant from meristem stem cells?', ['To make many plants quickly and help protect the species from extinction', 'To give every clone a new, different set of genes', 'To stop the plant growing'], 0, 'What is a clone, and how many can be made?', ['Cloning quickly makes many genetically identical plants.', 'So the number of rare plants goes up, which helps protect the species. Clones add no new genetic variety.']),
  t('B5-20', 'Could stem cells treat patients?'),
  a.choice('B5-21', 'Which statement is a medical risk rather than an ethical objection?', ['A person believes using embryos is wrong', 'A viral infection might be passed to the patient', 'Damaged tissue may be replaced'], 1, 'Which one is a possible harm to the patient’s body?', ['A viral infection is a possible harm, so it is a medical risk.', 'So a belief that using embryos is wrong is an ethical objection, not a risk.']),
  a.choice('B5-22', 'Why are matching genes useful in therapeutic cloning?', ['They guarantee there can be no infection', 'They turn the stem cells into plant cells', 'The patient’s body does not reject the matching cells'], 2, 'What does the body do to cells that are not its own?', ['The embryo has the same genes as the patient, so its stem cells match.', 'So the patient’s body does not reject them. Other risks, such as viral infection, remain.']),
  t('B5-35', 'Does the treatment work?'),
  a.choice('B5-23', 'In an example trial, 6 of 10 people improve after a proposed treatment and 4 do not. What can you conclude from these numbers?', ['In this test, some people improved, but this does not show a guaranteed cure', 'The treatment cures everyone', 'The treatment has no risks'], 0, 'Did everyone improve? Do these numbers say anything about safety?', ['4 of the 10 people did not improve.', 'So this small example does not show that the treatment works for everyone, or that it is safe.'], 'dataInterpretation', false, 'trial'),
  a.choice('B5-36', 'A patient’s bone marrow is damaged by disease. Doctors give them healthy bone-marrow stem cells. Which new cells can these stem cells make?', ['Nerve cells to repair the spine', 'Any type of human cell', 'Plant meristem cells', 'Blood cells'], 3, 'What range of cells can bone-marrow stem cells form?', ['Bone-marrow stem cells form a limited range of cells, including blood cells.', 'So they can make new blood cells, but not every type of human cell.'], 'application', true),
  a.choice('B5-28', 'A proposed stem-cell treatment has possible benefits and a viral-infection risk. Which conclusion is justified?', ['The benefits mean the risk does not need to be studied', 'The treatment is certain to cure paralysis', 'The evidence of benefit, the risks and the ethical issues should all be considered'], 2, 'Does a possible benefit make a treatment certain or safe?', ['A possible benefit does not make a cure certain.', 'So the risks and ethical issues still need to be weighed with the evidence.'], 'application', true),
  a.choice('B5-29', 'In an example trial, 12 of 20 people improve with a treatment. In the control group, 9 of 20 improve without it. Which conclusion fits?', ['In this test, more improved with treatment, but this alone does not prove a reliable cure', 'Every treated person improved', 'The trial shows infection is impossible'], 0, 'Use both groups. Is your claim bigger than the data?', ['12 is more than 9, but 8 treated people did not improve.', 'So in this test the treatment group did better, but this small trial alone does not prove a reliable cure or show the treatment is safe.'], 'dataInterpretation', true),
  a.written('B5-30', 'Embryonic stem cells could replace damaged nerve cells. Evaluate this idea: give a possible benefit, a medical risk and an ethical issue.', 'Take one side at a time. How could the cells help? What harm could occur? Why might someone object to using embryos? Then weigh them; do not claim a guaranteed cure.', 'Embryonic stem cells could differentiate into nerve cells and replace damaged cells. This might help someone with paralysis. However, the cells could pass on a viral infection. Some people object to using embryos for ethical or religious reasons. These concerns must be weighed against the possible benefits. A cure is not guaranteed.', ['Embryonic stem cells could differentiate into nerve cells to replace damaged cells, which might help paralysis.', 'Medical risk: the cells could pass on a viral infection.', 'Ethical or religious objection to using embryos, weighed against the possible benefit.'], ['A guaranteed cure is claimed.', 'All adult specialised cells are said to form every cell type.', 'An ethical objection is described as a viral infection.']),
]

export const lesson5b: ScienceLesson = {
  id: 'B-CELL-005B-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Stem cells', prerequisites: ['B-CELL-DIVISION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biologySource], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
