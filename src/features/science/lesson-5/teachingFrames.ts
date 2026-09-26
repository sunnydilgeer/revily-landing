import type { TeachingFrame } from '../teachingFrame'

// One story: zoom into the nucleus, then follow ONE cell through the whole cell cycle,
// then ask why bodies need new cells. One new word per screen. Plain meaning first, then the term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const divisionFrames: Record<string, TeachingFrame[]> = {
  'B5-02': [
    f('Zoom into the nucleus', 'The nucleus holds long threads of genetic material.', 'cell → nucleus → threads', 'Specialised cells, such as nerve and muscle cells, each have a nucleus. Zoom in and you see long, thin threads. They carry the genetic material. These threads are called chromosomes.', 'chromosomes'),
    f('Made of DNA', 'Each chromosome is one very long molecule.', 'chromosome → one long molecule', 'Each chromosome is one very long molecule, coiled up tightly. So a lot of genetic information fits inside a small nucleus. This molecule is called DNA.', 'chromosomes'),
    f('Small sections', 'A short section of DNA is a gene.', 'DNA → many short sections', 'Look at the highlighted part of the DNA. A short section like this carries the information for one feature. A section of DNA is called a gene. Each chromosome carries many genes.', 'chromosomes'),
    f('Usually in pairs', 'Chromosomes in body cells come in pairs.', 'pairs × 2 = chromosomes', 'In body cells, chromosomes are normally found in pairs. A pair means two. Human body cells have 23 pairs, so 23 × 2 = 46 chromosomes. This diagram shows only two pairs, to keep it clear.', 'pairs'),
    f('Put it together', 'Nucleus → chromosomes → DNA → genes.', 'cell → nucleus → chromosome → DNA → gene', 'The nucleus contains chromosomes. Each chromosome is a long DNA molecule. Each gene is a small section of that DNA. In body cells, the chromosomes are in pairs.', 'chromosomes'),
  ],
  'B5-05': [
    f('Step 1: grow', 'Before it divides, the cell grows.', 'grow → more parts', 'A cell cannot just split in half straight away. First it grows bigger. It makes more of its parts, such as mitochondria and ribosomes. So each new cell will have enough of them.', 'cycle-copy'),
    f('Step 2: copy the DNA', 'The cell copies the DNA in every chromosome.', 'copy → enough for two cells', 'Next, the cell makes a copy of the DNA in every chromosome. Then there is a full set of genetic information for each new cell. This copying is called replication.', 'cycle-copy'),
    f('A copied chromosome', 'After replication, each chromosome has two joined copies.', 'two joined copies = still one chromosome', 'After replication, each chromosome has two identical copies, joined at one point. It is often drawn as an X. Chromosomes are not always X-shaped; the X only shows a copied chromosome. Our model cell still has 2 chromosomes.', 'cycle-copy'),
    f('Step 3: pull the copies apart', 'One complete set moves to each end of the cell.', 'copies separate → two nuclei', 'Then the joined copies are pulled apart. One complete set of chromosomes moves to each end of the cell. A new nucleus forms around each set. This stage is called mitosis.', 'cycle-separate'),
    f('Step 4: split in two', 'The cytoplasm and membrane divide.', 'one cell → two cells', 'Finally, the cytoplasm and cell membrane divide. This makes two new cells. They are called daughter cells. Each has the same genes, so they are genetically identical.', 'cycle-daughters'),
    f('Put it together', 'Grow and copy → mitosis → split into two.', 'grow and copy → mitosis → split', 'The cell grows and copies its DNA. Then mitosis moves one complete set to each end. Then the cell splits in two. This repeating sequence is called the cell cycle. Our cell started with 2 chromosomes, and each daughter cell has 2.', 'cycle-daughters'),
  ],
  'B5-12': [
    f('More cells to grow', 'Mitosis makes the extra cells a body needs to grow.', 'more cells → growth', 'You started life as a single cell. Now you are made of many cells. Being made of many cells is called multicellular. Mitosis, over and over, makes the extra cells for growth and development.', 'cycle-daughters'),
    f('Replacing worn-out cells', 'New cells take the place of old ones.', 'old cells lost → new cells made', 'Even in an adult, cells wear out. Skin cells are rubbed off every day. Mitosis makes new cells to take their place. This is called replacement.', 'repair'),
    f('Repairing damage', 'New cells fill in damaged tissue.', 'cut → cells divide → gap filled', 'When you cut your skin, cells near the cut divide by mitosis. The new cells fill the gap. This is called repair. New cells repair the tissue; a damaged cell does not mend itself.', 'repair'),
    f('Put it together', 'Mitosis is used for growth, replacement and repair.', 'growth, replacement, repair', 'Mitosis makes new cells for growth, replacement and repair. The new cells are genetically identical to the old ones, so they can do the same job. Next, you will meet cells that can divide and then become many different types.', 'repair'),
  ],
}
