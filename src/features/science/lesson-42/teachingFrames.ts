import type { TeachingFrame } from '../teachingFrame'

// One population of leaf beetles all the way through: natural selection step by step, then the evidence that supports
// it, then what happens when two populations change a lot (speciation) or a species cannot survive (extinction).
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const evolutionFrames: Record<string, TeachingFrame[]> = {
  'B42-02': [
    f('Variation', 'Beetles in one population vary in colour.', 'different genes → different colours', 'A population of beetles lives on green leaves. Their colour varies from green to brown, because of their genes. Birds hunt the beetles.', 'evolve-ns-vary'),
    f('Better adapted', 'Beetles that suit their environment are more likely to survive.', 'hard to spot → more likely to survive', 'Organisms compete for resources, such as food, and must avoid being eaten. Brown beetles are easy for birds to spot on green leaves. Green beetles suit their environment better. We say they are better adapted, so they are more likely to survive.', 'evolve-ns-survive'),
    f('Passing on genes', 'Survivors reproduce and pass on their genes.', 'survive → reproduce → genes passed on', 'The beetles that survive are more likely to reproduce. So the genes for green colour are more likely to be passed on to their offspring. The next generation has more green beetles.', 'evolve-ns-breed'),
    f('Natural selection', 'Over many generations, the useful characteristic becomes common.', 'nature picks who survives', 'This happens again in every generation. Over time, the genes for green colour become more and more common. The environment, not people, decides which individuals survive, so this is called natural selection.', 'evolve-ns-select'),
    f('Evolution', 'The species changes over time.', 'useful characteristics become common → the species changes', 'When useful characteristics become common, the species changes. A species changing over time like this is called evolution. Charles Darwin was the scientist who first explained evolution by natural selection.', 'evolve-ns-evolve'),
  ],
  'B42-05': [
    f('The theory of evolution', 'All species evolved from simple life forms.', 'simple life → today’s species', 'The theory of evolution says all of today’s species evolved from simple life forms. These first developed more than three billion years ago. Natural selection explains how the change happened.', 'evolve-evid-theory'),
    f('A gap in Darwin’s theory', 'Darwin could not explain how characteristics are passed on.', 'what was missing?', 'Darwin’s theory was not complete. In his time, nobody knew how new characteristics appeared or how they were passed on. Since then, scientists have found evidence that supports his theory.', 'evolve-evid-darwin'),
    f('Genes', 'Genetics shows how characteristics are passed on.', 'genes carry characteristics', 'Scientists discovered that characteristics are passed on in genes. They also found that genetic variants can give phenotypes that are better adapted to the environment. You met genetic variants in the last lesson.', 'evolve-evid-genes'),
    f('Fossils', 'Fossils show slow change over time.', 'older rock → older fossils', 'Fossils are the remains of organisms from long ago. Fossils of different ages, together, are called the fossil record. It shows how organisms changed slowly over time.', 'evolve-evid-fossils'),
    f('Bacteria', 'We can see bacteria evolve resistance to antibiotics.', 'evolution we can watch', 'Bacteria can evolve to become resistant to antibiotics, and scientists can see this happen. So, with all this evidence, Darwin’s theory of evolution by natural selection is now widely accepted.', 'evolve-evid-bacteria'),
  ],
  'B42-08': [
    f('Big changes', 'Natural selection can change a population a lot.', 'different places → different characteristics', 'Imagine two populations of the beetle living in very different places, a green forest and a sandy desert. Natural selection favours different characteristics in each. Over a long time, their phenotypes become very different.', 'evolve-spec-split'),
    f('Cannot breed', 'They can no longer breed to have fertile offspring.', 'fertile = can reproduce', 'In the end, the two populations are so different that they cannot breed with each other to produce fertile offspring. Fertile offspring are young that can themselves reproduce.', 'evolve-spec-cannot'),
    f('Speciation', 'Two new species have formed.', 'speciation = new species forming', 'The two populations are now two different species. When new species form like this, it is called speciation.', 'evolve-spec-new'),
  ],
  'B42-10': [
    f('Extinction', 'A species is extinct when no individuals are left.', 'extinct = none left', 'Sometimes every individual of a species dies. When no individuals of a species are left, the species is extinct. This is called extinction.', 'evolve-ext-none'),
    f('Too fast', 'The environment can change faster than the species can adapt.', 'fast change or disaster', 'Natural selection is slow. If the environment changes too quickly, such as when a habitat is destroyed, a species may not survive. A catastrophic event, a sudden disaster such as a volcanic eruption, can also kill them all.', 'evolve-ext-fast'),
    f('Predators and disease', 'A new predator or disease can kill them all.', 'new enemy → none left', 'A new predator can kill every individual of a species, for example when humans hunt it. A new disease can also spread through a species and kill all of them.', 'evolve-ext-predator'),
    f('Losing out on food', 'A species may not win the competition for food.', 'cannot compete → dies out', 'Sometimes a new species arrives that eats the same food. If the original species cannot compete with it for food, it may become extinct.', 'evolve-ext-food'),
    f('Put it together', 'Five reasons a species can become extinct.', 'too fast, disaster, predator, disease, food', 'A species can become extinct if its environment changes too quickly, or a catastrophic event happens. It can also happen because of a new predator, a new disease, or a new species it cannot compete with for food.', 'evolve-ext-all'),
  ],
}
