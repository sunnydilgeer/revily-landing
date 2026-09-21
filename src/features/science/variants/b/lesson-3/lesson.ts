// Variant B: independent lesson copy; shared rendering and assessment engine.
import type { ChoiceState, EvidenceDimension, ScienceLesson, TeachingState } from '../../../types'
import { practicalFrames } from './teachingFrames'

const base = { skillId: 'B-MICROSCOPE-PRACTICAL', specRefs: ['4.1.1.2', '4.1.1.5', '10.2.1'], sourceIds: ['aqa-practical', 'aqa-handbook', 'aqa-onion-example'] }
function teach(id: string, title: string): TeachingState {
  const frames = practicalFrames[id]
  const script = frames.map(f => `${f.label}. ${f.summary} ${f.text}`).join(' ')
  return { ...base, id, kind: 'teaching', phase: 'teach', title, body: script,
    media: { kind: 'videoScript', seconds: frames.length * 12, script, status: 'notRecorded' } }
}
function q(id: string, title: string, options: Array<[string, string]>, answerId: string, hint: string, steps: string[], dimension: EvidenceDimension = 'practicalReasoning', independent = false): ChoiceState {
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : id === 'B3-01' ? 'priorKnowledge' : 'guided',
    contextId: `practical-${id}`, dimensions: [dimension], evidenceRole: independent ? 'independent' : id === 'B3-01' ? 'diagnostic' : 'practice',
    options: options.map(([id, label]) => ({ id, label })), answerId, hint,
    explanation: { steps, answer: options.find(([id]) => id === answerId)![1] },
    ...(independent ? { exam: { marks: 1, ao: dimension === 'recall' ? 'AO1' : 'AO2', status: 'revilyDraft' } as const } : {}) }
}
export const practicalSections = [
  { id: 'B3-01', label: 'Start here', detail: 'A thin specimen' },
  { id: 'B3-02', label: 'Equipment and safety', detail: 'Prepare for supervised lab work' },
  { id: 'B3-04', label: 'Prepare an onion slide', detail: 'Water, tissue, stain and coverslip' },
  { id: 'B3-08', label: 'Use the microscope', detail: 'Find cells and focus safely' },
  { id: 'B3-12', label: 'Improve the view', detail: 'Blank images, blur, bubbles and folds' },
  { id: 'B3-14', label: 'Observe onion cells', detail: 'Record visible plant-cell features' },
  { id: 'B3-15', label: 'Observe animal cells', detail: 'A separate prepared slide' },
  { id: 'B3-16', label: 'Draw your observations', detail: 'Clear outlines and labels' },
  { id: 'B3-19', label: 'Measure and add a scale', detail: 'Real size and drawing magnification' },
  { id: 'B3-22', label: 'Try it yourself', detail: 'Independent practical reasoning' },
  { id: 'B3-30', label: 'Explain your method', detail: 'Final written task' },
]
export const lesson3: ScienceLesson = {
  id: 'B-CELL-003-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Microscopy practical: prepare, observe and draw', prerequisites: ['B-CELL-PARTS-FUNCTIONS', 'B-MICROSCOPY'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [
    { id: 'aqa-practical', title: 'AQA Trilogy practical assessment', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/practical-assessment', locator: '10.2.1 required practical 1; AT1/AT7; school risk assessment' },
    { id: 'aqa-handbook', title: 'AQA Combined Science practical handbook', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS-HB.PDF', locator: 'Microscopy student activity and focusing method; specification 4.1.1.2/4.1.1.5' },
    { id: 'aqa-onion-example', title: 'Historical AQA onion wet-mount example (draft)', url: 'https://filestore.aqa.org.uk/resources/science/AQA-8464-8465-PRACTICALS.PDF', locator: 'pp3–8; historical example only, current specification governs requirements' },
  ], misconceptions: [],
  states: [
    q('B3-01', 'Why should an onion specimen be very thin?', [['light', 'So light can pass through and cells can be distinguished'], ['grow', 'So the microscope makes the cells grow'], ['colour', 'So no stain can reach the cells']], 'light', 'A light microscope needs light to pass through the specimen.', ['Thin tissue lets light pass through.', 'In thick or overlapping tissue, cells lie on top of one another and block light, making individual cells harder to see.'], 'understanding'),
    teach('B3-02', 'Equipment and safety'),
    q('B3-03', 'A coverslip breaks on the bench. What should you do?', [['report', 'Tell the teacher and keep clear of the broken glass'], ['hand', 'Pick up the tiny shards with your fingers'], ['hide', 'Push it onto the floor']], 'report', 'Broken glass can cut you. Follow your teacher’s safety rules.', ['Broken glass can cut skin.', 'Report it and follow the teacher’s safe clean-up procedure; do not collect shards by hand.']),
    teach('B3-04', 'Prepare an onion-cell slide'),
    q('B3-05', 'Why add iodine stain to the onion specimen?', [['contrast', 'To make some cell structures easier to distinguish'], ['bigger', 'To increase the microscope’s magnification'], ['all', 'To guarantee that every sub-cellular structure is visible']], 'contrast', 'Contrast means how clearly a part stands out. Does stain change this, or make the image bigger?', ['Stain makes some parts stand out. This is increased contrast.', 'It does not change lens magnification or reveal everything.'], 'understanding'),
    q('B3-06', 'Why lower the coverslip slowly at an angle?', [['air', 'To reduce trapped air bubbles'], ['grow', 'To stretch the cells until they grow'], ['lens', 'To change the objective magnification']], 'air', 'Think about letting air escape from under the coverslip.', ['Touching one edge to the liquid and lowering gently lets air escape.', 'Trapped bubbles can cover parts of the view, making the cells harder to see.']),
    q('B3-07', 'Which preparation order is sensible?', [['order', 'Water → thin flat tissue → stain → gently lowered coverslip'], ['glass', 'Coverslip → thick onion chunk → water on top'], ['dry', 'Dry tissue → press hard with coverslip → remove all liquid']], 'order', 'The tissue belongs in the liquid beneath the coverslip.', ['Place thin tissue flat in water, then add stain as directed.', 'Lower the coverslip gently without pressing hard.']),
    teach('B3-08', 'Use the light microscope'),
    q('B3-09', 'Why begin with the lowest-power objective?', [['wide', 'It shows a larger area of the slide, making the specimen easier to find'], ['largest', 'It always gives the largest image'], ['stain', 'It adds stain to the sample']], 'wide', 'Think about finding the specimen before enlarging it.', ['Low power shows a larger area.', 'Find and centre cells before switching to higher magnification.']),
    q('B3-10', 'At low power, you bring the objective close to the slide. Where should you look?', [['side', 'From the side, watching the gap so the lens does not touch the slide'], ['eye', 'Only through the eyepiece while moving towards the glass'], ['away', 'Away from the microscope']], 'side', 'You need to see the gap directly.', ['Watch from the side when approaching the slide.', 'Never allow the objective to contact the glass.']),
    q('B3-11', 'You switch to a higher-power objective. Which control should sharpen the view?', [['fine', 'Fine adjustment, using small movements'], ['coarse', 'Large coarse-adjustment movements towards the slide'], ['clip', 'The slide clip as a focusing control']], 'fine', 'At high power the lens may be very close to the glass.', ['Fine adjustment makes small focusing changes.', 'Large coarse movements at high power risk contact with the slide.']),
    teach('B3-12', 'Troubleshoot the view'),
    q('B3-13', 'Cells are visible and roughly focused, but their edges are blurred. What should you try?', [['fine', 'Small fine-focus adjustments'], ['higher', 'Immediately increase magnification without adjusting focus'], ['press', 'Press the coverslip hard against the tissue']], 'fine', 'The specimen is found; now improve sharpness.', ['Fine adjustment sharpens a roughly focused image.', 'Enlargement alone does not correct poor focus.']),
    teach('B3-14', 'Observe the onion cells'),
    teach('B3-15', 'Observe prepared animal cells'),
    teach('B3-16', 'Draw your observations'),
    q('B3-17', 'Which drawing follows biological-drawing conventions more closely?', [['a', 'Drawing A'], ['b', 'Drawing B'], ['both', 'Both are equally clear scientific records']], 'a', 'Look at outlines, shading, titles and label lines.', ['A uses clean outlines and straight, uncrossed labels.', 'B uses heavy shading, sketchy lines and crossed labels.'], 'application'),
    q('B3-18', 'How should you add labels to a biological drawing?', [['straight', 'Use straight, uncrossed lines that reach the correct features'], ['cross', 'Cross the lines so all labels fit in one corner'], ['colour', 'Colour each cell and omit the labels']], 'straight', 'A reader must be able to follow each label to its feature.', ['Straight lines and clear labels make the drawing readable.', 'Avoid crossing lines, shading and colouring.'], 'understanding'),
    teach('B3-19', 'Measurement and scale'),
    { ...base, id: 'B3-20', kind: 'teaching', phase: 'guided', title: 'How much larger is the drawing?', body: 'Drawing length: 24 mm. Measured real length: 0.3 mm. How many times larger is the drawing?', steps: ['Both lengths are in mm, so the units match.', 'Drawing magnification = drawing length ÷ real length = 24 ÷ 0.3.', 'The drawing is 80 times longer: ×80. This compares drawing size with real size, not the microscope lenses.'] },
    q('B3-21', 'An eyepiece is ×10 and an objective is ×40. What microscope magnification should you record?', [['400', '×400'], ['50', '×50'], ['40', '×40']], '400', 'Multiply the two lens magnifications.', ['10 × 40 = 400.', 'Record observed microscope magnification as ×400; calculate any drawing magnification separately.'], 'calculation'),
    q('B3-22', 'A student cannot see the nucleus clearly. Why might a suitable stain help?', [['contrast', 'It increases contrast so some structures are easier to distinguish'], ['growth', 'It makes the real nucleus larger'], ['lens', 'It increases the lens magnification']], 'contrast', 'Recall the purpose of staining.', ['Stain makes some parts stand out from their surroundings.', 'It does not enlarge the specimen or alter the lenses.'], 'recall', true),
    q('B3-23', 'Several onion layers overlap on a slide. Which change would improve the specimen?', [['thin', 'Use a thin epidermal layer and spread it flat'], ['thick', 'Add more thick onion pieces'], ['dark', 'Turn off the light completely']], 'thin', 'Think about light passing through and separate cells.', ['A thin layer lets light pass through. Spreading it flat stops layers of cells overlapping, so individual cells are easier to see.'], 'practicalReasoning', true),
    q('B3-24', 'A student keeps trapping bubbles under the coverslip. Which method should they use next time?', [['angle', 'Touch one edge to the liquid and lower the coverslip gently at an angle'], ['drop', 'Drop the coverslip flat from above'], ['press', 'Press hard until the glass bends']], 'angle', 'Air needs an escape route.', ['An angled, gradual lowering reduces trapped air.', 'Pressing hard risks breaking glass.'], 'practicalReasoning', true),
    q('B3-25', 'You cannot locate the cells at high power. What is a sensible next step?', [['low', 'Return to the lowest-power objective and find and centre the specimen'], ['higher', 'Switch to an even higher-power objective'], ['stain', 'Add stain directly to the objective lens']], 'low', 'A wider view helps locate the specimen.', ['Low power shows more of the slide.', 'Find and centre cells, then increase magnification carefully.'], 'practicalReasoning', true),
    q('B3-26', 'Which focusing instruction protects the slide and objective?', [['safe', 'Watch from the side when approaching at low power; move away to find rough focus, then use fine focus'], ['contact', 'Move towards the slide through the eyepiece until the lens touches it'], ['high', 'At high power, make large coarse-focus movements towards the glass']], 'safe', 'Think about the direction of movement and the risk of contact.', ['Side viewing lets you monitor the lens–slide gap.', 'Increase the gap to find rough focus at low power; use small fine adjustments, especially at high power.'], 'practicalReasoning', true),
    q('B3-27', 'A stained onion view shows walls and some nuclei, but no chloroplasts. What should you draw?', [['visible', 'The visible outlines and nuclei, without inventing chloroplasts'], ['book', 'Every structure in a typical green plant-cell textbook diagram'], ['animal', 'An animal cell instead']], 'visible', 'Practical drawings record observations.', ['Draw and label only features you can distinguish.', 'Onion-bulb epidermal cells normally have no chloroplasts.'], 'application', true),
    q('B3-28', 'A drawn cell is 30 mm long. Its real length is 0.25 mm. What is the drawing magnification?', [['120', '×120'], ['7.5', '×7.5'], ['400', '×400 because that was the microscope magnification']], '120', 'Drawing magnification uses the two measured lengths.', ['Drawing magnification = 30 ÷ 0.25 = 120.', 'The answer is ×120, without a length unit.'], 'calculation', true),
    q('B3-29', 'The view is 1.5 mm wide. Five similar cells fit end to end across it. Estimate one cell’s length in µm.', [['300', '300 µm'], ['0.3', '0.3 µm'], ['7500', '7500 µm']], '300', 'Divide the field width by the number of cells, then convert mm to µm.', ['Estimated length = 1.5 ÷ 5 = 0.3 mm.', '0.3 × 1000 = 300 µm. This is an estimate based on similar cell lengths.'], 'dataInterpretation', true),
    { ...base, id: 'B3-30', kind: 'written', phase: 'transfer', title: 'Describe how to prepare a stained onion-cell slide and obtain a clear image safely.', contextId: 'practical-written-transfer', dimensions: ['explanation'], evidenceRole: 'independent', marking: 'teacherOnly',
      hint: 'Describe slide preparation, then the order of locating and focusing the specimen.', placeholder: 'First prepare the slide by… . Then use the microscope by… .', instruction: 'Write the steps in order: prepare the slide, find the cells, then focus safely.',
      explanation: { steps: ['Prepare thin, flat tissue in liquid and add stain.', 'Lower the coverslip gently at an angle.', 'Find the specimen at low power.', 'Focus safely, then sharpen with fine adjustment.'], answer: 'Put thin onion skin flat in water on a clean slide. Add iodine as directed. Lower a coverslip slowly at an angle. Clip the slide onto the stage. Start with the lowest-power objective. Watch from the side when bringing the lens close; do not touch the glass. Look through the eyepiece and slowly increase the gap to find rough focus. Use fine focus to sharpen the image.' },
      rubric: { marks: 4, points: ['One mark: thin onion epidermis spread flat in water on a clean slide, with iodine stain.', 'One mark: coverslip gently lowered at an angle to reduce bubbles.', 'One mark: secure slide and select the lowest-power objective to locate cells.', 'One mark: safe low-power coarse focusing (watch gap from side when approaching, increase gap while viewing) followed by fine adjustment.'], reject: ['Objective touches the slide.', 'Large coarse movements towards glass at high power.', 'Stain increases magnification.', 'Thick overlapping tissue or forcefully pressed coverslip.'] }, exam: { marks: 4, ao: 'AO1', status: 'revilyDraft' } },
  ], retrieval: [],
  requirements: {
    recall: { inSession: ['B3-22'], delayed: [] }, practicalReasoning: { inSession: ['B3-23', 'B3-24', 'B3-25', 'B3-26'], delayed: [] },
    application: { inSession: ['B3-27'], delayed: [] }, calculation: { inSession: ['B3-28'], delayed: [] },
    dataInterpretation: { inSession: ['B3-29'], delayed: [] }, explanation: { inSession: ['B3-30'], delayed: [] },
  },
}
