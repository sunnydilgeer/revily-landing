import type { TeachingFrame } from '../teachingFrame'

// Two ways to reproduce first (so learners know why gametes need half a set), then how meiosis halves the set,
// then what the fertilised cell does next. The gamete drawing, the meiosis tree and the embryo strip each build frame by frame.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const meiosisFrames: Record<string, TeachingFrame[]> = {
  'B38-02': [
    f('Two parents', 'In sexual reproduction, genes from two parents are mixed.', 'two parents → one mix of genes', 'Most animals and plants reproduce with two parents, a male and a female. The offspring get a mixture of genes from both parents. This is called sexual reproduction.', 'inherit-repro-sexual'),
    f('Sex cells', 'Each parent makes sex cells called gametes.', 'gametes: sperm and egg', 'Each parent makes special sex cells. In animals, the male makes sperm cells and the female makes egg cells. In flowering plants, the sex cells are pollen and egg cells. Sex cells are called gametes.', 'inherit-repro-gametes'),
    f('Half a set', 'Each gamete has half the number of chromosomes.', 'body cell 46 → gamete 23', 'A normal human body cell has 46 chromosomes. Each gamete has only half as many, so it has 23. Gametes are made by a special kind of cell division called meiosis.', 'inherit-repro-half'),
    f('Fertilisation', 'A sperm and an egg join, making a full set again.', '23 + 23 = 46', 'A sperm cell and an egg cell join together. The new cell has 23 + 23 = 46 chromosomes, the full number again. The joining of a male and a female gamete is called fertilisation. The new mix of genes makes each offspring different from its parents.', 'inherit-repro-fertilise'),
    f('One parent', 'Asexual reproduction needs only one parent.', 'one parent, mitosis, no mixing', 'Some organisms can reproduce with just one parent. The parent cell divides in two by mitosis. There are no gametes, so no genes are mixed. This is called asexual reproduction.', 'inherit-repro-asexual'),
    f('Clones', 'Asexual offspring are genetically identical to the parent.', 'same genes = clone', 'Each new cell has exactly the same genes as its parent cell. So there is no genetic variation in the offspring. An offspring that is genetically identical to its parent is called a clone.', 'inherit-repro-clones'),
  ],
  'B38-06': [
    f('Where it happens', 'In humans, meiosis happens only in the ovaries and testes.', 'reproductive organs only', 'Meiosis is the cell division that makes gametes. In humans, it only happens in the reproductive organs. These are the ovaries in females and the testes in males.', 'inherit-meiosis-where'),
    f('Pairs', 'The starting cell has its chromosomes in pairs.', 'one from the mother, one from the father', 'The cell that starts meiosis has its chromosomes in pairs. In each pair, one chromosome came from the organism’s mother and one from its father. The diagram shows only two pairs to keep it simple. A human cell has 23 pairs.', 'inherit-meiosis-pairs'),
    f('Copy the DNA', 'First, the DNA in the cell is copied.', 'copy → X shapes', 'First, the cell copies all of its DNA. Each chromosome now has two identical copies joined in the middle. This makes X-shaped chromosomes.', 'inherit-meiosis-copy'),
    f('First division', 'The cell divides, and each new cell gets half the chromosomes.', 'split up the pairs', 'Next, the cell divides into two. The pairs are split up, so each new cell gets one chromosome from each pair. So each new cell has half the number of chromosomes.', 'inherit-meiosis-first'),
    f('Second division', 'Each cell divides again, and the X shapes are pulled apart.', 'split up the X shapes', 'Then each of the two new cells divides again. This time the X-shaped chromosomes are pulled apart. One copy of each goes into each new cell.', 'inherit-meiosis-second'),
    f('Four gametes', 'One cell makes four gametes, all genetically different.', '1 cell → 4 different gametes', 'So one cell makes four new cells, and these are the gametes. Each gamete has a single set of chromosomes, not pairs. Each has a different mix of the mother’s and father’s chromosomes. So all four gametes are genetically different.', 'inherit-meiosis-all'),
  ],
  'B38-09': [
    f('A new cell', 'Fertilisation makes one cell with the full number of chromosomes.', '23 + 23 → 46', 'At fertilisation, two gametes fuse together. This makes one new cell. It has the normal number of chromosomes: 46 in humans, in 23 pairs.', 'inherit-embryo-fuse'),
    f('Many cells', 'The new cell divides by mitosis again and again.', '1 → 2 → 4 → 8 …', 'The new cell divides by mitosis to make two cells. Those cells divide, and so on, many times over. This makes a ball of cells. A young organism at this early stage of growth is called an embryo.', 'inherit-embryo-divide'),
    f('Specialised cells', 'The embryo’s cells differentiate into many types.', 'same start → different jobs', 'As the embryo develops, its cells change to do different jobs. They become specialised cells, such as nerve and muscle cells, that make up a whole organism. This change is called differentiation. You met it when you learned about stem cells.', 'inherit-embryo-specialise'),
  ],
}
