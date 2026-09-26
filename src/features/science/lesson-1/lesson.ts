// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route: build an animal cell part by part → add only what is new in a plant cell → compare the two.
// Bacteria, eukaryotic/prokaryotic and the three-way comparison are in lesson-1b. See STORYBOARD.md.
import type { ChoiceOption, ChoiceState, EvidenceDimension, Phase, ScienceLesson, ScienceState, TeachingState, VisualBrief, WrittenState } from '../types'
import { sampledRequirements } from '../lessonAuthoring'
import { teachingFrames } from './teachingFrames'

const specRefs = ['4.1.1.2']
const sourceIds = ['aqa-biology']
const skillId = 'B-CELL-PARTS-FUNCTIONS'
const model = (highlight?: string, alternate = false): VisualBrief => ({
  id: alternate ? 'animal-cell-b' : 'animal-cell-a', kind: 'cellModel', highlight,
  brief: `${alternate ? 'Use a differently oriented, elongated' : 'Use an irregular rounded'} animal-cell schematic. Membrane is one outer boundary; cytoplasm is the interior excluding the nucleus. Show a nucleus, several mitochondria and tiny ribosome dots. No cell wall, chloroplasts or scale claim. Caption: simplified model, not to scale; colours are a key, not real cell colours.`,
  accessibleDescription: 'Simplified animal-cell model with an outer membrane, cytoplasm, a nucleus, mitochondria and ribosomes; not to scale.',
  assessmentDescription: 'Simplified animal-cell model; not to scale. Labels are hidden. A pointer ends on one part; colour is not needed.',
})

