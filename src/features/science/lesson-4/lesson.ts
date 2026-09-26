import type { ScienceLesson, ScienceState } from '../types'
import { author, biologySource, sampledRequirements } from '../lessonAuthoring'
import { specialisationFrames as frames } from './teachingFrames'

const a = author('B-SPECIALISATION', ['4.1.1.3', '4.1.1.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const specialisationSections = [
  { id: 'B4-01', label: 'Start here', detail: 'Energy in cells' },
  { id: 'B4-02', label: 'Why do cells look different?', detail: 'Shape fits the job' },
  { id: 'B4-04', label: 'Meet an animal team', detail: 'Sperm, nerve and muscle cells' },
  { id: 'B4-08', label: 'Meet a plant team', detail: 'Root hair, xylem and phloem cells' },
  { id: 'B4-12', label: 'How does a cell get its job?', detail: 'Differentiation' },
  { id: 'B4-15', label: 'On your own', detail: 'Use shape and job on new examples' },
]

const states: ScienceState[] = [
  { ...a.choice('B4-01', 'When you learned about animal and plant cells, you met their parts. Which part releases energy by aerobic respiration?', ['The nucleus', 'The mitochondria', 'The cell wall'], 1, 'Which part is the site of aerobic respiration?', ['Aerobic respiration happens in the mitochondria.', 'So the mitochondria release energy for the cell’s work.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B4-02', 'Why do cells look different?'),
  a.choice('B4-03', 'What is a specialised cell?', ['A cell with a shape and parts suited to one job', 'Any cell that is very large', 'A cell that can do every job in the body'], 0, 'What do its shape and parts help it do?', ['A specialised cell has a shape and parts that fit one job.', 'So size alone does not make a cell specialised.']),
  t('B4-04', 'Meet an animal team'),
  a.choice('B4-05', 'Why does a sperm cell have many mitochondria?', ['They carry the genetic information to the egg', 'Aerobic respiration in them releases energy for swimming', 'They make the tail longer'], 1, 'What does swimming need?', ['Mitochondria release energy by aerobic respiration.', 'So the tail has the energy it needs to swim to the egg.']),
  a.choice('B4-06', 'How does a long axon help a nerve cell do its job?', ['Impulses can travel a long way along it', 'It stores energy for contracting', 'It pushes the cell through liquid'], 0, 'How far do the impulses need to go?', ['The axon is a very long, thin fibre.', 'So impulses can be carried a long way, such as from your spine to your toes.']),
  a.choice('B4-07', 'Muscle cells and sperm cells both have many mitochondria. Why?', ['Both cells carry impulses', 'Both cells take in water', 'Both jobs need lots of energy for movement'], 2, 'What do contracting and swimming both need?', ['Contracting and swimming both need a lot of energy.', 'So both cells have many mitochondria to release that energy by aerobic respiration.']),
  t('B4-08', 'Meet a plant team'),
  a.choice('B4-09', 'Why is the long hair on a root hair cell useful?', ['It gives more surface area, so more water can enter', 'It lets the cell photosynthesise underground', 'It carries water up to the leaves'], 0, 'What does the long hair give the cell more of?', ['The long hair gives the cell more surface area touching the soil.', 'So more water and mineral ions can enter. Xylem, not the root hair, carries water up.']),
  a.choice('B4-10', 'Why do xylem cells have no end walls?', ['So sugar can pass through pores', 'So the cells can contract', 'So water can flow straight through a hollow tube'], 2, 'What would end walls do to the flow of water?', ['Xylem cells have no contents and no end walls.', 'So they form a hollow tube, and water and mineral ions flow straight up.']),
  a.choice('B4-11', 'Which cells carry sugar from the leaves to the roots?', ['Xylem cells', 'Phloem cells', 'Root hair cells'], 1, 'Which cells have pores in their end walls?', ['Phloem cells are living cells with pores in their end walls.', 'So dissolved sugar passes through them. Xylem carries water and mineral ions.']),
  t('B4-12', 'How does a cell get its job?'),
  a.choice('B4-13', 'Which change is differentiation?', ['A cell just grows bigger', 'A cell moves to a new part of the body', 'A cell gains the shape and parts it needs for one job'], 2, 'What does a cell gain when it becomes specialised?', ['Differentiation is when a cell gains the shape and parts for one job.', 'So just growing bigger is not differentiation.']),
  a.choice('B4-14', 'Which statement is correct?', ['Many plant cells can differentiate throughout the plant’s life', 'Plant cells can never differentiate', 'All animal cells keep differentiating throughout life'], 0, 'Which kind of organism keeps making new cell types as it grows?', ['Most types of animal cell differentiate early in development.', 'So it is plants where many cells can still differentiate throughout life.']),
  a.choice('B4-15', 'Cells lining the small intestine take in digested food. Their outer surface has many tiny folds. How do the folds help?', ['They let the cells swim to the food', 'They carry impulses to the brain', 'They give more surface area, so more food can be taken in', 'They make the cells contract'], 2, 'You met a cell with a long hair that did a similar job. What did the hair give it?', ['The folds give the cell more surface area.', 'So more digested food can be taken in, like water entering a root hair cell.'], 'application', true),
  a.choice('B4-16', 'A student counts the mitochondria in drawings of three cells. Cell A: 20. Cell B: 300. Cell C: 15. These are simple drawings, not real images of cells. Which conclusion fits?', ['Cell B must be a sperm cell', 'Cells A and C release no energy', 'Cell B is a muscle cell in every animal', 'In this test, cell B has the most mitochondria, so it may need the most energy'], 3, 'Only say what these three numbers show.', ['Cell B has far more mitochondria than cells A and C.', 'So in this test, cell B may need more energy. The numbers alone cannot tell you which cell it is.'], 'dataInterpretation', true),
  a.choice('B4-17', 'The diagram shows a tube in a plant stem, with its labels hidden. It is hollow, with no end walls, and has thick rings in its walls. What does it carry?', ['Dissolved sugar, from the leaves', 'Water and mineral ions, up from the roots', 'Electrical impulses', 'Nothing; it only holds the plant up'], 1, 'Hollow, no end walls, strong walls: which cells are these?', ['A hollow tube with no end walls and strengthened walls is xylem.', 'So it carries water and mineral ions up from the roots, and also helps support the plant.'], 'understanding', true, 'xylem'),
  a.written('B4-18', 'A plant grows new roots. Explain how an unspecialised cell becomes a root hair cell, and how the root hair cell is suited to its job.', 'First explain differentiation. Then name the root hair’s feature, say what it does, and link it to the job.', 'An unspecialised cell gains the shape and parts it needs for one job. This is called differentiation. Many plant cells can differentiate throughout the plant’s life, so new root hair cells can form as the roots grow. The root hair cell has a long, hair-like part, which gives it more surface area. So more water and mineral ions can enter from the soil.', ['An unspecialised cell gains the shape and parts for one job; this is differentiation.', 'Many plant cells can differentiate throughout the plant’s life, so new root hair cells can form.', 'The long, hair-like part gives the cell more surface area.', 'So more water and mineral ions can enter from the soil.'], ['Differentiation is said to be the cell just growing bigger.', 'Plant cells are said to differentiate only early in life.', 'The root hair is said to photosynthesise or to carry water up the plant.', 'The hair is said to be a separate cell.']),
]

export const lesson4: ScienceLesson = {
  id: 'B-CELL-004-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Specialisation and differentiation', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [biologySource], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
