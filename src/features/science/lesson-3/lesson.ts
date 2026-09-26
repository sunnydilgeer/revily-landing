// Variant B: independent lesson copy; shared rendering and assessment engine.
// One route through required practical 1: get ready safely → prepare an onion slide → use the
// microscope → look and draw → add a scale, with a check after each step. See STORYBOARD.md.
import type { ChoiceState, EvidenceDimension, ScienceLesson, ScienceState, TeachingState, WrittenState } from '../types'
import { sampledRequirements } from '../lessonAuthoring'
import { practicalFrames } from './teachingFrames'

const base = { skillId: 'B-MICROSCOPE-PRACTICAL', specRefs: ['4.1.1.2', '4.1.1.5', '10.2.1'], sourceIds: ['aqa-practical', 'aqa-handbook', 'aqa-onion-example'] }
function teach(id: string, title: string): TeachingState {
  const frames = practicalFrames[id]
  const script = frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' ')
  return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script,
    media: { kind: 'videoScript', seconds: frames.length * 12, script, status: 'notRecorded' } }
}
function worked(id: string, title: string, body: string, steps: string[]): TeachingState {
  return { ...base, id, kind: 'teaching', phase: 'model', title, body, steps }
}
function q(id: string, title: string, options: Array<[string, string]>, answerId: string, hint: string, steps: string[], dimension: EvidenceDimension = 'practicalReasoning', independent = false): ChoiceState {
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : id === 'B3-01' ? 'priorKnowledge' : 'guided',
    contextId: `practical-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : id === 'B3-01' ? 'diagnostic' : 'practice',
    options: options.map(([id, label]) => ({ id, label })), answerId, hint,
    explanation: { steps, answer: options.find(([id]) => id === answerId)![1] },
    ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : dimension === 'dataInterpretation' ? 'AO3' : 'AO2', status: 'revilyDraft' } as const } : {}) }
}
function written(id: string, title: string, hint: string, answer: string, points: string[], reject: string[]): WrittenState {
  return { ...base, id, kind: 'written', phase: 'transfer', title, contextId: 'practical-written-transfer', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly',
    hint, placeholder: 'First I would prepare the slide by… Then I would… ', instruction: 'Write the steps in order: prepare the slide, look at it safely, draw it, then add a scale. Your response is saved here for teacher review, not automatically marked.',
    explanation: { steps: points, answer }, rubric: { marks: points.length, points, reject }, exam: { marks: points.length, ao: 'AO1', status: 'revilyDraft' } }
}

export const practicalSections = [
  { id: 'B3-01', label: 'Start here', detail: 'Which sample works best?' },
  { id: 'B3-02', label: 'Get ready safely', detail: 'Equipment, eye protection and glass' },
  { id: 'B3-04', label: 'Prepare an onion slide', detail: 'Water, thin skin, stain and coverslip' },
  { id: 'B3-08', label: 'Use the microscope', detail: 'Find the cells and focus safely' },
  { id: 'B3-12', label: 'Look and draw', detail: 'Onion cells, animal cells and clear drawings' },
  { id: 'B3-15', label: 'Add a scale', detail: 'Magnification and scale bars' },
  { id: 'B3-18', label: 'On your own', detail: 'The whole practical' },
]

const states: ScienceState[] = [
  // Start here (B3-01 shows the illustrated onion view in LessonVisual).
  q('B3-01', 'In Lesson 2 you saw that a light microscope shines light up through the sample. Which onion sample would give the clearest view of single cells?', [['chunk', 'A thick chunk of onion'], ['thin', 'A very thin layer of onion skin'], ['slice', 'A whole slice with many layers']], 'thin', 'Light has to get through the sample to reach your eye. Which sample lets it through?', ['A light microscope needs light to pass through the sample.', 'So a very thin layer works best: light gets through, and single cells can be seen.'], 'understanding'),

  // Get ready safely
  teach('B3-02', 'Get ready safely'),
  q('B3-03', 'A coverslip breaks on the bench. What should you do?', [['report', 'Tell your teacher and keep clear of the glass'], ['hand', 'Pick up the pieces with your fingers'], ['hide', 'Brush it onto the floor']], 'report', 'What did the safety screen say about broken glass?', ['Broken glass can cut your skin.', 'So tell your teacher and keep clear; never pick it up by hand.']),

  // Prepare an onion slide
  teach('B3-04', 'Prepare an onion slide'),
  q('B3-05', 'Why add iodine stain to the onion skin?', [['bigger', 'To make the cells bigger'], ['all', 'To make every part of the cell show up'], ['contrast', 'To make some parts, such as the nucleus, stand out']], 'contrast', 'Does a stain change the size, or how clearly parts stand out?', ['Iodine colours some parts more than others. This increases the contrast.', 'So those parts stand out, but nothing gets bigger.'], 'understanding'),
  q('B3-06', 'Why lower the coverslip at an angle, one edge first?', [['press', 'To press the cells flatter'], ['air', 'To let air escape, so fewer bubbles form'], ['lens', 'To increase the magnification']], 'air', 'What could get trapped under the glass?', ['Lowering one edge first pushes air out from under the coverslip.', 'So fewer bubbles form to hide the cells.']),
  q('B3-07', 'Which order makes a good onion slide?', [['glass', 'Coverslip, then a thick piece of onion, then water on top'], ['dry', 'Dry onion skin, then press the coverslip down hard'], ['order', 'Water, thin flat skin, iodine, then the coverslip lowered at an angle']], 'order', 'What goes on the slide first, and what goes on last?', ['The thin skin lies flat in water, and the stain is added to it.', 'So the coverslip goes on last, lowered gently at an angle.']),

  // Use the microscope
  teach('B3-08', 'Use the microscope'),
  q('B3-09', 'At low power, you bring the objective down close to the slide. Where should you look?', [['side', 'From the side, at the gap between the lens and the slide'], ['eye', 'Through the eyepiece'], ['light', 'At the light under the stage']], 'side', 'How can you see the gap getting smaller?', ['From the side, you can see the gap between the lens and the slide.', 'So you can stop before the lens touches the glass.']),
  q('B3-10', 'You can see the cells, but their edges are blurred. What should you do?', [['higher', 'Switch to a higher-power objective'], ['press', 'Press down on the coverslip'], ['fine', 'Turn the fine focus a little']], 'fine', 'Which knob makes small changes?', ['The fine focus makes tiny movements that sharpen the view.', 'So use it. A bigger image of a blurred view is still blurred.']),
  q('B3-11', 'You switch to high power and lose the cells. What is the best next step?', [['coarse', 'Turn the coarse focus a long way towards the slide'], ['low', 'Go back to low power, find the cells and centre them'], ['stain', 'Add more iodine to the slide']], 'low', 'Which objective shows the widest view?', ['Low power shows a wider area, so cells are easier to find.', 'So find and centre them there, then switch to high power again.']),

  // Look and draw
  teach('B3-12', 'Look and draw'),
  q('B3-13', 'Your onion view shows cell walls and nuclei, but no chloroplasts. What should you draw?', [['visible', 'Only the walls and nuclei you can see'], ['book', 'Chloroplasts too, because plant cells in books have them'], ['animal', 'An animal cell instead']], 'visible', 'Does a practical drawing show your own view, or a textbook cell?', ['Onion-bulb skin cells normally have no chloroplasts.', 'So draw only the parts you can actually see.'], 'application'),
  q('B3-14', 'You draw a cell from the prepared animal-cell slide. Which label should NOT be on your drawing?', [['nucleus', 'Nucleus'], ['cytoplasm', 'Cytoplasm'], ['wall', 'Cell wall']], 'wall', 'Which part do animal cells not have?', ['Animal cells have no cell wall.', 'So a cell wall label would record something that is not there.'], 'understanding'),

  // Add a scale
  teach('B3-15', 'Add a scale'),
  worked('B3-16', 'How much bigger is the drawing?', 'Your drawing of one onion cell is 24 mm long. You estimated its real length as 0.3 mm. What is the drawing magnification?', ['Write the rule: drawing magnification = drawing length ÷ real length.', 'Check the units: both lengths are in mm, so they match.', 'Put in the numbers: 24 ÷ 0.3 = 80.', 'Write the answer: ×80. It has no unit, and it is not the same as the microscope magnification.']),
  q('B3-17', 'Look at the two drawings of onion cells. Which is the better scientific record?', [['a', 'Drawing A'], ['b', 'Drawing B'], ['both', 'Both are equally good records']], 'a', 'Check each drawing for clean lines, straight labels, a title and a scale.', ['Drawing A has single outlines, straight labels, a title, the magnification and a scale bar.', 'Drawing B has shading, crossed label lines and no size information, so A is the better record.'], 'application'),

  // On your own
  q('B3-18', 'A student draws an onion cell 30 mm long. They estimated its real length as 0.25 mm. What is the drawing magnification?', [['7.5', '×7.5'], ['400', '×400, because that was the microscope magnification'], ['120', '×120']], '120', 'Use drawing magnification = drawing length ÷ real length.', ['Drawing magnification = drawing length ÷ real length = 30 ÷ 0.25.', 'So the drawing magnification is ×120. It is not the microscope magnification.'], 'calculation', true),
  q('B3-19', 'Jo’s plan says: “At high power, look through the eyepiece and turn the coarse focus to bring the lens down towards the slide.” What is wrong?', [['nothing', 'Nothing; this is the quickest way to focus'], ['hit', 'The lens could hit the slide; at high power, use small fine-focus movements'], ['light', 'Jo should switch off the light first'], ['stain', 'Jo should add more iodine first']], 'hit', 'At high power, how close is the lens to the glass?', ['At high power the lens is very close to the slide, and coarse focus moves it a long way.', 'So the lens could hit the slide. Use only small fine-focus movements at high power.'], 'practicalReasoning', true),
  written('B3-20', 'Describe how to prepare an onion-cell slide, look at it safely with a light microscope, and make a scaled drawing.',
    'Go in order: prepare the slide, focus from low to high power, draw what you see, then add a scale.',
    'Put one drop of water on a clean slide. Lay a thin layer of onion skin flat in it and add iodine stain. Lower a coverslip at an angle, one edge first, so fewer bubbles form. Clip the slide onto the stage and start with the lowest-power objective. Watch from the side as the lens comes close to the slide, then look through the eyepiece and move the lens away to focus. Use fine focus to sharpen the view, and only fine focus at high power. Draw only what you can see, using a sharp pencil, clean single lines and straight, uncrossed label lines. Add a title, the microscope magnification and a scale bar, or work out the drawing magnification as drawing length ÷ real length.',
    [
      'Thin onion skin spread flat in a drop of water on a clean slide, with iodine stain added.',
      'Coverslip lowered at an angle, one edge first, to reduce bubbles.',
      'Starts on the lowest-power objective; watches from the side as the lens approaches, then moves the lens away while looking through the eyepiece.',
      'Uses fine focus to sharpen the view, and only fine focus at high power.',
      'Draws only visible structures with clean single lines and straight, uncrossed labels, then adds a title, the magnification and a scale bar or drawing magnification.',
    ],
    ['The lens is moved towards the slide while looking through the eyepiece, or touches the slide.', 'Stain is said to make the cells bigger.', 'Chloroplasts are drawn in onion skin cells because a textbook shows them.', 'Shading, colouring or crossed label lines.', 'Drawing magnification is said to be the same as the microscope magnification.']),
]

export const lesson3: ScienceLesson = {
  id: 'B-CELL-003-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Microscopy practical: prepare, observe and draw', prerequisites: ['B-CELL-PARTS-FUNCTIONS', 'B-MICROSCOPY'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [
    { id: 'aqa-practical', title: 'AQA Trilogy practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.1 required practical 1; AT1/AT7; school risk assessment' },
    { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Microscopy student activity and focusing method; specification 4.1.1.2/4.1.1.5' },
    { id: 'aqa-onion-example', title: 'Historical AQA onion wet-mount example (draft)', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS.PDF', locator: 'pp3–8; historical example only, current specification governs requirements' },
  ], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
