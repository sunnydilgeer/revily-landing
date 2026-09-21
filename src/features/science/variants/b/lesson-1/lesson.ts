// Variant B: independent lesson copy; shared rendering and assessment engine.
import type { ChoiceState, ScienceLesson, ScienceState, VisualBrief } from '../../../types'
import { expandedIndependent, expandedTeaching } from './expandedContent'
import { teachingFrames } from './teachingFrames'

const specRefs = ['4.1.1.2']
const sourceIds = ['aqa-biology']
const skillId = 'B-CELL-PARTS-FUNCTIONS'
const model = (highlight?: string, alternate = false): VisualBrief => ({
  id: alternate ? 'animal-cell-b' : 'animal-cell-a', kind: 'cellModel', highlight,
  brief: `${alternate ? 'Use a differently oriented, elongated' : 'Use an irregular rounded'} animal-cell schematic. Membrane is one outer boundary; cytoplasm is the interior excluding the nucleus. Show a nucleus, several mitochondria and tiny ribosome dots. Keep labels optional. No cell wall, chloroplasts or scale claim. Caption: simplified model, not to scale; colours are a key, not real cell colours.`,
  accessibleDescription: 'Simplified animal-cell model with an outer membrane, cytoplasm, a nucleus, mitochondria and ribosomes; not to scale.',
  assessmentDescription: 'Simplified animal-cell model; not to scale. Labels are hidden. Use the named target description in the question; colour is not needed.',
})

type ChoiceInput = Omit<ChoiceState, 'kind' | 'skillId' | 'specRefs' | 'sourceIds' | 'explanation'> & {
  answer: string; reasoning: string[]; specRefs?: string[]; sourceIds?: string[]
}
function q(input: ChoiceInput): ChoiceState {
  const { answer, reasoning, ...state } = input
  return { kind: 'choice', skillId, specRefs, sourceIds, ...state,
    explanation: { steps: reasoning, answer } }
}
const parts = [
  { id: 'nucleus', label: 'Nucleus' }, { id: 'cytoplasm', label: 'Cytoplasm' },
  { id: 'membrane', label: 'Cell membrane' }, { id: 'mitochondria', label: 'Mitochondria' },
  { id: 'ribosomes', label: 'Ribosomes' },
]

