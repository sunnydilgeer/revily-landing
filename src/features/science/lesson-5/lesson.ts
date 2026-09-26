import type { ScienceLesson, ScienceState } from '../types'
import { author, biologySource, sampledRequirements } from '../lessonAuthoring'
import { divisionFrames as frames } from './teachingFrames'

// Stem cells moved to lesson-5b (B5-14…B5-23, B5-27…B5-30 keep their ids there).
const a = author('B-CELL-DIVISION', ['4.1.2.1', '4.1.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const divisionSections = [
  { id: 'B5-01', label: 'Start here', detail: 'Where is the genetic material?' },
  { id: 'B5-02', label: 'What is inside the nucleus?', detail: 'Chromosomes, DNA and genes' },
  { id: 'B5-05', label: 'Follow one cell as it divides', detail: 'The cell cycle' },
  { id: 'B5-11', label: 'Count the chromosomes', detail: 'Same number in each new cell' },
  { id: 'B5-12', label: 'Why do cells divide?', detail: 'Growth, replacement and repair' },
  { id: 'B5-24', label: 'On your own', detail: 'Order, count and apply' },
]

const states: ScienceState[] = [
  { ...a.choice('B5-01', 'Nerve cells and muscle cells look very different. Which part of each cell holds its genetic material?', ['The nucleus', 'The cell membrane', 'The mitochondria'], 0, 'Which part of a cell controls what the cell does?', ['The nucleus holds the cell’s genetic material.', 'So every cell with a nucleus, whatever its shape, keeps its genetic material there.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B5-02', 'What is inside the nucleus?'),
  a.choice('B5-03', 'Which statement correctly links chromosomes, DNA and genes?', ['Each gene contains many chromosomes', 'Each chromosome is made of DNA and carries many genes', 'DNA is a small section of a gene'], 1, 'What is a chromosome made of? What is a gene a section of?', ['Each chromosome is one long DNA molecule.', 'So genes, which are sections of that DNA, are carried on the chromosome.']),
  a.choice('B5-04', 'A model body cell has 3 pairs of chromosomes. How many chromosomes does it have?', ['3', '9', '6'], 2, 'How many chromosomes are in one pair?', ['A pair contains two chromosomes.', 'So 3 pairs × 2 = 6 chromosomes.'], 'calculation'),
  t('B5-05', 'Follow one cell as it divides'),
  a.choice('B5-06', 'Why must a cell copy its DNA before it divides?', ['So each new cell gets a full set of genetic information', 'So the cell can get rid of half its DNA', 'So the DNA can turn into a cell membrane'], 0, 'What does each new cell need to receive?', ['Replication copies the DNA in every chromosome.', 'So there is a full set of genetic information for each new cell.']),
  a.choice('B5-08', 'What happens during mitosis?', ['The cell grows and makes more ribosomes', 'One complete set of chromosomes moves to each end and a new nucleus forms around each', 'The cytoplasm and membrane split first, then the DNA is copied'], 1, 'Which step pulls the copies apart?', ['In mitosis, the joined copies are pulled apart to opposite ends.', 'So a new nucleus forms around each complete set. The cell splits afterwards.']),
  a.worked('B5-11', 'How many chromosomes in each new cell?', 'A model cell has 4 chromosomes. It copies its DNA, goes through mitosis, then splits in two. How many chromosomes are in each daughter cell?', ['Replication gives two joined copies of each of the 4 chromosomes. There are still 4 chromosomes.', 'Mitosis pulls the copies apart, so one complete set of 4 goes to each end.', 'The cell splits. Each daughter cell has 4 chromosomes, not 8 and not 2.'], 'cycle-worked'),
  a.choice('B5-10', 'A model cell has 6 chromosomes. It completes the cell cycle. How many chromosomes are in each daughter cell?', ['3', '12', '6'], 2, 'Does each daughter get half a set or a complete set?', ['Each daughter cell gets one complete set of chromosomes.', 'So each keeps the starting number: 6.']),
  t('B5-12', 'Why do cells divide?'),
  a.choice('B5-13', 'In an adult, mitosis makes new skin cells to take the place of cells that are rubbed off. What is this called?', ['Replacement', 'Growth', 'Replication'], 0, 'Are the new cells adding to the body, or taking the place of lost cells?', ['The new cells take the place of worn-out cells.', 'So this is replacement. Replication is copying DNA.']),
  a.choice('B5-33', 'Why can new skin cells made by mitosis do the same job as the old ones?', ['They have twice as many chromosomes', 'They are genetically identical to the old cells', 'They are made by joining two old cells'], 1, 'What did the daughter cells have in common?', ['Mitosis gives daughter cells with the same genes as the parent cell.', 'So the new cells can do the same job as the cells they replace.']),
  a.choice('B5-24', 'A student writes: “A cell does mitosis first, then copies its DNA, then splits in two.” What is wrong?', ['Cells never copy their DNA', 'The cell should split before mitosis', 'The DNA must be copied before mitosis', 'Nothing is wrong'], 2, 'Mitosis separates copies. What must exist first?', ['The cell grows and copies its DNA, then mitosis separates the copies, then the cell splits.', 'So the copying must come before mitosis.'], 'recall', true),
  a.choice('B5-25', 'A model body cell has 8 chromosomes before DNA replication. After mitosis and cell division, each daughter has…', ['8 chromosomes', '4 chromosomes', '16 chromosomes'], 0, 'Count the chromosomes in one daughter, not both together.', ['A complete set goes to each daughter cell.', 'So each daughter keeps the starting number: 8.'], 'application', true),
  a.choice('B5-26', 'A scientist counts dividing cells in two skin samples. Near a healing cut: 30 in every 100 cells. Unhurt skin: 5 in every 100 cells. Which conclusion fits?', ['Unhurt skin cells never divide', 'The cut made the cells copy their DNA twice', 'Every cut heals at the same speed', 'In this test, more cells were dividing near the cut, which fits mitosis repairing tissue'], 3, 'Only say what these two numbers show.', ['30 in 100 is more than 5 in 100, and 5 is not zero.', 'So in this test, more cells were dividing near the cut. Two samples cannot show what happens in every cut.'], 'dataInterpretation', true),
  a.choice('B5-31', 'A model body cell has 9 chromosome pairs. How many chromosomes are in that cell?', ['9', '18', '81'], 1, 'How many chromosomes are in each pair?', ['Each pair has two chromosomes.', 'So 9 pairs × 2 = 18 chromosomes in one body cell.'], 'calculation', true),
  a.written('B5-32', 'You cut your arm. Explain how one skin cell near the cut makes two new cells that help repair it.', 'Go through the steps in order: grow and copy, mitosis, split. Then say why the new cells are useful.', 'The cell grows and copies its DNA. This is replication, so each chromosome now has two copies. In mitosis, one complete set of chromosomes moves to each end and a new nucleus forms around each. The cytoplasm and membrane then divide, making two genetically identical daughter cells. These new cells fill the gap and repair the skin.', ['The cell grows and copies its DNA (replication).', 'In mitosis, one complete set of chromosomes moves to each end and new nuclei form.', 'The cytoplasm and membrane divide to make two genetically identical daughter cells.', 'The new cells fill the gap, so the tissue is repaired.'], ['The DNA is said to be copied after the cell splits.', 'Each daughter cell is said to get half the chromosomes, or double the chromosomes.', 'The damaged cell is said to mend itself.', 'The new cells are said to be a different type from the old ones.']),
]

export const lesson5: ScienceLesson = {
  id: 'B-CELL-005-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Chromosomes and mitosis', prerequisites: ['B-SPECIALISATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biologySource], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
