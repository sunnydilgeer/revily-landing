import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-CELL-005-B',
  sections: {
    'B5-02': [
      ['What are chromosomes?', 'Long, thin threads in the nucleus. They carry the genetic material.'],
      ['How are chromosomes, DNA and genes linked?', 'Each chromosome is one very long DNA molecule. A gene is a small section of DNA. Each chromosome carries many genes.', 'A gene is part of the DNA. DNA is not part of a gene.'],
      ['How many chromosomes are in a human body cell?', 'Chromosomes are in pairs. Human body cells have 23 pairs. 23 × 2 = 46 chromosomes.', 'Count pairs × 2. Do not give the number of pairs.'],
    ],
    'B5-05': [
      ['What does a cell do before it divides?', 'It grows and makes more parts, such as ribosomes and mitochondria. Then it copies its DNA. This copying is called replication.', 'Replication is copying DNA. It is not the same as mitosis.'],
      ['What happens in mitosis?', 'The copies of each chromosome are pulled apart. One complete set goes to each end. A new nucleus forms around each set.'],
      ['What is the cell cycle?', 'Grow and copy DNA → mitosis → cytoplasm and membrane split. This makes two genetically identical daughter cells.', 'Chromosomes are not always X-shaped. The X shows a copied chromosome.'],
    ],
    'B5-11': [
      ['A cell has 4 chromosomes. How many does each daughter cell get?', '4. Each daughter cell gets one complete set, so it keeps the starting number.', 'Not 8 and not 2. Count one daughter cell, not both.'],
      ['Does replication change the number of chromosomes?', 'No. Each chromosome now has two joined copies. It still counts as one chromosome.'],
    ],
    'B5-12': [
      ['Why do bodies need mitosis?', 'To make new cells for growth, replacement and repair.'],
      ['What is replacement?', 'Mitosis makes new cells to take the place of worn-out cells, such as skin cells rubbed off.', 'Replacement is not replication. Replication is copying DNA.'],
      ['How is a cut in the skin repaired?', 'Cells near the cut divide by mitosis. The new cells fill the gap. They are genetically identical, so they do the same job.', 'A damaged cell does not mend itself. New cells repair the tissue.'],
    ],
  },
  recall: ['B5-06', 'B5-08', 'B5-13', 'B5-33'],
}
