import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { cyclesFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.2.2 How materials are cycled: the water cycle, the carbon cycle, and the role of microorganisms in returning carbon dioxide to the air and mineral ions to the soil' }
const a = author('B-MATERIAL-CYCLES', ['4.7.2.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const cyclesSections = [
  { id: 'B50-01', label: 'Start here', detail: 'Droplets on a cold window' },
  { id: 'B50-02', label: 'Follow the water', detail: 'Evaporation, condensation and precipitation' },
  { id: 'B50-05', label: 'Why do living things need water?', detail: 'Plants and animals in the water cycle' },
  { id: 'B50-07', label: 'What happens to dead things?', detail: 'Decay recycles materials' },
  { id: 'B50-10', label: 'Follow the carbon', detail: 'The carbon cycle' },
  { id: 'B50-13', label: 'On your own', detail: 'Fallen leaves, diagrams and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B50-01', 'On a cold morning, tiny drops of water appear on the inside of a window. What is this change called?', ['Evaporation', 'Condensation', 'Melting', 'Freezing'], 1, 'The water was in the air as a gas before it hit the cold glass.', ['Water vapour in the air cools when it touches the cold glass.', 'It turns back into liquid water. This change from gas to liquid is condensation.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B50-02', 'Follow the water'),
  a.choice('B50-03', 'Look at the numbered arrows on the water cycle. Which one shows condensation?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 2, 'Condensation happens where water vapour cools high up in the sky.', ['Arrows 1 and 2 show water vapour leaving the sea and a tree, and arrow 4 shows water falling.', 'Arrow 3 shows rising water vapour cooling and forming a cloud, which is condensation.'], 'understanding', false, 'earth-water-question'),
  a.choice('B50-04', 'How does water get from the land and sea into the air?', ['By evaporation and transpiration', 'By precipitation', 'By run-off into rivers', 'By condensation'], 0, 'Which steps turn liquid water into water vapour?', ['Precipitation and run-off move water down, and condensation turns vapour back into liquid.', 'Evaporation from the land and sea, and transpiration from plants, put water vapour into the air.']),
  t('B50-05', 'Why do living things need water?'),
  a.choice('B50-06', 'How does a rabbit return water to the environment?', ['By photosynthesis', 'In its waste, such as urine', 'By eating plants'], 1, 'Think about what an animal gets rid of.', ['Rabbits take in water by eating and drinking.', 'They return water to the soil and air in their waste, such as urine.']),
  t('B50-07', 'What happens to dead things?'),
  a.choice('B50-08', 'What breaks down dead leaves and animal waste in the soil?', ['Rain', 'Plant roots', 'Sunlight', 'Microorganisms'], 3, 'Decay is done by living things too small to see.', ['Rain, roots and sunlight do not feed on dead material.', 'Microorganisms, such as bacteria and fungi, break it down. This is decay.']),
  a.choice('B50-09', 'Why is decay important for plants?', ['It returns mineral ions to the soil for plants to take in', 'It adds oxygen to the soil', 'It makes the leaves fall off'], 0, 'What does decay put back into the soil?', ['Microorganisms break down waste and dead material.', 'This returns mineral ions to the soil, so plants can take them in again and grow.']),
  t('B50-10', 'Follow the carbon'),
  a.choice('B50-11', 'Look at the numbered arrows on the carbon cycle. Which one shows carbon dioxide being taken out of the air?', ['Arrow 1', 'Arrow 3', 'Arrow 5', 'Arrow 6'], 0, 'Which arrow points down from the air into a living thing?', ['Arrows 3, 5 and 6 all carry carbon dioxide up into the air.', 'Arrow 1 is photosynthesis, which takes carbon dioxide out of the air into the tree.'], 'understanding', false, 'earth-carbon-question'),
  a.choice('B50-12', 'How do microorganisms return carbon to the air?', ['They photosynthesise', 'They respire and release carbon dioxide', 'They store it in the soil for ever'], 1, 'What do all living things do with carbon compounds to release energy?', ['Microorganisms feed on dead material and waste.', 'They use the carbon compounds in respiration, which releases carbon dioxide into the air.']),
  a.choice('B50-13', 'Leaves fall onto a woodland floor in autumn. By the next summer, most of them have gone. What has happened to them?', ['The Sun made them evaporate', 'Tree roots took in the whole leaves', 'Microorganisms broke them down, returning carbon dioxide to the air and mineral ions to the soil'], 2, 'What feeds on dead material in the soil?', ['Leaves do not evaporate, and roots take in water and mineral ions, not whole leaves.', 'Microorganisms decayed the leaves. This returned carbon dioxide to the air and mineral ions to the soil.'], 'application', true),
  a.choice('B50-14', 'Look at the numbered arrows on the water cycle. Which one shows water vapour leaving plants?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 5'], 1, 'Find the arrow that starts at a plant.', ['Arrow 1 starts at the sea, arrow 3 goes into the cloud, and arrow 5 runs to the sea.', 'Arrow 2 shows water vapour leaving the tree. This is transpiration.'], 'understanding', true, 'earth-water-question'),
  a.choice('B50-15', 'A mesh bag of leaves was left on a woodland floor for six months. Which conclusion fits the chart?', ['The leaves lost mass fastest between 4 and 6 months', 'Leaves in every wood decay at exactly this rate', 'In this bag, the mass of leaves went down over the six months', 'The leaves gained mass as they decayed'], 2, 'Only say what this one bag shows.', ['The mass fell from 40 g to 15 g; the smallest drop was between 4 and 6 months.', 'One bag in one wood cannot show what happens everywhere. In this bag, the mass of leaves went down over the six months.'], 'dataInterpretation', true, 'earth-leaf-data'),
  a.written('B50-16', 'Describe how carbon in the air can pass into a rabbit and then get back into the air.', 'Start with the plant the rabbit eats. Then give two ways the carbon can get back to the air.', 'A plant takes in carbon dioxide from the air for photosynthesis and makes glucose and other carbon compounds. The rabbit eats the plant, so the carbon compounds pass into the rabbit. The rabbit respires and releases carbon dioxide into the air. When the rabbit dies, or produces waste, microorganisms break it down and release carbon dioxide as they respire.', ['A plant takes in carbon dioxide for photosynthesis.', 'The plant makes glucose or other carbon compounds.', 'The rabbit eats the plant, so the carbon compounds pass to the rabbit.', 'The rabbit respires, releasing carbon dioxide.', 'Microorganisms break down the dead rabbit or its waste and release carbon dioxide by respiration.'], ['Saying plants take in carbon dioxide by respiration.', 'Saying the rabbit takes in carbon dioxide from the air to make its food.', 'Saying microorganisms release oxygen, or photosynthesise, when they decay things.']),
]

export const lesson50: ScienceLesson = {
  id: 'B-ECO-050-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'The water and carbon cycles', prerequisites: ['B-PHOTOSYNTHESIS', 'B-RESPIRATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
