// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route: tiny units → magnification = image size ÷ real size → turn the rule round to find a
// missing size → estimate a tiny area. Each worked example is followed by practice with new numbers.
// See STORYBOARD.md.
import type { ChoiceState, EvidenceDimension, ScienceLesson, ScienceState, TeachingState, WrittenState } from '../types'
import { sampledRequirements } from '../lessonAuthoring'
import { magnificationFrames } from './teachingFrames'

const base = { skillId: 'B-MICROSCOPY-MATHS', specRefs: ['4.1.1.1', '4.1.1.5'], sourceIds: ['aqa-microscopy'] }
function teach(id: string, title: string): TeachingState {
  const frames = magnificationFrames[id]
  const script = frames.map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ')
  return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script,
    media: { kind: 'videoScript', seconds: frames.length * 12, status: 'notRecorded', script } }
}
// Worked examples B2-13, B2-16, B2-19 and B2-21 show fixed size cards in MicroscopyVisuals; B1-30 shows the area model.
function worked(id: string, title: string, body: string, steps: string[]): TeachingState {
  return { ...base, id, kind: 'teaching', phase: 'model', title, body, steps }
}
// Options are listed in display order; `correct` is the index of the right one.
function q(id: string, title: string, labels: string[], correct: number, hint: string, steps: string[], dimension: EvidenceDimension = 'calculation', independent = false): ChoiceState {
  const opening = id === 'B2-39'
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : opening ? 'priorKnowledge' : 'guided',
    contextId: `magnification-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : opening ? 'diagnostic' : 'practice',
    options: labels.map((label, i) => ({ id: String(i), label })), answerId: String(correct), hint,
    explanation: { steps, answer: labels[correct] },
    ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : 'AO2', status: 'revilyDraft' } as const } : {}) }
}
function written(id: string, title: string, hint: string, answer: string, points: string[], reject: string[]): WrittenState {
  return { ...base, id, kind: 'written', phase: 'transfer', title, contextId: 'magnification-written-transfer', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly',
    hint, placeholder: 'The real size is missing, so I use… Then…', instruction: 'Write each step: the rule, the numbers, the unit change and a check. Your response is saved here for teacher review, not automatically marked.',
    explanation: { steps: points, answer }, rubric: { marks: points.length, points, reject }, exam: { marks: points.length, ao: 'AO2', status: 'revilyDraft' } }
}

export const magnificationSections = [
  { id: 'B2-39', label: 'Start here', detail: 'What does ×100 mean?' },
  { id: 'B1-29', label: 'How small is a micrometre?', detail: 'Units, orders of magnitude and standard form' },
  { id: 'B2-12', label: 'Work out magnification', detail: 'Image size ÷ real size' },
  { id: 'B2-18', label: 'Find a missing size', detail: 'Real size and image size' },
  { id: 'B2-41', label: 'Estimate a tiny area', detail: 'Use a rectangle' },
  { id: 'B2-30', label: 'On your own', detail: 'Calculate, check and explain' },
]

const states: ScienceState[] = [
  // Start here
  q('B2-39', 'In the last lesson, you looked at a cell at ×100. What does ×100 mean?',
    ['The real cell is 100 µm wide', 'The image is 100 times bigger than the real cell', 'The real cell has grown 100 times bigger'], 1,
    'Which gets bigger in a microscope: the image or the cell?', ['Magnification tells you how many times bigger the image is than the real thing.', 'So ×100 means the image is 100 times bigger. The real cell does not change.'], 'recall'),

  // How small is a micrometre?
  teach('B1-29', 'How small is a micrometre?'),
  q('B2-40', 'A mitochondrion is 0.002 mm long. How long is it in µm?', ['2 µm', '0.000002 µm', '20 µm'], 0,
    'Going from mm to µm: multiply or divide by 1000?', ['There are 1000 µm in 1 mm, so multiply by 1000.', 'So 0.002 × 1000 = 2 µm.']),
  q('B2-24', 'Which is 0.006 mm written in standard form?', ['6 × 10³ mm', '6 × 10⁻⁴ mm', '6 × 10⁻³ mm'], 2,
    'What does 10⁻³ mean?', ['10⁻³ means 0.001.', 'So 6 × 10⁻³ mm = 6 × 0.001 mm = 0.006 mm.']),

  // Work out magnification
  teach('B2-12', 'Work out magnification'),
  worked('B2-13', 'Magnification: same units', 'An image of a cell is 12 mm wide. The real cell is 0.03 mm wide. Find the magnification.',
    ['Write the rule: magnification = image size ÷ real size.', 'Check the units: both sizes are in mm, so they match.', 'Put in the numbers: 12 ÷ 0.03 = 400.', 'Write the answer: ×400. It has no unit.']),
  worked('B2-16', 'Magnification: different units', 'An image of a cell is 18 mm wide. The real cell is 30 µm wide. Find the magnification.',
    ['Check the units: mm and µm do not match.', 'Change µm into mm: 30 ÷ 1000 = 0.03 mm.', 'Divide: 18 ÷ 0.03 = 600.', 'Write the answer: ×600. It has no unit.']),
  q('B2-17', 'An image is 10 mm wide. The real cell is 25 µm wide. What is the magnification?', ['×400', '×0.4', '×250'], 0,
    'Do the units match? Change µm into mm first.', ['25 µm ÷ 1000 = 0.025 mm, so both sizes are now in mm.', 'So 10 ÷ 0.025 = 400, and the magnification is ×400.']),

  // Find a missing size
  teach('B2-18', 'Find a missing size'),
  worked('B2-19', 'Real size: a worked example', 'An image of a cell is 15 mm wide at ×500. Find the real width in µm.',
    ['Write the rule: real size = image size ÷ magnification.', 'Put in the numbers: 15 ÷ 500 = 0.03 mm.', 'The question asks for µm, so multiply by 1000: 0.03 × 1000 = 30 µm.', 'Check: 30 µm is much smaller than the 15 mm image.']),
  worked('B2-21', 'Image size: a worked example', 'A real cell is 0.04 mm wide. Find the width of its image at ×250.',
    ['Write the rule: image size = real size × magnification.', 'Put in the numbers: 0.04 × 250 = 10.', 'The real size was in mm, so the image is 10 mm wide.', 'Check: 10 mm is bigger than the real cell.']),
  q('B2-31', 'An image of a cell is 24 mm wide at ×600. What is the real width in µm?', ['14 400 µm', '0.04 µm', '40 µm'], 2,
    'Divide to find the real size. Then check the unit the question asks for.', ['Real size = image size ÷ magnification = 24 ÷ 600 = 0.04 mm.', 'So in µm it is 0.04 × 1000 = 40 µm.']),
  q('B2-22', 'A cell is 50 µm wide. At ×200, how wide is its image in mm?', ['10 mm', '10 000 mm', '0.25 mm'], 0,
    'Multiply to find the image size. Which unit does your answer come out in?', ['Image size = real size × magnification = 50 × 200 = 10 000 µm.', 'So in mm it is 10 000 ÷ 1000 = 10 mm.']),

  // Estimate a tiny area
  teach('B2-41', 'Estimate a tiny area'),
  worked('B1-30', 'Estimate an area using a rectangle', 'Use a rectangle to estimate the area of this mitochondrion. Length: 8 µm. Width: 2 µm.',
    ['Fit a rectangle closely around the curved shape.', 'Multiply length by width: 8 × 2 = 16.', 'Both sizes are in µm, so the unit is µm².', 'Estimated area ≈ 16 µm². The curved shape does not exactly fill the rectangle.']),
  q('B1-35', 'Estimate the area of a mitochondrion using a rectangle 6 µm long and 2 µm wide.', ['8 µm²', '12 µm²', '12 µm', '3 µm²'], 1,
    'Multiply length by width. Which unit does an area have?', ['Area ≈ length × width = 6 × 2 = 12.', 'Both sizes are in µm, so the area is about 12 µm².']),

  // On your own
  q('B2-30', 'An image of a cell is 15 mm wide. The real cell is 50 µm wide. What is the magnification?', ['×750', '×0.3', '×300'], 2,
    'Match the units before you divide.', ['50 µm ÷ 1000 = 0.05 mm, so both sizes are now in mm.', 'So 15 ÷ 0.05 = 300, and the magnification is ×300.'], 'calculation', true),
  q('B2-42', 'Jo finds the real width of a cell. The image is 36 mm wide at ×400. Jo writes: “real width = 36 × 400 = 14 400 mm.” What is wrong?',
    ['Nothing; the working is correct', 'Jo should divide: 36 ÷ 400 = 0.09 mm', 'Jo should add: 36 + 400 = 436 mm', 'Jo should write the answer as ×14 400'], 1,
    'Should the real cell be bigger or smaller than its image?', ['The real cell is smaller than its image, so real size = image size ÷ magnification.', 'So the real width is 36 ÷ 400 = 0.09 mm, not 14 400 mm.'], 'understanding', true),
  written('B2-43', 'A photo shows a cheek cell 30 mm wide. The photo was taken at ×600. Explain, step by step, how to find the real width of the cell in µm.',
    'Which size is missing, so which rule do you need? Then check the unit the question asks for.',
    'The real size is missing, so use real size = image size ÷ magnification. 30 ÷ 600 = 0.05 mm. The question asks for µm, so multiply by 1000: 0.05 × 1000 = 50 µm. This makes sense, because the real cell is much smaller than its 30 mm image.',
    ['Chooses real size = image size ÷ magnification.', 'Calculates 30 ÷ 600 = 0.05 mm.', 'Changes mm into µm by multiplying by 1000, giving 50 µm.', 'Checks that the real cell is smaller than its image.'],
    ['Multiplies 30 by 600 to find the real size.', 'Divides by 1000 to change mm into µm.', 'Gives the real width with a × sign, or with no unit.']),
]

export const lesson2b: ScienceLesson = {
  id: 'B-CELL-002B-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Magnification maths', prerequisites: ['B-MICROSCOPY'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [{ id: 'aqa-microscopy', title: 'AQA Trilogy Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.1 cell size and orders of magnitude; 4.1.1.5 magnification = size of image ÷ size of real object; MS 1a/1b/2h/3b/5c; WS 4.4' }],
  misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
