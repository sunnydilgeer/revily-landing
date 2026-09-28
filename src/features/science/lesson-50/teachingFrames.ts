import type { TeachingFrame } from '../teachingFrame'

// Follow the water round first, then what living things do with it, then decay, then the carbon cycle, which needs all three.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const cyclesFrames: Record<string, TeachingFrame[]> = {
  'B50-02': [
    f('Evaporation', 'The Sun’s energy turns water into water vapour.', 'liquid water → water vapour (a gas)', 'Energy from the Sun heats water in the sea, in lakes and on the land. The water turns into a gas, called water vapour, and rises into the air. This is called evaporation.', 'earth-water-evaporate'),
    f('Transpiration', 'Plants give off water vapour from their leaves.', 'roots → leaves → air', 'Plants take in water through their roots. Water evaporates from their leaves and escapes as water vapour. You met this when you learned how water moves through a plant. It is called transpiration.', 'earth-water-transpire'),
    f('Condensation', 'Rising water vapour cools and forms clouds.', 'warm vapour rises → cools → droplets', 'The warm water vapour is carried up into the sky. High up, the air is colder, so the water vapour cools. It turns back into tiny droplets of liquid water, which form clouds. This is called condensation.', 'earth-water-condense'),
    f('Precipitation', 'Water falls from the clouds.', 'clouds → ground', 'The droplets in a cloud join up and get bigger. When they are heavy enough, they fall to the ground. Water falling from clouds is called precipitation. It is usually rain, but it can be snow or hail.', 'earth-water-precip'),
    f('Run-off', 'Water flows off the land and back to the sea.', 'land → streams and rivers → sea', 'Some precipitation soaks into the soil. Water that is not absorbed flows over the land into streams and rivers. This is called run-off. The rivers drain back into the sea.', 'earth-water-runoff'),
    f('Round and round', 'The same water is used again and again.', 'no beginning, no end', 'Back in the sea, the water evaporates again. So the same water goes round and round, with no beginning or end. This is called the water cycle. Each time, precipitation brings fresh water to the land.', 'earth-water-cycle'),
  ],
  'B50-05': [
    f('Water for plants', 'Plants take in water from the soil.', 'soil → roots → leaves', 'Rain soaks into the soil. Plants take up this water through their roots. They need it for photosynthesis, which you met when you learned how plants make glucose.', 'earth-need-plant'),
    f('Water in food', 'Some water becomes part of the plant, and animals eat it.', 'plant eaten → water passed on', 'Some of the water becomes part of the plant’s tissues. When an animal eats the plant, it takes in that water too. Animals also get water by drinking.', 'earth-need-food'),
    f('Water for animals', 'Animals need water, and they return it in their waste.', 'animal → soil and air', 'Animals need water for the chemical reactions in their bodies. They return water to the soil and the air in their waste, such as urine and sweat. Then the water carries on round the water cycle.', 'earth-need-animal'),
  ],
  'B50-07': [
    f('Made of materials', 'Living things are built from materials around them.', 'soil → plant', 'Living things are made of materials they take from the world around them. For example, plant roots take in mineral ions from the soil. The plant uses them to make the molecules it is built from.', 'earth-decay-take'),
    f('Passed along', 'Eating passes the materials along the food chain.', 'plant → animal', 'When a rabbit eats the plant, the plant’s molecules pass into the rabbit. In this way, materials are passed along the food chain.', 'earth-decay-eat'),
    f('Back to the ground', 'Materials return in waste and when living things die.', 'waste and dead things → ground', 'Materials go back to the environment in waste, such as droppings. They also go back when living things die, such as leaves that fall from a plant.', 'earth-decay-return'),
    f('Decay', 'Microorganisms break down waste and dead material.', 'microorganisms break it down', 'Microorganisms, such as bacteria and fungi, live in the soil. They feed on waste and dead material, and break it down. This is called decay.', 'earth-decay-microbes'),
    f('Recycled', 'Decay puts mineral ions back for plants to use again.', 'taken in → returned → used again', 'Decay puts mineral ions back into the soil. Plants take them in again and use them to grow. So the materials are recycled, and they build new living things.', 'earth-decay-cycle'),
  ],
  'B50-10': [
    f('Into plants', 'Photosynthesis takes carbon dioxide out of the air.', 'carbon dioxide in the air → plant', 'Plants take in carbon dioxide from the air for photosynthesis. They use the carbon to make glucose. The glucose is used to make other substances that contain carbon, such as starch. These are called carbon compounds.', 'earth-carbon-photo'),
    f('Into animals', 'Eating passes the carbon compounds on.', 'plant → animal', 'When an animal eats a plant, it takes in the plant’s carbon compounds. So the carbon passes along the food chain.', 'earth-carbon-eat'),
    f('Back by respiration', 'Plants and animals release carbon dioxide when they respire.', 'plant and animal → carbon dioxide in the air', 'Plants and animals use glucose in respiration. Respiration releases carbon dioxide back into the air. You met respiration when you learned how living things transfer energy from glucose.', 'earth-carbon-resp'),
    f('Back by decay', 'Microorganisms release carbon dioxide as they break things down.', 'dead things and waste → microorganisms → carbon dioxide', 'Plants and animals die, and animals produce waste. Microorganisms break these down and use the carbon compounds in their own respiration. So they release carbon dioxide back into the air.', 'earth-carbon-decay'),
    f('Back by burning', 'Burning wood or fossil fuels releases carbon dioxide.', 'burning → carbon dioxide in the air', 'Coal and oil formed long ago from the remains of dead plants and animals. They are called fossil fuels. Burning fossil fuels, or wood, releases carbon dioxide into the air.', 'earth-carbon-burn'),
    f('The carbon cycle', 'Carbon goes round between the air and living things.', 'out of the air: photosynthesis; back: respiration, decay, burning', 'Carbon moves from the air into plants, into animals, and back to the air again. This is called the carbon cycle. In this cycle, photosynthesis takes carbon dioxide out of the air. Respiration, decay and burning put it back.', 'earth-carbon-cycle'),
  ],
}
