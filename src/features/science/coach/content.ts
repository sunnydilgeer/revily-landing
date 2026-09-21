import type { LessonNumber } from '../lessonNavigation'

export interface CoachQuestion { id: string; prompt: string; options: string[]; answer: number; explanation: string }
export interface CoachTopic {
  id: string; lesson: LessonNumber; goal: string; teachingIds: string[]; assessmentIds: string[]
  reminder: string; questions: CoachQuestion[]
}
type QuestionDraft = [string, string[], number, string]
function topic(id: string, lesson: LessonNumber, goal: string, teachingIds: string[], assessmentIds: string[], reminder: string, drafts: QuestionDraft[]): CoachTopic {
  return { id, lesson, goal, teachingIds, assessmentIds, reminder,
    questions: drafts.map(([prompt, options, answer, explanation], index) => ({ id: `${id}-${index}`, prompt, options, answer, explanation })) }
}

// Original starter questions, not copied exam questions. Index 1 is reserved for supported repair;
// indices 0 and 2 provide different review contexts. This is a sample, not full specification coverage.
export const coachTopics: CoachTopic[] = [
  topic('cell-parts', 1, 'I can link animal-cell parts to their jobs.', ['B1-02', 'B1-05'], ['B1-04', 'B1-06', 'B1-08'],
    'The membrane controls what enters and leaves. Ribosomes make proteins. Most aerobic respiration happens in mitochondria, releasing energy.', [
      ['Which cell part makes proteins?', ['Mitochondria', 'Ribosomes', 'Cell membrane'], 1, 'Ribosomes are where proteins are made.'],
      ['A cell needs to control which substances enter. Which part does this?', ['Cell membrane', 'Ribosomes', 'Nucleus'], 0, 'The membrane controls movement into and out of the cell.'],
      ['A cell uses energy to move. Where does most aerobic respiration happen?', ['Ribosomes', 'Cell membrane', 'Mitochondria'], 2, 'Aerobic respiration in mitochondria releases energy that the cell can use.'],
    ]),
  topic('cell-types', 1, 'I can tell plant and bacterial cells apart.', ['B1-24', 'B1-27'], ['B1-28', 'B1-36'],
    'Plant cells have a nucleus. Bacterial cells do not: their DNA is in the cytoplasm. Both have a membrane and cytoplasm.', [
      ['Which statement about a bacterial cell is correct?', ['Its DNA is inside a nucleus', 'It has no DNA', 'Its DNA is in the cytoplasm, not a nucleus'], 2, 'Bacterial cells have DNA but no nucleus.'],
      ['Which part is found in a plant cell but not a bacterial cell?', ['Cytoplasm', 'Nucleus', 'Cell membrane'], 1, 'A plant cell has a nucleus. A bacterial cell does not.'],
      ['Two cells both have cytoplasm and a membrane. Only one has a nucleus. Which could be bacterial?', ['The cell without a nucleus', 'Only the cell with a nucleus', 'Neither, because bacteria have no cytoplasm'], 0, 'Bacteria have cytoplasm and a membrane, but no nucleus.'],
    ]),
  topic('resolution', 2, 'I can explain bigger images and clearer detail.', ['B2-04', 'B2-06'], ['B2-05', 'B2-07', 'B2-10', 'B2-25', 'B2-26'],
    'Magnification makes an image bigger. Resolution is the ability to see two close points separately. A bigger blur is still a blur.', [
      ['Two close cell parts look like one patch. What needs to improve?', ['Resolution', 'The real cell’s size', 'The number of labels'], 0, 'Better resolution lets you distinguish two close parts.'],
      ['You enlarge a blurry photo without adding detail. What increases?', ['Resolution only', 'The real cell’s size', 'Magnification, not resolution'], 2, 'The image gets bigger, but it still has the same missing detail.'],
      ['A microscope shows two close dots separately. Which ability does this demonstrate?', ['Making the cell grow', 'Resolution', 'Protein synthesis'], 1, 'Resolution is about separating close points, not just enlarging an image.'],
    ]),
  topic('magnification', 2, 'I can calculate magnification with matching units.', ['B2-12', 'B2-15'], ['B2-14', 'B2-17', 'B2-29', 'B2-30'],
    'Magnification = image size ÷ real size. Match the units first: 1 mm = 1000 µm. Magnification has no length unit.', [
      ['An image is 6 mm wide. The real cell is 0.02 mm wide. What is the magnification?', ['×120', '×300', '×0.0033'], 1, '6 ÷ 0.02 = 300. Both sizes are in mm, so the answer is ×300.'],
      ['An image is 8 mm wide. The real cell is 40 µm wide. What is the magnification?', ['×200', '×0.2', '×320'], 0, '40 µm = 0.04 mm. Then 8 ÷ 0.04 = 200, so ×200.'],
      ['An image is 10 mm wide. The real cell is 20 µm wide. What is the magnification?', ['×0.5', '×200', '×500'], 2, '20 µm = 0.02 mm. Then 10 ÷ 0.02 = 500, so ×500.'],
    ]),
  topic('slide', 3, 'I can explain careful slide preparation.', ['B3-04'], ['B3-05', 'B3-06', 'B3-07'],
    'In a teacher-supervised microscopy practical, a thin specimen lets light pass through. Lowering the coverslip at an angle helps avoid trapped air.', [
      ['Why use a thin specimen on a light-microscope slide?', ['To make the cells multiply', 'To stop all light', 'To let light pass through'], 2, 'Light needs to pass through the specimen to form a useful view.'],
      ['During a supervised practical, why lower the coverslip at an angle?', ['To make cells bigger', 'To reduce trapped air bubbles', 'To change the DNA'], 1, 'Angled lowering helps push air out rather than trap it beneath the coverslip.'],
      ['A specimen is too thick to see clearly using transmitted light. Why could a thinner specimen help?', ['More light can pass through it', 'It will grow a nucleus', 'It removes the need for lenses'], 0, 'A thinner specimen allows light through more easily.'],
    ]),
  topic('drawing', 3, 'I can choose a useful scientific drawing.', ['B3-16'], ['B3-17', 'B3-18'],
    'Draw what you actually observe. Use clear, single outlines and straight label lines. Do not add parts just because a textbook shows them.', [
      ['A nucleus is not visible in your microscope view. What should your observation drawing show?', ['An invented nucleus', 'Only the structures you can actually see', 'Every textbook structure'], 1, 'An observation drawing records evidence from your view, not an ideal textbook cell.'],
      ['Which drawing style is best for recording cell outlines?', ['Heavy shading everywhere', 'Several sketchy overlapping lines', 'Clear single outlines'], 2, 'Clear single lines make the observed boundaries easier to read.'],
      ['Why use straight label lines that do not cross?', ['They make it clear which structure each label identifies', 'They increase microscope resolution', 'They prove every cell is identical'], 0, 'Clear label lines connect each name to the intended structure.'],
    ]),
  topic('root-area', 4, 'I can explain how a root hair helps absorption.', ['B4-08'], ['B4-09', 'B4-22'],
    'A root hair is a long extension. It increases surface area, giving more surface through which water and mineral ions can enter.', [
      ['How does a root hair’s long extension help the plant?', ['It carries nerve signals', 'It makes the root swim', 'It increases surface area for absorption'], 2, 'The extension gives more surface for substances to enter from the soil.'],
      ['Which explanation links the root hair’s shape to its job?', ['Long extension → more surface → more area for uptake', 'Long extension → no membrane → no uptake', 'Long extension → photosynthesis underground'], 0, 'A large surface area provides more area for water and mineral-ion uptake.'],
      ['Two root cells have the same volume. One has a longer hair-like extension. What advantage could it have?', ['No need for water', 'More surface area for absorption', 'It can carry electrical impulses'], 1, 'The extension increases surface relative to volume, helping absorption.'],
    ]),
  topic('differentiation', 4, 'I can explain how a cell becomes specialised.', ['B4-14', 'B4-16'], ['B4-17', 'B4-18', 'B4-21'],
    'Differentiation is when a cell develops structures for a particular job. Most animal cell types differentiate early; many plant cells can differentiate throughout life.', [
      ['A cell develops structures suited to carrying signals. What is this process called?', ['Diffusion', 'Differentiation', 'Osmosis'], 1, 'Differentiation makes a cell specialised for a particular function.'],
      ['Which example shows differentiation?', ['A cell only gets warmer', 'A cell only gets larger', 'A cell develops structures for a particular job'], 2, 'A specialised job and suitable structures are the important change.'],
      ['Why can a growing plant keep producing different types of cell?', ['Many plant cells can still differentiate', 'Plants do not have specialised cells', 'Every adult animal cell can do the same'], 0, 'Many plant cells retain the ability to differentiate throughout life.'],
    ]),
  topic('mitosis', 5, 'I can explain why new body cells get a full chromosome set.', ['B5-05', 'B5-07', 'B5-09'], ['B5-06', 'B5-08', 'B5-10', 'B5-24', 'B5-25'],
    'The cell copies its DNA before mitosis. The chromosome copies separate into two complete sets. After the cell divides, each daughter has the original chromosome number.', [
      ['A model body cell has 6 chromosomes before DNA copying. After mitosis and cell division, how many does each daughter have?', ['3', '12', '6'], 2, 'Each daughter receives a complete set, so each has 6 chromosomes.'],
      ['Why must DNA be copied before the cell divides?', ['So each new cell can receive a complete set', 'So neither new cell has DNA', 'So the membrane becomes DNA'], 0, 'Copying provides genetic information for both daughter cells.'],
      ['A model cell with 10 chromosomes completes mitosis and cell division. Which result is expected?', ['Two cells with 5 chromosomes each', 'Two cells with 10 chromosomes each', 'One cell with no chromosomes'], 1, 'Each daughter keeps the starting chromosome number: 10.'],
    ]),
  topic('stem-cells', 5, 'I can compare stem-cell sources.', ['B5-14', 'B5-16', 'B5-18'], ['B5-15', 'B5-17', 'B5-19', 'B5-27'],
    'Stem cells are not yet specialised. Embryonic stem cells can become most human cell types. Adult bone-marrow stem cells have a more limited range. Plant meristems contain stem cells.', [
      ['Which source contains plant stem cells?', ['Bone marrow', 'Meristem tissue', 'A mature human nerve'], 1, 'Meristems are plant growth regions containing stem cells.'],
      ['Compared with adult bone-marrow stem cells, embryonic stem cells can generally become…', ['A wider range of human cell types', 'Only plant cells', 'No specialised cells'], 0, 'Embryonic stem cells can differentiate into more types of human cell.'],
      ['A stem cell becomes a specialised blood cell. What has happened?', ['It has lost all DNA', 'It has become a plant meristem', 'It has differentiated'], 2, 'Differentiation is the change into a specialised cell type.'],
    ]),
  topic('diffusion', 6, 'I can predict the overall direction of diffusion.', ['B6-02'], ['B6-03', 'B6-07', 'B6-35'],
    'Particles move randomly both ways. Diffusion is their net movement from higher to lower concentration. Net means the overall movement.', [
      ['Oxygen concentration is higher outside a cell than inside. Which way does oxygen move overall by diffusion?', ['Into the cell', 'Out of the cell', 'All particles stop'], 0, 'Net diffusion goes from higher concentration outside to lower concentration inside.'],
      ['The left side has more particles per equal volume. What is the net diffusion direction?', ['Right to left', 'Left to right', 'Only water can move'], 1, 'The net movement goes from higher concentration on the left to lower on the right.'],
      ['Carbon dioxide concentration is higher inside a cell than outside. Which prediction follows?', ['Net movement into the cell', 'Diffusion needs energy from respiration', 'Net movement out of the cell'], 2, 'Carbon dioxide diffuses overall from the higher concentration inside to the lower concentration outside.'],
    ]),
  topic('osmosis', 6, 'I can explain water movement by osmosis.', ['B6-08', 'B6-11'], ['B6-09', 'B6-10', 'B6-12', 'B6-36'],
    'Osmosis moves water across a partially permeable membrane. Water moves overall from a more dilute solution to a more concentrated solution.', [
      ['Plant cells are placed in a solution more concentrated than their contents. What happens overall?', ['Sugar leaves by osmosis', 'Water leaves the cells by osmosis', 'Water must enter the cells'], 1, 'Water moves from the more dilute cell contents to the more concentrated outside solution.'],
      ['Which substance moves in osmosis?', ['Water', 'Only mineral ions', 'Chromosomes'], 0, 'Osmosis is the movement of water across a partially permeable membrane.'],
      ['A plant cell’s contents are more concentrated than the solution outside. Which way does water move overall?', ['Out of the cell', 'Neither way: all molecules stop', 'Into the cell'], 2, 'The outside is more dilute, so water moves overall into the more concentrated cell contents.'],
    ]),
  topic('active-transport', 6, 'I can explain why root cells need active transport.', ['B6-13', 'B6-15'], ['B6-14', 'B6-16', 'B6-17', 'B6-37'],
    'Active transport moves substances from lower to higher concentration, against the concentration gradient. It uses energy released by respiration. Mineral ions are not water, so their uptake is not osmosis.', [
      ['Mineral-ion concentration is lower in soil than in a root hair. Which process can bring more ions into the cell?', ['Osmosis', 'Diffusion down the gradient', 'Active transport'], 2, 'The ions move lower to higher concentration. This requires active transport.'],
      ['What supplies energy for active transport in a root hair cell?', ['Respiration', 'The cell wall creating energy', 'Osmosis of mineral ions'], 0, 'Respiration releases energy used for active transport.'],
      ['A cell takes up a dissolved substance from a lower concentration into a higher one. Which explanation fits?', ['Diffusion works against the gradient without energy', 'Active transport uses energy from respiration', 'All dissolved substances move by osmosis'], 1, 'Lower to higher is against the gradient, so active transport requires energy.'],
    ]),
  topic('fair-test', 6, 'I can choose controls for an osmosis investigation.', ['B6-25'], ['B6-26', 'B6-27', 'B6-41'],
    'To compare solution concentrations, keep other relevant conditions the same, such as time, temperature and tissue dimensions. Blot surface liquid consistently before weighing. Do practical work with your teacher.', [
      ['A class tests how solution concentration affects potato mass. Which condition should stay the same?', ['Solution concentration', 'Soaking time', 'The measured mass change'], 1, 'Concentration is deliberately changed. Equal soaking time makes the comparison fairer.'],
      ['Why gently blot each sample before its final weighing?', ['To remove surface liquid that would add extra mass', 'To remove every water molecule inside the cells', 'To change the concentration being tested'], 0, 'Surface droplets affect the balance reading without being part of the tissue’s water uptake.'],
      ['One sample soaks for 15 minutes and another for 90 minutes. Why is the concentration comparison unfair?', ['Time never affects results', 'Every result must be identical', 'Different times could also cause different mass changes'], 2, 'You could not tell whether concentration or time caused the difference. Keep time the same.'],
    ]),
]
