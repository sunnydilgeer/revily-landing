export type TeachingFrame = {
  label: string; summary: string; cue: string; text: string;
  part?: 'membrane' | 'cytoplasm' | 'nucleus' | 'mitochondria' | 'ribosomes'; diagram?: 'plant' | 'bacterium' | 'scale' | 'comparison' | 'microscopy' | 'practical'; focus?: string
}

// Learn whole cells first. Classification is an observation after all three are familiar.
export const teachingFrames: Record<string, TeachingFrame[]> = {
  'B1-02': [
    { label: 'Meet an animal cell', summary: 'Animals are made of cells: tiny units of life.', cue: 'Think: one cell, several jobs', text: 'This is one typical animal cell. Its parts are called sub-cellular structures. We will explore them one at a time.' },
    { label: 'Animal cell: cell membrane', part: 'membrane', summary: 'Controls what enters and leaves the cell.', cue: 'Think: in and out', text: 'Follow the thin boundary around this animal cell. The membrane controls movement of substances across it.' },
    { label: 'Animal cell: cytoplasm', part: 'cytoplasm', summary: 'Where most chemical reactions happen.', cue: 'Think: reactions', text: 'The jelly-like cytoplasm fills the space inside the membrane, around the other structures.' },
    { label: 'Animal cell: nucleus', part: 'nucleus', summary: 'Contains genetic material and controls cell activities.', cue: 'Think: instructions and control', text: 'The genetic material contains instructions for how this cell works.' },
  ],
  'B1-05': [
    { label: 'Animal cell: mitochondria', part: 'mitochondria', summary: 'Where aerobic respiration releases energy.', cue: 'Think: release energy', text: 'The released energy is used for cell processes. Respiration releases energy; it does not create energy.' },
    { label: 'Animal cell: ribosomes', part: 'ribosomes', summary: 'Where proteins are made.', cue: 'Think: make proteins', text: 'Making proteins is called protein synthesis. The tiny dots represent ribosomes.' },
    { label: 'An animal cell, all together', summary: 'Five structures help this animal cell do its work.', cue: 'Think: name a part, explain its job', text: 'Most animal cells have a membrane, cytoplasm, nucleus, mitochondria and ribosomes. Some specialised animal cells are different.' },
  ],
  'B1-24': [
    { label: 'Meet a plant cell', summary: 'Plants are made of cells too. This one can photosynthesise.', cue: 'Think: a complete plant cell', text: 'This plant cell has parts that carry out different jobs, from controlling entry to making food.', diagram: 'plant' },
    { label: 'Plant cell: cell membrane', summary: 'Controls what enters and leaves the cell.', cue: 'Think: in and out', text: 'The membrane is the thin boundary just inside the thick wall. The wall and membrane are different structures.', diagram: 'plant', focus: 'membrane' },
    { label: 'Plant cell: cytoplasm', summary: 'Where most chemical reactions happen.', cue: 'Think: reactions', text: 'Cytoplasm surrounds the structures inside this plant cell. The large vacuole takes up much of the centre.', diagram: 'plant', focus: 'cytoplasm' },
    { label: 'Plant cell: nucleus', summary: 'Contains genetic material and controls cell activities.', cue: 'Think: instructions and control', text: 'The nucleus carries the genetic instructions for this plant cell. It can sit towards the edge beside the vacuole.', diagram: 'plant', focus: 'nucleus' },
  ],
  'B1-42': [
    { label: 'Plant cell: mitochondria', summary: 'Where aerobic respiration releases energy.', cue: 'Think: plants respire too', text: 'Plant cells need energy for cell processes. Photosynthesis does not replace respiration.', diagram: 'plant', focus: 'mitochondria' },
    { label: 'Plant cell: ribosomes', summary: 'Where proteins are made.', cue: 'Think: make proteins', text: 'This plant cell needs proteins. Its ribosomes carry out protein synthesis.', diagram: 'plant', focus: 'ribosomes' },
    { label: 'Plant cell: cell wall', summary: 'A cellulose wall strengthens and supports the cell.', cue: 'Think: support', text: 'The thick wall is outside the membrane. Plant and algal cell walls contain cellulose.', diagram: 'plant', focus: 'wall' },
    { label: 'Plant cell: permanent vacuole', summary: 'A large compartment containing cell sap.', cue: 'Think: cell sap', text: 'The permanent vacuole occupies much of this plant cell. Do not confuse it with the cytoplasm around it.', diagram: 'plant', focus: 'vacuole' },
    { label: 'Plant cell: chloroplasts', summary: 'Where photosynthesis makes food for the plant.', cue: 'Think: photosynthesis', text: 'Chloroplasts contain chlorophyll, which absorbs light. Not every plant cell has chloroplasts: root cells usually do not.', diagram: 'plant', focus: 'chloroplast' },
    { label: 'A plant cell, all together', summary: 'Each structure has a job in this plant cell.', cue: 'Think: name a part, explain its job', text: 'This photosynthesising example has eight labelled structures. Plant cells vary: do not assume every plant cell has chloroplasts.', diagram: 'plant' },
  ],
  'B1-41': [
    { label: 'Now compare animal and plant cells', summary: 'Both cells have five structures in common.', cue: 'Think: same structure, same job', text: 'Find the membrane, cytoplasm, nucleus, mitochondria and ribosomes in each diagram. The shapes are different, but these structures have the same functions.', diagram: 'comparison' },
    { label: 'What is different in this plant cell?', summary: 'A wall, permanent vacuole and chloroplasts.', cue: 'Think: compare complete cells', text: 'Animal cells do not have a cell wall or chloroplasts. This plant example has a large permanent vacuole. Remember that not all plant cells have chloroplasts.', diagram: 'comparison', focus: 'differences' },
  ],
  'B1-27': [
    { label: 'Meet a bacterial cell', summary: 'A bacterium is a living cell with a different internal layout.', cue: 'Think: a third kind of cell', text: 'Bacterial cells are generally much smaller than animal and plant cells. This enlarged drawing helps us see the parts; the drawings are not to scale.', diagram: 'bacterium' },
    { label: 'Bacterial cell: cell wall', summary: 'A supporting wall surrounds the cell membrane.', cue: 'Think: outer support', text: 'Bacterial cell walls are not made of cellulose. The wall is distinct from the membrane inside it.', diagram: 'bacterium', focus: 'wall' },
    { label: 'Bacterial cell: cell membrane', summary: 'Controls what enters and leaves the cell.', cue: 'Think: in and out', text: 'The membrane lies just inside the wall. It controls movement of substances into and out of this bacterial cell.', diagram: 'bacterium', focus: 'membrane' },
    { label: 'Bacterial cell: cytoplasm and ribosomes', summary: 'Reactions happen in cytoplasm; ribosomes make proteins.', cue: 'Think: reactions and proteins', text: 'Bacteria have cytoplasm and ribosomes. They do not have mitochondria or chloroplasts.', diagram: 'bacterium', focus: 'ribosomes' },
    { label: 'Bacterial cell: DNA loop', summary: 'Its main genetic material is not enclosed in a nucleus.', cue: 'Think: DNA, no nucleus', text: 'The main genetic material is a single loop of DNA in the cytoplasm. No nucleus does not mean no genetic material.', diagram: 'bacterium', focus: 'dna' },
    { label: 'Bacterial cell: plasmids', summary: 'Small extra rings of DNA that may be present.', cue: 'Think: extra genes', text: 'Plasmids carry additional genes. Some bacteria have them; do not assume every bacterium does.', diagram: 'bacterium', focus: 'plasmids' },
  ],
  'B1-22': [
    { label: 'A name for cells with a nucleus', summary: 'Animal and plant cells are called eukaryotic cells.', cue: 'Think: a name for what you have seen', text: 'You have already met both cells. Their genetic material is enclosed in a nucleus. Eukaryotic describes this category; it is not another cell structure.', diagram: 'comparison' },
    { label: 'A name for bacterial cells', summary: 'Bacteria are called prokaryotic cells.', cue: 'Think: DNA without a nucleus', text: 'Their genetic material is not enclosed in a nucleus. Prokaryotic is the category name for the bacterial cells you have just explored.', diagram: 'bacterium', focus: 'dna' },
  ],
  'B1-29': [
    { label: 'Micrometres', summary: '1 millimetre = 1000 micrometres.', cue: 'Think: mm × 1000 → µm', text: 'A micrometre is written µm. To convert µm to mm, divide by 1000.', diagram: 'scale' },
    { label: 'Compare matching units', summary: '20 µm ÷ 2 µm = 10 times as large across.', cue: 'Think: larger ÷ smaller', text: 'These are example diameters. Cells vary in size; a model drawn bigger on screen is not evidence of its actual size.', diagram: 'scale' },
    { label: 'An order of magnitude', summary: 'A factor of 10 is one order of magnitude.', cue: 'Think: tenfold steps', text: 'A factor of 100 is two orders of magnitude. Compare a named dimension, such as diameter, rather than confusing length with area.', diagram: 'scale' },
    { label: 'Standard form', summary: '20 = 2 × 10¹. A small decimal uses a negative power.', cue: 'Think: a × 10ⁿ', text: 'The first number is at least 1 and less than 10. For example, 0.002 mm = 2 × 10⁻³ mm.', diagram: 'scale' },
  ],
}

export const plantPartIds = ['membrane', 'cytoplasm', 'nucleus', 'mitochondria', 'ribosomes', 'wall', 'vacuole', 'chloroplast']
