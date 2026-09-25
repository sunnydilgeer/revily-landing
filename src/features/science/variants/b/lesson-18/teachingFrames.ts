import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow the water all the way through before switching to food.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const plantTransportFrames: Record<string, TeachingFrame[]> = {
  'B18-02': [
    f('Leaves lose water', 'Water leaves the leaf as water vapour.', 'water vapour is water as a gas', 'Inside the leaf, water evaporates from the cells into the air gaps. The water vapour then escapes through the stomata. This loss of water from the leaves is called transpiration.', 'plant-stream-leaf'),
    f('Water is pulled up', 'The leaf replaces the water it lost.', 'lost at the top → pulled up', 'When the leaf loses water, more water moves in from the xylem to replace it. So water moves up the xylem in the stem, towards the leaves.', 'plant-stream-xylem'),
    f('Roots take in more', 'Root hair cells take in water from the soil.', 'more water in at the bottom', 'As water moves up, the roots take in more water from the soil. Root hair cells give a large surface for taking in water. You met them in Lesson 4.', 'plant-stream-roots'),
    f('A non-stop stream', 'Water flows from the roots to the leaves and out into the air.', 'roots → stem → leaves → air', 'This steady flow of water through the plant is called the transpiration stream. It also carries mineral ions from the soil up to the leaves.', 'plant-stream-all'),
  ],
  'B18-05': [
    f('Meet the guard cells', 'Each stoma has two guard cells around it.', 'guard cells = the doors', 'Guard cells change shape to open or close the stoma. This controls how much gas goes in and out, and how much water is lost.', 'plant-guard-cells'),
    f('Plenty of water: open', 'The guard cells swell and the stoma opens.', 'open → gases in, water out', 'When the plant has plenty of water, the guard cells swell up and bend apart. The stoma opens. Carbon dioxide gets in for photosynthesis, but water vapour also gets out.', 'plant-guard-open'),
    f('Short of water: closed', 'The guard cells go floppy and the stoma closes.', 'closed → water saved', 'When the plant is short of water, the guard cells lose water and go floppy. The stoma closes. This saves water, but less carbon dioxide can get in. The plant has to balance the two.', 'plant-guard-closed'),
    f('Most stomata are underneath', 'The underside of a leaf has more stomata than the top.', 'cooler and shaded → less water lost', 'The underside of a leaf is cooler and shaded from the Sun. Less water evaporates there. Having most stomata underneath helps the plant lose less water.', 'plant-guard-underside'),
  ],
  'B18-08': [
    f('The key idea', 'Water vapour moves from where there is lots to where there is less.', 'bigger difference → faster', 'There is lots of water vapour inside the leaf and usually less in the air outside. Water vapour moves out through the stomata. The bigger the difference, the faster it moves out.', 'plant-factor-key'),
    f('Warmer', 'Transpiration is faster when it is warmer.', 'more energy → faster evaporation', 'In warm conditions, water particles have more energy. Water evaporates and spreads out of the leaf faster.', 'plant-factor-warm'),
    f('Windier', 'Transpiration is faster when the air is moving.', 'wind carries vapour away', 'Moving air blows water vapour away from the leaf. The air next to the leaf stays dry, so the difference stays big.', 'plant-factor-wind'),
    f('More humid', 'Transpiration is slower when the air is humid.', 'humid air is already damp', 'Humidity means how much water vapour is already in the air. In humid air, there is only a small difference between inside and outside the leaf. So water vapour moves out slowly.', 'plant-factor-humid'),
    f('Brighter', 'Transpiration is faster in bright light.', 'light → stomata open', 'Stomata open in the light, so carbon dioxide can get in for photosynthesis. Open stomata let more water vapour out. In the dark, most stomata close.', 'plant-factor-light'),
  ],
  'B18-13': [
    f('Food on the move', 'Phloem carries sugar to where it is needed.', 'made in leaves → used or stored elsewhere', 'Leaves make sugar by photosynthesis. Phloem carries the sugar, dissolved in water, to growing tips, roots and food stores such as a potato. It can move up or down the plant. This is called translocation.', 'plant-food-map'),
    f('Compare the two', 'Xylem and phloem move different things.', 'water up; food both ways', 'Xylem carries water and mineral ions, and only upwards. This is part of the transpiration stream. Phloem carries dissolved sugar, both up and down. This is translocation.', 'plant-compare'),
  ],
}
