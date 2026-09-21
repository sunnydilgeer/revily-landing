import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const organisationFrames: Record<string, TeachingFrame[]> = {
  'B7-02': [
    f('Start with one cell', 'A cell is the smallest level in this sequence.', 'one living building block', 'A multicellular organism is made of many cells. Different specialised cells do different jobs. We can organise these cells into larger working groups.', 'organisation-cell'),
    f('Similar cells form a tissue', 'A tissue is a group of similar cells working together.', 'similar cells → shared job', 'The cells in a tissue have a similar structure and work together for a function. Epithelial tissue is one example: its cells form a covering or lining.', 'organisation-tissue'),
    f('Different tissues form an organ', 'An organ contains different tissues working together.', 'different tissues → one organ', 'An organ carries out a particular function. It needs more than one tissue because different parts of the job need different structures. The stomach is an organ.', 'organisation-organ'),
    f('Organs form an organ system', 'An organ system is a group of organs working together.', 'several organs → larger job', 'The digestive system contains several organs. Together they break down food and absorb small, soluble molecules into the body.', 'organisation-system'),
    f('Organ systems form an organism', 'Organ systems work together in the whole organism.', 'smallest → largest', 'The sequence is cell, tissue, organ, organ system, organism. Each level is built from the level before it.', 'organisation-whole'),
  ],
  'B7-05': [
    f('Meet epithelial tissue', 'Epithelial cells fit together to make a lining.', 'similar cells → tissue', 'Epithelial tissue covers surfaces and lines parts of the body. For example, it lines parts of the digestive system. Many similar epithelial cells work together as one tissue.', 'epithelial'),
    f('A tissue is not one cell', 'Many cells make the tissue.', 'cell compared with tissue', 'One epithelial cell is a cell. A layer made from many similar epithelial cells is epithelial tissue. The tissue has a job that depends on all those cells working together.', 'epithelial-layer'),
  ],
  'B7-07': [
    f('The stomach is an organ', 'Different tissues build the stomach.', 'different tissues → organ', 'The stomach contains tissues that contract, make digestive substances and form protective linings. These tissues work together, so the stomach is an organ rather than a tissue.', 'stomach-organ'),
    f('Organs have a function', 'The stomach helps digest food.', 'structure working towards a job', 'Food enters the stomach. The organ mixes food and begins part of its chemical digestion. Later lessons connect this function to enzymes and acid.', 'stomach-function'),
  ],
  'B7-09': [
    f('Food follows a route', 'The digestive system moves and processes food.', 'organs working in sequence', 'Food passes through the mouth, oesophagus, stomach, small intestine and large intestine. Other organs add substances that help digestion.', 'digestive-route'),
    f('Mouth, stomach and pancreas', 'These organs help begin and continue digestion.', 'where digestive substances enter', 'Salivary glands add saliva in the mouth. The stomach mixes food and contains acid and enzymes. The pancreas makes digestive enzymes that enter the small intestine.', 'digestive-upper'),
    f('Liver and gall bladder', 'The liver makes bile; the gall bladder stores it.', 'make compared with store', 'Bile is made in the liver. It is stored in the gall bladder before entering the small intestine. Bile helps create suitable conditions for fat digestion.', 'digestive-bile'),
    f('Small and large intestine', 'The small intestine absorbs digested food; the large intestine absorbs water.', 'different jobs', 'Most chemical digestion finishes in the small intestine, where small soluble food molecules are absorbed. The large intestine absorbs water from material that was not digested.', 'digestive-intestines'),
  ],
  'B7-12': [
    f('One system, several jobs', 'No single digestive organ does everything.', 'organ contribution → system function', 'The stomach, intestines, liver, gall bladder, pancreas and salivary glands contribute different parts of digestion. Their combined work lets the system digest food and absorb useful molecules.', 'digestive-system'),
    f('Use the hierarchy to explain', 'Name the level and give the reason.', 'what it is made of + its job', 'To explain that something is an organ, say it contains different tissues working together for a function. To explain an organ system, say it contains organs working together for a larger function.', 'organisation-compare'),
  ],
}
