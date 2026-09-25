import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { plantMalariaFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.3.1.2 Viral diseases (tobacco mosaic virus); 4.3.1.4 Fungal diseases (rose black spot); 4.3.1.5 Protist diseases (malaria)' }
const a = author('B-PLANT-PROTIST-DISEASES', ['4.3.1.2', '4.3.1.4', '4.3.1.5'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const plantMalariaSections = [
  { id: 'B21-01', label: 'Start here', detail: 'What leaves use light for' },
  { id: 'B21-02', label: 'A patchy tomato plant', detail: 'TMV and the photosynthesis chain' },
  { id: 'B21-05', label: 'Spotted roses', detail: 'Rose black spot and fungicides' },
  { id: 'B21-08', label: 'Malaria and the mosquito', detail: 'A protist carried by a vector' },
  { id: 'B21-11', label: 'All seven diseases', detail: 'Sorted by pathogen' },
  { id: 'B21-13', label: 'On your own', detail: 'Nets, data and explanations' },
]

const states: ScienceState[] = [
  { ...a.choice('B21-01', 'Leaves use light to make the plant’s food. What is this process called?', ['Respiration', 'Photosynthesis', 'Transpiration'], 1, 'You met the leaf’s main job in Lesson 17.', ['Transpiration is water loss from leaves, and respiration releases energy.', 'Making food using light is photosynthesis.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B21-02', 'A patchy tomato plant'),
  a.choice('B21-03', 'Why does a tomato plant with TMV grow poorly?', ['The virus eats the plant’s roots', 'Its leaves have less chlorophyll, so less photosynthesis happens', 'It loses too much water through its leaves'], 1, 'Follow the chain from pale leaves to growth.', ['TMV makes pale patches with less chlorophyll, so less light is absorbed.', 'Less photosynthesis means less food for growth.']),
  a.choice('B21-04', 'Look at the chain. What belongs in the empty step 3?', ['More chlorophyll', 'Faster transpiration', 'Less photosynthesis', 'More food is made'], 2, 'What does the plant use chlorophyll for?', ['Less chlorophyll means less light is absorbed.', 'So less photosynthesis happens, and less food is made.'], 'understanding', false, 'plantdisease-chain-question'),
  t('B21-05', 'Spotted roses'),
  a.choice('B21-06', 'Why must a gardener destroy spotted rose leaves, not leave them on the ground?', ['So the fungus cannot spread to other roses', 'So new leaves grow faster', 'So the leaves make more chlorophyll'], 0, 'What is still living on the fallen leaves?', ['The removed leaves still carry the fungus.', 'Water or wind could carry it from them to other plants.']),
  a.choice('B21-07', 'Which pair of actions would help control rose black spot?', ['Mosquito nets and insecticide', 'Vaccination and isolation', 'Fungicide spray and destroying spotted leaves', 'Antiretroviral drugs and condoms'], 2, 'Rose black spot is caused by a fungus.', ['Fungicides kill the fungus on the plant.', 'Destroying spotted leaves removes fungus that could spread.']),
  t('B21-08', 'Malaria and the mosquito'),
  a.choice('B21-09', 'Which numbered stage shows the mosquito passing the protist to a new person?', ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4'], 3, 'Look for a bite on someone who is not ill yet.', ['Stage 2 shows the mosquito picking the protist up from an infected person.', 'Stage 4 shows it biting someone new and passing the protist on.'], 'understanding', false, 'malaria-cycle-question'),
  a.choice('B21-10', 'Why is a mosquito called a vector for malaria?', ['It causes malaria by itself', 'It carries the protist from person to person', 'It makes toxins in the blood'], 1, 'What does the word “vector” mean?', ['The protist causes malaria, not the mosquito.', 'The mosquito carries the protist between people, so it is a vector.']),
  t('B21-11', 'All seven diseases'),
  a.choice('B21-12', 'Look at the grid. Which kind of pathogen belongs at the top of column 4?', ['Bacteria', 'Viruses', 'Fungi', 'Protists'], 3, 'Column 4 holds only malaria.', ['Malaria is the only disease in column 4.', 'Malaria is caused by a protist.'], 'understanding', false, 'disease-grid7-question'),
  a.choice('B21-13', 'A charity gives mosquito nets to families. How do the nets reduce malaria?', ['They kill the protist in people’s blood', 'They stop mosquitoes breeding', 'They stop mosquitoes biting, so the protist is not passed on'], 2, 'What does a net do while someone sleeps?', ['Mosquitoes pass the protist on when they bite.', 'A net stops the bite, so the protist is not passed on.'], 'application', true),
  a.choice('B21-14', 'Look at the results. Which conclusion fits them?', ['In this garden, sprayed bushes had fewer spotted leaves', 'Fungicide makes roses grow taller', 'Fungicide cures rose black spot everywhere'], 0, 'Only compare what was measured.', ['The sprayed bushes had 4 spotted leaves and the unsprayed bushes had 31.', 'The results only cover spotted leaves in one garden.'], 'dataInterpretation', true, 'plantdisease-fungicide-data'),
  a.choice('B21-15', 'Which two diseases both reduce photosynthesis in plants?', ['Measles and malaria', 'Salmonella and TMV', 'TMV and rose black spot'], 2, 'Which diseases affect plants?', ['TMV makes leaves pale, and rose black spot makes leaves fall.', 'Both mean less photosynthesis.'], 'understanding', true),
  a.written('B21-16', 'Compare how malaria and rose black spot spread. Give one way to reduce the spread of each.', 'Take one disease at a time. What carries the pathogen, and what would block that route?', 'Malaria is spread by mosquitoes. They pick up the protist in one bite and pass it on in the next. Mosquito nets, or stopping mosquitoes breeding, reduce its spread. Rose black spot is spread by water or wind. Spraying fungicide, or removing and destroying spotted leaves, reduces its spread.', ['Malaria is carried by mosquitoes, which are vectors.', 'Malaria: mosquito nets or stopping mosquitoes breeding.', 'Rose black spot is spread by water or wind.', 'Rose black spot: fungicide or destroying spotted leaves.'], ['The mosquito is said to cause malaria.', 'Rose black spot is said to spread by insects.', 'Antibiotics or vaccination are suggested.']),
]

export const lesson21: ScienceLesson = {
  id: 'B-INF-021-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Plant diseases and malaria', prerequisites: ['B-HUMAN-DISEASES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
