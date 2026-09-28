import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { foodChainFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.2.1 Levels of organisation: producers, primary, secondary and tertiary consumers, biomass in food chains, predator–prey cycles' }
const a = author('B-ECO-FOOD-CHAINS', ['4.7.2.1'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const foodChainSections = [
  { id: 'B48-01', label: 'Start here', detail: 'Where does a plant’s energy come from?' },
  { id: 'B48-02', label: 'Where does food come from?', detail: 'Producers, biomass and food chains' },
  { id: 'B48-05', label: 'Who eats whom?', detail: 'Primary, secondary and tertiary consumers' },
  { id: 'B48-08', label: 'Predators and prey', detail: 'Populations that rise and fall in cycles' },
  { id: 'B48-11', label: 'On your own', detail: 'A pond chain, voles and owls' },
]

const states: ScienceState[] = [
  { ...a.choice('B48-01', 'Where does a plant get the energy to make its own food?', ['From the soil', 'From light from the Sun', 'From the water it takes in', 'From animals that eat it'], 1, 'You met photosynthesis when you learned how plants make glucose.', ['Soil and water give a plant mineral ions and water, not energy.', 'Plants use energy from sunlight to make glucose by photosynthesis.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B48-02', 'Where does food come from?'),
  a.choice('B48-03', 'In a pond, algae make their own food using light. What are the algae?', ['Producers', 'Consumers', 'Predators'], 0, 'Do they make their food or eat it?', ['Algae make their own food by photosynthesis.', 'An organism that makes its own food is a producer.']),
  a.choice('B48-04', 'In a food chain, an arrow goes from the caterpillar to the blue tit. What does it show?', ['The caterpillar eats the blue tit', 'The blue tit makes food for the caterpillar', 'The blue tit eats the caterpillar'], 2, 'Which way does an arrow point?', ['Each arrow points to the eater.', 'So the blue tit eats the caterpillar, and biomass passes from the caterpillar to the blue tit.']),
  t('B48-05', 'Who eats whom?'),
  a.choice('B48-06', 'Look at the numbered food chain from a pond. Which number is the secondary consumer?', ['Number 1', 'Number 2', 'Number 3', 'Number 4'], 2, 'Count along the arrows from the producer.', ['Number 1 is the producer, and number 2 eats it, so it is the primary consumer.', 'Number 3 eats the primary consumer, so it is the secondary consumer.'], 'understanding', false, 'eco-pondchain-question'),
  a.choice('B48-07', 'Grass → rabbit → fox. How many consumers are in this food chain?', ['One', 'Two', 'Three'], 1, 'Which organisms eat other organisms?', ['Grass makes its own food, so it is the producer.', 'The rabbit and the fox both eat other organisms, so there are two consumers.']),
  t('B48-08', 'Predators and prey'),
  a.choice('B48-09', 'Why does the number of foxes rise a while after the number of rabbits rises?', ['Foxes eat grass as well', 'Rabbits hunt foxes', 'Foxes need more light', 'It takes time for foxes to breed and raise young'], 3, 'What has to happen before there are more foxes?', ['More rabbits means more food for foxes.', 'But it takes time for foxes to breed and raise young, so their numbers rise later.']),
  a.choice('B48-10', 'The number of foxes is at its highest. What is most likely to happen to the rabbits next?', ['Their number falls', 'Their number rises', 'Their number stays the same'], 0, 'What do lots of foxes do to rabbits?', ['With lots of foxes, more rabbits are eaten.', 'So the number of rabbits falls.']),
  a.choice('B48-11', 'In a pond: algae → water flea → stickleback → pike. Which organism is the tertiary consumer?', ['Water flea', 'Stickleback', 'Pike', 'Algae'], 2, 'Count along from the producer: primary, secondary, tertiary.', ['Algae are the producer, the water flea is the primary consumer and the stickleback is the secondary consumer.', 'The pike eats the secondary consumer, so it is the tertiary consumer.'], 'application', true),
  a.choice('B48-12', 'The graph shows the numbers of voles and of the owls that eat them. Which line shows the owls?', ['Line A', 'Line B', 'You cannot tell from the graph'], 1, 'Predators are usually fewer, and their peaks come later.', ['There are usually fewer predators than prey, and predator peaks come after prey peaks.', 'Line B is lower and peaks after line A, so line B shows the owls.'], 'dataInterpretation', true, 'eco-cycle-question'),
  a.choice('B48-13', 'The table shows voles and owls counted in one wood. Which conclusion fits the counts?', ['Owls were the only reason vole numbers fell', 'Owl numbers peaked one year after vole numbers peaked', 'There were always more owls than voles', 'Vole numbers stayed the same'], 1, 'Find the year each population was highest.', ['Voles were highest in year 3, and owls were highest in year 4.', 'So owl numbers peaked one year after vole numbers. The counts alone cannot show that owls were the only cause.'], 'dataInterpretation', true, 'eco-vole-data'),
  a.choice('B48-14', 'A disease kills most of the rabbits in an area. What is most likely to happen to the foxes that eat them?', ['Their number falls, because they have less food', 'Their number rises, because there is less competition', 'Nothing, because foxes are predators'], 0, 'What do the foxes eat?', ['The rabbits are the foxes’ food.', 'With fewer rabbits, fewer foxes survive, so their number falls.'], 'application', true),
  a.written('B48-15', 'Explain why the numbers of a predator and its prey rise and fall in cycles. Use foxes and rabbits as your example.', 'Start with more rabbits. Then follow what happens to the foxes, and then back to the rabbits.', 'When there are more rabbits, the foxes have more food, so more foxes survive and their number rises. More foxes eat more rabbits, so the number of rabbits falls. Then the foxes have less food, so their number falls, and the rabbits can increase again. The fox numbers change a while after the rabbit numbers, because foxes take time to breed.', ['More rabbits means more food, so the number of foxes rises.', 'More foxes eat more rabbits, so the number of rabbits falls.', 'Fewer rabbits means less food, so the number of foxes falls and the rabbits can increase again.', 'Fox numbers lag behind rabbit numbers, because foxes take time to breed.'], ['Saying foxes and rabbits rise and fall at exactly the same time.', 'Saying rabbits eat foxes.', 'Saying there are usually more foxes than rabbits.']),
]

export const lesson48: ScienceLesson = {
  id: 'B-ECO-048-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Food chains and predator–prey cycles', prerequisites: ['B-ECO-COMMUNITIES', 'B-PHOTOSYNTHESIS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
