export const scienceCurriculum = [
  { strand: 'Biology', papers: [
    { paper: 1, topics: [
      ['B1', 'Cell biology', '4.1'], ['B2', 'Organisation', '4.2'],
      ['B3', 'Infection and response', '4.3'], ['B4', 'Bioenergetics', '4.4'],
    ] },
    { paper: 2, topics: [
      ['B5', 'Homeostasis and response', '4.5'], ['B6', 'Inheritance, variation and evolution', '4.6'], ['B7', 'Ecology', '4.7'],
    ] },
  ] },
  { strand: 'Chemistry', papers: [
    { paper: 1, topics: [
      ['C1', 'Atomic structure and the periodic table', '5.1'], ['C2', 'Bonding, structure and properties of matter', '5.2'],
      ['C3', 'Quantitative chemistry', '5.3'], ['C4', 'Chemical changes', '5.4'], ['C5', 'Energy changes', '5.5'],
    ] },
    { paper: 2, topics: [
      ['C6', 'The rate and extent of chemical change', '5.6'], ['C7', 'Organic chemistry', '5.7'],
      ['C8', 'Chemical analysis', '5.8'], ['C9', 'Chemistry of the atmosphere', '5.9'], ['C10', 'Using resources', '5.10'],
    ] },
  ] },
  { strand: 'Physics', papers: [
    { paper: 1, topics: [
      ['P1', 'Energy', '6.1'], ['P2', 'Electricity', '6.2'], ['P3', 'Particle model of matter', '6.3'], ['P4', 'Atomic structure', '6.4'],
    ] },
    { paper: 2, topics: [
      ['P5', 'Forces', '6.5'], ['P6', 'Waves', '6.6'], ['P7', 'Magnetism and electromagnetism', '6.7'],
    ] },
  ] },
] as const

export const cellBiologySequence = [
  { title: 'Cells: animal, plant and bacterial', status: 'Built · draft', spec: '4.1.1.1–4.1.1.2' },
  { title: 'Microscopy: seeing cells and measuring them', status: 'Built · draft', spec: '4.1.1.5' },
  { title: 'Microscopy practical: prepare, observe and draw', status: 'Built · digital preparation draft', spec: '4.1.1.2; required practical 1' },
  { title: 'Specialisation and differentiation', status: 'Built · draft', spec: '4.1.1.3–4.1.1.4' },
  { title: 'Chromosomes, mitosis and stem cells', status: 'Built · draft', spec: '4.1.2' },
  { title: 'Transport and exchange', status: 'Built · digital preparation draft', spec: '4.1.3; required practical 2' },
] as const

export const organisationSequence = [
  { title: 'Cells, tissues and organs', status: 'Built · easier-wording draft', spec: '4.2.1; digestive-system context' },
  { title: 'Enzymes and reaction rates', status: 'Built · digital preparation draft', spec: '4.2.2.1; required practical 4' },
  { title: 'Digestion and food tests', status: 'Built · digital preparation draft', spec: '4.2.2.1; required practical 3' },
  { title: 'The lungs', status: 'Built · easier-wording draft', spec: '4.2.2.2' },
  { title: 'Circulatory system: the heart', status: 'Built · easier-wording draft', spec: '4.2.2.2' },
  { title: 'Circulatory system: blood vessels', status: 'Built · easier-wording draft', spec: '4.2.2.2' },
  { title: 'Blood', status: 'Built · easier-wording draft', spec: '4.2.2.3' },
  { title: 'Cardiovascular disease and treatments', status: 'Built · easier-wording draft', spec: '4.2.2.4' },
  { title: 'Health and disease', status: 'Built · easier-wording draft', spec: '4.2.2.5' },
  { title: 'Risk factors and cancer', status: 'Built · easier-wording draft', spec: '4.2.2.6–4.2.2.7' },
  { title: 'Plant tissues and the leaf', status: 'Built · easier-wording draft', spec: '4.2.3.1; 4.2.3.2' },
  { title: 'Water and food on the move', status: 'Built · easier-wording draft', spec: '4.2.3.2' },
] as const
