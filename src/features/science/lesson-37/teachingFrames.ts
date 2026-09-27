import type { TeachingFrame } from '../teachingFrame'

// Zoom in from a whole cell to the DNA inside it, then out along one gene to the protein it codes for, then out again
// to the whole genome and what knowing it is good for. Each section reuses one drawing and lights up one part per frame.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const dnaGenomeFrames: Record<string, TeachingFrame[]> = {
  'B37-02': [
    f('Instructions for life', 'DNA carries the instructions for building an organism.', 'DNA = the instructions', 'Every cell carries instructions for building an organism and keeping it working. These instructions are stored in a chemical called DNA. All the genetic material in a cell is made of DNA. In animal and plant cells, it is kept in the nucleus.', 'inherit-dna-cell'),
    f('Chromosomes', 'In the nucleus, DNA is packed into long structures.', 'nucleus → chromosomes', 'Inside the nucleus, the DNA is not loose. It is packed into very long, thin structures. These structures are called chromosomes. You met chromosomes when you learned how cells divide by mitosis.', 'inherit-dna-chromosome'),
    f('Double helix', 'A DNA molecule is two strands twisted together.', 'two strands, one spiral', 'Each chromosome holds one very long DNA molecule, tightly coiled. The molecule is made of two strands wound around each other. This twisted, two-stranded spiral is called a double helix.', 'inherit-dna-helix'),
    f('A polymer', 'Each DNA strand is a long chain of small units.', 'many small units → one long chain', 'Each strand of DNA is made by joining lots of small molecules together in a chain. A long molecule made from many small units joined together is called a polymer. So DNA is a polymer.', 'inherit-dna-polymer'),
    f('Put it together', 'Cell, then nucleus, then chromosome, then DNA.', 'biggest → smallest', 'Start with the whole cell. Its nucleus holds the chromosomes. Each chromosome is one long DNA molecule, coiled up tightly. The DNA is a double helix of two polymer strands.', 'inherit-dna-all'),
  ],
  'B37-05': [
    f('Genes', 'A gene is a small section of DNA on a chromosome.', 'chromosome → many genes', 'A chromosome carries one long DNA molecule. Along it are many short sections, and each one does its own job. A small section of DNA on a chromosome is called a gene.', 'inherit-gene-section'),
    f('Amino acids', 'Each gene codes for amino acids in a set order.', 'gene → which amino acids, in which order', 'A gene works like a code. It tells the cell which small molecules to use, and in which order. These small molecules are called amino acids. Each gene codes for its own sequence of amino acids.', 'inherit-gene-code'),
    f('Proteins', 'The amino acids are joined to make a protein.', 'amino acids joined → protein', 'The cell joins the amino acids together in the order the gene sets. The chain then folds up to make a protein. So each gene codes for a particular protein. You met proteins such as enzymes when you learned about digestion.', 'inherit-gene-protein'),
    f('Put it together', 'Gene, then amino acids in order, then protein.', 'gene → sequence → protein', 'A gene is a small section of DNA on a chromosome. It codes for a particular sequence of amino acids. The amino acids are joined to make a specific protein. Different genes code for different proteins.', 'inherit-gene-all'),
  ],
  'B37-08': [
    f('A genome', 'All of an organism’s genetic material is its genome.', 'genome = all the genetic material', 'Now think about every chromosome in a cell, with every gene on them. All of the genetic material in an organism is called its genome. Most human cells keep their genome on 46 chromosomes.', 'inherit-genome-set'),
    f('Reading the genome', 'Scientists have worked out the whole human genome.', 'the full set, worked out', 'Scientists have worked out the whole human genome. They now know where many genes are on each chromosome. This is very useful for science and medicine, in three main ways.', 'inherit-genome-map'),
    f('Genes and disease', 'Some genes are linked to diseases.', 'find the gene → spot the risk', 'Scientists can search the genome for genes that are linked to different diseases. People with a certain version of one of these genes may be more likely to get the disease. Knowing this can help doctors see who is at risk.', 'inherit-genome-disease'),
    f('Inherited disorders', 'Knowing the genes can lead to treatments.', 'understand → treat', 'Some disorders are passed from parents to their children in their genes. These are called inherited disorders. When scientists know which genes are involved, they can understand a disorder better. This could help them develop treatments.', 'inherit-genome-treat'),
    f('Human migration', 'Tiny differences in genomes show how people moved.', 'tiny differences → where ancestors went', 'Human genomes are almost the same, but there are tiny differences between people. Scientists compare these differences in people living in different places. This shows how groups of humans moved around the world in the past. Movement like this is called migration.', 'inherit-genome-migration'),
  ],
}
