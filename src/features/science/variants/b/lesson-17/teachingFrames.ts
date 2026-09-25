import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// One new word per screen. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const plantTissueFrames: Record<string, TeachingFrame[]> = {
  'B17-02': [
    f('Meet a whole plant', 'A plant has roots, a stem and leaves.', 'three main parts', 'Roots hold the plant in the soil and take in water. The stem holds the plant up. Leaves make food. Each of these parts is an organ.', 'plant-whole'),
    f('Organs are made of tissues', 'A tissue is a group of similar cells doing one job.', 'cells → tissue → organ', 'A leaf is an organ. It contains several different tissues. Each tissue is made of similar cells, and each one does a different job for the leaf.', 'plant-ladder-tissue'),
    f('Organs work together', 'Roots, stem and leaves together form an organ system.', 'organs → organ system', 'Roots, stem and leaves work together to move water and food around the plant. Organs working together like this make an organ system.', 'plant-ladder-system'),
  ],
  'B17-04': [
    f('Where a plant grows', 'Plants grow at the tips of their shoots and roots.', 'new cells at the tips', 'The tips of shoots and roots contain meristem tissue. Its cells divide to make new cells, so the plant grows longer there. You met meristem in Lesson 5.', 'plant-meristem'),
  ],
  'B17-06': [
    f('Slice a leaf open', 'Inside a leaf there are layers of tissue.', 'layers, each with a job', 'If you cut across a leaf, you can see layers. Each layer is a tissue with its own job. The leaf’s main job is photosynthesis: making food using light.', 'plant-leaf-overview'),
    f('The top layer', 'The upper epidermis is a thin, clear skin.', 'clear → light gets through', 'The top layer is called the upper epidermis. It covers the leaf like a skin. It is clear, so light passes straight through to the cells below.', 'plant-leaf-upper'),
    f('The palisade layer', 'Tall cells packed with chloroplasts make most of the food.', 'near the top → most light', 'Palisade mesophyll cells are tall and packed tightly together. They are full of chloroplasts. They sit near the top of the leaf, where there is most light, so most photosynthesis happens here. Mesophyll means the middle of the leaf.', 'plant-leaf-palisade'),
    f('The spongy layer', 'Loosely packed cells leave air gaps between them.', 'air gaps → gases move', 'Spongy mesophyll cells are rounder and loosely packed. There are air gaps between them. Gases such as carbon dioxide spread through these gaps to reach the cells.', 'plant-leaf-spongy'),
    f('The bottom layer', 'The lower epidermis has tiny holes called stomata.', 'holes → gases in and out', 'The bottom layer is the lower epidermis. It has tiny holes called stomata. One hole is called a stoma. Gases go in and out through them. Two guard cells open and close each hole. You will learn more about them in the next lesson.', 'plant-leaf-lower'),
    f('Put the leaf together', 'Light comes in from the top. Carbon dioxide comes in from the bottom.', 'both meet in the middle', 'Light passes through the clear top layer. Carbon dioxide enters through the stomata and moves through the air gaps. Both reach the middle layers, where the leaf makes food.', 'plant-leaf-together'),
  ],
  'B17-11': [
    f('Veins link the leaf to the plant', 'Each vein contains xylem and phloem.', 'water in, food out', 'Xylem brings water and mineral ions up from the roots into the leaf. Mineral ions are minerals the plant needs, dissolved in the water. Phloem carries sugar made in the leaf out to the rest of the plant. You met xylem and phloem cells in Lesson 4.', 'plant-leaf-vein'),
    f('Zoom back out', 'Xylem and phloem run through the whole plant.', 'roots, stem and leaves are linked', 'Xylem and phloem run from the roots, up the stem and into every leaf. Water travels up in the xylem. Food travels in the phloem to the parts of the plant that need it.', 'plant-transport-map'),
  ],
}
