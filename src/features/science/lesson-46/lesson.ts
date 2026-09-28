import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { communityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.1.1 Communities: habitat, population, community, ecosystem; competition for resources; interdependence; stable communities' }
const a = author('B-ECO-COMMUNITIES', ['4.7.1.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const communitySections = [
  { id: 'B46-01', label: 'Start here', detail: 'Why do seedlings struggle in the shade?' },
  { id: 'B46-02', label: 'Who lives here?', detail: 'Habitat, population, community and ecosystem' },
  { id: 'B46-05', label: 'What do they compete for?', detail: 'Resources and competition' },
  { id: 'B46-08', label: 'Who depends on whom?', detail: 'Interdependence and food webs' },
  { id: 'B46-11', label: 'On your own', detail: 'Bees, a meadow, hedgehogs and roses' },
]

const states: ScienceState[] = [
  { ...a.choice('B46-01', 'Seedlings under a thick tree canopy often grow slowly. What are they most likely short of?', ['Oxygen', 'Light', 'Nitrogen gas'], 1, 'You met photosynthesis when you learned how plants make glucose. What does it need?', ['The tree’s leaves absorb most of the light before it reaches the ground.', 'So the seedlings get little light for photosynthesis, and grow slowly.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B46-02', 'Who lives here?'),
  a.choice('B46-03', 'All the snails in a pond belong to one species. What are they, together?', ['A community', 'An ecosystem', 'A population', 'A habitat'], 2, 'How many species are in the group?', ['The snails are all one species, living in one habitat.', 'All the organisms of one species in a habitat are a population.']),
  a.choice('B46-04', 'Which of these is an ecosystem?', ['All the living things in a wood, with the soil, water and light there', 'All the blackbirds in a wood', 'The place where a blackbird lives'], 0, 'An ecosystem includes non-living parts.', ['All the blackbirds are a population, and the place where one lives is its habitat.', 'A community of living things together with the soil, water and light is an ecosystem.']),
  t('B46-05', 'What do they compete for?'),
  a.choice('B46-06', 'Which resource do plants compete for?', ['Territory', 'Mates', 'Prey', 'Mineral ions'], 3, 'What do roots take in from the soil?', ['Territory, mates and prey are things animals need.', 'Plants compete for light, water, space and mineral ions.']),
  a.choice('B46-07', 'Two robins keep chasing each other around the same garden. What are they most likely competing for?', ['Territory', 'Light', 'Mineral ions'], 0, 'What do animals need that plants do not?', ['Robins are animals, so they need food, territory and mates, not light or mineral ions.', 'Two robins chasing each other in one area are most likely competing for territory.']),
  t('B46-08', 'Who depends on whom?'),
  a.choice('B46-09', 'Look at the pond food web. If all the snails died, which organism would lose some of its food?', ['Algae', 'Water beetles', 'Heron', 'Mayfly nymphs'], 1, 'Follow the arrow that starts at the snails.', ['The arrow from the snails points to the water beetles.', 'So water beetles eat snails, and would lose some of their food.'], 'understanding', false, 'eco-web-all'),
  a.choice('B46-10', 'If all the mayfly nymphs died, why might the number of snails go up?', ['Snails would eat the dead mayfly nymphs', 'Herons would eat more snails', 'Snails would have less competition for algae'], 2, 'What do snails and mayfly nymphs both eat?', ['Mayfly nymphs and snails both eat algae, so they compete for it.', 'Without the mayfly nymphs there is more algae for the snails, so their numbers might rise.']),
  a.choice('B46-11', 'An orchard’s apple trees need bees for pollination. A disease kills most of the bees. What will most likely happen?', ['The trees grow more apples', 'Fewer flowers are pollinated, so fewer apples grow', 'Nothing changes, because trees make their own food', 'The trees start to compete for bees'], 1, 'What do the trees need the bees for?', ['The trees depend on bees to pollinate their flowers.', 'With fewer bees, fewer flowers are pollinated, so fewer apples grow.'], 'application', true),
  a.choice('B46-12', 'Look at the numbered labels on the meadow. Which one points to a population?', ['Label 1', 'Label 2', 'Label 3', 'Label 4'], 2, 'A population is all of one species.', ['Label 1 is the Sun, which is not living. Label 2 is one rabbit, and label 4 surrounds every species: a community.', 'Label 3 surrounds all the rabbits, one species in one habitat, so it is a population.'], 'understanding', true, 'eco-meadow-question'),
  a.choice('B46-13', 'A group counted the hedgehogs in a park each year for six years. Which conclusion fits the data?', ['Hedgehog numbers doubled over the six years', 'Hedgehog numbers will never change in this park', 'Hedgehogs have no competitors in the park', 'The number stayed about the same over these six years'], 3, 'Look at how much the counts change from year to year.', ['The counts stayed between 36 and 42, with small ups and downs.', 'So the number stayed about the same over these six years. The data cannot tell us about the future or about competitors.'], 'dataInterpretation', true, 'eco-hedgehog-data'),
  a.written('B46-14', 'Ladybirds eat greenfly, and greenfly feed on rose bushes. Explain what could happen to the roses if the ladybirds were removed.', 'Go one step at a time: ladybirds, then greenfly, then roses.', 'Without ladybirds, fewer greenfly are eaten, so the greenfly population could increase. More greenfly would then feed on the rose bushes, so the roses could be damaged or grow less well. This shows interdependence: a change to one species affects others in the community.', ['Fewer greenfly are eaten, because there are no ladybirds.', 'So the greenfly population could increase.', 'More greenfly feed on the rose bushes, so the roses could be damaged or grow less well.'], ['Saying the ladybirds eat the roses.', 'Saying nothing would change because roses make their own food.', 'Saying the ladybirds compete with the roses for light.']),
]

export const lesson46: ScienceLesson = {
  id: 'B-ECO-046-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Communities, competition and interdependence', prerequisites: ['B-PHOTOSYNTHESIS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
