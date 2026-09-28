# Lesson 51 storyboard — Communities, competition and interdependence

First lesson of chapter B7, Ecology. Folder `lesson-46`, id `B-ECO-046-B`, skill `B-ECO-COMMUNITIES`.

Big idea: living things in a habitat form populations and communities; they compete for the resources they need, and they depend on each other, so one big change can spread through a whole community.

Flow note: one garden pond carries the whole lesson. It opens with an everyday puzzle (why seedlings under a thick tree grow slowly) that is really about competing for light.
1. **Who lives here?** The four words are built as layers on one drawing of the pond: habitat → population → community → ecosystem, then a nested-box summary. Each word needs the one before, so the order is fixed.
2. **What do they compete for?** Resources come next, because competition only makes sense once you know what organisms need: plants (light, water, space, mineral ions) then animals (food, territory, mates), then competition with other species and with their own species.
3. **Who depends on whom?** Interdependence (food, shelter, pollination, seed dispersal), then the pond food web, then what happens when one species is removed (less food for one population, less competition for another), ending with stable communities.

Sections:
1. Start here (B46-01): seedlings under a thick tree canopy are short of light (links to photosynthesis).
2. Who lives here? (B46-02–04): checks what the snails in a pond are (a population); which description is an ecosystem.
3. What do they compete for? (B46-05–07): checks which resource plants compete for; two robins competing for territory.
4. Who depends on whom? (B46-08–10): checks, on the food web, who loses food if the snails die; why snails might increase if the mayfly nymphs die (less competition for algae).
5. On your own (B46-11–14): an orchard losing its bees (application); a numbered meadow, which label is a population (assessment view hides the names); an invented hedgehog count read without over-claiming; teacher-reviewed written answer on ladybirds, greenfly and roses.

Wording rules: one new term per frame, plain meaning first; photosynthesis is referred to by topic; British spelling. The food web arrows always point to the eater.

Out of scope: abiotic and biotic factors by name (the next lesson); food chains and trophic names (producer, primary consumer and so on; a later lesson); predator–prey cycles; the book's stream food web, table and cartoon.

Source boundary: supplied revision-guide page 79 (scope only); AQA 8464 section 4.7.1.1. The pond and its food web, the orchard, meadow, hedgehog data, ladybird scenario, all questions and all wording are original. Draft pending teacher review.

## Diagram plan
- `components/EcologyVisuals.tsx`, focus prefix `eco-`.
- **The pond** (`eco-comm-habitat/population/community/ecosystem`): a pond in cross-section (sticklebacks, snails, pondweed, algae, a water beetle, mayfly nymphs, reeds and a heron) beside a numbered 1–4 step list (lesson 18 style). Step 1 outlines the pond; step 2 circles the four sticklebacks and fades the rest; step 3 circles every living thing; step 4 adds light, water and temperature labels. `eco-comm-all` is the nested-box summary (ecosystem ⊃ community ⊃ population ⊃ one organism).
- **Needs and competition** (`eco-comp-need/plants/animals/compete`): two panels, a plant and a seedling (light, water, space, mineral ions) and blackbirds with territories, a worm and a mate. The last frame adds "other species compete" and "same species compete" with "vs" markers.
- **Interdependence** (`eco-web-depend`): four tiles: food, shelter, pollination, seed dispersal.
- **Pond food web** (`eco-web-all/remove`): algae → mayfly nymphs and snails; nymphs → sticklebacks and water beetles; snails → water beetles; sticklebacks → heron. The remove frame crosses out the nymphs and marks "less food: may fall" and "more algae: may rise". Also the diagram for B46-09 (names needed, no answer shown).
- **Stable pond** (`eco-web-stable`): line graph of snails and sticklebacks over 10 years, each roughly level.
- **Question diagrams**: `eco-meadow-question` (Sun, one rabbit, a ring round four rabbits, a box round all living things; names hidden in assessment view) and `eco-hedgehog-data` (bar chart, 36–42 hedgehogs over six years).

## States in full

