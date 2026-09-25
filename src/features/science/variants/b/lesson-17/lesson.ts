import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { plantTissueFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.3.1 Plant tissues; 4.2.3.2 Plant organ system (organisation of roots, stem and leaves)' }
const a = author('B-PLANT-TISSUE', ['4.2.3.1', '4.2.3.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const plantTissueSections = [
  { id: 'B17-01', label: 'Start here', detail: 'Organs are made of tissues' },
  { id: 'B17-02', label: 'The whole plant', detail: 'Organs and an organ system' },
  { id: 'B17-04', label: 'Where a plant grows', detail: 'Meristem at the tips' },
  { id: 'B17-06', label: 'Inside a leaf', detail: 'Layers of tissue and their jobs' },
  { id: 'B17-11', label: 'Back to the whole plant', detail: 'Xylem and phloem in the veins' },
  { id: 'B17-14', label: 'On your own', detail: 'Use what you know about leaves' },
]

const states: ScienceState[] = [
  { ...a.choice('B17-01', 'Your stomach is an organ. What is it made of?', ['Organ systems', 'Tissues, which are made of cells', 'One very large cell'], 1, 'Think back to how your body is organised: cells, then tissues, then organs.', ['Similar cells group together to make a tissue.', 'Different tissues work together to make an organ, such as the stomach.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B17-02', 'Plants are built the same way'),
  a.choice('B17-03', 'Which of these is a plant organ?', ['A chloroplast', 'A single leaf cell', 'A leaf'], 2, 'An organ is made of several tissues working together.', ['A chloroplast is a part inside a cell.', 'A single cell is too small to be an organ.', 'A leaf contains several tissues, so it is an organ.']),
  t('B17-04', 'Where does a plant grow?'),
  a.choice('B17-05', 'A root gets longer. Where are the new cells made?', ['In meristem tissue at the root tip', 'In the leaves, then carried down', 'Evenly all along the root'], 0, 'Plants grow at their tips.', ['Meristem tissue is found at the tips of shoots and roots.', 'Its cells divide to make new cells, so the root grows longer at the tip.']),
  t('B17-06', 'Inside a leaf'),
  a.choice('B17-07', 'Why is the top layer of a leaf see-through?', ['Most food is made in the top layer', 'It lets light reach the cells below', 'It stops gases getting in'], 1, 'Which cells need light, and where are they?', ['The upper epidermis is a thin, clear skin.', 'Light passes through it to the palisade cells below, which use light to make food.']),
  a.choice('B17-08', 'Why are palisade cells near the top of the leaf?', ['So they are close to the roots', 'So they can store water', 'To get the most light for photosynthesis', 'So gases can reach them more easily'], 2, 'Where does light enter the leaf?', ['Light enters through the top of the leaf.', 'Palisade cells are full of chloroplasts, so being near the top gives them the most light for photosynthesis.']),
  a.choice('B17-09', 'What are the air gaps in the spongy layer for?', ['They let gases reach the cells', 'They carry water up from the roots', 'They make the leaf see-through'], 0, 'Think about what enters through the stomata.', ['Carbon dioxide enters through the stomata.', 'It spreads through the air gaps to reach the cells that make food.']),
  a.choice('B17-10', 'Layer 2 has tall cells packed with chloroplasts. What is it called?', ['Upper epidermis', 'Spongy mesophyll', 'Lower epidermis', 'Palisade mesophyll'], 3, 'Tall, tightly packed cells full of chloroplasts.', ['Layer 2 is just below the clear top layer.', 'Its tall cells are packed with chloroplasts, so it is the palisade mesophyll.'], 'understanding', false, 'plant-leaf-question'),
  t('B17-11', 'Veins link the leaf to the plant'),
  a.choice('B17-12', 'Which tissue brings water into the leaf?', ['Phloem', 'Xylem', 'Epidermis'], 1, 'Water travels up from the roots.', ['Xylem carries water and mineral ions up from the roots.', 'The xylem in the veins brings this water into the leaf.']),
  a.choice('B17-13', 'Which tissue carries sugar out of the leaf?', ['Phloem', 'Xylem', 'Palisade mesophyll'], 0, 'Food made in the leaf has to reach other parts of the plant.', ['The leaf makes sugar by photosynthesis.', 'Phloem carries this sugar to the rest of the plant.']),
  a.choice('B17-14', 'A student draws this leaf. What is wrong with it?', ['The spongy layer should have no air gaps', 'The leaf should have no stomata', 'The top layer should be green and full of chloroplasts', 'The palisade layer should be near the top, to get the most light'], 3, 'Compare the layers with the leaf you studied.', ['Palisade cells make most of the leaf’s food, so they need the most light.', 'Light enters through the top, so the palisade layer belongs near the top of the leaf.'], 'application', true, 'plant-leaf-drawing'),
  a.choice('B17-15', 'Which two features help carbon dioxide reach the cells inside a leaf?', ['Stomata and air gaps', 'Xylem and phloem', 'Meristem and epidermis'], 0, 'How does a gas get in, and how does it move once inside?', ['Carbon dioxide enters through the stomata.', 'It then spreads through the air gaps in the spongy layer to reach the cells.'], 'understanding', true),
  a.written('B17-16', 'Explain how two layers of the leaf help it make food.', 'Pick two layers. For each one, say what it is like and how that helps photosynthesis.', 'Palisade cells are packed with chloroplasts and sit near the top, so they get the most light. The spongy layer has air gaps, so carbon dioxide can reach the cells. The clear upper epidermis lets light through. Stomata let carbon dioxide in.', ['Palisade cells have many chloroplasts and are near the top, so they get the most light.', 'Air gaps in the spongy layer let carbon dioxide reach the cells.', 'The upper epidermis is clear, so light can pass through.', 'Stomata let carbon dioxide into the leaf.'], ['Photosynthesis is said to happen mainly in the epidermis.', 'Xylem is said to carry sugar.', 'Stomata are described as letting light in.']),
]

export const lesson17: ScienceLesson = {
  id: 'B-ORG-017-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Plant tissues and the leaf', prerequisites: ['B-ORGANISATION', 'B-SPECIALISATION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
