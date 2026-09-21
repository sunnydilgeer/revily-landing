// Variant B: independent lesson copy; shared rendering and assessment engine.
import type { ScienceLesson, ScienceState } from '../../../types'
import { author, biologySource, sampledRequirements } from '../../../lessonAuthoring'
import { specialisationFrames as frames } from './teachingFrames'
const a = author('B-SPECIALISATION', ['4.1.1.3', '4.1.1.4'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])
export const specialisationSections = [
  { id: 'B4-01', label: 'Animal cells with jobs', detail: 'Sperm, nerve and muscle' },
  { id: 'B4-08', label: 'Plant cells with jobs', detail: 'Root hair, xylem and phloem' },
  { id: 'B4-14', label: 'Specialisation and differentiation', detail: 'Link structures to functions' },
  { id: 'B4-19', label: 'Apply it independently', detail: 'Fresh contexts and written reasoning' },
]
const states: ScienceState[] = [
  { ...a.choice('B4-01', 'A cell needs to swim through liquid. Which feature would help?', ['A long moving tail', 'A thick rigid outer wall', 'A large sugar store alone'], 0, 'Think about movement through liquid.', ['A moving tail pushes a cell through liquid.', 'An adaptation helps a cell do its job. Here, the tail helps it swim.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B4-02', 'Sperm cells'),
  a.choice('B4-03', 'Why do many mitochondria help a sperm cell swim?', ['They create energy from nothing', 'Respiration releases energy for tail movement', 'They carry electrical impulses'], 1, 'Recall the process in mitochondria.', ['Mitochondria are sites of aerobic respiration.', 'Aerobic respiration releases energy for the tail to move.']),
  t('B4-04', 'Nerve cells'),
  a.choice('B4-05', 'How does a long axon help a nerve cell?', ['It absorbs soil water', 'It transports sugar in sap', 'It carries impulses over a long distance'], 2, 'How far does the signal need to travel?', ['A long fibre spans a greater distance.', 'The axon carries electrical impulses over that distance.']),
  t('B4-06', 'Muscle cells'),
  a.choice('B4-07', 'Muscle contraction uses energy. Which adaptation supports this?', ['Many mitochondria for respiration', 'A tail to swim to an egg', 'No living contents'], 0, 'Which part releases energy for the cell to use?', ['Respiration releases energy.', 'Many mitochondria allow respiration to release energy for repeated muscle contraction.']),
  t('B4-08', 'Root hair cells'),
  a.choice('B4-09', 'Why is a root hair cell’s long extension useful?', ['It produces nerve impulses', 'It increases surface area for uptake', 'It makes the cell photosynthesise underground'], 1, 'Think about contact with soil solution.', ['The extension provides a large surface.', 'The larger membrane surface allows more water and mineral ions to enter from the soil.']),
  t('B4-10', 'Xylem cells'),
  a.choice('B4-11', 'Why do mature xylem tubes have no end walls?', ['They allow continuous water flow through a hollow tube', 'They make sugar in leaves', 'They cause muscle contraction'], 0, 'Imagine the route through joined vessel elements.', ['The hollow route is not blocked by end walls.', 'Water and mineral ions travel through xylem.']),
  t('B4-12', 'Phloem cells'),
  a.choice('B4-13', 'What is the function of pores in phloem end walls?', ['To carry electrical impulses', 'To stop all movement between cells', 'To allow cell sap containing sugars to pass'], 2, 'Link the pores to transport.', ['Pores connect neighbouring elongated cells.', 'Dissolved sugars can pass in cell sap.']),
  t('B4-14', 'Specialised cells'),
  a.worked('B4-15', 'Explain a root hair adaptation', 'A root hair cell has a long extension. Explain how it helps uptake.', ['Name the structure: a long extension.', 'Explain its effect: it increases surface area.', 'Link the job: more surface is available for uptake of water and mineral ions.'], 'root'),
  t('B4-16', 'Differentiation'),
  a.choice('B4-17', 'Which change is differentiation?', ['A cell only increases in size', 'A cell acquires structures suited to a particular job', 'A cell loses all genetic information'], 1, 'Look for a cell developing structures that help it carry out a particular job.', ['Growth alone is not differentiation.', 'Differentiation develops structures suited to a particular function, making the cell specialised.']),
  a.choice('B4-18', 'Which statement about differentiation is correct?', ['Plants never differentiate', 'All animal cells can become any type throughout life', 'Many plant cells can differentiate throughout life'], 2, 'Use “most” and “many” carefully.', ['Most types of animal cell differentiate early in development.', 'Many plant cells can still become specialised throughout the plant’s life.']),
  a.choice('B4-19', 'A sperm has a tail and many mitochondria. Which explanation links both adaptations to its job?', ['The tail propels it and respiration releases energy for swimming', 'Mitochondria create energy and the tail absorbs sugar', 'The tail carries impulses and mitochondria store genes'], 0, 'Connect each structure to movement.', ['Tail movement pushes the sperm through liquid.', 'Respiration releases the energy used in that movement.'], 'application', true),
  a.choice('B4-20', 'A plant tube has long, living cells with pores in their end walls. It carries dissolved sugars. Which tissue is it?', ['Xylem', 'Phloem', 'Muscle'], 1, 'Use both clues: living cells and dissolved sugars.', ['Living elongated cells with end-wall pores fit phloem.', 'Xylem has hollow tubes with walls strengthened by lignin and carries water and mineral ions.'], 'recall', true),
  a.choice('B4-21', 'A newly growing plant shoot keeps forming different cell types. Why is this possible?', ['No plant cells become specialised', 'Plant cells have no DNA', 'Many plant cells retain differentiation ability'], 2, 'Recall the plant/animal timing difference.', ['Many plant cells can differentiate through life.', 'They can become specialised cells in new growth.'], 'recall', true),
  a.choice('B4-22', 'A cell absorbs substances. Folds in its membrane increase surface area. How could this help?', ['Provide more surface for substances to enter', 'Guarantee that the cell can swim', 'Remove the need for a membrane'], 0, 'Apply the information; you do not need this cell’s name.', ['Folds give more membrane area.', 'That provides more surface for absorption.'], 'application', true),
  a.choice('B4-23', 'New cells replace worn-out lining cells in a mature animal. What is the main role of this division?', ['Making the adult grow indefinitely', 'Repair and replacement', 'Preventing all differentiation'], 1, 'Use the mature-animal context.', ['New cells maintain tissue by replacing old cells.', 'This is replacement, not unlimited adult growth.'], 'application', true),
  a.written('B4-24', 'A cell carries electrical signals. It has a long fibre and branched ends connecting to other cells. Explain how each feature helps.', 'Explain the long fibre first. Then explain the branches.', 'The long fibre carries electrical impulses over a long distance. Branched ends allow connections with other cells, helping signals pass between cells.', ['Long fibre allows impulses to travel over a long distance.', 'Branched ends allow connections with other cells.'], ['The cell transports sap.', 'Length alone without a communication link.']),
]
export const lesson4: ScienceLesson = { id: 'B-CELL-004-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology', title: 'Specialisation and differentiation', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview', sources: [biologySource], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states) }
