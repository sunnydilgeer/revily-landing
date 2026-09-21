export const specificationUrl = 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content'
export const sourceReview = {
  status: 'pendingVerification' as const,
  paper: 'June 2023 · Biology Paper 1 · Foundation · 8464/B/1F',
  paperUrl: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-QP-JUN23.PDF',
  schemeUrl: 'https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/2023/june/AQA-8464B1F-MS-JUN23.PDF',
  policyUrl: 'https://www.aqa.org.uk/about-us/who-we-are/our-standards/copyright-and-intellectual-property-policy/copyright-policy-for-centres',
  note: 'Existing research notes mention 01.2–01.4. The exact question/mark-scheme matches and source availability have not been reverified. These references do not certify the original practice below.',
}
export const cardGroups = ['Animal cells', 'Plant cells', 'Bacterial cells', 'Cell types', 'Cell sizes and maths', 'Models and observations'] as const
export type CardGroup = typeof cardGroups[number]
export interface RevisionCard { id: string; group: CardGroup; question: string; answer: string; easy: string; slip: string; spec: string[]; visual?: 'animal' | 'plant' | 'bacterium' | 'area' }
function card(id: string, group: CardGroup, question: string, answer: string, easy: string, slip: string, spec: string[], visual?: RevisionCard['visual']): RevisionCard {
  return { id, group, question, answer, easy, slip, spec, visual }
}
const structures = ['4.1.1.2'], bacteria = ['4.1.1.1', '4.1.1.2']
// Original concise wording based on established Lesson 1 content and its specification mapping.
// No official exam text, mark scheme text or CGP illustrations are reproduced.
export const revisionCards: RevisionCard[] = [
  card('cell', 'Animal cells', 'What is a cell?', 'The basic living unit that organisms are made of.', 'Your body contains many cells. Each cell is a tiny living unit, not a whole organ.', 'A cell is not the same as an organ such as the heart.', ['4.1'], 'animal'),
  card('nucleus', 'Animal cells', 'What does the nucleus do?', 'Contains genetic material (DNA) and controls cell activities.', 'DNA carries instructions for how the cell works.', 'The nucleus does not control entry and exit; the membrane does.', structures),
  card('cytoplasm', 'Animal cells', 'What happens in the cytoplasm?', 'Most of the cell’s chemical reactions take place here.', 'Cytoplasm is the jelly-like material inside the cell. Reactions change substances into other substances.', 'Do not mix up cytoplasm with the permanent vacuole.', structures),
  card('membrane', 'Animal cells', 'What does the cell membrane do?', 'Controls movement of substances into and out of the cell.', 'Useful substances enter and waste substances leave across this boundary.', 'A plant cell wall gives support; it is not the membrane.', structures),
  card('mitochondria', 'Animal cells', 'What is the function of mitochondria?', 'The site of aerobic respiration, which releases energy for cell processes.', 'Cells need energy to do their work. Aerobic respiration releases that energy; much of it happens in mitochondria.', 'Say “releases energy”, not “creates energy”.', structures),
  card('ribosomes', 'Animal cells', 'What do ribosomes do?', 'Protein synthesis: they make proteins.', 'Synthesis means making. Cells need proteins for their structures and jobs.', 'Ribosomes make proteins; mitochondria are used for aerobic respiration.', structures),
  card('animal-parts', 'Animal cells', 'Name five structures in a typical animal cell.', 'Nucleus, cytoplasm, cell membrane, mitochondria and ribosomes.', 'Learn each name with its job. Typical plant cells have these structures too.', 'Animal cells do not have a cell wall or chloroplasts. Some specialised animal cells differ.', structures, 'animal'),
  card('plant-shared', 'Plant cells', 'Which structures do typical plant and animal cells share?', 'Nucleus, cytoplasm, cell membrane, mitochondria and ribosomes.', 'Plants need to release energy and make proteins too. They have mitochondria and ribosomes.', 'Photosynthesis does not mean plants stop respiring.', structures, 'plant'),
  card('wall', 'Plant cells', 'What is a plant cell wall made of, and what does it do?', 'It contains cellulose, which strengthens and supports the cell.', 'The wall is outside the membrane. Its strong material helps the cell keep its shape.', 'Do not say every cell wall contains cellulose; bacterial walls do not.', structures),
  card('chloroplast', 'Plant cells', 'What happens in chloroplasts?', 'Photosynthesis. Chloroplasts contain chlorophyll, which absorbs light.', 'Chlorophyll is a green pigment. Absorbed light supplies energy for photosynthesis.', 'Chloroplasts are not the site of aerobic respiration.', structures),
  card('vacuole', 'Plant cells', 'What does a permanent vacuole contain?', 'Cell sap: water containing dissolved substances.', 'The permanent vacuole is a compartment holding a watery solution.', 'Cell sap is not the cell’s main DNA.', structures),
  card('root-chloroplast', 'Plant cells', 'A root cell has no chloroplasts. Can it still be a plant cell?', 'Yes. Not every plant cell has chloroplasts.', 'Root cells normally do not receive light for photosynthesis, so they generally lack chloroplasts.', 'No chloroplasts does not prove a cell is animal.', structures),
  card('bacterial-parts', 'Bacterial cells', 'Name three structures found in bacterial cells.', 'Cytoplasm, a cell membrane and a cell wall. They also contain ribosomes and DNA.', 'A bacterium is still a cell, even though it does not have a nucleus.', 'No nucleus does not mean no DNA or no ribosomes.', bacteria, 'bacterium'),
  card('bacterial-dna', 'Bacterial cells', 'Where is the main DNA in a bacterial cell?', 'A DNA loop in the cytoplasm, not enclosed in a nucleus.', 'The genetic information is present, but there is no nucleus around it.', 'Do not write “bacteria have no genetic material”.', ['4.1.1.1']),
  card('plasmids', 'Bacterial cells', 'What are plasmids?', 'Small extra rings of DNA found in some bacterial cells.', 'They are extra genetic material, separate from the main DNA loop.', 'Not every bacterium has plasmids. A plasmid is not a nucleus.', ['4.1.1.1']),
  card('bacteria-no-mitochondria', 'Bacterial cells', 'Do bacteria have mitochondria?', 'No. Bacterial cells do not have mitochondria or a nucleus.', 'Bacteria can still carry out respiration. No mitochondria does not mean no respiration.', 'Do not assume bacteria cannot release energy.', bacteria),
  card('different-walls', 'Bacterial cells', 'How do plant and bacterial cell walls differ?', 'Plant walls contain cellulose. Bacterial walls do not contain cellulose.', 'Both types can have a wall, but the wall material is different.', 'Animals do not have cell walls.', structures),
  card('eukaryotic', 'Cell types', 'What does eukaryotic mean here?', 'A cell with genetic material enclosed in a nucleus. Plant and animal cells are eukaryotic.', 'Learn the familiar examples first: plant and animal cells have a nucleus.', 'A nucleus alone cannot tell you whether the cell is plant or animal.', ['4.1.1.1']),
  card('prokaryotic', 'Cell types', 'Why are bacterial cells called prokaryotic?', 'Their genetic material is not enclosed in a nucleus.', 'Bacteria are generally much smaller than plant and animal cells. Size varies, so use the nucleus clue as well.', 'Prokaryotic does not mean “no DNA”.', ['4.1.1.1']),
  card('paired-comparison', 'Cell types', 'Give two structural differences between a typical animal cell and a bacterial cell.', 'An animal cell has a nucleus; a bacterial cell does not. An animal cell has mitochondria; a bacterial cell does not.', 'Compare both cells in each sentence. Use two different structures.', '“No nucleus” and “DNA is not in a nucleus” describe the same difference, not two.', bacteria),
  card('units', 'Cell sizes and maths', 'How many micrometres (µm) are in 1 millimetre (mm)?', '1 mm = 1000 µm. Multiply mm by 1000 to get µm.', 'Example: 0.004 mm × 1000 = 4 µm. To go back to mm, divide by 1000.', 'Match units before comparing sizes.', ['4.1.1.1', 'MS 1b', 'WS 4.4']),
  card('size-ratio', 'Cell sizes and maths', 'An example animal cell is 30 µm wide and a bacterium is 3 µm wide. How many times wider is the animal cell?', '30 ÷ 3 = 10 times wider.', 'The units match. Divide the larger width by the smaller width.', 'This compares widths, not areas or volumes. These are example sizes, not fixed sizes for every cell.', ['4.1.1.1', 'MS 2a']),
  card('standard-form', 'Cell sizes and maths', 'Write 0.005 mm in standard form.', '5 × 10⁻³ mm.', '10⁻³ means 0.001. So 5 × 0.001 = 0.005.', 'A positive power, 5 × 10³, gives 5000—not a tiny number.', ['4.1.1.1', 'MS 1b']),
  card('area', 'Cell sizes and maths', 'Estimate the area of a curved cell part using a rectangle 5 µm long and 2 µm wide.', 'Area ≈ length × width = 5 × 2 = 10 µm².', 'Use the supplied actual measurements. Area is measured in square units.', 'Do not add the lengths or write µm instead of µm².', ['4.1.1.2', 'MS 1d', 'MS 3a'], 'area'),
  card('area-estimate', 'Cell sizes and maths', 'Why is the rectangular area only an estimate?', 'The curved structure does not exactly fill the rectangle.', 'The rectangle is a simpler shape used to approximate the real outline.', 'An unscaled drawing cannot give an actual size by itself.', ['4.1.1.2', 'MS 1d']),
  card('model', 'Models and observations', 'Does a purple nucleus in a diagram prove nuclei are naturally purple?', 'No. Diagram colours help distinguish structures; they are not evidence of natural colour.', 'Two different drawings can use different colours for the same structure.', 'A simplified model is not a microscope photograph.', ['WS 1.2']),
  card('unseen', 'Models and observations', 'A cell part is not visible in one microscope view. Does that prove it is absent?', 'No. It may be too small or unclear to distinguish in that view.', 'Describe what the image shows, then separate that observation from what you know about typical cells.', '“I cannot see it” is not the same as “it is not there”.', ['WS 3.5', 'WS 4.1']),
]

