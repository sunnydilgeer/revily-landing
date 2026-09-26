import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { photosynthesisFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.4.1.1 Photosynthetic reaction: word equation, symbols, chloroplasts, endothermic; 4.4.1.3 Uses of glucose from photosynthesis' }
const a = author('B-PHOTOSYNTHESIS', ['4.4.1.1', '4.4.1.3'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const photosynthesisSections = [
  { id: 'B26-01', label: 'Start here', detail: 'What gets in through the stomata?' },
  { id: 'B26-02', label: 'Making glucose', detail: 'The word equation, and where the inputs come from' },
  { id: 'B26-05', label: 'Inside the leaf', detail: 'Chloroplasts, chlorophyll, energy and symbols' },
  { id: 'B26-08', label: 'Where the glucose goes', detail: 'Five uses, and why starch is stored' },
  { id: 'B26-11', label: 'On your own', detail: 'Dark, roots, storage and data' },
]

const states: ScienceState[] = [
  { ...a.choice('B26-01', 'Which gas gets into a leaf through the stomata for photosynthesis?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Water vapour'], 1, 'You met stomata in Lesson 18.', ['Oxygen and water vapour leave through the stomata.', 'Carbon dioxide gets in through them, for photosynthesis.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B26-02', 'Making glucose'),
  a.choice('B26-03', 'What are the products of photosynthesis?', ['Carbon dioxide and water', 'Oxygen and water', 'Glucose and oxygen', 'Glucose and carbon dioxide'], 2, 'The products are what is made, on the right of the arrow.', ['Carbon dioxide and water go in; they are the reactants.', 'Glucose and oxygen are made; they are the products.']),
  a.choice('B26-04', 'Look at the numbered arrows. Which one shows oxygen?', ['Arrow 1', 'Arrow 2', 'Arrow 3', 'Arrow 4'], 2, 'Oxygen is a product, and it is a gas.', ['Arrows 1 and 2 bring in carbon dioxide and water, and arrow 4 carries glucose to the rest of the plant.', 'Arrow 3 shows oxygen leaving the leaf into the air.'], 'understanding', false, 'photo-arrows-question'),
  t('B26-05', 'Inside the leaf'),
  a.choice('B26-06', 'Photosynthesis takes in energy from the environment. What is this type of reaction called?', ['Endothermic', 'Exothermic', 'Osmosis', 'Respiration'], 0, 'Think about which way the energy moves.', ['Energy is transferred from the environment into the chloroplasts.', 'A reaction that takes in energy like this is endothermic.']),
  a.choice('B26-07', 'Which is the chemical symbol for glucose?', ['CO₂', 'H₂O', 'O₂', 'C₆H₁₂O₆'], 3, 'Glucose is the largest molecule of the four.', ['CO₂ is carbon dioxide, H₂O is water and O₂ is oxygen.', 'Glucose is C₆H₁₂O₆.']),
  t('B26-08', 'Where the glucose goes'),
  a.choice('B26-09', 'Look at the numbered parts. Where does the sunflower store most of its oil?', ['Part 1', 'Part 2', 'Part 3', 'Part 4'], 3, 'Think about where sunflower oil for cooking comes from.', ['Parts 1, 2 and 3 are the roots, stem and a leaf, which store starch.', 'Part 4 is the seeds, where the sunflower stores oil.'], 'understanding', false, 'photo-parts-question'),
  a.choice('B26-10', 'What must the roots absorb from the soil so the sunflower can turn glucose into amino acids?', ['Nitrate ions', 'Starch', 'Oxygen', 'Cellulose'], 0, 'Glucose is combined with something from the soil.', ['Amino acids need more than glucose.', 'Glucose is combined with nitrate ions, absorbed from the soil, to make amino acids.']),
  a.choice('B26-11', 'A sunflower is kept in the dark for two days. What does it use to keep living?', ['Glucose it makes by photosynthesis in the dark', 'Starch it stored in its leaves, stems and roots', 'Chlorophyll from its leaves'], 1, 'Can photosynthesis happen without light?', ['Photosynthesis needs light, so no new glucose is made in the dark.', 'The sunflower uses the starch it stored earlier.'], 'application', true),
  a.choice('B26-12', 'Cells in a sunflower’s roots have no chloroplasts. Why can these cells not photosynthesise?', ['They have no chlorophyll to absorb light', 'They have no cell walls', 'They take in too much water'], 0, 'What does a chloroplast contain?', ['Photosynthesis happens in chloroplasts, where chlorophyll absorbs light.', 'Root cells have no chloroplasts, so they have no chlorophyll to absorb light.'], 'application', true),
  a.choice('B26-13', 'Why do plants store glucose as starch?', ['Starch dissolves easily in water', 'Starch is insoluble, so it does not draw water into cells by osmosis', 'Starch is a gas that can leave the plant'], 1, 'Think about what glucose does when it dissolves in a cell.', ['Lots of dissolved glucose would draw water into a cell by osmosis, and the cell would swell.', 'Starch is insoluble, so it does not draw water into cells by osmosis.'], 'understanding', true),
  a.choice('B26-14', 'The graph shows the starch in one leaf over a day. Which conclusion fits it?', ['The leaf made most of its starch at night', 'The amount of starch stayed the same all day', 'Starch built up in the light and was used up in the dark', 'All plants store starch only in their leaves'], 2, 'Compare the line during the day with the line at night.', ['The starch rose while it was light and fell at night; one leaf cannot show what all plants do.', 'Starch built up in the light and was used up in the dark.'], 'dataInterpretation', true, 'photo-starch-data'),
  a.written('B26-15', 'Describe how a sunflower makes glucose, and give two ways it uses the glucose.', 'Say what goes in, where it happens and what comes out, then give two uses.', 'The sunflower takes in carbon dioxide from the air and water from the soil. In the chloroplasts, chlorophyll absorbs light, and the energy is used to turn them into glucose and oxygen. The sunflower uses some glucose for respiration, and it turns some into starch, which it stores for the night.', ['Carbon dioxide and water are the reactants.', 'Chlorophyll in chloroplasts absorbs light energy.', 'Glucose and oxygen are made.', 'One correct use of glucose, such as respiration or cellulose for cell walls.', 'A second correct use, such as starch or oil stored, or amino acids for proteins.'], ['Saying the plant takes in oxygen and gives out carbon dioxide for photosynthesis.', 'Saying light is a reactant, or that photosynthesis gives out energy.', 'Saying glucose is stored as glucose.', 'Saying amino acids are made from glucose alone, without nitrate.']),
]

export const lesson26: ScienceLesson = {
  id: 'B-BIO-026-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Photosynthesis and what plants do with glucose', prerequisites: ['B-PLANT-TISSUE'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