export const lesson1: ScienceLesson = {
  id: 'B-CELL-001-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Cells: animal, plant and bacterial', prerequisites: ['B-KS3-CELL-BASIC'],
  reviewStatus: 'draftNeedsTeacherReview',
  sources: [
    { id: 'aqa-biology', title: 'AQA Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.1–4.1.1.2; follow-on 4.1.1.5' },
    { id: 'aqa-ws', title: 'AQA Working scientifically', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/working-scientifically', locator: 'WS 1.2, WS 3.5, WS 4.1' },
    { id: 'aqa-practical', title: 'AQA Practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: 'Required practical 1; AT 7' },
    { id: 'aqa-2023-qp', title: 'June 2023 Biology Paper 1F', url: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-QP-JUN23.PDF', locator: '01.2–01.4; prerequisite alignment only' },
    { id: 'aqa-2023-ms', title: 'June 2023 Biology Paper 1F mark scheme', url: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-MS-JUN23.PDF', locator: '01.2–01.4' },
  ],
  misconceptions: [
    { id: 'MC-ENERGY-CREATED', claim: 'Mitochondria create energy.', correction: 'Energy is released by respiration; it is not created.', repair: 'Contrast energy released from a fuel with energy being made from nothing. Re-check with a new function claim, not a repeated answer.' },
    { id: 'MC-RIBOSOME-RESPIRATION', claim: 'Ribosomes are the site of aerobic respiration.', correction: 'Ribosomes synthesise proteins; mitochondria are the site of aerobic respiration.', repair: 'Show a two-row function comparison, then a fresh protein-making context.' },
    { id: 'MC-MODEL-COLOUR', claim: 'A coloured diagram proves a cell part has that colour in a living cell.', correction: 'A schematic uses representational colours; these are not observations of natural colour.', repair: 'Compare two differently coloured schematics representing the same structures.' },
    { id: 'MC-UNSEEN-ABSENT', claim: 'If a structure is not visible in one microscope view it must be absent.', correction: 'Not seeing a structure in this view does not establish that it is absent.', repair: 'Distinguish evidence about this image from a claim about the whole cell.' },
  ],
  states: [
    q({ id: 'B1-01', phase: 'priorKnowledge', title: 'What is a cell?', contextId: 'ks3-baseline', dimensions: ['recall'], evidenceRole: 'diagnostic',
      options: [{ id: 'unit', label: 'A basic living unit that organisms are made of' }, { id: 'organ', label: 'An organ, such as the heart' }, { id: 'organism', label: 'Always a whole animal' }], answerId: 'unit', answer: 'A basic living unit that organisms are made of.', hint: 'An organ, such as a heart, is made of many cells.', reasoning: ['Living organisms are made of cells.', 'An organ contains many cells; a cell is not the same as an organ.'] }),
    { id: 'B1-02', kind: 'teaching', phase: 'teach', skillId, specRefs, sourceIds, title: 'Animal cells: meet the cell', visual: model(),
      media: { kind: 'videoScript', seconds: 45, status: 'notRecorded', script: teachingFrames['B1-02'].map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ') },
      body: 'Meet the membrane, cytoplasm and nucleus. Each part has a job.' },
    q({ id: 'B1-03', phase: 'model', title: 'The pointer touches the outer boundary. Which cell part is it?', visual: model('boundary'), contextId: 'model-a-boundary', dimensions: ['recall'], evidenceRole: 'practice', options: parts.slice(0, 3), answerId: 'membrane', answer: 'Cell membrane.', hint: 'Follow the cell’s outside edge. The target is the boundary, not a structure inside it.', reasoning: ['The pointer ends on the cell’s outer boundary.', 'In this animal-cell model, that boundary is the cell membrane.'] }),
    q({ id: 'B1-04', phase: 'guided', title: 'A substance enters the cell. Which part controls entry?', contextId: 'entry-guided', dimensions: ['understanding'], evidenceRole: 'practice', options: parts.slice(0, 3), answerId: 'membrane', answer: 'Cell membrane.', hint: 'Which part is the cell’s boundary? Think about what enters and leaves.', reasoning: ['The cell membrane controls movement of substances into and out of the cell.', 'The nucleus controls cell activities. The membrane has a different job: controlling which substances enter and leave.'] }),
    { id: 'B1-05', kind: 'teaching', phase: 'teach', skillId, specRefs, sourceIds, title: 'Animal cells: energy and proteins', visual: model(),
      media: { kind: 'videoScript', seconds: 35, status: 'notRecorded', script: teachingFrames['B1-05'].map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ') },
      body: 'Explore animal-cell mitochondria and ribosomes, then revisit the whole animal cell.' },
    q({ id: 'B1-06', phase: 'misconception', title: 'Which statement is scientifically correct?', contextId: 'energy-claim', dimensions: ['understanding'], evidenceRole: 'practice',
      options: [{ id: 'release', label: 'Respiration releases energy for cell processes.' }, { id: 'create', label: 'Mitochondria create energy from nothing.', misconceptionSignal: 'MC-ENERGY-CREATED', feedback: 'This statement confuses energy release with energy creation.' }, { id: 'protein', label: 'Ribosomes carry out aerobic respiration.', misconceptionSignal: 'MC-RIBOSOME-RESPIRATION' }], answerId: 'release', answer: 'Respiration releases energy for cell processes.', hint: 'Respiration releases energy. Protein synthesis makes proteins. Match each process to its cell part.', reasoning: ['Mitochondria are the site of aerobic respiration.', 'Respiration releases energy; ribosomes make proteins.'] }),
    { id: 'B1-07', kind: 'teaching', phase: 'guided', skillId, specRefs, sourceIds: [...sourceIds, 'aqa-2023-ms'], title: 'Explain how a cell structure helps',
      body: 'A cell needs energy for its work. How do mitochondria help?',
      steps: ['Name the structure: mitochondria.', 'What happens there? Aerobic respiration uses oxygen.', 'How does it help? Respiration releases energy for the cell’s work.'] },
    q({ id: 'B1-08', phase: 'guided', title: 'Which statement links ribosomes to their function?', contextId: 'protein-guided', dimensions: ['understanding'], evidenceRole: 'practice',
      options: [{ id: 'synthesis', label: 'Ribosomes make proteins that the cell needs.' }, { id: 'shape', label: 'Ribosomes are drawn as dots, so they control the cell.' }, { id: 'respire', label: 'Ribosomes release energy by aerobic respiration.', misconceptionSignal: 'MC-RIBOSOME-RESPIRATION' }], answerId: 'synthesis', answer: 'Ribosomes make proteins that the cell needs.', hint: 'Protein synthesis means making proteins.', reasoning: ['Ribosomes make proteins. The scientific name for this is protein synthesis.', 'A drawing symbol identifies a structure; it does not explain its function.'] }),
    q({ id: 'B1-09', phase: 'misconception', title: 'Our model shows a purple nucleus. What does that tell us?', visual: model(), contextId: 'model-colour', dimensions: ['understanding'], evidenceRole: 'practice', sourceIds: ['aqa-ws'], specRefs: ['WS 1.2'],
      options: [{ id: 'key', label: 'Purple identifies the nucleus in this model.' }, { id: 'natural', label: 'All living nuclei are naturally purple.', misconceptionSignal: 'MC-MODEL-COLOUR' }, { id: 'function', label: 'Purple is what lets the nucleus control activities.' }], answerId: 'key', answer: 'Purple identifies the nucleus in this model.', hint: 'Does the colour show a real observation, or help you identify a part?', reasoning: ['This diagram uses different colours so you can tell the parts apart.', 'A diagram’s colour does not tell us the part’s real colour.'] }),
    { id: 'B1-10', kind: 'teaching', phase: 'practicalConnection', skillId, specRefs: ['4.1.1.2', 'WS 1.2', 'WS 3.5'], sourceIds: ['aqa-practical', 'aqa-ws'], title: 'Drawings should follow observations',
      body: 'A microscope view may show fewer parts than a textbook model. Draw only what you can see clearly. A part might be present but too small to see. You will practise this in Lesson 3.',
      visual: { id: 'observation-note', kind: 'observationRecord', brief: 'Side-by-side schematic and text observation record, NOT a fabricated micrograph. Record: “In this prepared stained animal-cell view, a nucleus and cell outline were visible; tiny internal structures were not distinguished.” Label the record as an illustrative scenario.', accessibleDescription: 'Illustrative observation record: a nucleus and cell outline were visible; tiny internal structures were not distinguished.' } },
    q({ id: 'B1-11', phase: 'practicalConnection', title: 'You cannot see ribosomes clearly in this microscope view. What can you conclude?', contextId: 'unseen-view', dimensions: ['practicalReasoning', 'dataInterpretation'], evidenceRole: 'practice', sourceIds: ['aqa-ws', 'aqa-practical'], specRefs: ['WS 1.2', 'WS 3.5'],
      options: [{ id: 'limit', label: 'We cannot tell from this view whether the cell lacks ribosomes.' }, { id: 'absent', label: 'The cell definitely has no ribosomes.', misconceptionSignal: 'MC-UNSEEN-ABSENT' }, { id: 'all', label: 'Every animal cell must lack ribosomes.' }], answerId: 'limit', answer: 'We cannot tell from this view whether the cell lacks ribosomes.', hint: 'Separate what was seen from what exists.', reasoning: ['The observation only tells us that the tiny structures could not be seen clearly.', 'The view may not show them clearly. It does not prove they are missing.'] }),
    ...expandedTeaching,
    ...([
      ['12', 'Which part contains most of the genetic material in a typical animal cell?', 'nucleus', 'Nucleus.', 'The nucleus contains genetic material and controls cell activities.'],
      ['13', 'Where do many chemical reactions occur in a typical animal cell?', 'cytoplasm', 'Cytoplasm.', 'Many cell reactions take place in the cytoplasm.'],
      ['14', 'Which structure forms the boundary controlling movement in and out?', 'membrane', 'Cell membrane.', 'The membrane controls movement into and out of the cell.'],
      ['15', 'Which structures are the site of aerobic respiration?', 'mitochondria', 'Mitochondria.', 'Aerobic respiration takes place in mitochondria and releases energy.'],
      ['16', 'Which structures carry out protein synthesis (making proteins)?', 'ribosomes', 'Ribosomes.', 'Protein synthesis takes place at ribosomes.'],
    ].map(([n, title, answerId, answer, reason]) => q({ id: `B1-${n}`, phase: 'independent', title, contextId: `function-recall-${answerId}`, dimensions: ['recall'], evidenceRole: 'independent', options: parts, answerId, answer, hint: 'Match the job to a cell part. Do not rely on colour or position.', reasoning: [reason], exam: { marks: 1, ao: 'AO1', status: 'revilyDraft' } }))),
    q({ id: 'B1-17', phase: 'independent', title: 'How do the nucleus and membrane have different jobs?', contextId: 'control-distinction', dimensions: ['understanding'], evidenceRole: 'independent',
      options: [{ id: 'different', label: 'The nucleus controls cell activities; the membrane controls entry and exit.' }, { id: 'same', label: 'Both names mean the same structure.' }, { id: 'reversed', label: 'The membrane holds the nucleus’s genetic material; the nucleus is the outer boundary.' }], answerId: 'different', answer: 'The nucleus controls activities; the membrane controls entry and exit.', hint: 'The word “controls” can refer to different functions.', reasoning: ['The nucleus and membrane are different structures.', 'The nucleus controls activities inside the cell; the membrane controls movement across its boundary.'], exam: { marks: 1, ao: 'AO1', status: 'revilyDraft' } }),
    q({ id: 'B1-18', phase: 'independent', title: 'How do mitochondria and ribosomes have different jobs?', contextId: 'process-distinction', dimensions: ['understanding'], evidenceRole: 'independent',
      options: [{ id: 'jobs', label: 'Mitochondria: aerobic respiration. Ribosomes: protein synthesis.' }, { id: 'swapped', label: 'Mitochondria: protein synthesis. Ribosomes: aerobic respiration.', misconceptionSignal: 'MC-RIBOSOME-RESPIRATION' }, { id: 'created', label: 'Both structures create energy.', misconceptionSignal: 'MC-ENERGY-CREATED' }], answerId: 'jobs', answer: 'Mitochondria: aerobic respiration. Ribosomes: protein synthesis.', hint: 'Match a process to each part, rather than relying on where it was drawn.', reasoning: ['Aerobic respiration and protein synthesis are different processes.', 'Mitochondria: aerobic respiration releases energy. Ribosomes: protein synthesis makes proteins.'], exam: { marks: 1, ao: 'AO1', status: 'revilyDraft' } }),
    q({ id: 'B1-19', phase: 'transfer', title: 'A gland cell makes proteins to release. Which cell part makes them?', contextId: 'gland-protein', dimensions: ['application'], evidenceRole: 'independent', options: parts, answerId: 'ribosomes', answer: 'Ribosomes.', hint: 'Use the given task: making proteins. No prior knowledge of glands is needed.', reasoning: ['The question supplies the cell’s job: making proteins.', 'Ribosomes carry out protein synthesis.'], exam: { marks: 1, ao: 'AO2', status: 'revilyDraft' } }),
    q({ id: 'B1-20', phase: 'transfer', title: 'This is another model of a typical animal cell. Which function belongs to its outer boundary?', visual: model('boundary', true), contextId: 'model-b-boundary', dimensions: ['application'], evidenceRole: 'independent',
      options: [{ id: 'entry', label: 'Controlling movement of substances into and out' }, { id: 'dna', label: 'Enclosing the genetic material in the nucleus' }, { id: 'protein', label: 'Synthesising proteins' }], answerId: 'entry', answer: 'Controlling movement of substances into and out.', hint: 'A changed outline does not change the boundary’s function.', reasoning: ['This model’s outer boundary represents the cell membrane.', 'Its function is controlling movement into and out of the cell.'], exam: { marks: 1, ao: 'AO2', status: 'revilyDraft' } }),
    ...expandedIndependent,
    { id: 'B1-21', kind: 'written', phase: 'transfer', skillId, specRefs: ['4.1.1.1', '4.1.1.2'], sourceIds: ['aqa-biology'],
      title: 'Give two differences between the parts in a typical animal cell and a bacterial cell.', contextId: 'animal-bacterial-comparison', dimensions: ['explanation'], evidenceRole: 'independent', hint: 'Compare one part at a time: an animal cell has…, but a bacterial cell… . Give two comparisons.', marking: 'teacherOnly',
      explanation: { steps: ['Compare whether genetic material is enclosed in a nucleus.', 'Compare another structure, such as mitochondria or a cell wall.'], answer: 'A typical animal cell has a nucleus; a bacterial cell does not. A typical animal cell has mitochondria; a bacterial cell does not.' },
      rubric: { marks: 2, points: ['Credit one valid paired structural difference: nucleus present in a typical animal cell, absent in a bacterium.', 'Credit a second distinct paired difference, e.g. animal mitochondria present / bacterial mitochondria absent, or bacterial cell wall present / animal cell wall absent. Award up to two marks for any two valid distinct structural comparisons.'], reject: ['Bacteria have no DNA or no ribosomes.', 'Animal cells have a cell wall.', 'All bacteria have plasmids.', 'Counting no nucleus and DNA not enclosed in a nucleus as two separate differences.'] },
      exam: { marks: 2, ao: 'AO1', status: 'revilyDraft' } },
  ] satisfies ScienceState[],
  retrieval: [
    q({ id: 'B1-R01', phase: 'retrieval', title: 'Which cell structures make proteins?', contextId: 'delayed-protein-recall', dimensions: ['recall'], evidenceRole: 'delayed', options: parts, answerId: 'ribosomes', answer: 'Ribosomes.', hint: 'Recall the function, not the diagram colour.', reasoning: ['Ribosomes carry out protein synthesis.'] }),
    q({ id: 'B1-R02', phase: 'retrieval', title: 'Why do mitochondria help a cell carry out energy-requiring processes?', contextId: 'delayed-energy-reason', dimensions: ['understanding'], evidenceRole: 'delayed',
      options: [{ id: 'release', label: 'They are the site of aerobic respiration, which releases energy.' }, { id: 'create', label: 'They create new energy.', misconceptionSignal: 'MC-ENERGY-CREATED' }, { id: 'proteins', label: 'They are the site of protein synthesis.' }], answerId: 'release', answer: 'Aerobic respiration in mitochondria releases energy.', hint: 'Distinguish a process from a claim that energy is created.', reasoning: ['Mitochondria carry out aerobic respiration.', 'The energy released can be used for cell processes.'] }),
    q({ id: 'B1-R03', phase: 'retrieval', title: 'A cell makes a protein used elsewhere in the body. Which structure makes that protein?', contextId: 'delayed-protein-application', dimensions: ['application'], evidenceRole: 'delayed', options: parts, answerId: 'ribosomes', answer: 'Ribosomes.', hint: 'Which process makes proteins?', reasoning: ['The protein will be used elsewhere, but ribosomes still make it.', 'Ribosomes perform that process.'] }),
    { id: 'B1-R04', kind: 'written', phase: 'retrieval', skillId, specRefs: ['4.1.1.1', '4.1.1.2'], sourceIds, title: 'Compare two structures in a typical animal cell with those in a bacterial cell.', contextId: 'delayed-written-comparison', dimensions: ['explanation'], evidenceRole: 'delayed', hint: 'Choose two different cell parts. For each, say whether the animal cell and bacterial cell have it.', marking: 'teacherOnly',
      explanation: { steps: ['Compare a nucleus.', 'Compare a second structure such as mitochondria or a wall.'], answer: 'A typical animal cell has a nucleus and mitochondria; a bacterial cell has neither.' },
      rubric: { marks: 2, points: ['One valid paired structural difference.', 'A second distinct valid paired structural difference.'], reject: ['Bacteria have no DNA.', 'Animal cells have a cell wall.'] } },
    q({ id: 'B1-R05', phase: 'retrieval', title: 'What material strengthens a plant cell wall?', contextId: 'delayed-plant-wall', specRefs, dimensions: ['recall'], evidenceRole: 'delayed', options: [{ id: 'cellulose', label: 'Cellulose' }, { id: 'sap', label: 'Cell sap' }, { id: 'dna', label: 'DNA' }], answerId: 'cellulose', answer: 'Cellulose.', hint: 'Recall the material of a plant wall.', reasoning: ['Plant and algal cell walls contain cellulose.'] }),
    q({ id: 'B1-R06', phase: 'retrieval', title: 'What are small extra DNA rings in some bacteria called?', contextId: 'delayed-bacterial-plasmids', specRefs: ['4.1.1.1'], dimensions: ['recall'], evidenceRole: 'delayed', options: [{ id: 'plasmids', label: 'Plasmids' }, { id: 'nuclei', label: 'Nuclei' }, { id: 'vacuoles', label: 'Vacuoles' }], answerId: 'plasmids', answer: 'Plasmids.', hint: 'Recall the name of additional bacterial genetic material.', reasoning: ['Plasmids are small extra rings of DNA that may occur in bacterial cells.'] }),
  ],
  requirements: {
    recall: { inSession: ['B1-12', 'B1-13', 'B1-14', 'B1-15', 'B1-16', 'B1-32', 'B1-33', 'B1-34', 'B1-36', 'B1-37'], delayed: ['B1-R01', 'B1-R05', 'B1-R06'] },
    understanding: { inSession: ['B1-17', 'B1-18'], delayed: ['B1-R02'] },
    application: { inSession: ['B1-19', 'B1-20'], delayed: ['B1-R03'] },
    explanation: { inSession: ['B1-21'], delayed: ['B1-R04'] },
    calculation: { inSession: ['B1-35', 'B1-38', 'B1-39', 'B1-40'], delayed: [] },
  },
}
