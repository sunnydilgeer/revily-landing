import type { ChoiceState, ScienceState, TeachingState } from '../types'
import { teachingFrames } from './teachingFrames'

const base = { skillId: 'B-CELL-PARTS-FUNCTIONS', specRefs: ['4.1.1.1', '4.1.1.2'], sourceIds: ['aqa-biology'] }
function teach(id: string, title: string, seconds: number): TeachingState {
  const script = teachingFrames[id].map(frame => `${frame.label}. ${frame.summary} ${frame.text}`).join(' ')
  return { ...base, id, title, kind: 'teaching', phase: 'teach', body: script,
    media: { kind: 'videoScript', seconds, status: 'notRecorded', script } }
}
function choice(id: string, title: string, options: Array<[string, string]>, answerId: string, hint: string,
  reasoning: string[], independent = false, calculation = false): ChoiceState {
  return { ...base, id, title, kind: 'choice', phase: independent ? 'independent' : 'guided',
    contextId: `expanded-${id}`, dimensions: [calculation ? 'calculation' : independent ? 'recall' : 'understanding'],
    evidenceRole: independent ? 'independent' : 'practice', options: options.map(([id, label]) => ({ id, label })),
    answerId, hint, explanation: { steps: reasoning, answer: options.find(([id]) => id === answerId)![1] },
    ...(independent ? { exam: { marks: 1, ao: calculation ? 'AO2' : 'AO1', status: 'revilyDraft' } as const } : {}) }
}

export const expandedTeaching: ScienceState[] = [
  teach('B1-24', 'Plant cells: meet the cell', 45),
  teach('B1-42', 'Plant cells: energy, proteins, support and food', 70),
  choice('B1-25', 'Which plant structure strengthens and supports the cell?', [['wall', 'Cell wall'], ['membrane', 'Cell membrane'], ['ribosomes', 'Ribosomes']], 'wall', 'Distinguish the supporting outer layer from the layer controlling movement.', ['The cellulose cell wall strengthens the plant cell.', 'The cell membrane controls movement of substances, a different function.']),
  choice('B1-26', 'A root cell has no chloroplasts. Must it be an animal cell?', [['no', 'No. Some plant cells do not have chloroplasts.'], ['yes', 'Yes. Every plant cell has chloroplasts.'], ['shape', 'Only its outline can tell us.']], 'no', 'Use typical features carefully; one missing feature is not enough.', ['Root cells are plant cells even when they lack chloroplasts.', 'Do not classify a cell solely by the absence of chloroplasts or by its shape.']),
  teach('B1-41', 'Compare animal and plant cells', 30),
  teach('B1-27', 'Bacterial cells: meet the cell', 65),
  choice('B1-28', 'Which statement about bacterial genetic material is correct?', [['loop', 'Its main DNA is a loop, not enclosed in a nucleus.'], ['none', 'It has no DNA because it has no nucleus.'], ['nucleus', 'Its DNA is enclosed in a nucleus.']], 'loop', 'No nucleus does not mean no genetic material.', ['Bacteria contain genetic material.', 'Their main DNA is a single loop outside a nucleus; plasmids may also be present.']),
  teach('B1-22', 'Names for the cells you have met', 30),
  choice('B1-23', 'An animal cell and a plant cell are both…', [['euk', 'Eukaryotic'], ['pro', 'Prokaryotic'], ['none', 'Cells without genetic material']], 'euk', 'Think about where their genetic material is enclosed.', ['Typical animal and plant cells have a nucleus enclosing genetic material.', 'Both are eukaryotic.']),
  teach('B1-29', 'Cell sizes: compare the same units', 45),
  { ...base, id: 'B1-30', kind: 'teaching', phase: 'guided', title: 'Estimate an area using a simple shape', body: 'Approximate this mitochondrion by a rectangle 8 µm long and 2 µm wide.', steps: ['Choose a rectangle close to the outline.', 'Area ≈ length × width = 8 × 2.', 'Estimated area ≈ 16 µm². The curved outline means this is an estimate, not an exact area.'] },
  choice('B1-31', 'Why is the rectangular area only an estimate?', [['curve', 'The curved structure does not exactly fill the rectangle.'], ['exact', 'Every mitochondrion is an exact rectangle.'], ['length', 'Area uses only the length.']], 'curve', 'Compare the simple shape with the curved outline.', ['The rectangle is a useful approximation to an irregular shape.', 'Its calculated area is therefore an estimate.']),
]

