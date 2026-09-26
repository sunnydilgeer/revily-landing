// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route: see a cell bigger → how much bigger (magnification) → how much detail (resolution)
// → electrons for finer detail. A check follows each walkthrough. See STORYBOARD.md.
import type { ChoiceState, EvidenceDimension, ScienceLesson, ScienceState, TeachingState, WrittenState } from '../types'
import { sampledRequirements } from '../lessonAuthoring'
import { microscopyFrames } from './teachingFrames'

const base = { skillId: 'B-MICROSCOPY', specRefs: ['4.1.1.5'], sourceIds: ['aqa-microscopy'] }
function teach(id: string, title: string): TeachingState {
  const frames = microscopyFrames[id]
  const script = frames.map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ')
  return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script,
    media: { kind: 'videoScript', seconds: frames.length * 12, status: 'notRecorded', script } }
}
// Options are listed in display order; `correct` is the index of the right one.
function q(id: string, title: string, labels: string[], correct: number, hint: string, steps: string[], dimension: EvidenceDimension = 'understanding', independent = false): ChoiceState {
  const opening = id === 'B2-01'
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : opening ? 'priorKnowledge' : 'guided',
    contextId: `microscopy-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : opening ? 'diagnostic' : 'practice',
    options: labels.map((label, i) => ({ id: String(i), label })), answerId: String(correct), hint,
    explanation: { steps, answer: labels[correct] },
    ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : 'AO2', status: 'revilyDraft' } as const } : {}) }
}
function written(id: string, title: string, hint: string, answer: string, points: string[], reject: string[]): WrittenState {
  return { ...base, id, kind: 'written', phase: 'transfer', title, contextId: 'microscopy-written-transfer', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly',
    hint, placeholder: 'Greater resolution lets scientists see… so they can…', instruction: 'Explain what extra detail can be seen, and how that helps scientists understand cells. Your response is saved here for teacher review, not automatically marked.',
    explanation: { steps: points, answer }, rubric: { marks: points.length, points, reject }, exam: { marks: points.length, ao: 'AO1', status: 'revilyDraft' } }
}

export const microscopySections = [
  { id: 'B2-01', label: 'Start here', detail: 'How can we see tiny cells?' },
  { id: 'B2-02', label: 'Meet a light microscope', detail: 'The parts and the path of the light' },
  { id: 'B2-04', label: 'How much bigger?', detail: 'Magnification' },
  { id: 'B2-06', label: 'How much detail?', detail: 'Resolution' },
  { id: 'B2-08', label: 'Meet an electron microscope', detail: 'Finer detail inside cells' },
  { id: 'B2-28', label: 'On your own', detail: 'Choose, calculate and explain' },
]

const states: ScienceState[] = [
  // Start here (B2-01 shows the light microscope in LessonVisual).
  q('B2-01', 'In the last lesson you compared animal cells and bacteria. They are far too small to see with your eyes. How do scientists see them?',
    ['They grow the cells until they are big enough to see', 'They use a microscope, which makes a bigger picture of the cell', 'They draw the cells bigger from memory'], 1,
    'Does the cell change, or does the way we look at it change?', ['A microscope makes a bigger picture of a cell.', 'So scientists can see it, and the real cell does not change.'], 'recall'),

  // Meet a light microscope
  teach('B2-02', 'Meet a light microscope'),
  q('B2-35', 'Which path does light take through a light microscope?',
    ['Lamp → specimen → objective lens → eyepiece → eye', 'Eye → eyepiece → objective lens → specimen', 'Lamp → eyepiece → specimen → objective lens'], 0,
    'Where is the lamp, and which lens is nearest your eye?', ['The lamp is under the stage, so light passes up through the specimen first.', 'So it goes through the objective lens, then the eyepiece, then into your eye.']),
  q('B2-36', 'The picture of a cell looks blurred. What should you do?',
    ['Switch to a lens that makes the picture bigger', 'Take the slide off the stage', 'Turn the focusing controls until the picture is sharp'], 2,
    'Which part makes a picture sharp?', ['The focusing controls change the gap between the lens and the slide.', 'So turning them makes the picture sharp. A bigger blurred picture is still blurred.']),

  // How much bigger?
  teach('B2-04', 'How much bigger?'),
  q('B2-03', 'An eyepiece is ×10 and an objective lens is ×10. What is the total magnification?', ['×20', '×10', '×100'], 2,
    'Do you add or multiply the two lenses?', ['Total magnification = eyepiece × objective.', 'So 10 × 10 = 100, and the total magnification is ×100.'], 'calculation'),
  q('B2-05', 'The image of a cell is magnified ×400. What happens to the real cell?', ['It becomes 400 times bigger', 'It stays the same size', 'It gains extra parts'], 1,
    'Which gets bigger: the image or the cell?', ['Magnification makes the image bigger.', 'So the real cell stays the same size, with the same parts.']),

  // How much detail?
  teach('B2-06', 'How much detail?'),
  q('B2-07', 'Two close parts of a cell look like one blurred patch. What is too low?', ['The resolution', 'The magnification', 'The size of the real cell'], 0,
    'Which word means seeing two close points as separate?', ['Resolution is how well you can see two close points as separate.', 'So if two parts merge into one patch, the resolution is too low.']),
  q('B2-10', 'A student makes a blurred photo of a cell bigger on a computer. What happens?', ['The blurred patch splits into separate parts', 'The picture gets bigger, but no new detail appears', 'The real cell gets bigger'], 1,
    'Is a bigger blur clearer?', ['Making an image bigger increases magnification, not resolution.', 'So the picture gets bigger, but it is still a blur.']),

  // Meet an electron microscope
  teach('B2-08', 'Meet an electron microscope'),
  q('B2-27', 'Compared with a light microscope, an electron microscope has…', ['higher magnification but lower resolution', 'the same magnification, but it uses electrons', 'higher magnification and higher resolution'], 2,
    'Think about size and detail. Which is better for each?', ['An electron microscope magnifies more and has greater resolving power.', 'So it has both higher magnification and higher resolution.'], 'recall'),
  q('B2-11', 'How did electron microscopes help scientists understand cells?', ['They showed sub-cellular structures in fine detail', 'They made new structures inside cells', 'They made cells big enough to see by eye'], 0,
    'Did the microscope change the cell, or show more of it?', ['Electron microscopes showed sub-cellular structures in fine detail.', 'So scientists could study those parts. The parts were already there.']),

  // On your own
  q('B2-28', 'A light microscope shows two close parts of a cell as one blur. How could a scientist see them as two separate parts?',
    ['Print the blurred image much bigger', 'Use an electron microscope, which has greater resolving power', 'Turn the focusing controls to make the image bigger'], 1,
    'The problem is missing detail, not size.', ['An electron microscope has greater resolving power, so it can separate closer points.', 'So the two parts would show separately. Enlarging the blur adds no detail.'], 'application', true),
  q('B2-37', 'A microscope has a ×10 eyepiece and a ×40 objective lens. What is the total magnification?', ['×50', '×4', '×400'], 2,
    'Total magnification = eyepiece × objective.', ['Total magnification = eyepiece × objective.', 'So 10 × 40 = 400, and the total magnification is ×400.'], 'calculation', true),
  q('B2-38', 'Sam says: “If I use a high enough magnification on a light microscope, I will see ribosomes clearly.” What is wrong?',
    ['Nothing; enough magnification always shows more detail', 'Ribosomes are bigger than whole cells', 'Light microscopes cannot magnify at all', 'Magnification alone adds no detail; ribosomes need the higher resolution of an electron microscope'], 3,
    'Is seeing tiny parts about size or about detail?', ['A bigger image does not separate close points; that needs higher resolution.', 'So tiny parts such as ribosomes need an electron microscope.'], 'understanding', true),
  written('B2-34', 'Explain how the higher resolution of electron microscopes helped scientists understand cells.',
    'First say what extra detail scientists could see. Then say how that helped them.',
    'Electron microscopes have higher resolution, so they show small, close parts of a cell as separate. Scientists could see sub-cellular structures in fine detail. So they could study these parts and learn more about how cells are built.',
    ['Higher resolution shows smaller or closer structures separately, so finer detail is seen.', 'This extra detail let scientists study sub-cellular structures and understand cells better.'],
    ['Magnification and resolution are said to mean the same thing.', 'The microscope is said to create new cell structures.', 'Enlarging an existing blur is said to reveal new detail.']),
]

export const lesson2: ScienceLesson = {
  id: 'B-CELL-002-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Light and electron microscopes', prerequisites: ['B-CELL-PARTS-FUNCTIONS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [{ id: 'aqa-microscopy', title: 'AQA Trilogy Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.1.1.5 Microscopy: light and electron microscopes, magnification and resolution; WS 1.1' }],
  misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
