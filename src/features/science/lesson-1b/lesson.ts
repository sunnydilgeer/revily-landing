// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route: build a bacterial cell part by part → sort cells by where their DNA is → compare all three cells.
// Screen ids continue the lesson-1 family (B1-); B1-22, B1-27 and B1-21 moved here from lesson 1. See STORYBOARD.md.
import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { bacteriaFrames as frames } from './teachingFrames'

const a = author('B-CELL-EUK-PRO', ['4.1.1.1', '4.1.1.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const bacteriaSections = [
  { id: 'B1-47', label: 'Start here', detail: 'Where animal and plant cells keep their DNA' },
  { id: 'B1-27', label: 'What is inside a bacterial cell?', detail: 'Wall, DNA loop and plasmids' },
  { id: 'B1-22', label: 'Is the DNA inside a nucleus?', detail: 'Eukaryotic and prokaryotic cells' },
  { id: 'B1-49', label: 'Compare all three cells', detail: 'Animal, plant and bacterial cells' },
  { id: 'B1-51', label: 'On your own', detail: 'Use what you know about three kinds of cell' },
]

const written = a.written('B1-21', 'Give two differences between the parts in a typical animal cell and a bacterial cell.',
  'Compare one part at a time: “An animal cell has…, but a bacterial cell…”. Give two comparisons about two different parts.',
  'A typical animal cell has a nucleus, but a bacterial cell does not. A typical animal cell has mitochondria, but a bacterial cell does not.',
  [
    'One valid paired difference, e.g. a nucleus is present in a typical animal cell but absent in a bacterium.',
    'A second, different paired difference, e.g. mitochondria present in an animal cell but absent in a bacterium, or a cell wall present in a bacterium but absent in an animal cell.',
  ],
  ['Bacteria have no DNA, or no ribosomes.', 'Animal cells have a cell wall.', 'All bacteria have plasmids.', 'Counting “no nucleus” and “DNA not enclosed in a nucleus” as two separate differences.'])

const states: ScienceState[] = [
  // Start here: back to animal and plant cells.
  { ...a.choice('B1-47', 'When you compared animal and plant cells, which part held the genetic material in both?', ['Cell wall', 'Nucleus', 'Cytoplasm'], 1,
    'Which part holds the instructions that control the cell?', ['In animal and plant cells, the genetic material is inside the nucleus.', 'So the nucleus holds it in both cells.'], 'recall'), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },

  // What is inside a bacterial cell?
  t('B1-27', 'Inside a bacterial cell'),
  a.choice('B1-28', 'Which sentence about a bacterium’s DNA is correct?', ['It has no DNA, because it has no nucleus.', 'Its DNA is inside a nucleus.', 'Its main DNA is a loop in the cytoplasm.'], 2,
    'Where did the DNA loop sit in the drawing?', ['A bacterium has no nucleus, but it still has DNA.', 'So its main DNA is a loop lying in the cytoplasm.']),
  a.choice('B1-34', 'What are plasmids?', ['Small extra rings of DNA, found in some bacteria', 'The nucleus of a bacterial cell', 'Rings of DNA that every bacterium has'], 0,
    'Are plasmids the main DNA? Do all bacteria have them?', ['Plasmids are small rings of DNA, separate from the main loop.', 'So they are extra DNA. Some bacteria have plasmids; others do not.'], 'recall'),
  a.choice('B1-48', 'Which part does a bacterial cell NOT have?', ['Ribosomes', 'Mitochondria', 'Cell wall'], 1,
    'Which part releases energy in animal and plant cells?', ['Bacteria have a wall, a membrane, cytoplasm and ribosomes.', 'So mitochondria are the missing part. Bacteria have no mitochondria.'], 'recall'),

  // Is the DNA inside a nucleus?
  t('B1-22', 'Two types of cell'),
  a.choice('B1-23', 'Animal cells and plant cells are both…', ['Prokaryotic', 'Eukaryotic', 'Cells without genetic material'], 1,
    'Where do they keep their DNA?', ['Animal and plant cells keep their DNA inside a nucleus.', 'So both are eukaryotic.']),
  a.choice('B1-36', 'A cell has no nucleus. Its DNA is a loop in the cytoplasm. Which type of cell is it?', ['Prokaryotic', 'Eukaryotic, because it has DNA', 'Neither, because cells without a nucleus have no DNA'], 0,
    'Is the DNA inside a nucleus?', ['The DNA is not inside a nucleus.', 'So the cell is prokaryotic, like a bacterium.']),

  // Compare all three cells
  t('B1-49', 'Compare all three cells'),
  a.choice('B1-37', 'Which sentence about cell walls is correct?', ['All cell walls are made of cellulose.', 'Animal cells and bacteria both have cell walls.', 'Plant cell walls are made of cellulose; bacterial cell walls are not.'], 2,
    'Which cells have a wall, and what is each one made of?', ['Plant cells and bacteria have walls, but only plant cell walls are made of cellulose.', 'So bacterial walls are not cellulose, and animal cells have no wall.']),
  a.choice('B1-50', 'Which is a real difference between an animal cell and a bacterial cell?', ['An animal cell has a nucleus, but a bacterial cell does not.', 'An animal cell has DNA, but a bacterial cell does not.', 'An animal cell has ribosomes, but a bacterial cell does not.', 'An animal cell has a cell wall, but a bacterial cell does not.'], 0,
    'Which parts did the bacterium share, and which did it not have?', ['Both cells have DNA and ribosomes. Only the bacterium has a wall.', 'So the real difference is the nucleus: an animal cell has one, but a bacterial cell does not.']),

  // On your own
  a.choice('B1-51', 'In pond water, a scientist finds a tiny cell. It has a cell wall, ribosomes and a loop of DNA, but no nucleus. What is it most likely to be?', ['A plant cell, because it has a cell wall', 'An animal cell', 'A bacterial cell'], 2,
    'Which part is missing, and which cells do not have it?', ['It has no nucleus, and its DNA is a loop.', 'So it is prokaryotic, most likely a bacterium. A wall alone does not make it a plant cell.'], 'application', true),
  a.choice('B1-52', 'A table lists the parts in three cells. Cell A: nucleus, no wall. Cell B: nucleus, wall, vacuole, no chloroplasts. Cell C: wall, DNA loop, no nucleus. In this data, which statement is best supported?',
    ['Cell B must be an animal cell, because it has no chloroplasts.', 'Cell C is eukaryotic, because it has DNA.', 'Cell A is a plant cell.', 'Cell B is probably a plant cell, even without chloroplasts.'], 3,
    'Which cells have a nucleus? Which have a wall?', ['Cell B has a nucleus, a wall and a vacuole, like a plant cell.', 'So it is probably a plant cell, such as a root cell. Missing chloroplasts do not make it an animal cell.'], 'dataInterpretation', true),
  a.choice('B1-53', 'Priya writes: “Bacteria have no nucleus, so they have no DNA.” What is wrong?', ['Nothing. The sentence is correct.', 'Bacteria do have DNA: a loop in the cytoplasm.', 'Bacteria do have a nucleus.', 'Only bacteria with plasmids have DNA.'], 1,
    'Where is a bacterium’s main DNA?', ['A bacterium has no nucleus, but its main DNA is a loop in the cytoplasm.', 'So Priya is wrong: no nucleus does not mean no DNA.'], 'understanding', true),
  { ...written, placeholder: 'An animal cell has…, but a bacterial cell…', instruction: 'Write two paired comparisons about two different parts. Your response is saved here for teacher review, not automatically marked.', exam: { marks: 2, ao: 'AO1', status: 'revilyDraft' } },
]

export const lesson1b: ScienceLesson = {
  id: 'B-CELL-001B-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Bacteria and comparing cells', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [
    { id: 'aqa-biology', title: 'AQA Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.1 Eukaryotes and prokaryotes; 4.1.1.2 Animal and plant cells' },
  ],
  misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
