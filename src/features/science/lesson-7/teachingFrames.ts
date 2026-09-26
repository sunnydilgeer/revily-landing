import type { TeachingFrame } from '../teachingFrame'

// Follow one sandwich and build the body up once: cell → tissue → organ → organ system → organism.
// One new word per screen. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const organisationFrames: Record<string, TeachingFrame[]> = {
  'B7-02': [
    f('Follow a sandwich', 'You eat a sandwich, and it goes down to your stomach.', 'one bite → the stomach', 'You take a bite of a sandwich and swallow it. It travels down to your stomach. To see how your body deals with it, we will zoom right in, then build back up.', 'digestive-upper'),
    f('Start with one cell', 'The stomach wall is made of cells.', 'cells are the building blocks', 'Zoom in on the stomach wall and you see cells. Cells are the building blocks of every living thing. Many are specialised cells, with a shape that fits their job. You met these in Lesson 4.', 'muscle'),
    f('Similar cells team up', 'A group of similar cells doing one job is a tissue.', 'similar cells → one job', 'In the stomach wall, muscle cells lie side by side. They contract together to squeeze and churn the food. A group of similar cells doing one job is called a tissue. This one is muscle tissue.', 'organisation-tissue'),
    f('A lining tissue', 'Epithelial tissue lines the inside of the stomach.', 'similar cells → a lining', 'Other cells in the stomach fit tightly together to make a lining. They cover the inside surface, like tiles on a wall. This lining is called epithelial tissue.', 'epithelial'),
    f('One cell or a tissue?', 'One epithelial cell is a cell. The whole layer is a tissue.', 'one cell → many cells → tissue', 'One epithelial cell on its own is just a cell. Many similar epithelial cells joined in a layer make epithelial tissue. The tissue can do its job because all the cells work together.', 'epithelial-layer'),
  ],
  'B7-05': [
    f('The stomach has several tissues', 'The stomach wall has different tissues in layers.', 'different tissues → one wall', 'The stomach wall is not just one tissue. Epithelial tissue lines the inside, and muscle tissue wraps around it. There is also a tissue that makes digestive juice.', 'epithelial-layer'),
    f('Each tissue does part of the job', 'Each tissue helps with digestion in its own way.', 'churn + juice + lining', 'Muscle tissue churns the food. The juice-making tissue adds digestive juice, which starts to break the food down. Epithelial tissue covers and protects the inside of the stomach.', 'stomach-function'),
    f('Tissues team up', 'A group of different tissues working together is an organ.', 'different tissues → one job', 'These tissues work together to do one main job: digesting food. A group of different tissues working together for a job is called an organ. So the stomach is an organ.', 'stomach-organ'),
    f('Put the organ together', 'Cells make tissues. Tissues make an organ.', 'cell → tissue → organ', 'Similar cells make a tissue. Different tissues working together make an organ. So the stomach is an organ, not a tissue, because it has more than one kind of tissue.', 'organisation-organ'),
  ],
  'B7-08': [
    f('Down to the stomach', 'Food goes from the mouth, down the oesophagus, to the stomach.', 'mouth → oesophagus → stomach', 'You chew the sandwich in your mouth, then swallow. It moves down a tube called the oesophagus. It reaches the stomach, which churns it with digestive juice.', 'digestive-upper'),
    f('Into the small intestine', 'The small intestine takes digested food into the blood.', 'digested food → blood', 'Next, the food moves into the small intestine. Here, food is broken down into pieces small enough to pass into the blood. Taking digested food into the blood is called absorption.', 'digestive-intestines'),
    f('Into the large intestine', 'The large intestine absorbs water.', 'leftovers → water taken back', 'Some of the sandwich cannot be digested. These leftovers pass into the large intestine. Here, water is absorbed from the leftovers back into the body.', 'digestive-intestines'),
    f('Two helper organs', 'The liver and pancreas help, but food does not pass through them.', 'helpers add liquids', 'The liver makes bile, a liquid that goes into the small intestine. The pancreas makes digestive juice that also goes into the small intestine. Food never passes through these two organs.', 'digestive-system'),
    f('Put the route together', 'Each organ does a different part of the job.', 'no organ does it all', 'The sandwich goes through the mouth, oesophagus, stomach, small intestine and large intestine. The liver and pancreas add liquids along the way. No single organ does all of digestion.', 'digestive-route'),
  ],
  'B7-11': [
    f('Organs team up', 'A group of organs working together is an organ system.', 'organs → one bigger job', 'All the organs on the sandwich’s route, plus the liver and pancreas, work together. Their shared job is to digest food and absorb it. A group of organs working together is called an organ system. This one is the digestive system.', 'organisation-system'),
    f('Systems team up', 'A whole living thing is an organism.', 'organ systems → organism', 'Your body has other organ systems too, such as the one that moves blood around. All your organ systems work together to keep you alive. A whole living thing, like you, is called an organism.', 'organisation-whole'),
    f('Put the body together', 'Each level is built from the one before it.', 'smallest → largest', 'Your sandwich met every level. Muscle cells formed muscle tissue. Tissues formed the stomach, an organ. Organs formed the digestive system, and organ systems make you. The order is cell, tissue, organ, organ system, organism.', 'organisation-compare'),
    f('Explain a level', 'Say what it is made of, and that the parts work together.', 'made of + work together for a job', 'To explain why something is an organ, say it has different tissues working together for a job. For an organ system, say it has several organs working together. In the next lesson, you will see how enzymes do the chemical digestion.', 'organisation-organ'),
  ],
}