function teach(id: string, title: string): TeachingState {
  const script = teachingFrames[id].map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ')
  return { id, kind: 'teaching', phase: 'teach', skillId, specRefs, sourceIds, title, body: script,
    media: { kind: 'videoScript', seconds: teachingFrames[id].length * 12, status: 'notRecorded', script } }
}
type Choice = { id: string; title: string; options: ChoiceOption[]; answerId: string; hint: string; steps: string[]; dimension?: EvidenceDimension; phase?: Phase; visual?: VisualBrief }
// Practice questions check the walkthrough just taught; independent ones belong only in "On your own".
function q({ id, title, options, answerId, hint, steps, dimension = 'understanding', phase = 'guided', visual }: Choice, independent = false): ChoiceState {
  const answer = options.find(option => option.id === answerId)!.label
  return { kind: 'choice', id, title, skillId, specRefs, sourceIds, phase: independent ? 'independent' : phase,
    contextId: `cells-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : phase === 'priorKnowledge' ? 'diagnostic' : 'practice',
    options, answerId, hint, explanation: { steps, answer }, ...(visual ? { visual } : {}),
    ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : dimension === 'dataInterpretation' ? 'AO3' : 'AO2', status: 'revilyDraft' } as const } : {}) }
}
const o = (id: string, label: string, misconceptionSignal?: string): ChoiceOption => ({ id, label, ...(misconceptionSignal ? { misconceptionSignal } : {}) })
const parts = [o('nucleus', 'Nucleus'), o('cytoplasm', 'Cytoplasm'), o('membrane', 'Cell membrane'), o('mitochondria', 'Mitochondria'), o('ribosomes', 'Ribosomes')]

export const cellsSections = [
  { id: 'B1-01', label: 'Start here', detail: 'What are living things built from?' },
  { id: 'B1-02', label: 'What is inside an animal cell?', detail: 'Membrane, cytoplasm and nucleus' },
  { id: 'B1-05', label: 'How does a cell get energy and proteins?', detail: 'Mitochondria and ribosomes' },
  { id: 'B1-42', label: 'What is new in a plant cell?', detail: 'Cell wall, vacuole and chloroplasts' },
  { id: 'B1-41', label: 'How are animal and plant cells different?', detail: 'Compare one part at a time' },
  { id: 'B1-20', label: 'On your own', detail: 'Use what you know about cells' },
]

const written: WrittenState = {
  id: 'B1-46', kind: 'written', phase: 'transfer', skillId, specRefs, sourceIds,
  title: 'Give two differences between a leaf cell and an animal cell. For each one, say what the plant part does.',
  contextId: 'cells-leaf-animal-comparison', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly',
  hint: 'Use paired comparisons: “A leaf cell has…, but an animal cell does not.” Then say what that part does. Do this twice.',
  placeholder: 'A leaf cell has…, but an animal cell does not. This part…',
  instruction: 'Write two paired comparisons, each with the job of the plant part. Your response is saved here for teacher review, not automatically marked.',
  explanation: {
    steps: [
      'A paired difference: a leaf cell has a cell wall, permanent vacuole or chloroplasts, but an animal cell does not.',
      'The job of that part: the wall strengthens and supports the cell; the vacuole holds cell sap; chloroplasts absorb light for photosynthesis.',
      'A second, different paired difference.',
      'The correct job of the second part.',
    ],
    answer: 'A leaf cell has a cell wall, but an animal cell does not. The wall strengthens and supports the cell. A leaf cell also has chloroplasts, but an animal cell does not. Chloroplasts absorb light for photosynthesis.',
  },
  rubric: {
    marks: 4,
    points: [
      'One paired difference: a leaf cell has a cell wall, a permanent vacuole or chloroplasts, but an animal cell does not.',
      'The correct job of that part: the wall strengthens and supports the cell; the permanent vacuole holds cell sap; chloroplasts absorb light for photosynthesis.',
      'A second, different paired difference from the same three parts.',
      'The correct job of the second part.',
    ],
    reject: [
      'Animal cells are said to have a cell wall or chloroplasts.',
      'Mitochondria, ribosomes, the nucleus, the membrane or cytoplasm given as a difference.',
      'The cell wall is said to control what goes in and out of the cell.',
      'Chloroplasts are said to be in every plant cell.',
      'Mitochondria are said to create energy.',
    ],
  },
  exam: { marks: 4, ao: 'AO1', status: 'revilyDraft' },
}

const states: ScienceState[] = [
  // Start here (B1-01 shows an unlabelled animal-cell model in LessonVisual).
  q({ id: 'B1-01', phase: 'priorKnowledge', dimension: 'recall', title: 'A brick wall is built from many small bricks. Your body is built in a similar way. What is it built from?',
    options: [o('organ', 'A few large organs, such as the heart, and nothing smaller'), o('unit', 'Millions of tiny living units called cells'), o('organism', 'One big living unit: the whole body')], answerId: 'unit',
    hint: 'A heart is big. Is it made of smaller units, like a wall is made of bricks?',
    steps: ['Organs such as the heart are made of many tiny living units.', 'So your body is built from millions of cells, like a wall is built from bricks.'] }),

  // What is inside an animal cell?
  teach('B1-02', 'Inside an animal cell'),
  q({ id: 'B1-03', phase: 'model', dimension: 'recall', title: 'The pointer touches the thin outer layer of this cell. Which part is it?', visual: model('boundary'),
    options: parts.slice(0, 3), answerId: 'membrane', hint: 'Which part is the thin layer around the outside?',
    steps: ['The pointer ends on the thin layer around the outside of the cell.', 'So it points to the cell membrane.'] }),
  q({ id: 'B1-04', title: 'Oxygen moves into a cell. Which part controls what comes in?',
    options: [o('nucleus', 'Nucleus, because it controls the cell'), o('membrane', 'Cell membrane'), o('cytoplasm', 'Cytoplasm')], answerId: 'membrane',
    hint: 'Which part is the outer layer that substances pass through?',
    steps: ['The cell membrane controls what goes in and out of the cell.', 'So oxygen comes in through the membrane. The nucleus controls what the cell does, not what enters.'] }),
  q({ id: 'B1-12', dimension: 'recall', title: 'Which part holds the cell’s genetic material?',
    options: [o('nucleus', 'Nucleus'), o('cytoplasm', 'Cytoplasm'), o('membrane', 'Cell membrane')], answerId: 'nucleus',
    hint: 'Where are the instructions that control the cell kept?',
    steps: ['The genetic material is the set of instructions that controls the cell.', 'So it is kept inside the nucleus.'] }),

  // How does a cell get energy and make proteins? (B1-06 shows the structure → process → function strip.)
  teach('B1-05', 'Energy and proteins'),
  q({ id: 'B1-06', phase: 'misconception', title: 'Which statement is scientifically correct?',
    options: [
      { ...o('create', 'Mitochondria create energy from nothing.', 'MC-ENERGY-CREATED'), feedback: 'This mixes up releasing energy with creating it.' },
      o('release', 'Aerobic respiration in mitochondria releases energy from food.'),
      o('protein', 'Ribosomes carry out aerobic respiration.', 'MC-RIBOSOME-RESPIRATION'),
    ], answerId: 'release',
    hint: 'Does respiration make energy from nothing, or release it from food?',
    steps: ['Aerobic respiration in mitochondria releases energy from food.', 'So energy is released, not created. Ribosomes make proteins; they do not respire.'] }),
  q({ id: 'B1-08', title: 'Which sentence links ribosomes to their job?',
    options: [o('respire', 'Ribosomes release energy by aerobic respiration.', 'MC-RIBOSOME-RESPIRATION'), o('control', 'Ribosomes hold the genetic material.'), o('synthesis', 'Ribosomes make proteins the cell needs.')], answerId: 'synthesis',
    hint: 'What did the tiny dots in the cytoplasm make?',
    steps: ['Ribosomes join small pieces together to make proteins. This is protein synthesis.', 'So ribosomes make proteins. Mitochondria, not ribosomes, carry out aerobic respiration.'] }),

  // What is new in a plant cell?
  teach('B1-42', 'What is new in a plant cell'),
  q({ id: 'B1-25', title: 'Which part strengthens and supports a plant cell?',
    options: [o('wall', 'Cell wall'), o('membrane', 'Cell membrane'), o('vacuole', 'Permanent vacuole')], answerId: 'wall',
    hint: 'Which new part is strong and sits outside the membrane?',
    steps: ['The cell wall is made of cellulose. It strengthens and supports the cell.', 'So it is the cell wall. The membrane controls what goes in and out.'] }),
  q({ id: 'B1-32', dimension: 'recall', title: 'Where in a plant cell does photosynthesis happen?',
    options: [o('vacuole', 'Permanent vacuole'), o('wall', 'Cell wall'), o('chloroplast', 'Chloroplasts')], answerId: 'chloroplast',
    hint: 'Which part is green and absorbs light?',
    steps: ['Chloroplasts contain a green substance that absorbs light.', 'So photosynthesis happens in the chloroplasts.'] }),
  q({ id: 'B1-26', phase: 'misconception', title: 'A root cell has no chloroplasts. Must it be an animal cell?',
    options: [o('no', 'No. Some plant cells, such as root cells, have no chloroplasts.'), o('yes', 'Yes. Every plant cell has chloroplasts.', 'MC-ALL-PLANT-CELLS-CHLOROPLASTS'), o('light', 'Yes. Plant cells without light die.')], answerId: 'no',
    hint: 'Do root cells get any light underground?',
    steps: ['Root cells get no light, so they usually have no chloroplasts.', 'So a root cell is still a plant cell. Not every plant cell has chloroplasts.'] }),

  // How are animal and plant cells different?
  teach('B1-41', 'Compare animal and plant cells'),
  q({ id: 'B1-43', title: 'Which part do both animal cells and plant cells have?',
    options: [o('wall', 'Cell wall'), o('chloroplast', 'Chloroplasts'), o('mitochondria', 'Mitochondria')], answerId: 'mitochondria',
    hint: 'Do plant cells need to release energy too?',
    steps: ['Plant cells need energy, so they have mitochondria, just like animal cells.', 'So mitochondria are in both. Only plant cells have a wall and chloroplasts.'] }),
  q({ id: 'B1-44', title: 'Which sentence is a good paired comparison?',
    options: [o('paired', 'A plant cell has a cell wall, but an animal cell does not.'), o('one', 'A plant cell has a cell wall.'), o('swapped', 'An animal cell has a cell wall, but a plant cell does not.')], answerId: 'paired',
    hint: 'Does the sentence say what both cells have, and is it the right way round?',
    steps: ['A paired comparison names one part and says whether each cell has it.', 'So “A plant cell has a cell wall, but an animal cell does not” compares both cells correctly.'] }),

  // On your own (B1-20 shows a second animal-cell model with labels hidden and a pointer).
  q({ id: 'B1-20', dimension: 'application', title: 'This is a different animal-cell drawing. The labels are hidden. What is the job of the part the pointer touches?', visual: model('boundary', true),
    options: [o('dna', 'Holding the genetic material'), o('entry', 'Controlling what goes in and out of the cell'), o('protein', 'Making proteins')], answerId: 'entry',
    hint: 'A new shape does not change the job. Which part is the outer layer?',
    steps: ['The pointer ends on the thin outer layer, which is the cell membrane.', 'So its job is controlling what goes in and out of the cell.'] }, true),
  q({ id: 'B1-19', dimension: 'application', title: 'A cell in your stomach makes lots of proteins to help digest food. Which part makes these proteins?',
    options: parts, answerId: 'ribosomes', hint: 'Which part carries out protein synthesis?',
    steps: ['The cell’s job is making proteins.', 'So it needs ribosomes, which carry out protein synthesis.'] }, true),
  q({ id: 'B1-45', dimension: 'application', title: 'Sam labels a leaf cell and writes: “Cell wall: controls what goes in and out of the cell.” What is wrong?',
    options: [o('nothing', 'Nothing. That is the job of the cell wall.'), o('swap', 'That is the job of the membrane. The wall strengthens and supports the cell.'), o('none', 'Leaf cells have no cell wall.'), o('chloroplast', 'That is the job of the chloroplasts.')], answerId: 'swap',
    hint: 'Which part controls what goes in and out? What does the wall do?',
    steps: ['The cell membrane controls what goes in and out. The cell wall strengthens and supports the cell.', 'So Sam has given the wall the membrane’s job.'] }, true),
  written,
]

export const lesson1: ScienceLesson = {
  id: 'B-CELL-001-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Animal and plant cells', prerequisites: ['B-KS3-CELL-BASIC'],
  reviewStatus: 'draftNeedsTeacherReview',
  sources: [
    { id: 'aqa-biology', title: 'AQA Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.2 Animal and plant cells' },
    { id: 'aqa-2023-qp', title: 'June 2023 Biology Paper 1F', url: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-QP-JUN23.PDF', locator: '01.2–01.4; prerequisite alignment only' },
    { id: 'aqa-2023-ms', title: 'June 2023 Biology Paper 1F mark scheme', url: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-MS-JUN23.PDF', locator: '01.2–01.4' },
  ],
  misconceptions: [
    { id: 'MC-ENERGY-CREATED', claim: 'Mitochondria create energy.', correction: 'Energy is released by respiration; it is not created.', repair: 'Contrast energy released from a fuel with energy being made from nothing. Re-check with a new function claim, not a repeated answer.' },
    { id: 'MC-RIBOSOME-RESPIRATION', claim: 'Ribosomes are the site of aerobic respiration.', correction: 'Ribosomes synthesise proteins; mitochondria are the site of aerobic respiration.', repair: 'Show a two-row function comparison, then a fresh protein-making context.' },
    { id: 'MC-MODEL-COLOUR', claim: 'A coloured diagram proves a cell part has that colour in a living cell.', correction: 'A schematic uses representational colours; these are not observations of natural colour.', repair: 'Compare two differently coloured schematics representing the same structures.' },
    { id: 'MC-ALL-PLANT-CELLS-CHLOROPLASTS', claim: 'Every plant cell has chloroplasts.', correction: 'Plant cells that get no light, such as root cells, usually have no chloroplasts.', repair: 'Contrast a leaf cell with a root cell; both have a cell wall and a permanent vacuole.' },
  ],
  states, retrieval: [], requirements: sampledRequirements(states),
}