export type PracticeTask = {
  id: string; stage: 'worked' | 'supported' | 'independent'; title: string; prompt: string; command: 'Name' | 'Explain' | 'Compare' | 'Calculate' | 'Choose'
  marks: number; cardIds: string[]; model: string; points: string[]; slip: string; support?: string[]; visual?: 'animal-target'
} & ({ kind: 'choice'; options: string[]; answer: number } | { kind: 'number'; answer: number; unit: string } | { kind: 'written' })
// Marks and answer guidance are original Revily draft allocations, not official AQA marking.
export const practiceTasks: PracticeTask[] = [
  { id: 'worked-energy', stage: 'worked', kind: 'written', title: 'See how an explanation earns its points', command: 'Explain', marks: 2,
    prompt: 'A cell uses energy for movement. Explain how its mitochondria help.', cardIds: ['mitochondria'],
    model: 'Mitochondria are the site of aerobic respiration. Respiration releases energy that the cell can use for movement.',
    points: ['Link mitochondria to aerobic respiration.', 'Link respiration to energy released for movement.'], slip: 'Energy is released, not created.' },
  { id: 'supported-protein', stage: 'supported', kind: 'written', title: 'Build a short explanation', command: 'Explain', marks: 2,
    prompt: 'A cell makes proteins that are released into the blood. It contains many ribosomes. Explain why ribosomes help it do this job.', cardIds: ['ribosomes'],
    support: ['What do ribosomes make?', 'Why does this cell need those products?'],
    model: 'Ribosomes are the site of protein synthesis. They make the proteins that this cell releases into the blood.',
    points: ['Identify protein synthesis as the ribosomes’ function.', 'Connect protein production to this cell’s stated job.'], slip: 'The fact that the protein is used elsewhere does not change where it is made.' },
  { id: 'membrane-check', stage: 'independent', kind: 'choice', title: 'Identify a structure in a new view', command: 'Name', marks: 1,
    prompt: 'In this original animal-cell model, the pointer ends at the outer boundary. Which structure is it?', visual: 'animal-target',
    cardIds: ['membrane', 'animal-parts'], options: ['Cell wall', 'Cell membrane', 'Nucleus'], answer: 1,
    model: 'Cell membrane.', points: ['Identify the animal cell’s outer boundary as the membrane.'], slip: 'Typical animal cells do not have cell walls.' },
  { id: 'comparison-check', stage: 'independent', kind: 'written', title: 'Give two distinct comparisons', command: 'Compare', marks: 2,
    prompt: 'Give two structural differences between a typical animal cell and a bacterial cell. Compare both cells in each difference.', cardIds: ['paired-comparison', 'bacterial-dna', 'bacteria-no-mitochondria'],
    model: 'The animal cell has a nucleus, but the bacterial cell does not. The animal cell has mitochondria, but the bacterial cell does not.',
    points: ['One valid paired difference, such as nucleus present versus absent.', 'A second distinct paired difference, such as mitochondria present versus absent. A bacterial wall versus no animal wall is also valid.'], slip: 'Do not count “no nucleus” and “DNA not in a nucleus” as two differences.' },
  { id: 'unit-check', stage: 'independent', kind: 'number', title: 'Use the correct size units', command: 'Calculate', marks: 1,
    prompt: 'A structure is 0.007 mm long. Convert this length to micrometres. Enter a number; the unit is supplied.', cardIds: ['units'], answer: 7, unit: 'µm',
    model: '0.007 × 1000 = 7 µm.', points: ['Convert mm to µm by multiplying by 1000: 7 µm.'], slip: 'Dividing by 1000 converts in the opposite direction.' },
  { id: 'area-check', stage: 'independent', kind: 'written', title: 'Calculate, then explain the estimate', command: 'Calculate', marks: 2,
    prompt: 'Approximate a curved mitochondrion using a rectangle 7 µm long and 3 µm wide. Calculate its area and explain why your answer is an estimate.', cardIds: ['area', 'area-estimate'],
    model: 'Area ≈ 7 × 3 = 21 µm². This is an estimate because the curved mitochondrion does not exactly fill the rectangle.',
    points: ['Calculate 21 µm² using length × width, with square units.', 'Explain that the rectangle does not exactly match the curved outline.'], slip: 'The measurements are supplied actual dimensions—not measurements from an unscaled picture.' },
  { id: 'plant-check', stage: 'independent', kind: 'choice', title: 'Avoid a cell-classification trap', command: 'Choose', marks: 1,
    prompt: 'A labelled root cell has no chloroplasts. Which statement is justified?', cardIds: ['root-chloroplast', 'plant-shared'],
    options: ['It must be an animal cell', 'It cannot carry out respiration', 'It can be a plant cell without chloroplasts'], answer: 2,
    model: 'It can be a plant cell without chloroplasts.', points: ['Recognise that not every plant cell contains chloroplasts.'], slip: 'Plant cells still respire. No chloroplasts does not mean no mitochondria.' },
  { id: 'dna-check', stage: 'independent', kind: 'choice', title: 'Locate bacterial genetic material', command: 'Choose', marks: 1,
    prompt: 'A bacterial cell has no nucleus. Which statement about its genetic material is correct?', cardIds: ['bacterial-dna', 'prokaryotic'],
    options: ['Its main DNA is a loop in the cytoplasm', 'It has no DNA', 'Its genetic material is in a chloroplast'], answer: 0,
    model: 'Its main DNA is a loop in the cytoplasm.', points: ['Identify bacterial DNA as present but not enclosed in a nucleus.'], slip: 'Plasmids may also be present; they are extra rings, not the main DNA loop.' },
  { id: 'standard-check', stage: 'independent', kind: 'choice', title: 'Recognise a tiny measurement', command: 'Choose', marks: 1,
    prompt: 'Which expression in standard form equals 0.002 mm?', cardIds: ['standard-form'],
    options: ['2 × 10³ mm', '2 × 10⁻³ mm', '2 × 10⁻² mm'], answer: 1,
    model: '2 × 10⁻³ mm.', points: ['Recognise that 2 × 0.001 = 0.002.'], slip: 'The negative power gives a small number, not a negative length.' },
  { id: 'ratio-check', stage: 'independent', kind: 'number', title: 'Compare two example cell widths', command: 'Calculate', marks: 1,
    prompt: 'An example animal cell is 40 µm wide. An example bacterium is 2 µm wide. How many times wider is the animal cell? Enter a number.', cardIds: ['size-ratio'], answer: 20, unit: 'times wider',
    model: '40 ÷ 2 = 20 times wider.', points: ['Divide the larger width by the smaller width: 20.'], slip: 'The question compares width, not area. Both measurements already use the same unit.' },
  { id: 'observation-check', stage: 'independent', kind: 'written', title: 'Separate the image from the conclusion', command: 'Explain', marks: 1,
    prompt: 'In one microscope view of an animal cell, a nucleus and cell outline are visible, but mitochondria are not. Explain why this does not prove that the cell has no mitochondria.', cardIds: ['unseen', 'model'],
    model: 'The mitochondria might be too small or unclear to distinguish in this view. Not seeing them does not prove that they are absent.',
    points: ['Explain a limit of the observation: a structure may be present but not distinguishable in this view.'], slip: 'Do not treat a simplified drawing or a single view as proof of every structure that is present or absent.' },
]

export const alignmentRows = [
  { title: 'Animal and plant structures and functions', refs: ['4.1.1.2'], groups: ['Animal cells', 'Plant cells'] as CardGroup[], practice: ['worked-energy', 'supported-protein', 'membrane-check', 'plant-check'] },
  { title: 'Bacterial structures, DNA and cell classification', refs: ['4.1.1.1', '4.1.1.2'], groups: ['Bacterial cells', 'Cell types'] as CardGroup[], practice: ['comparison-check', 'dna-check'] },
  { title: 'Size, scale, units and standard form', refs: ['4.1.1.1', 'MS 1b', 'MS 2a', 'WS 4.4'], groups: ['Cell sizes and maths'] as CardGroup[], practice: ['unit-check', 'standard-check', 'ratio-check'] },
  { title: 'Estimate the area of a cell part', refs: ['4.1.1.2', 'MS 1d', 'MS 3a'], groups: ['Cell sizes and maths'] as CardGroup[], practice: ['area-check'] },
  { title: 'Interpret models and distinguish observation from inference', refs: ['WS 1.2', 'WS 3.5', 'WS 4.1'], groups: ['Models and observations'] as CardGroup[], practice: ['observation-check'] },
]
