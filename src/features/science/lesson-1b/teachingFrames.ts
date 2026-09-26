// One route: build a bacterial cell part by part → sort cells by where their DNA is → compare all three.
// One new word per frame. Plain meaning first, then the term. See STORYBOARD.md.
// Bacterium frames use the bacterial-cell model (B1-22 shows only the DNA label); comparison frames use the animal/plant pair.
import type { TeachingFrame } from '../teachingFrame'

const bacterium = (label: string, summary: string, cue: string, text: string, focus?: string): TeachingFrame =>
  ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'bacterium', ...(focus ? { focus } : {}) })
const compare = (label: string, summary: string, cue: string, text: string): TeachingFrame =>
  ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'comparison' })

export const bacteriaFrames: Record<string, TeachingFrame[]> = {
  'B1-27': [
    bacterium('Meet a bacterial cell', 'Some living things are just one tiny cell.', 'one cell = one whole living thing',
      'Some living things are made of just one cell. These cells are much smaller than animal or plant cells. One of these tiny living cells is called a bacterium. Many of them are called bacteria. Like your cells, a bacterium has a cell membrane. This drawing is enlarged; it is not the real size.', 'membrane'),
    bacterium('Cytoplasm and ribosomes', 'Bacteria have cytoplasm and ribosomes, like your cells.', 'same parts, same jobs',
      'Inside the membrane is cytoplasm, where many reactions happen. Ribosomes in the cytoplasm make proteins. These parts do the same jobs as in animal and plant cells. Bacteria have no mitochondria and no chloroplasts.', 'ribosomes'),
    bacterium('The cell wall', 'A wall outside the membrane supports the cell.', 'a wall, but not cellulose',
      'Outside its membrane, a bacterium has a cell wall. It supports the cell, like a plant cell wall does. But it is made of a different material. A bacterial cell wall is not made of cellulose.', 'wall'),
    bacterium('A loop of DNA', 'The main DNA is a loop in the cytoplasm, not inside a nucleus.', 'DNA, but no nucleus',
      'A bacterium has no nucleus. It still has genetic material, a chemical called DNA. Its main DNA is one long loop, lying in the cytoplasm. This is called the DNA loop. No nucleus does not mean no DNA.', 'dna'),
    bacterium('Plasmids', 'Some bacteria also have small extra rings of DNA.', 'small extra rings, only in some',
      'Some bacteria also have small rings of DNA, separate from the main loop. They carry a few extra instructions. These small rings are called plasmids. Some bacteria have plasmids; others do not.', 'plasmids'),
    bacterium('Put the bacterial cell together', 'A wall, a membrane, cytoplasm, ribosomes and a DNA loop.', 'outside → in: wall, membrane, cytoplasm, DNA',
      'From the outside in, a bacterium has a cell wall, then a cell membrane. Inside is cytoplasm with ribosomes. The main DNA is a loop in the cytoplasm, with no nucleus. Some bacteria also have plasmids.'),
  ],
  'B1-22': [
    compare('Cells with a nucleus', 'Animal and plant cells keep their DNA inside a nucleus.', 'DNA inside a nucleus',
      'In animal and plant cells, the DNA is kept inside a nucleus. Cells like this are called eukaryotic cells. Eukaryotic is the name for a type of cell, not a cell part.'),
    bacterium('Cells without a nucleus', 'Bacterial DNA is not inside a nucleus.', 'DNA loose in the cytoplasm',
      'In a bacterium, the DNA lies in the cytoplasm. There is no nucleus around it. Cells like this are called prokaryotic cells. So bacteria are prokaryotic.', 'dna'),
    bacterium('Put the two types together', 'Ask one question: is the DNA inside a nucleus?', 'nucleus → eukaryotic; no nucleus → prokaryotic',
      'To sort a cell, look for a nucleus around its DNA. If there is one, the cell is eukaryotic. If there is not, the cell is prokaryotic. Prokaryotic cells are usually much smaller than eukaryotic cells.', 'dna'),
  ],
  'B1-49': [
    compare('Parts all three share', 'Animal, plant and bacterial cells all have a membrane, cytoplasm and ribosomes.', 'three shared parts',
      'Animal and plant cells share five parts. Bacteria share only three of them: the cell membrane, cytoplasm and ribosomes. These three parts do the same jobs in all three cells.'),
    bacterium('Nucleus and mitochondria', 'Animal and plant cells have both. Bacteria have neither.', 'eukaryotic cells only',
      'A bacterium has no nucleus, so its DNA is a loop in the cytoplasm. It has no mitochondria either. It still releases energy from food, but not in mitochondria.', 'dna'),
    bacterium('Cell walls', 'Plant cells and bacteria have a wall. Animal cells do not.', 'wall: plant yes, bacterium yes, animal no',
      'Plant cells and bacteria both have a cell wall. A plant cell wall is made of cellulose. A bacterial cell wall is not. Animal cells have no cell wall at all.', 'wall'),
    bacterium('Put it together: one part at a time', 'Name one part, then say whether each cell has it.', 'part → animal cell … bacterial cell …',
      'Compare one part at a time, and talk about both cells. For example: an animal cell has a nucleus, but a bacterial cell does not. “No nucleus” and “DNA not in a nucleus” are the same difference, so count it once. Next, you will find out how light and electron microscopes let us see cells this small.'),
  ],
}
