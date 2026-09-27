import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { dnaGenomeFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.6.1.4 DNA and the genome: DNA as a polymer of two strands in a double helix, found in chromosomes; a gene codes for a particular sequence of amino acids to make a specific protein; the genome and the importance of understanding the human genome' }
const a = author('B-DNA-GENOME', ['4.6.1.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const dnaGenomeSections = [
  { id: 'B37-01', label: 'Start here', detail: 'Which part of a cell holds its genetic material?' },
  { id: 'B37-02', label: 'Where is the DNA?', detail: 'Nucleus, chromosomes, double helix and polymer' },
  { id: 'B37-05', label: 'What does a gene do?', detail: 'Genes, amino acids and proteins' },
  { id: 'B37-08', label: 'The whole genome', detail: 'What a genome is, and why knowing ours helps' },
  { id: 'B37-11', label: 'On your own', detail: 'Cells, a numbered diagram, a claim and some data' },
]

const states: ScienceState[] = [
  { ...a.choice('B37-01', 'In an animal cell, which part holds the genetic material and controls what the cell does?', ['Cell membrane', 'Cytoplasm', 'Nucleus', 'Mitochondria'], 2, 'You met this part when you learned about animal and plant cells.', ['The membrane controls what goes in and out, and most reactions happen in the cytoplasm and mitochondria.', 'The nucleus holds the genetic material and controls the cell.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B37-02', 'Where is the DNA?'),
  a.choice('B37-03', 'What is the shape of a DNA molecule called?', ['A single strand', 'A double helix', 'A chromosome pair', 'A nucleus'], 1, 'How many strands are there, and how are they arranged?', ['A DNA molecule has two strands, not one.', 'The two strands coil around each other, so the shape is a double helix.']),
  a.choice('B37-04', 'Look at the numbered parts. Which number shows a chromosome?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'A chromosome is DNA packed into a long structure inside the nucleus.', ['Part 1 is the cell, part 2 is its nucleus and part 4 is the DNA double helix.', 'Part 3 is a chromosome: DNA packed into a long structure.'], 'understanding', false, 'inherit-dna-question'),
  t('B37-05', 'What does a gene do?'),
  a.choice('B37-06', 'What is a gene?', ['A whole chromosome', 'A protein made in the nucleus', 'A type of cell', 'A small section of DNA on a chromosome'], 3, 'Is a gene bigger or smaller than a chromosome?', ['A chromosome carries many genes, and a gene codes for a protein rather than being one.', 'A gene is a small section of DNA on a chromosome.']),
  a.choice('B37-07', 'What does a gene code for?', ['A particular sequence of amino acids, which makes a protein', 'A new nucleus for the cell', 'Glucose for respiration', 'A chromosome'], 0, 'What does the cell join together to make a protein?', ['A gene sets which amino acids are used, and in which order.', 'So it codes for a particular sequence of amino acids, which makes a protein.']),
  t('B37-08', 'The whole genome'),
  a.choice('B37-09', 'What is an organism’s genome?', ['One of its genes', 'All of the genetic material in the organism', 'The nucleus of one cell', 'All the proteins in the organism'], 1, 'Is a genome a part, or the whole set?', ['A gene is one small section of DNA, and proteins are what genes code for.', 'The genome is all of the genetic material in the organism.']),
  a.choice('B37-10', 'Which is one way that understanding the human genome helps medicine?', ['Scientists can find genes linked to diseases', 'It makes everyone’s genome the same', 'It stops cells from making proteins', 'It makes the nucleus bigger'], 0, 'Think of the three uses: disease, inherited disorders and migration.', ['Knowing where genes are lets scientists search for the ones linked to diseases.', 'This helps doctors see who is at risk, and could lead to treatments.']),
  a.choice('B37-11', 'A student looks at a cell from a carrot root under a microscope. Where is most of the cell’s DNA?', ['In the cell wall', 'In the nucleus, packed into chromosomes', 'In the vacuole', 'Root cells have no DNA'], 1, 'Is DNA kept in the same place in plant cells and animal cells?', ['The cell wall and the vacuole do not hold DNA, and root cells need DNA like any other cell.', 'Most of the DNA is in the nucleus, packed into chromosomes.'], 'application', true),
  a.choice('B37-12', 'The diagram shows a chromosome and what its DNA codes for. Which number shows one gene?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 2, 'A gene is a small section of DNA on a chromosome.', ['Part 1 is the whole chromosome, part 2 is its DNA double helix and part 4 is a protein.', 'Part 3 is one small section of the DNA: a gene.'], 'understanding', true, 'inherit-gene-question'),
  a.choice('B37-13', 'Sam writes: “A gene is a protein found in the nucleus.” Which sentence corrects Sam?', ['A gene is a section of DNA that codes for a protein', 'A gene is a whole chromosome that codes for a cell', 'A gene is one amino acid', 'Sam is correct'], 0, 'Is a gene the protein itself, or the code for it?', ['A gene is not a protein; the protein is made from amino acids in the order the gene codes for.', 'A gene is a section of DNA that codes for a protein.'], 'understanding', true),
  a.choice('B37-14', 'A study compared one gene in 500 people with a disease and 500 without. See the graph. Which conclusion fits?', ['Everyone with this version of the gene gets the disease', 'This version of the gene is more common in people with the disease', 'This gene has nothing to do with the disease', 'This gene is the only cause of the disease'], 1, 'Compare the two bars. Did everyone in either group have it?', ['42% of people with the disease had this version, compared with 12% of people without it; most people with the disease did not have it.', 'So it is more common in people with the disease, but the data cannot show it is the only cause.'], 'dataInterpretation', true, 'inherit-genome-data'),
  a.written('B37-15', 'Explain what a gene is and how it leads to a protein. Then give one use of studying the human genome.', 'Say where a gene is and what it codes for, then give one use of the genome.', 'A gene is a small section of DNA on a chromosome, in the nucleus. It codes for a particular sequence of amino acids. The cell joins these amino acids together to make a specific protein. Knowing the human genome helps scientists find genes linked to diseases, so doctors can see who is at risk.', ['A gene is a small section of DNA.', 'Genes are on chromosomes, in the nucleus.', 'A gene codes for a particular sequence of amino acids.', 'The amino acids are joined to make a specific protein.', 'One correct use: finding genes linked to disease, understanding and treating inherited disorders, or tracing human migration.'], ['Saying a gene is a protein or an amino acid.', 'Saying a gene is a whole chromosome, or the whole genome.', 'Saying DNA is found in the cell membrane or cytoplasm.', 'Saying the genome shows exactly which diseases a person will get.']),
]

export const lesson37: ScienceLesson = {
  id: 'B-GEN-037-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'DNA, genes and the genome', prerequisites: ['B-CELL-DIVISION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
