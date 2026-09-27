import type { TeachingFrame } from '../teachingFrame'

// One class of people and one garden: first why individuals differ (genes, environment, or both), then where new
// versions of genes come from (mutation), then what a mutation can do, ending with the hand-on to natural selection.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const variationFrames: Record<string, TeachingFrame[]> = {
  'B41-02': [
    f('Variation', 'Individuals of one species all differ a little.', 'same species, different individuals', 'Look around your class. Everyone is a human, so you all belong to one species. But no two people look exactly the same. Differences between individuals of the same species are called variation.', 'evolve-var-people'),
    f('Caused by genes', 'Some differences come from the genes you inherit.', 'genes from your parents → genetic variation', 'You inherit genes from your parents. Some characteristics are set by genes alone, such as eye colour. Inherited disorders, such as cystic fibrosis, are too. Variation caused by genes is called genetic variation.', 'evolve-var-genes'),
    f('Caused by conditions', 'Some differences come from the conditions an organism lives in.', 'same genes, different conditions', 'Two plants grown from pieces of one mint plant have exactly the same genes. One grows in a sunny spot and stays bushy and green. The other grows in the dark and becomes tall, thin and pale. Variation caused by living conditions is called environmental variation.', 'evolve-var-env'),
    f('Genes and conditions', 'Most characteristics depend on both.', 'genes set the limit; conditions decide the rest', 'Most variation comes from a mix of genes and the environment. Genes set the greatest height a plant or animal could reach. How tall it actually grows depends on its environment, such as how much food or water it gets.', 'evolve-var-both'),
    f('Put it together', 'Genes, the environment, or both.', 'genes / environment / both', 'Some characteristics, such as eye colour, are set by genes alone. Some differences, such as a pale plant grown in the dark, come from the environment. Most characteristics, such as height, depend on both.', 'evolve-var-all'),
  ],
  'B41-05': [
    f('A code in the DNA', 'A gene is a small section of DNA.', 'gene = a section of DNA with a code', 'You met DNA and genes when you learned about the genome. A gene is a small section of DNA. The parts of the DNA are in a set order. This order is a code that tells the cell how to make a protein.', 'evolve-mut-code'),
    f('A random change', 'A mutation is a random change to a gene.', 'mutation = random change', 'Sometimes the code in a gene changes by chance. A random change like this is called a mutation. Mutations happen all the time, in all living things.', 'evolve-mut-change'),
    f('A new version', 'A mutation makes a new form of the gene.', 'new form of a gene = genetic variant', 'After a mutation, the gene is different. So there is now a new form of the gene. A different form of a gene made by a mutation is called a genetic variant.', 'evolve-mut-variant'),
  ],
  'B41-08': [
    f('Most: little or no effect', 'Most genetic variants make little or no difference.', 'most → no change you can see', 'Most genetic variants have very little effect, or none at all, on the phenotype. You met phenotype, the characteristics an organism has, when you learned about genetic diagrams.', 'evolve-mut-none'),
    f('Some: a small effect', 'Some variants change a characteristic a little.', 'some → a slight change', 'Some characteristics, such as eye colour, are controlled by more than one gene. A mutation in one of those genes might change the eye colour a bit. But the difference is small.', 'evolve-mut-small'),
    f('Rarely: a big effect', 'Very rarely, a variant gives a new phenotype.', 'very rarely → a new phenotype', 'Very rarely, a variant has such a big effect that it produces a new phenotype. Cystic fibrosis is one example. One variant of one gene causes the disorder.', 'evolve-mut-big'),
    f('Useful when things change', 'A new phenotype can help if the environment changes.', 'suits the new conditions → spreads', 'Sometimes a new phenotype suits a changed environment better. Individuals with it survive and reproduce more, so the variant spreads through the species quite quickly. This is natural selection, which you will learn about in the next lesson.', 'evolve-mut-useful'),
  ],
}
