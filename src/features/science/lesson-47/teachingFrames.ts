import type { TeachingFrame } from '../teachingFrame'

// Non-living factors first (one field-and-pond scene), then living factors (one woodland scene), then the features
// that let organisms survive where they live, ending with extremophiles in the harshest places.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const factorFrames: Record<string, TeachingFrame[]> = {
  'B47-02': [
    f('Non-living factors', 'Abiotic factors are the non-living parts of an environment.', 'abiotic = non-living', 'You met ecosystems when you learned about communities. The non-living parts of an ecosystem can change, and this affects the living things. The non-living factors in an environment are called abiotic factors.', 'eco-abiotic-all'),
    f('Light, warmth, water and wind', 'Light, temperature, moisture and wind are abiotic factors.', 'bright? warm? wet? windy?', 'How bright the light is, is called the light intensity. Temperature and moisture level are abiotic factors too. So are how strong the wind is and which way it blows.', 'eco-abiotic-weather'),
    f('The soil', 'Soil pH and mineral content are abiotic factors.', 'pH, mineral ions', 'Plants take in mineral ions from the soil, so the mineral content of the soil matters. Soil pH matters too. It tells you how acidic or alkaline the soil is.', 'eco-abiotic-soil'),
    f('Gases', 'Carbon dioxide and oxygen levels are abiotic factors.', 'CO₂ for plants, O₂ for water animals', 'Plants need carbon dioxide for photosynthesis, so its level is an abiotic factor for plants. Animals that live in water need the oxygen dissolved in it. So the oxygen level matters for them.', 'eco-abiotic-gases'),
    f('A change spreads', 'A change in one abiotic factor can affect many species.', 'soil ↓ → grass ↓ → rabbits ↓', 'Suppose the mineral content of the soil falls. The grass grows less well, so there is less of it. The rabbits that eat the grass then have less food, so their population may fall too.', 'eco-abiotic-chain'),
  ],
  'B47-05': [
    f('Living factors', 'Biotic factors are the living parts of an environment.', 'biotic = living', 'Living things affect each other too. The living factors in an environment are called biotic factors. A change in one can change the population size of a species, and of the species that depend on it.', 'eco-biotic-all'),
    f('Food', 'Less food means a smaller population.', 'less food → fewer survive', 'If less food is available, fewer animals survive and breed. So the population size goes down. In a wood, a poor year for nuts and acorns means less food for squirrels.', 'eco-biotic-food'),
    f('New predators', 'A new predator can reduce the animals it eats.', 'new predator → prey ↓', 'An animal that hunts and kills other animals for food is called a predator. If a new predator arrives in a habitat, the population of the animals it eats may go down.', 'eco-biotic-predators'),
    f('New pathogens', 'A new disease can spread quickly.', 'new pathogen → population ↓', 'Pathogens are microorganisms that cause disease. You met them when you learned about infectious diseases. A new pathogen can spread quickly, so the population of the species it infects may fall fast.', 'eco-biotic-pathogens'),
    f('Competition between species', 'One species can outcompete another.', 'grey wins food and shelter → red ↓', 'Red and grey squirrels live in the same woods and eat the same food. Grey squirrels are better at getting food and shelter, so we say they outcompete red squirrels. In many places, the red squirrel population has fallen.', 'eco-biotic-competition'),
  ],
  'B47-08': [
    f('Adaptations', 'Special features help organisms survive where they live.', 'feature → suits its environment', 'Every organism, including microorganisms, has features that help it survive in its environment. These special features are called adaptations. There are three types: structural, behavioural and functional.', 'eco-adapt-all'),
    f('Structural', 'Body shape and colour can be adaptations.', 'a feature of the body', 'Structural adaptations are features of an organism’s body, such as its shape or colour. The Arctic fox has white fur in winter, so it is hard to see against the snow. This helps it hide from predators and creep up on prey. Animals in hot places often have a large surface area compared with their volume, which helps them lose heat.', 'eco-adapt-structural'),
    f('Behavioural', 'The way an organism behaves can be an adaptation.', 'what it does', 'Behavioural adaptations are ways that an organism behaves. Many swallows fly thousands of kilometres to warmer places before winter. This helps them avoid the cold and find food.', 'eco-adapt-behavioural'),
    f('Functional', 'Processes inside the body can be adaptations.', 'what happens inside the body', 'Functional adaptations are things that happen inside the body, linked to processes such as metabolism. Many desert animals lose very little water. They make very little sweat, and only small amounts of concentrated urine.', 'eco-adapt-functional'),
    f('Extremophiles', 'Some organisms live in extreme conditions.', 'very hot, very salty, high pressure', 'Some organisms, mostly microorganisms, live where most living things could not survive. Organisms like this are called extremophiles. Some live in very hot water near volcanic vents. Others live in very salty lakes, or at high pressure deep in the sea.', 'eco-adapt-extreme'),
  ],
}