export const expandedIndependent: ScienceState[] = [
  choice('B1-32', 'Which plant structure is the site of photosynthesis?', [['chl', 'Chloroplast'], ['vac', 'Permanent vacuole'], ['wall', 'Cell wall']], 'chl', 'Recall the function of each plant structure.', ['Photosynthesis takes place in chloroplasts.'], true),
  choice('B1-33', 'What does a permanent vacuole contain?', [['sap', 'Cell sap'], ['dna', 'The main bacterial DNA loop'], ['cellulose', 'Cellulose']], 'sap', 'Recall what fills this plant-cell compartment.', ['The permanent vacuole contains cell sap.'], true),
  choice('B1-34', 'Which description correctly identifies plasmids?', [['rings', 'Small extra rings of DNA that may occur in bacteria'], ['nucleus', 'The nucleus of a bacterial cell'], ['food', 'Structures carrying out photosynthesis']], 'rings', 'Think about additional genetic material, not a nucleus.', ['Plasmids are extra small rings of DNA.', 'Not every bacterial cell has plasmids.'], true),
  choice('B1-35', 'Estimate the area using a rectangle 6 µm long and 2 µm wide.', [['12', '12 µm²'], ['8', '8 µm²'], ['3', '3 µm²']], '12', 'Multiply length by width. Use square units for area.', ['Estimated area ≈ 6 × 2 = 12.', 'Both dimensions are in micrometres, so the area unit is µm².'], true, true),
  choice('B1-36', 'A cell has a nucleus enclosing its genetic material. Which type is it?', [['euk', 'Eukaryotic'], ['pro', 'Prokaryotic'], ['neither', 'Neither type can contain DNA']], 'euk', 'Use the location of the genetic material.', ['Genetic material enclosed in a nucleus identifies a eukaryotic cell.'], true),
  choice('B1-37', 'Which statement about cell walls is correct?', [['plant', 'Plant cell walls contain cellulose; bacterial cell walls do not.'], ['all', 'All cell walls contain cellulose.'], ['animal', 'Animal cells have cellulose walls.']], 'plant', 'Distinguish plant, animal and bacterial structures.', ['Plant and algal walls contain cellulose.', 'Bacterial walls are different; animal cells do not have a cell wall.'], true),
  choice('B1-38', 'Example diameters: animal cell 40 µm; bacterium 2 µm. How many times larger is the animal cell’s diameter?', [['20', '20 times'], ['38', '38 times'], ['80', '80 times']], '20', 'The units match. Divide the larger diameter by the smaller one.', ['40 ÷ 2 = 20.', 'This compares diameters, not areas or volumes.'], true, true),
  choice('B1-39', 'A structure is 0.003 mm long. What is that in µm?', [['3', '3 µm'], ['0.003', '0.003 µm'], ['3000', '3000 µm']], '3', 'There are 1000 µm in 1 mm.', ['Convert millimetres to micrometres by multiplying by 1000.', '0.003 × 1000 = 3 µm.'], true, true),
  choice('B1-40', 'Which standard-form expression equals 0.004 mm?', [['correct', '4 × 10⁻³ mm'], ['positive', '4 × 10³ mm'], ['wrong', '4 × 10⁻⁴ mm']], 'correct', 'A negative power of ten represents a small decimal.', ['10⁻³ = 0.001.', '4 × 0.001 = 0.004 mm.'], true, true),
]
