// One route: build an animal cell part by part, then add only what is new in a plant cell,
// then compare the two. One new word per frame. Plain meaning first, then the term. See STORYBOARD.md.
// Animal frames use the animal-cell model (part); plant frames use the plant model; B1-41 uses the side-by-side comparison.
import type { TeachingFrame } from '../teachingFrame'

type AnimalPart = NonNullable<TeachingFrame['part']>
const animal = (label: string, summary: string, cue: string, text: string, part?: AnimalPart): TeachingFrame =>
  ({ label, summary, cue: `Think: ${cue}`, text, ...(part ? { part } : {}) })
const plant = (label: string, summary: string, cue: string, text: string, focus?: string): TeachingFrame =>
  ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'plant', ...(focus ? { focus } : {}) })
const compare = (label: string, summary: string, cue: string, text: string, differences = false): TeachingFrame =>
  ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'comparison', ...(differences ? { focus: 'differences' } : {}) })

export const teachingFrames: Record<string, TeachingFrame[]> = {
  'B1-02': [
    animal('Meet an animal cell', 'Your body is built from cells, and each cell has parts inside it.', 'one cell, many small parts',
      'Your body is built from millions of tiny living units called cells. Each cell has smaller parts inside it, and each part has a job. The parts inside a cell are called sub-cellular structures. The colours in this drawing help you tell the parts apart. They are not the real colours.'),
    animal('The cell membrane', 'A thin outer layer controls what goes in and out.', 'outer layer → in and out',
      'Every cell has a thin layer around its outside. Useful substances, such as oxygen, come in through it. Waste substances go out through it. This thin outer layer is called the cell membrane.', 'membrane'),
    animal('The cytoplasm', 'A jelly fills the cell, and many reactions happen in it.', 'jelly → chemical reactions',
      'Inside the membrane, the cell is filled with a jelly-like liquid. Many chemical reactions happen in it. These reactions keep the cell alive. This jelly is called the cytoplasm.', 'cytoplasm'),
    animal('The nucleus', 'One large part holds the instructions that control the cell.', 'instructions → control',
      'The cell’s instructions are called its genetic material. They control what the cell does. They are kept inside one large part, called the nucleus. So the membrane, cytoplasm and nucleus each do a different job.', 'nucleus'),
  ],
  'B1-05': [
    animal('Cells need energy', 'A cell releases energy from food, using oxygen.', 'food + oxygen → energy released',
      'A cell needs energy to move, grow and build new parts. It gets this energy from food, using oxygen. Releasing energy from food using oxygen is called aerobic respiration. Energy is released, not created.'),
    animal('Mitochondria', 'Aerobic respiration happens in small oval parts.', 'respiration happens here',
      'Aerobic respiration happens in small oval parts in the cytoplasm. So these parts release most of the cell’s energy. They are called mitochondria. One of them is called a mitochondrion.', 'mitochondria'),
    animal('Ribosomes', 'Tiny dots in the cytoplasm make proteins.', 'ribosomes → proteins',
      'Cells need proteins to build and repair their parts. Tiny dots in the cytoplasm join small pieces together to make proteins. These dots are called ribosomes. Making proteins is called protein synthesis.', 'ribosomes'),
    animal('Put the animal cell together', 'Five parts, five jobs.', 'name the part, then its job',
      'Membrane: controls what goes in and out. Cytoplasm: many reactions happen here. Nucleus: holds the genetic material and controls the cell. Mitochondria: aerobic respiration releases energy. Ribosomes: make proteins. These are the parts of a typical animal cell, but some specialised cells are different.'),
  ],
  'B1-42': [
    plant('Meet a plant cell', 'A plant cell has the same five parts, plus some new ones.', 'same five parts + new parts',
      'A plant cell has a membrane, cytoplasm, a nucleus, mitochondria and ribosomes. They do the same jobs as in an animal cell. Plants also make their own food, using light. Making food using light is called photosynthesis.'),
    plant('The cell wall', 'A strong layer outside the membrane supports the cell.', 'wall → strength and support',
      'Outside its membrane, a plant cell has a strong outer layer. It strengthens the cell and helps it keep its shape. This layer is called the cell wall. It is made of a tough material called cellulose. Animal cells have no cell wall.', 'wall'),
    plant('The permanent vacuole', 'A large space in the middle holds a watery liquid.', 'big space → cell sap',
      'The middle of a plant cell is a large space filled with liquid. The liquid is water with substances dissolved in it, called cell sap. The space is called the permanent vacuole. The cytoplasm is pushed out around its edge.', 'vacuole'),
    plant('Chloroplasts', 'Small green parts absorb light to make food.', 'light → chloroplast → food',
      'Photosynthesis happens in small green parts in the cytoplasm. They contain a green substance that absorbs light. So the plant can use light to make food. These green parts are called chloroplasts.', 'chloroplast'),
    plant('Not every plant cell has chloroplasts', 'Plant cells that get no light usually have no chloroplasts.', 'no light → usually no chloroplasts',
      'Root cells grow underground, in the dark. They cannot use light, so they usually have no chloroplasts. They are still plant cells, with a cell wall. Not every plant cell has chloroplasts.'),
    plant('Put the plant cell together', 'Five familiar parts, plus a wall, a vacuole and chloroplasts.', 'familiar parts + three new parts',
      'This leaf cell has the five parts an animal cell has. Its cell wall strengthens and supports it. Its permanent vacuole holds cell sap. Its chloroplasts absorb light for photosynthesis.'),
  ],
  'B1-41': [
    compare('What both cells have', 'Animal and plant cells share five parts.', 'same parts, same jobs',
      'Both cells have a membrane, cytoplasm, a nucleus, mitochondria and ribosomes. Each part does the same job in both cells. Plant cells need energy too, so they have mitochondria as well.'),
    compare('What only plant cells have', 'Only the plant cell has a wall, a permanent vacuole and chloroplasts.', 'wall, vacuole, chloroplasts',
      'Animal cells have no cell wall, no permanent vacuole and no chloroplasts. A root cell has no chloroplasts, but it is still a plant cell. So look for the wall and the vacuole too.', true),
    compare('Put it together: one part at a time', 'Name one part, then say what each cell has.', 'part → plant cell … animal cell …',
      'A good comparison talks about both cells. Name one part, then say whether each cell has it. For example: a plant cell has a cell wall, but an animal cell does not. This is called a paired comparison. Next, you will meet a very different kind of cell: a bacterium.', true),
  ],
}
