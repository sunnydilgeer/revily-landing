import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { fossilFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.6.3.2 Fossils: how they form and why the record is incomplete; 4.6.4 Classification: kingdoms, binomial names, three domains and evolutionary trees' }
const a = author('B-FOSSILS-CLASSIFICATION', ['4.6.3.2', '4.6.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const fossilSections = [
  { id: 'B45-01', label: 'Start here', detail: 'What is a fossil?' },
  { id: 'B45-02', label: 'How do fossils form?', detail: 'Minerals, casts and no decay' },
  { id: 'B45-06', label: 'Sorting living things', detail: 'Kingdoms, seven levels and two-part names' },
  { id: 'B45-09', label: 'Three domains', detail: 'New evidence changes the groups' },
  { id: 'B45-11', label: 'Evolutionary trees', detail: 'Common ancestors' },
  { id: 'B45-13', label: 'On your own', detail: 'A footprint, a tree, three big cats and a hot spring' },
]

const states: ScienceState[] = [
  { ...a.choice('B45-01', 'In the evolution lesson, fossils were evidence for evolution. What is a fossil?', ['A kind of crystal that forms in rock', 'The remains of an organism from millions of years ago, found in rock', 'A living organism that has never changed', 'Any old bone kept in a museum'], 1, 'Fossils tell us about life long ago.', ['A crystal is not the remains of a living thing, and a museum bone need not be a fossil.', 'A fossil is the remains of an organism from millions of years ago, found in rock.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B45-02', 'How do fossils form?'),
  a.choice('B45-03', 'How do most fossils form?', ['Soft body parts turn to stone straight away', 'The whole organism freezes in ice', 'Minerals slowly replace hard parts, such as bones and shells'], 2, 'Which parts of an organism do not decay easily?', ['Soft parts decay quickly, and few organisms are frozen.', 'Most fossils form as minerals slowly replace hard parts, such as bones and shells.']),
  a.choice('B45-04', 'An insect was trapped in amber millions of years ago. Why has it not decayed?', ['Insects never decay', 'Conditions stopped decay microorganisms from working', 'Amber turns insects into minerals', 'The insect was still alive'], 1, 'What do decay microorganisms need?', ['Insects do decay in normal conditions.', 'Inside amber, decay microorganisms could not work, so the insect was kept whole.']),
  a.choice('B45-05', 'Why can scientists not be sure how life on Earth began?', ['Nobody has looked for fossils', 'All fossils are the same age', 'Fossils can only form in amber', 'Early organisms had soft bodies and left few fossils'], 3, 'What happens to soft bodies after death?', ['Scientists have searched for fossils of many ages.', 'Early organisms were soft-bodied and decayed, so there is little valid evidence of how life began.']),
  t('B45-06', 'Sorting living things'),
  a.choice('B45-07', 'Which of these is one of the five kingdoms?', ['Fungi', 'Genus', 'Mammals', 'Archaea'], 0, 'The kingdoms are the biggest groups: animals, plants and three more.', ['Genus is a level, mammals is a smaller group of animals and Archaea is a domain.', 'Fungi is one of the five kingdoms.']),
  a.choice('B45-08', 'In the name Homo sapiens, what does the word Homo tell you?', ['The kingdom', 'The species', 'The genus', 'The family'], 2, 'Which comes first in a two-part name?', ['In the binomial system, the first word names one group and the second names the other.', 'The first word, Homo, is the genus.']),
  t('B45-09', 'Three domains'),
  a.choice('B45-10', 'Carl Woese sorted living things into three domains. Which list is correct?', ['Plants, animals and fungi', 'Kingdom, genus and species', 'Archaea, Bacteria and Eukaryota'], 2, 'One domain is true bacteria.', ['Plants, animals and fungi are kingdoms, and genus and species are levels.', 'The three domains are Archaea, Bacteria and Eukaryota.']),
  t('B45-11', 'Evolutionary trees'),
  a.choice('B45-12', 'Two species share a very recent common ancestor. What does this tell you?', ['They are closely related', 'They are the same species', 'They are distantly related', 'One is the ancestor of the other'], 0, 'Think about how recently their branches split.', ['Sharing a common ancestor does not make them one species, or one the parent of the other.', 'A recent common ancestor means they are closely related.']),
  a.choice('B45-13', 'A dinosaur stepped in soft mud, which slowly hardened into rock. What kind of fossil is the footprint?', ['Minerals replacing bones', 'An impression', 'Remains kept in amber'], 1, 'Is anything from the dinosaur’s body left in the rock?', ['No bone or body was kept; only its shape was pressed into the mud.', 'A shape left in soft material that hardens is an impression.'], 'application', true),
  a.choice('B45-14', 'Look at the evolutionary tree of four numbered animals. Which animal is most closely related to animal 4?', ['Animal 1', 'Animal 2', 'Animal 3'], 2, 'Find the most recent split below animal 4.', ['Animals 1 and 2 share older common ancestors with animal 4.', 'Animal 3 shares the most recent common ancestor with animal 4.'], 'understanding', true, 'evolve-tree-question'),
  a.choice('B45-15', 'The table shows how three big cats are classified. Which two are most closely related?', ['Lion and house cat', 'Tiger and house cat', 'Lion and tiger', 'All three are equally related'], 2, 'Compare the genus of each animal.', ['All three are in the same family, but only two share a genus.', 'The lion and tiger are both in the genus Panthera, so they are most closely related.'], 'dataInterpretation', true, 'evolve-class-question'),
  a.choice('B45-16', 'A single-celled organism with no nucleus lives in a hot spring. Tests show it is not a true bacterium. Which domain?', ['Eukaryota', 'Archaea', 'Bacteria', 'Fungi'], 1, 'Where were these organisms first found?', ['It has no nucleus, so it is not a eukaryote; fungi is a kingdom, and it is not a true bacterium.', 'Archaea are prokaryotes first found in extreme places such as hot springs.'], 'application', true),
  a.written('B45-17', 'Describe how most fossils form. Then give two reasons why the fossil record is incomplete.', 'Start with the hard parts, then say what replaces them. Finish with two reasons for the gaps.', 'Most fossils form from hard parts, such as bones, shells and teeth, which do not decay easily. As they very slowly decay, minerals replace them, leaving a rock copy of the part. The fossil record is incomplete because many early organisms had soft bodies, which decayed and left no fossils. Also, many fossils have been destroyed by movements of the Earth.', ['Hard parts, such as bones, shells or teeth, do not decay easily.', 'As they slowly decay, they are replaced by minerals.', 'This forms a rock copy of the part.', 'Many early organisms were soft-bodied, so they decayed and left few fossils.', 'Many fossils have been destroyed by geological activity, such as movements of the Earth.'], ['Saying the organism turns to stone straight away.', 'Saying fossils are living organisms.', 'Saying the record is incomplete because scientists have not looked.', 'Describing how rocks form instead of fossils.']),
]

export const lesson45: ScienceLesson = {
  id: 'B-GEN-045-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Fossils and classification', prerequisites: ['B-EVOLUTION'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
