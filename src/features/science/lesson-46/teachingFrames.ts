import type { TeachingFrame } from '../teachingFrame'

// One garden pond all the way through: first name the layers of life in it (habitat → ecosystem), then what its
// organisms need and compete for, then how they depend on each other in a food web, ending with a stable community.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const communityFrames: Record<string, TeachingFrame[]> = {
  'B46-02': [
    f('Habitat', 'A habitat is the place where an organism lives.', 'habitat = where it lives', 'Think of a garden pond. Small fish called sticklebacks live in it, with snails, pondweed and tiny algae. The place where an organism lives is called its habitat. The pond is their habitat.', 'eco-comm-habitat'),
    f('Population', 'A population is all the organisms of one species in a habitat.', 'one species, one habitat', 'There are several sticklebacks in the pond. They all belong to the same species. All the organisms of one species in a habitat are called a population.', 'eco-comm-population'),
    f('Community', 'A community is all the populations of different species in a habitat.', 'many species together', 'The pond also has populations of snails, pondweed, algae, water beetles and mayfly nymphs. All the populations of different species in a habitat are called a community.', 'eco-comm-community'),
    f('Ecosystem', 'An ecosystem is a community plus the non-living parts around it.', 'living + non-living', 'The living things in the pond also interact with non-living parts, such as the water, light and temperature. A community interacting with the non-living parts of its environment is called an ecosystem.', 'eco-comm-ecosystem'),
    f('Put it together', 'Each word adds a bigger layer.', 'organism → population → community → ecosystem', 'One stickleback is an organism. All the sticklebacks make a population. All the populations make a community. Add the non-living parts, and you have an ecosystem.', 'eco-comm-all'),
  ],
  'B46-05': [
    f('Resources', 'Organisms need things from their surroundings to survive.', 'resources = things they need', 'Every organism needs things to survive and reproduce. It gets them from its environment and from other organisms. These things are called resources.', 'eco-comp-need'),
    f('What plants need', 'Plants need light, water, space and mineral ions.', 'light, water, space, mineral ions', 'Plants need light for photosynthesis. Their roots take in water and mineral ions from the soil. They also need space to spread out their leaves and roots.', 'eco-comp-plants'),
    f('What animals need', 'Animals need food, territory and mates.', 'food, territory, mates', 'Animals need food to eat and mates to reproduce with. Many also need an area of their own, where they find food and raise young. This area is called a territory.', 'eco-comp-animals'),
    f('Competition', 'Organisms compete for the same resources.', 'same resource → compete', 'Resources are often in short supply. When organisms try to get the same resource, this is called competition. They compete with other species, and with members of their own species.', 'eco-comp-compete'),
  ],
  'B46-08': [
    f('Depending on each other', 'Species in a community need each other.', 'food, shelter, pollination, seeds', 'Species in a community depend on each other for food and shelter. Bees pollinate flowers, and birds spread seeds when they eat berries. This is called interdependence.', 'eco-web-depend'),
    f('A food web', 'A food web shows what eats what in a habitat.', 'arrow points to the eater', 'A diagram of what eats what in a habitat is called a food web. Each arrow points from the organism that is eaten to the one that eats it. Algae are tiny living things that make their own food, like plants.', 'eco-web-all'),
    f('One change spreads', 'Removing one species can affect many others.', 'less food ↓, less competition ↑', 'Suppose all the mayfly nymphs died. Sticklebacks would have less food, so their numbers might fall. Snails would have more algae to themselves, so their numbers might rise. One big change can affect the whole community.', 'eco-web-remove'),
    f('Stable communities', 'In a stable community, population sizes stay about the same.', 'in balance → numbers steady', 'In some communities, all the species and the non-living factors are in balance. Numbers go up and down a little, but each population stays about the same size. This is called a stable community.', 'eco-web-stable'),
  ],
}