### B46-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Seedlings under a thick tree canopy often grow slowly. What are they most likely short of?
- 0 Oxygen · **1 Light ✓** · 2 Nitrogen gas
- Hint: You met photosynthesis when you learned how plants make glucose. What does it need?
- Explanation: The tree’s leaves absorb most of the light before it reaches the ground. So the seedlings get little light for photosynthesis, and grow slowly.

### B46-02 · teach "Who lives here?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Habitat | A habitat is the place where an organism lives. | habitat = where it lives | Think of a garden pond. Small fish called sticklebacks live in it, with snails, pondweed and tiny algae. The place where an organism lives is called its habitat. The pond is their habitat. | `eco-comm-habitat` |
| Population | A population is all the organisms of one species in a habitat. | one species, one habitat | There are several sticklebacks in the pond. They all belong to the same species. All the organisms of one species in a habitat are called a population. | `eco-comm-population` |
| Community | A community is all the populations of different species in a habitat. | many species together | The pond also has populations of snails, pondweed, algae, water beetles and mayfly nymphs. All the populations of different species in a habitat are called a community. | `eco-comm-community` |
| Ecosystem | An ecosystem is a community plus the non-living parts around it. | living + non-living | The living things in the pond also interact with non-living parts, such as the water, light and temperature. A community interacting with the non-living parts of its environment is called an ecosystem. | `eco-comm-ecosystem` |
| Put it together | Each word adds a bigger layer. | organism → population → community → ecosystem | One stickleback is an organism. All the sticklebacks make a population. All the populations make a community. Add the non-living parts, and you have an ecosystem. | `eco-comm-all` |

### B46-03 · choice · `understanding, guided`
**Q:** All the snails in a pond belong to one species. What are they, together?
- 0 A community · 1 An ecosystem · **2 A population ✓** · 3 A habitat
- Hint: How many species are in the group?
- Explanation: The snails are all one species, living in one habitat. All the organisms of one species in a habitat are a population.

### B46-04 · choice · `understanding, guided`
**Q:** Which of these is an ecosystem?
- **0 All the living things in a wood, with the soil, water and light there ✓** · 1 All the blackbirds in a wood · 2 The place where a blackbird lives
- Hint: An ecosystem includes non-living parts.
- Explanation: All the blackbirds are a population, and the place where one lives is its habitat. A community of living things together with the soil, water and light is an ecosystem.

### B46-05 · teach "What do they compete for?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Resources | Organisms need things from their surroundings to survive. | resources = things they need | Every organism needs things to survive and reproduce. It gets them from its environment and from other organisms. These things are called resources. | `eco-comp-need` |
| What plants need | Plants need light, water, space and mineral ions. | light, water, space, mineral ions | Plants need light for photosynthesis. Their roots take in water and mineral ions from the soil. They also need space to spread out their leaves and roots. | `eco-comp-plants` |
| What animals need | Animals need food, territory and mates. | food, territory, mates | Animals need food to eat and mates to reproduce with. Many also need an area of their own, where they find food and raise young. This area is called a territory. | `eco-comp-animals` |
| Competition | Organisms compete for the same resources. | same resource → compete | Resources are often in short supply. When organisms try to get the same resource, this is called competition. They compete with other species, and with members of their own species. | `eco-comp-compete` |

### B46-06 · choice · `understanding, guided`
**Q:** Which resource do plants compete for?
- 0 Territory · 1 Mates · 2 Prey · **3 Mineral ions ✓**
- Hint: What do roots take in from the soil?
- Explanation: Territory, mates and prey are things animals need. Plants compete for light, water, space and mineral ions.

### B46-07 · choice · `understanding, guided`
**Q:** Two robins keep chasing each other around the same garden. What are they most likely competing for?
- **0 Territory ✓** · 1 Light · 2 Mineral ions
- Hint: What do animals need that plants do not?
- Explanation: Robins are animals, so they need food, territory and mates, not light or mineral ions. Two robins chasing each other in one area are most likely competing for territory.

