import type { TeachingFrame } from '../teachingFrame'

// One woodland food chain (oak → caterpillar → blue tit → sparrowhawk), built from the producer upwards, then one
// predator–prey graph (rabbits and foxes) walked through a full cycle, ending with the lag.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const foodChainFrames: Record<string, TeachingFrame[]> = {
  'B48-02': [
    f('Producers', 'Producers make their own food using energy from the Sun.', 'Sun → producer', 'Green plants and algae make their own food. They use light from the Sun to make glucose by photosynthesis. An organism that makes its own food is called a producer.', 'eco-chain-producer'),
    f('Biomass', 'Some glucose is used to build new living material.', 'glucose → new leaves, wood, roots', 'An oak tree uses some of its glucose to grow new leaves, wood and roots. The mass of living material in an organism is called its biomass.', 'eco-chain-biomass'),
    f('Food chains', 'A food chain shows what is eaten by what.', 'arrow = is eaten by', 'Caterpillars eat oak leaves, blue tits eat caterpillars, and sparrowhawks eat blue tits. A diagram showing this is called a food chain. Each arrow points to the eater. Biomass passes along the chain as each organism is eaten.', 'eco-chain-arrows'),
  ],
  'B48-05': [
    f('Consumers', 'Consumers eat other organisms.', 'consumer = eats others', 'Animals cannot make their own food. They get it by eating other organisms. Organisms that eat other organisms are called consumers.', 'eco-chain-consumers'),
    f('Primary consumers', 'Primary consumers eat producers.', '1st consumer eats the producer', 'The first consumer in a food chain eats the producer. It is called the primary consumer. Here, the caterpillar is the primary consumer, because it eats oak leaves.', 'eco-chain-primary'),
    f('Secondary consumers', 'Secondary consumers eat primary consumers.', '2nd consumer eats the 1st', 'The next consumer eats the primary consumer. It is called the secondary consumer. Here, the blue tit is the secondary consumer, because it eats caterpillars.', 'eco-chain-secondary'),
    f('Tertiary consumers', 'Tertiary consumers eat secondary consumers.', '3rd consumer eats the 2nd', 'A consumer that eats secondary consumers is called a tertiary consumer. Here, the sparrowhawk is the tertiary consumer, because it eats blue tits.', 'eco-chain-tertiary'),
    f('Put it together', 'Every food chain starts with a producer.', 'count along from the producer', 'Food chains always start with a producer. Then come the primary, secondary and tertiary consumers. To name each one, count along the arrows from the producer.', 'eco-chain-all'),
  ],
  'B48-08': [
    f('Predators and prey', 'Predators hunt and kill their prey.', 'predator eats prey', 'Foxes hunt and kill rabbits for food. You met predators when you learned about biotic factors. The animals a predator eats are called its prey.', 'eco-cycle-meet'),
    f('More rabbits, more foxes', 'When prey increase, predators increase.', 'more food → more predators', 'In a stable community, each population is limited by the food it has. When there are more rabbits, the foxes have more food. More young foxes survive, so the number of foxes rises.', 'eco-cycle-rise'),
    f('More foxes, fewer rabbits', 'When predators increase, prey decrease.', 'more predators → more prey eaten', 'Now there are lots of foxes, so more rabbits get eaten. The number of rabbits falls.', 'eco-cycle-fall'),
    f('Fewer rabbits, fewer foxes', 'When prey decrease, predators decrease.', 'less food → fewer predators', 'With fewer rabbits, the foxes have less food. Fewer foxes survive, so their number falls. With fewer foxes, more rabbits survive, and the cycle starts again.', 'eco-cycle-low'),
    f('The lag', 'The predator peaks come after the prey peaks.', 'prey peak first, predator peak later', 'The two populations rise and fall in cycles. There are fewer foxes than rabbits, and each fox peak comes a while after a rabbit peak. This delay is called a lag. It happens because foxes take time to breed and raise young.', 'eco-cycle-lag'),
  ],
}
