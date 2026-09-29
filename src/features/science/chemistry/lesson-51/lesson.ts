import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { lcaFrames as frames } from './teachingFrames'

const source = { id: 'aqa-chemistry', title: 'AQA 8464 Chemistry subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/chemistry-subject-content', locator: '5.10.2.1 Life cycle assessment (the four stages: extracting and processing raw materials, manufacturing and packaging, use and operation, disposal), as on the supplied revision page' }
const skill = 'C-LCA'
const what = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const early = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const late = author(skill, ['5.10.2.1'], ['aqa-chemistry'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const lcaSections = [
  { id: 'C51-01', label: 'Start here', detail: 'Checking a new product' },
  { id: 'C51-02', label: 'What is an LCA?', detail: 'The whole life of a product' },
  { id: 'C51-05', label: 'Getting materials and making it', detail: 'Stages 1 and 2' },
  { id: 'C51-08', label: 'Using it and getting rid of it', detail: 'Stages 3 and 4' },
  { id: 'C51-11', label: 'On your own', detail: 'Stages, effects and a written plan' },
]

const states: ScienceState[] = [
  { ...what.choice('C51-01', 'A company is about to sell a new water bottle. What is the best thing to check about the environment first?', ['How good the bottle looks in an advert', 'The effect on the environment at every stage of its life', 'Only how much it costs to make', 'Only what happens when it is thrown away'], 1, 'Think about the whole life of the bottle, not one moment.', ['A product affects the environment before it is made, while it is made, while it is used and after it is thrown away.', 'Checking every stage gives the fullest picture.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(what, 'C51-02', 'What is an LCA?'),
  what.choice('C51-03', 'What does a life cycle assessment (LCA) look at?', ['Only the factory where a product is made', 'Only what happens when a product is thrown away', 'Every stage of a product’s life, to judge its impact on the environment', 'How much profit a company makes'], 2, 'The word cycle tells you it covers the whole life.', ['An LCA looks at every stage of a product’s life.', 'It judges the impact the product would have on the environment.'], 'recall'),
  what.choice('C51-04', 'What does the word impact mean in an LCA?', ['The effect something has on the environment', 'The price of a product', 'The colour of the packaging', 'The time it takes to make'], 0, 'It is a word for effect.', ['In an LCA, impact means the effect on the environment.', 'Impact is not about cost or looks.']),
  t(early, 'C51-05', 'Getting materials and making it'),
  early.choice('C51-06', 'Which of these belongs to the raw materials stage?', ['Burning the product at the end of its life', 'Using the product at home', 'Putting the product on a shop shelf', 'Mining and extracting materials from the ground'], 3, 'This is the very first stage.', ['Raw materials are the starting materials, and they must be extracted.', 'Mining metals is an example, and it can damage the local environment.'], 'recall'),
  early.choice('C51-07', 'Which of these is a problem in the manufacture and packaging stage?', ['Landfill sites filling up', 'Making the product uses energy and can cause pollution', 'Rubbish being burnt', 'A customer using the product for years'], 1, 'Look for the one that happens in the factory.', ['Manufacture and packaging can use a lot of energy and other resources.', 'It can also cause pollution and make waste.']),
  t(late, 'C51-08', 'Using it and getting rid of it'),
  late.choice('C51-09', 'A product needs a lot of energy to make but lasts for many years. Why can it still do well in an LCA?', ['It is used for a long time, so less waste is made in the long run', 'Energy used never counts in an LCA', 'Long-lasting products cannot be thrown away', 'It uses no raw materials'], 0, 'Think about how many uses the product gets.', ['An LCA looks at how long a product is used and how many uses it gets.', 'A long life means less waste in the long run.']),
  late.choice('C51-10', 'Which of these is a problem at the product disposal stage?', ['Extracting ores from the ground', 'Using energy to make packaging', 'Landfill takes up space and can pollute land and water', 'Fertiliser draining into a river'], 2, 'Disposal is the end of the product’s life.', ['Thrown-away products go to landfill, which takes up space.', 'Landfill can pollute land and water.']),
  late.choice('C51-11', 'Which list shows the four stages of an LCA in the right order?', ['Raw materials, using the product, manufacture and packaging, disposal', 'Manufacture and packaging, raw materials, using the product, disposal', 'Disposal, using the product, manufacture and packaging, raw materials', 'Raw materials, manufacture and packaging, using the product, disposal'], 3, 'Follow the product from the ground to the bin.', ['A product starts as raw materials, then is made and packaged.', 'It is then used, and finally disposed of.'], 'recall', true),
  early.choice('C51-12', 'A factory releases polluting gases while it makes a phone case. Which stage of the LCA is this?', ['Raw materials', 'Manufacture and packaging', 'Using the product', 'Product disposal'], 1, 'Where is the pollution made?', ['The pollution comes from making the product in a factory.', 'That is the manufacture and packaging stage.'], 'application', true),
  late.choice('C51-13', 'The four stages are numbered in the order they happen. A lorry carries worn-out products to a landfill site. Which stage is this?', ['Stage 1', 'Stage 2', 'Stage 4', 'Stage 3'], 2, 'The last stage is when a product is got rid of.', ['Stage 4 is product disposal.', 'Taking rubbish to landfill is part of disposal.'], 'application', true, 'lca-q-cycle'),
  late.choice('C51-14', 'A product is powered by burning fuel while it is used. Why does this matter in an LCA?', ['It releases greenhouse gases and other harmful substances', 'It makes the product last longer', 'It removes the need for raw materials', 'It only affects the factory'], 0, 'This is the using stage.', ['Burning fuels releases greenhouse gases and other harmful substances.', 'The using stage of an LCA includes the effects of using the product.'], 'understanding', true),
  what.written('C51-15', 'A company plans a new metal water bottle. Describe what an LCA would look at for each of the four stages.', 'Go through the four stages in order and give one effect for each.', 'An LCA would look at the whole life of the bottle. Stage 1, raw materials: the metal ore must be mined and extracted, which can damage the local environment and uses energy. Stage 2, manufacture and packaging: making the bottle and its packaging uses energy and resources and may cause pollution or waste. Stage 3, using the product: how many times the bottle is used matters, because a long life means less waste. Stage 4, disposal: the bottle may go to landfill, take up space and pollute land, or be recycled.', ['Names all four stages in the right order.', 'Raw materials: extraction or mining uses energy or damages the environment.', 'Manufacture and packaging: uses energy or resources, or causes pollution or waste.', 'Using the product: how long or how often it is used.', 'Disposal: landfill, pollution, or being burnt or recycled.'], ['Saying an LCA only looks at the factory.', 'Leaving out the disposal stage.', 'Giving the stages out of order without saying so.']),
]

export const lessonC51: ScienceLesson = {
  id: 'C-RES-051-C', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'chemistry',
  title: 'Life cycle assessments', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