### B46-08 · teach "Who depends on whom?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Depending on each other | Species in a community need each other. | food, shelter, pollination, seeds | Species in a community depend on each other for food and shelter. Bees pollinate flowers, and birds spread seeds when they eat berries. This is called interdependence. | `eco-web-depend` |
| A food web | A food web shows what eats what in a habitat. | arrow points to the eater | A diagram of what eats what in a habitat is called a food web. Each arrow points from the organism that is eaten to the one that eats it. Algae are tiny living things that make their own food, like plants. | `eco-web-all` |
| One change spreads | Removing one species can affect many others. | less food ↓, less competition ↑ | Suppose all the mayfly nymphs died. Sticklebacks would have less food, so their numbers might fall. Snails would have more algae to themselves, so their numbers might rise. One big change can affect the whole community. | `eco-web-remove` |
| Stable communities | In a stable community, population sizes stay about the same. | in balance → numbers steady | In some communities, all the species and the non-living factors are in balance. Numbers go up and down a little, but each population stays about the same size. This is called a stable community. | `eco-web-stable` |

### B46-09 · choice · `understanding, guided` · question diagram `eco-web-all`
**Q:** Look at the pond food web. If all the snails died, which organism would lose some of its food?
- 0 Algae · **1 Water beetles ✓** · 2 Heron · 3 Mayfly nymphs
- Hint: Follow the arrow that starts at the snails.
- Explanation: The arrow from the snails points to the water beetles. So water beetles eat snails, and would lose some of their food.

### B46-10 · choice · `understanding, guided`
**Q:** If all the mayfly nymphs died, why might the number of snails go up?
- 0 Snails would eat the dead mayfly nymphs · 1 Herons would eat more snails · **2 Snails would have less competition for algae ✓**
- Hint: What do snails and mayfly nymphs both eat?
- Explanation: Mayfly nymphs and snails both eat algae, so they compete for it. Without the mayfly nymphs there is more algae for the snails, so their numbers might rise.

### B46-11 · choice · `application, independent`
**Q:** An orchard’s apple trees need bees for pollination. A disease kills most of the bees. What will most likely happen?
- 0 The trees grow more apples · **1 Fewer flowers are pollinated, so fewer apples grow ✓** · 2 Nothing changes, because trees make their own food · 3 The trees start to compete for bees
- Hint: What do the trees need the bees for?
- Explanation: The trees depend on bees to pollinate their flowers. With fewer bees, fewer flowers are pollinated, so fewer apples grow.

### B46-12 · choice · `understanding, independent` · question diagram `eco-meadow-question`
**Q:** Look at the numbered labels on the meadow. Which one points to a population?
- 0 Label 1 · 1 Label 2 · **2 Label 3 ✓** · 3 Label 4
- Hint: A population is all of one species.
- Explanation: Label 1 is the Sun, which is not living. Label 2 is one rabbit, and label 4 surrounds every species: a community. Label 3 surrounds all the rabbits, one species in one habitat, so it is a population.

### B46-13 · choice · `dataInterpretation, independent` · question diagram `eco-hedgehog-data`
**Q:** A group counted the hedgehogs in a park each year for six years. Which conclusion fits the data?
- 0 Hedgehog numbers doubled over the six years · 1 Hedgehog numbers will never change in this park · 2 Hedgehogs have no competitors in the park · **3 The number stayed about the same over these six years ✓**
- Hint: Look at how much the counts change from year to year.
- Explanation: The counts stayed between 36 and 42, with small ups and downs. So the number stayed about the same over these six years. The data cannot tell us about the future or about competitors.

### B46-14 · written · `explanation, transfer`
**Q:** Ladybirds eat greenfly, and greenfly feed on rose bushes. Explain what could happen to the roses if the ladybirds were removed.
- Hint: Go one step at a time: ladybirds, then greenfly, then roses.
- Model answer: Without ladybirds, fewer greenfly are eaten, so the greenfly population could increase. More greenfly would then feed on the rose bushes, so the roses could be damaged or grow less well. This shows interdependence: a change to one species affects others in the community.
- Teacher-reviewed (not auto-marked). Rubric points:
  - Fewer greenfly are eaten, because there are no ladybirds.
  - So the greenfly population could increase.
  - More greenfly feed on the rose bushes, so the roses could be damaged or grow less well.
- Reject:
  - Saying the ladybirds eat the roses.
  - Saying nothing would change because roses make their own food.
  - Saying the ladybirds compete with the roses for light.
