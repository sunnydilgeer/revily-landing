import type { ChoiceState, EvidenceDimension, ScienceLesson, ScienceState, TeachingState } from '../types'
import { microscopyFrames } from './teachingFrames'

const base = { skillId: 'B-MICROSCOPY', specRefs: ['4.1.1.5'], sourceIds: ['aqa-microscopy'] }
function teach(id: string, title: string): TeachingState {
  const frames = microscopyFrames[id]
  const script = frames.map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ')
  return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script,
    media: { kind: 'videoScript', seconds: frames.length * 12, status: 'notRecorded', script } }
}
function worked(id: string, title: string, body: string, steps: string[]): TeachingState {
  return { ...base, id, kind: 'teaching', phase: 'guided', title, body, steps }
}
function q(id: string, title: string, options: Array<[string, string]>, answerId: string, hint: string, steps: string[], dimension: EvidenceDimension = 'understanding', independent = false): ChoiceState {
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : id === 'B2-01' ? 'priorKnowledge' : 'guided',
    contextId: `microscopy-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : id === 'B2-01' ? 'diagnostic' : 'practice',
    options: options.map(([id, label]) => ({ id, label })), answerId, hint,
    explanation: { steps, answer: options.find(([id]) => id === answerId)![1] },
    ...(independent ? { exam: { marks: 1, ao: dimension === 'calculation' || dimension === 'application' ? 'AO2' : 'AO1', status: 'revilyDraft' } as const } : {}) }
}

export const microscopySections = [
  { id: 'B2-01', label: 'Start here', detail: 'Your starting knowledge' },
  { id: 'B2-02', label: 'Light microscopes', detail: 'Meet the instrument and its parts' },
  { id: 'B2-04', label: 'Magnification', detail: 'Making the image bigger' },
  { id: 'B2-06', label: 'Resolution', detail: 'Distinguishing close features' },
  { id: 'B2-08', label: 'Electron microscopes', detail: 'A different tool for finer detail' },
  { id: 'B2-09', label: 'Compare microscopes', detail: 'Capabilities and scientific progress' },
  { id: 'B2-12', label: 'Calculate magnification', detail: 'Image size ÷ real size' },
  { id: 'B2-15', label: 'Match the units', detail: 'Millimetres and micrometres' },
  { id: 'B2-18', label: 'Find real size', detail: 'Undo the enlargement' },
  { id: 'B2-20', label: 'Find image size', detail: 'Multiply by magnification' },
  { id: 'B2-23', label: 'Standard form', detail: 'Write tiny measurements clearly' },
  { id: 'B2-25', label: 'Try it yourself', detail: 'Independent checks' },
  { id: 'B2-34', label: 'Explain the science', detail: 'Final written task' },
]

export const lesson2: ScienceLesson = {
  id: 'B-CELL-002', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Microscopy: seeing cells and measuring them', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [{ id: 'aqa-microscopy', title: 'AQA Trilogy Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.5; WS 1.1, MS 1a/1b/2h/3b, WS 4.4; follow-on required practical 1 in 4.1.1.2' }],
  misconceptions: [],
  states: [
    q('B2-01', 'Why would a scientist use a microscope to study a cell?', [['see', 'To see details too small to see clearly with the eyes alone'], ['grow', 'To make the real cell grow bigger'], ['make', 'To add new structures to the cell']], 'see', 'Think about what changes: the view, or the cell itself?', ['A microscope produces a magnified view.', 'It does not make the actual cell grow or add structures.'], 'recall'),
    teach('B2-02', 'Meet a light microscope'),
    q('B2-03', 'Eyepiece ×10 and objective ×10: what is the total magnification?', [['100', '×100'], ['20', '×20'], ['10', '×10']], '100', 'Multiply the two lens magnifications.', ['Total magnification = eyepiece × objective.', '10 × 10 = 100.'], 'calculation'),
    teach('B2-04', 'Magnification makes images bigger'),
    q('B2-05', 'The image of a cell is enlarged. What happens to the real cell?', [['same', 'Its real size stays the same'], ['larger', 'It becomes larger too'], ['parts', 'It gains extra structures']], 'same', 'Distinguish the picture from the specimen.', ['Only the image is enlarged.', 'Magnification does not change the real cell.']),
    teach('B2-06', 'Resolution lets you see close features separately'),
    q('B2-07', 'Two close features appear as one merged patch. What is limiting the detail?', [['res', 'Its resolution: the ability to see close features separately'], ['growth', 'The cell growing too quickly'], ['colour', 'The colour chosen for the diagram']], 'res', 'Which idea concerns distinguishing two close points?', ['Resolution determines whether you can tell two close features apart, rather than seeing one merged patch.']),
    teach('B2-08', 'Meet an electron microscope'),
    teach('B2-09', 'Compare the two microscopes'),
    q('B2-10', 'A blurred image is made larger without adding detail. Which statement is correct?', [['mag', 'Magnification increases, but resolution does not improve'], ['res', 'Resolution must improve because it is bigger'], ['cell', 'The real cell becomes bigger']], 'mag', 'Bigger and more detailed are not the same.', ['Enlargement increases image size.', 'It does not by itself reveal two features that were merged.']),
    q('B2-11', 'How did developments in electron microscopy help scientists understand cells?', [['detail', 'They could investigate smaller sub-cellular structures in finer detail'], ['created', 'They created new structures inside cells'], ['all', 'They proved every structure is visible with any microscope']], 'detail', 'Think about the information improved tools reveal.', ['Higher magnification and resolution enabled more detailed investigation.', 'Seeing smaller structures clearly gave scientists more information about how cells are organised. Those structures were already present; the microscope revealed them.']),
    teach('B2-12', 'Calculate magnification'),
    worked('B2-13', 'Magnification: a worked example', 'An image is 12 mm wide. The real cell is 0.03 mm wide. Find the magnification.', ['Both sizes are in mm, so the units match.', 'Magnification = image size ÷ real size = 12 ÷ 0.03.', 'The image is 400 times as wide as the real cell: magnification = ×400. Magnification is a ratio, so it has no length unit.']),
    q('B2-14', 'An image is 9 mm wide. The real cell is 0.03 mm wide. What is the magnification?', [['300', '×300'], ['0.003', '×0.003'], ['270', '×270']], '300', 'The units match. Divide image size by real size.', ['Magnification = 9 ÷ 0.03 = 300.', 'Write ×300, not 300 mm.'], 'calculation'),
    teach('B2-15', 'Match the units'),
    worked('B2-16', 'Different units: a worked example', 'An image is 18 mm wide. The real cell is 30 µm wide. Find the magnification.', ['First convert the real width to mm so both widths use the same unit: 30 ÷ 1000 = 0.03 mm.', 'Magnification = 18 mm ÷ 0.03 mm.', 'Magnification = ×600. Alternatively, 18 000 µm ÷ 30 µm gives the same result.']),
    q('B2-17', 'An image is 10 mm wide. The real cell is 25 µm wide. What is the magnification?', [['400', '×400'], ['0.4', '×0.4'], ['250', '×250']], '400', 'Convert the real size to mm, or the image size to µm, first.', ['25 µm = 0.025 mm.', '10 ÷ 0.025 = 400, so magnification = ×400.'], 'calculation'),
    teach('B2-18', 'Find the real size'),
    worked('B2-19', 'Real size: a worked example', 'A cell image is 15 mm wide at ×500 magnification. Find the real width in µm.', ['Undo the enlargement by dividing: real size = image size ÷ magnification.', '15 ÷ 500 = 0.03 mm.', 'Convert to µm: 0.03 × 1000 = 30 µm.']),
    teach('B2-20', 'Find the image size'),
    worked('B2-21', 'Image size: a worked example', 'A real cell is 0.04 mm wide. Find its image width at ×250 magnification.', ['Image size = real size × magnification.', 'Multiply the real width by the magnification: 0.04 × 250 = 10.', 'Image width = 10 mm. The image is larger than the specimen.']),
    q('B2-22', 'A cell is 50 µm wide. At ×200, how wide is its image in mm?', [['10', '10 mm'], ['10000', '10 000 mm'], ['0.25', '0.25 mm']], '10', 'Multiply to find image size, then convert µm to mm.', ['Image width = 50 × 200 = 10 000 µm.', '10 000 µm ÷ 1000 = 10 mm.'], 'calculation'),
    teach('B2-23', 'Small sizes in standard form'),
    q('B2-24', 'Which standard-form expression equals 0.006 mm?', [['6', '6 × 10⁻³ mm'], ['positive', '6 × 10³ mm'], ['wrong', '6 × 10⁻⁴ mm']], '6', '10⁻³ means one thousandth.', ['6 × 0.001 = 0.006.', 'Keep mm as the unit.'], 'calculation'),
    q('B2-25', 'What does magnification tell you?', [['size', 'How many times larger the image is than the real object'], ['detail', 'Whether two close points appear separate'], ['growth', 'How quickly the real cell grows']], 'size', 'Recall the meaning, not just the formula.', ['Magnification compares image size with real size.'], 'recall', true),
    q('B2-26', 'What is resolution?', [['points', 'The ability to distinguish two close points as separate'], ['size', 'The number of times the image is enlarged'], ['colour', 'The number of colours in the image']], 'points', 'Think about distinguishing nearby features.', ['Resolution concerns separating close points, not image enlargement.'], 'recall', true),
    q('B2-27', 'Compared with light microscopes, electron microscopes generally have…', [['both', 'Higher magnification and higher resolving power'], ['mag', 'Higher magnification but lower resolving power'], ['same', 'The same magnification and resolving power']], 'both', 'Consider image size and the ability to distinguish detail separately.', ['Electron microscopes have higher magnification and resolving power.', 'This allows finer sub-cellular detail to be studied.'], 'understanding', true),
    q('B2-28', 'A scientist needs to distinguish two very close cell structures that a light microscope cannot resolve. Which change would help?', [['electron', 'Use an electron microscope with greater resolving power'], ['stretch', 'Stretch the same blurred image'], ['label', 'Add labels to the blurred image']], 'electron', 'The problem is missing detail, not the printed image size.', ['Greater resolving power means that closer structures can be seen separately.', 'Enlarging or labelling the same blur does not recover missing detail.'], 'application', true),
    q('B2-29', 'Image width 8 mm; real width 0.02 mm. Calculate magnification.', [['400', '×400'], ['0.0025', '×0.0025'], ['160', '×160']], '400', 'Check units, then divide image size by real size.', ['Magnification = 8 ÷ 0.02 = 400.', 'The answer is ×400 without a length unit.'], 'calculation', true),
    q('B2-30', 'Image width 15 mm; real width 50 µm. Calculate magnification.', [['300', '×300'], ['0.3', '×0.3'], ['750', '×750']], '300', 'Match the units before using the formula.', ['50 µm = 0.05 mm.', '15 ÷ 0.05 = 300, so magnification = ×300.'], 'calculation', true),
    q('B2-31', 'A cell image is 24 mm wide at ×600. What is the real width in µm?', [['40', '40 µm'], ['0.04', '0.04 µm'], ['14400', '14 400 µm']], '40', 'Find real size by dividing, then check the requested unit.', ['Real width = 24 ÷ 600 = 0.04 mm.', '0.04 × 1000 = 40 µm.'], 'calculation', true),
    q('B2-32', 'A real cell is 0.025 mm wide. What is its image width at ×400?', [['10', '10 mm'], ['0.0000625', '0.0000625 mm'], ['10000', '10 000 mm']], '10', 'Image size = real size × magnification.', ['0.025 × 400 = 10.', 'The supplied real size was in mm, so image width is 10 mm.'], 'calculation', true),
    q('B2-33', 'Which standard-form expression equals 0.007 mm?', [['7', '7 × 10⁻³ mm'], ['positive', '7 × 10³ mm'], ['wrong', '7 × 10⁻² mm']], '7', 'Check what the power of ten represents.', ['10⁻³ = 0.001.', '7 × 0.001 = 0.007 mm.'], 'calculation', true),
    { ...base, id: 'B2-34', kind: 'written', phase: 'transfer', title: 'Explain how the ability of electron microscopes to show close structures separately helped scientists understand cells.',
      contextId: 'microscopy-written-transfer', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly', hint: 'Explain what greater resolving power allows scientists to see, then how this extra detail helps them learn about cells.',
      placeholder: 'Greater resolving power allows…, which helps scientists… .', instruction: 'Explain both the improvement in the view and how it helps scientists understand cell structures.',
      explanation: { steps: ['Explain the improvement in distinguishing close structures.', 'Link the additional detail to understanding sub-cellular structures.'], answer: 'Greater resolving power lets scientists see small, closely spaced structures separately. This reveals finer detail inside cells, allowing scientists to investigate these structures and better understand how cells are organised.' },
      rubric: { marks: 2, points: ['One mark for distinguishing smaller or more closely spaced structures / seeing finer detail.', 'One mark for linking that extra detail to investigating or understanding sub-cellular structures.'], reject: ['Magnification and resolution mean the same thing.', 'The microscope creates new cell structures.', 'Enlarging an existing blur alone reveals previously unresolved detail.'] }, exam: { marks: 2, ao: 'AO1', status: 'revilyDraft' } },
  ] satisfies ScienceState[],
  retrieval: [],
  requirements: {
    recall: { inSession: ['B2-25', 'B2-26'], delayed: [] }, understanding: { inSession: ['B2-27'], delayed: [] },
    application: { inSession: ['B2-28'], delayed: [] }, calculation: { inSession: ['B2-29', 'B2-30', 'B2-31', 'B2-32', 'B2-33'], delayed: [] },
    explanation: { inSession: ['B2-34'], delayed: [] },
  },
}
